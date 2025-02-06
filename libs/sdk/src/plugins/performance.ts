interface PerformanceMetrics {
  FP?: number;    // First Paint
  FCP?: number;   // First Contentful Paint
  LCP?: number;   // Largest Contentful Paint
  FID?: number;   // First Input Delay
  CLS?: number;   // Cumulative Layout Shift
  TTFB?: number;  // Time to First Byte
  domLoad?: number;
  windowLoad?: number;
}

interface PerformanceConfig {
  sampleRate?: number;
  reportCallback: (metrics: PerformanceMetrics) => void;
}

export class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics = {};

  constructor(config: PerformanceConfig) {
    this.config = {
      sampleRate: 1,
      ...config
    };
  }

  public start(): void {
    // 采样判断
    if (Math.random() > (this.config.sampleRate || 1)) {
      return;
    }

    this.collectNavigationTiming();
    this.collectPaintTiming();
    this.observeLayoutShift();
    this.observeLargestContentfulPaint();
    this.observeFirstInput();
  }

  private collectNavigationTiming(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      this.metrics.domLoad = navigation.domContentLoadedEventEnd - navigation.requestStart;
      this.metrics.windowLoad = navigation.loadEventEnd - navigation.requestStart;
      
      this.reportMetrics();
    }
  }

  private collectPaintTiming(): void {
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        this.metrics.FP = entry.startTime;
      }
      if (entry.name === 'first-contentful-paint') {
        this.metrics.FCP = entry.startTime;
      }
    });
    
    this.reportMetrics();
  }

  private observeLayoutShift(): void {
    let cumulativeLayoutShift = 0;

    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cumulativeLayoutShift += (entry as any).value;
        }
      }
      
      this.metrics.CLS = cumulativeLayoutShift;
      this.reportMetrics();
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private observeLargestContentfulPaint(): void {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.startTime;
      this.reportMetrics();
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFirstInput(): void {
    const observer = new PerformanceObserver(list => {
      const entry = list.getEntries()[0];
      this.metrics.FID = entry.processingStart - entry.startTime;
      this.reportMetrics();
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  private reportMetrics(): void {
    // 上报性能指标
    this.config.reportCallback(this.metrics);
  }
}

export default function initPerformanceMonitoring(
  config: Omit<PerformanceConfig, 'reportCallback'>,
  onMetrics: (metrics: PerformanceMetrics) => void
): void {
  const monitor = new PerformanceMonitor({
    ...config,
    reportCallback: onMetrics
  });
  
  monitor.start();
} 