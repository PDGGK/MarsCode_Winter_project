# 项目进度日志

## 当前进度 (2024-02-01)

### ✅ 已完成工作
1. **项目初始化与环境搭建**
   - 确定使用 heimdallr-sdk 作为基础框架
   - 成功将 heimdallr-sdk 作为子模块添加到项目中
   - 清理了不必要的环境文件（Python环境等）

2. **项目结构整理**
   - 完成基础项目结构搭建
   - 确认所有必要组件都已就位：
     - heimdallr-sdk/playground/server（服务端）
     - heimdallr-sdk/playground/manager（管理平台）
     - heimdallr-sdk/playground/mock_app（测试应用）

### 📝 当前项目结构
```
MarsCode_Winter_project/
├── heimdallr-sdk/          # 核心SDK和服务（作为git子模块）
│   ├── playground/         # 包含服务端和管理平台
│   ├── libs/              # SDK核心代码
│   └── docs/              # 文档
├── node_modules/          # Node.js依赖
├── package.json          # 项目配置
├── pnpm-lock.yaml       # 依赖锁定文件
├── README.md            # 项目说明
├── 项目计划.md           # 详细项目计划
└── 项目要求.md           # 原始项目要求
```

## 📋 开发指南

### 1. 环境准备
1. **安装必要工具**
   ```bash
   # 安装 pnpm（如果没有）
   npm install -g pnpm

   # 安装 Node.js (推荐使用 v18 或更高版本)
   # 可以使用 nvm 管理 Node.js 版本
   ```

2. **获取代码**
   ```bash
   # 克隆项目
   git clone https://github.com/PDGGK/MarsCode_Winter_project.git
   cd MarsCode_Winter_project
   
   # 初始化并更新子模块
   git submodule update --init --recursive
   
   # 安装项目依赖
   pnpm install
   ```

### 2. 启动开发环境
1. **启动服务端**
   ```bash
   # 进入服务端目录
   cd heimdallr-sdk/playground/server
   pnpm install
   pnpm run dev
   
   # 服务端默认运行在 http://localhost:3000
   ```

2. **启动管理平台**
   ```bash
   # 进入管理平台目录
   cd ../manager
   pnpm install
   pnpm run dev
   
   # 管理平台默认运行在 http://localhost:5173
   ```

3. **启动测试应用**
   ```bash
   # 进入测试应用目录
   cd ../mock_app
   pnpm install
   pnpm run dev
   
   # 测试应用默认运行在 http://localhost:5174
   ```

### 3. 开发工作流
1. **分支管理**
   ```bash
   # 创建新功能分支
   git checkout -b feature/your-feature-name
   
   # 提交代码
   git add .
   git commit -m "feat: your commit message"
   
   # 推送到远程
   git push origin feature/your-feature-name
   ```

2. **代码提交规范**
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档修改
   - style: 代码格式修改
   - refactor: 代码重构
   - test: 测试用例修改
   - chore: 其他修改

## 🎯 接下来的任务

### 1. 近期任务 (Day 1-3)
- [ ] 完成基础服务的启动和测试
- [ ] 验证管理平台功能
- [ ] 测试数据采集流程

### 2. 功能开发 (Day 4-6)
1. **扩展管理平台功能**
   - [ ] 添加自定义数据看板
   - [ ] 集成白屏检测和性能监控
   - [ ] 添加错误告警功能

2. **SDK二次封装**
   - [ ] 实现通用参数封装
   - [ ] 添加自定义UID生成逻辑
   - [ ] 集成性能监控功能

## 📊 项目进度
- [x] Day 1: 环境搭建 (当前)
- [ ] Day 2-3: 功能测试
- [ ] Day 4-6: 功能优化与扩展
- [ ] Day 7-8: 业务场景开发
- [ ] Day 9-10: 部署与文档

## 🤝 团队分工
- 成员 A：SDK二次封装工作
  - 负责 libs/ 目录下的功能扩展
  - 编写SDK测试用例
  
- 成员 B：服务端部署
  - 负责 server/ 目录的部署和优化
  - 配置数据库和缓存
  
- 成员 C：管理平台功能扩展
  - 负责 manager/ 目录的功能开发
  - 实现自定义看板功能
  
- 成员 D：文档和测试
  - 编写技术文档
  - 设计测试用例
  - 准备演示文稿

## 💡 问题记录
暂无问题。如有问题请在此记录，格式如下：
```
[日期] 问题描述 (提出人)
- 问题状态：待解决/已解决
- 解决方案：xxx
- 相关链接：xxx
``` 