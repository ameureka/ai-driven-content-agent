#!/bin/bash

# AI Driven Content Agent - 生产环境快速部署脚本
# 用于快速部署到 Cloudflare Workers 生产环境

set -e  # 遇到错误立即退出

echo "🚀 AI Driven Content Agent - 生产环境快速部署"
echo "================================================"

# 检查必要工具
echo "📋 检查必要工具..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi
echo "✅ npm 版本: $(npm --version)"

# 检查 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler 未安装，正在安装..."
    npm install -g wrangler
fi
echo "✅ Wrangler 版本: $(wrangler --version)"

# 检查 Cloudflare 登录状态
echo "\n🔐 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ 未登录 Cloudflare，请先登录"
    echo "   运行: wrangler login"
    exit 1
fi
echo "✅ 已登录 Cloudflare"

# 安装依赖
echo "\n📦 安装项目依赖..."
npm install
echo "✅ 依赖安装完成"

# 检查配置文件
echo "\n⚙️  检查配置文件..."
if [ ! -f "wrangler.toml" ]; then
    echo "❌ wrangler.toml 配置文件不存在"
    exit 1
fi
echo "✅ wrangler.toml 配置文件存在"

# 检查环境变量
echo "\n🔑 检查生产环境变量..."
echo "请确保已设置以下 secrets:"
echo "  - DIFY_API_KEY"
echo "  - DIFY_ARTICLE_API_KEY"
echo "  - API_KEY"

read -p "是否已设置所有必要的 secrets? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "\n📝 设置 secrets 指南:"
    echo "  wrangler secret put DIFY_API_KEY"
    echo "  wrangler secret put DIFY_ARTICLE_API_KEY"
    echo "  wrangler secret put API_KEY"
    echo "\n请设置完成后重新运行此脚本"
    exit 1
fi

# 检查 KV 命名空间
echo "\n🗄️  检查 KV 命名空间..."
KV_ID=$(grep -A3 "\[\[kv_namespaces\]\]" wrangler.toml | grep "^[[:space:]]*id[[:space:]]*=" | cut -d'"' -f2)
if [ -z "$KV_ID" ]; then
    echo "❌ KV 命名空间 ID 未配置"
    echo "正在创建 KV 命名空间..."
    wrangler kv namespace create MARKDOWN_KV
    echo "请手动更新 wrangler.toml 中的 KV 命名空间 ID"
    exit 1
else
    # 验证 KV 命名空间是否真实存在
    if wrangler kv namespace list | grep -q "$KV_ID"; then
        echo "✅ KV 命名空间已配置且存在: $KV_ID"
    else
        echo "❌ KV 命名空间 ID 配置错误，命名空间不存在"
        echo "正在创建新的 KV 命名空间..."
        wrangler kv namespace create MARKDOWN_KV
        echo "请手动更新 wrangler.toml 中的 KV 命名空间 ID"
        exit 1
    fi
fi

# 检查 R2 存储桶
echo "\n📦 检查 R2 存储桶..."
BUCKET_NAME=$(grep -A2 "\[\[r2_buckets\]\]" wrangler.toml | grep "bucket_name" | cut -d'"' -f2)
if [ -z "$BUCKET_NAME" ]; then
    echo "❌ R2 存储桶未配置"
    exit 1
fi
echo "✅ R2 存储桶已配置: $BUCKET_NAME"

# 运行测试（可选）
echo "\n🧪 是否运行测试?"
read -p "运行测试以确保代码质量? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在运行测试..."
    npm test
    echo "✅ 测试通过"
fi

# 构建项目（如果有构建脚本）
if npm run | grep -q "build"; then
    echo "\n🔨 构建项目..."
    npm run build
    echo "✅ 构建完成"
fi

# 部署到生产环境
echo "\n🚀 部署到 Cloudflare Workers 生产环境..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo "\n🎉 部署成功！"
    echo "================================================"
    
    # 获取部署 URL
    WORKER_NAME=$(grep "name" wrangler.toml | cut -d'"' -f4)
    ACCOUNT_ID=$(wrangler whoami | grep "Account ID" | awk '{print $NF}')
    
    echo "📍 生产环境访问地址:"
    echo "   https://$WORKER_NAME.yalinwang2.workers.dev"
    echo ""
    echo "🔧 管理面板:"
    echo "   https://dash.cloudflare.com/$ACCOUNT_ID/workers/services/view/$WORKER_NAME"
    echo ""
    echo "📊 监控和日志:"
    echo "   wrangler tail"
    echo ""
    echo "🔄 更新部署:"
    echo "   ./quick-start-main.sh"
    echo ""
    echo "✨ 部署完成！您的 AI 内容代理已在生产环境中运行。"
else
    echo "\n❌ 部署失败，请检查错误信息"
    exit 1
fi