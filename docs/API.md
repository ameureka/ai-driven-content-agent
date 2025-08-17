# 🚀 AI驱动内容管理平台 - 完整API文档

## 🌟 概述

AI驱动内容管理平台是一个**企业级智能内容管理系统**，提供完整的内容生命周期管理、高性能索引搜索、AI工作流集成、批量操作等强大功能。支持从内容创建到发布归档的全流程管理。

### ✨ 核心特性

- **🤖 AI工作流集成** - 支持Dify工作流的智能内容生成
- **📝 内容生命周期管理** - 草稿→发布→归档的完整状态管理
- **🔍 高性能搜索** - 多维度索引和全文搜索能力
- **📦 批量操作** - 高效的批量删除、状态更新等操作
- **📤 导入导出** - 支持JSON、Markdown、HTML多格式
- **📊 实时统计** - 内容分析、索引统计、使用情况监控
- **🏷️ 标签系统** - 智能标签管理和分类
- **📱 响应式模板** - 6种专业微信公众号模板

## 📋 基础信息

| 项目 | 值 |
|------|-----|
| **API版本** | v1 |
| **基础URL** | `https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1` |
| **本地开发URL** | `http://localhost:8787/api/v1` |
| **内容类型** | `application/json` |
| **认证方式** | Bearer Token (`Authorization: Bearer <token>`) |
| **测试API密钥** | `aiwenchuang` |
| **请求频率限制** | 1000次/分钟 |
| **内容大小限制** | 25MB |
| **支持的响应格式** | JSON, HTML, Markdown, SSE |

## 🔐 认证和安全

### API密钥认证
```http
Authorization: Bearer your-api-key
```

### 测试用API密钥
```bash
# 开发和测试使用
Authorization: Bearer aiwenchuang
```

### 安全特性
- ✅ 输入验证和清理
- ✅ XSS攻击防护
- ✅ JSON注入防护
- ✅ 速率限制
- ✅ CORS跨域支持

## 📄 标准响应格式

### ✅ 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 响应数据
  },
  "meta": {
    "timestamp": "2025-08-16T16:22:00.000Z",
    "version": "v1"
  }
}
```

### ❌ 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息",
    "timestamp": "2025-08-16T16:22:00.000Z"
  }
}
```

### 🚨 错误代码表

| 错误代码 | 描述 | HTTP状态码 | 解决方案 |
|---------|------|----------|----------|
| `INVALID_API_KEY` | API密钥无效 | 403 | 检查密钥格式和有效性 |
| `MISSING_API_KEY` | API密钥缺失 | 401 | 添加Authorization头 |
| `INVALID_INPUT` | 输入参数无效 | 400 | 检查请求参数格式 |
| `TEMPLATE_NOT_FOUND` | 模板不存在 | 404 | 使用有效的模板ID |
| `CONTENT_NOT_FOUND` | 内容不存在 | 404 | 检查内容ID是否正确 |
| `WORKFLOW_NOT_FOUND` | 工作流不存在 | 404 | 检查工作流ID |
| `WORKFLOW_ERROR` | 工作流执行错误 | 500 | 检查工作流配置 |
| `CONTENT_TOO_LARGE` | 内容超过大小限制 | 400 | 减少内容大小到25MB以下 |
| `INTERNAL_ERROR` | 内部服务器错误 | 500 | 联系技术支持 |

---

# 🛠️ API接口详细说明

## 1️⃣ 系统管理 API

### 🔍 获取系统状态
检查系统健康状态和能力信息。

```http
GET /api/v1/status
```

#### 响应示例
```json
{
  "success": true,
  "message": "服务运行正常",
  "data": {
    "status": "healthy",
    "uptime": 1755356481747,
    "version": "v1",
    "capabilities": {
      "templates": 6,
      "workflows": 2,
      "features": [
        "content_rendering",
        "ai_workflows", 
        "template_system",
        "content_management",
        "batch_operations",
        "search_indexing",
        "import_export",
        "streaming_responses"
      ]
    }
  },
  "meta": {
    "timestamp": "2025-08-16T16:22:00.000Z",
    "version": "v1"
  }
}
```

