# API接口规范

## 📋 概述

本文档定义了AI驱动内容代理系统的API接口规范，包括接口设计原则、数据格式、错误处理、认证授权、版本管理等方面的标准。所有API开发都应严格遵循本规范，确保接口的一致性、可维护性和可扩展性。

## 🎯 设计原则

### 1. RESTful设计

- **资源导向**: API应以资源为中心进行设计
- **HTTP方法**: 正确使用HTTP方法表达操作意图
- **状态码**: 使用标准HTTP状态码表示请求结果
- **无状态**: API应该是无状态的，每个请求包含完整信息

### 2. 一致性原则

- **命名规范**: 统一的命名约定和风格
- **数据格式**: 一致的请求和响应数据格式
- **错误处理**: 统一的错误响应格式
- **版本管理**: 清晰的API版本策略

### 3. 安全性原则

- **认证授权**: 完善的身份验证和权限控制
- **数据验证**: 严格的输入数据验证
- **敏感信息**: 敏感数据的安全处理
- **访问控制**: 基于角色的访问控制

## 🌐 API基础规范

### 1. 基础URL结构

```
https://api.example.com/v1/{resource}
```

**组成部分说明**:
- `https://api.example.com`: API基础域名
- `v1`: API版本号
- `{resource}`: 资源路径

### 2. HTTP方法使用规范

| HTTP方法 | 用途 | 示例 |
|----------|------|------|
| GET | 获取资源 | `GET /v1/articles` |
| POST | 创建资源 | `POST /v1/articles` |
| PUT | 完整更新资源 | `PUT /v1/articles/123` |
| PATCH | 部分更新资源 | `PATCH /v1/articles/123` |
| DELETE | 删除资源 | `DELETE /v1/articles/123` |
| HEAD | 获取资源元信息 | `HEAD /v1/articles/123` |
| OPTIONS | 获取支持的方法 | `OPTIONS /v1/articles` |

### 3. 资源命名规范

- **使用名词**: 资源路径使用名词，不使用动词
- **复数形式**: 集合资源使用复数形式
- **小写字母**: 使用小写字母和连字符
- **层次结构**: 体现资源间的层次关系

**示例**:
```
✅ 正确:
/v1/articles
/v1/articles/123
/v1/articles/123/comments
/v1/users/456/articles

❌ 错误:
/v1/getArticles
/v1/Article
/v1/articles_list
/v1/user/456/getArticles
```

## 📝 请求规范

### 1. 请求头规范

**必需头部**:
```http
Content-Type: application/json
Authorization: Bearer {access_token}
User-Agent: {client_name}/{version}
```

**可选头部**:
```http
Accept: application/json
Accept-Language: zh-CN,en-US
X-Request-ID: {unique_request_id}
X-Client-Version: {client_version}
```

### 2. 请求体规范

**JSON格式**:
```json
{
  "data": {
    "type": "article",
    "attributes": {
      "title": "文章标题",
      "content": "文章内容",
      "status": "draft"
    },
    "relationships": {
      "author": {
        "data": {
          "type": "user",
          "id": "123"
        }
      }
    }
  }
}
```

### 3. 查询参数规范

**分页参数**:
```
GET /v1/articles?page=1&limit=20&sort=-created_at
```

**过滤参数**:
```
GET /v1/articles?filter[status]=published&filter[author]=123
```

**搜索参数**:
```
GET /v1/articles?search=关键词&fields=title,content
```

**包含关联资源**:
```
GET /v1/articles?include=author,comments
```

## 📤 响应规范

### 1. 响应头规范

**标准响应头**:
```http
Content-Type: application/json; charset=utf-8
X-Request-ID: {request_id}
X-Response-Time: {response_time_ms}ms
X-Rate-Limit-Remaining: {remaining_requests}
X-Rate-Limit-Reset: {reset_timestamp}
```

### 2. 成功响应格式

**单个资源响应**:
```json
{
  "data": {
    "type": "article",
    "id": "123",
    "attributes": {
      "title": "文章标题",
      "content": "文章内容",
      "status": "published",
      "created_at": "2024-12-19T10:00:00Z",
      "updated_at": "2024-12-19T10:30:00Z"
    },
    "relationships": {
      "author": {
        "data": {
          "type": "user",
          "id": "456"
        },
        "links": {
          "related": "/v1/users/456"
        }
      }
    },
    "links": {
      "self": "/v1/articles/123"
    }
  },
  "included": [
    {
      "type": "user",
      "id": "456",
      "attributes": {
        "name": "作者姓名",
        "email": "author@example.com"
      }
    }
  ],
  "meta": {
    "request_id": "req_123456789",
    "response_time": 150
  }
}
```

