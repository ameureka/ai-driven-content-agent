# AI驱动内容代理系统

一个基于Cloudflare Workers的智能内容生成和渲染系统，集成Dify AI工作流，支持多种微信公众号模板和自定义工作流管理。

## ✨ 核心特性

### 🎯 智能内容生成
- **AI驱动**: 集成Dify AI平台，支持多种智能工作流
- **内容生成**: 基于URL自动生成高质量文章内容  
- **流式响应**: 实时流式AI响应，提供即时反馈
- **多种输入**: 支持URL、文本、标题等多种输入方式

### 🎨 模板系统
- **6种专业模板**: 涵盖文章、技术分析、新闻、项目介绍等场景
- **微信优化**: 专门针对微信公众号排版优化
- **响应式设计**: 完美适配移动端和桌面端
- **自定义扩展**: 支持自定义模板开发

### ⚡ 高性能架构
- **边缘计算**: 基于Cloudflare Workers，全球边缘节点部署
- **毫秒响应**: Worker启动时间 < 15ms
- **智能缓存**: KV存储 + R2对象存储优化
- **安全可靠**: 内置安全防护和完整错误处理

### 🔧 工作流管理
- **内置工作流**: dify-general (通用内容生成)、dify-article (AI文章创作)
- **自定义工作流**: 支持在线添加和管理自定义Dify工作流
- **灵活配置**: 支持不同类型和图标的工作流配置
- **实时更新**: 无需重启即可更新工作流配置

## 🚀 快速开始

### 环境要求
- Node.js 18.0+ (推荐 LTS 版本)
- npm 9.0+ 或 yarn 1.22+
- Cloudflare账户 (用于部署)
- Dify API密钥 (用于AI工作流)

### 一键部署
```bash
# 克隆项目
git clone https://github.com/ameureka/ai-driven-content-agent.git
cd ai-driven-content-agent

# 一键部署脚本
chmod +x quick-start-main.sh
./quick-start-main.sh
```

### 本地开发
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 文件，填入API密钥

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 主界面: http://localhost:8787
```

### 环境变量配置
```env
# 必需配置
DIFY_API_KEY=your_dify_general_api_key
DIFY_ARTICLE_API_KEY=your_dify_article_api_key
API_KEY=your_api_access_key

# 可选配置
DIFY_BASE_URL=https://api.dify.ai
ENVIRONMENT=development
DEBUG=true
```

## 📖 支持的模板

| 模板名称 | 标识符 | 适用场景 | 特色功能 |
|----------|--------|----------|----------|
| 📄 文章模板 | `article_wechat` | 通用文章发布 | 简洁排版、易读性优化 |
| 🔬 技术分析 | `tech_analysis_wechat` | 技术深度解析 | 代码高亮、专业布局 |
| 📰 现代新闻 | `news_modern_wechat` | 新闻资讯发布 | 时效性标识、媒体优化 |
| 🚀 GitHub项目 | `github_project_wechat` | 开源项目介绍 | 项目展示、技术栈突出 |
| 📊 AI基准测试 | `ai_benchmark_wechat` | AI性能评测 | 数据可视化、对比表格 |
| 💼 专业分析 | `professional_analysis_wechat` | 行业深度分析 | 专业排版、数据图表 |

## 🛠️ 技术栈

### 核心技术
- **运行环境**: Cloudflare Workers (Edge Runtime)
- **前端**: 原生JavaScript + HTML5 + CSS3
- **后端**: Node.js + Cloudflare Workers API
- **AI集成**: Dify工作流平台

### 开发工具
- **构建工具**: Wrangler CLI + esbuild
- **测试框架**: Vitest + Playwright
- **代码质量**: ESLint + Prettier
- **监控工具**: Cloudflare Analytics

## 🧪 测试

```bash
# 运行所有测试
npm test

# Playwright前端测试
npx playwright test

# API端点测试
curl https://ai-driven-content-agent.yalinwang2.workers.dev/api/v1/status
```

## 📚 文档

- [API接口文档](API.md) - 完整的API接口说明
- [开发指南](DEVELOPMENT.md) - 开发环境搭建和开发规范
- [部署指南](DEPLOYMENT.md) - 生产环境部署
- [测试指南](TESTING.md) - 测试策略和执行
- [架构说明](ARCHITECTURE.md) - 系统架构设计
- [更新日志](CHANGELOG.md) - 版本更新记录

## 🚀 部署

### 开发环境
```bash
npm run dev
```

### 生产部署
```bash
# 设置环境变量
wrangler secret put DIFY_API_KEY
wrangler secret put DIFY_ARTICLE_API_KEY
wrangler secret put API_KEY

# 部署到Cloudflare Workers
npm run deploy
```

### 部署验证
- 生产环境: https://ai-driven-content-agent.yalinwang2.workers.dev
- API状态检查: `/api/v1/status`

## 📊 性能指标

- ⚡ Worker启动时间: < 15ms
- 📦 打包大小: 278.6kb
- 🌍 全球部署: Cloudflare边缘网络
- 🚀 API响应时间: < 2秒
- 📈 可用性目标: > 99.9%

## 🤝 贡献

欢迎贡献代码、文档、模板或问题反馈！

### 快速贡献
1. Fork本项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建Pull Request

## 📄 许可证

本项目采用 [MIT许可证](../LICENSE)

## 📞 获取支持

- 🐛 [提交Issue](https://github.com/ameureka/ai-driven-content-agent/issues)
- 💬 [参与讨论](https://github.com/ameureka/ai-driven-content-agent/discussions)
- 📧 联系开发团队

---

<div align="center">
  <p><strong>🚀 现在就开始使用AI驱动内容代理！</strong></p>
  <p><em>Made with ❤️ by AI Content Agent Team</em></p>
</div>