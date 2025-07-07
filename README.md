# Heimdallr 前端监控系统 / Heimdallr Frontend Monitoring System

这是一个基于 heimdallr-sdk 的前端监控系统实现，包含了 SDK、服务端和监控平台三个主要部分。

This is a frontend monitoring system implementation based on heimdallr-sdk, consisting of three main components: SDK, server, and monitoring platform.

## 项目结构 / Project Structure

```
.
├── heimdallr-sdk/          # SDK 源码 / SDK source code
├── heimdallr_server/       # 后端服务 / Backend service
├── heimdallr_client/       # 监控平台前端 / Monitoring platform frontend
└── test/                   # 测试用例 / Test cases
    └── demo/              # SDK 测试页面 / SDK test page
```

## 功能特性 / Features

- SDK 功能 / SDK Features：
  - 错误监控（代码错误、资源加载错误、未捕获的 Promise 错误等）/ Error monitoring (code errors, resource loading errors, unhandled Promise errors, etc.)
  - 性能监控 / Performance monitoring
  - 用户行为追踪 / User behavior tracking
  - 自定义事件上报 / Custom event reporting
  - 会话记录 / Session recording
  - 支持多种上报方式 / Support for multiple reporting methods

- 服务端功能 / Server Features：
  - 日志收集和存储 / Log collection and storage
  - 数据统计和分析 / Data statistics and analysis
  - API 接口支持 / API interface support
  - 项目管理 / Project management

- 监控平台功能 / Monitoring Platform Features：
  - 实时错误监控 / Real-time error monitoring
  - 性能数据分析 / Performance data analysis
  - 用户行为分析 / User behavior analysis
  - 可视化数据展示 / Visual data presentation

## 快速开始 / Quick Start

### 1. 环境要求 / Requirements

- Node.js >= 14
- MySQL >= 5.7
- npm >= 6

### 2. 安装依赖 / Install Dependencies

分别在三个主要目录下安装依赖：

Install dependencies in the three main directories:

```bash
# 安装 SDK 依赖 / Install SDK dependencies
cd heimdallr-sdk
npm install

# 安装服务端依赖 / Install server dependencies
cd heimdallr_server
npm install

# 安装监控平台依赖 / Install monitoring platform dependencies
cd heimdallr_client
npm install
```

### 3. 配置数据库 / Configure Database

在 `heimdallr_server` 目录下配置数据库连接：

Configure database connection in the `heimdallr_server` directory:

```bash
# 创建 .env 文件 / Create .env file
cp .env.example .env

# 编辑 .env 文件，配置数据库连接信息 / Edit .env file, configure database connection information
DATABASE_URL="mysql://username:password@localhost:3306/heimdallr"
```

### 4. 启动服务 / Start Services

需要按顺序启动三个服务：

Need to start three services in order:

```bash
# 1. 启动服务端（默认端口 8001）/ Start server (default port 8001)
cd heimdallr_server
npm run dev

# 2. 启动监控平台（默认端口 3000）/ Start monitoring platform (default port 3000)
cd heimdallr_client
npm run dev

# 3. 启动测试页面（默认端口 3030）/ Start test page (default port 3030)
cd test/demo
# 选择以下任一方式启动 / Choose one of the following ways to start:

# 方式1：使用 http-server（推荐）/ Method 1: Use http-server (recommended)
npm install -g http-server  # 全局安装，只需执行一次 / Global installation, only need to execute once
http-server -p 3030

# 方式2：使用 Python 的 SimpleHTTPServer / Method 2: Use Python's SimpleHTTPServer
python -m SimpleHTTPServer 3030  # Python 2
# 或 / or
python3 -m http.server 3030      # Python 3

# 方式3：使用 PHP 内置服务器 / Method 3: Use PHP built-in server
php -S localhost:3030
```

### 5. 测试 SDK / Test SDK

访问测试页面：`http://localhost:3030`

Access test page: `http://localhost:3030`

测试页面提供了多种错误和性能测试场景：

The test page provides various error and performance test scenarios:

1. 基础事件测试 / Basic Event Testing
   - 测试基础事件：触发一个基本的错误事件 / Test basic events: trigger a basic error event
   - 测试自定义事件：使用 `HEIMDALLR_REPORT` 上报自定义事件 / Test custom events: use `HEIMDALLR_REPORT` to report custom events

