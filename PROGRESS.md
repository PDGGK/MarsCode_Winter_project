# 项目进度记录

## 已完成工作
- [x] 2024-01-31: 项目启动，确定项目需求和目标
- [x] 2024-02-01: 确定使用 heimdallr-sdk 作为基础框架
- [x] 2024-02-01: 完成项目初始化和基础配置
- [x] 2024-02-01: 创建项目计划文档
- [x] 2024-02-01: 建立基本的工作空间结构
- [x] 2024-02-01: 初始化并更新 heimdallr-sdk 子模块
- [x] 2024-02-01: 安装项目依赖
- [x] 2024-02-01: 启动基础服务（服务端、管理平台、测试应用）
- [x] 2024-02-01: 创建自动化初始化脚本 setup.sh
- [x] 2024-02-01: 完善项目文档，添加子模块开发说明

## 当前阶段：环境搭建与功能测试 (Day 1-3)

### 已完成任务
- [x] 启动基础服务
  - [x] 克隆并启动 heimdallr-sdk 服务端
  - [x] 启动管理平台
  - [x] 创建测试应用

### 下一步计划
1. **验证服务可用性**
   - 检查服务端是否正常运行（http://localhost:8000）
   - 检查管理平台是否可访问（http://localhost:3000）
   - 检查测试应用是否可访问（http://localhost:5173）

2. **测试基本功能**
   - 测试埋点事件上报
   - 验证数据是否正确存储
   - 检查管理平台数据展示

3. **记录问题和解决方案**
   - 记录启动过程中遇到的问题
   - 记录解决方案
   - 更新文档

## 项目时间线
- Day 1-3: 环境搭建与功能测试 【当前】
- Day 4-6: 功能优化与扩展
- Day 7-8: 业务场景开发
- Day 9-10: 部署与文档

## 注意事项
1. 确保所有服务都能正常启动和运行
2. 记录遇到的问题和解决方案
3. 保持与团队的沟通，同步进度
4. 注意 heimdallr-sdk 项目使用 pnpm 作为包管理器
5. 需要在根目录先安装依赖，再在各个子项目中安装依赖

## 待办事项
- [x] 完成基础服务的启动
- [ ] 验证各个服务之间的连通性
- [ ] 准备测试用例
- [ ] 记录服务启动过程中的注意事项

## 服务访问信息
- 服务端：http://localhost:8000
- 管理平台：http://localhost:3000
- 测试应用：http://localhost:5173

## 目录结构说明
```
heimdallr-sdk/
├── playground/
│   ├── server/          # 基础服务端
│   ├── server_producer/ # 消息队列生产者服务
│   ├── server_consumer/ # 消息队列消费者服务
│   ├── manager/         # 管理平台
│   └── mock_app/        # 测试应用
```

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

### [2024-02-01] 数据库配置问题 (Jason)
- **问题描述**：服务端数据库配置使用 MySQL，但未安装 MySQL 服务
- **问题状态**：已解决
- **解决方案**：修改 schema.prisma 配置，改用 SQLite 数据库
  ```prisma
  datasource db {
      provider = "sqlite"
      url      = "file:./dev.db"
  }
  ```

### [2024-02-01] 服务端口冲突问题 (Jason)
- **问题描述**：默认端口被占用，需要使用新的端口
- **问题状态**：已解决
- **解决方案**：
  1. 服务器：使用 8003 端口（原计划 8001）
  2. 管理平台：使用 3002 端口（原计划 3000）
  3. 测试应用：使用 5175 端口（原计划 5173）
  4. 更新了 mock_app 的代理配置以匹配新的端口

### [2024-02-01] 服务启动问题 (Jason)
- **问题描述**：在项目根目录运行 `pnpm run dev` 时出现 "No projects matched the filters" 错误
- **问题状态**：已解决
- **解决方案**：需要分别在各个子项目目录中运行服务，而不是在根目录运行
  1. 启动服务端：`cd heimdallr-sdk/playground/server && pnpm run dev`
  2. 启动管理平台：`cd heimdallr-sdk/playground/manager && pnpm run dev`
  3. 启动测试应用：`cd heimdallr-sdk/playground/mock_app && pnpm run dev`
- **注意事项**：
  - 确保按照顺序启动服务
  - 每个服务需要在独立的终端窗口中运行
  - 启动前确保已在各目录中安装了依赖（pnpm install）

### [2024-02-01] 服务端 Prisma 初始化问题 (Jason)
- **问题描述**：服务端启动时报错 "@prisma/client did not initialize yet"
- **问题状态**：已解决
- **解决方案**：
  1. 进入服务端目录：`cd heimdallr-sdk/playground/server`
  2. 执行 Prisma 生成命令：`npx prisma generate`
  3. 重新启动服务端：`pnpm run dev`

### [2024-02-01] 测试应用源码映射插件问题 (Jason)
- **问题描述**：测试应用启动时报错 "Failed to resolve entry for package @heimdallr-sdk/vite-plugin-sourcemap-upload"
- **问题状态**：已解决
- **解决方案**：
  1. 暂时在 `vite.config.ts` 中注释掉 sourceMapUpload 插件相关配置
  2. 重新启动测试应用

