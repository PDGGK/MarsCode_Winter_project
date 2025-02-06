import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { notifier } from '../utils/notifier';

const prisma = new PrismaClient();

interface AlertCondition {
  metric: string;
  operator: '>' | '<' | '==' | '>=' | '<=';
  value: number;
}

class AlertTrigger {
  // 检查错误告警
  async checkErrorAlerts(errorCount: number, timeWindow: number = 5) {
    try {
      // 获取所有启用的错误告警规则
      const rules = await prisma.alertRule.findMany({
        where: {
          type: 'error',
          status: true,
        },
      });

      for (const rule of rules) {
        const condition = JSON.parse(rule.condition) as AlertCondition;
        const threshold = rule.threshold;

        // 检查是否触发告警条件
        if (this.evaluateCondition(condition, errorCount)) {
          // 创建告警历史记录
          const alertHistory = await prisma.alertHistory.create({
            data: {
              ruleId: rule.id,
              message: `检测到${errorCount}个错误，超过阈值${threshold}`,
              status: 'triggered',
            },
          });

          // 发送邮件通知
          const emailReceivers = JSON.parse(rule.emailReceivers);
          if (emailReceivers && emailReceivers.length > 0) {
            await notifier.sendEmailNotification(emailReceivers, {
              title: `错误告警: ${rule.name}`,
              content: `在过去${timeWindow}分钟内检测到${errorCount}个错误，超过阈值${threshold}`,
              type: 'error',
              level: 'error',
              timestamp: new Date(),
              metadata: {
                ruleName: rule.name,
                errorCount,
                threshold,
                timeWindow,
              },
            });
          }
        }
      }
    } catch (error) {
      logger.error('Failed to check error alerts:', error);
    }
  }

  // 检查性能告警
  async checkPerformanceAlerts(metric: string, value: number) {
    try {
      // 获取所有启用的性能告警规则
      const rules = await prisma.alertRule.findMany({
        where: {
          type: 'performance',
          status: true,
        },
      });

      for (const rule of rules) {
        const condition = JSON.parse(rule.condition) as AlertCondition;
        if (condition.metric === metric && this.evaluateCondition(condition, value)) {
          // 创建告警历史记录
          const alertHistory = await prisma.alertHistory.create({
            data: {
              ruleId: rule.id,
              message: `性能指标${metric}的值为${value}，${condition.operator}${condition.value}`,
              status: 'triggered',
            },
          });

          // 发送邮件通知
          const emailReceivers = JSON.parse(rule.emailReceivers);
          if (emailReceivers && emailReceivers.length > 0) {
            await notifier.sendEmailNotification(emailReceivers, {
              title: `性能告警: ${rule.name}`,
              content: `性能指标${metric}的值为${value}，${condition.operator}${condition.value}`,
              type: 'performance',
              level: 'warning',
              timestamp: new Date(),
              metadata: {
                ruleName: rule.name,
                metric,
                value,
                condition,
              },
            });
          }
        }
      }
    } catch (error) {
      logger.error('Failed to check performance alerts:', error);
    }
  }

  // 评估告警条件
  private evaluateCondition(condition: AlertCondition, value: number): boolean {
    switch (condition.operator) {
      case '>':
        return value > condition.value;
      case '<':
        return value < condition.value;
      case '==':
        return value === condition.value;
      case '>=':
        return value >= condition.value;
      case '<=':
        return value <= condition.value;
      default:
        return false;
    }
  }

  // 解决告警
  async resolveAlert(alertId: number) {
    try {
      const alert = await prisma.alertHistory.update({
        where: { id: alertId },
        data: {
          status: 'resolved',
          resolvedAt: new Date(),
        },
        include: {
          rule: true,
        },
      });

      // 发送告警解决通知
      const emailReceivers = JSON.parse(alert.rule.emailReceivers);
      if (emailReceivers && emailReceivers.length > 0) {
        await notifier.sendEmailNotification(emailReceivers, {
          title: `告警已解决: ${alert.rule.name}`,
          content: `告警"${alert.message}"已被标记为已解决`,
          type: alert.rule.type as any,
          level: 'info',
          timestamp: new Date(),
          metadata: {
            ruleName: alert.rule.name,
            alertId: alert.id,
            resolvedAt: alert.resolvedAt,
          },
        });
      }

      return alert;
    } catch (error) {
      logger.error('Failed to resolve alert:', error);
      throw error;
    }
  }
}

export const alertTrigger = new AlertTrigger();
export default alertTrigger; 