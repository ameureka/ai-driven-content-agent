# AI 驱动内容代理系统 - 完整 API 接口文档

## 1. 概述

本文档详细描述了 AI 驱动内容代理系统的所有 API 接口，包括请求参数、响应格式、错误处理等完整信息。

### 1.1 基础信息
- **基础 URL**: `http://localhost:8787/api/v1`
- **认证方式**: Bearer Token (API Key)
- **内容类型**: `application/json`
- **API 版本**: v1

### 1.2 认证
所有 API 请求需要在 Header 中包含 API Key：
```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

### 1.3 统一响应格式

#### 成功响应
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

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {},
    "timestamp": "2025-01-15T00:00:00.000Z"
  }
}
```

## 2. API 接口列表

### 2.1 服务状态 API

#### GET /api/v1/status
**功能**: 检查服务健康状态和系统信息

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 3600,
    "environment": "development",
    "features": {
      "dify_integration": true,
      "streaming_support": true,
      "template_rendering": true,
      "custom_workflows": true
    },
    "statistics": {
      "total_requests": 1000,
      "active_workflows": 2,
      "available_templates": 6
    }
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

### 2.2 模板管理 API

#### GET /api/v1/templates
**功能**: 获取所有可用模板列表

**请求参数**: 
- `category` (可选): 模板分类筛选
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 20

**响应示例**:
```json
{
  "success": true,
  "message": "获取模板列表成功",
  "data": [
    {
      "id": "article_wechat",
      "name": "通用文章",
      "description": "微信公众号通用文章模板",
      "category": "article",
      "version": "1.0.0",
      "created_at": "2025-01-15T00:00:00.000Z",
      "schema": {
        "title": {"type": "string", "required": true},
        "content": {"type": "string", "required": true}
      },
      "preview_url": "/templates/article_wechat/preview"
    },
    {
      "id": "tech_analysis_wechat",
      "name": "技术解读",
      "description": "深度技术分析和解读",
      "category": "technical",
      "version": "1.0.0",
      "created_at": "2025-01-15T00:00:00.000Z",
      "schema": {
        "title": {"type": "string", "required": true},
        "content": {"type": "string", "required": true}
      },
      "preview_url": "/templates/tech_analysis_wechat/preview"
    }
  ],
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1",
    "total_count": 6,
    "page": 1,
    "per_page": 20
  }
}
```

#### GET /api/v1/templates/{templateId}
**功能**: 获取指定模板的详细信息

**路径参数**:
- `templateId`: 模板 ID

