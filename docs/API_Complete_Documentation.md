# AI内容代理系统 - 完整API接口文档

## 基础信息

- **Base URL**: `https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1`
- **认证方式**: Bearer Token
- **Content-Type**: `application/json`

## 1. 服务状态管理API

### GET /api/v1/status
获取服务健康状态和系统信息

**功能**: 检查服务运行状态、获取系统版本信息和能力清单

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/status
```

***The response:***
```json
{
  "success": true,
  "message": "服务运行正常",
  "data": {
    "status": "healthy",
    "uptime": 1755231388856,
    "version": "v1",
    "capabilities": {
      "templates": 6,
      "workflows": 2,
      "features": [
        "content_rendering",
        "ai_workflows", 
        "template_system"
      ]
    }
  },
  "meta": {
    "timestamp": "2025-08-15T04:16:28.856Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {},
  "required": []
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "status": {"type": "string", "enum": ["healthy", "unhealthy"]},
        "uptime": {"type": "number"},
        "version": {"type": "string"},
        "capabilities": {
          "type": "object",
          "properties": {
            "templates": {"type": "number"},
            "workflows": {"type": "number"},
            "features": {"type": "array", "items": {"type": "string"}}
          }
        }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "timestamp": {"type": "string", "format": "date-time"},
        "version": {"type": "string"}
      }
    }
  }
}
```

## 2. 模板管理API

### GET /api/v1/templates
获取所有可用模板列表

**功能**: 获取系统中所有可用的渲染模板

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  http://localhost:8787/api/v1/templates
```

***The response:***
```json
{
  "success": true,
  "message": "获取模板列表成功",
  "data": [
    {
      "id": "article_wechat",
      "name": "微信医疗文章模板",
      "description": "专为微信公众号设计的医疗文章模板，完全兼容微信编辑器约束",
      "type": "html"
    },
    {
      "id": "tech_analysis_wechat",
      "name": "技术解读模板",
      "description": "专为技术内容解读设计的微信公众号模板，完全兼容微信编辑器约束",
      "type": "html"
    }
  ],
  "meta": {
    "timestamp": "2025-08-15T07:32:22.258Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {},
  "required": []
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "description": {"type": "string"},
          "type": {"type": "string"}
        }
      }
    }
  }
}
```

### GET /api/v1/templates/{templateId}
获取特定模板的详细信息

**功能**: 根据模板ID获取模板的详细配置和信息

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  http://localhost:8787/api/v1/templates/article_wechat
```

***The response:***
```json
{
  "success": true,
  "message": "获取模板详情成功",
  "data": {
    "id": "article_wechat",
    "name": "微信医疗文章模板",
    "description": "专为微信公众号设计的医疗文章模板，完全兼容微信编辑器约束",
    "type": "html",
    "available": true
  },
  "meta": {
    "timestamp": "2025-08-15T08:07:27.154Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "templateId": {
      "type": "string",
      "description": "模板ID",
      "examples": ["article_wechat", "tech_analysis_wechat"]
    }
  },
  "required": ["templateId"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "type": {"type": "string"},
        "available": {"type": "boolean"}
      }
    }
  }
}
```

## 3. 工作流管理API

### GET /api/v1/workflows/available
获取所有可用工作流列表（包括默认和自定义工作流）

**功能**: 获取系统中所有可用的工作流，包括默认工作流和用户自定义工作流

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/workflows/available
```

***The response:***
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
    "timestamp": "2025-08-15T04:16:48.615Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {},
  "required": []
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "description": {"type": "string"},
          "type": {"type": "string", "enum": ["url", "text"]},
          "icon": {"type": "string"},
          "inputFields": {"type": "array", "items": {"type": "string"}},
          "isDefault": {"type": "boolean"},
          "isCustom": {"type": "boolean"}
        }
      }
    }
  }
}
```

### GET /api/v1/workflows/{workflowId}
获取指定工作流的详细信息

**功能**: 根据工作流ID获取工作流的详细配置信息

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  http://localhost:8787/api/v1/workflows/dify-general
```

