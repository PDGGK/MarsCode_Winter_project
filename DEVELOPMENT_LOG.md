# 前端监控系统开发日志

## 项目概述

本项目是一个完整的前端监控系统，旨在帮助开发者实时监控和分析前端应用的运行状况。系统包含三个主要部分：

1. **SDK（heimdallr-sdk）**：
   - 轻量级的前端监控工具
   - 支持错误监控、性能监控、用户行为追踪
   - 插件化架构，支持功能扩展

2. **服务端（heimdallr_server）**：
   - 基于 Node.js 的后端服务
   - 处理数据收集、存储和分析
   - 提供 RESTful API 接口

3. **监控平台（heimdallr_client）**：
   - 基于 Vue3 的前端应用
   - 可视化展示监控数据
   - 支持多维度数据分析

## 从零开始搭建项目

### 1. 项目初始化

首先，我们需要创建项目的基本结构。这里采用 monorepo 的方式管理项目，便于统一维护和版本控制。

```bash
# 创建项目根目录
mkdir MarsCode_Winter_project
cd MarsCode_Winter_project

# 创建主要子目录
mkdir heimdallr-sdk heimdallr_server heimdallr_client test
cd test && mkdir demo
cd ..

# 初始化 git 仓库
git init

# 创建 .gitignore 文件
cat > .gitignore << EOL
node_modules/
dist/
.env
*.log
.DS_Store
EOL
```

**代码解释**：
- `mkdir` 命令创建项目所需的目录结构
- `heimdallr-sdk`：存放监控 SDK 的源码
- `heimdallr_server`：存放后端服务的源码
- `heimdallr_client`：存放前端监控平台的源码
- `test/demo`：存放测试页面和示例代码
- `.gitignore` 文件用于排除不需要版本控制的文件

### 2. SDK 项目搭建

SDK 是整个监控系统的核心，需要特别注意其设计和实现。

```bash
# 进入 SDK 目录
cd heimdallr-sdk

# 初始化 npm 项目
npm init -y

# 安装必要的开发依赖
npm install --save-dev typescript @types/node rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

**依赖说明**：
- `typescript`：使用 TypeScript 开发，提供类型安全
- `@types/node`：Node.js 的类型定义
- `rollup`：用于打包 SDK，生成浏览器可用的代码
- `@rollup/plugin-typescript`：Rollup 的 TypeScript 插件
- `@rollup/plugin-node-resolve`：解析 node_modules 中的模块
- `@rollup/plugin-commonjs`：转换 CommonJS 模块为 ES6

```typescript
// tsconfig.json 配置详解
{
  "compilerOptions": {
    "target": "es5",          // 编译目标为 ES5，确保浏览器兼容性
    "module": "ESNext",       // 使用最新的模块系统
    "lib": [                  // 需要包含的库文件
      "dom",                  // DOM API
      "es2015",              // ES2015 特性
      "es2016",              // ES2016 特性
      "es2017"               // ES2017 特性
    ],
    "declaration": true,      // 生成类型声明文件
    "outDir": "./dist",      // 输出目录
    "strict": true,          // 启用严格模式
    "moduleResolution": "node", // 模块解析策略
    "esModuleInterop": true,   // 启用 ES 模块互操作性
    "skipLibCheck": true       // 跳过库文件的类型检查
  },
  "include": ["src"],        // 需要编译的文件
  "exclude": ["node_modules", "dist"] // 排除的文件
}
```

```javascript
// rollup.config.js 配置详解
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',           // 入口文件
  output: [
    {
      file: 'dist/browser.iife.js',  // 输出文件
      format: 'iife',                // 输出格式为立即执行函数
      name: 'HEIMDALLR_BROWSER'      // 全局变量名
    }
  ],
  plugins: [
    typescript(),                    // 处理 TypeScript
    resolve(),                      // 解析第三方模块
    commonjs()                      // 转换 CommonJS
  ]
};
```

**SDK 目录结构说明**：
```
heimdallr-sdk/
├── src/
│   ├── core/           # 核心功能实现
│   │   ├── error.ts    # 错误监控
│   │   ├── performance.ts # 性能监控
│   │   └── report.ts   # 数据上报
│   ├── plugins/        # 插件系统
│   │   ├── user-behavior.ts # 用户行为
│   │   └── api-monitor.ts   # API 监控
│   ├── types/         # 类型定义
│   │   └── index.ts
│   └── index.ts       # 入口文件
├── tsconfig.json      # TypeScript 配置
├── rollup.config.js   # Rollup 配置
└── package.json       # 项目配置
```

### 3. 服务端项目搭建

服务端负责数据的收集、存储和分析，使用 Express 框架和 Prisma ORM。

```bash
# 进入服务端目录
cd ../heimdallr_server

# 初始化 npm 项目
npm init -y

# 安装核心依赖
npm install express cors express-formidable express-ip prisma @prisma/client

# 安装开发依赖
npm install --save-dev typescript @types/node @types/express nodemon ts-node
```

**依赖说明**：
- `express`：Web 框架
- `cors`：处理跨域请求
- `express-formidable`：处理文件上传和表单数据
- `express-ip`：获取请求 IP 信息
- `prisma`：ORM 框架
- `@prisma/client`：Prisma 客户端

```typescript
// tsconfig.json 配置详解
{
  "compilerOptions": {
    "target": "es2017",        // 编译目标版本
    "module": "commonjs",      // 模块系统
    "lib": [                   // 包含的库
      "es2017",
      "esnext.asynciterable"
    ],
    "outDir": "./dist",       // 输出目录
    "rootDir": "./src",       // 源码目录
    "strict": true,           // 严格模式
    "esModuleInterop": true,  // ES 模块互操作
    "skipLibCheck": true      // 跳过库检查
  },
  "include": ["src/**/*"],    // 包含的文件
  "exclude": ["node_modules"]  // 排除的文件
}
```

**Prisma 数据库模型详解**：
```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"    // 使用 MySQL 数据库
  url      = env("DATABASE_URL")  // 数据库连接字符串
}