### [2024-02-01] 测试应用配置问题 (Jason)
- **问题描述**：测试应用启动失败，配置中包含了不必要的代理设置和未实现的插件
- **问题状态**：已解决
- **解决方案**：
  1. 修改 `vite.config.ts`，移除不必要的代理设置
  2. 注释掉未实现的源码映射插件
  3. 明确指定端口号为 5173
  4. 重启测试应用

### [2024-02-01] 服务端端口配置问题 (Jason)
- **问题描述**：测试应用配置中使用了错误的服务端端口（8001），导致无法连接
- **问题状态**：已解决
- **解决方案**：
  1. 修改 `mock_app/src/main.tsx` 中的服务端配置：
     ```typescript
     dsn: {
       host: 'localhost:8000',  // 从 8001 改为 8000
       init: '/project/init',
       report: '/log/report'
     }
     ```
  2. 重新启动测试应用

### [2024-02-01] 测试应用依赖解析问题 (Jason)
- **问题描述**：测试应用启动时报错 "Failed to resolve entry for package @heimdallr-sdk/utils"
- **问题状态**：已解决
- **解决方案**：
  1. 先构建基础依赖包：
     ```bash
     cd heimdallr-sdk
     pnpm run build  # 选择"客户端"选项
     ```
  2. 修改 `vite.config.ts` 配置，添加本地包的路径解析：
     ```typescript
     resolve: {
       alias: {
         '@heimdallr-sdk/utils': path.resolve(__dirname, '../../libs/utils/esm'),
         '@heimdallr-sdk/browser': path.resolve(__dirname, '../../clients/browser/esm'),
         // ... 其他包的路径配置
       }
     }
     ```
  3. 移除 sourcemap 插件相关配置
  4. 重新启动测试应用

### [2024-02-01] 子模块管理流程确立 (Jason)
- **说明**：确定了团队如何管理和同步子模块修改的流程
- **状态**：已完成
- **主要内容**：
  1. 建立了子模块修改的标准流程
  2. 在 README.md 中添加了详细的子模块开发说明
  3. 创建了 setup.sh 脚本，简化项目初始化过程
- **注意事项**：
  - 所有子模块修改都需要在主项目中更新引用
  - 团队成员需要了解如何同步他人的子模块修改
  - 不要尝试直接推送到原始的 heimdallr-sdk 仓库

### 今日工作总结 (2024-02-01)
1. **环境配置与服务启动**
   - 完成服务端 Prisma 数据库初始化
   - 成功启动管理平台服务（http://localhost:3000）
   - 解决测试应用的依赖问题

2. **SDK构建与配置**
   - 构建了所有客户端SDK相关的包
   - 配置了本地包的路径解析
   - 优化了测试应用的配置

3. **文档和流程优化**
   - 创建了项目初始化脚本 setup.sh
   - 完善了 README.md，添加了详细的启动说明
   - 建立了子模块开发流程文档
   - 更新了项目进度记录

4. **问题解决**
   - 解决了 Prisma 初始化问题
   - 解决了本地包依赖解析问题
   - 处理了 sourcemap 插件配置问题
   - 建立了子模块修改的标准流程

### 下一步计划
1. **功能验证**
   - 验证埋点数据上报功能
   - 测试数据存储和展示
   - 检查各服务之间的通信

2. **性能优化**
   - 优化构建配置
   - 提升服务启动速度
   - 完善错误处理机制

### 服务启动顺序说明
为确保服务正常运行，请按以下顺序启动服务：

1. **服务端**（8000端口）
   ```bash
   cd heimdallr-sdk/playground/server
   npx prisma generate    # 生成 Prisma 客户端
   npx prisma db push     # 推送数据库架构
   pnpm run dev           # 启动服务
   ```

2. **管理平台**（3000端口）
   ```bash
   cd heimdallr-sdk/playground/manager
   pnpm run dev
   ```

3. **测试应用**（5173端口）
   ```bash
   cd heimdallr-sdk/playground/mock_app
   pnpm run dev
   ```

### 配置检查清单
- [ ] 服务端配置
  - [x] Prisma 使用 SQLite 数据库
  - [x] 数据库架构已正确推送
  - [x] 服务运行在 8000 端口

- [ ] 管理平台配置
  - [x] 运行在 3000 端口
  - [ ] 能够连接到服务端

- [ ] 测试应用配置
  - [x] 运行在 5173 端口
  - [x] 服务端地址配置正确（localhost:8000）
  - [ ] 能够正常发送埋点数据

### 下一步操作建议
1. 确认所有服务都已正确启动
2. 在测试应用中尝试触发一些事件，验证埋点数据是否正确发送
3. 在管理平台中查看是否能收到埋点数据
4. 如果仍有问题，检查各服务的日志输出

## 服务启动检查清单
- [x] 服务端是否可以访问 (http://localhost:8000)
- [x] 管理平台是否可以访问 (http://localhost:3000)
- [x] 测试应用是否可以访问 (http://localhost:5173)
- [ ] 各服务之间是否可以正常通信

## 待解决问题
1. 源码映射插件的问题需要后续解决，可能需要：
   - 检查插件的构建状态
   - 确认插件的依赖关系
   - 考虑是否需要重新构建插件

## 下一步操作建议
1. 验证三个服务是否都可以正常访问和使用
2. 测试服务之间的通信是否正常
3. 开始进行基本功能测试
4. 后续需要解决源码映射插件的问题 