# AI驱动内容代理 API 文档

## 概述

本文档描述了AI驱动内容代理系统的RESTful API接口。API遵循标准的REST设计原则，支持JSON格式的请求和响应，并提供完整的错误处理机制。

## 基础信息

- **API版本**: v1
- **基础URL**: `https://your-domain.com/api/v1`
- **内容类型**: `application/json`
- **认证方式**: API密钥（Header: `X-API-Key` 或 `Authorization: Bearer <token>`）

## 标准响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
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
    "timestamp": "2024-01-01T00:00:00.000Z"
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
| `CONTENT_NOT_FOUND` | 内容不存在 | 404 |
| `CONTENT_TOO_LARGE` | 内容过大 | 413 |
| `WORKFLOW_NOT_FOUND` | 工作流不存在 | 404 |
| `WORKFLOW_ERROR` | 工作流执行错误 | 500 |
| `INTERNAL_ERROR` | 内部服务器错误 | 500 |
| `ROUTE_NOT_FOUND` | 路由不存在 | 404 |

## API接口

### 1. 服务状态API

#### 获取服务状态

**请求**
```
GET /api/v1/status
```

**响应**
```json
{
  "success": true,
  "message": "服务运行正常",
  "data": {
    "status": "healthy",
    "uptime": 1704067200000,
    "version": "v1",
    "capabilities": {
      "templates": 5,
      "workflows": 2,
      "features": ["content_rendering", "ai_workflows", "template_system"]
    }
  }
}
```

### 2. 模板管理API

#### 获取模板列表

**请求**
```
GET /api/v1/templates
```

**响应**
```json
{
  "success": true,
  "message": "获取模板列表成功",
  "data": [
    {
      "id": "general",
      "name": "general",
      "description": "general 模板",
      "type": "html"
    },
    {
      "id": "article_wechat",
      "name": "article_wechat",
      "description": "article_wechat 模板",
      "type": "html"
    }
  ]
}
```

#### 获取特定模板详情

**请求**
```
GET /api/v1/templates/{templateId}
```

**路径参数**
- `templateId` (string): 模板ID

**响应**
```json
{
  "success": true,
  "message": "获取模板详情成功",
  "data": {
    "id": "general",
    "name": "general",
    "description": "general 模板",
    "type": "html",
    "available": true
  }
}
```

### 3. 工作流管理API

#### 获取工作流列表

**请求**
```
GET /api/v1/workflows
```

**响应**
```json
{
  "success": true,
  "message": "获取工作流列表成功",
  "data": [
    {
      "id": "dify-general",
      "name": "Dify通用工作流",
      "description": "使用Dify API进行通用内容处理",
      "type": "general",
      "parameters": {
        "inputs": {
          "type": "object",
          "description": "工作流输入参数"
        }
      }
    },
    {
      "id": "dify-article",
      "name": "Dify文章生成工作流",
      "description": "使用Dify API生成文章内容，支持流式响应",
      "type": "article",
      "parameters": {
        "title": {
          "type": "string",
          "required": true,
          "description": "文章标题"
        },
        "style": {
          "type": "string",
          "required": false,
          "description": "写作风格"
        },
        "context": {
          "type": "string",
          "required": false,
          "description": "上下文信息"
        }
      }
    }
  ]
}
```

#### 获取特定工作流详情

**请求**
```
GET /api/v1/workflows/{workflowId}
```

**路径参数**
- `workflowId` (string): 工作流ID

**响应**
```json
{
  "success": true,
  "message": "获取工作流详情成功",
  "data": {
    "id": "dify-general",
    "name": "Dify通用工作流",
    "description": "使用Dify API进行通用内容处理",
    "type": "general",
    "parameters": {
      "inputs": {
        "type": "object",
        "description": "工作流输入参数"
      }
    }
  }
}
```

#### 执行工作流

**请求**
```
POST /api/v1/workflows/{workflowId}/execute
Content-Type: application/json
X-API-Key: your-api-key
```

**路径参数**
- `workflowId` (string): 工作流ID

**查询参数**
- `stream` (boolean, 可选): 是否使用流式响应（仅适用于文章生成工作流）

**请求体（dify-general）**
```json
{
  "inputs": {
    "query": "处理这段文本",
    "context": "相关上下文"
  }
}
```

**请求体（dify-article）**
```json
{
  "title": "文章标题",
  "style": "正式",
  "context": "背景信息"
}
```

**响应（非流式）**
```json
{
  "success": true,
  "message": "工作流执行成功",
  "data": {
    "workflowId": "dify-general",
    "executionId": "abc123def456",
    "result": {
      "content": "生成的内容"
    },
    "executedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**响应（流式）**
```
Content-Type: text/event-stream

data: {"type": "start", "message": "开始生成文章"}

data: {"type": "progress", "content": "生成的内容片段"}

data: {"type": "complete", "message": "文章生成完成"}

