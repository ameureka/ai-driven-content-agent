#!/bin/bash

# ================================
# 完整部署脚本 - AI驱动内容代理
# ================================

set -e  # 遇到错误立即退出

echo "========================================"
echo "🚀 AI驱动内容代理 - 完整部署脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 未安装${NC}"
        exit 1
    fi
}

# Step 1: 环境检查
echo -e "${YELLOW}📋 Step 1: 环境检查${NC}"
echo "----------------------------------------"
check_command "wrangler"
check_command "npm"
echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# Step 2: 检查登录状态
echo -e "${YELLOW}📋 Step 2: 检查 Cloudflare 登录状态${NC}"
echo "----------------------------------------"
if ! wrangler whoami &>/dev/null; then
    echo "需要登录 Cloudflare..."
    wrangler login
fi
echo -e "${GREEN}✅ 已登录 Cloudflare${NC}"
echo ""

# Step 3: 安装依赖
echo -e "${YELLOW}📋 Step 3: 安装项目依赖${NC}"
echo "----------------------------------------"
npm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# Step 4: 创建/验证 KV 命名空间
echo -e "${YELLOW}📋 Step 4: 配置 KV 命名空间${NC}"
echo "----------------------------------------"
if ! wrangler kv:namespace list | grep -q "MARKDOWN_KV"; then
    echo "创建 KV 命名空间..."
    wrangler kv:namespace create "MARKDOWN_KV"
    echo -e "${YELLOW}⚠️  请更新 wrangler.toml 中的 KV namespace ID${NC}"
else
    echo -e "${GREEN}✅ KV 命名空间已存在${NC}"
fi
echo ""

# Step 5: 创建/验证 R2 Buckets
echo -e "${YELLOW}📋 Step 5: 配置 R2 存储桶${NC}"
echo "----------------------------------------"
# 生产环境 R2
if ! wrangler r2 bucket list | grep -q "ai-driven-content-agent-assets"; then
    echo "创建生产环境 R2 存储桶..."
    wrangler r2 bucket create ai-driven-content-agent-assets
fi
# 开发环境 R2
if ! wrangler r2 bucket list | grep -q "ai-driven-content-agent-assets-dev"; then
    echo "创建开发环境 R2 存储桶..."
    wrangler r2 bucket create ai-driven-content-agent-assets-dev
fi
echo -e "${GREEN}✅ R2 存储桶配置完成${NC}"
echo ""

# Step 6: 上传静态资源
echo -e "${YELLOW}📋 Step 6: 上传静态资源${NC}"
echo "----------------------------------------"
if [ -d "./public" ]; then
    echo "上传到生产环境..."
    wrangler r2 object put ai-driven-content-agent-assets/index.html --file ./public/index.html --content-type "text/html"
    wrangler r2 object put ai-driven-content-agent-assets/styles.css --file ./public/styles.css --content-type "text/css"
    wrangler r2 object put ai-driven-content-agent-assets/script.js --file ./public/script.js --content-type "application/javascript"
    wrangler r2 object put ai-driven-content-agent-assets/wiki.html --file ./public/wiki.html --content-type "text/html" 2>/dev/null || true
    
    echo "上传到开发环境..."
    wrangler r2 object put ai-driven-content-agent-assets-dev/index.html --file ./public/index.html --content-type "text/html"
    wrangler r2 object put ai-driven-content-agent-assets-dev/styles.css --file ./public/styles.css --content-type "text/css"
    wrangler r2 object put ai-driven-content-agent-assets-dev/script.js --file ./public/script.js --content-type "application/javascript"
    wrangler r2 object put ai-driven-content-agent-assets-dev/wiki.html --file ./public/wiki.html --content-type "text/html" 2>/dev/null || true
    echo -e "${GREEN}✅ 静态资源上传完成${NC}"
else
    echo -e "${YELLOW}⚠️  public 目录不存在，跳过静态资源上传${NC}"
fi
echo ""

# Step 7: 部署 Worker
echo -e "${YELLOW}📋 Step 7: 部署 Worker${NC}"
echo "----------------------------------------"
wrangler deploy
echo -e "${GREEN}✅ Worker 部署成功${NC}"
echo ""

# Step 8: 配置 Secrets
echo -e "${YELLOW}📋 Step 8: 配置密钥（Secrets）${NC}"
echo "----------------------------------------"
echo "检查必需的密钥配置..."

# 检查并设置密钥的函数
check_and_set_secret() {
    local SECRET_NAME=$1
    local SECRET_DESC=$2
    local DEFAULT_VALUE=$3
    
    # 检查密钥是否已存在
    if wrangler secret list 2>/dev/null | grep -q "\"$SECRET_NAME\""; then
        echo -e "${GREEN}✅ $SECRET_NAME 已配置${NC}"
        read -p "是否要更新 $SECRET_NAME? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if [ -n "$DEFAULT_VALUE" ]; then
                echo "默认值: $DEFAULT_VALUE"
            fi
            echo "请输入 $SECRET_DESC:"
            wrangler secret put $SECRET_NAME
        fi
    else
        echo -e "${YELLOW}⚠️  $SECRET_NAME 未配置${NC}"
        if [ -n "$DEFAULT_VALUE" ]; then
            echo "默认值: $DEFAULT_VALUE"
        fi
        echo "请输入 $SECRET_DESC:"
        wrangler secret put $SECRET_NAME
    fi
}

# 配置必需的密钥
check_and_set_secret "API_KEY" "系统API密钥" "aiwenchuang"
check_and_set_secret "DIFY_API_KEY" "Dify URL工作流密钥" ""
check_and_set_secret "DIFY_ARTICLE_API_KEY" "Dify 文章工作流密钥" ""

echo -e "${GREEN}✅ 密钥配置完成${NC}"
echo ""

# Step 9: 验证部署
echo -e "${YELLOW}📋 Step 9: 验证部署${NC}"
echo "----------------------------------------"
WORKER_URL="https://ai-driven-content-agent.yalinwang2.workers.dev"
echo "测试 API 状态..."
if curl -s "$WORKER_URL/api/v1/status" | grep -q "healthy"; then
    echo -e "${GREEN}✅ API 状态正常${NC}"
else
    echo -e "${YELLOW}⚠️  API 状态检查失败，请手动验证${NC}"
fi
echo ""

# 完成
echo "========================================"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "========================================"
echo ""
echo "📌 重要信息："
echo "----------------------------------------"
echo "Worker URL: $WORKER_URL"
echo "API 端点: $WORKER_URL/api/v1"
echo "文档: $WORKER_URL/wiki"
echo ""
echo "📝 下一步："
echo "1. 测试 API: curl $WORKER_URL/api/v1/status"
echo "2. 查看日志: wrangler tail"
echo "3. 访问前端: $WORKER_URL"
echo ""
echo "⚠️  注意事项："
echo "- 确保所有密钥已正确设置"
echo "- 如果遇到问题，运行: wrangler tail 查看日志"
echo "- 更新密钥: wrangler secret put <SECRET_NAME>"
echo ""