---

## 2️⃣ 模板管理 API

### 📋 获取模板列表
获取所有可用的内容模板。

```http
GET /api/v1/templates
```

#### 响应示例
```json
{
  "success": true,
  "message": "获取模板列表成功",
  "data": [
    {
      "id": "article_wechat",
      "name": "微信文章通用模板",
      "description": "专为微信公众号设计的通用文章模板，完全兼容微信编辑器约束",
      "type": "html"
    },
    {
      "id": "tech_analysis_wechat",
      "name": "技术解读模板",
      "description": "专为技术内容解读设计的微信公众号模板",
      "type": "html"
    },
    {
      "id": "news_modern_wechat",
      "name": "现代新闻模板",
      "description": "专为新闻资讯设计的微信公众号模板",
      "type": "html"
    },
    {
      "id": "github_project_wechat",
      "name": "GitHub项目推荐模板",
      "description": "专为开源项目推荐设计的微信公众号模板",
      "type": "html"
    },
    {
      "id": "ai_benchmark_wechat",
      "name": "AI基准测试模板",
      "description": "专为AI模型评测设计的微信公众号模板",
      "type": "html"
    },
    {
      "id": "professional_analysis_wechat",
      "name": "专业分析模板",
      "description": "专为深度技术分析设计的微信公众号模板",
      "type": "html"
    }
  ]
}
```

### 📄 获取特定模板详情
获取指定模板的详细信息。

```http
GET /api/v1/templates/{templateId}
```

#### 参数
- `templateId` (string, required): 模板ID

#### 示例请求
```bash
curl -X GET "https://api.example.com/api/v1/templates/article_wechat"
```

#### 响应示例
```json
{
  "success": true,
  "message": "获取模板详情成功",
  "data": {
    "id": "article_wechat",
    "name": "微信文章通用模板",
    "description": "专为微信公众号设计的通用文章模板，完全兼容微信编辑器约束",
    "type": "html",
    "available": true
  }
}
```

---

## 3️⃣ 工作流管理 API

### 📋 获取可用工作流列表
获取所有可用的AI工作流（包括默认和自定义）。

```http
GET /api/v1/workflows/available
```

#### 响应示例
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
  ]
}
```

### 🚀 执行工作流
执行指定的AI工作流生成内容。

```http
POST /api/v1/workflows/{workflowId}/execute
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### 参数
- `workflowId` (string, required): 工作流ID
- `stream` (query, optional): 是否使用流式响应 (`true`/`false`)

#### URL工作流示例 (dify-general)
```json
{
  "inputs": {
    "url": "https://example.com"
  }
}
```

#### 文章生成工作流示例 (dify-article)
```json
{
  "title": "人工智能的未来发展趋势",
  "style": "professional",
  "context": "技术分析"
}
```

#### 成功响应示例
```json
{
  "success": true,
  "message": "工作流执行成功",
  "data": {
    "workflowId": "dify-article",
    "workflowName": "AI文章生成",
    "isCustom": false,
    "executionId": "exec_abc123def456",
    "result": {
      "content": "# 人工智能的未来发展趋势\n\n人工智能技术正在...",
      "contentId": "content_xyz789",
      "htmlUrl": "https://api.example.com/api/v1/content/content_xyz789/html",
      "viewUrl": "https://api.example.com/api/v1/content/content_xyz789"
    },
    "executedAt": "2025-08-16T16:22:00.000Z"
  }
}
```

#### 🌊 流式响应 (添加 `?stream=true`)
```http
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"type": "start", "message": "开始生成文章"}

data: {"type": "progress", "status": "generating", "data": "正在分析标题..."}

data: {"type": "progress", "status": "generating", "data": "正在生成内容..."}

data: {"type": "complete", "message": "文章生成完成", "content": "# 完整内容...", "hasContent": true}

data: [DONE]
```

