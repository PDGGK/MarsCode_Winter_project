# MarsCode Winter Project

## 快速开始

### 环境要求
- Node.js >= 16
- Git
- npm

### 初始化项目

1. 克隆项目
```bash
git clone https://github.com/PDGGK/MarsCode_Winter_project.git
cd MarsCode_Winter_project
```

2. 运行初始化脚本
```bash
chmod +x setup.sh  # 添加执行权限
./setup.sh
```

注意：在运行 `setup.sh` 时，当看到 "构建SDK..." 提示后：
1. 选择 "客户端" 选项
2. 按回车确认
3. 等待构建完成

### 启动服务

请按照以下顺序启动服务（需要打开三个终端窗口）：

1. 启动服务端（终端1）：
```bash
cd heimdallr-sdk/playground/server
pnpm run dev
```

2. 启动管理平台（终端2）：
```bash
cd heimdallr-sdk/playground/manager
pnpm run dev
```

3. 启动测试应用（终端3）：
```bash
cd heimdallr-sdk/playground/mock_app
pnpm run dev
```

### 访问服务

- 服务端：http://localhost:8000
- 管理平台：http://localhost:3000
- 测试应用：http://localhost:5173

## 常见问题

1. 如果遇到 "No projects matched the filters" 错误：
   - 这是正常的，因为需要在各个子项目目录中分别运行命令
   - 请按照上述 "启动服务" 步骤操作

2. 如果遇到 Prisma 相关错误：
   - 进入服务端目录：`cd heimdallr-sdk/playground/server`
   - 重新生成 Prisma 客户端：`npx prisma generate`
   - 推送数据库架构：`npx prisma db push`

3. 如果遇到依赖包解析错误：
   - 确保已经正确构建了 SDK（选择"客户端"选项）
   - 如果问题仍然存在，可以尝试重新运行 `setup.sh`

# MarsCode Analytics 埋点系统

一个轻量级、高性能的前端埋点解决方案，基于 heimdallr-sdk 和 Ant Design Pro 构建。

## 📚 项目概述

MarsCode Analytics 是一个完整的埋点研发体系，提供项目用户行为分析、性能监控和报警监控的能力。系统包含三个核心模块：
- 埋点 SDK
- 埋点数据服务
- 埋点平台（数据看板）

## ✨ 核心功能

### 埋点 SDK
- 🔄 事件上报
- 📝 页面初始化配置
- 🔧 通用参数管理
- 📱 用户环境信息采集
- ⚠️ 错误自动捕获

### 埋点数据服务
- 📊 高效的数据存储方案
- 🚀 优化的查询性能
- 🔍 灵活的事件管理

### 埋点平台
- 📈 PV/UV 数据统计
- 🎛️ 事件管理界面
- 🔎 多维度数据筛选
- 📊 可视化数据图表

## 🛠️ 技术栈

- 前端：React + Ant Design Pro
- SDK：TypeScript
- 后端：Node.js
- 数据库：PostgreSQL
- 部署：Vercel + Railway

## 🚀 快速开始

### 1. 克隆项目
```bash
# 前端项目
git clone https://github.com/your-username/marscode-analytics.git

# 服务端
git clone https://github.com/heimdallr-sdk/heimdallr-server.git
```

### 2. 安装依赖
```bash
# 前端
cd marscode-analytics
npm install

# 服务端
cd server
npm install
```

### 3. SDK 接入
```typescript
// 初始化
import { register } from '@marscode/analytics'

register({
    project_id: 'your-project-id',
    upload_percent: 0.1
})

// 事件上报
import { sendEvent } from '@marscode/analytics'

sendEvent('BUTTON_CLICK', {
    button_id: 'submit_btn',
    page_url: window.location.href
})
```

### 4. 启动服务
```bash
# 前端开发
npm run dev

# 服务端（需要 Docker）
docker-compose up -d
```

## 📦 部署

### 前端部署
1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

### 服务端部署
1. 在 Railway 创建新项目
2. 绑定 PostgreSQL
3. 配置环境变量
4. 自动部署完成

## 📝 开发规范

1. 代码规范
   - 使用 ESLint + Prettier
   - 遵循 TypeScript 类型安全
   - 编写完整的注释

2. Git 提交规范
   - feat: 新功能
   - fix: 修复
   - docs: 文档
   - style: 格式
   - refactor: 重构
   - test: 测试
   - chore: 构建

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

## 📄 许可证

[MIT License](LICENSE)