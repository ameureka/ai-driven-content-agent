# AI驱动内容代理系统 - API接口文档

## 接口概述

本文档详细描述AI驱动内容代理系统的RESTful API接口，包括认证方式、请求格式、响应格式、错误处理和使用示例。

### 基础信息

- **Base URL**: `https://api.ai-content-agent.com`
- **API版本**: `v1`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 认证方式

系统支持多种认证方式：

1. **Bearer Token** (推荐)
2. **API Key**
3. **JWT Token**

## 通用规范

### 请求头

```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v1
X-Request-ID: <uuid>
```

### 响应格式

#### 成功响应

```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功",
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

#### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数无效",
    "details": {
      "field": "content",
      "reason": "内容长度不能超过10000字符"
    }
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### HTTP状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或认证失败 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 429 | Too Many Requests | 请求频率超限 |
| 500 | Internal Server Error | 服务器内部错误 |
| 503 | Service Unavailable | 服务暂时不可用 |

## 认证接口

### 用户注册

**接口**: `POST /api/auth/register`

**描述**: 注册新用户账户

**请求参数**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址，需唯一 |
| password | string | 是 | 密码，最少8位 |
| username | string | 是 | 用户名，需唯一 |
| firstName | string | 否 | 名 |
| lastName | string | 否 | 姓 |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "用户注册成功"
}
```

### 用户登录

**接口**: `POST /api/auth/login`

**描述**: 用户登录认证

**请求参数**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-01-16T10:30:00Z"
  },
  "message": "登录成功"
}
```

### 刷新令牌

**接口**: `POST /api/auth/refresh`

**描述**: 刷新访问令牌

**请求头**:
```http
Authorization: Bearer <refresh_token>
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-01-16T10:30:00Z"
  },
  "message": "令牌刷新成功"
}
```

### 用户登出

**接口**: `POST /api/auth/logout`

**描述**: 用户登出，使令牌失效

**请求头**:
```http
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "success": true,
  "message": "登出成功"
}
```

## 内容处理接口

### 内容改写

**接口**: `POST /api/content/rewrite`

**描述**: 使用AI对输入内容进行风格化改写

**请求参数**:

```json
{
  "content": "这是需要改写的原始内容...",
  "style": "formal",
  "length": 500,
  "language": "zh-CN",
  "options": {
    "preserveKeywords": ["关键词1", "关键词2"],
    "tone": "professional",
    "audience": "business"
  }
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 原始内容，1-10000字符 |
| style | string | 是 | 改写风格：formal, casual, academic, creative |
| length | number | 否 | 目标长度，50-5000字符 |
| language | string | 否 | 语言代码，默认zh-CN |
| options | object | 否 | 高级选项 |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "rewrittenContent": "改写后的内容...",
    "originalLength": 150,
    "rewrittenLength": 200,
    "qualityScore": 0.92,
    "processingTime": 3.2,
    "metadata": {
      "workflowId": "dify-general",
      "modelUsed": "gpt-4",
      "tokensUsed": 450
    }
  },
  "message": "内容改写完成"
}
```

### AI文章生成

**接口**: `POST /api/content/generate`

**描述**: 基于主题和关键词生成完整文章

**请求参数**:

```json
{
  "topic": "人工智能在教育领域的应用",
  "keywords": ["AI", "教育", "个性化学习", "智能辅导"],
  "length": 1500,
  "language": "zh-CN",
  "options": {
    "includeIntroduction": true,
    "includeConclusion": true,
    "targetAudience": "educators",
    "tone": "informative",
    "structure": "academic"
  }
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| topic | string | 是 | 文章主题 |
| keywords | array | 是 | 关键词列表 |
| length | number | 否 | 文章长度，500-5000字符 |
| language | string | 否 | 语言代码 |
| options | object | 否 | 生成选项 |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "article": {
      "title": "人工智能在教育领域的应用与前景",
      "content": "文章正文内容...",
      "summary": "文章摘要...",
      "tags": ["AI", "教育", "技术"],
      "wordCount": 1520,
      "readingTime": 6
    },
    "qualityScore": 0.89,
    "processingTime": 12.5,
    "metadata": {
      "workflowId": "dify-article",
      "modelUsed": "gpt-4",
      "tokensUsed": 1200
    }
  },
  "message": "文章生成完成"
}
```

### 内容分析

**接口**: `POST /api/content/analyze`

**描述**: 分析内容质量、可读性和SEO指标

**请求参数**:

```json
{
  "content": "需要分析的内容...",
  "analysisType": ["quality", "readability", "seo"],
  "language": "zh-CN"
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "analysis": {
      "quality": {
        "score": 0.85,
        "factors": {
          "coherence": 0.9,
          "clarity": 0.8,
          "engagement": 0.85
        }
      },
      "readability": {
        "score": 0.78,
        "level": "intermediate",
        "avgSentenceLength": 18,
        "complexWords": 12
      },
      "seo": {
        "score": 0.72,
        "keywordDensity": 0.03,
        "headingStructure": "good",
        "metaDescription": "missing"
      }
    },
    "suggestions": [
      "建议添加更多的小标题来改善结构",
      "可以适当增加关键词密度"
    ]
  },
  "message": "内容分析完成"
}
```

## 模板接口

### 获取模板列表

**接口**: `GET /api/templates`

**描述**: 获取可用的模板列表

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 模板分类 |
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |
| search | string | 否 | 搜索关键词 |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "simple-modern",
        "name": "简约现代",
        "description": "极简设计风格，适合个人博客",
        "category": "blog",
        "preview": "https://cdn.example.com/templates/simple-modern/preview.jpg",
        "features": ["响应式", "深色模式", "SEO优化"],
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-10T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 6,
      "pages": 1
    }
  },
  "message": "获取模板列表成功"
}
```