### ➕ 添加自定义工作流
添加新的自定义AI工作流。

```http
POST /api/v1/workflows/custom
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### 请求示例
```json
{
  "id": "custom-translate",
  "name": "智能翻译",
  "description": "多语言智能翻译工作流",
  "apiKey": "app-your-dify-workflow-key",
  "type": "url",
  "inputFields": ["url", "target_language"],
  "icon": "ion-md-globe"
}
```

#### 响应示例
```json
{
  "success": true,
  "message": "自定义工作流添加成功",
  "data": {
    "id": "custom-translate",
    "name": "智能翻译",
    "description": "多语言智能翻译工作流",
    "type": "url",
    "message": "自定义工作流添加成功"
  }
}
```

### ❌ 删除自定义工作流
删除指定的自定义工作流。

```http
DELETE /api/v1/workflows/custom/{workflowId}
Authorization: Bearer your-api-key
```

#### 响应示例
```json
{
  "success": true,
  "message": "自定义工作流删除成功",
  "data": {
    "workflowId": "custom-translate",
    "deletedAt": "2025-08-16T16:22:00.000Z"
  }
}
```

---

## 4️⃣ 内容管理 API

### 🎨 渲染内容
将Markdown内容渲染为HTML并保存。

```http
POST /api/v1/content/render
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### 请求参数
```json
{
  "content": "# 标题\n\n这是**markdown**内容。\n\n## 副标题\n\n- 列表项1\n- 列表项2",
  "template": "article_wechat",
  "title": "我的文档",
  "metadata": {
    "author": "张三",
    "category": "技术",
    "tags": ["AI", "技术"]
  }
}
```

#### 参数说明
- `content` (string, required): Markdown内容，最大25MB
- `template` (string, optional): 模板ID，默认为 `article_wechat`
- `title` (string, optional): 内容标题
- `metadata` (object, optional): 额外的元数据

#### 成功响应示例
```json
{
  "success": true,
  "message": "内容渲染成功",
  "data": {
    "contentId": "content_abc123def456",
    "viewUrl": "https://api.example.com/api/v1/content/content_abc123def456",
    "htmlUrl": "https://api.example.com/api/v1/content/content_abc123def456/html",
    "template": "article_wechat",
    "title": "我的文档",
    "metadata": {
      "source": "api",
      "version": "v1",
      "renderEngine": "marked",
      "author": "张三",
      "category": "技术",
      "tags": ["AI", "技术"]
    },
    "createdAt": "2025-08-16T16:22:00.000Z",
    "data": {
      "htmlUrl": "https://api.example.com/api/v1/content/content_abc123def456/html"
    }
  }
}
```

### 📋 获取内容列表
获取所有内容的分页列表。

```http
GET /api/v1/content?page=1&limit=10
Authorization: Bearer your-api-key
```

#### 查询参数
- `page` (number, optional): 页码，默认为1
- `limit` (number, optional): 每页数量，默认为10，最大100
- `cursor` (string, optional): 分页游标（用于大数据量分页）

#### 响应示例
```json
{
  "success": true,
  "message": "获取内容列表成功",
  "data": {
    "contents": [
      {
        "contentId": "content_abc123",
        "title": "AI技术发展趋势",
        "template": "article_wechat",
        "createdAt": "2025-08-16T16:22:00.000Z",
        "metadata": {
          "author": "张三",
          "source": "workflow"
        }
      },
      {
        "contentId": "content_def456",
        "title": "深度学习实践指南",
        "template": "tech_analysis_wechat",
        "createdAt": "2025-08-16T16:20:00.000Z",
        "metadata": {
          "author": "李四",
          "source": "api"
        }
      }
    ],
    "pagination": {
      "cursor": "next_cursor_token",
      "hasMore": true
    }
  }
}
```

### 📄 获取内容详情
获取指定内容的完整信息。

