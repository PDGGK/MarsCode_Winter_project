import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// 常量定义
const MAX_BATCH_SIZE = 100;
const MAX_QUERY_RANGE_DAYS = 30;
const DEFAULT_PAGE_SIZE = 20;

// 速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100个请求
  message: { success: false, error: 'Too many requests, please try again later.' }
});

// 数据验证Schema
const EventSchema = z.object({
  event_name: z.string().min(1),
  project_id: z.string().min(1),
  user_id: z.string().min(1),
  params: z.record(z.any()).nullable().optional(),
  environment: z.record(z.any()).nullable().optional(),
});

const QueryParamsSchema = z.object({
  project_id: z.string().optional(),
  event_name: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().max(100).optional(),
});

// 类型定义
interface Event {
  id: number;
  eventName: string;
  projectId: string;
  userId: string;
  params: string | null;
  environment: string | null;
  createdAt: Date;
}

interface PerformanceEvent {
  params: string | null;
  createdAt: Date;
}

interface PerfMetric {
  sum: number;
  count: number;
  min: number;
  max: number;
}

interface AvgPerfMetric {
  avg: number;
  min: number;
  max: number;
  count: number;
}

interface PerfMetrics {
  [key: string]: PerfMetric;
}

interface AvgPerfMetrics {
  [key: string]: AvgPerfMetric;
}

// 工具函数
const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= MAX_QUERY_RANGE_DAYS && diffDays >= 0;
};

const safeJsonStringify = (data: any): string | null => {
  try {
    return data ? JSON.stringify(data) : null;
  } catch (error) {
    logger.error('Failed to stringify data:', error);
    return null;
  }
};

// 路由处理器
// 创建单个事件
router.post('/api/events', apiLimiter, async (req: Request, res: Response) => {
  try {
    const validationResult = EventSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event data',
        details: validationResult.error.errors
      });
    }

    const { event_name, project_id, user_id, params, environment } = validationResult.data;

    const event = await prisma.event.create({
      data: {
        eventName: event_name,
        projectId: project_id,
        userId: user_id,
        params: safeJsonStringify(params),
        environment: safeJsonStringify(environment),
        createdAt: new Date()
      }
    });

    res.json({ success: true, data: event });
  } catch (error) {
    logger.error('Failed to create event:', error);
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

// 批量创建事件
router.post('/api/events/batch', apiLimiter, async (req: Request, res: Response) => {
  try {
    const events = req.body;
    if (!Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        error: 'Request body should be an array of events'
      });
    }

    if (events.length > MAX_BATCH_SIZE) {
      return res.status(400).json({
        success: false,
        error: `Batch size cannot exceed ${MAX_BATCH_SIZE}`
      });
    }

    // 验证所有事件
    const validationResults = events.map(event => EventSchema.safeParse(event));
    const invalidEvents = validationResults.filter(result => !result.success);
    if (invalidEvents.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid events in batch',
        details: invalidEvents.map(result => (result as z.SafeParseError<any>).error.errors)
      });
    }

    const validEvents = validationResults.map(result => (result as z.SafeParseSuccess<any>).data);

    const createdEvents = await prisma.$transaction(
      validEvents.map(event =>
        prisma.event.create({
          data: {
            eventName: event.event_name,
            projectId: event.project_id,
            userId: event.user_id,
            params: safeJsonStringify(event.params),
            environment: safeJsonStringify(event.environment),
            createdAt: new Date()
          }
        })
      )
    );

    res.json({ success: true, data: createdEvents });
  } catch (error) {
    logger.error('Failed to create events in batch:', error);
    res.status(500).json({ success: false, error: 'Failed to create events in batch' });
  }
});

