#!/bin/bash

# 错误处理函数
handle_error() {
    echo "错误: $1"
    exit 1
}

echo "正在初始化项目..."

# 检查必要的命令是否存在
command -v node >/dev/null 2>&1 || handle_error "请先安装 Node.js (>= 16)"
command -v git >/dev/null 2>&1 || handle_error "请先安装 Git"

# 安装全局依赖
echo "安装全局依赖..."
npm install -g pnpm || handle_error "pnpm 安装失败"

# 初始化子模块
echo "初始化子模块..."
git submodule update --init --recursive || handle_error "子模块初始化失败"

# 安装项目依赖
echo "安装项目依赖..."
pnpm install || handle_error "项目依赖安装失败"

# 进入heimdallr-sdk目录
cd heimdallr-sdk || handle_error "无法进入 heimdallr-sdk 目录"

# 构建SDK
echo "构建SDK..."
echo "注意：接下来需要手动操作："
echo "1. 在选项中选择「客户端」"
echo "2. 按回车确认"
echo "3. 等待构建完成"
pnpm run build || handle_error "SDK 构建失败"

# 初始化服务端
echo "初始化服务端..."
cd playground/server || handle_error "无法进入服务端目录"
pnpm install || handle_error "服务端依赖安装失败"
npx prisma generate || handle_error "Prisma 客户端生成失败"
npx prisma db push || handle_error "数据库初始化失败"

# 初始化管理平台
echo "初始化管理平台..."
cd ../manager || handle_error "无法进入管理平台目录"
pnpm install || handle_error "管理平台依赖安装失败"

# 初始化测试应用
echo "初始化测试应用..."
cd ../mock_app || handle_error "无法进入测试应用目录"
pnpm install || handle_error "测试应用依赖安装失败"

echo "✅ 初始化完成！"
echo ""
echo "📝 使用说明："
echo "1. 启动服务端: cd heimdallr-sdk/playground/server && pnpm run dev"
echo "   - 访问地址: http://localhost:8001"
echo ""
echo "2. 启动管理平台: cd heimdallr-sdk/playground/manager && pnpm run dev"
echo "   - 访问地址: http://localhost:3000"
echo ""
echo "3. 启动测试应用: cd heimdallr-sdk/playground/mock_app && pnpm run dev"
echo "   - 访问地址: http://localhost:5173"
echo ""
echo "❗注意事项："
echo "- 请按照上述顺序启动服务"
echo "- 如果遇到端口占用，可以在各自的配置文件中修改端口号"
echo "- 如果遇到问题，请查看 README.md 中的常见问题解决方案" 