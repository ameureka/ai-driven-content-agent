# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
本文件为 Claude Code (claude.ai/code) 提供项目开发指导。

## Project Overview | 项目概述

**AI-Driven Content Agent** - A Serverless AI content generation system built on Cloudflare Workers, integrating Dify AI workflows for intelligent content creation and rendering with professional WeChat templates.

**AI驱动内容代理** - 基于Cloudflare Workers的无服务器AI内容生成系统，集成Dify AI工作流引擎，实现智能内容创作，并提供专业的微信公众号文章模板。

### Architecture | 系统架构
- **Platform | 平台**: Cloudflare Workers (Edge Computing | 边缘计算)
- **AI Engine | AI引擎**: Dify AI Workflow Platform (工作流平台)
- **Storage | 存储**: Cloudflare KV (Content persistence | 内容持久化) + R2 (Static assets | 静态资源)
- **API | 接口**: RESTful API with streaming support (SSE | 支持流式响应)
- **Templates | 模板**: 6 professional WeChat article templates (6种专业微信文章模板)

## Core Components | 核心组件

### Project Structure | 项目结构
```
ai-driven-content-agent/
├── src/
│   ├── index.js              # Main entry point, request routing | 主入口，请求路由
│   ├── api/
│   │   ├── routes.js         # API router with RESTful endpoints | RESTful API路由器
│   │   ├── dify.js           # Dify URL workflow integration | URL工作流集成
│   │   └── difyArticle.js    # Dify article workflow integration | 文章工作流集成
│   └── services/
│       └── templateManager.js # Template management service | 模板管理服务
├── templates/                # 6 WeChat article templates | 6个微信文章模板
├── public/                   # Frontend static files | 前端静态文件
├── test/                     # Test files | 测试文件
├── docs/                     # Documentation | 项目文档
└── wrangler.toml            # Cloudflare Workers configuration | Workers配置
```

## Development Commands | 开发命令

### Essential Commands | 常用命令
- `npm install` - Install dependencies | 安装依赖
- `npm run dev` - Start local development server (port 8787) | 启动本地开发服务器（端口8787）
- `npm run deploy` - Deploy to Cloudflare Workers | 部署到Cloudflare Workers
- `npm test` - Run tests with Vitest | 运行测试
- `wrangler login` - Authenticate with Cloudflare | 登录Cloudflare账号
- `wrangler secret put <KEY>` - Set environment secrets | 设置环境密钥

### Deployment | 部署流程
```bash
# Deploy to production | 部署到生产环境
npm run deploy

# Set required secrets | 设置必需的密钥
wrangler secret put DIFY_API_KEY
wrangler secret put DIFY_ARTICLE_API_KEY
wrangler secret put API_KEY
```

## API Reference | API参考

### Base URL | 基础地址
- **Production | 生产环境**: `https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1`
- **Local Dev | 本地开发**: `http://localhost:8787/api/v1`

### Authentication | 认证方式
```
Authorization: Bearer <API_KEY>
```
Test API Key | 测试密钥: `aiwenchuang`

### Core Endpoints | 核心接口

#### 1. System Status | 系统状态
- `GET /api/v1/status` - Health check and capabilities | 健康检查和系统能力

#### 2. Workflows | 工作流管理
- `GET /api/v1/workflows/available` - List all workflows | 获取所有可用工作流
- `POST /api/v1/workflows/{id}/execute` - Execute workflow | 执行工作流
  - Add `?stream=true` for SSE streaming response | 添加`?stream=true`启用流式响应
- `POST /api/v1/workflows/custom` - Add custom workflow | 添加自定义工作流
- `DELETE /api/v1/workflows/custom/{id}` - Remove custom workflow | 删除自定义工作流

#### 3. Templates | 模板管理
- `GET /api/v1/templates` - List available templates | 获取模板列表
- `GET /api/v1/templates/{id}` - Get template details | 获取模板详情

