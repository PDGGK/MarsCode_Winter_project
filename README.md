# Heimdallr 前端监控系统

这是一个基于 heimdallr-sdk 的前端监控系统实现，包含了 SDK、服务端和监控平台三个主要部分。

## 项目结构

```
.
├── heimdallr-sdk/          # SDK 源码
├── heimdallr_server/       # 后端服务
├── heimdallr_client/       # 监控平台前端
└── test/                   # 测试用例
    └── demo/              # SDK 测试页面
```

## 功能特性

- SDK 功能：
  - 错误监控（代码错误、资源加载错误、未捕获的 Promise 错误等）
  - 性能监控
  - 用户行为追踪
  - 自定义事件上报
  - 会话记录
  - 支持多种上报方式

- 服务端功能：
  - 日志收集和存储
  - 数据统计和分析
  - API 接口支持
  - 项目管理

- 监控平台功能：
  - 实时错误监控
  - 性能数据分析
  - 用户行为分析
  - 可视化数据展示

## 快速开始

### 1. 环境要求

- Node.js >= 14
- MySQL >= 5.7
- npm >= 6

### 2. 安装依赖

分别在三个主要目录下安装依赖：

```bash
# 安装 SDK 依赖
cd heimdallr-sdk
npm install

# 安装服务端依赖
cd heimdallr_server
npm install

# 安装监控平台依赖
cd heimdallr_client
npm install
```

### 3. 配置数据库

在 `heimdallr_server` 目录下配置数据库连接：

```bash
# 创建 .env 文件
cp .env.example .env

# 编辑 .env 文件，配置数据库连接信息
DATABASE_URL="mysql://username:password@localhost:3306/heimdallr"
```

### 4. 启动服务

需要按顺序启动三个服务：

```bash
# 1. 启动服务端（默认端口 8001）
cd heimdallr_server
npm run dev

# 2. 启动监控平台（默认端口 3000）
cd heimdallr_client
npm run dev

# 3. 启动测试页面（默认端口 3030）
cd test/demo
# 选择以下任一方式启动：

# 方式1：使用 http-server（推荐）
npm install -g http-server  # 全局安装，只需执行一次
http-server -p 3030

# 方式2：使用 Python 的 SimpleHTTPServer
python -m SimpleHTTPServer 3030  # Python 2
# 或
python3 -m http.server 3030      # Python 3

# 方式3：使用 PHP 内置服务器
php -S localhost:3030
```

### 5. 测试 SDK

访问测试页面：`http://localhost:3030`

测试页面提供了多种错误和性能测试场景：

1. 基础事件测试
   - 测试基础事件：触发一个基本的错误事件
   - 测试自定义事件：使用 `HEIMDALLR_REPORT` 上报自定义事件

2. 错误捕获测试
   - 测试语法错误：触发 JavaScript 语法错误
   - 测试 Promise 错误：触发未捕获的 Promise 错误
   - 测试资源加载错误：触发图片资源加载失败错误

3. 用户行为测试
   - 模拟用户点击：触发 DOM 相关错误
   - 测试页面导航：触发导航相关错误

4. 性能监控测试
   - 测试页面性能：执行耗时计算操作
   - 测试耗时操作：执行可控的死循环操作

**测试注意事项：**
- 每个测试按钮都可以多次点击，系统会为每次错误生成唯一标识
- Promise 错误可能会在监控平台显示两次，这是正常现象
- 资源加载错误测试会触发 404 错误，这是预期行为
- 性能测试可能会导致页面短暂卡顿，这是正常现象

### 6. 查看监控数据

访问监控平台：`http://localhost:3000`

可以查看：
- 错误统计：查看各类型错误的统计数据
- 性能数据：查看页面性能指标
- 用户行为：查看用户操作记录
- API 调用情况：查看接口调用统计

支持的数据筛选维度：
- 时间范围：今天、昨天、最近7天、最近30天
- 错误类型：语法错误、Promise错误、资源错误等
- 性能指标：API响应时间、页面加载时间等

## SDK 使用说明

### 基础配置

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
        desc: '项目描述'
    },
    debug: true,
    enableTraceId: true,  // 启用追踪ID
    maxBreadcrumbs: 20,   // 设置最大面包屑数量
    ignoreErrors: [],     // 不忽略任何错误
    silentRecordScreen: false,  // 不静默录制
    silentWhiteScreen: false,   // 不静默白屏
    filterXhrUrlRegExp: /.*/    // 监控所有xhr请求
};
```

### 引入 SDK

```html
<script async src="path/to/browser.iife.js"></script>
```

### 初始化

```javascript
// 等待SDK加载完成后初始化
function initSDK() {
    if (window.HEIMDALLR_BROWSER) {
        window.HEIMDALLR_BROWSER(window.__HEIMDALLR_OPTIONS__);
        console.log('SDK initialized successfully');
    } else {
        console.log('SDK not loaded yet, retrying...');
        setTimeout(initSDK, 100);
    }
}

// 监听SDK脚本加载完成
document.querySelector('script[src="path/to/browser.iife.js"]').addEventListener('load', () => {
    console.log('SDK script loaded');
    initSDK();
});
```

### 自定义事件上报

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

## 注意事项

1. 服务启动顺序
   - 先启动服务端（8001端口）
   - 再启动监控平台（3000端口）
   - 最后启动测试页面（3030端口）

2. SDK 配置注意事项
   - host 必须包含 `http://` 或 `https://` 前缀
   - app.name 必须与监控平台显示的应用名称一致
   - debug 模式下会输出更多日志信息

3. 错误监控注意事项
   - 不要在业务代码中过度使用 try-catch，可能会影响错误的自动捕获
   - Promise 错误可能会被捕获两次，这是正常现象
   - 资源加载错误需要完整的 URL 地址才能正确上报

4. 性能监控注意事项
   - 性能测试可能会导致页面暂时无响应
   - 建议在测试时适当调整循环次数
   - 注意观察控制台输出的性能指标

## 常见问题

1. **SDK 无法上报数据**
   - 检查服务端是否正常运行（8001端口）
   - 检查 SDK 配置中的 host 地址是否包含 http:// 前缀
   - 检查网络连接是否正常
   - 查看浏览器控制台是否有错误信息

2. **监控平台无法显示数据**
   - 检查服务端是否正常运行
   - 检查数据库连接是否正常
   - 检查 API 地址配置是否正确
   - 确认应用名称是否与 SDK 配置一致

3. **测试页面问题**
   - 确保 SDK 文件路径正确
   - 检查 SDK 初始化是否成功
   - 观察控制台输出的初始化日志
   - 确认所有测试按钮功能正常

4. **数据统计异常**
   - 检查时间范围选择是否正确
   - 确认筛选条件设置是否合适
   - 查看具体错误日志详情
   - 验证数据库中的原始记录

## 开发计划

- [ ] 支持更多类型的错误监控
- [ ] 优化性能数据采集
- [ ] 增加更多数据分析功能
- [ ] 优化数据可视化展示
- [ ] 添加告警功能
- [ ] 支持自定义错误过滤规则
- [ ] 添加用户行为回放功能
- [ ] 优化大数据量下的性能

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT License