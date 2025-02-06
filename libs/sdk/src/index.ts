import { v4 as uuidv4 } from 'uuid';
import initBlankScreenDetection from './plugins/blankScreen';
import initPerformanceMonitoring from './plugins/performance';

interface EventParams {
  [key: string]: any;
}

interface SDKConfig {
  projectId: string;
  uploadPercent?: number;
  serverUrl?: string;
  enableBlankScreen?: boolean;
  enablePerformance?: boolean;
}

interface CommonParams {
  [key: string]: any;
}

class TrackSDK {
  private config: SDKConfig;
  private commonParams: CommonParams = {};
  private userId: string;
  private eventQueue: any[] = [];
  private isProcessingQueue = false;
  private queueTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.userId = this.getOrCreateUserId();
    this.config = {
      projectId: '',
      uploadPercent: 1,
      serverUrl: 'http://localhost:8000',
      enableBlankScreen: true,
      enablePerformance: true
    };
  }

  private getOrCreateUserId(): string {
    const storedId = localStorage.getItem('track_uid');
    if (storedId) return storedId;
    
    const newId = uuidv4();
    localStorage.setItem('track_uid', newId);
    return newId;
  }

  private getUserEnvironment() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      platform: navigator.platform
    };
  }

  public init(config: SDKConfig) {
    this.config = { ...this.config, ...config };
    
    // 注册错误捕获
    window.addEventListener('error', (event) => {
      this.sendEvent('error', {
        message: event.error?.message,
        stack: event.error?.stack,
        type: 'error'
      });
    });

    // 注册Promise错误捕获
    window.addEventListener('unhandledrejection', (event) => {
      this.sendEvent('error', {
        message: event.reason?.message,
        stack: event.reason?.stack,
        type: 'unhandledrejection'
      });
    });

    // 初始化白屏检测
    if (this.config.enableBlankScreen) {
      initBlankScreenDetection({
        timeout: 3000,
        threshold: 0.1,
      }, (data) => {
        this.sendEvent('blank_screen', data);
      });
    }

    // 初始化性能监控
    if (this.config.enablePerformance) {
      initPerformanceMonitoring({
        sampleRate: this.config.uploadPercent,
      }, (metrics) => {
        this.sendEvent('performance', metrics);
      });
    }

    return this;
  }

  public addCommonParams(params: CommonParams) {
    this.commonParams = { ...this.commonParams, ...params };
    return this;
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const events = this.eventQueue.splice(0, 10); // 每次处理10条

    try {
      await fetch(`${this.config.serverUrl}/api/events/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(events)
      });
    } catch (error) {
      // 失败时将事件放回队列
      this.eventQueue.unshift(...events);
      console.error('Failed to process event queue:', error);
    }

    this.isProcessingQueue = false;
    
    // 如果队列中还有事件，继续处理
    if (this.eventQueue.length > 0) {
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  public async sendEvent(eventName: string, params: EventParams = {}) {
    // 采样判断
    if (Math.random() > (this.config.uploadPercent || 1)) {
      return;
    }

    const eventData = {
      event_name: eventName,
      project_id: this.config.projectId,
      user_id: this.userId,
      params: {
        ...params,
        ...this.commonParams
      },
      environment: this.getUserEnvironment()
    };

    // 添加到队列
    this.eventQueue.push(eventData);

    // 清除之前的定时器
    if (this.queueTimer) {
      clearTimeout(this.queueTimer);
    }

    // 设置新的定时器，100ms后处理队列
    this.queueTimer = setTimeout(() => {
      this.processQueue();
    }, 100);

    return eventData;
  }
}

export const trackSDK = new TrackSDK();
export default trackSDK; 