**集合资源响应**:
```json
{
  "data": [
    {
      "type": "article",
      "id": "123",
      "attributes": {
        "title": "文章标题1",
        "status": "published"
      }
    },
    {
      "type": "article",
      "id": "124",
      "attributes": {
        "title": "文章标题2",
        "status": "draft"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    },
    "request_id": "req_123456789",
    "response_time": 200
  },
  "links": {
    "self": "/v1/articles?page=1&limit=20",
    "first": "/v1/articles?page=1&limit=20",
    "last": "/v1/articles?page=5&limit=20",
    "next": "/v1/articles?page=2&limit=20"
  }
}
```

### 3. 错误响应格式

**标准错误响应**:
```json
{
  "errors": [
    {
      "id": "error_123456",
      "status": "400",
      "code": "VALIDATION_ERROR",
      "title": "验证错误",
      "detail": "标题字段不能为空",
      "source": {
        "pointer": "/data/attributes/title",
        "parameter": "title"
      },
      "meta": {
        "timestamp": "2024-12-19T10:00:00Z"
      }
    }
  ],
  "meta": {
    "request_id": "req_123456789",
    "response_time": 50
  }
}
```

## 🔐 认证授权规范

### 1. 认证方式

**Bearer Token认证**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**API Key认证**:
```http
X-API-Key: your_api_key_here
```

### 2. JWT Token规范

