# AI驱动内容代理 - 部署指南

## 概述

本文档提供了AI驱动内容代理项目在Cloudflare Workers平台上的完整部署指南，包括环境配置、依赖安装、部署流程和运维管理。

## 前置要求

### 系统要求
- Node.js 18.0+ 
- npm 8.0+ 或 yarn 1.22+
- Git 2.0+

### 账户要求
- Cloudflare账户（免费版即可开始）
- Dify平台账户（用于AI工作流）
- GitHub账户（可选，用于代码管理）

### 开发工具
- VS Code 或其他代码编辑器
- Wrangler CLI（Cloudflare Workers开发工具）
- 浏览器开发者工具

## 环境准备

### 1. 安装Wrangler CLI

```bash
# 全局安装Wrangler
npm install -g wrangler

# 验证安装
wrangler --version
```

### 2. 登录Cloudflare

```bash
# 登录Cloudflare账户
wrangler auth login

# 验证登录状态
wrangler whoami
```

### 3. 克隆项目

```bash
# 克隆项目仓库
git clone <your-repository-url>
cd ai_driven_content_agent

# 安装依赖
npm install
```

## 配置文件设置

### 1. wrangler.toml配置

项目根目录的`wrangler.toml`文件包含了Worker的基本配置：

```toml
name = "ai-content-agent"
main = "src/index.js"
compatibility_date = "2024-01-15"
compatibility_flags = ["nodejs_compat"]

# KV存储绑定
[[kv_namespaces]]
binding = "CONTENT_STORE"
preview_id = "your-preview-kv-id"
id = "your-production-kv-id"

# 环境变量
[vars]
ENVIRONMENT = "production"
API_VERSION = "v1"

# 密钥配置（通过wrangler secret设置）
# DIFY_API_KEY
# DIFY_BASE_URL
# API_SECRET_KEY
```

### 2. 创建KV命名空间

```bash
# 创建生产环境KV存储
wrangler kv:namespace create "CONTENT_STORE"

# 创建预览环境KV存储
wrangler kv:namespace create "CONTENT_STORE" --preview
```

将返回的ID更新到`wrangler.toml`文件中。

### 3. 设置环境变量

```bash
# 设置Dify API密钥
wrangler secret put DIFY_API_KEY

# 设置Dify API基础URL
wrangler secret put DIFY_BASE_URL

# 设置API密钥（可选）
wrangler secret put API_SECRET_KEY
```

## 本地开发

### 1. 启动开发服务器

```bash
# 启动本地开发环境
npm run dev

# 或使用wrangler直接启动
wrangler dev
```

开发服务器将在 `http://localhost:8787` 启动。

### 2. 本地测试

```bash
# 测试服务状态
curl http://localhost:8787/api/status

# 测试模板列表
curl http://localhost:8787/api/templates

# 测试内容上传
curl -X POST http://localhost:8787/api/upload \
  -H "Content-Type: application/json" \
  -d '{"content":"# Test\n\nHello World","template":"general"}'
```

### 3. 调试配置

在VS Code中创建`.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Wrangler",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/wrangler",
      "args": ["dev", "--local"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## 生产部署

### 1. 预部署检查

```bash
# 代码语法检查
npm run lint

# 运行测试（如果有）
npm test

# 构建检查
npm run build
```

### 2. 部署到生产环境

```bash
# 部署到Cloudflare Workers
npm run deploy

# 或使用wrangler直接部署
wrangler deploy
```

### 3. 验证部署

```bash
# 获取Worker URL
wrangler subdomain

# 测试生产环境
curl https://your-worker.your-subdomain.workers.dev/api/status
```

### 4. 自定义域名配置

如果需要使用自定义域名：

1. 在Cloudflare Dashboard中添加域名
2. 配置DNS记录
3. 在Worker设置中绑定自定义域名

```bash
# 通过wrangler配置自定义域名
wrangler route add "api.yourdomain.com/*" your-worker-name
```

## 环境管理

### 1. 多环境配置

创建不同环境的配置文件：

```toml
# wrangler.toml
[env.staging]
name = "ai-content-agent-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "ai-content-agent-prod"
vars = { ENVIRONMENT = "production" }
```

### 2. 环境部署

```bash
# 部署到staging环境
wrangler deploy --env staging

# 部署到production环境
wrangler deploy --env production
```

### 3. 环境变量管理

```bash
# 为特定环境设置密钥
wrangler secret put DIFY_API_KEY --env production
wrangler secret put DIFY_API_KEY --env staging

# 查看环境变量
wrangler secret list --env production
```

## 监控和日志

### 1. 实时日志查看

```bash
# 查看实时日志
wrangler tail

# 查看特定环境的日志
wrangler tail --env production

