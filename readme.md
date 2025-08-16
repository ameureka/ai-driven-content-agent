# 🤖 AI驱动内容代理 (AI-Driven Content Agent)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ameureka/ai-driven-content-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ameureka/ai-driven-content-agent/releases)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![Dify](https://img.shields.io/badge/Powered%20by-Dify%20AI-blue)](https://dify.ai/)
[![Production](https://img.shields.io/badge/Production-Live-green.svg)](https://ai-driven-content-agent.yalinwang2.workers.dev)
[![Documentation](https://img.shields.io/badge/Docs-Complete-brightgreen.svg)](docs/文档索引.md)

一个基于Cloudflare Workers的智能内容生成和渲染系统，集成Dify AI工作流，支持多种微信公众号模板和自定义工作流管理。

> 🌟 **特别说明**: 本项目已完成自定义工作流系统的完整实现，包括前端界面、后端API、环境变量配置和生产环境部署验证。

## ✨ 核心特性

### 🎯 智能内容生成
- 🤖 **AI驱动**: 集成Dify AI平台，支持多种智能工作流
- 📝 **内容生成**: 基于URL自动生成高质量文章内容
- 🔄 **流式响应**: 实时流式AI响应，提供即时反馈
- 📊 **多种输入**: 支持URL、文本、标题等多种输入方式

### 🎨 专业模板系统
- 📱 **微信优化**: 6种专业微信公众号模板
- 🎯 **场景覆盖**: 文章、技术分析、新闻、项目介绍等
- 🔧 **可扩展性**: 支持自定义模板开发
- 📐 **响应式设计**: 完美适配移动端和桌面端

### ⚡ 高性能架构
- 🌍 **边缘计算**: 基于Cloudflare Workers，全球边缘节点部署
- ⚡ **毫秒响应**: Worker启动时间 < 15ms
- 💾 **智能缓存**: KV存储 + R2对象存储优化
- 🛡️ **安全可靠**: 内置安全防护和完整错误处理

### 🔧 自定义工作流
- ➕ **动态添加**: 支持在线添加自定义Dify工作流
- 🗑️ **灵活管理**: 完整的CRUD操作支持
- 🎛️ **配置灵活**: 支持不同类型和图标的工作流配置
- 🔄 **实时更新**: 无需重启即可更新工作流配置

## 🚀 一键部署

### 快速部署
```bash
# 克隆项目
git clone https://github.com/ameureka/ai-driven-content-agent.git
cd ai-driven-content-agent

# 一键部署脚本
chmod +x quick-start-main.sh
./quick-start-main.sh
```

### 手动部署
```bash
# 1. 安装依赖
npm install

# 2. 配置Cloudflare
wrangler login

# 3. 设置环境变量
wrangler secret put DIFY_API_KEY
wrangler secret put DIFY_ARTICLE_API_KEY  
wrangler secret put API_KEY

# 4. 部署到生产环境
npm run deploy
```

## 🎯 功能演示

### 内置工作流
| 工作流 | 类型 | 功能描述 | 输入要求 |
|--------|------|----------|----------|
| **URL内容生成** | `dify-general` | 基于URL生成智能内容 | URL地址 |
| **AI文章创作** | `dify-article` | 基于标题创作完整文章 | 文章标题 |

### 模板系统
| 模板名称 | 标识符 | 适用场景 | 特色功能 |
|----------|--------|----------|----------|
| 📄 文章模板 | `article_wechat` | 通用文章发布 | 简洁排版、易读性优化 |
| 🔬 技术分析 | `tech_analysis_wechat` | 技术深度解析 | 代码高亮、专业布局 |
| 📰 现代新闻 | `news_modern_wechat` | 新闻资讯发布 | 时效性标识、媒体优化 |
| 🚀 GitHub项目 | `github_project_wechat` | 开源项目介绍 | 项目展示、技术栈突出 |
| 📊 AI基准测试 | `ai_benchmark_wechat` | AI性能评测 | 数据可视化、对比表格 |
| 💼 专业分析 | `professional_analysis_wechat` | 行业深度分析 | 专业排版、数据图表 |

## 📖 API接口文档

### 系统状态
```bash
GET /api/v1/status
# 响应: 系统健康状态和版本信息
```

### 工作流管理
```bash
# 获取可用工作流
GET /api/v1/workflows/available

# 执行工作流
POST /api/v1/workflows/{workflowId}/execute
{
  "inputs": {
    "url": "https://example.com",
    "title": "文章标题"
  }
}

# 添加自定义工作流
POST /api/v1/workflows/custom
{
  "id": "my-workflow",
  "name": "我的工作流",
  "description": "自定义工作流描述",
  "apiKey": "app-your-dify-key",
  "type": "url",
  "icon": "ion-md-cog"
}

# 删除自定义工作流
DELETE /api/v1/workflows/custom/{workflowId}
```

### 内容渲染
```bash
# 渲染内容
POST /api/v1/content/render
{
  "content": "markdown内容",
  "template": "article_wechat",
  "title": "文章标题"
}

# 获取内容列表
GET /api/v1/content

# 获取HTML源码
GET /api/v1/content/{contentId}/html
```

### 模板系统
```bash
# 获取模板列表
GET /api/v1/templates

# 获取模板详情
GET /api/v1/templates/{templateId}
```

## 🏗️ 项目架构

```
ai-driven-content-agent/
├── 📁 src/                      # 核心源代码
│   ├── 🎯 index.js             # 主入口 - 路由和中间件
│   ├── 📁 api/                 # API层
│   │   ├── 🔗 dify.js          # Dify通用工作流集成
│   │   ├── 📝 difyArticle.js   # Dify文章工作流
│   │   └── 🛣️ routes.js        # RESTful API路由
│   └── 📁 services/            # 业务逻辑层
│       └── 🎨 templateManager.js # 模板管理服务
├── 📁 templates/               # 模板文件(6个专业模板)
├── 📁 public/                  # 前端静态资源
│   ├── 🏠 index.html          # 主页面(工作流选择器)
│   ├── ⚡ script.js           # 前端逻辑(220+行)
│   ├── 🎨 styles.css          # 样式表(专业UI)
│   └── 📚 wiki.html           # API文档页面
├── 📁 docs/                    # 项目文档
│   └── 📋 自定义工作流系统实施报告.md # 完整实施文档
├── 📁 test/                    # 测试文件
└── ⚙️ wrangler.toml           # Cloudflare Workers配置
```

## 🔧 环境配置

### 必需环境变量
```env
# Dify AI API配置
DIFY_API_KEY=app-your-general-workflow-key
DIFY_ARTICLE_API_KEY=app-your-article-workflow-key
DIFY_BASE_URL=https://api.dify.ai

# 系统配置
API_KEY=your-api-access-key
ENVIRONMENT=production
```

### 可选配置
```env
# 自定义工作流配置(JSON格式)
CUSTOM_WORKFLOWS='{
  "translate": {
    "name": "智能翻译",
    "description": "多语言智能翻译工作流",
    "apiKey": "app-translate-key",
    "type": "url",
    "icon": "ion-md-globe"
  }
}'

# 调试配置
DEBUG=true
```

## 🧪 测试验证

### 自动化测试
```bash
# Playwright前端测试
npx playwright test

# 单元测试
npm test

# API端点测试
curl https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/status
```

### 功能验证
1. **工作流执行**: URL内容生成 ✅
2. **模板渲染**: 6种微信模板 ✅  
3. **自定义工作流**: 添加/删除操作 ✅
4. **流式响应**: 实时内容生成 ✅
5. **错误处理**: 完整异常捕获 ✅

## 📊 性能指标

### 部署统计
- ⚡ **Worker启动时间**: < 15ms
- 📦 **打包大小**: 278.6kb
- 🌍 **全球部署**: Cloudflare边缘网络
- 📁 **静态资源**: 4个文件，305.03 KiB

### 运行性能
- 🚀 **API响应时间**: < 2秒
- 📈 **可用性目标**: > 99.9%
- 🎯 **错误率目标**: < 0.1%
- 💾 **缓存命中率**: > 80%

## 🔒 安全特性

- ✅ **HTTPS强制加密**
- ✅ **API密钥安全存储**(Cloudflare Secrets)
- ✅ **输入验证和清理**
- ✅ **CORS跨域保护**
- ✅ **错误信息脱敏**
- ✅ **请求频率限制**

## 📚 详细文档

> 💡 **文档导航**: 项目采用标准化文档结构，所有文档位于 [`docs/汇总/新文档结构/`](docs/汇总/新文档结构/) 目录下，按功能分类组织。

### 🗂️ 文档结构
- 📂 **01_项目概述** - 项目介绍和架构概览
- 📂 **02_技术文档** - API文档、架构设计、开发指南
- 📂 **03_开发指南** - 环境搭建、代码规范、开发流程
- 📂 **04_部署运维** - 部署指南、监控配置
- 📂 **05_测试文档** - 测试策略、用例管理、自动化测试
- 📂 **06_流程图表** - 系统架构图、工作流程图
- 📂 **07_升级日志** - 版本更新、功能升级记录
- 📂 **08_参考资料** - 技术参考、最佳实践

### 核心文档
- 📋 [API完整文档](docs/汇总/新文档结构/02_技术文档/API接口文档_汇总版.md)
- 🏗️ [系统架构设计](docs/汇总/新文档结构/01_项目概述/项目架构概览.md)
- 🚀 [部署运维指南](docs/汇总/新文档结构/04_部署运维/部署指南.md)
- 🎨 [模板开发指南](docs/汇总/新文档结构/02_技术文档/模板系统文档.md)
- 🔧 [自定义工作流实施报告](docs/rulers/自定义工作流系统实施报告.md)

### 开发文档
- 🛠️ [开发环境搭建](docs/汇总/新文档结构/03_开发指南/开发环境搭建.md)
- 📝 [代码规范](docs/汇总/新文档结构/03_开发指南/代码规范.md)
- 🧪 [测试策略](docs/汇总/新文档结构/05_测试文档/测试策略与规范.md)

### 运维文档
- 📊 [监控配置](docs/汇总/新文档结构/04_部署运维/监控配置.md)
- 🔍 [故障排除](docs/故障排障设计.md)

### 参考资料
- 📖 [工作流分析报告](docs/汇总/新文档结构/06_流程图表/工作流分析报告.md)
- 🔄 [升级日志](docs/汇总/新文档结构/07_升级日志/自定义工作流实现完整版.md)

## 🤝 贡献指南

欢迎贡献代码、文档、模板或问题反馈！

### 快速贡献
1. Fork本项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循JavaScript Standard Style
- 确保测试覆盖率 > 80%
- 添加适当的注释和文档

## 📄 许可证

本项目采用 [MIT许可证](LICENSE) - 详见许可证文件

## 🙏 致谢

感谢以下优秀的开源项目和服务：
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台
- [Dify](https://dify.ai/) - AI工作流开发平台  
- [Marked.js](https://marked.js.org/) - Markdown解析器
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - 开发部署工具
- [Playwright](https://playwright.dev/) - 自动化测试框架

## 📞 获取支持

遇到问题或需要帮助？

- 🐛 [提交Issue](https://github.com/ameureka/ai-driven-content-agent/issues)
- 💬 [参与讨论](https://github.com/ameureka/ai-driven-content-agent/discussions)  
- 📖 查看[故障排除指南](docs/故障排障设计.md)
- 📚 浏览[完整文档索引](docs/文档索引.md)
- 📧 联系开发团队

## 🗺️ 开发路线图

### ✅ 已完成功能
- [x] 完整的自定义工作流系统
- [x] 6种专业微信公众号模板
- [x] RESTful API接口
- [x] 流式响应支持
- [x] 生产环境部署
- [x] 前端工作流管理界面
- [x] Playwright自动化测试

### 🚧 进行中
- [ ] 模板市场功能
- [ ] 高级错误处理优化
- [ ] 性能监控仪表板

### 🔮 未来计划
- [ ] 多语言国际化支持
- [ ] 用户认证和权限系统
- [ ] 插件系统架构
- [ ] 可视化工作流编辑器

---

<div align="center">
  <p><strong>🚀 现在就开始使用AI驱动内容代理！</strong></p>
  <p>
    <a href="https://ai-driven-content-agent.yalinwang2.workers.dev">🌟 在线体验</a> |
    <a href="docs/rulers/API_Complete_Documentation.md">📖 API文档</a> |
    <a href="https://github.com/ameureka/ai-driven-content-agent/issues">🐛 问题反馈</a> |
    <a href="https://github.com/ameureka/ai-driven-content-agent/discussions">💬 社区讨论</a>
  </p>
  <p><em>Made with ❤️ by AI Content Agent Team</em></p>
</div>