**Token结构**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_123",
    "iat": 1640000000,
    "exp": 1640086400,
    "aud": "api.example.com",
    "iss": "auth.example.com",
    "scope": "read write",
    "role": "user"
  }
}
```

### 3. 权限控制

**基于角色的访问控制(RBAC)**:
```json
{
  "roles": {
    "admin": {
      "permissions": ["*"]
    },
    "editor": {
      "permissions": [
        "articles:read",
        "articles:write",
        "articles:update"
      ]
    },
    "viewer": {
      "permissions": ["articles:read"]
    }
  }
}
```

## 📊 状态码规范

### 1. 成功状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功获取资源 |
| 201 | Created | 成功创建资源 |
| 202 | Accepted | 请求已接受，异步处理 |
| 204 | No Content | 成功处理，无返回内容 |

### 2. 客户端错误状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 405 | Method Not Allowed | HTTP方法不支持 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 请求格式正确但语义错误 |
| 429 | Too Many Requests | 请求频率超限 |

### 3. 服务器错误状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 500 | Internal Server Error | 服务器内部错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |
| 504 | Gateway Timeout | 网关超时 |

## 🔄 版本管理规范

### 1. 版本策略

**URL版本控制**:
```
https://api.example.com/v1/articles
https://api.example.com/v2/articles
```

**Header版本控制**:
```http
Accept: application/vnd.api+json;version=1
API-Version: 2024-12-19
```

### 2. 版本兼容性

**向后兼容原则**:
- 新版本应保持向后兼容
- 废弃功能应提前通知
- 提供迁移指南和工具

**版本生命周期**:
```
开发中 -> 测试版 -> 稳定版 -> 维护版 -> 废弃版
```

### 3. 版本变更通知

**响应头通知**:
```http
X-API-Version: v1
X-API-Deprecated: true
X-API-Sunset: 2025-06-01
Warning: 299 - "API version v1 is deprecated, please migrate to v2"
```

## 🚦 限流规范

### 1. 限流策略

**基于用户的限流**:
```
- 免费用户: 1000 requests/hour
- 付费用户: 10000 requests/hour
- 企业用户: 100000 requests/hour
```

**基于IP的限流**:
```
- 单IP: 100 requests/minute
- 突发限制: 200 requests/minute
```

### 2. 限流响应头

```http
X-Rate-Limit-Limit: 1000
X-Rate-Limit-Remaining: 999
X-Rate-Limit-Reset: 1640086400
X-Rate-Limit-Window: 3600
```

### 3. 限流超出响应

```json
{
  "errors": [
    {
      "status": "429",
      "code": "RATE_LIMIT_EXCEEDED",
      "title": "请求频率超限",
      "detail": "您已超出每小时1000次请求的限制",
      "meta": {
        "retry_after": 3600,
        "limit": 1000,
        "remaining": 0,
        "reset_time": "2024-12-19T11:00:00Z"
      }
    }
  ]
}
```

## 📋 数据验证规范

### 1. 输入验证

**字段验证规则**:
```json
{
  "title": {
    "type": "string",
    "required": true,
    "min_length": 1,
    "max_length": 200,
    "pattern": "^[\u4e00-\u9fa5a-zA-Z0-9\s]+$"
  },
  "email": {
    "type": "string",
    "required": true,
    "format": "email"
  },
  "age": {
    "type": "integer",
    "minimum": 0,
    "maximum": 150
  }
}
```

### 2. 验证错误响应

```json
{
  "errors": [
    {
      "status": "422",
      "code": "VALIDATION_ERROR",
      "title": "字段验证失败",
      "detail": "标题长度不能超过200个字符",
      "source": {
        "pointer": "/data/attributes/title"
      },
      "meta": {
        "field": "title",
        "rule": "max_length",
        "limit": 200,
        "actual": 250
      }
    }
  ]
}
```

## 🔍 搜索和过滤规范

### 1. 搜索参数

**全文搜索**:
```
GET /v1/articles?search=关键词
```

**字段搜索**:
```
GET /v1/articles?search[title]=标题关键词&search[content]=内容关键词
```

**模糊搜索**:
```
GET /v1/articles?search=*关键词*
```

### 2. 过滤参数

**精确匹配**:
```
GET /v1/articles?filter[status]=published
```

**范围过滤**:
```
GET /v1/articles?filter[created_at][gte]=2024-01-01&filter[created_at][lte]=2024-12-31
```

**数组过滤**:
```
GET /v1/articles?filter[tags][in]=tech,ai,programming
```

### 3. 排序参数

**单字段排序**:
```
GET /v1/articles?sort=created_at
GET /v1/articles?sort=-created_at  # 降序
```

**多字段排序**:
```
GET /v1/articles?sort=-priority,created_at
```

## 📄 文档规范

### 1. API文档结构

```
API文档/
├── 概述
├── 认证
├── 错误处理
├── 资源端点
│   ├── 文章管理
│   ├── 用户管理
│   └── 模板管理
├── 数据模型
├── 示例代码
└── 变更日志
```

### 2. 端点文档模板

```markdown
## 创建文章

创建一篇新文章。

**请求**:
```http
POST /v1/articles
Content-Type: application/json
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "data": {
    "type": "article",
    "attributes": {
      "title": "文章标题",
      "content": "文章内容"
    }
  }
}
```

**响应**:
```json
{
  "data": {
    "type": "article",
    "id": "123",
    "attributes": {
      "title": "文章标题",
      "content": "文章内容",
      "status": "draft",
      "created_at": "2024-12-19T10:00:00Z"
    }
  }
}
```

**错误响应**:
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未认证
- `422 Unprocessable Entity`: 验证失败
```

### 3. 代码示例

**JavaScript示例**:
```javascript
// 创建文章
const response = await fetch('/v1/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    data: {
      type: 'article',
      attributes: {
        title: '文章标题',
        content: '文章内容'
      }
    }
  })
});

const result = await response.json();
console.log(result);
```

**Python示例**:
```python
import requests

# 创建文章
response = requests.post(
    'https://api.example.com/v1/articles',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    json={
        'data': {
            'type': 'article',
            'attributes': {
                'title': '文章标题',
                'content': '文章内容'
            }
        }
    }
)