2. 错误捕获测试 / Error Capture Testing
   - 测试语法错误：触发 JavaScript 语法错误 / Test syntax errors: trigger JavaScript syntax errors
   - 测试 Promise 错误：触发未捕获的 Promise 错误 / Test Promise errors: trigger unhandled Promise errors
   - 测试资源加载错误：触发图片资源加载失败错误 / Test resource loading errors: trigger image resource loading failure errors

3. 用户行为测试 / User Behavior Testing
   - 模拟用户点击：触发 DOM 相关错误 / Simulate user clicks: trigger DOM-related errors
   - 测试页面导航：触发导航相关错误 / Test page navigation: trigger navigation-related errors

4. 性能监控测试 / Performance Monitoring Testing
   - 测试页面性能：执行耗时计算操作 / Test page performance: execute time-consuming calculation operations
   - 测试耗时操作：执行可控的死循环操作 / Test time-consuming operations: execute controllable infinite loop operations

**测试注意事项 / Testing Notes:**
- 每个测试按钮都可以多次点击，系统会为每次错误生成唯一标识 / Each test button can be clicked multiple times, the system will generate unique identifiers for each error
- Promise 错误可能会在监控平台显示两次，这是正常现象 / Promise errors may appear twice in the monitoring platform, which is normal
- 资源加载错误测试会触发 404 错误，这是预期行为 / Resource loading error tests will trigger 404 errors, which is expected behavior
- 性能测试可能会导致页面短暂卡顿，这是正常现象 / Performance tests may cause brief page lag, which is normal

### 6. 查看监控数据 / View Monitoring Data

访问监控平台：`http://localhost:3000`

Access monitoring platform: `http://localhost:3000`

可以查看 / You can view:
- 错误统计：查看各类型错误的统计数据 / Error statistics: view statistics of various types of errors
- 性能数据：查看页面性能指标 / Performance data: view page performance metrics
- 用户行为：查看用户操作记录 / User behavior: view user operation records
- API 调用情况：查看接口调用统计 / API call status: view interface call statistics

支持的数据筛选维度 / Supported data filtering dimensions:
- 时间范围：今天、昨天、最近7天、最近30天 / Time range: today, yesterday, last 7 days, last 30 days
- 错误类型：语法错误、Promise错误、资源错误等 / Error types: syntax errors, Promise errors, resource errors, etc.
- 性能指标：API响应时间、页面加载时间等 / Performance metrics: API response time, page load time, etc.

## SDK 使用说明 / SDK Usage Guide

### 基础配置 / Basic Configuration

```javascript
window.__HEIMDALLR_OPTIONS__ = {
    dsn: {
        host: 'http://localhost:8001',
        init: '/project/init',
        report: '/log/report'
    },
    app: {
        name: 'YourAppName',
        leader: 'YourName',
        desc: '项目描述 / Project description'
    },
    debug: true,
    enableTraceId: true,  // 启用追踪ID / Enable trace ID
    maxBreadcrumbs: 20,   // 设置最大面包屑数量 / Set maximum breadcrumb count
    ignoreErrors: [],     // 不忽略任何错误 / Don't ignore any errors
    silentRecordScreen: false,  // 不静默录制 / Don't silently record
    silentWhiteScreen: false,   // 不静默白屏 / Don't silently white screen
    filterXhrUrlRegExp: /.*/    // 监控所有xhr请求 / Monitor all xhr requests
};
```

### 引入 SDK / Import SDK

```html
<script async src="path/to/browser.iife.js"></script>
```

### 初始化 / Initialization

```javascript
// 等待SDK加载完成后初始化 / Wait for SDK to load before initializing
function initSDK() {
    if (window.HEIMDALLR_BROWSER) {
        window.HEIMDALLR_BROWSER(window.__HEIMDALLR_OPTIONS__);
        console.log('SDK initialized successfully / SDK 初始化成功');
    } else {
        console.log('SDK not loaded yet, retrying... / SDK 尚未加载，重试中...');
        setTimeout(initSDK, 100);
    }
}

// 监听SDK脚本加载完成 / Listen for SDK script loading completion
document.querySelector('script[src="path/to/browser.iife.js"]').addEventListener('load', () => {
    console.log('SDK script loaded / SDK 脚本已加载');
    initSDK();
});
```