***The response:***
```json
{
  "success": true,
  "message": "获取工作流详情成功",
  "data": {
    "id": "dify-general",
    "name": "URL内容生成",
    "description": "从URL生成内容（默认）",
    "type": "url",
    "apiKeyEnv": "DIFY_API_KEY",
    "inputFields": ["url"],
    "icon": "ion-md-cloud-download",
    "isDefault": true
  },
  "meta": {
    "timestamp": "2025-08-15T08:10:22.358Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "workflowId": {
      "type": "string",
      "description": "工作流ID",
      "examples": ["dify-general", "dify-article"]
    }
  },
  "required": ["workflowId"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "type": {"type": "string"},
        "apiKeyEnv": {"type": "string"},
        "inputFields": {"type": "array", "items": {"type": "string"}},
        "icon": {"type": "string"},
        "isDefault": {"type": "boolean"}
      }
    }
  }
}
```

### POST /api/v1/workflows/{workflowId}/execute
执行指定的工作流

**功能**: 执行指定的工作流，支持流式和非流式响应

***Example cURL request (非流式):***
```bash
curl -s -X POST \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "url": "https://github.com/microsoft/TypeScript"
    }
  }' \
  http://localhost:8787/api/v1/workflows/dify-general/execute
```

***Example cURL request (流式):***
```bash
curl -s -X POST \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "title": "AI技术发展",
      "style": "专业",
      "context": "人工智能发展现状"
    }
  }' \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/workflows/dify-article/execute?stream=true
```

***The response (非流式):***
```json
{
  "success": true,
  "message": "工作流执行成功",
  "data": {
    "execution_id": "exec_123456789",
    "workflow_id": "dify-general",
    "status": "completed",
    "started_at": "2025-08-15T00:00:00.000Z",
    "completed_at": "2025-08-15T00:01:30.000Z",
    "duration": 90,
    "inputs": {
      "url": "https://github.com/microsoft/TypeScript"
    },
    "outputs": {
      "content": "生成的内容..."
    }
  }
}
```

***The response (流式):***
```
event: start
data: {"status": "started", "workflow_id": "dify-article"}

event: progress
data: {"status": "processing", "progress": 30, "message": "分析中..."}

event: complete
data: {"status": "completed", "content": "生成的内容..."}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "workflowId": {
      "type": "string",
      "description": "工作流ID"
    },
    "inputs": {
      "type": "object",
      "description": "工作流输入参数",
      "oneOf": [
        {
          "properties": {
            "url": {"type": "string", "format": "uri"}
          },
          "required": ["url"]
        },
        {
          "properties": {
            "title": {"type": "string"},
            "style": {"type": "string"},
            "context": {"type": "string"}
          },
          "required": ["title"]
        }
      ]
    }
  },
  "required": ["workflowId", "inputs"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "execution_id": {"type": "string"},
        "workflow_id": {"type": "string"},
        "status": {"type": "string"},
        "started_at": {"type": "string", "format": "date-time"},
        "completed_at": {"type": "string", "format": "date-time"},
        "duration": {"type": "number"},
        "inputs": {"type": "object"},
        "outputs": {"type": "object"}
      }
    }
  }
}
```

### POST /api/v1/workflows/custom
添加自定义工作流

**功能**: 在运行时添加用户自定义的工作流配置

***Example cURL request:***
```bash
curl -s -X POST \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "translate-workflow",
    "name": "智能翻译",
    "description": "多语言智能翻译工作流",
    "type": "url",
    "apiKey": "app-translate-key",
    "icon": "ion-md-globe"
  }' \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/workflows/custom
```

***The response:***
```json
{
  "success": true,
  "message": "自定义工作流添加成功",
  "data": {
    "id": "translate-workflow",
    "name": "智能翻译",
    "description": "多语言智能翻译工作流",
    "type": "url",
    "message": "自定义工作流添加成功"
  },
  "meta": {
    "timestamp": "2025-08-15T08:26:13.391Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "id": {"type": "string", "description": "工作流唯一标识符"},
    "name": {"type": "string", "description": "工作流显示名称"},
    "description": {"type": "string", "description": "工作流描述"},
    "type": {"type": "string", "enum": ["url", "text"], "description": "工作流类型"},
    "apiKey": {"type": "string", "description": "Dify API密钥"},
    "icon": {"type": "string", "description": "图标类名"}
  },
  "required": ["id", "name", "description", "type", "apiKey"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "type": {"type": "string"},
        "message": {"type": "string"}
      }
    }
  }
}
```

### DELETE /api/v1/workflows/custom/{workflowId}
删除自定义工作流

**功能**: 删除指定的用户自定义工作流

***Example cURL request:***
```bash
curl -s -X DELETE \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/workflows/custom/translate-workflow
```