# 过滤日志
wrangler tail --format pretty
```

### 2. 性能监控

在Cloudflare Dashboard中可以查看：
- 请求数量和频率
- 响应时间
- 错误率
- CPU使用时间
- 内存使用情况

### 3. 告警配置

可以在Cloudflare Dashboard中设置：
- 错误率告警
- 响应时间告警
- 请求量异常告警

## 数据管理

### 1. KV存储操作

```bash
# 查看KV中的所有键
wrangler kv:key list --binding CONTENT_STORE

# 获取特定键的值
wrangler kv:key get "key-name" --binding CONTENT_STORE

# 设置键值
wrangler kv:key put "key-name" "value" --binding CONTENT_STORE

# 删除键
wrangler kv:key delete "key-name" --binding CONTENT_STORE
```

### 2. 数据备份

```bash
# 导出所有KV数据
wrangler kv:bulk get --binding CONTENT_STORE > backup.json

# 从备份恢复数据
wrangler kv:bulk put backup.json --binding CONTENT_STORE
```

### 3. 数据清理

定期清理过期数据的脚本示例：

```javascript
// cleanup-script.js
const EXPIRY_DAYS = 30;
const cutoffDate = Date.now() - (EXPIRY_DAYS * 24 * 60 * 60 * 1000);

// 在Worker中实现清理逻辑
export async function cleanupExpiredContent(env) {
  const keys = await env.CONTENT_STORE.list();
  
  for (const key of keys.keys) {
    const content = await env.CONTENT_STORE.get(key.name, 'json');
    if (content && content.created_at < cutoffDate) {
      await env.CONTENT_STORE.delete(key.name);
    }
  }
}
```

## 安全配置

### 1. API密钥管理

```bash
# 生成强密钥
openssl rand -base64 32

# 设置API密钥
wrangler secret put API_SECRET_KEY
```

### 2. CORS配置

在代码中配置适当的CORS策略：

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};
```

### 3. 速率限制

实现基于IP的速率限制：

```javascript
// 在Worker中实现速率限制
const RATE_LIMIT = 100; // 每分钟请求数
const WINDOW_SIZE = 60 * 1000; // 1分钟窗口

export async function checkRateLimit(request, env) {
  const ip = request.headers.get('CF-Connecting-IP');
  const key = `rate_limit:${ip}`;
  
  const current = await env.CONTENT_STORE.get(key);
  const count = current ? parseInt(current) : 0;
  
  if (count >= RATE_LIMIT) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  await env.CONTENT_STORE.put(key, (count + 1).toString(), {
    expirationTtl: WINDOW_SIZE / 1000
  });
  
  return null;
}
```

## 故障排除

### 1. 常见问题

**部署失败**
```bash
# 检查wrangler配置
wrangler whoami
wrangler kv:namespace list

# 验证配置文件
wrangler validate
```

**KV存储问题**
```bash
# 检查KV绑定
wrangler kv:namespace list

# 测试KV访问
wrangler kv:key put "test" "value" --binding CONTENT_STORE
wrangler kv:key get "test" --binding CONTENT_STORE
```

**API调用失败**
- 检查Dify API密钥和URL配置
- 验证网络连接
- 查看Worker日志

### 2. 调试技巧

```javascript
// 在Worker中添加调试日志
console.log('Debug info:', {
  timestamp: new Date().toISOString(),
  request: {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers)
  }
});
```

### 3. 性能优化

- 启用Cloudflare缓存
- 优化KV存储访问
- 减少外部API调用
- 使用Worker的边缘计算优势

## 持续集成/持续部署 (CI/CD)

### 1. GitHub Actions配置

创建`.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          environment: 'production'
```

### 2. 环境密钥配置

在GitHub仓库设置中添加：
- `CLOUDFLARE_API_TOKEN`
- `DIFY_API_KEY`
- `DIFY_BASE_URL`

## 维护和更新

### 1. 定期维护任务

- 更新依赖包
- 清理过期数据
- 检查安全漏洞
- 监控性能指标

### 2. 版本管理

```bash
# 创建新版本标签
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# 部署特定版本
git checkout v1.1.0
wrangler deploy
```

### 3. 回滚策略

```bash
# 快速回滚到上一个版本
wrangler rollback

# 回滚到特定版本
git checkout v1.0.0
wrangler deploy
```

## 成本优化

### 1. Cloudflare Workers定价

- 免费层：每天100,000次请求
- 付费层：$5/月，包含1000万次请求
- 超出部分：$0.50/百万次请求

### 2. 优化建议

- 合理使用KV存储
- 优化代码执行时间
- 实施缓存策略
- 监控使用量

## 支持和资源

### 官方文档
- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI文档](https://developers.cloudflare.com/workers/wrangler/)
- [KV存储文档](https://developers.cloudflare.com/workers/runtime-apis/kv/)

### 社区资源
- Cloudflare Workers Discord
- Stack Overflow
- GitHub Issues

---

*本文档最后更新时间: 2024-01-15*