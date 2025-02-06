import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// 告警规则验证Schema
const AlertRuleSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['error', 'performance', 'custom']),
  condition: z.string().min(1),
  threshold: z.number(),
  status: z.boolean().default(true),
  notifyChannels: z.string(), // 存储为JSON字符串
  emailReceivers: z.string() // 存储为JSON字符串
});

// 获取告警规则列表
router.get('/alerts/rules', async (_req: Request, res: Response) => {
  try {
    const rules = await prisma.alertRule.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 解析JSON字符串
    const parsedRules = rules.map(rule => ({
      ...rule,
      notifyChannels: JSON.parse(rule.notifyChannels),
      emailReceivers: JSON.parse(rule.emailReceivers)
    }));

    res.json({ success: true, data: parsedRules });
  } catch (error) {
    logger.error('Failed to fetch alert rules:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch alert rules' });
  }
});

// 创建告警规则
router.post('/alerts/rules', async (req: Request, res: Response) => {
  try {
    const validationResult = AlertRuleSchema.safeParse({
      ...req.body,
      notifyChannels: JSON.stringify(req.body.notifyChannels || []),
      emailReceivers: JSON.stringify(req.body.emailReceivers || [])
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid alert rule data',
        details: validationResult.error.errors
      });
    }

    const rule = await prisma.alertRule.create({
      data: validationResult.data
    });

    // 解析JSON字符串
    const parsedRule = {
      ...rule,
      notifyChannels: JSON.parse(rule.notifyChannels),
      emailReceivers: JSON.parse(rule.emailReceivers)
    };

    res.json({ success: true, data: parsedRule });
  } catch (error) {
    logger.error('Failed to create alert rule:', error);
    res.status(500).json({ success: false, error: 'Failed to create alert rule' });
  }
});

// 更新告警规则
router.put('/alerts/rules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.notifyChannels) {
      updateData.notifyChannels = JSON.stringify(updateData.notifyChannels);
    }
    if (updateData.emailReceivers) {
      updateData.emailReceivers = JSON.stringify(updateData.emailReceivers);
    }

    const validationResult = AlertRuleSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid alert rule data',
        details: validationResult.error.errors
      });
    }

    const rule = await prisma.alertRule.update({
      where: { id: parseInt(id) },
      data: validationResult.data
    });

    // 解析JSON字符串
    const parsedRule = {
      ...rule,
      notifyChannels: JSON.parse(rule.notifyChannels),
      emailReceivers: JSON.parse(rule.emailReceivers)
    };

    res.json({ success: true, data: parsedRule });
  } catch (error) {
    logger.error('Failed to update alert rule:', error);
    res.status(500).json({ success: false, error: 'Failed to update alert rule' });
  }
});

// 删除告警规则
router.delete('/alerts/rules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.alertRule.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete alert rule:', error);
    res.status(500).json({ success: false, error: 'Failed to delete alert rule' });
  }
});

// 获取告警历史
router.get('/alerts/history', async (req: Request, res: Response) => {
  try {
    const history = await prisma.alertHistory.findMany({
      include: { rule: true },
      orderBy: { triggeredAt: 'desc' }
    });

    // 解析JSON字符串
    const parsedHistory = history.map(item => ({
      ...item,
      rule: {
        ...item.rule,
        notifyChannels: JSON.parse(item.rule.notifyChannels),
        emailReceivers: JSON.parse(item.rule.emailReceivers)
      }
    }));

    res.json({ success: true, data: parsedHistory });
  } catch (error) {
    logger.error('Failed to fetch alert history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch alert history' });
  }
});

// 标记告警已解决
router.post('/alerts/history/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = await prisma.alertHistory.update({
      where: { id: parseInt(id) },
      data: {
        status: 'resolved',
        resolvedAt: new Date()
      }
    });

    res.json({ success: true, data: history });
  } catch (error) {
    logger.error('Failed to resolve alert:', error);
    res.status(500).json({ success: false, error: 'Failed to resolve alert' });
  }
});

export default router; 