// 获取事件列表
router.get('/api/events', async (req: Request, res: Response) => {
  try {
    const queryParams = QueryParamsSchema.safeParse({
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      page_size: req.query.page_size ? parseInt(req.query.page_size as string) : DEFAULT_PAGE_SIZE
    });

    if (!queryParams.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: queryParams.error.errors
      });
    }

    const { project_id, event_name, start_date, end_date } = queryParams.data;
    const page = queryParams.data.page || 1;
    const page_size = queryParams.data.page_size || DEFAULT_PAGE_SIZE;

    // 验证日期范围
    if (start_date && end_date) {
      const startDateTime = new Date(start_date);
      const endDateTime = new Date(end_date);
      if (!validateDateRange(startDateTime, endDateTime)) {
        return res.status(400).json({
          success: false,
          error: `Date range cannot exceed ${MAX_QUERY_RANGE_DAYS} days`
        });
      }
    }

    // 构建查询条件
    const where = {} as Prisma.EventWhereInput;
    if (project_id) where.projectId = project_id;
    if (event_name) where.eventName = event_name;
    if (start_date && end_date) {
      where.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      };
    }

    // 使用游标分页
    const skip = (page - 1) * page_size;
    const [total, events] = await prisma.$transaction([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: page_size,
        skip
      })
    ]);

    // 解析JSON字符串
    const parsedEvents = events.map((event: Event) => ({
      ...event,
      params: event.params ? JSON.parse(event.params) : null,
      environment: event.environment ? JSON.parse(event.environment) : null
    }));

    res.json({
      success: true,
      data: parsedEvents,
      pagination: {
        total,
        page,
        page_size,
        total_pages: Math.ceil(total / page_size)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch events:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

// 获取事件统计
router.get('/api/events/stats', async (req: Request, res: Response) => {
  try {
    const queryParams = QueryParamsSchema.safeParse({
      ...req.query,
      page: 1,
      page_size: DEFAULT_PAGE_SIZE
    });

    if (!queryParams.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: queryParams.error.errors
      });
    }

    const { project_id, event_name, start_date, end_date } = queryParams.data;

    // 验证日期范围
    if (start_date && end_date) {
      const startDateTime = new Date(start_date);
      const endDateTime = new Date(end_date);
      if (!validateDateRange(startDateTime, endDateTime)) {
        return res.status(400).json({
          success: false,
          error: `Date range cannot exceed ${MAX_QUERY_RANGE_DAYS} days`
        });
      }
    }

    // 构建查询条件
    const where = {} as Prisma.EventWhereInput;
    if (project_id) where.projectId = project_id;
    if (event_name) where.eventName = event_name;
    if (start_date && end_date) {
      where.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      };
    }

    // 使用数据库聚合查询
    const [totalEvents, uniqueUsers, errorEvents] = await prisma.$transaction([
      // 总事件数
      prisma.event.count({ where }),
      
      // 独立用户数
      prisma.event.groupBy({
        by: ['userId'],
        where,
        _count: true,
        orderBy: {
          userId: 'asc'
        }
      }),

      // 错误事件统计
      prisma.event.findMany({
        where: {
          ...where,
          params: {
            contains: 'error'
          }
        },
        select: {
          params: true,
          createdAt: true
        }
      })
    ]);

    // 获取性能统计数据
    const performanceStats = await prisma.event.findMany({
      where: {
        ...where,
        params: {
          contains: 'performance'
        }
      },
      select: {
        params: true,
        createdAt: true
      }
    });

    // 处理性能统计数据
    const perfMetrics = performanceStats.reduce<PerfMetrics>((acc: PerfMetrics, curr: PerformanceEvent) => {
      const params = curr.params ? JSON.parse(curr.params) : {};
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'number') {
          if (!acc[key]) {
            acc[key] = { sum: 0, count: 0, min: value, max: value };
          }
          acc[key].sum += value;
          acc[key].count += 1;
          acc[key].min = Math.min(acc[key].min, value);
          acc[key].max = Math.max(acc[key].max, value);
        }
      });
      return acc;
    }, {} as PerfMetrics);

    type PerfMetricEntry = [string, PerfMetric];
    const avgPerfMetrics = Object.entries(perfMetrics).reduce<AvgPerfMetrics>((acc: AvgPerfMetrics, entry: PerfMetricEntry) => {
      const [key, value] = entry;
      acc[key] = {
        avg: value.sum / value.count,
        min: value.min,
        max: value.max,
        count: value.count
      };
      return acc;
    }, {} as AvgPerfMetrics);

    res.json({
      success: true,
      data: {
        total_events: totalEvents,
        unique_users: uniqueUsers.length,
        error_count: errorEvents.length,
        performance_metrics: avgPerfMetrics,
        time_range: start_date && end_date ? {
          start: start_date,
          end: end_date
        } : null
      }
    });
  } catch (error) {
    logger.error('Failed to fetch event stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch event stats' });
  }
});

export default router; 