### 获取模板详情

**接口**: `GET /api/templates/{templateId}`

**描述**: 获取指定模板的详细信息

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| templateId | string | 是 | 模板ID |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "template": {
      "id": "simple-modern",
      "name": "简约现代",
      "description": "极简设计风格，适合个人博客",
      "category": "blog",
      "preview": "https://cdn.example.com/templates/simple-modern/preview.jpg",
      "features": ["响应式", "深色模式", "SEO优化"],
      "config": {
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#64748b"
        },
        "fonts": {
          "heading": "Inter",
          "body": "Inter"
        },
        "layout": {
          "maxWidth": "1200px",
          "sidebar": true
        }
      },
      "customizable": [
        "colors",
        "fonts",
        "layout"
      ]
    }
  },
  "message": "获取模板详情成功"
}
```

### 渲染模板

**接口**: `POST /api/templates/{templateId}/render`

**描述**: 使用指定模板渲染内容

**请求参数**:

```json
{
  "content": {
    "title": "文章标题",
    "body": "文章内容...",
    "author": "作者名称",
    "publishDate": "2025-01-15T10:30:00Z",
    "tags": ["标签1", "标签2"]
  },
  "config": {
    "colors": {
      "primary": "#ef4444"
    },
    "layout": {
      "sidebar": false
    }
  },
  "format": "html"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | object | 是 | 内容数据 |
| config | object | 否 | 自定义配置 |
| format | string | 否 | 输出格式：html, pdf, image |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "rendered": "<html>...</html>",
    "metadata": {
      "templateId": "simple-modern",
      "renderTime": 0.15,
      "size": 15420
    },
    "assets": {
      "css": "https://cdn.example.com/rendered/abc123/styles.css",
      "js": "https://cdn.example.com/rendered/abc123/scripts.js"
    }
  },
  "message": "模板渲染完成"
}
```

## 用户管理接口

### 获取用户信息

**接口**: `GET /api/users/profile`

**描述**: 获取当前用户的详细信息

**请求头**:
```http
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "avatar": "https://cdn.example.com/avatars/user_123456.jpg",
      "preferences": {
        "language": "zh-CN",
        "theme": "light",
        "notifications": true
      },
      "usage": {
        "apiCalls": 1250,
        "tokensUsed": 45000,
        "articlesGenerated": 25
      },
      "subscription": {
        "plan": "pro",
        "expiresAt": "2025-12-31T23:59:59Z",
        "limits": {
          "apiCalls": 10000,
          "tokensPerMonth": 100000
        }
      },
      "createdAt": "2024-06-15T10:30:00Z",
      "lastLoginAt": "2025-01-15T09:15:00Z"
    }
  },
  "message": "获取用户信息成功"
}
```

### 更新用户信息

**接口**: `PUT /api/users/profile`

**描述**: 更新用户基本信息

**请求参数**:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "preferences": {
    "language": "en-US",
    "theme": "dark",
    "notifications": false
  }
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Smith",
      "preferences": {
        "language": "en-US",
        "theme": "dark",
        "notifications": false
      },
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  },
  "message": "用户信息更新成功"
}
```

### 获取使用统计

**接口**: `GET /api/users/usage`

