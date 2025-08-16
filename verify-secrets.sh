#!/bin/bash

# ================================
# 密钥验证脚本
# ================================

echo "========================================"
echo "🔐 密钥配置验证脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: 检查本地开发环境
echo -e "${YELLOW}📋 检查本地开发环境 (.dev.vars)${NC}"
echo "----------------------------------------"
if [ -f ".dev.vars" ]; then
    echo -e "${GREEN}✅ .dev.vars 文件存在${NC}"
    echo "配置的密钥："
    grep -E "^[A-Z_]+=" .dev.vars | sed 's/=.*/=***/' | while read line; do
        echo "  - $line"
    done
else
    echo -e "${RED}❌ .dev.vars 文件不存在${NC}"
    echo "提示：复制 .dev.vars.example 并配置："
    echo "  cp .dev.vars.example .dev.vars"
fi
echo ""

# Step 2: 检查生产环境密钥
echo -e "${YELLOW}📋 检查生产环境密钥 (Cloudflare Secrets)${NC}"
echo "----------------------------------------"
if ! wrangler whoami &>/dev/null; then
    echo -e "${RED}❌ 未登录 Cloudflare${NC}"
    echo "请运行: wrangler login"
    exit 1
fi

echo "已配置的 Secrets："
wrangler secret list 2>/dev/null | grep -o '"[^"]*"' | tr -d '"' | while read secret; do
    echo -e "  ${GREEN}✅${NC} $secret"
done

# 检查必需的密钥
echo ""
echo "验证必需的密钥："
REQUIRED_SECRETS=("API_KEY" "DIFY_API_KEY" "DIFY_ARTICLE_API_KEY")
MISSING_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if wrangler secret list 2>/dev/null | grep -q "\"$secret\""; then
        echo -e "  ${GREEN}✅${NC} $secret - 已配置"
    else
        echo -e "  ${RED}❌${NC} $secret - 未配置"
        MISSING_SECRETS+=($secret)
    fi
done

# Step 3: 测试 API
echo ""
echo -e "${YELLOW}📋 测试 API 端点${NC}"
echo "----------------------------------------"

# 测试本地环境
echo "测试本地环境 (http://localhost:8787):"
if curl -s http://localhost:8787/api/v1/status 2>/dev/null | grep -q "healthy"; then
    echo -e "  ${GREEN}✅ 本地 API 正常${NC}"
else
    echo -e "  ${YELLOW}⚠️  本地服务未运行或无法访问${NC}"
    echo "  提示：运行 npm run dev 启动本地服务"
fi

# 测试生产环境
echo ""
echo "测试生产环境:"
PROD_URL="https://ai-driven-content-agent.yalinwang2.workers.dev"
response=$(curl -s -w "\n%{http_code}" "$PROD_URL/api/v1/status" 2>/dev/null)
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ] && echo "$body" | grep -q "healthy"; then
    echo -e "  ${GREEN}✅ 生产 API 正常${NC}"
    echo "  URL: $PROD_URL"
elif [ "$http_code" = "000" ]; then
    echo -e "  ${RED}❌ 无法连接到生产环境${NC}"
    echo "  可能尚未部署，运行: npm run deploy"
else
    echo -e "  ${YELLOW}⚠️  生产 API 返回异常 (HTTP $http_code)${NC}"
fi

# Step 4: 提供修复建议
echo ""
echo "========================================"
if [ ${#MISSING_SECRETS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ 所有必需的密钥已配置${NC}"
else
    echo -e "${YELLOW}⚠️  缺少以下密钥配置：${NC}"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "  - $secret"
    done
    echo ""
    echo "修复步骤："
    echo "1. 设置缺失的密钥："
    for secret in "${MISSING_SECRETS[@]}"; do
        case $secret in
            "API_KEY")
                echo "   wrangler secret put API_KEY  # 输入: aiwenchuang"
                ;;
            "DIFY_API_KEY")
                echo "   wrangler secret put DIFY_API_KEY  # 输入你的 Dify URL 工作流密钥"
                ;;
            "DIFY_ARTICLE_API_KEY")
                echo "   wrangler secret put DIFY_ARTICLE_API_KEY  # 输入你的 Dify 文章工作流密钥"
                ;;
        esac
    done
    echo ""
    echo "2. 重新部署："
    echo "   npm run deploy"
    echo ""
    echo "3. 验证："
    echo "   ./verify-secrets.sh"
fi
echo "========================================"
echo ""