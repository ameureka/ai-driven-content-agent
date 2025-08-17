#!/bin/bash

# ================================
# 安全部署脚本 - 带账号验证
# ================================

set -e  # 遇到错误立即退出

echo "========================================"
echo "🛡️  AI驱动内容代理 - 安全部署脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
EXPECTED_ACCOUNT_ID="81bfd636a0639bbac8d0e47dcb81be73"
WORKER_NAME="ai-driven-content-agent"
WORKER_URL="https://ai-driven-content-agent.yalinwang2.workers.dev"

# ========================================
# Step 1: 账号验证（最重要）
# ========================================
echo -e "${BLUE}🔐 Step 1: Cloudflare 账号验证${NC}"
echo "----------------------------------------"

# 检查是否已登录
if ! wrangler whoami &>/dev/null; then
    echo -e "${YELLOW}⚠️  未登录 Cloudflare${NC}"
    echo "请登录到正确的账号..."
    wrangler login
fi

# 获取当前账号信息
echo "获取当前账号信息..."
ACCOUNT_INFO=$(wrangler whoami 2>&1 || true)
echo "$ACCOUNT_INFO" | grep -E "Account|Email" | head -5

# 提取当前账号ID
CURRENT_ACCOUNT_ID=$(echo "$ACCOUNT_INFO" | grep -oE '[0-9a-f]{32}' | head -1)

# 验证账号ID是否匹配
echo ""
echo "账号ID验证："
echo "期望的账号ID: ${EXPECTED_ACCOUNT_ID}"
echo "当前账号ID:   ${CURRENT_ACCOUNT_ID}"

if [ "$CURRENT_ACCOUNT_ID" != "$EXPECTED_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ 账号不匹配！${NC}"
    echo ""
    echo "当前登录的账号ID与项目配置不符。"
    echo ""
    echo "请选择操作："
    echo "1) 切换到正确的账号 (推荐)"
    echo "2) 更新项目配置使用当前账号"
    echo "3) 退出"
    echo ""
    read -p "请输入选择 (1/2/3): " choice
    
    case $choice in
        1)
            echo "正在退出当前账号..."
            wrangler logout
            echo ""
            echo "请登录到正确的账号（账号ID应为: ${EXPECTED_ACCOUNT_ID}）"
            wrangler login
            
            # 重新验证
            ACCOUNT_INFO=$(wrangler whoami 2>&1 || true)
            CURRENT_ACCOUNT_ID=$(echo "$ACCOUNT_INFO" | grep -oE '[0-9a-f]{32}' | head -1)
            
            if [ "$CURRENT_ACCOUNT_ID" != "$EXPECTED_ACCOUNT_ID" ]; then
                echo -e "${RED}❌ 账号仍然不匹配，请检查后重试${NC}"
                exit 1
            fi
            echo -e "${GREEN}✅ 已切换到正确的账号${NC}"
            ;;
        2)
            echo "更新 wrangler.toml 配置..."
            sed -i.backup "s/account_id = \".*\"/account_id = \"$CURRENT_ACCOUNT_ID\"/" wrangler.toml
            echo -e "${GREEN}✅ 已更新配置文件（备份保存为 wrangler.toml.backup）${NC}"
            EXPECTED_ACCOUNT_ID=$CURRENT_ACCOUNT_ID
            ;;
        3)
            echo "退出部署..."
            exit 0
            ;;
        *)
            echo -e "${RED}无效的选择，退出部署${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${GREEN}✅ 账号验证通过${NC}"
fi

echo ""

# ========================================
# Step 2: 环境检查
# ========================================
echo -e "${BLUE}📋 Step 2: 环境检查${NC}"
echo "----------------------------------------"

# 检查必需的命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 未安装${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ $1 已安装${NC}"
    fi
}

check_command "wrangler"
check_command "npm"
check_command "node"

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
echo "Node.js 版本: v$NODE_VERSION"

echo ""

