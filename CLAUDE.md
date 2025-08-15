# AI-Driven Content Agent

## 项目概述

这是一个基于Cloudflare Workers的智能内容生成和渲染系统，集成Dify AI工作流，支持多种微信公众号模板。系统提供完整的RESTful API、自定义工作流支持、流式响应处理，以及现代化的前端界面。

## 核心功能

- **智能内容生成**: 基于AI工作流的URL内容分析和文章生成
- **多模板渲染**: 支持6种专业微信公众号模板
- **自定义工作流**: 支持用户配置自定义Dify工作流
- **流式响应**: 实时处理反馈和状态更新
- **RESTful API**: 完整的企业级API接口
- **响应式界面**: 现代化的工作流选择器和状态管理

## 技术栈

- **运行环境**: Cloudflare Workers
- **前端**: 原生JavaScript + HTML5 + CSS3 + Server-Sent Events
- **后端**: Node.js + Cloudflare Workers API + Hono.js框架
- **AI集成**: Dify工作流平台 + 自定义工作流管理
- **测试框架**: Vitest + Playwright自动化测试
- **API设计**: RESTful架构 + 统一响应格式

## 项目结构

```
src/
├── api/          # API路由和处理
├── services/     # 业务逻辑服务
└── styles/       # 样式文件
templates/        # 6种内容模板
public/          # 静态资源
test/            # 测试文件
docs/            # 文档
```

## 开发命令

```bash
# 本地开发
npm run dev

# 部署
npm run deploy

# 运行测试
npm test

# 构建
npm run build
```

## 模板系统

支持6种微信公众号模板:
- article_wechat - 文章模板
- tech_analysis_wechat - 技术分析模板  
- news_modern_wechat - 现代新闻模板
- github_project_wechat - GitHub项目模板
- ai_benchmark_wechat - AI基准测试模板
- professional_analysis_wechat - 专业分析模板

## API端点概览

### 系统状态
- `GET /api/v1/status` - 系统健康状态检查

### 模板管理
- `GET /api/v1/templates` - 获取可用模板列表
- `GET /api/v1/templates/{templateId}` - 获取模板详情

### 工作流管理
- `GET /api/v1/workflows/available` - 获取可用工作流列表
- `GET /api/v1/workflows` - 获取工作流信息（兼容接口）
- `GET /api/v1/workflows/{workflowId}` - 获取工作流详情
- `POST /api/v1/workflows/{workflowId}/execute` - 执行工作流
- `POST /api/v1/workflows/custom` - 添加自定义工作流
- `DELETE /api/v1/workflows/custom/{workflowId}` - 删除自定义工作流

### 内容管理
- `POST /api/v1/content/render` - 内容渲染
- `GET /api/v1/content/{contentId}` - 获取内容详情
- `GET /api/v1/content/{contentId}/html` - 获取HTML源码
- `GET /api/v1/content/{contentId}/url` - 获取访问链接
- `GET /api/v1/content` - 获取内容列表
- `DELETE /api/v1/content/{contentId}` - 删除内容

## 工作流系统

### 默认工作流
- **dify-general**: URL内容生成工作流
- **dify-article**: AI文章生成工作流

### 自定义工作流
支持通过环境变量配置自定义工作流：

```env
CUSTOM_WORKFLOWS='{
  "translate": {
    "name": "智能翻译",
    "apiKey": "app-translate-example",
    "type": "url",
    "icon": "ion-md-globe"
  }
}'
```

## 环境变量

```env
# 必需配置
DIFY_API_KEY=your_dify_general_api_key
DIFY_ARTICLE_API_KEY=your_dify_article_api_key

# 可选配置
DIFY_BASE_URL=https://api.dify.ai/v1
ENVIRONMENT=development
CUSTOM_WORKFLOWS='{}'

# 服务配置
API_VERSION=v1
MAX_CONTENT_SIZE=10485760
```

## 测试

### 自动化测试
```bash
# 运行Playwright测试
npx playwright test

# 运行工作流选择器测试
npx playwright test test/workflow-selector.spec.js

# 运行单元测试
npm test
```

### 手动测试
1. 访问 `http://localhost:8787`
2. 在浏览器控制台运行测试脚本：
   ```javascript
   // 加载测试工具
   // 运行工作流测试
   workflowTester.runAllWorkflowTests()
   ```

## 部署

### 开发环境
```bash
npm run dev
```

### 生产部署
```bash
# 部署到Cloudflare Workers
npm run deploy

# 查看部署状态
wrangler tail
```

## 项目特性

### 1. 统一响应格式
所有API端点使用统一的响应格式：
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

### 2. 流式响应支持
工作流执行支持Server-Sent Events流式响应：
```javascript
const eventSource = new EventSource('/api/v1/workflows/dify-general/execute?stream=true');
```

### 3. 错误处理
完整的错误分类和处理机制，包括客户端错误、服务器错误、认证错误等。

### 4. 向后兼容
保持与旧版本API的完全兼容，确保平滑升级。