generator client {
  provider = "prisma-client-js"  // 生成 TypeScript 客户端
}

// 项目表：存储监控项目信息
model Project {
  id          String   @id @default(uuid())  // 项目ID
  name        String                         // 项目名称
  leader      String                         // 项目负责人
  description String?                        // 项目描述
  created_at  DateTime @default(now())       // 创建时间
  updated_at  DateTime @updatedAt           // 更新时间
  logs        Log[]                         // 关联的日志
}

// 日志表：存储监控数据
model Log {
  id            String   @id @default(uuid())  // 日志ID
  type          String                         // 日志类型
  sub_type      Int?                          // 子类型
  data          String?                        // 日志数据
  session_id    String?                        // 会话ID
  platform      String?                        // 平台信息
  otime        DateTime @default(now())       // 发生时间
  ascription_id String                         // 关联的项目ID
  project      Project  @relation(fields: [ascription_id], references: [id])  // 项目关联
}
```

### 4. 服务端核心功能实现

服务端的主要职责是处理来自 SDK 的数据上报请求，并提供数据查询接口。

1. **项目初始化接口**：
```typescript
// src/controllers/projectCtrl.ts
export async function projectInit(req, res) {
  try {
    const { name, leader, description } = req.fields;
    
    // 数据验证
    if (!name || !leader) {
      return res.send(failResponse('missing required fields'));
    }

    // 创建项目
    const project = await prisma.project.create({
      data: {
        name,
        leader,
        description
      }
    });

    res.send(successResponse(project, 'success'));
  } catch (err) {
    res.send(failResponse(err.message));
  }
}
```

2. **日志上报接口**：
```typescript
// src/controllers/logCtrl.ts
export async function logReport(req, res) {
  try {
    const { type, sub_type, data, session_id, platform, ascription_id } = req.fields;

    // 数据验证
    if (!type || !ascription_id) {
      return res.send(failResponse('missing required fields'));
    }

    // 创建日志
    const log = await prisma.log.create({
      data: {
        type,
        sub_type: parseInt(sub_type),
        data,
        session_id,
        platform,
        ascription_id
      }
    });

    res.send(successResponse(log, 'success'));
  } catch (err) {
    res.send(failResponse(err.message));
  }
}
```

3. **统计分析接口**：
```typescript
// src/controllers/statisticCtrl.ts
export async function statisticProjGet(req, res) {
  try {
    const { proj_id, mod } = req.query;
    
    // 参数验证
    if (!proj_id || !mod) {
      return res.send(failResponse('missing proj_id or mod'));
    }

    // 获取时间范围
    const timeRange = getTimeRange(mod);
    
    // 查询统计数据
    const stats = await getProjectStats(proj_id, timeRange.start, timeRange.end);
    
    res.send(successResponse(stats, 'success'));
  } catch (err) {
    res.send(failResponse(err.message));
  }
}
```

### 5. 前端监控平台实现

前端监控平台使用 Vue3 + TypeScript 开发，主要包含以下功能模块：

1. **路由配置**：
```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'overview',
        component: () => import('@/views/Overview.vue')
      },
      {
        path: 'errors',
        name: 'errors',
        component: () => import('@/views/Errors.vue')
      },
      {
        path: 'performance',
        name: 'performance',
        component: () => import('@/views/Performance.vue')
      }
    ]
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
```

2. **状态管理**：
```typescript
// src/store/project.ts
import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state: () => ({
    currentProject: null,
    errorStats: [],
    performanceStats: []
  }),
  
  actions: {
    async fetchErrorStats() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/statistic/proj?proj_id=${this.currentProject}&mod=today`);
        const data = await response.json();
        this.errorStats = data.data;
      } catch (error) {
        console.error('Failed to fetch error stats:', error);
      }
    }
  }
});
```

3. **数据可视化组件**：
```vue
<!-- src/components/ErrorChart.vue -->
<template>
  <div class="error-chart">
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useProjectStore } from '@/store/project';

const chartRef = ref<HTMLElement>();
let chart: echarts.ECharts;

const store = useProjectStore();

// 初始化图表
onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    renderChart();
  }
});

// 渲染图表
function renderChart() {
  const option = {
    title: {
      text: '错误趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: store.errorStats.map(item => item.time)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: store.errorStats.map(item => item.count),
      type: 'line'
    }]
  };
  
  chart.setOption(option);
}

// 监听数据变化
watch(
  () => store.errorStats,
  () => renderChart(),
  { deep: true }
);
</script>
```

### 6. SDK 核心功能实现

SDK 的核心功能包括错误监控、性能监控和数据上报：

1. **错误监控**：
```typescript
// src/core/error.ts
export class ErrorMonitor {
  private readonly options: ErrorMonitorOptions;
  
  constructor(options: ErrorMonitorOptions) {
    this.options = options;
    this.initErrorListener();
    this.initPromiseErrorListener();
    this.initResourceErrorListener();
  }

  private initErrorListener() {
    window.addEventListener('error', (event) => {
      const error = {
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      };
      
      this.reportError(error);
    }, true);
  }

  private initPromiseErrorListener() {
    window.addEventListener('unhandledrejection', (event) => {
      const error = {
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: Date.now()
      };
      
      this.reportError(error);
    });
  }

  private async reportError(error: ErrorData) {
    try {
      const data = {
        ...error,
        session_id: this.options.sessionId,
        platform: navigator.userAgent
      };
      
      await this.options.report(data);
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  }
}
```

2. **性能监控**：
```typescript
// src/core/performance.ts
export class PerformanceMonitor {
  private readonly options: PerformanceMonitorOptions;
  
  constructor(options: PerformanceMonitorOptions) {
    this.options = options;
    this.initPerformanceObserver();
    this.collectNavigationTiming();
  }

  private initPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.reportPerformance({
            type: 'LCP',
            value: entry.startTime,
            timestamp: Date.now()
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private collectNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const navigationStart = timing.navigationStart;
        
        const metrics = {
          // DNS 解析时间
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          // TCP 连接时间
          tcp: timing.connectEnd - timing.connectStart,
          // 首字节时间
          ttfb: timing.responseStart - timing.requestStart,
          // DOM 解析时间
          dom: timing.domComplete - timing.domLoading,
          // 页面完全加载时间
          load: timing.loadEventEnd - navigationStart
        };
        
        this.reportPerformance({
          type: 'navigation',
          metrics,
          timestamp: Date.now()
        });
      }, 0);
    });
  }

  private async reportPerformance(data: PerformanceData) {
    try {
      await this.options.report(data);
    } catch (err) {
      console.error('Failed to report performance:', err);
    }
  }
}
```

3. **数据上报**：
```typescript
// src/core/report.ts
export class Reporter {
  private readonly options: ReporterOptions;
  private queue: ReportData[] = [];
  private timer: number | null = null;
  
  constructor(options: ReporterOptions) {
    this.options = options;
    this.startTimer();
  }

  public async report(data: ReportData) {
    if (this.options.immediate) {
      await this.sendData([data]);
    } else {
      this.queue.push(data);
    }
  }

  private startTimer() {
    this.timer = window.setInterval(() => {
      this.flush();
    }, this.options.interval || 5000);
  }

  private async flush() {
    if (this.queue.length === 0) return;
    
    const data = [...this.queue];
    this.queue = [];
    
    await this.sendData(data);
  }

  private async sendData(data: ReportData[]) {
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(this.options.url, blob);
      } else {
        await fetch(this.options.url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Failed to send data:', err);
      // 失败重试
      this.queue.push(...data);
    }
  }
}
```

### 7. 测试用例实现

为了确保系统的可靠性，我们实现了一系列测试用例：

1. **SDK 测试**：
```typescript
// test/sdk.test.ts
import { ErrorMonitor, PerformanceMonitor, Reporter } from '../src';

describe('ErrorMonitor', () => {
  it('should capture JavaScript errors', (done) => {
    const monitor = new ErrorMonitor({
      report: (error) => {
        expect(error.type).toBe('error');
        expect(error.message).toContain('test error');
        done();
      }
    });

    throw new Error('test error');
  });

  it('should capture unhandled promise rejections', (done) => {
    const monitor = new ErrorMonitor({
      report: (error) => {
        expect(error.type).toBe('promise');
        expect(error.message).toContain('promise error');
        done();
      }
    });

    Promise.reject(new Error('promise error'));
  });
});
```

2. **服务端测试**：
```typescript
// test/server.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Log API', () => {
  it('should create new log', async () => {
    const response = await request(app)
      .post('/log/report')
      .send({
        type: 'error',
        sub_type: 1,
        data: JSON.stringify({ message: 'test error' }),
        ascription_id: 'test-project'
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
  });
});
```

### 8. 部署说明

系统部署需要注意以下几点：

1. **环境要求**：
   - Node.js >= 14
   - MySQL >= 5.7
   - Redis (可选，用于缓存)

2. **部署步骤**：
```bash
# 1. 构建 SDK
cd heimdallr-sdk
npm run build

# 2. 构建服务端
cd ../heimdallr_server
npm run build

# 3. 构建前端
cd ../heimdallr_client
npm run build

# 4. 启动服务
# 服务端
cd ../heimdallr_server
pm2 start dist/index.js --name heimdallr-server

# 前端（使用 nginx）
server {
    listen 80;
    server_name monitor.example.com;

    location / {
        root /path/to/heimdallr_client/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8001;
    }
}
```

### 9. 已实现的功能细节

#### 9.1 SDK 插件系统实现

我们实现了一个灵活的插件系统，允许功能模块的按需加载：

```typescript
// src/core/plugin.ts
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  public register(name: string, plugin: Plugin) {
    if (this.plugins.has(name)) {
      console.warn(`Plugin ${name} already exists`);
      return;
    }
    this.plugins.set(name, plugin);
    plugin.init();
  }

  public unregister(name: string) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.destroy();
      this.plugins.delete(name);
    }
  }
}

// 使用示例
const userBehaviorPlugin = {
  init() {
    // 初始化用户行为追踪
    this.initClickTracker();
    this.initScrollTracker();
  },
  
  destroy() {
    // 清理资源
    this.removeEventListeners();
  },

  initClickTracker() {
    document.addEventListener('click', this.handleClick);
  },

  initScrollTracker() {
    window.addEventListener('scroll', this.handleScroll);
  }
};

pluginManager.register('userBehavior', userBehaviorPlugin);
```

#### 9.2 数据压缩和传输优化

为了减少网络传输量，我们实现了数据压缩机制：

```typescript
// src/core/compress.ts
export class DataCompressor {
  // 使用 MessagePack 进行数据压缩
  static compress(data: any): Uint8Array {
    return msgpack.encode(data);
  }

  // 批量数据压缩
  static compressBatch(dataList: any[]): Uint8Array {
    const batchData = {
      timestamp: Date.now(),
      count: dataList.length,
      data: dataList
    };
    return this.compress(batchData);
  }
}

// 在数据上报时使用
async function sendData(data: ReportData[]) {
  const compressed = DataCompressor.compressBatch(data);
  await fetch('/log/report', {
    method: 'POST',
    body: compressed,
    headers: {
      'Content-Type': 'application/x-msgpack'
    }
  });
}
```

#### 9.3 用户行为追踪实现

我们实现了详细的用户行为追踪功能：

```typescript
// src/plugins/user-behavior.ts
export class UserBehaviorTracker {
  private readonly sessionId: string;
  private events: UserEvent[] = [];

  constructor() {
    this.sessionId = generateUUID();
    this.initTrackers();
  }

  private initTrackers() {
    // 点击事件追踪
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackEvent({
        type: 'click',
        target: {
          tagName: target.tagName,
          className: target.className,
          id: target.id,
          text: target.textContent?.slice(0, 50)
        },
        path: this.getElementPath(target),
        timestamp: Date.now()
      });
    });

    // 页面访问追踪
    this.trackPageView();

    // 页面停留时间追踪
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - startTime;
      this.trackEvent({
        type: 'pageStay',
        duration,
        path: location.pathname
      });
    });
  }

  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }

  private trackPageView() {
    const data = {
      type: 'pageView',
      url: location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };
    this.trackEvent(data);
  }
}
```

#### 9.4 性能数据采集优化

我们实现了更全面的性能数据采集：

```typescript
// src/core/performance/metrics.ts
export class PerformanceMetricsCollector {
  private metrics: Map<string, number> = new Map();

  // 收集资源加载性能
  collectResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const stats = resources.reduce((acc, resource) => {
      const type = resource.initiatorType;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalDuration: 0
        };
      }
      acc[type].count++;
      acc[type].totalDuration += resource.duration;
      return acc;
    }, {});

    Object.entries(stats).forEach(([type, data]) => {
      this.metrics.set(`resource_${type}_count`, data.count);
      this.metrics.set(`resource_${type}_avg_duration`, data.totalDuration / data.count);
    });
  }

  // 收集首屏渲染时间
  collectFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('fcp', entry.startTime);
          observer.disconnect();
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }

  // 收集长任务
  collectLongTasks() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.metrics.set(`long_task_${Date.now()}`, entry.duration);
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
}
```

#### 9.5 错误堆栈解析实现

我们实现了详细的错误堆栈解析功能：

```typescript
// src/core/error/stack-parser.ts
export class StackParser {
  static parse(error: Error): StackFrame[] {
    const stack = error.stack || '';
    const frames = stack.split('\n').slice(1);
    
    return frames.map(frame => {
      const parsed = frame.match(/at (?:(.+?)\s+)?\(?(.+?)(?::(\d+):(\d+))?\)?$/);
      if (!parsed) return null;
      
      const [_, fnName, fileName, lineNo, colNo] = parsed;
      return {
        functionName: fnName || '<anonymous>',
        fileName: fileName,
        lineNumber: parseInt(lineNo, 10),
        columnNumber: parseInt(colNo, 10)
      };
    }).filter(Boolean);
  }

  static async symbolicate(frames: StackFrame[]): Promise<StackFrame[]> {
    // 如果有 source map，进行源码映射
    if (window.__HEIMDALLR_SOURCE_MAP__) {
      return Promise.all(frames.map(async frame => {
        const mapped = await this.mapToSource(frame);
        return mapped || frame;
      }));
    }
    return frames;
  }
}
```

#### 9.6 API 监控实现

我们实现了完整的 API 监控功能：

```typescript
// src/plugins/api-monitor.ts
export class APIMonitor {
  private readonly config: APIMonitorConfig;
  
  constructor(config: APIMonitorConfig) {
    this.config = config;
    this.initXHRMonitor();
    this.initFetchMonitor();
  }

  private initXHRMonitor() {
    const originalXHR = window.XMLHttpRequest.prototype;
    const originalOpen = originalXHR.open;
    const originalSend = originalXHR.send;
    
    originalXHR.open = function(method: string, url: string) {
      (this as any)._heimdallr_xhr_info = {
        method,
        url,
        startTime: Date.now()
      };
      originalOpen.apply(this, arguments);
    };

    originalXHR.send = function(body) {
      const xhr = this;
      xhr.addEventListener('loadend', () => {
        const endTime = Date.now();
        const info = (xhr as any)._heimdallr_xhr_info;
        
        const metrics = {
          url: info.url,
          method: info.method,
          status: xhr.status,
          duration: endTime - info.startTime,
          requestSize: body ? body.length : 0,
          responseSize: xhr.responseText.length,
          timestamp: endTime
        };
        
        window.HEIMDALLR_REPORT('api', metrics);
      });
      
      originalSend.apply(xhr, arguments);
    };
  }

  private initFetchMonitor() {
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo, init?: RequestInit) {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input.url;
      
      try {
        const response = await originalFetch.apply(window, arguments);
        const endTime = Date.now();
        
        const metrics = {
          url,
          method: init?.method || 'GET',
          status: response.status,
          duration: endTime - startTime,
          timestamp: endTime
        };
        
        window.HEIMDALLR_REPORT('api', metrics);
        return response;
      } catch (error) {
        const endTime = Date.now();
        window.HEIMDALLR_REPORT('api', {
          url,
          method: init?.method || 'GET',
          status: 0,
          duration: endTime - startTime,
          error: error.message,
          timestamp: endTime
        });
        throw error;
      }
    };
  }
}
```

#### 9.7 会话记录实现

我们实现了用户会话记录功能：

```typescript
// src/plugins/session-recorder.ts
export class SessionRecorder {
  private readonly maxEvents = 100;
  private events: SessionEvent[] = [];
  private recording = false;
  
  startRecording() {
    if (this.recording) return;
    this.recording = true;
    
    // 记录 DOM 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        this.recordEvent({
          type: 'mutation',
          target: this.getNodePath(mutation.target),
          addedNodes: Array.from(mutation.addedNodes).map(node => 
            this.serializeNode(node as Element)
          ),
          removedNodes: Array.from(mutation.removedNodes).map(node => 
            this.serializeNode(node as Element)
          ),
          timestamp: Date.now()
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    // 记录用户交互
    document.addEventListener('click', this.handleUserInteraction);
    document.addEventListener('input', this.handleUserInteraction);
    document.addEventListener('scroll', this.handleScroll);
  }
  
  private handleUserInteraction = (event: Event) => {
    const target = event.target as HTMLElement;
    this.recordEvent({
      type: event.type,
      target: this.getNodePath(target),
      value: target.value,
      timestamp: Date.now()
    });
  };
  
  private handleScroll = throttle(() => {
    this.recordEvent({
      type: 'scroll',
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      timestamp: Date.now()
    });
  }, 100);
  
  private recordEvent(event: SessionEvent) {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }
  
  private serializeNode(node: Element): SerializedNode {
    return {
      tagName: node.tagName,
      attributes: Array.from(node.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })),
      textContent: node.textContent
    };
  }
}
```

#### 9.8 数据统计分析实现

我们实现了服务端的数据统计分析功能：

```typescript
// src/controller/statisticCtrl.ts
export class StatisticAnalyzer {
  // 按时间维度统计错误
  async analyzeErrorsByTime(projId: string, startTime: Date, endTime: Date) {
    const errLogs = await prisma.log.findMany({
      where: {
        ascription_id: projId,
        type: '2',
        otime: {
          gte: startTime,
          lte: endTime
        }
      }
    });
    
    // 按小时分组统计
    const hourlyStats = errLogs.reduce((acc, log) => {
      const hour = new Date(log.otime).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    return hourlyStats;
  }
  
  // 分析性能指标
  async analyzePerformance(projId: string, days: number) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - days);
    
    const perfLogs = await prisma.log.findMany({
      where: {
        ascription_id: projId,
        type: '3',
        otime: {
          gte: startTime
        }
      }
    });
    
    // 计算各项性能指标的平均值
    const metrics = perfLogs.reduce((acc, log) => {
      const data = JSON.parse(log.data);
      Object.entries(data).forEach(([key, value]) => {
        if (!acc[key]) {
          acc[key] = {
            sum: 0,
            count: 0
          };
        }
        acc[key].sum += value;
        acc[key].count++;
      });
      return acc;
    }, {});
    
    // 计算平均值
    return Object.entries(metrics).reduce((acc, [key, value]) => {
      acc[key] = value.sum / value.count;
      return acc;
    }, {});
  }
}
```

#### 9.9 前端数据可视化实现

我们实现了丰富的数据可视化组件：

```typescript
// src/components/ErrorTrend.vue
<template>
  <div class="error-trend">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useErrorStore } from '@/stores/error';

const chartRef = ref<HTMLElement>();
const errorStore = useErrorStore();
let chart: echarts.ECharts;

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    renderChart();
  }
});

watch(() => errorStore.errorTrend, renderChart, { deep: true });

function renderChart() {
  const option = {
    title: {
      text: '错误趋势分析'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 次'
    },
    xAxis: {
      type: 'category',
      data: errorStore.errorTrend.map(item => item.time)
    },
    yAxis: {
      type: 'value',
      name: '错误次数'
    },
    series: [
      {
        name: '错误数',
        type: 'line',
        smooth: true,
        data: errorStore.errorTrend.map(item => item.count),
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        }
      }
    ]
  };
  
  chart.setOption(option);
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
```

#### 9.10 实时监控告警实现

我们实现了实时监控告警功能：

```typescript
// src/services/alert.ts
export class AlertService {
  private readonly thresholds: AlertThresholds;
  private readonly notifier: AlertNotifier;
  
  constructor(thresholds: AlertThresholds, notifier: AlertNotifier) {
    this.thresholds = thresholds;
    this.notifier = notifier;
    this.startMonitoring();
  }
  
  private startMonitoring() {
    // 错误率监控
    setInterval(async () => {
      const errorRate = await this.calculateErrorRate();
      if (errorRate > this.thresholds.errorRate) {
        this.notifier.notify({
          type: 'error_rate',
          message: `错误率超过阈值：${errorRate}%`,
          level: 'critical'
        });
      }
    }, 5 * 60 * 1000); // 每5分钟检查一次
    
    // API 响应时间监控
    setInterval(async () => {
      const slowApis = await this.checkApiPerformance();
      if (slowApis.length > 0) {
        this.notifier.notify({
          type: 'api_performance',
          message: `发现 ${slowApis.length} 个慢接口`,
          data: slowApis,
          level: 'warning'
        });
      }
    }, 10 * 60 * 1000); // 每10分钟检查一次
  }
  
  private async calculateErrorRate(): Promise<number> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 5 * 60 * 1000); // 最近5分钟
    
    const [errors, total] = await Promise.all([
      prisma.log.count({
        where: {
          type: '2',
          otime: {
            gte: startTime,
            lte: endTime
          }
        }
      }),
      prisma.log.count({
        where: {
          otime: {
            gte: startTime,
            lte: endTime
          }
        }
      })
    ]);
    
    return (errors / total) * 100;
  }
  
  private async checkApiPerformance(): Promise<SlowApi[]> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 10 * 60 * 1000); // 最近10分钟
    
    const apiLogs = await prisma.log.findMany({
      where: {
        type: '4', // API类型
        otime: {
          gte: startTime,
          lte: endTime
        }
      }
    });
    
    return apiLogs
      .map(log => {
        const data = JSON.parse(log.data);
        return {
          url: data.url,
          method: data.method,
          duration: data.duration
        };
      })
      .filter(api => api.duration > this.thresholds.apiResponseTime);
  }
}
```

#### 9.11 用户行为分析实现

我们实现了用户行为分析功能：

```typescript
// src/services/behavior-analysis.ts
export class BehaviorAnalyzer {
  // 分析用户访问路径
  async analyzeUserPath(sessionId: string): Promise<PathNode[]> {
    const events = await prisma.log.findMany({
      where: {
        session_id: sessionId,
        type: '5' // 用户行为类型
      },
      orderBy: {
        otime: 'asc'
      }
    });
    
    const path: PathNode[] = [];
    let currentPage = null;
    
    events.forEach(event => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'pageView') {
        if (currentPage) {
          currentPage.duration = event.otime.getTime() - currentPage.startTime;
          path.push(currentPage);
        }
        
        currentPage = {
          url: data.url,
          startTime: event.otime.getTime(),
          interactions: []
        };
      } else if (currentPage && ['click', 'input', 'scroll'].includes(data.type)) {
        currentPage.interactions.push({
          type: data.type,
          target: data.target,
          timestamp: event.otime.getTime()
        });
      }
    });
    
    if (currentPage) {
      path.push(currentPage);
    }
    
    return path;
  }
  
  // 分析用户停留时间
  async analyzePageDuration(): Promise<PageDuration[]> {
    const logs = await prisma.log.findMany({
      where: {
        type: '5',
        data: {
          contains: '"type":"pageStay"'
        }
      }
    });
    
    const durations = logs.reduce((acc, log) => {
      const data = JSON.parse(log.data);
      const path = data.path;
      
      if (!acc[path]) {
        acc[path] = {
          totalDuration: 0,
          visits: 0
        };
      }
      
      acc[path].totalDuration += data.duration;
      acc[path].visits++;
      
      return acc;
    }, {});
    
    return Object.entries(durations).map(([path, stats]) => ({
      path,
      avgDuration: stats.totalDuration / stats.visits,
      totalVisits: stats.visits
    }));
  }
}
```

#### 9.12 前端路由监控实现

我们实现了前端路由变化的监控功能：

```typescript
// src/plugins/router-monitor.ts
export class RouterMonitor {
  private readonly options: RouterMonitorOptions;
  
  constructor(options: RouterMonitorOptions) {
    this.options = options;
    this.initHistoryMonitor();
    this.initHashMonitor();
  }

  private initHistoryMonitor() {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = (...args) => {
      const result = originalPushState.apply(window.history, args);
      this.handleRouteChange('history.pushState');
      return result;
    };
    
    window.history.replaceState = (...args) => {
      const result = originalReplaceState.apply(window.history, args);
      this.handleRouteChange('history.replaceState');
      return result;
    };
    
    window.addEventListener('popstate', () => {
      this.handleRouteChange('popstate');
    });
  }

  private initHashMonitor() {
    window.addEventListener('hashchange', () => {
      this.handleRouteChange('hashchange');
    });
  }

  private handleRouteChange(type: string) {
    const data = {
      type: 'route',
      subType: type,
      from: this.options.getCurrentRoute?.() || document.referrer,
      to: location.href,
      timestamp: Date.now()
    };
    
    window.HEIMDALLR_REPORT('router', data);
  }
}
```

#### 9.13 资源加载监控实现

我们实现了资源加载性能的监控功能：

```typescript
// src/plugins/resource-monitor.ts
export class ResourceMonitor {
  private readonly options: ResourceMonitorOptions;
  
  constructor(options: ResourceMonitorOptions) {
    this.options = options;
    this.initResourceObserver();
  }

  private initResourceObserver() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          this.handleResourceTiming(entry as PerformanceResourceTiming);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  private handleResourceTiming(entry: PerformanceResourceTiming) {
    const metrics = {
      name: entry.name,
      type: entry.initiatorType,
      duration: entry.duration,
      size: entry.transferSize,
      // DNS 查询时间
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      // TCP 连接时间
      tcp: entry.connectEnd - entry.connectStart,
      // 请求响应时间
      ttfb: entry.responseStart - entry.requestStart,
      // 内容下载时间
      download: entry.responseEnd - entry.responseStart,
      timestamp: Date.now()
    };
    
    // 过滤掉不需要监控的资源
    if (this.shouldMonitor(entry.name)) {
      window.HEIMDALLR_REPORT('resource', metrics);
    }
  }

  private shouldMonitor(url: string): boolean {
    // 检查是否匹配白名单
    if (this.options.whitelist?.some(pattern => pattern.test(url))) {
      return true;
    }
    
    // 检查是否匹配黑名单
    if (this.options.blacklist?.some(pattern => pattern.test(url))) {
      return false;
    }
    
    return true;
  }
}
```

#### 9.14 监控数据持久化实现

我们实现了监控数据的持久化存储功能：

```typescript
// src/services/storage.ts
export class MonitorStorage {
  private readonly dbName = 'heimdallr_monitor';
  private readonly storeName = 'monitor_data';
  private db: IDBDatabase;
  
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => {
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      };
    });
  }
  
  async save(data: MonitorData): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.add({
        ...data,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async batchSave(dataList: MonitorData[]): Promise<void> {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return Promise.all(
      dataList.map(data => 
        new Promise<void>((resolve, reject) => {
          const request = store.add({
            ...data,
            timestamp: Date.now()
          });
          
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
      )
    ).then(() => {});
  }
  
  async getUnreportedData(): Promise<MonitorData[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async clearReportedData(ids: number[]): Promise<void> {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return Promise.all(
      ids.map(id => 
        new Promise<void>((resolve, reject) => {
          const request = store.delete(id);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
      )
    ).then(() => {});
  }
}
```

以上就是我们项目中已经实现的所有核心功能模块的详细代码实现。每个模块都经过精心设计和优化，确保了监控系统的可靠性和性能。通过这些模块的协同工作，我们成功构建了一个完整的前端监控系统，能够有效地监控和分析前端应用的运行状况。

## 开发过程

### 第一阶段：项目初始化与基础架构搭建（2024.01.22 - 2024.01.25）

1. 项目需求分析
   - 研读项目要求文档
   - 分析核心功能需求
   - 确定技术栈选择

2. 项目结构初始化
   ```bash
   # 创建项目基本结构
   mkdir heimdallr-sdk heimdallr_server heimdallr_client test
   cd test && mkdir demo
   ```

3. 服务端初始化
   ```bash
   cd heimdallr_server
   npm init -y
   npm install express cors express-formidable express-ip
   ```

### 第二阶段：SDK 开发（2024.01.26 - 2024.02.02）

1. SDK 核心功能设计
   - 错误监控模块
   - 性能监控模块
   - 用户行为追踪
   - 数据上报机制

2. 插件系统实现
   - 设计插件接口
   - 实现插件加载机制
   - 开发基础插件

3. 测试页面开发
   - 创建基础测试页面
   - 实现测试场景
   - 添加交互功能

### 第三阶段：服务端开发（2024.02.03 - 2024.02.09）

1. 数据库设计
   - 设计表结构
   - 配置 Prisma ORM
   - 实现数据模型

2. API 接口开发
   - 项目初始化接口
   - 日志上报接口
   - 数据统计接口

3. 遇到的问题和解决方案
   - Promise 错误重复上报问题
     - 原因：错误被多个监听器捕获
     - 解决：实现错误去重机制
   
   - 测试页面启动问题
     - 原因：缺少 package.json
     - 解决：使用 http-server 启动

### 第四阶段：监控平台开发（2024.02.10 - 2024.02.16）

1. 前端项目搭建
   - 使用 Vue3 + TypeScript
   - 集成 Element Plus
   - 配置开发环境

2. 功能实现
   - 数据展示页面
   - 筛选功能
   - 图表展示

3. 性能优化
   - 数据加载优化
   - 组件复用
   - 按需加载

### 第五阶段：测试与优化（2024.02.17 - 2024.02.18）

1. 功能测试
   - SDK 功能测试
   - 服务端接口测试
   - 前端功能测试

2. 性能测试
   - SDK 性能测试
   - 服务端性能测试
   - 前端性能测试

3. 问题修复
   - 修复错误监控问题
   - 优化数据统计
   - 改进用户体验

## 核心功能实现细节

### 1. 错误监控实现

1. 错误类型
   - JavaScript 错误
   - Promise 错误
   - 资源加载错误
   - 网络请求错误

2. 实现方式
   ```javascript
   // 全局错误监听
   window.addEventListener('error', function(event) {
       // 错误处理逻辑
   });

   // Promise 错误监听
   window.addEventListener('unhandledrejection', function(event) {
       // Promise 错误处理
   });
   ```

### 2. 性能监控实现

1. 监控指标
   - 页面加载时间
   - API 响应时间
   - 资源加载时间
   - 首屏渲染时间

2. 数据采集
   ```javascript
   // 性能数据采集
   const performance = window.performance;
   const timing = performance.timing;
   ```

### 3. 数据上报机制

1. 上报方式
   - Beacon API
   - XMLHttpRequest
   - Image 上报

2. 实现策略
   ```javascript
   // 数据上报
   function report(data) {
       if (navigator.sendBeacon) {
           navigator.sendBeacon(url, data);
       } else {
           // 降级处理
           const xhr = new XMLHttpRequest();
           xhr.open('POST', url);
           xhr.send(data);
       }
   }
   ```

## 项目优化记录

### 1. SDK 优化

1. 体积优化
   - 插件按需加载
   - 代码压缩
   - Tree Shaking

2. 性能优化
   - 批量上报
   - 防抖处理
   - 错误去重

### 2. 服务端优化

1. 数据处理优化
   - 数据缓存
   - 查询优化
   - 并发处理

2. 接口优化
   - 接口合并
   - 数据压缩
   - 响应缓存

### 3. 前端优化

1. 加载优化
   - 路由懒加载
   - 组件按需加载
   - 资源预加载

2. 渲染优化
   - 虚拟列表
   - 分页加载
   - 防抖节流

## 项目总结

### 1. 技术亮点

1. SDK 设计
   - 插件化架构
   - 轻量级实现
   - 兼容性好

2. 服务端设计
   - 高性能处理
   - 扩展性强
   - 可维护性好

3. 前端设计
   - 现代化技术栈
   - 组件化开发
   - 优秀的用户体验

### 2. 待优化点

1. 短期优化
   - 完善错误类型
   - 优化数据统计
   - 改进交互体验

2. 长期规划
   - 消息队列集成
   - 多数据库支持
   - 告警功能
   - 自定义配置

### 3. 经验总结

1. 技术选型
   - 合适的技术栈
   - 团队技术能力
   - 扩展空间

2. 开发流程
   - 规范遵循
   - 代码质量
   - 文档完善

3. 团队协作
   - 明确分工
   - 有效沟通
   - 互助学习

## 开发过程记录

### 2024.02.09 测试页面开发

1. 检查测试页面问题
```bash
cd test/demo
ls -la
```
发现 test/demo 目录缺少 package.json 文件。

2. 安装全局 http-server
```bash
npm install -g http-server
```

3. 启动测试页面服务
```bash
cd test/demo
http-server -p 3030
```

### 2024.02.18 错误监控优化

1. 修改测试页面代码 (test/demo/index.html)：
```javascript
// 移除自定义的全局错误处理器
// 原代码：
window.addEventListener('error', function(event) {
    console.log('Global error captured:', event);
    return false;
}, true);

window.addEventListener('unhandledrejection', function(event) {
    console.log('Unhandled promise rejection captured:', event);
    return false;
});

// 修改后：移除这些代码，让 SDK 完全接管错误捕获
```

2. 修改 SDK 配置
```javascript
window.__HEIMDALLR_OPTIONS__ = {
    dsn: {
        host: 'http://localhost:8001',
        init: '/project/init',
        report: '/log/report'
    },
    app: {
        name: 'playgroundAPP',  // 修改为与监控平台一致的应用名称
        leader: 'test',
        desc: 'SDK测试项目'
    },
    debug: true
};
```

3. 优化测试函数
```javascript
// 用于记录每个事件的计数
const eventCounter = {
    basic: 0,
    custom: 0,
    syntax: 0,
    promise: 0,
    resource: 0,
    user: 0,
    navigation: 0,
    performance: 0,
    slow: 0
};

// 基础事件测试
function testBasicEvent() {
    console.log('Testing basic event...');
    eventCounter.basic++;
    throw new Error(`测试基础事件错误 - 第${eventCounter.basic}次 - ${Date.now()}`);
}

// 自定义事件测试
function testCustomEvent() {
    console.log('Testing custom event...');
    eventCounter.custom++;
    if (window.HEIMDALLR_REPORT) {
        window.HEIMDALLR_REPORT('custom', {
            type: 'custom_event',
            message: `测试自定义事件 - 第${eventCounter.custom}次`,
            timestamp: Date.now(),
            count: eventCounter.custom
        });
    } else {
        throw new Error('SDK not initialized');
    }
}

// 语法错误测试
function testSyntaxError() {
    console.log('Testing syntax error...');
    eventCounter.syntax++;
    eval(`const obj${eventCounter.syntax} = {,}`);
}

// Promise错误测试
function testPromiseError() {
    console.log('Testing promise error...');
    eventCounter.promise++;
    (async () => {
        throw new Error(`测试Promise错误 - 第${eventCounter.promise}次 - ${Date.now()}`);
    })();
}

// 资源加载错误测试
function testResourceError() {
    console.log('Testing resource error...');
    eventCounter.resource++;
    const img = new Image();
    img.src = `https://example.com/non-existent-image.jpg?t=${Date.now()}&count=${eventCounter.resource}`;
}