```http
GET /api/v1/content/{contentId}
```

#### 参数
- `contentId` (string, required): 内容ID

#### 响应示例
```json
{
  "success": true,
  "message": "获取内容成功",
  "data": {
    "contentId": "content_abc123def456",
    "content": "# 标题\n\n这是内容...",
    "template": "article_wechat",
    "title": "我的文档",
    "metadata": {
      "source": "api",
      "version": "v1",
      "renderEngine": "marked",
      "author": "张三"
    },
    "html": "<html>渲染后的HTML...</html>",
    "createdAt": "2025-08-16T16:22:00.000Z",
    "updatedAt": "2025-08-16T16:22:00.000Z",
    "stats": {
      "views": 5,
      "renders": 1
    }
  }
}
```

### 🌐 获取HTML内容
获取内容的渲染后HTML页面。

```http
GET /api/v1/content/{contentId}/html?template=article_wechat&title=自定义标题
```

#### 查询参数
- `template` (string, optional): 临时使用的模板ID
- `title` (string, optional): 临时使用的标题

#### 响应
```http
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>我的文档</title>
    <!-- 完整的HTML内容 -->
</head>
<body>
    <!-- 渲染后的内容 -->
</body>
</html>
```

### 🔄 更新内容
更新已存在的内容。

```http
PUT /api/v1/content/{contentId}
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### 请求参数
```json
{
  "content": "# 更新后的标题\n\n更新后的内容...",
  "title": "新标题",
  "template": "tech_analysis_wechat",
  "status": "published",
  "tags": ["AI", "更新"],
  "metadata": {
    "author": "李四",
    "updatedReason": "内容优化"
  }
}
```

#### 参数说明
- `content` (string, optional): 新的Markdown内容
- `title` (string, optional): 新标题
- `template` (string, optional): 新模板ID
- `status` (string, optional): 内容状态 (`draft`, `published`, `archived`)
- `tags` (array, optional): 标签列表
- `metadata` (object, optional): 额外元数据

### ❌ 删除内容
删除指定的内容。

```http
DELETE /api/v1/content/{contentId}
Authorization: Bearer your-api-key
```

#### 响应示例
```json
{
  "success": true,
  "message": "内容删除成功",
  "data": {
    "contentId": "content_abc123def456",
    "deletedAt": "2025-08-16T16:22:00.000Z"
  }
}
```

---

## 5️⃣ 批量操作 API

### 🗑️ 批量删除内容
一次性删除多个内容。

```http
POST /api/v1/content/bulk/delete
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### 请求参数
```json
{
  "contentIds": [
    "content_abc123",
    "content_def456", 
    "content_ghi789"
  ]
}
```

#### 响应示例
```json
{
  "success": true,
  "message": "批量删除完成",
  "data": {
    "success": [
      "content_abc123",
      "content_def456"
    ],
    "failed": [
      {
        "contentId": "content_ghi789",
        "error": "内容不存在"
      }
    ]
  }
}
```

### 🔄 批量更新状态
批量更新内容状态。

```http
POST /api/v1/content/bulk/status
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### 请求参数
```json
{
  "contentIds": [
    "content_abc123",
    "content_def456"
  ],
  "status": "published"
}
```

#### 状态值
- `draft` - 草稿
- `published` - 已发布
- `archived` - 已归档

#### 响应示例
```json
{
  "success": true,
  "message": "批量更新状态完成",
  "data": {
    "success": [
      "content_abc123",
      "content_def456"
    ],
    "failed": []
  }
}
```

---

## 6️⃣ 导入导出 API

### 📤 导出内容
导出内容为指定格式。

```http
GET /api/v1/content/{contentId}/export?format=json
```

#### 查询参数
- `format` (string, optional): 导出格式
  - `json` - JSON格式（默认）
  - `markdown` - Markdown格式
  - `html` - HTML格式

#### JSON格式响应
```http
Content-Type: application/json
Content-Disposition: attachment; filename="content_abc123.json"