**响应示例**:
```json
{
  "success": true,
  "message": "获取模板详情成功",
  "data": {
    "id": "article_wechat",
    "name": "通用文章",
    "description": "微信公众号通用文章模板",
    "category": "article",
    "version": "1.0.0",
    "created_at": "2025-01-15T00:00:00.000Z",
    "schema": {
      "title": {
        "type": "string", 
        "required": true,
        "description": "文章标题"
      },
      "content": {
        "type": "string", 
        "required": true,
        "description": "文章内容(Markdown格式)"
      }
    },
    "sample_data": {
      "title": "示例文章标题",
      "content": "# 示例标题\n\n这是示例内容..."
    },
    "preview_url": "/templates/article_wechat/preview"
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

### 2.3 工作流管理 API

#### GET /api/v1/workflows/available
**功能**: 获取所有可用工作流列表（包括默认和自定义工作流）

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "message": "获取可用工作流列表成功",
  "data": [
    {
      "id": "dify-general",
      "name": "URL内容生成",
      "description": "从URL生成内容（默认）",
      "type": "url",
      "icon": "ion-md-cloud-download",
      "inputFields": ["url"],
      "isDefault": true,
      "isCustom": false
    },
    {
      "id": "dify-article", 
      "name": "AI文章生成",
      "description": "基于关键词生成文章（默认）",
      "type": "text",
      "icon": "ion-md-create",
      "inputFields": ["title", "style", "context"],
      "isDefault": true,
      "isCustom": false
    }
  ],
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### GET /api/v1/workflows
**功能**: 获取工作流列表（兼容旧版本）

**请求参数**:
- `type` (可选): 工作流类型筛选 (url, text)
- `status` (可选): 工作流状态筛选 (active, inactive)

**响应示例**:
```json
{
  "success": true,
  "message": "获取工作流列表成功", 
  "data": {
    "workflows": [
      {
        "id": "dify-general",
        "name": "URL内容生成",
        "description": "从URL生成内容",
        "type": "url",
        "status": "active",
        "version": "1.0.0",
        "input_schema": {
          "url": {
            "type": "string",
            "required": true,
            "format": "uri"
          }
        },
        "output_schema": {
          "content": {
            "type": "string",
            "description": "生成的内容"
          }
        },
        "estimated_time": "30-60秒"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### GET /api/v1/workflows/{workflowId}
**功能**: 获取指定工作流的详细信息

**路径参数**:
- `workflowId`: 工作流 ID

**响应示例**:
```json
{
  "success": true,
  "message": "获取工作流详情成功",
  "data": {
    "id": "dify-general",
    "name": "URL内容生成",
    "description": "从URL生成内容",
    "type": "url",
    "status": "active",
    "version": "1.0.0",
    "input_schema": {
      "url": {
        "type": "string",
        "required": true,
        "format": "uri",
        "description": "要处理的URL地址"
      }
    },
    "output_schema": {
      "content": {
        "type": "string",
        "description": "生成的内容"
      }
    },
    "estimated_time": "30-60秒",
    "cost_per_request": 0.01
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### POST /api/v1/workflows/{workflowId}/execute
**功能**: 执行指定的工作流

**路径参数**:
- `workflowId`: 工作流 ID

**查询参数**:
- `stream` (可选): 是否使用流式响应，默认 false

**请求体示例** (URL工作流):
```json
{
  "inputs": {
    "url": "https://example.com/article"
  }
}
```

**请求体示例** (文本工作流):
```json
{
  "inputs": {
    "title": "AI技术发展趋势",
    "style": "专业分析",
    "context": "2024年人工智能技术发展现状"
  }
}
```

**响应示例** (非流式):
```json
{
  "success": true,
  "message": "工作流执行成功",
  "data": {
    "execution_id": "exec_123456789",
    "workflow_id": "dify-general",
    "status": "completed",
    "started_at": "2025-01-15T00:00:00.000Z",
    "completed_at": "2025-01-15T00:01:30.000Z",
    "duration": 90,
    "inputs": {
      "url": "https://example.com/article"
    },
    "outputs": {
      "content": "生成的内容..."
    },
    "metadata": {
      "tokens_used": 1500,
      "cost": 0.05
    }
  },
  "meta": {
    "timestamp": "2025-01-15T00:01:30.000Z",
    "version": "v1"
  }
}
```

**流式响应** (当 `stream=true`):
使用 Server-Sent Events (SSE) 格式:
```
event: start
data: {"status": "started", "workflow_id": "dify-general"}

event: progress 
data: {"status": "processing", "progress": 30, "current_step": "url_analysis"}

event: progress
data: {"status": "processing", "progress": 65, "current_step": "content_generation"}

event: complete
data: {"status": "completed", "content": "生成的内容..."}
```

#### POST /api/v1/workflows/custom
**功能**: 添加自定义工作流

**请求体**:
```json
{
  "id": "custom_translate",
  "name": "智能翻译",
  "description": "多语言智能翻译工作流",
  "type": "url",
  "apiKey": "app-translate-example",
  "icon": "ion-md-globe",
  "inputFields": ["url", "targetLanguage"]
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "自定义工作流添加成功",
  "data": {
    "id": "custom_translate",
    "name": "智能翻译",
    "description": "多语言智能翻译工作流",
    "type": "url",
    "isCustom": true,
    "created_at": "2025-01-15T00:00:00.000Z"
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### DELETE /api/v1/workflows/custom/{workflowId}
**功能**: 删除自定义工作流

**路径参数**:
- `workflowId`: 自定义工作流 ID

**响应示例**:
```json
{
  "success": true,
  "message": "自定义工作流删除成功",
  "data": {
    "deleted_workflow_id": "custom_translate"
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

### 2.4 内容渲染 API

#### POST /api/v1/content/render
**功能**: 使用指定模板渲染内容

**请求体**:
```json
{
  "template": "article_wechat",
  "title": "AI技术发展趋势",
  "content": "# AI技术发展趋势\n\n## 引言\n\n2024年，人工智能技术..."
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "内容渲染成功",
  "data": {
    "contentId": "content_123456789",
    "template": "article_wechat",
    "title": "AI技术发展趋势",
    "createdAt": "2025-01-15T00:00:00.000Z",
    "urls": {
      "html": "/api/v1/content/content_123456789/html",
      "view": "/content/content_123456789",
      "api": "/api/v1/content/content_123456789"
    },
    "metadata": {
      "file_size": 15420,
      "render_time": 150
    }
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

### 2.5 内容管理 API

#### GET /api/v1/content/{contentId}
**功能**: 获取渲染内容的详细信息

**路径参数**:
- `contentId`: 内容 ID

**响应示例**:
```json
{
  "success": true,
  "message": "获取内容详情成功",
  "data": {
    "contentId": "content_123456789",
    "template": "article_wechat",
    "title": "AI技术发展趋势",
    "content": "# AI技术发展趋势\n\n## 引言...",
    "createdAt": "2025-01-15T00:00:00.000Z",
    "urls": {
      "html": "/api/v1/content/content_123456789/html",
      "view": "/content/content_123456789",
      "api": "/api/v1/content/content_123456789"
    },
    "metadata": {
      "file_size": 15420,
      "render_time": 150,
      "template_version": "1.0.0"
    }
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### GET /api/v1/content/{contentId}/html
**功能**: 获取渲染内容的原始 HTML

**路径参数**:
- `contentId`: 内容 ID

**响应**: 直接返回 HTML 内容
```html
<!DOCTYPE html>
<html>
<head>
  <title>AI技术发展趋势</title>
  <style>...</style>
</head>
<body>
  <article>...</article>
</body>
</html>
```

#### GET /api/v1/content/{contentId}/url
**功能**: 获取内容的访问 URL

**路径参数**:
- `contentId`: 内容 ID

**响应示例**:
```json
{
  "success": true,
  "message": "获取内容URL成功",
  "data": {
    "contentId": "content_123456789",
    "url": "http://localhost:8787/content/content_123456789",
    "expires_at": "2025-01-22T00:00:00.000Z"
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### DELETE /api/v1/content/{contentId}
**功能**: 删除指定的渲染内容

**路径参数**:
- `contentId`: 内容 ID

**响应示例**:
```json
{
  "success": true,
  "message": "内容删除成功",
  "data": {
    "deleted_content_id": "content_123456789"
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### GET /api/v1/content
**功能**: 获取内容列表

**请求参数**:
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 20
- `template` (可选): 按模板筛选

**响应示例**:
```json
{
  "success": true,
  "message": "获取内容列表成功",
  "data": {
    "contents": [
      {
        "contentId": "content_123456789",
        "template": "article_wechat",
        "title": "AI技术发展趋势",
        "createdAt": "2025-01-15T00:00:00.000Z",
        "urls": {
          "view": "/content/content_123456789",
          "api": "/api/v1/content/content_123456789"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_count": 1,
      "per_page": 20
    }
  },
  "meta": {
    "timestamp": "2025-01-15T00:00:00.000Z",
    "version": "v1"
  }
}
```

## 3. 错误代码说明

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `INVALID_API_KEY` | 401 | API密钥无效 |
| `MISSING_API_KEY` | 401 | 缺少API密钥 |
| `INVALID_INPUT` | 400 | 输入参数无效 |
| `TEMPLATE_NOT_FOUND` | 404 | 模板不存在 |
| `CONTENT_NOT_FOUND` | 404 | 内容不存在 |
| `CONTENT_TOO_LARGE` | 413 | 内容过大 |
| `WORKFLOW_NOT_FOUND` | 404 | 工作流不存在 |
| `WORKFLOW_ERROR` | 500 | 工作流执行错误 |
| `INTERNAL_ERROR` | 500 | 内部服务器错误 |

## 4. 使用示例

### 4.1 完整的内容生成和渲染流程

```javascript
// 1. 检查服务状态
const statusResponse = await fetch('/api/v1/status', {
  headers: { 'Authorization': 'Bearer your-api-key' }
});

// 2. 获取可用工作流
const workflowsResponse = await fetch('/api/v1/workflows/available', {
  headers: { 'Authorization': 'Bearer your-api-key' }
});

// 3. 执行工作流生成内容
const executeResponse = await fetch('/api/v1/workflows/dify-article/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inputs: {
      title: 'AI技术发展',
      style: '专业',
      context: '2024年AI发展现状'
    }
  })
});

// 4. 使用生成的内容进行渲染
const renderResponse = await fetch('/api/v1/content/render', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    template: 'article_wechat',
    title: 'AI技术发展',
    content: '生成的文章内容...'
  })
});

// 5. 获取渲染结果
const result = await renderResponse.json();
console.log('渲染完成，访问链接:', result.data.urls.view);
```

### 4.2 流式工作流执行示例

```javascript
// 使用 EventSource 处理流式响应
const eventSource = new EventSource('/api/v1/workflows/dify-general/execute?stream=true', {
  headers: { 'Authorization': 'Bearer your-api-key' }
});

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('工作流状态:', data);
  
  if (data.status === 'completed') {
    console.log('工作流完成，结果:', data.content);
    eventSource.close();
  }
};

eventSource.onerror = function(error) {
  console.error('流式连接错误:', error);
  eventSource.close();
};
```

## 5. API 版本管理

当前 API 版本为 v1，所有接口路径都以 `/api/v1` 开头。未来版本升级时会保持向后兼容性，新版本将使用 `/api/v2` 等路径。

## 6. 性能和限制

- **请求频率限制**: 根据 API Key 配置
- **内容大小限制**: 最大 10MB
- **并发请求限制**: 最大 100 个并发请求
- **响应时间**: 通常在 5 秒内返回结果
- **流式响应超时**: 最大 300 秒

---

本文档将根据 API 的更新持续维护和完善。