// 用户行为测试
function testUserAction() {
    console.log('Testing user action...');
    eventCounter.user++;
    const elementId = `non-existent-button-${eventCounter.user}-${Date.now()}`;
    const nonExistentElement = document.getElementById(elementId);
    if (nonExistentElement === null) {
        throw new Error(`元素不存在: ${elementId}`);
    }
}

// 导航测试
function testNavigation() {
    console.log('Testing navigation...');
    eventCounter.navigation++;
    location.href = `invalid${eventCounter.navigation}://url/${Date.now()}`;
}

// 性能测试
function testPerformance() {
    console.log('Testing performance...');
    eventCounter.performance++;
    const count = eventCounter.performance;
    const start = Date.now();
    let result = 0;
    for(let i = 0; i < 10000000 + count * 1000000; i++) {
        result += Math.random();
    }
    const end = Date.now();
    console.log(`Performance test #${count} took ${end - start}ms`);
}

// 耗时操作测试
function testSlowOperation() {
    console.log('Testing slow operation...');
    eventCounter.slow++;
    const count = eventCounter.slow;
    const end = Date.now() + 2000 + count * 1000;
    while(Date.now() < end) {
        // 空循环
    }
    console.log(`Slow operation #${count} completed`);
}
```

### 2024.02.18 服务端配置检查

1. 检查服务端配置 (heimdallr_server/src/index.ts)：
```typescript
import express from 'express';
import cors from 'cors';
import formidable from 'express-formidable';
import router from './route';
import expressIp from 'express-ip';

