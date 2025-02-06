interface BlankScreenConfig {
  wrapperElements?: string[];
  skippedElements?: string[];
  threshold?: number;
  timeout?: number;
}

const defaultConfig: BlankScreenConfig = {
  wrapperElements: ['html', 'body', '#app', '#root'],
  skippedElements: ['script', 'style', 'link', 'meta', 'head', 'title'],
  threshold: 0.1,
  timeout: 3000,
};

export class BlankScreenDetector {
  private config: BlankScreenConfig;
  private timer: NodeJS.Timeout | null = null;

  constructor(config: Partial<BlankScreenConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  public start(callback: (isBlank: boolean, data: any) => void): void {
    // 延迟检测，等待页面加载
    this.timer = setTimeout(() => {
      const isBlank = this.checkBlankScreen();
      if (isBlank) {
        const data = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
        };
        callback(true, data);
      }
    }, this.config.timeout);
  }

  public stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private checkBlankScreen(): boolean {
    const { wrapperElements, skippedElements, threshold } = this.config;
    
    // 获取视口中心点
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // 在中心点采样9个点
    const points = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        points.push([
          centerX + (i * 100),
          centerY + (j * 100),
        ]);
      }
    }

    // 检查每个采样点
    let emptyPoints = 0;
    points.forEach(([x, y]) => {
      const elements = document.elementsFromPoint(x, y);
      const validElements = elements.filter(element => {
        // 过滤掉需要跳过的元素
        if (skippedElements?.some(selector => 
          element.matches(selector))) {
          return false;
        }
        // 检查是否是容器元素
        if (wrapperElements?.some(selector => 
          element.matches(selector))) {
          return false;
        }
        return true;
      });

      if (validElements.length === 0) {
        emptyPoints++;
      }
    });

    // 计算空白点的比例
    const blankRatio = emptyPoints / points.length;
    return blankRatio >= (threshold || 0.1);
  }
}

export default function initBlankScreenDetection(
  config: Partial<BlankScreenConfig> = {},
  onBlankScreen: (data: any) => void
): () => void {
  const detector = new BlankScreenDetector(config);
  
  detector.start((isBlank, data) => {
    if (isBlank) {
      onBlankScreen(data);
    }
  });

  return () => detector.stop();
} 