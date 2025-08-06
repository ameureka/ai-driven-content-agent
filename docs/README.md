# AI驱动内容代理 (AI-Driven Content Agent)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-username/ai-driven-content-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/ai-driven-content-agent/releases)

一个基于Cloudflare Workers的智能内容代理服务，集成Dify AI平台，提供Markdown到HTML的智能转换和多样化模板渲染功能。

## ✨ 特性

- 🤖 **AI驱动**: 集成Dify AI平台，提供智能内容处理
- 🎨 **多模板支持**: 内置5种专业模板，支持自定义模板开发
- ⚡ **高性能**: 基于Cloudflare Workers，全球边缘计算
- 📱 **响应式设计**: 完美适配桌面、平板和移动设备
- 🔄 **流式处理**: 支持实时流式AI响应
- 💾 **智能缓存**: KV存储优化，提升响应速度
- 🛡️ **安全可靠**: 内置安全防护和错误处理机制
- 📊 **RESTful API**: 完整的API接口，易于集成

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 16.x 或更高版本
- [Cloudflare账户](https://cloudflare.com/)
- [Dify平台账户](https://dify.ai/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### 安装部署

1. **克隆项目**
```bash
git clone https://github.com/your-username/ai-driven-content-agent.git
cd ai-driven-content-agent
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境**
```bash
# 安装Wrangler CLI
npm install -g wrangler

# 登录Cloudflare
wrangler login

# 创建KV命名空间
wrangler kv:namespace create "CONTENT_CACHE"
wrangler kv:namespace create "CONTENT_CACHE" --preview
```

4. **设置环境变量**
```bash
# 设置生产环境密钥
wrangler secret put DIFY_API_KEY
wrangler secret put DIFY_BASE_URL

# 创建开发环境配置
echo "DIFY_API_KEY=your-dify-api-key" > .dev.vars
echo "DIFY_BASE_URL=https://api.dify.ai" >> .dev.vars
```

5. **更新配置文件**

编辑 `wrangler.toml`，添加KV命名空间ID：
```toml
[[kv_namespaces]]
binding = "CONTENT_CACHE"
id = "your-namespace-id"
preview_id = "your-preview-namespace-id"
```

6. **本地开发**
```bash
# 启动开发服务器
npm run dev

# 或使用Wrangler
wrangler dev
```

7. **部署到生产**
```bash
npm run deploy
```

## 📖 使用指南

### API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/status` | GET | 服务状态检查 |
| `/api/templates` | GET | 获取可用模板列表 |
| `/api/upload` | POST | 上传Markdown文件 |
| `/api/render` | POST | 渲染内容为HTML |
| `/api/dify/blocking` | POST | Dify阻塞式API调用 |
| `/api/dify/streaming` | POST | Dify流式API调用 |

### 基础使用示例

**1. 渲染Markdown内容**
```javascript
const response = await fetch('https://your-domain.workers.dev/api/render', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: '# Hello World\n\nThis is **markdown** content.',
    template: 'general',
    title: 'My Document'
  })
});

const html = await response.text();
```

**2. 调用Dify AI**
```javascript
const response = await fetch('https://your-domain.workers.dev/api/dify/blocking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: '请帮我写一篇关于AI的文章',
    inputs: {},
    user: 'web-user'
  })
});

const result = await response.json();
```

**3. 流式AI响应**
```javascript
const response = await fetch('https://your-domain.workers.dev/api/dify/streaming', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: '请实时生成内容',
    inputs: {},
    user: 'web-user'
  })
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = new TextDecoder().decode(value);
  console.log('Received:', chunk);
}
```

### 可用模板

| 模板名称 | 标识符 | 描述 | 适用场景 |
|----------|--------|------|----------|
| 通用模板 | `general` | 简洁现代的通用样式 | 文档、博客、说明 |
| 技术介绍 | `tech_intro` | 专业的技术文档样式 | 技术文档、API文档 |
| 新闻广播 | `news_broad` | 新闻媒体风格 | 新闻、公告、资讯 |
| 技术解释 | `tech_interpre` | 深度技术解析样式 | 技术分析、教程 |
| 视频解释 | `video_interpre` | 视频内容配套样式 | 视频文稿、字幕 |

## 🏗️ 项目架构

```
ai-driven-content-agent/
├── src/                    # 源代码目录
│   ├── index.js           # 主入口文件
│   ├── api/               # API层
│   │   ├── dify.js        # Dify API集成
│   │   └── difyArticle.js # Dify文章API
│   ├── services/          # 服务层
│   │   └── templateManager.js # 模板管理器
│   └── styles/            # 样式目录
├── templates/             # 模板文件
│   ├── general.js         # 通用模板
│   ├── tech_intro.js      # 技术介绍模板
│   ├── news_broad.js      # 新闻广播模板
│   ├── tech_interpre.js   # 技术解释模板
│   └── video_interpre.js  # 视频解释模板
├── public/                # 静态资源
│   ├── index.html         # 主页
│   ├── upload.html        # 上传页面
│   └── style.css          # 公共样式
├── docs/                  # 文档目录
│   ├── API.md             # API文档
│   ├── DESIGN.md          # 设计文档
│   ├── DEPLOYMENT.md      # 部署指南
│   ├── TEMPLATE_GUIDE.md  # 模板开发指南
│   └── TROUBLESHOOTING.md # 故障排除指南
├── tests/                 # 测试目录
└── wrangler.toml          # Cloudflare Workers配置
```

### 核心组件

- **主入口 (index.js)**: 请求路由和响应处理
- **API层**: Dify平台集成和外部服务调用
- **服务层**: 业务逻辑和模板管理
- **模板系统**: 可扩展的HTML模板引擎
- **缓存层**: KV存储优化和性能提升

## 🎨 自定义模板

### 创建新模板

1. **创建模板文件**
```javascript
// templates/custom.js
export default {
  name: 'custom',
  displayName: '自定义模板',
  description: '我的自定义模板',
  version: '1.0.0',
  
  render: function(content, title = '文档') {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${this.getStyles()}</style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <div class="content">${content}</div>
  </div>
</body>
</html>`;
  },
  
  getStyles: function() {
    return `
      body { font-family: Arial, sans-serif; }
      .container { max-width: 800px; margin: 0 auto; padding: 20px; }
      .content { line-height: 1.6; }
    `;
  }
};
```

2. **注册模板**

在 `src/services/templateManager.js` 中添加：
```javascript
const templates = {
  // ... 现有模板
  custom: () => import('../../templates/custom.js')
};
```

详细的模板开发指南请参考 [TEMPLATE_GUIDE.md](docs/TEMPLATE_GUIDE.md)。

## 🔧 配置选项

### 环境变量

| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `DIFY_API_KEY` | Dify平台API密钥 | ✅ | - |
| `DIFY_BASE_URL` | Dify API基础URL | ✅ | - |
| `ENVIRONMENT` | 运行环境 | ❌ | `production` |
| `DEBUG` | 调试模式 | ❌ | `false` |

### Wrangler配置

```toml
# wrangler.toml
name = "ai-content-agent"
main = "src/index.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "CONTENT_CACHE"
id = "your-namespace-id"
preview_id = "your-preview-namespace-id"

