# AI驱动内容代理系统 - API重构设计方案

## 1. 设计目标

### 1.1 核心目标
- 提供标准化的RESTful API接口
- 完整的输入输出规范
- 支持MCP协议集成
- 清晰的错误处理机制
- 完善的API文档

### 1.2 功能需求
1. **服务状态检查** - 检查服务健康状态
2. **模板管理** - 查看和管理可用模板
3. **工作流管理** - 查看和调用AI工作流
4. **内容渲染** - 使用模板渲染内容
5. **结果查看** - 获取渲染结果和HTML代码
6. **内容管理** - 上传、存储、检索内容

## 2. API架构设计

### 2.1 基础路径
```
Base URL: https://your-domain.com/api/v1
```

### 2.2 认证机制
```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

### 2.3 标准响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_123456789"
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_123456789"
}
```

## 3. 详细API设计

### 3.1 服务状态API

#### GET /api/v1/health
**功能**: 检查服务健康状态

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 3600,
    "services": {
      "database": "healthy",
      "ai_workflow": "healthy",
      "template_engine": "healthy"
    },
    "metrics": {
      "total_requests": 1000,
      "active_sessions": 5,
      "memory_usage": "45%"
    }
  },
  "message": "服务运行正常",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_health_001"
}
```

### 3.2 模板管理API

#### GET /api/v1/templates
**功能**: 获取所有可用模板

**请求参数**: 
- `category` (可选): 模板分类
- `page` (可选): 页码，默认1
- `limit` (可选): 每页数量，默认20

**响应示例**:
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "article_wechat",
        "name": "微信文章模板",
        "description": "适用于微信公众号的文章模板",
        "category": "article",
        "version": "1.0.0",
        "author": "system",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "preview_url": "/api/v1/templates/article_wechat/preview",
        "schema": {
          "title": {"type": "string", "required": true},
          "content": {"type": "string", "required": true}
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_count": 6,
      "per_page": 20
    }
  },
  "message": "获取模板列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_templates_001"
}
```

#### GET /api/v1/templates/{template_id}
**功能**: 获取特定模板详情

**路径参数**:
- `template_id`: 模板ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "article_wechat",
    "name": "微信文章模板",
    "description": "适用于微信公众号的文章模板",
    "category": "article",
    "version": "1.0.0",
    "author": "system",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "schema": {
      "title": {"type": "string", "required": true, "description": "文章标题"},
      "content": {"type": "string", "required": true, "description": "文章内容(Markdown格式)"}
    },
    "sample_data": {
      "title": "示例文章标题",
      "content": "# 示例标题\n\n这是示例内容..."
    },
    "preview_html": "<html>...</html>"
  },
  "message": "获取模板详情成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_template_detail_001"
}
```

### 3.3 工作流管理API

#### GET /api/v1/workflows
**功能**: 获取所有可用AI工作流

**请求参数**:
- `type` (可选): 工作流类型 (url_analysis, article_generation)
- `status` (可选): 工作流状态 (active, inactive)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "workflows": [
      {
        "id": "url_analysis",
        "name": "URL内容分析",
        "description": "分析URL内容并提取关键信息",
        "type": "url_analysis",
        "status": "active",
        "version": "1.0.0",
        "input_schema": {
          "url": {"type": "string", "required": true, "format": "uri"}
        },
        "output_schema": {
          "content": {"type": "string", "description": "提取的内容"},
          "summary": {"type": "string", "description": "内容摘要"}
        },
        "estimated_time": "30-60秒",
        "cost_per_request": 0.01
      },
      {
        "id": "article_generation",
        "name": "AI文章生成",
        "description": "基于标题和上下文生成文章内容",
        "type": "article_generation",
        "status": "active",
        "version": "1.0.0",
        "input_schema": {
          "title": {"type": "string", "required": true},
          "style": {"type": "string", "required": false},
          "context": {"type": "string", "required": false}
        },
        "output_schema": {
          "content": {"type": "string", "description": "生成的文章内容"}
        },
        "estimated_time": "60-120秒",
        "cost_per_request": 0.05
      }
    ]
  },
  "message": "获取工作流列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_workflows_001"
}
```

#### POST /api/v1/workflows/{workflow_id}/execute
**功能**: 执行指定工作流

**路径参数**:
- `workflow_id`: 工作流ID

**请求体**:
```json
{
  "inputs": {
    "title": "AI技术发展趋势",
    "style": "专业分析",
    "context": "2024年人工智能技术发展现状"
  },
  "options": {
    "stream": true,
    "timeout": 300
  }
}
```

