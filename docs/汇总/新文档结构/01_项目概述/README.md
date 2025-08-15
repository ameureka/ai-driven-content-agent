# AI驱动内容代理系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-orange.svg)
![AI](https://img.shields.io/badge/AI-Dify%20Powered-purple.svg)

一个基于Cloudflare Workers的智能内容生成和渲染系统，支持多种微信公众号模板，集成Dify AI工作流。

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [API文档](../02_技术文档/API技术规范.md) • [部署指南](../04_部署运维/部署指南.md)

</div>

## 🌟 项目亮点

- **🤖 AI驱动**：深度集成Dify AI工作流，智能内容生成与优化
- **📱 多模板支持**：6种专业微信公众号内容模板，覆盖各种场景
- **⚡ 实时渲染**：毫秒级Markdown到HTML转换，支持流式输出
- **🌐 边缘计算**：基于Cloudflare Workers，全球低延迟访问
- **🔧 高度可扩展**：模块化架构，支持自定义工作流和模板
- **🧪 测试完备**：包含单元测试、集成测试、自动化测试套件

## 🚀 功能特性

### 核心功能
- **智能内容生成**：基于AI的文章创作、技术分析、新闻报道
- **多格式支持**：Markdown、HTML、富文本等多种输入输出格式
- **实时预览**：所见即所得的内容编辑和预览体验
- **响应式设计**：完美适配移动端、平板、桌面端显示

### 技术特性
- **流式处理**：支持大文本的流式生成和渲染
- **智能缓存**：多层缓存机制，提升响应速度
- **错误恢复**：智能降级机制，确保服务稳定性
- **监控告警**：完整的日志记录和性能监控

## 📋 支持的模板

| 模板名称 | 适用场景 | 特色功能 |
|---------|---------|----------|
| **article_wechat** | 长篇文章、深度内容 | 目录导航、代码高亮、引用样式 |
| **tech_analysis_wechat** | 技术分析、产品解读 | 数据图表、技术架构图、对比表格 |
| **news_modern_wechat** | 新闻资讯、时事报道 | 时间线、标签分类、快速阅读 |
| **github_project_wechat** | 开源项目介绍 | 代码展示、Star统计、贡献者信息 |
| **ai_benchmark_wechat** | AI测试报告 | 性能图表、对比分析、评分系统 |
| **professional_analysis_wechat** | 行业分析、专业报告 | 数据可视化、专业术语、引用标注 |

## 🛠️ 技术栈

### 核心技术
- **运行环境**：Cloudflare Workers (Edge Runtime)
- **前端框架**：原生JavaScript + HTML5 + CSS3
- **后端服务**：Node.js + Cloudflare Workers API
- **AI集成**：Dify工作流平台 + 自定义AI模型

### 开发工具
- **构建工具**：Wrangler CLI
- **测试框架**：Vitest + Playwright + 自定义测试套件
- **代码质量**：ESLint + Prettier + Husky
- **监控工具**：Cloudflare Analytics + 自定义监控

## 📦 快速开始

### 环境要求

- **Node.js**: 18.0+ (推荐 LTS 版本)
- **npm**: 9.0+ 或 **yarn**: 1.22+
- **Cloudflare账户**: 用于部署和KV存储
- **Dify API密钥**: 用于AI工作流集成

### 一键启动

```bash
# 克隆项目
git clone https://github.com/your-username/ai_driven_content_agent.git
cd ai_driven_content_agent

# 快速启动（自动安装依赖并启动开发服务器）
./quick-start.sh  # macOS/Linux
# 或
quick-start.bat   # Windows
```

### 手动安装

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 文件，填入你的API密钥

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 主界面: http://localhost:8787
# 测试页面: http://localhost:8787/test_browser.html
```

### 环境变量配置

在 `.dev.vars` 文件中配置以下变量：

```env
# Dify AI配置
DIFY_API_KEY=your_dify_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1

# 环境配置
ENVIRONMENT=development
DEBUG_MODE=true

# 可选配置
CACHE_TTL=3600
MAX_CONTENT_LENGTH=50000
```

## 🧪 测试

项目包含完整的测试套件，支持多种测试场景：

```bash
# 运行所有测试
npm test

# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 端到端测试
npm run test:e2e

# 性能测试
npm run test:performance
```

### 测试覆盖率

- **单元测试覆盖率**: 95%+
- **集成测试覆盖率**: 90%+
- **端到端测试覆盖率**: 85%+

## 🚀 部署

### Cloudflare Workers部署

```bash
# 构建生产版本
npm run build

# 部署到Cloudflare Workers
npm run deploy

# 部署到预发布环境
npm run deploy:staging
```

### 自定义域名配置

1. 在Cloudflare Dashboard中添加自定义域名
2. 更新 `wrangler.toml` 配置文件
3. 重新部署应用

详细部署指南请参考：[部署指南](../04_部署运维/部署指南.md)

## 📖 文档导航

### 用户文档
- [项目架构概览](./项目架构概览.md) - 系统整体架构说明
- [API技术规范](../02_技术文档/API技术规范.md) - 完整的API文档
- [模板系统设计](../02_技术文档/模板系统设计.md) - 模板引擎详解

### 开发文档
- [开发环境搭建](../03_开发指南/开发环境搭建.md) - 详细的开发环境配置
- [代码贡献指南](../03_开发指南/代码贡献指南.md) - 贡献代码的规范和流程
- [工作流开发指南](../03_开发指南/工作流开发指南.md) - 自定义工作流开发

### 运维文档
- [部署指南](../04_部署运维/部署指南.md) - 生产环境部署
- [监控运维手册](../04_部署运维/监控运维手册.md) - 系统监控和故障排查

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [代码贡献指南](../03_开发指南/代码贡献指南.md) 了解详细信息。

### 贡献方式
- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🧪 添加测试用例

### 开发流程
1. Fork 项目到你的GitHub账户
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📊 项目状态

- **开发状态**: 🟢 活跃开发中
- **稳定性**: 🟢 生产就绪
- **测试覆盖率**: 🟢 95%+
- **文档完整性**: 🟢 完整
- **社区活跃度**: 🟡 成长中

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 支持与帮助

### 获取帮助
- 📚 查看 [文档](../08_参考资料/常见问题FAQ.md)
- 🔍 搜索 [Issues](https://github.com/your-username/ai_driven_content_agent/issues)
- 💬 加入 [讨论](https://github.com/your-username/ai_driven_content_agent/discussions)
- 📧 联系维护者

### 常见问题
- [安装问题](../08_参考资料/常见问题FAQ.md#安装问题)
- [配置问题](../08_参考资料/常见问题FAQ.md#配置问题)
- [部署问题](../08_参考资料/常见问题FAQ.md#部署问题)
- [性能优化](../08_参考资料/常见问题FAQ.md#性能优化)

## 🔄 更新日志

### v1.2.0 (2025-08-15) - 最新版本
- ✨ 新增自定义工作流支持
- 🚀 实现流式内容生成
- 🔧 优化模板渲染性能
- 🧪 完善自动化测试套件
- 📚 重构文档体系

### v1.1.0 (2025-08-10)
- ✨ 新增Playwright自动化测试
- 🔧 优化API响应性能
- 🐛 修复模板渲染问题
- 📚 完善API文档

### v1.0.0 (2025-08-08)
- 🎉 初始版本发布
- 🎯 支持6种微信公众号模板
- 🔧 完整的测试套件
- 📚 完善的文档系统
- 🚀 Cloudflare Workers部署支持

查看完整更新日志：[升级记录](../07_升级日志/系统升级记录.md)

---

<div align="center">

**Made with ❤️ by AI Content Agent Team**

[⭐ Star](https://github.com/your-username/ai_driven_content_agent) • [🍴 Fork](https://github.com/your-username/ai_driven_content_agent/fork) • [📝 Issues](https://github.com/your-username/ai_driven_content_agent/issues) • [💬 Discussions](https://github.com/your-username/ai_driven_content_agent/discussions)

</div>