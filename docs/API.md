# API接口文档

## 概述

AI驱动内容代理系统提供RESTful API接口，支持智能内容生成、模板渲染、工作流管理等功能。

## 基础信息

- **API版本**: v1
- **基础URL**: `https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1`
- **内容类型**: `application/json`
- **认证方式**: API密钥 (`Authorization: Bearer <token>`)

## 标准响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "meta": {
    "timestamp": "2025-08-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息",
    "timestamp": "2025-08-15T00:00:00.000Z"
  }
}
```

## 错误代码

| 错误代码 | 描述 | HTTP状态码 |
|---------|------|----------|
| `INVALID_API_KEY` | API密钥无效 | 403 |
| `MISSING_API_KEY` | API密钥缺失 | 401 |
| `INVALID_INPUT` | 输入参数无效 | 400 |
| `TEMPLATE_NOT_FOUND` | 模板不存在 | 404 |
| `WORKFLOW_NOT_FOUND` | 工作流不存在 | 404 |
| `WORKFLOW_ERROR` | 工作流执行错误 | 500 |
| `INTERNAL_ERROR` | 内部服务器错误 | 500 |

## API接口

### 1. 系统状态

#### 获取服务状态
```http
GET /api/v1/status
```

**响应示例**:
```json
{
  "success": true,
  "message": "服务运行正常",
  "data": {
    "status": "healthy",
    "uptime": 1755295171907,
    "version": "v1",
    "capabilities": {
      "templates": 6,
      "workflows": 2,
      "features": ["content_rendering", "ai_workflows", "template_system", "custom_workflows", "streaming_responses"]
    }
  }
}
```

### 2. 模板管理

#### 获取模板列表
```http
GET /api/v1/templates
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取模板列表成功",
  "data": [
    {
      "id": "article_wechat",
      "name": "文章模板",
      "description": "适用于通用文章发布",
      "type": "html"
    },
    {
      "id": "tech_analysis_wechat", 
      "name": "技术分析模板",
      "description": "适用于技术深度解析",
      "type": "html"
    }
  ]
}
```

#### 获取特定模板详情
```http
GET /api/v1/templates/{templateId}
```

**参数**:
- `templateId` (string): 模板ID

### 3. 工作流管理

#### 获取可用工作流列表
```http
GET /api/v1/workflows/available
```

**响应示例**:
```json
{
  "success": true,
  "message": "获取工作流列表成功",
  "data": [
    {
      "id": "dify-general",
      "name": "URL内容生成",
      "description": "基于URL生成智能内容",
      "type": "url",
      "icon": "ion-md-link"
    },
    {
      "id": "dify-article",
      "name": "AI文章创作", 
      "description": "基于标题创作完整文章",
      "type": "text",
      "icon": "ion-md-create"
    }
  ]
}
```

#### 执行工作流
```http
POST /api/v1/workflows/{workflowId}/execute
Authorization: Bearer your-api-key
Content-Type: application/json
```

**URL内容生成示例** (dify-general):
```json
{
  "inputs": {
    "url": "https://example.com",
    "query": "分析这个网站的内容"
  }
}
```

**AI文章创作示例** (dify-article):
```json
{
  "title": "人工智能的未来发展",
  "style": "正式",
  "context": "技术趋势分析"
}
```

**流式响应** (添加 `?stream=true`):
```http
Content-Type: text/event-stream

data: {"type": "start", "message": "开始生成内容"}
data: {"type": "progress", "content": "生成的内容片段..."}  
data: {"type": "complete", "message": "内容生成完成"}
data: [DONE]
```

### 4. 自定义工作流管理

#### 添加自定义工作流
```http
POST /api/v1/workflows/custom
Authorization: Bearer your-api-key
Content-Type: application/json
```

**请求示例**:
```json
{
  "id": "my-translate-workflow",
  "name": "智能翻译",
  "description": "多语言智能翻译工作流",
  "apiKey": "app-your-dify-workflow-key",
  "type": "url",
  "icon": "ion-md-globe"
}
```

#### 删除自定义工作流
```http
DELETE /api/v1/workflows/custom/{workflowId}
Authorization: Bearer your-api-key
```

#### 获取自定义工作流列表
```http
GET /api/v1/workflows/custom
Authorization: Bearer your-api-key
```

### 5. 内容渲染

#### 渲染内容
```http
POST /api/v1/content/render
Authorization: Bearer your-api-key
Content-Type: application/json
```

**请求示例**:
```json
{
  "content": "# 标题\n\n这是**markdown**内容。",
  "template": "article_wechat",
  "title": "我的文档"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "内容渲染成功",
  "data": {
    "contentId": "content_abc123",
    "html": "<html>渲染后的HTML内容</html>",
    "url": "/content/content_abc123",
    "template": "article_wechat",
    "createdAt": "2025-08-15T00:00:00.000Z"
  }
}
```

#### 获取内容详情
```http
GET /api/v1/content/{contentId}
```

#### 获取HTML源码
```http
GET /api/v1/content/{contentId}/html
```

#### 获取内容列表
```http
GET /api/v1/content
```

## 使用示例

### JavaScript/Node.js
```javascript
// 获取系统状态
const response = await fetch('https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/status');
const data = await response.json();
console.log(data);

// 执行工作流
const workflowResponse = await fetch('https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/workflows/dify-general/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    inputs: {
      url: 'https://example.com'
    }
  })
});
```

### cURL
```bash
# 获取系统状态
curl https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/status

# 执行工作流
curl -X POST https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/workflows/dify-general/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"inputs": {"url": "https://example.com"}}'

# 渲染内容
curl -X POST https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/render \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"content": "# Hello World", "template": "article_wechat", "title": "测试文档"}'
```

## 认证

所有需要认证的接口都需要在请求头中包含API密钥:

```http
Authorization: Bearer your-api-key
```

请联系管理员获取API密钥。

## 限制

- 请求频率限制: 100次/分钟
- 单次内容大小限制: 10MB
- 并发请求限制: 10个/用户

## 技术支持

如遇问题，请:
- 检查API密钥是否正确
- 确认请求格式符合文档要求  
- 查看错误响应中的详细信息
- 联系技术支持团队