# ========================================
# Step 3: 项目依赖
# ========================================
echo -e "${BLUE}📦 Step 3: 安装项目依赖${NC}"
echo "----------------------------------------"
npm install --silent
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# ========================================
# Step 4: KV 命名空间检查
# ========================================
echo -e "${BLUE}🗂️  Step 4: 检查 KV 命名空间${NC}"
echo "----------------------------------------"

# 检查 KV 命名空间是否存在
echo "检查 MARKDOWN_KV 命名空间..."
if wrangler kv namespace list 2>/dev/null | grep -q "MARKDOWN_KV"; then
    echo -e "${GREEN}✅ KV 命名空间已存在${NC}"
else
    echo -e "${YELLOW}⚠️  KV 命名空间不存在${NC}"
    echo "创建 KV 命名空间..."
    
    # 创建生产环境 KV
    KV_CREATE_OUTPUT=$(wrangler kv namespace create "MARKDOWN_KV" 2>&1)
    echo "$KV_CREATE_OUTPUT"
    
    # 提取 ID
    KV_ID=$(echo "$KV_CREATE_OUTPUT" | grep -oE 'id = "[^"]*"' | cut -d'"' -f2)
    
    if [ -n "$KV_ID" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  请更新 wrangler.toml 中的 KV namespace ID：${NC}"
        echo "[[kv_namespaces]]"
        echo "binding = \"MARKDOWN_KV\""
        echo "id = \"$KV_ID\""
        echo ""
        read -p "是否自动更新 wrangler.toml? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # 备份并更新配置
            cp wrangler.toml wrangler.toml.kv-backup
            sed -i "s/id = \"354c4fd9feef47aeb5dd6f1885c164b3\"/id = \"$KV_ID\"/" wrangler.toml
            echo -e "${GREEN}✅ 已更新 wrangler.toml${NC}"
        fi
    fi
fi
echo ""

# ========================================
# Step 5: R2 存储桶检查
# ========================================
echo -e "${BLUE}📦 Step 5: 检查 R2 存储桶${NC}"
echo "----------------------------------------"

# 检查 R2 存储桶
check_r2_bucket() {
    local BUCKET_NAME=$1
    if wrangler r2 bucket list 2>/dev/null | grep -q "$BUCKET_NAME"; then
        echo -e "${GREEN}✅ R2 存储桶 $BUCKET_NAME 已存在${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  R2 存储桶 $BUCKET_NAME 不存在${NC}"
        echo "创建 R2 存储桶 $BUCKET_NAME..."
        wrangler r2 bucket create "$BUCKET_NAME"
        return $?
    fi
}

check_r2_bucket "ai-driven-content-agent-assets"
check_r2_bucket "ai-driven-content-agent-assets-dev"
echo ""

# ========================================
# Step 6: 上传静态资源
# ========================================
echo -e "${BLUE}📤 Step 6: 上传静态资源${NC}"
echo "----------------------------------------"

upload_static_files() {
    local BUCKET=$1
    local ENV_NAME=$2
    
    if [ -d "./public" ]; then
        echo "上传到 $ENV_NAME 环境..."
        local FILES=("index.html" "styles.css" "script.js" "wiki.html")
        
        for FILE in "${FILES[@]}"; do
            if [ -f "./public/$FILE" ]; then
                local CONTENT_TYPE
                case "$FILE" in
                    *.html) CONTENT_TYPE="text/html" ;;
                    *.css) CONTENT_TYPE="text/css" ;;
                    *.js) CONTENT_TYPE="application/javascript" ;;
                    *) CONTENT_TYPE="application/octet-stream" ;;
                esac
                
                wrangler r2 object put "$BUCKET/$FILE" \
                    --file "./public/$FILE" \
                    --content-type "$CONTENT_TYPE" 2>/dev/null && \
                    echo "  ✅ $FILE" || echo "  ⚠️  $FILE (可能已存在)"
            fi
        done
    else
        echo -e "${YELLOW}⚠️  public 目录不存在，跳过静态资源上传${NC}"
    fi
}