[triggers]
crons = ["0 0 * * *"] # 每日清理缓存
```

## 📊 监控和维护

### 健康检查

```bash
# 检查服务状态
curl https://your-domain.workers.dev/api/status

# 预期响应
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "checks": {
    "kv": "healthy",
    "dify": "healthy",
    "templates": "healthy"
  }
}
```

### 性能监控

- **响应时间**: 目标 < 2秒
- **可用性**: 目标 > 99.9%
- **错误率**: 目标 < 0.1%
- **缓存命中率**: 目标 > 80%

### 日志查看

```bash
# 实时日志
wrangler tail

# 过滤错误日志
wrangler tail | grep ERROR

# 查看特定时间段
wrangler tail --since 1h
```

## 🧪 测试

### 运行测试

```bash
# 安装测试依赖
npm install --dev

# 运行单元测试
npm test

# 运行集成测试
npm run test:integration

# 生成覆盖率报告
npm run test:coverage
```

### 测试API端点

```bash
# 测试脚本
./tests/api-test.sh

# 或手动测试
curl -X POST https://your-domain.workers.dev/api/render \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Test\n\nHello World!",
    "template": "general",
    "title": "Test Document"
  }'
```

## 🔒 安全

### 安全特性

- ✅ HTTPS强制加密
- ✅ CORS跨域保护
- ✅ 输入验证和清理
- ✅ API密钥安全存储
- ✅ 请求频率限制
- ✅ 错误信息脱敏

### 安全最佳实践

1. **定期轮换API密钥**
2. **监控异常访问模式**
3. **保持依赖项更新**
4. **启用安全头设置**
5. **实施访问日志审计**

## 🚀 性能优化

### 缓存策略

- **模板缓存**: 预编译模板，减少重复加载
- **内容缓存**: 相同内容复用渲染结果
- **API缓存**: 缓存Dify API响应
- **静态资源**: CDN加速和浏览器缓存

### 优化建议

1. **启用Gzip压缩**
2. **使用流式响应**
3. **实施智能缓存**
4. **优化图片资源**
5. **减少API调用**

## 📚 文档

- [API文档](docs/API.md) - 完整的API接口说明
- [设计文档](docs/DESIGN.md) - 系统架构和设计思路
- [部署指南](docs/DEPLOYMENT.md) - 详细的部署和运维指南
- [模板开发指南](docs/TEMPLATE_GUIDE.md) - 自定义模板开发教程
- [故障排除指南](docs/TROUBLESHOOTING.md) - 常见问题和解决方案

## 🤝 贡献

我们欢迎所有形式的贡献！

### 贡献方式

1. **报告Bug**: 提交Issue描述问题
2. **功能建议**: 提出新功能想法
3. **代码贡献**: 提交Pull Request
4. **文档改进**: 完善项目文档
5. **模板分享**: 贡献新的模板设计

### 开发流程

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

### 代码规范

- 使用ESLint进行代码检查
- 遵循JavaScript Standard Style
- 添加适当的注释和文档
- 确保测试覆盖率

## 📄 许可证

本项目采用 [MIT许可证](LICENSE)。

## 🙏 致谢

感谢以下开源项目和服务：

- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台
- [Dify](https://dify.ai/) - AI应用开发平台
- [marked.js](https://marked.js.org/) - Markdown解析器
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Workers开发工具

## 📞 支持

如果您遇到问题或需要帮助：

- 📖 查看[故障排除指南](docs/TROUBLESHOOTING.md)
- 🐛 提交[GitHub Issue](https://github.com/your-username/ai-driven-content-agent/issues)
- 💬 加入[讨论区](https://github.com/your-username/ai-driven-content-agent/discussions)
- 📧 发送邮件至 support@your-domain.com

## 🗺️ 路线图

### 短期目标 (1-3个月)
- [ ] 添加更多内置模板
- [ ] 实现模板市场
- [ ] 增强错误处理
- [ ] 性能优化

### 中期目标 (3-6个月)
- [ ] 多语言支持
- [ ] 用户认证系统
- [ ] 高级缓存策略
- [ ] 监控仪表板

### 长期目标 (6-12个月)
- [ ] 插件系统
- [ ] 可视化编辑器
- [ ] 企业级功能
- [ ] 移动应用

---

<div align="center">
  <p>Made with ❤️ by the AI Content Agent Team</p>
  <p>
    <a href="https://github.com/your-username/ai-driven-content-agent">GitHub</a> |
    <a href="https://your-domain.workers.dev">Demo</a> |
    <a href="docs/API.md">API Docs</a> |
    <a href="https://github.com/your-username/ai-driven-content-agent/wiki">Wiki</a>
  </p>
</div>