{
  "contentId": "content_abc123",
  "content": "# 标题\n\n内容...",
  "title": "文档标题",
  "template": "article_wechat",
  "metadata": {...},
  "createdAt": "2025-08-16T16:22:00.000Z"
}
```

#### Markdown格式响应
```http
Content-Type: text/markdown
Content-Disposition: attachment; filename="content_abc123.md"

# 标题

这是内容...
```

#### HTML格式响应
```http
Content-Type: text/html
Content-Disposition: attachment; filename="content_abc123.html"

<!DOCTYPE html>
<html>
...
</html>
```

### 📥 导入内容
从外部文件导入内容。

```http
POST /api/v1/content/import
Authorization: Bearer your-api-key
Content-Type: application/json
```

#### JSON格式导入
```json
{
  "content": "# 导入的内容\n\n这是导入的markdown内容...",
  "title": "导入的文档",
  "template": "article_wechat",
  "tags": ["导入", "测试"],
  "metadata": {
    "source": "external",
    "importedFrom": "backup"
  }
}
```

#### Markdown格式导入
```http
Content-Type: text/markdown

# 导入的Markdown文档

这是直接从Markdown文件导入的内容...
```

#### 响应示例
```json
{
  "success": true,
  "message": "内容导入成功",
  "data": {
    "contentId": "content_imported_123",
    "title": "导入的文档",
    "status": "draft",
    "type": "import",
    "tags": ["导入", "测试"],
    "createdAt": "2025-08-16T16:22:00.000Z",
    "metadata": {
      "source": "api",
      "version": 1,
      "author": "system",
      "importedFrom": "json",
      "importedAt": "2025-08-16T16:22:00.000Z"
    }
  }
}
```

---

## 7️⃣ 搜索和查询 API

### 🔍 高级搜索 (原有搜索)
使用传统搜索方法查询内容。

```http
GET /api/v1/content/search?q=AI&type=article&template=article_wechat&limit=20
Authorization: Bearer your-api-key
```

#### 查询参数
- `q` (string, optional): 搜索关键词
- `type` (string, optional): 内容类型过滤 (`workflow`, `manual`, `all`)
- `template` (string, optional): 模板过滤
- `limit` (number, optional): 结果数量限制，默认20
- `cursor` (string, optional): 分页游标

### ⚡ 索引搜索 (新增高性能搜索)
使用高性能索引进行快速搜索。

```http
GET /api/v1/index/search?q=人工智能&limit=10
```

#### 全文搜索
```bash
# 搜索包含"人工智能"的内容
curl "https://api.example.com/api/v1/index/search?q=人工智能&limit=10"
```

#### 按状态搜索
```bash
# 搜索所有已发布的内容
curl "https://api.example.com/api/v1/index/search?status=published"
```

#### 按标签搜索
```bash
# 搜索带有"AI"标签的内容
curl "https://api.example.com/api/v1/index/search?tag=AI"
```

#### 多条件组合搜索
```bash
# 搜索已发布的技术分析模板内容，作者为张三
curl "https://api.example.com/api/v1/index/search?status=published&template=tech_analysis_wechat&author=张三"
```

#### 使用特定索引类型搜索
```bash
# 使用标签索引搜索
curl "https://api.example.com/api/v1/index/search?type=tag&value=AI"
```

#### 响应示例
```json
{
  "success": true,
  "message": "搜索完成",
  "data": {
    "query": "人工智能",
    "conditions": {
      "q": "人工智能",
      "limit": "10"
    },
    "results": [
      {
        "contentId": "content_abc123",
        "title": "人工智能发展趋势分析",
        "template": "tech_analysis_wechat",
        "status": "published",
        "type": "article",
        "tags": ["AI", "技术", "分析"],
        "createdAt": "2025-08-16T16:22:00.000Z",
        "snippet": "...人工智能技术在近年来发展迅速，特别是在机器学习和深度学习领域..."
      }
    ],
    "total": 1
  }
}
```

### 🔗 通过工作流查询内容
根据工作流执行ID查询生成的内容。

```http
GET /api/v1/content/workflow/{executionId}
```

#### 参数
- `executionId` (string, required): 工作流执行ID

#### 响应示例
```json
{
  "success": true,
  "message": "获取工作流内容成功",
  "data": {
    "contentId": "content_workflow_123",
    "content": "工作流生成的内容...",
    "title": "AI生成的文章",
    "template": "article_wechat",
    "metadata": {
      "source": "workflow",
      "workflowId": "dify-article",
      "executionId": "exec_abc123",
      "workflowType": "text"
    },
    "workflowExecutionId": "exec_abc123",
    "createdAt": "2025-08-16T16:22:00.000Z"
  }
}
```

---

## 8️⃣ 统计分析 API

### 📊 内容统计
获取详细的内容统计信息。

```http
GET /api/v1/content/statistics
Authorization: Bearer your-api-key
```

#### 响应示例
```json
{
  "success": true,
  "message": "获取统计信息成功",
  "data": {
    "total": 156,
    "byStatus": {
      "draft": 23,
      "published": 98,
      "archived": 35
    },
    "byType": {
      "article": 89,
      "workflow": 45,
      "import": 22
    },
    "byTemplate": {
      "article_wechat": 67,
      "tech_analysis_wechat": 34,
      "news_modern_wechat": 28,
      "github_project_wechat": 15,
      "ai_benchmark_wechat": 8,
      "professional_analysis_wechat": 4
    },
    "topTags": [
      {
        "tag": "AI",
        "count": 45
      },
      {
        "tag": "技术",
        "count": 32
      },
      {
        "tag": "分析",
        "count": 28
      }
    ],
    "recentUpdates": [
      {
        "contentId": "content_latest_123",
        "title": "最新技术趋势",
        "updatedAt": "2025-08-16T16:22:00.000Z"
      }
    ]
  }
}
```

### 📈 索引统计
获取搜索索引的统计信息。

```http
GET /api/v1/index/statistics
Authorization: Bearer your-api-key
```

#### 响应示例
```json
{
  "success": true,
  "message": "获取索引统计成功",
  "data": {
    "totalIndexes": 1247,
    "byType": {
      "status": 156,
      "type": 156,
      "tag": 234,
      "template": 156,
      "author": 89,
      "date": 156,
      "workflow": 45,
      "fulltext": 255
    },
    "topKeywords": [
      {
        "keyword": "人工智能",
        "count": 45
      },
      {
        "keyword": "技术",
        "count": 38
      },
      {
        "keyword": "分析",
        "count": 32
      },
      {
        "keyword": "深度学习",
        "count": 28
      },
      {
        "keyword": "机器学习",
        "count": 25
      }
    ]
  }
}
```

---

## 9️⃣ 索引管理 API

### 🔄 重建索引
重建所有内容的搜索索引。

```http
POST /api/v1/index/rebuild
Authorization: Bearer your-api-key
```

#### 响应示例
```json
{
  "success": true,
  "message": "索引重建完成",
  "data": {
    "success": true,
    "indexedCount": 156,
    "duration": 2340
  }
}
```

### ⚡ 优化索引
清理无效索引，提高查询性能。

```http
POST /api/v1/index/optimize
Authorization: Bearer your-api-key
```

#### 响应示例
```json
{
  "success": true,
  "message": "索引优化完成",
  "data": {
    "success": true,
    "removedCount": 23,
    "duration": 890
  }
}
```

---

# 📚 使用示例和最佳实践

## 🌟 完整工作流示例

### 1. 创建和发布文章的完整流程

```javascript
// 第一步：使用AI工作流生成内容
const workflowResponse = await fetch('/api/v1/workflows/dify-article/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer aiwenchuang',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '人工智能在医疗领域的应用',
    style: 'professional',
    context: '最新技术趋势分析'
  })
});