result = response.json()
print(result)
```

## 🧪 测试规范

### 1. API测试类型

**单元测试**:
- 测试单个API端点
- 验证输入输出
- 测试边界条件

**集成测试**:
- 测试API间的交互
- 测试数据库操作
- 测试第三方服务集成

**性能测试**:
- 测试响应时间
- 测试并发处理能力
- 测试资源使用情况

### 2. 测试用例结构

```javascript
describe('POST /v1/articles', () => {
  describe('成功场景', () => {
    it('应该成功创建文章', async () => {
      const requestData = {
        data: {
          type: 'article',
          attributes: {
            title: '测试文章',
            content: '测试内容'
          }
        }
      };

      const response = await request(app)
        .post('/v1/articles')
        .set('Authorization', `Bearer ${validToken}`)
        .send(requestData)
        .expect(201);

      expect(response.body.data.type).toBe('article');
      expect(response.body.data.attributes.title).toBe('测试文章');
    });
  });

  describe('错误场景', () => {
    it('应该返回401当未提供认证token时', async () => {
      const response = await request(app)
        .post('/v1/articles')
        .send({})
        .expect(401);

      expect(response.body.errors[0].code).toBe('UNAUTHORIZED');
    });
  });
});
```

## 📈 监控和日志规范

### 1. API监控指标

**性能指标**:
- 响应时间 (P50, P95, P99)
- 吞吐量 (RPS)
- 错误率
- 可用性

**业务指标**:
- API调用次数
- 用户活跃度
- 功能使用率
- 转化率

### 2. 日志格式

**访问日志**:
```json
{
  "timestamp": "2024-12-19T10:00:00Z",
  "level": "info",
  "type": "access",
  "request_id": "req_123456789",
  "method": "POST",
  "path": "/v1/articles",
  "status_code": 201,
  "response_time": 150,
  "user_id": "user_123",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

**错误日志**:
```json
{
  "timestamp": "2024-12-19T10:00:00Z",
  "level": "error",
  "type": "application",
  "request_id": "req_123456789",
  "error_code": "DATABASE_CONNECTION_ERROR",
  "error_message": "Failed to connect to database",
  "stack_trace": "Error: Connection timeout...",
  "context": {
    "user_id": "user_123",
    "endpoint": "/v1/articles",
    "database_host": "db.example.com"
  }
}
```

## 🔧 开发工具和SDK

### 1. API开发工具

**OpenAPI规范**:
```yaml
openapi: 3.0.0
info:
  title: AI驱动内容代理系统API
  version: 1.0.0
  description: AI驱动内容代理系统的RESTful API
paths:
  /v1/articles:
    post:
      summary: 创建文章
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ArticleRequest'
      responses:
        '201':
          description: 文章创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArticleResponse'
components:
  schemas:
    ArticleRequest:
      type: object
      properties:
        data:
          type: object
          properties:
            type:
              type: string
              example: article
            attributes:
              type: object
              properties:
                title:
                  type: string
                  example: 文章标题
                content:
                  type: string
                  example: 文章内容
```

### 2. SDK设计规范

**JavaScript SDK示例**:
```javascript
class APIClient {
  constructor(options) {
    this.baseURL = options.baseURL;
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || 30000;
  }

  async createArticle(articleData) {
    return this.request('POST', '/v1/articles', {
      data: {
        type: 'article',
        attributes: articleData
      }
    });
  }

  async request(method, path, data = null) {
    const config = {
      method,
      url: `${this.baseURL}${path}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: this.timeout
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new APIError(
        error.response.data.errors[0].code,
        error.response.data.errors[0].detail,
        error.response.status
      );
    }
    return new APIError('NETWORK_ERROR', error.message);
  }
}
```

## 📋 规范检查清单

### API设计检查

- [ ] 遵循RESTful设计原则
- [ ] 使用正确的HTTP方法
- [ ] 资源命名符合规范
- [ ] URL结构清晰合理
- [ ] 支持适当的查询参数

### 数据格式检查

- [ ] 请求响应格式一致
- [ ] 错误响应格式标准
- [ ] 数据类型定义明确
- [ ] 字段命名规范统一
- [ ] 支持国际化

### 安全性检查

- [ ] 实现认证授权
- [ ] 输入数据验证
- [ ] 敏感信息保护
- [ ] 防止常见攻击
- [ ] 访问日志记录

### 性能检查

- [ ] 响应时间合理
- [ ] 支持分页查询
- [ ] 实现缓存机制
- [ ] 数据库查询优化
- [ ] 限流机制完善

### 文档检查

- [ ] API文档完整
- [ ] 示例代码准确
- [ ] 错误码说明清晰
- [ ] 变更日志维护
- [ ] 迁移指南提供

---

**文档版本**: v1.0.0  
**最后更新**: 2024-12-19  
**维护者**: AI驱动内容代理系统API团队  
**审核者**: 技术架构师