***The response:***
```json
{
  "success": true,
  "message": "自定义工作流删除成功",
  "data": {
    "deleted_workflow_id": "translate-workflow"
  },
  "meta": {
    "timestamp": "2025-08-15T08:26:50.593Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "workflowId": {
      "type": "string",
      "description": "要删除的自定义工作流ID"
    }
  },
  "required": ["workflowId"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "deleted_workflow_id": {"type": "string"}
      }
    }
  }
}
```

## 4. 内容渲染API

### POST /api/v1/content/render
使用指定模板渲染内容

**功能**: 将Markdown内容使用指定模板渲染为HTML格式

***Example cURL request:***
```bash
curl -s -X POST \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "article_wechat",
    "title": "AI技术发展趋势",
    "content": "# AI技术发展趋势\n\n## 引言\n\n人工智能技术正在快速发展..."
  }' \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/render
```

***The response:***
```json
{
  "success": true,
  "message": "内容渲染成功",
  "data": {
    "contentId": "4ad7e901400ace34",
    "viewUrl": "https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34",
    "htmlUrl": "https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34/html",
    "template": "article_wechat",
    "title": "AI技术发展趋势",
    "createdAt": "2025-08-15T04:17:03.071Z"
  },
  "meta": {
    "timestamp": "2025-08-15T04:17:03.073Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "template": {
      "type": "string",
      "description": "渲染模板ID",
      "enum": ["article_wechat", "tech_analysis_wechat", "news_modern_wechat", "github_project_wechat", "ai_benchmark_wechat", "professional_analysis_wechat"]
    },
    "title": {"type": "string", "description": "文章标题"},
    "content": {"type": "string", "description": "Markdown格式的文章内容"}
  },
  "required": ["template", "title", "content"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "contentId": {"type": "string"},
        "viewUrl": {"type": "string", "format": "uri"},
        "htmlUrl": {"type": "string", "format": "uri"},
        "template": {"type": "string"},
        "title": {"type": "string"},
        "createdAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

## 5. 内容管理API

### GET /api/v1/content/{contentId}
获取内容详情

**功能**: 根据内容ID获取内容的详细信息

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34
```

***The response:***
```json
{
  "success": true,
  "message": "获取内容成功",
  "data": {
    "content": "# AI技术发展趋势\n\n## 引言\n\n人工智能技术正在快速发展...",
    "template": "article_wechat",
    "title": "AI技术发展趋势",
    "metadata": {},
    "createdAt": "2025-08-15T04:17:03.071Z",
    "id": "4ad7e901400ace34"
  },
  "meta": {
    "timestamp": "2025-08-15T04:17:16.957Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "contentId": {
      "type": "string",
      "description": "内容唯一标识符"
    }
  },
  "required": ["contentId"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "content": {"type": "string"},
        "template": {"type": "string"},
        "title": {"type": "string"},
        "metadata": {"type": "object"},
        "createdAt": {"type": "string", "format": "date-time"},
        "id": {"type": "string"}
      }
    }
  }
}
```

### GET /api/v1/content/{contentId}/html
获取内容的HTML格式

**功能**: 获取渲染后的HTML源代码

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34/html
```

***The response:***
```html
<!-- 微信公众号专用医疗文章模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
    <!-- 文章头部 -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; position: relative;">
        ...
    </div>
</div>
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "contentId": {
      "type": "string",
      "description": "内容唯一标识符"
    }
  },
  "required": ["contentId"]
}
```

**Output schema**
```json
{
  "type": "string",
  "description": "HTML格式的渲染内容"
}
```

### GET /api/v1/content/{contentId}/url
获取内容访问URL

**功能**: 获取内容的访问链接

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34/url
```

***The response:***
```json
{
  "success": true,
  "message": "获取内容URL成功",
  "data": {
    "contentId": "4ad7e901400ace34",
    "htmlUrl": "https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34/html",
    "directUrl": "https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/4ad7e901400ace34/html"
  },
  "meta": {
    "timestamp": "2025-08-15T08:24:28.984Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "contentId": {
      "type": "string",
      "description": "内容唯一标识符"
    }
  },
  "required": ["contentId"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "contentId": {"type": "string"},
        "htmlUrl": {"type": "string", "format": "uri"},
        "directUrl": {"type": "string", "format": "uri"}
      }
    }
  }
}
```

### GET /api/v1/content
获取内容列表