const workflowResult = await workflowResponse.json();
const contentId = workflowResult.data.result.contentId;

// 第二步：更新内容状态为已发布
const publishResponse = await fetch('/api/v1/content/bulk/status', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer aiwenchuang',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentIds: [contentId],
    status: 'published'
  })
});

// 第三步：导出为HTML文件
const exportResponse = await fetch(`/api/v1/content/${contentId}/export?format=html`);
const htmlContent = await exportResponse.text();

console.log('文章创建并发布完成！');
```

### 2. 批量内容管理示例

```javascript
// 批量导入内容
const importRequests = [
  {
    content: '# 文章1\n内容1...',
    title: '技术文章1',
    tags: ['技术', 'AI']
  },
  {
    content: '# 文章2\n内容2...',
    title: '技术文章2', 
    tags: ['技术', '分析']
  }
];

const importedIds = [];
for (const article of importRequests) {
  const response = await fetch('/api/v1/content/import', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer aiwenchuang',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  });
  
  const result = await response.json();
  importedIds.push(result.data.contentId);
}

// 批量发布
await fetch('/api/v1/content/bulk/status', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer aiwenchuang',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentIds: importedIds,
    status: 'published'
  })
});

console.log(`成功导入并发布 ${importedIds.length} 篇文章`);
```

### 3. 高级搜索和分析示例

```javascript
// 多维度搜索
const searchResponse = await fetch('/api/v1/index/search?q=人工智能&status=published&template=tech_analysis_wechat&limit=20');
const searchResults = await searchResponse.json();