**响应示例** (非流式):
```json
{
  "success": true,
  "data": {
    "execution_id": "exec_123456789",
    "workflow_id": "article_generation",
    "status": "completed",
    "started_at": "2024-01-01T00:00:00.000Z",
    "completed_at": "2024-01-01T00:01:30.000Z",
    "duration": 90,
    "inputs": {
      "title": "AI技术发展趋势",
      "style": "专业分析",
      "context": "2024年人工智能技术发展现状"
    },
    "outputs": {
      "content": "# AI技术发展趋势\n\n## 引言\n\n2024年，人工智能技术..."
    },
    "metadata": {
      "tokens_used": 1500,
      "cost": 0.05
    }
  },
  "message": "工作流执行成功",
  "timestamp": "2024-01-01T00:01:30.000Z",
  "request_id": "req_workflow_exec_001"
}
```

#### GET /api/v1/workflows/executions/{execution_id}
**功能**: 获取工作流执行状态

**路径参数**:
- `execution_id`: 执行ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "execution_id": "exec_123456789",
    "workflow_id": "article_generation",
    "status": "running",
    "progress": 65,
    "started_at": "2024-01-01T00:00:00.000Z",
    "estimated_completion": "2024-01-01T00:01:30.000Z",
    "current_step": "content_generation",
    "steps": [
      {"name": "input_validation", "status": "completed", "duration": 1},
      {"name": "context_analysis", "status": "completed", "duration": 15},
      {"name": "content_generation", "status": "running", "progress": 65},
      {"name": "output_formatting", "status": "pending"}
    ]
  },
  "message": "获取执行状态成功",
  "timestamp": "2024-01-01T00:00:45.000Z",
  "request_id": "req_exec_status_001"
}
```

### 3.4 内容渲染API

#### POST /api/v1/render
**功能**: 使用指定模板渲染内容

**请求体**:
```json
{
  "template_id": "article_wechat",
  "data": {
    "title": "AI技术发展趋势",
    "content": "# AI技术发展趋势\n\n## 引言\n\n2024年，人工智能技术..."
  },
  "options": {
    "save_result": true,
    "generate_preview": true
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "render_id": "render_123456789",
    "template_id": "article_wechat",
    "status": "completed",
    "created_at": "2024-01-01T00:00:00.000Z",
    "data": {
      "title": "AI技术发展趋势",
      "content": "# AI技术发展趋势\n\n## 引言\n\n2024年，人工智能技术..."
    },
    "result": {
      "html": "<!DOCTYPE html><html>...</html>",
      "preview_url": "/api/v1/render/render_123456789/preview",
      "download_url": "/api/v1/render/render_123456789/download"
    },
    "metadata": {
      "file_size": 15420,
      "render_time": 150
    }
  },
  "message": "内容渲染成功",
  "timestamp": "2024-01-01T00:00:00.150Z",
  "request_id": "req_render_001"
}
```

### 3.5 结果查看API

#### GET /api/v1/render/{render_id}
**功能**: 获取渲染结果详情

**路径参数**:
- `render_id`: 渲染结果ID

**查询参数**:
- `include_html` (可选): 是否包含HTML代码，默认false
- `format` (可选): 返回格式 (json, html)，默认json

**响应示例**:
```json
{
  "success": true,
  "data": {
    "render_id": "render_123456789",
    "template_id": "article_wechat",
    "status": "completed",
    "created_at": "2024-01-01T00:00:00.000Z",
    "data": {
      "title": "AI技术发展趋势",
      "content": "# AI技术发展趋势\n\n## 引言\n\n2024年，人工智能技术..."
    },
    "result": {
      "html": "<!DOCTYPE html><html>...</html>",
      "preview_url": "/api/v1/render/render_123456789/preview",
      "download_url": "/api/v1/render/render_123456789/download"
    },
    "metadata": {
      "file_size": 15420,
      "render_time": 150,
      "template_version": "1.0.0"
    }
  },
  "message": "获取渲染结果成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_render_get_001"
}
```

#### GET /api/v1/render/{render_id}/preview
**功能**: 预览渲染结果(返回HTML页面)

**路径参数**:
- `render_id`: 渲染结果ID

**响应**: 直接返回HTML页面

#### GET /api/v1/render/{render_id}/html
**功能**: 获取渲染结果的HTML代码

**路径参数**:
- `render_id`: 渲染结果ID

**查询参数**:
- `format` (可选): 返回格式 (raw, json)，默认raw

**响应示例** (format=json):
```json
{
  "success": true,
  "data": {
    "render_id": "render_123456789",
    "html": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">...</html>",
    "size": 15420,
    "encoding": "utf-8"
  },
  "message": "获取HTML代码成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_html_001"
}
```

### 3.6 内容管理API

#### POST /api/v1/content
**功能**: 上传并存储内容

**请求体**:
```json
{
  "content": "# 标题\n\n内容...",
  "metadata": {
    "title": "自定义标题",
    "author": "作者名称",
    "tags": ["AI", "技术"]
  },
  "options": {
    "auto_render": true,
    "default_template": "article_wechat"
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "content_id": "content_123456789",
    "content": "# 标题\n\n内容...",
    "metadata": {
      "title": "自定义标题",
      "author": "作者名称",
      "tags": ["AI", "技术"],
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "size": 1024,
      "word_count": 150
    },
    "urls": {
      "view": "/api/v1/content/content_123456789",
      "edit": "/api/v1/content/content_123456789/edit",
      "delete": "/api/v1/content/content_123456789"
    },
    "render_result": {
      "render_id": "render_987654321",
      "preview_url": "/api/v1/render/render_987654321/preview"
    }
  },
  "message": "内容上传成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_content_upload_001"
}
```

#### GET /api/v1/content/{content_id}
**功能**: 获取存储的内容

**路径参数**:
- `content_id`: 内容ID

**查询参数**:
- `format` (可选): 返回格式 (json, raw)，默认json
- `include_metadata` (可选): 是否包含元数据，默认true

**响应示例**:
```json
{
  "success": true,
  "data": {
    "content_id": "content_123456789",
    "content": "# 标题\n\n内容...",
    "metadata": {
      "title": "自定义标题",
      "author": "作者名称",
      "tags": ["AI", "技术"],
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "size": 1024,
      "word_count": 150,
      "view_count": 25
    },
    "urls": {
      "view": "/api/v1/content/content_123456789",
      "edit": "/api/v1/content/content_123456789/edit",
      "delete": "/api/v1/content/content_123456789"
    }
  },
  "message": "获取内容成功",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "request_id": "req_content_get_001"
}
```

## 4. 错误代码规范

### 4.1 HTTP状态码
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 认证失败
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突
- `422`: 请求参数验证失败
- `429`: 请求频率限制
- `500`: 服务器内部错误
- `502`: 上游服务错误
- `503`: 服务不可用

### 4.2 业务错误代码
```
AUTH_001: API密钥无效
AUTH_002: API密钥已过期
AUTH_003: 权限不足

