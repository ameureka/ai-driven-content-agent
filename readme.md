# AI驱动内容代理系统

一个基于Cloudflare Workers的智能内容生成和渲染系统，支持多种微信公众号模板，集成Dify AI工作流。

## 🚀 功能特性

- **多模板支持**：6种专业的微信公众号内容模板
- **AI驱动**：集成Dify AI工作流，智能内容生成
- **实时渲染**：支持Markdown到HTML的实时转换
- **响应式设计**：适配移动端和桌面端显示
- **API接口**：完整的RESTful API支持
- **测试完备**：包含前端、后端、自动化测试套件

## 📋 支持的模板

1. **article_wechat** - 文章模板：适用于长篇文章和深度内容
2. **tech_analysis_wechat** - 技术分析模板：专业技术分析和解读
3. **news_modern_wechat** - 现代新闻模板：新闻资讯和时事报道
4. **github_project_wechat** - GitHub项目模板：开源项目介绍
5. **ai_benchmark_wechat** - AI基准测试模板：AI相关测试报告
6. **professional_analysis_wechat** - 专业分析模板：行业分析和专业报告

## 🛠️ 技术栈

- **运行环境**：Cloudflare Workers
- **前端**：原生JavaScript + HTML5 + CSS3
- **后端**：Node.js + Cloudflare Workers API
- **AI集成**：Dify工作流平台
- **测试框架**：Vitest + 自定义测试套件

## 📦 安装与部署

### 环境要求

- Node.js 16+
- npm 或 yarn
- Cloudflare账户
- Dify API密钥

### 快速开始

1. **克隆项目**
```bash
git clone https://github.com/your-username/ai_driven_content_agent.git
cd ai_driven_content_agent
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 文件，填入你的API密钥
```

4. **本地开发**
```bash
# 启动开发服务器
npm run dev

# 或使用快速启动脚本
./quick-start.sh  # macOS/Linux
# 或
quick-start.bat   # Windows
```

5. **部署到Cloudflare**
```bash
npm run deploy
```

## 🧪 测试

项目包含完整的测试套件，位于 `test/` 文件夹：

```bash
# 模板管理器测试
node test/test_templates.js

# 自动化测试
node test/test_automation.js

# 后端API测试
node test/test_templates_backend.cjs

# 前端界面测试
node test/test_frontend_ui.js
```

### 浏览器测试

启动开发服务器后，访问：
- 主界面：`http://localhost:8787`
- 测试页面：`http://localhost:8787/test_browser.html`

## 📖 API文档

### 核心端点

- `GET /api/v1/status` - 系统状态检查
- `GET /api/v1/templates` - 获取可用模板列表
- `GET /api/v1/workflows` - 获取工作流信息
- `POST /api/v1/render` - 内容渲染
- `GET /content/:id` - 获取渲染结果

详细API文档请参考 [API文档.md](./API文档.md)

## 📁 项目结构

```
ai_driven_content_agent/
├── src/                    # 源代码
│   ├── api/               # API路由和处理
│   ├── services/          # 业务逻辑服务
│   └── styles/            # 样式文件
├── templates/             # 内容模板
├── public/                # 静态资源
├── test/                  # 测试文件
├── docs/                  # 文档
└── wrangler.toml         # Cloudflare配置
```

## 🔧 配置说明

### 环境变量

在 `.dev.vars` 文件中配置以下变量：

```env
DIFY_API_KEY=your_dify_api_key
DIFY_BASE_URL=https://api.dify.ai/v1
ENVIRONMENT=development
```

### Cloudflare Workers配置

项目使用 `wrangler.toml` 进行Cloudflare Workers配置，支持：
- 自定义域名
- 环境变量管理
- KV存储绑定

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 支持

如果你遇到问题或有建议，请：

1. 查看 [文档](./docs/)
2. 搜索 [Issues](https://github.com/your-username/ai_driven_content_agent/issues)
3. 创建新的 Issue

## 🔄 更新日志

### v1.0.0 (2025-08-08)

- ✨ 初始版本发布
- 🎯 支持6种微信公众号模板
- 🔧 完整的测试套件
- 📚 完善的文档系统
- 🚀 Cloudflare Workers部署支持

---

**Made with ❤️ by AI Content Agent Team**