upload_static_files "ai-driven-content-agent-assets" "生产"
upload_static_files "ai-driven-content-agent-assets-dev" "开发"
echo ""

# ========================================
# Step 7: 密钥配置检查
# ========================================
echo -e "${BLUE}🔐 Step 7: 检查密钥配置${NC}"
echo "----------------------------------------"

REQUIRED_SECRETS=("API_KEY" "DIFY_API_KEY" "DIFY_ARTICLE_API_KEY")
MISSING_SECRETS=()

echo "检查必需的密钥..."
for SECRET in "${REQUIRED_SECRETS[@]}"; do
    if wrangler secret list 2>/dev/null | grep -q "\"$SECRET\""; then
        echo -e "  ${GREEN}✅${NC} $SECRET"
    else
        echo -e "  ${RED}❌${NC} $SECRET - 未配置"
        MISSING_SECRETS+=($SECRET)
    fi
done

if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}需要配置以下密钥：${NC}"
    for SECRET in "${MISSING_SECRETS[@]}"; do
        echo ""
        case $SECRET in
            "API_KEY")
                echo "配置系统API密钥 (默认: aiwenchuang):"
                ;;
            "DIFY_API_KEY")
                echo "配置 Dify URL 工作流密钥:"
                ;;
            "DIFY_ARTICLE_API_KEY")
                echo "配置 Dify 文章工作流密钥:"
                ;;
        esac
        wrangler secret put $SECRET
    done
fi
echo ""

# ========================================
# Step 8: 确认部署
# ========================================
echo -e "${BLUE}🚀 Step 8: 准备部署${NC}"
echo "----------------------------------------"
echo "部署配置："
echo "  Worker 名称: $WORKER_NAME"
echo "  账号 ID: $EXPECTED_ACCOUNT_ID"
echo "  URL: $WORKER_URL"
echo ""

read -p "确认开始部署? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "取消部署"
    exit 0
fi

echo ""
echo "开始部署..."
wrangler deploy

# ========================================
# Step 9: 验证部署
# ========================================
echo ""
echo -e "${BLUE}✅ Step 9: 验证部署${NC}"
echo "----------------------------------------"

# 等待几秒让部署生效
echo "等待部署生效..."
sleep 3

# 测试 API
echo "测试 API 状态..."
HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" "$WORKER_URL/api/v1/status" 2>/dev/null || echo "000")
HTTP_CODE=$(echo "$HTTP_RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$HTTP_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ] && echo "$RESPONSE_BODY" | grep -q "healthy"; then
    echo -e "${GREEN}✅ API 部署成功并运行正常${NC}"
else
    echo -e "${YELLOW}⚠️  API 响应异常 (HTTP $HTTP_CODE)${NC}"
    echo "响应内容: $RESPONSE_BODY"
    echo ""
    echo "可能的原因："
    echo "1. 部署还未完全生效（等待1-2分钟）"
    echo "2. 密钥配置不正确"
    echo "3. 网络问题"
    echo ""
    echo "调试命令："
    echo "  wrangler tail  # 查看实时日志"
fi

# ========================================
# 完成
# ========================================
echo ""
echo "========================================"
echo -e "${GREEN}🎉 部署流程完成！${NC}"
echo "========================================"
echo ""
echo "📌 重要信息："
echo "----------------------------------------"
echo "Worker URL: $WORKER_URL"
echo "API 端点: $WORKER_URL/api/v1"
echo "API 文档: $WORKER_URL/wiki"
echo ""
echo "📝 后续操作："
echo "1. 测试 API: curl -H 'Authorization: Bearer aiwenchuang' $WORKER_URL/api/v1/status"
echo "2. 查看日志: wrangler tail"
echo "3. 访问前端: $WORKER_URL"
echo ""
echo "🔧 管理命令："
echo "- 查看密钥: wrangler secret list"
echo "- 更新密钥: wrangler secret put <SECRET_NAME>"
echo "- 查看日志: wrangler tail"
echo "- 回滚部署: wrangler rollback"
echo ""