**描述**: 获取用户的API使用统计

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| period | string | 否 | 统计周期：day, week, month, year |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "usage": {
      "period": "month",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-01-31T23:59:59Z",
      "summary": {
        "apiCalls": 1250,
        "tokensUsed": 45000,
        "articlesGenerated": 25,
        "contentRewritten": 150,
        "templatesRendered": 75
      },
      "daily": [
        {
          "date": "2025-01-15",
          "apiCalls": 45,
          "tokensUsed": 1800,
          "articlesGenerated": 2
        }
      ],
      "limits": {
        "apiCalls": 10000,
        "tokensPerMonth": 100000,
        "remaining": {
          "apiCalls": 8750,
          "tokens": 55000
        }
      }
    }
  },
  "message": "获取使用统计成功"
}
```

## 任务管理接口

### 创建异步任务

**接口**: `POST /api/tasks`

**描述**: 创建长时间运行的异步任务

**请求参数**:

```json
{
  "type": "batch_rewrite",
  "data": {
    "contents": [
      "内容1...",
      "内容2..."
    ],
    "style": "formal",
    "options": {
      "preserveKeywords": true
    }
  }
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_abc123",
      "type": "batch_rewrite",
      "status": "pending",
      "progress": 0,
      "createdAt": "2025-01-15T10:30:00Z",
      "estimatedDuration": 300
    }
  },
  "message": "任务创建成功"
}
```

### 获取任务状态

**接口**: `GET /api/tasks/{taskId}`

**描述**: 获取异步任务的执行状态

**响应示例**:

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_abc123",
      "type": "batch_rewrite",
      "status": "processing",
      "progress": 65,
      "result": null,
      "error": null,
      "createdAt": "2025-01-15T10:30:00Z",
      "startedAt": "2025-01-15T10:30:15Z",
      "estimatedCompletion": "2025-01-15T10:35:00Z"
    }
  },
  "message": "获取任务状态成功"
}
```

### 获取任务结果

**接口**: `GET /api/tasks/{taskId}/result`

**描述**: 获取已完成任务的结果

**响应示例**:

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_abc123",
      "status": "completed",
      "result": {
        "processedItems": 2,
        "results": [
          {
            "original": "内容1...",
            "rewritten": "改写后的内容1...",
            "qualityScore": 0.89
          },
          {
            "original": "内容2...",
            "rewritten": "改写后的内容2...",
            "qualityScore": 0.92
          }
        ]
      },
      "completedAt": "2025-01-15T10:34:30Z",
      "processingTime": 270
    }
  },
  "message": "获取任务结果成功"
}
```

## 系统接口

### 健康检查

**接口**: `GET /api/health`

**描述**: 检查系统健康状态

**响应示例**:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "1.0.0",
    "uptime": 86400,
    "checks": {
      "database": "healthy",
      "cache": "healthy",
      "storage": "healthy",
      "ai_service": "healthy"
    },
    "metrics": {
      "responseTime": 45,
      "memoryUsage": 0.65,
      "cpuUsage": 0.23
    }
  },
  "message": "系统运行正常"
}
```

### 获取系统信息

**接口**: `GET /api/system/info`

**描述**: 获取系统基本信息

**响应示例**:

```json
{
  "success": true,
  "data": {
    "system": {
      "name": "AI驱动内容代理系统",
      "version": "1.0.0",
      "buildDate": "2025-01-15T00:00:00Z",
      "environment": "production",
      "region": "global",
      "features": [
        "content_rewrite",
        "article_generation",
        "template_rendering",
        "batch_processing"
      ],
      "limits": {
        "maxContentLength": 10000,
        "maxBatchSize": 100,
        "requestTimeout": 30
      }
    }
  },
  "message": "获取系统信息成功"
}
```

## 错误代码

### 通用错误代码

| 错误代码 | HTTP状态码 | 说明 |
|----------|------------|------|
| INVALID_REQUEST | 400 | 请求参数无效 |
| UNAUTHORIZED | 401 | 未认证或认证失败 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| METHOD_NOT_ALLOWED | 405 | 请求方法不允许 |
| CONFLICT | 409 | 资源冲突 |
| VALIDATION_ERROR | 422 | 数据验证失败 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务暂时不可用 |

### 业务错误代码

