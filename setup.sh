#!/bin/bash

echo "正在初始化项目..."

# 安装全局依赖
echo "安装全局依赖..."
npm install -g pnpm

# 初始化子模块
echo "初始化子模块..."
git submodule update --init --recursive

# 安装项目依赖
echo "安装项目依赖..."
pnpm install

# 进入heimdallr-sdk目录
cd heimdallr-sdk

# 构建SDK
echo "构建SDK..."
pnpm run build  # 注意：这里需要手动选择"客户端"选项

# 初始化服务端
echo "初始化服务端..."
cd playground/server
pnpm install
npx prisma generate
npx prisma db push

# 初始化管理平台
echo "初始化管理平台..."
cd ../manager
pnpm install

# 初始化测试应用
echo "初始化测试应用..."
cd ../mock_app
pnpm install

echo "初始化完成！"
echo "请按照以下顺序启动服务："
echo "1. 启动服务端: cd heimdallr-sdk/playground/server && pnpm run dev"
echo "2. 启动管理平台: cd heimdallr-sdk/playground/manager && pnpm run dev"
echo "3. 启动测试应用: cd heimdallr-sdk/playground/mock_app && pnpm run dev" 