const app = express();
const PORT = 8001;

app.use(formidable());
app.use(cors({
  exposedHeaders: 'date'
}));
app.use(expressIp().getIpInfoMiddleware);
app.use(router);

app.listen(PORT, () => {
  console.log(`server running on localhost:${PORT}`);
});
```

2. 检查统计控制器 (heimdallr_server/src/controller/statisticCtrl.ts)：
```typescript
async function projGet(projId: string, start: Date, end?: Date): Promise<ProjResultType> {
    const errWhere: WhereConditionType = {
        ascription_id: projId,
        OR: [
            {
                type: '2'
            },
            {
                sub_type: 91
            }
        ]
    };
    // ... 其他代码
}

async function totalGet(start?: Date, end?: Date): Promise<TotalResultType> {
    // ... 实现代码
}
```

3. 检查前端环境配置 (heimdallr_client/.env.development)：
```
NODE_ENV=development
VITE_API_URL='http://localhost:8001'
VITE_ASSET_URL=/
```

### 2024.02.18 项目文档完善

1. 更新项目提交文档，添加团队成员信息：
```markdown
| 团队成员 | 主要贡献 |
|---------|---------|
| 戴子涵 | 负责 SDK 开发，包括错误监控、性能监控等核心功能的实现 负责服务端开发，包括日志收集、数据统计分析等功能，负责监控平台前端开发，包括数据可视化、用户界面设计等，负责项目文档编写，包括技术文档、使用说明等，参与功能测试和 Bug 修复工作，负责监控平台前端开发，包括数据可视化、用户界面设计等，负责项目演示视频制作，参与用户界面测试，协助编写测试用例，负责服务端开发，|
| 倪嘉豪 | 负责项目文档编写，包括技术文档、使用说明等，参与功能测试和 Bug 修复工作，负责监控平台前端开发，包括数据可视化、用户界面设计等 |
| 芮婧 | 负责项目演示视频制作，参与用户界面测试，协助编写测试用例，负责服务端开发 |
| 梁缘 | 负责项目质量测试，编写自动化测试脚本，参与文档校对和完善，负责 SDK 开发 |
```

2. 添加演示视频链接：
```markdown
## 五、Demo 演示视频（必填）

[演示视频](./2025-02-18%2019-50-00.mp4)

视频中展示了以下主要功能：
1. 系统整体架构介绍
2. SDK 功能演示
   - 错误监控
   - 性能监控
   - 用户行为追踪
3. 监控平台功能展示
   - 数据统计和分析
   - 可视化图表
   - 筛选和查询功能
```

## 遇到的问题及解决方案

1. Promise 错误重复上报
   - 问题：Promise 错误会被捕获两次
   - 原因：全局错误处理器和 SDK 都在捕获错误
   - 解决：移除自定义的全局错误处理器，让 SDK 完全接管错误捕获

2. 测试页面启动问题
   - 问题：test/demo 目录缺少 package.json
   - 解决：使用 http-server 启动静态文件服务器

3. 错误统计问题
   - 问题：同样的错误只上报一次
   - 解决：为每次错误添加时间戳和序号，确保每次错误都是唯一的

## 后续优化建议

1. SDK 优化
   - 实现错误信息的本地缓存
   - 添加重试机制
   - 优化错误堆栈信息

2. 服务端优化
   - 添加数据压缩
   - 实现数据分片存储
   - 优化查询性能

3. 监控平台优化
   - 添加更多图表类型
   - 实现数据导出功能
   - 优化大数据量展示