#### 4. Content Management | 内容管理
- `POST /api/v1/content/render` - Render markdown to HTML | 渲染Markdown为HTML
- `GET /api/v1/content` - List all content (paginated) | 获取内容列表（分页）
- `GET /api/v1/content/{id}` - Get content details | 获取内容详情
- `GET /api/v1/content/{id}/html` - Get rendered HTML | 获取渲染后的HTML
- `DELETE /api/v1/content/{id}` - Delete content | 删除内容

### Workflow Types | 工作流类型

#### URL Workflow | URL内容生成 (`dify-general`)
```json
{
  "inputs": {
    "url": "https://example.com"
  }
}
```

#### Article Workflow | 文章创作 (`dify-article`)
```json
{
  "title": "Article Title",  // 文章标题
  "style": "professional",   // 写作风格
  "context": "Additional context"  // 补充上下文
}
```

## Environment Configuration | 环境配置

### Required Environment Variables | 必需的环境变量
```env
# Dify AI API Keys | Dify AI密钥
DIFY_API_KEY=app-your-general-workflow-key
DIFY_ARTICLE_API_KEY=app-your-article-workflow-key

# System API Key | 系统API密钥
API_KEY=your-api-access-key

# Custom Workflows (Optional) | 自定义工作流（可选）
CUSTOM_WORKFLOWS='{"translate":{"name":"Translation","apiKey":"app-key","type":"url"}}'
```

### Cloudflare Bindings | Cloudflare绑定
- `MARKDOWN_KV` - KV namespace for content storage | 内容存储的KV命名空间
- `ASSETS` - R2 bucket for static files | 静态文件的R2存储桶
- `LOCAL_ASSETS` - Local development assets | 本地开发资源

## Key Features | 核心特性

### 1. Streaming Response (SSE) | 流式响应
The system supports real-time content generation with Server-Sent Events:
系统支持通过Server-Sent Events实现实时内容生成：

```javascript
// Enable streaming by adding ?stream=true | 通过添加?stream=true启用流式响应
fetch('/api/v1/workflows/dify-article/execute?stream=true', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer aiwenchuang' },
  body: JSON.stringify({ title: 'Test' })
})
```

### 2. Template System | 模板系统
6 professional WeChat templates available | 提供6种专业的微信公众号模板:
- `article_wechat` - General articles | 通用文章
- `tech_analysis_wechat` - Technical analysis | 技术分析
- `news_modern_wechat` - News content | 新闻资讯
- `github_project_wechat` - Project showcases | 项目展示
- `ai_benchmark_wechat` - AI benchmarks | AI基准测试
- `professional_analysis_wechat` - Professional analysis | 专业分析

### 3. Error Handling | 错误处理
The system includes comprehensive error handling | 系统包含完善的错误处理机制:
- Automatic retry with exponential backoff | 指数退避自动重试
- Fallback to mock data when Dify is unavailable | Dify不可用时降级到模拟数据
- Graceful degradation for template rendering | 模板渲染优雅降级

## Testing | 测试

### Run Tests | 运行测试
```bash
npm test                    # Run all tests | 运行所有测试
npm run test:watch         # Watch mode | 监听模式
npm run test:coverage      # Coverage report | 覆盖率报告
```

### API Testing with cURL | 使用cURL测试API
```bash
# Check status | 检查状态
curl http://localhost:8787/api/v1/status

# Execute workflow | 执行工作流
curl -X POST http://localhost:8787/api/v1/workflows/dify-general/execute \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{"inputs":{"url":"https://example.com"}}'
```

## Error Codes | 错误码

| Code | HTTP Status | Description | 说明 |
|------|------------|-------------|------|
| `INVALID_API_KEY` | 403 | Invalid API key | API密钥无效 |
| `MISSING_API_KEY` | 401 | Missing API key | 缺少API密钥 |
| `INVALID_INPUT` | 400 | Invalid input parameters | 输入参数无效 |
| `TEMPLATE_NOT_FOUND` | 404 | Template not found | 模板不存在 |
| `WORKFLOW_NOT_FOUND` | 404 | Workflow not found | 工作流不存在 |
| `WORKFLOW_ERROR` | 500 | Workflow execution failed | 工作流执行失败 |
| `INTERNAL_ERROR` | 500 | Internal server error | 内部服务器错误 |