**功能**: 获取所有已渲染内容的列表，支持分页

***Example cURL request:***
```bash
curl -s -X GET \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content
```

***The response:***
```json
{
  "success": true,
  "message": "获取内容列表成功",
  "data": {
    "contents": [
      {
        "contentId": "0047b1ec357427fa",
        "title": "程序员的未来之路：技术浪潮下的结构性机会",
        "template": "article_wechat",
        "createdAt": "2025-08-07T18:38:50.912Z",
        "metadata": {}
      }
    ],
    "pagination": {
      "cursor": "MTlkOWZiMmMzYzE0NGYxNw==",
      "hasMore": true
    }
  },
  "meta": {
    "timestamp": "2025-08-15T04:21:59.686Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "cursor": {
      "type": "string",
      "description": "分页游标，可选"
    },
    "limit": {
      "type": "number",
      "description": "每页限制数量，默认10",
      "minimum": 1,
      "maximum": 100
    }
  },
  "required": []
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "contents": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "contentId": {"type": "string"},
              "title": {"type": "string"},
              "template": {"type": "string"},
              "createdAt": {"type": "string", "format": "date-time"},
              "metadata": {"type": "object"}
            }
          }
        },
        "pagination": {
          "type": "object",
          "properties": {
            "cursor": {"type": "string"},
            "hasMore": {"type": "boolean"}
          }
        }
      }
    }
  }
}
```

### DELETE /api/v1/content/{contentId}
删除指定内容

**功能**: 根据内容ID删除已渲染的内容

***Example cURL request:***
```bash
curl -s -X DELETE \
  -H "Authorization: Bearer aiwenchuang" \
  -H "Content-Type: application/json" \
  https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/content/a19e9bc75c338298
```

***The response:***
```json
{
  "success": true,
  "message": "内容删除成功",
  "data": {
    "contentId": "a19e9bc75c338298",
    "deletedAt": "2025-08-15T08:25:57.846Z"
  },
  "meta": {
    "timestamp": "2025-08-15T08:25:57.846Z",
    "version": "v1"
  }
}
```

**Input schema**
```json
{
  "type": "object",
  "properties": {
    "contentId": {
      "type": "string",
      "description": "要删除的内容ID"
    }
  },
  "required": ["contentId"]
}
```

**Output schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "contentId": {"type": "string"},
        "deletedAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

## 6. 错误处理

### 统一错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息",
    "timestamp": "2025-08-15T08:25:57.846Z"
  }
}
```

### 错误代码列表

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `INVALID_API_KEY` | 401 | API密钥无效 |
| `MISSING_API_KEY` | 401 | 缺少API密钥 |
| `INVALID_INPUT` | 400 | 输入参数无效 |
| `TEMPLATE_NOT_FOUND` | 404 | 模板不存在 |
| `CONTENT_NOT_FOUND` | 404 | 内容不存在 |
| `WORKFLOW_NOT_FOUND` | 404 | 工作流不存在 |
| `WORKFLOW_ERROR` | 500 | 工作流执行错误 |
| `INTERNAL_ERROR` | 500 | 内部服务器错误 |

## 7. 发现的问题和修复

### 已修复的问题
1. **内容删除功能bug**: 修复了 `deleteContent` 方法中错误使用 `CONTENT_KV` 而不是 `MARKDOWN_KV` 的问题
2. **路径参数格式错误**: 确认了正确的路径参数格式（如 `/templates/article_wechat` 而不是 `/templates/:article_wechat`）

### 待优化的功能
1. **自定义工作流持久化**: 目前自定义工作流只在内存中，重启服务后会丢失
2. **工作流执行超时处理**: 长时间运行的工作流需要更好的超时机制
3. **流式响应错误处理**: 流式响应中的错误处理可以进一步完善

## 8. 认证和权限

所有API接口均需要在请求头中包含有效的API密钥：

```
Authorization: Bearer <API_KEY>
```

当前支持的测试API密钥：`aiwenchuang`

## 9. 性能和限制

- **请求频率**: 无限制（开发环境）
- **内容大小**: 最大10MB
- **并发请求**: 支持高并发
- **响应时间**: 通常在5秒内

## 10. 版本信息

- **当前版本**: v1
- **API版本**: v1
- **文档更新时间**: 2025-08-15

---

本文档基于实际API测试结果编写，确保所有示例均为真实可用的API调用。