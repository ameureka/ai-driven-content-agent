# 部署指南

## 📋 概述

本文档介绍AI驱动内容代理系统在Cloudflare Workers平台上的部署方法，包括开发环境和生产环境的部署配置。

## 🚀 快速部署

### 前置要求
- Node.js >= 18.0.0
- npm >= 8.0.0
- Cloudflare账户
- Dify AI平台账户

### 一键部署
```bash
# 克隆项目
git clone https://github.com/ameureka/ai-driven-content-agent.git
cd ai-driven-content-agent

# 执行一键部署脚本
chmod +x quick-start-main.sh
./quick-start-main.sh
```

### 手动部署

#### 1. 环境准备
```bash
# 安装Wrangler CLI
npm install -g wrangler

# 登录Cloudflare
wrangler login

# 安装项目依赖
npm install
```

#### 2. 环境配置
```bash
# 复制环境变量模板
cp .dev.vars.example .dev.vars
```

配置环境变量:
```env
# 必需配置
DIFY_API_KEY=your_dify_general_api_key
DIFY_ARTICLE_API_KEY=your_dify_article_api_key
API_KEY=your_api_access_key

# 可选配置
DIFY_BASE_URL=https://api.dify.ai
ENVIRONMENT=production
DEBUG=false
```

#### 3. Cloudflare资源创建
```bash
# 创建KV命名空间
wrangler kv:namespace create "MARKDOWN_KV"
wrangler kv:namespace create "MARKDOWN_KV" --preview

# 创建R2存储桶
wrangler r2 bucket create ai-driven-content-agent-assets
```

#### 4. 设置生产环境变量
```bash
wrangler secret put DIFY_API_KEY
wrangler secret put DIFY_ARTICLE_API_KEY
wrangler secret put API_KEY
```

#### 5. 部署
```bash
# 构建项目
npm run build

# 部署到生产环境
npm run deploy
```

## 🔧 配置详解

### wrangler.toml配置
```toml
name = "ai-driven-content-agent"
main = "src/index.js"
compatibility_date = "2024-10-30"
compatibility_flags = ["nodejs_compat"]

# KV存储绑定
[[kv_namespaces]]
binding = "MARKDOWN_KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-namespace-id"

# R2对象存储绑定
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "ai-driven-content-agent-assets"

# 静态资源绑定
[assets]
directory = "./public"
binding = "LOCAL_ASSETS"
```

### 环境变量管理

#### 开发环境
```env
# .dev.vars
DIFY_API_KEY=app-development-key
DIFY_ARTICLE_API_KEY=app-article-dev-key
API_KEY=dev-api-key
ENVIRONMENT=development
DEBUG=true
```

#### 生产环境
使用Cloudflare Secrets管理敏感信息:
```bash
echo "production-key" | wrangler secret put DIFY_API_KEY
echo "article-key" | wrangler secret put DIFY_ARTICLE_API_KEY
echo "api-key" | wrangler secret put API_KEY
```

## 📊 部署验证

### 健康检查
```bash
curl https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/status
```

预期响应:
```json
{
  "success": true,
  "message": "服务运行正常",
  "data": {
    "status": "healthy",
    "version": "v1",
    "capabilities": {
      "templates": 6,
      "workflows": 2,
      "features": ["content_rendering", "ai_workflows", "template_system"]
    }
  }
}
```

### 功能测试
```bash
# 测试模板列表
curl https://your-worker.workers.dev/api/v1/templates

# 测试工作流
curl https://your-worker.workers.dev/api/v1/workflows/available

# 测试内容渲染
curl -X POST https://your-worker.workers.dev/api/v1/content/render \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"content": "# Hello", "template": "article_wechat"}'
```

## 📈 监控运维

### 日志查看
```bash
# 实时日志
wrangler tail

# 过滤错误
wrangler tail | grep ERROR

# 查看历史日志
wrangler tail --since 1h
```

### 性能监控
- **响应时间**: Cloudflare Analytics
- **错误率**: Worker日志监控
- **请求量**: Dashboard统计
- **资源使用**: Worker运行时指标

### 部署统计
- Worker启动时间: < 15ms
- 打包大小: ~278KB
- 静态资源: 4个文件
- 全球节点: Cloudflare边缘网络

## 🔒 安全配置

### API密钥管理
- 使用Cloudflare Secrets存储
- 定期轮换密钥
- 监控使用情况

### 访问控制
```javascript
// IP白名单示例
function isAllowedIP(request) {
  const clientIP = request.headers.get('CF-Connecting-IP');
  const allowedIPs = ['192.168.1.0/24'];
  return allowedIPs.some(range => ipInRange(clientIP, range));
}
```

### HTTPS配置
- 强制HTTPS重定向
- TLS 1.3支持
- 自动SSL证书

## 🚨 故障排除

### 常见问题

#### 部署失败
```bash
# 检查配置
wrangler validate

# 验证登录状态
wrangler whoami

# 重新登录
wrangler auth login
```

#### 环境变量问题
```bash
# 列出Secrets
wrangler secret list

# 重新设置
wrangler secret put VARIABLE_NAME
```

#### KV存储问题
```bash
# 列出命名空间
wrangler kv:namespace list

# 测试读写
wrangler kv:key put --binding=MARKDOWN_KV "test" "value"
wrangler kv:key get --binding=MARKDOWN_KV "test"
```

### 性能优化
- 使用KV缓存减少API调用
- 优化代码减少CPU时间
- 合理设置缓存策略

## 📚 最佳实践

### 部署流程
1. 本地测试 → 构建 → 部署 → 验证
2. 使用Git标签管理版本
3. 监控部署后系统状态
4. 及时处理告警和错误

### 版本管理
```bash
# 标记版本
git tag v1.0.0
git push origin v1.0.0

# 部署指定版本
git checkout v1.0.0
npm run deploy
```

### 备份策略
- 定期备份KV数据
- 保存配置文件
- 备份部署脚本

## 📞 技术支持

遇到问题时:
1. 查看[Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
2. 检查项目[GitHub Issues](https://github.com/ameureka/ai-driven-content-agent/issues)
3. 联系技术支持团队