## Development Tips | 开发技巧

### Local Development | 本地开发
1. Create `.dev.vars` file for local environment variables | 创建`.dev.vars`文件配置本地环境变量:
```env
DIFY_API_KEY=your-key
DIFY_ARTICLE_API_KEY=your-key
API_KEY=aiwenchuang
```

2. Start development server | 启动开发服务器:
```bash
npm run dev
```

3. Access local instance | 访问本地实例:
- API: http://localhost:8787/api/v1
- Frontend | 前端: http://localhost:8787

### Debugging | 调试
- Check console logs in terminal for server-side debugging | 查看终端控制台日志进行服务端调试
- Use `wrangler tail` to stream production logs | 使用`wrangler tail`查看生产环境日志
- Enable verbose logging with `console.log()` statements | 使用`console.log()`添加详细日志

### Common Issues | 常见问题

1. **KV Namespace Not Found | KV命名空间未找到**
   - Run `wrangler kv:namespace create MARKDOWN_KV` | 运行创建KV命名空间命令
   - Update the ID in wrangler.toml | 更新wrangler.toml中的ID

2. **Authentication Errors | 认证错误**
   - Verify API_KEY is set correctly | 验证API_KEY设置是否正确
   - Check Authorization header format | 检查Authorization请求头格式

3. **Dify Timeout | Dify超时**
   - System has automatic retry mechanism | 系统有自动重试机制
   - Falls back to mock data after failures | 失败后降级到模拟数据

## Performance Metrics | 性能指标

- **Worker Startup | Worker启动时间**: < 15ms
- **API Response | API响应时间**: < 2s (non-streaming | 非流式)
- **Bundle Size | 打包大小**: ~280KB
- **Global Deployment | 全球部署**: Cloudflare edge network | Cloudflare边缘网络
- **Availability Target | 可用性目标**: > 99.9%

## Security Considerations | 安全考虑

- All API keys stored as Cloudflare Secrets | 所有API密钥存储为Cloudflare Secrets
- HTTPS enforced for all endpoints | 所有端点强制使用HTTPS
- Input validation and sanitization | 输入验证和清理
- CORS headers configured | 配置CORS头
- Rate limiting via Cloudflare | 通过Cloudflare进行速率限制

## Deployment Checklist | 部署清单

- [ ] Set all required environment variables | 设置所有必需的环境变量
- [ ] Configure KV namespace bindings | 配置KV命名空间绑定
- [ ] Test API endpoints locally | 本地测试API端点
- [ ] Verify Dify workflow connections | 验证Dify工作流连接
- [ ] Deploy to Cloudflare Workers | 部署到Cloudflare Workers
- [ ] Test production endpoints | 测试生产环境端点
- [ ] Monitor with `wrangler tail` | 使用`wrangler tail`监控

## Support Resources | 支持资源

- **Documentation | 文档**: `/docs/API_Complete_Documentation.md`
- **API Wiki | API维基**: `/wiki` endpoint
- **GitHub Issues | 问题反馈**: Report bugs and feature requests | 报告bug和功能请求
- **Production URL | 生产环境地址**: https://ai-driven-content-agent.yalinwang2.workers.dev

## Important Notes | 重要说明

### API Response Format | API响应格式
All API responses follow a standard format | 所有API响应遵循标准格式:

**Success Response | 成功响应**:
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "meta": {
    "timestamp": "2025-08-15T00:00:00Z",
    "version": "v1"
  }
}
```

**Error Response | 错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细信息"
  }
}
```

### Workflow Execution | 工作流执行
The system supports two execution modes | 系统支持两种执行模式:
1. **Blocking Mode | 阻塞模式**: Synchronous response | 同步响应
2. **Streaming Mode | 流式模式**: Real-time SSE updates | 实时SSE更新

### Template Rendering | 模板渲染
Templates are optimized for WeChat articles with | 模板针对微信文章优化:
- Mobile-first design | 移动优先设计
- WeChat editor compatibility | 微信编辑器兼容性
- Professional styling | 专业样式

## License | 许可证

MIT License - See LICENSE file for details | MIT许可证 - 详见LICENSE文件