| 错误代码 | HTTP状态码 | 说明 |
|----------|------------|------|
| CONTENT_TOO_LONG | 400 | 内容长度超出限制 |
| CONTENT_TOO_SHORT | 400 | 内容长度不足 |
| INVALID_STYLE | 400 | 无效的改写风格 |
| INVALID_TEMPLATE | 400 | 无效的模板ID |
| TEMPLATE_NOT_FOUND | 404 | 模板不存在 |
| WORKFLOW_ERROR | 500 | AI工作流执行错误 |
| QUOTA_EXCEEDED | 429 | 配额已用完 |
| TASK_NOT_FOUND | 404 | 任务不存在 |
| TASK_FAILED | 500 | 任务执行失败 |

## 限流规则

### 请求频率限制

| 接口类型 | 限制规则 | 说明 |
|----------|----------|------|
| 认证接口 | 10次/分钟 | 防止暴力破解 |
| 内容处理 | 100次/小时 | 基础用户限制 |
| 模板渲染 | 200次/小时 | 基础用户限制 |
| 批量处理 | 10次/小时 | 防止资源滥用 |
| 查询接口 | 1000次/小时 | 一般查询限制 |

### 配额管理

不同订阅计划的配额限制：

| 计划类型 | API调用/月 | Token使用/月 | 并发请求 |
|----------|------------|--------------|----------|
| 免费版 | 1,000 | 10,000 | 5 |
| 基础版 | 10,000 | 100,000 | 10 |
| 专业版 | 100,000 | 1,000,000 | 50 |
| 企业版 | 无限制 | 无限制 | 100 |

## SDK和代码示例

### JavaScript/TypeScript SDK

```typescript
import { AIContentClient } from '@ai-content-agent/sdk';

const client = new AIContentClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.ai-content-agent.com'
});

// 内容改写
const rewriteResult = await client.content.rewrite({
  content: '原始内容...',
  style: 'formal',
  length: 500
});

// 文章生成
const articleResult = await client.content.generate({
  topic: '人工智能应用',
  keywords: ['AI', '机器学习'],
  length: 1500
});

// 模板渲染
const renderResult = await client.templates.render('simple-modern', {
  title: '文章标题',
  content: '文章内容...'
});
```

### Python SDK

```python
from ai_content_agent import AIContentClient

client = AIContentClient(
    api_key='your-api-key',
    base_url='https://api.ai-content-agent.com'
)

# 内容改写
rewrite_result = client.content.rewrite(
    content='原始内容...',
    style='formal',
    length=500
)

# 文章生成
article_result = client.content.generate(
    topic='人工智能应用',
    keywords=['AI', '机器学习'],
    length=1500
)

# 模板渲染
render_result = client.templates.render(
    template_id='simple-modern',
    data={
        'title': '文章标题',
        'content': '文章内容...'
    }
)
```

### cURL示例

```bash
# 用户登录
curl -X POST https://api.ai-content-agent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 内容改写
curl -X POST https://api.ai-content-agent.com/api/content/rewrite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "content": "需要改写的内容...",
    "style": "formal",
    "length": 500
  }'

# 获取模板列表
curl -X GET "https://api.ai-content-agent.com/api/templates?category=blog" \
  -H "Authorization: Bearer your-token"
```

## 最佳实践

### 1. 认证和安全

- 使用HTTPS进行所有API调用
- 安全存储API密钥，不要在客户端代码中硬编码
- 定期轮换API密钥
- 使用最小权限原则

### 2. 错误处理

```typescript
try {
  const result = await client.content.rewrite({
    content: 'content',
    style: 'formal'
  });
  console.log(result.data);
} catch (error) {
  if (error.status === 429) {
    // 处理限流错误
    console.log('请求频率过高，请稍后重试');
  } else if (error.status === 400) {
    // 处理参数错误
    console.log('请求参数错误:', error.details);
  } else {
    // 处理其他错误
    console.log('请求失败:', error.message);
  }
}
```

### 3. 性能优化

- 使用适当的缓存策略
- 批量处理多个请求
- 合理设置超时时间
- 监控API使用情况

### 4. 监控和日志

- 记录所有API调用
- 监控响应时间和错误率
- 设置告警机制
- 定期分析使用模式

## 更新日志

### v1.0.0 (2025-01-15)

- 初始版本发布
- 支持内容改写和文章生成
- 提供6种预置模板
- 完整的用户管理功能
- RESTful API接口

### 未来规划

- v1.1.0: 增加批量处理接口
- v1.2.0: 支持自定义模板上传
- v1.3.0: 增加多语言支持
- v2.0.0: GraphQL API支持

---

*最后更新：2025年1月15日*
*文档版本：v1.0*