// 获取统计信息
const statsResponse = await fetch('/api/v1/content/statistics', {
  headers: { 'Authorization': 'Bearer aiwenchuang' }
});
const stats = await statsResponse.json();

// 分析热门标签
const topTags = stats.data.topTags.slice(0, 5);
console.log('热门标签：', topTags);

// 按标签搜索相关内容
for (const tag of topTags) {
  const tagSearch = await fetch(`/api/v1/index/search?tag=${tag.tag}&limit=5`);
  const tagResults = await tagSearch.json();
  console.log(`标签"${tag.tag}"相关内容：`, tagResults.data.results.length);
}
```

## 🔧 cURL示例

### 基础操作
```bash
# 获取系统状态
curl -X GET "https://api.example.com/api/v1/status"

# 获取模板列表
curl -X GET "https://api.example.com/api/v1/templates"

# 执行AI工作流
curl -X POST "https://api.example.com/api/v1/workflows/dify-article/execute" \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI技术发展趋势",
    "style": "professional",
    "context": "2025年技术预测"
  }'

# 渲染内容
curl -X POST "https://api.example.com/api/v1/content/render" \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Hello World\n\n这是一个测试文档。",
    "template": "article_wechat",
    "title": "测试文档"
  }'
```

### 高级操作
```bash
# 批量更新状态
curl -X POST "https://api.example.com/api/v1/content/bulk/status" \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "contentIds": ["content_123", "content_456"],
    "status": "published"
  }'

# 高性能搜索
curl -X GET "https://api.example.com/api/v1/index/search?q=人工智能&status=published&limit=10"

# 导出内容
curl -X GET "https://api.example.com/api/v1/content/content_123/export?format=markdown" \
  -H "Authorization: Bearer aiwenchuang" \
  -o "exported_content.md"

# 重建索引
curl -X POST "https://api.example.com/api/v1/index/rebuild" \
  -H "Authorization: Bearer aiwenchuang"