VALID_001: 请求参数缺失
VALID_002: 请求参数格式错误
VALID_003: 请求参数值无效

TEMPLATE_001: 模板不存在
TEMPLATE_002: 模板渲染失败
TEMPLATE_003: 模板版本不兼容

WORKFLOW_001: 工作流不存在
WORKFLOW_002: 工作流执行失败
WORKFLOW_003: 工作流超时

CONTENT_001: 内容不存在
CONTENT_002: 内容格式错误
CONTENT_003: 内容大小超限

SYSTEM_001: 系统维护中
SYSTEM_002: 服务暂时不可用
SYSTEM_003: 内部服务错误
```

## 5. MCP协议集成支持

### 5.1 MCP工具定义
每个API端点都将映射为MCP工具，包含：
- 工具名称和描述
- 输入参数schema
- 输出结果schema
- 错误处理规范

### 5.2 示例MCP工具定义
```json
{
  "name": "ai_content_agent_render",
  "description": "使用指定模板渲染内容",
  "inputSchema": {
    "type": "object",
    "properties": {
      "template_id": {"type": "string", "description": "模板ID"},
      "data": {"type": "object", "description": "渲染数据"},
      "options": {"type": "object", "description": "渲染选项"}
    },
    "required": ["template_id", "data"]
  }
}
```

## 6. 实施计划

### 6.1 第一阶段：核心API重构
1. 重构现有API端点
2. 实现标准响应格式
3. 添加完整的错误处理
4. 实现API文档生成

### 6.2 第二阶段：功能扩展
1. 实现工作流管理API
2. 添加内容管理功能
3. 实现渲染结果管理
4. 添加API监控和日志

### 6.3 第三阶段：MCP集成
1. 生成MCP工具定义
2. 实现MCP协议适配器
3. 测试MCP集成
4. 发布到MCP托管平台

## 7. 总结

这个API重构方案提供了：
- 完整的RESTful API设计
- 标准化的输入输出格式
- 全面的错误处理机制
- 清晰的文档规范
- MCP协议集成支持

通过这个设计，系统将具备更好的可扩展性、可维护性和集成能力，为后续的MCP协议集成奠定坚实基础。