### 自定义事件上报 / Custom Event Reporting

```javascript
if (window.HEIMDALLR_REPORT) {
    window.HEIMDALLR_REPORT('custom', {
        type: 'custom_event',
        message: '自定义事件消息',
        timestamp: Date.now(),
        // 添加自定义数据
        customData: {
            userId: 'xxx',
            action: 'click',
            page: 'home'
        }
    });
}
```

## 注意事项 / Notes

1. 服务启动顺序 / Service Startup Order
   - 先启动服务端（8001端口） / Start server (port 8001) first
   - 再启动监控平台（3000端口） / Then start the monitoring platform (port 3000)
   - 最后启动测试页面（3030端口） / Finally start the test page (port 3030)

2. SDK 配置注意事项 / SDK Configuration Notes
   - host 必须包含 `http://` 或 `https://` 前缀 / host must include `http://` or `https://` prefix
   - app.name 必须与监控平台显示的应用名称一致 / app.name must be consistent with the application name displayed in the monitoring platform
   - debug 模式下会输出更多日志信息 / In debug mode, more log information will be output

3. 错误监控注意事项 / Error Monitoring Notes
   - 不要在业务代码中过度使用 try-catch，可能会影响错误的自动捕获 / Do not overuse try-catch in business code, which may affect automatic error capture
   - Promise 错误可能会被捕获两次，这是正常现象 / Promise errors may be captured twice, which is normal
   - 资源加载错误需要完整的 URL 地址才能正确上报 / Resource loading errors require a complete URL address to report correctly

4. 性能监控注意事项 / Performance Monitoring Notes
   - 性能测试可能会导致页面暂时无响应 / Performance tests may cause brief page lag
   - 建议在测试时适当调整循环次数 / Suggest adjusting the loop count appropriately during testing
   - 注意观察控制台输出的性能指标 / Pay attention to the performance metrics output in the console

## 常见问题 / Common Questions

1. **SDK 无法上报数据 / SDK Cannot Report Data**
   - 检查服务端是否正常运行（8001端口） / Check if the server is running normally (port 8001)
   - 检查 SDK 配置中的 host 地址是否包含 http:// 前缀 / Check if the host address in the SDK configuration includes the `http://` prefix
   - 检查网络连接是否正常 / Check if the network connection is normal
   - 查看浏览器控制台是否有错误信息 / Check if there are any error messages in the browser console

2. **监控平台无法显示数据 / Monitoring Platform Cannot Display Data**
   - 检查服务端是否正常运行 / Check if the server is running normally
   - 检查数据库连接是否正常 / Check if the database connection is normal
   - 检查 API 地址配置是否正确 / Check if the API address configuration is correct
   - 确认应用名称是否与 SDK 配置一致 / Confirm if the application name is consistent with the SDK configuration

3. **测试页面问题 / Test Page Issues**
   - 确保 SDK 文件路径正确 / Ensure the SDK file path is correct
   - 检查 SDK 初始化是否成功 / Check if the SDK initialization is successful
   - 观察控制台输出的初始化日志 / Observe the initialization logs output in the console
   - 确认所有测试按钮功能正常 / Confirm that all test buttons function normally

4. **数据统计异常 / Data Statistics Anomalies**
   - 检查时间范围选择是否正确 / Check if the time range selection is correct
   - 确认筛选条件设置是否合适 / Confirm if the filter conditions are appropriate
   - 查看具体错误日志详情 / View the specific error log details
   - 验证数据库中的原始记录 / Verify the original records in the database

## 开发计划 / Development Plan

- [ ] 支持更多类型的错误监控 / Support for more types of error monitoring
- [ ] 优化性能数据采集 / Optimize performance data collection
- [ ] 增加更多数据分析功能 / Add more data analysis functions
- [ ] 优化数据可视化展示 / Optimize data visualization
- [ ] 添加告警功能 / Add alert function
- [ ] 支持自定义错误过滤规则 / Support custom error filtering rules
- [ ] 添加用户行为回放功能 / Add user behavior playback function
- [ ] 优化大数据量下的性能 / Optimize performance under large data volume

## 贡献指南 / Contribution Guide

1. Fork 项目 / Fork the project
2. 创建功能分支 / Create a feature branch
3. 提交代码 / Submit code
4. 创建 Pull Request / Create a Pull Request

## 许可证 / License

MIT License