data: [DONE]
```

### 4. 内容渲染API

#### 渲染内容

**请求**
```
POST /api/v1/content/render
Content-Type: application/json
X-API-Key: your-api-key
```

**请求体**
```json
{
  "content": "# 标题\n\n这是内容",
  "template": "general",
  "title": "文档标题",
  "metadata": {
    "author": "作者",
    "tags": ["标签1", "标签2"]
  }
}
```

**响应**
```json
{
  "success": true,
  "message": "内容渲染成功",
  "data": {
    "contentId": "abc123def456",
    "viewUrl": "https://your-domain.com/api/v1/content/abc123def456",
    "htmlUrl": "https://your-domain.com/api/v1/content/abc123def456/html",
    "template": "general",
    "title": "文档标题",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. 结果查看API

#### 获取内容详情

**请求**
```
GET /api/v1/content/{contentId}
```

**路径参数**
- `contentId` (string): 内容ID

**响应**
```json
{
  "success": true,
  "message": "获取内容成功",
  "data": {
    "content": "# 标题\n\n这是内容",
    "template": "general",
    "title": "文档标题",
    "metadata": {
      "author": "作者",
      "tags": ["标签1", "标签2"]
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "id": "abc123def456"
  }
}
```

#### 获取渲染后的HTML

**请求**
```
GET /api/v1/content/{contentId}/html
```

**路径参数**
- `contentId` (string): 内容ID

**查询参数**
- `template` (string, 可选): 覆盖模板
- `title` (string, 可选): 覆盖标题

**响应**
```html
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <title>文档标题</title>
    <!-- 模板样式 -->
</head>
<body>
    <!-- 渲染后的内容 -->
</body>
</html>
```

#### 获取内容URL

**请求**
```
GET /api/v1/content/{contentId}/url
```

**路径参数**
- `contentId` (string): 内容ID

**响应**
```json
{
  "success": true,
  "message": "获取内容URL成功",
  "data": {
    "contentId": "abc123def456",
    "htmlUrl": "https://your-domain.com/api/v1/content/abc123def456/html",
    "directUrl": "https://your-domain.com/api/v1/content/abc123def456/html"
  }
}
```

### 6. 内容管理API

#### 删除内容

**请求**
```
DELETE /api/v1/content/{contentId}
X-API-Key: your-api-key
```

**路径参数**
- `contentId` (string): 内容ID

**响应**
```json
{
  "success": true,
  "message": "内容删除成功",
  "data": {
    "contentId": "abc123def456",
    "deletedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 获取内容列表

**请求**
```
GET /api/v1/content
X-API-Key: your-api-key
```

**查询参数**
- `limit` (number, 可选): 每页数量，默认10
- `cursor` (string, 可选): 分页游标

**响应**
```json
{
  "success": true,
  "message": "获取内容列表成功",
  "data": {
    "contents": [
      {
        "contentId": "abc123def456",
        "title": "文档标题",
        "template": "general",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "metadata": {
          "author": "作者",
          "tags": ["标签1", "标签2"]
        }
      }
    ],
    "pagination": {
      "cursor": "next-cursor",
      "hasMore": true
    }
  }
}
```

## 使用示例

### 1. 完整的内容渲染流程

```bash
# 1. 检查服务状态
curl -X GET "https://your-domain.com/api/v1/status"

# 2. 获取可用模板
curl -X GET "https://your-domain.com/api/v1/templates"

# 3. 渲染内容
curl -X POST "https://your-domain.com/api/v1/content/render" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "content": "# Hello World\n\nThis is a test.",
    "template": "general",
    "title": "Test Document"
  }'

# 4. 查看渲染结果
curl -X GET "https://your-domain.com/api/v1/content/abc123def456/html"
```

### 2. AI工作流执行

```bash
# 1. 获取可用工作流
curl -X GET "https://your-domain.com/api/v1/workflows"

# 2. 执行文章生成工作流
curl -X POST "https://your-domain.com/api/v1/workflows/dify-article/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "title": "AI技术发展趋势",
    "style": "学术",
    "context": "2024年人工智能领域的最新发展"
  }'

# 3. 流式执行（实时获取生成内容）
curl -X POST "https://your-domain.com/api/v1/workflows/dify-article/execute?stream=true" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "title": "AI技术发展趋势",
    "style": "学术"
  }'
```

## MCP协议集成

本API设计完全符合MCP（Model Context Protocol）规范，可以轻松包装为MCP工具：

### MCP工具定义示例

```json
{
  "name": "ai_content_agent",
  "description": "AI驱动的内容代理系统",
  "tools": [
    {
      "name": "get_service_status",
      "description": "获取服务状态",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "render_content",
      "description": "渲染Markdown内容为HTML",
      "inputSchema": {
        "type": "object",
        "properties": {
          "content": {"type": "string", "description": "Markdown内容"},
          "template": {"type": "string", "description": "模板名称"},
          "title": {"type": "string", "description": "文档标题"}
        },
        "required": ["content"]
      }
    },
    {
      "name": "execute_workflow",
      "description": "执行AI工作流",
      "inputSchema": {
        "type": "object",
        "properties": {
          "workflowId": {"type": "string", "description": "工作流ID"},
          "parameters": {"type": "object", "description": "工作流参数"}
        },
        "required": ["workflowId", "parameters"]
      }
    }
  ]
}
```

## 版本兼容性

- **v1 API**: 当前版本，完整的RESTful API
- **Legacy API**: 保持向后兼容，原有的`/upload`、`/view`等端点仍然可用

## 限制和配额

- **内容大小**: 最大25MB
- **API调用频率**: 根据部署环境配置
- **存储时间**: 内容默认永久存储，可通过API删除

## 安全性

- **API密钥认证**: 所有写操作需要有效的API密钥
- **CORS支持**: 配置了适当的CORS头
- **输入验证**: 所有输入都经过严格验证
- **错误处理**: 不暴露敏感的系统信息

## 支持和反馈

如有问题或建议，请通过以下方式联系：
- 项目仓库: [GitHub链接]
- 文档更新: [文档链接]
- 技术支持: [支持邮箱]