```

## 🎯 最佳实践

### 1. 性能优化
- **使用索引搜索**：对于频繁搜索，使用 `/api/v1/index/search` 而非 `/api/v1/content/search`
- **批量操作**：处理多个内容时使用批量API减少请求次数
- **分页处理**：大量数据使用 `cursor` 分页而非 `page` 参数
- **缓存HTML**：利用预渲染的HTML内容减少重复渲染

### 2. 内容管理策略
- **状态管理**：合理使用 `draft` → `published` → `archived` 状态流程
- **标签规范**：建立统一的标签命名规范，便于搜索和分类
- **模板选择**：根据内容类型选择合适的模板
- **元数据完整性**：添加完整的 `metadata` 便于后续管理

### 3. 安全和错误处理
- **API密钥安全**：生产环境使用安全的API密钥管理
- **输入验证**：客户端进行基础验证，减少无效请求
- **错误重试**：实现指数退避的重试机制
- **内容备份**：定期导出重要内容进行备份

### 4. 监控和维护
- **定期索引优化**：定期调用 `/api/v1/index/optimize` 维护索引性能
- **统计分析**：利用统计API监控系统使用情况
- **性能监控**：监控API响应时间和成功率
- **容量规划**：根据统计数据进行容量规划

---

# 🚨 故障排除

## 常见问题和解决方案

### ❌ 认证失败
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "API密钥无效"
  }
}
```
**解决方案**：
- 检查API密钥是否正确
- 确认 `Authorization: Bearer <token>` 格式正确
- 开发环境可使用测试密钥 `aiwenchuang`

### ❌ JSON解析错误
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "请求体JSON格式错误"
  }
}
```
**解决方案**：
- 检查JSON格式是否正确
- 确认Content-Type为 `application/json`
- 转义特殊字符（引号、换行符等）

### ❌ 内容过大
```json
{
  "success": false,
  "error": {
    "code": "CONTENT_TOO_LARGE",
    "message": "内容超过25MB限制"
  }
}
```
**解决方案**：
- 减少内容大小到25MB以下
- 分割大文档为多个小文档
- 使用外部存储存放大型资源文件

### ❌ 模板不存在
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_FOUND",
    "message": "模板不存在"
  }
}
```
**解决方案**：
- 使用 `GET /api/v1/templates` 获取有效模板列表
- 检查模板ID拼写是否正确
- 使用默认模板 `article_wechat`

### ❌ 内容不存在
```json
{
  "success": false,
  "error": {
    "code": "CONTENT_NOT_FOUND",
    "message": "内容不存在",
    "details": "请先使用 GET /api/v1/content 获取有效的内容ID列表"
  }
}
```
**解决方案**：
- 使用 `GET /api/v1/content` 获取有效内容ID
- 检查内容ID是否正确
- 确认内容未被删除

## 🔧 调试技巧

### 1. 使用API测试工具
访问 `https://your-domain.com/api-tester` 使用内置的API测试工具，支持：
- 动态加载真实内容ID
- 自动API密钥填充
- 实时响应查看
- 错误信息展示

### 2. 查看详细错误信息
所有错误响应都包含详细信息：
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "用户友好的错误消息",
    "details": "技术详细信息",
    "timestamp": "错误发生时间"
  }
}
```

### 3. 监控系统状态
定期检查系统状态：
```bash
curl https://api.example.com/api/v1/status
```

### 4. 性能优化建议
- 使用HTTP/2协议提高并发性能
- 启用gzip压缩减少传输大小
- 合理设置缓存策略
- 使用CDN加速访问

---

# 📞 技术支持

## 联系方式
- **技术文档**：[https://docs.example.com](https://docs.example.com)
- **API测试工具**：[https://api.example.com/api-tester](https://api.example.com/api-tester)
- **问题反馈**：[GitHub Issues](https://github.com/your-repo/issues)
- **技术支持**：support@example.com

## 版本信息
- **API版本**：v1
- **文档版本**：2.0
- **最后更新**：2025-08-16
- **系统特性**：企业级AI内容管理平台

---

> 🎉 **感谢使用AI驱动内容管理平台！**
> 
> 这是一个功能完整、性能优秀的企业级AI内容管理系统，支持从内容创建到发布归档的全流程管理。如有任何问题或建议，欢迎随时联系我们！