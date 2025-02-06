import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface NotificationPayload {
  title: string;
  content: string;
  type: 'error' | 'performance' | 'custom';
  level: 'info' | 'warning' | 'error';
  timestamp: Date;
  metadata?: Record<string, any>;
}

class Notifier {
  private emailTransporter: nodemailer.Transporter;
  private readonly emailConfig: EmailConfig;

  constructor() {
    // 从环境变量获取邮件配置
    this.emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.qq.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    // 创建邮件传输器
    this.emailTransporter = nodemailer.createTransport(this.emailConfig);
  }

  // 发送邮件通知
  async sendEmailNotification(
    to: string[],
    payload: NotificationPayload
  ): Promise<boolean> {
    try {
      const { title, content, type, level, timestamp, metadata } = payload;

      // 构建邮件HTML内容
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${this.getLevelColor(level)};">${title}</h2>
          <p style="color: #666;">${content}</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>类型：</strong>${type}</p>
            <p><strong>级别：</strong>${level}</p>
            <p><strong>时间：</strong>${timestamp.toLocaleString()}</p>
            ${metadata ? `<p><strong>详细信息：</strong><pre>${JSON.stringify(metadata, null, 2)}</pre></p>` : ''}
          </div>
          <div style="color: #999; font-size: 12px; margin-top: 20px;">
            此邮件由监控系统自动发送，请勿回复。
          </div>
        </div>
      `;

      // 发送邮件
      const info = await this.emailTransporter.sendMail({
        from: this.emailConfig.auth.user,
        to: to.join(','),
        subject: `[监控告警] ${title}`,
        html,
      });

      logger.info(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email notification:', error);
      return false;
    }
  }

  // 获取不同级别对应的颜色
  private getLevelColor(level: string): string {
    switch (level) {
      case 'error':
        return '#ff4d4f';
      case 'warning':
        return '#faad14';
      case 'info':
        return '#1890ff';
      default:
        return '#000000';
    }
  }

  // 验证邮件配置
  async verifyEmailConfig(): Promise<boolean> {
    try {
      await this.emailTransporter.verify();
      return true;
    } catch (error) {
      logger.error('Email configuration verification failed:', error);
      return false;
    }
  }
}

// 创建单例实例
export const notifier = new Notifier();
export default notifier; 