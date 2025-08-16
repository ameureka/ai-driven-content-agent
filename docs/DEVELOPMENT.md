# 开发指南

## 🚀 快速开始

### 环境要求

#### 基础环境
- **Node.js**: >= 18.0.0 (推荐使用 LTS 版本)
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: >= 2.30.0
- **操作系统**: macOS, Linux, Windows 10+

#### 推荐工具
- **IDE**: Visual Studio Code
- **终端**: iTerm2 (macOS) / Windows Terminal (Windows)
- **浏览器**: Chrome/Firefox (用于调试)
- **API测试**: Postman 或 curl

### 项目初始化

#### 1. 克隆项目
```bash
git clone https://github.com/ameureka/ai-driven-content-agent.git
cd ai-driven-content-agent
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 环境配置
```bash
# 复制环境变量模板
cp .dev.vars.example .dev.vars

# 编辑环境变量文件
vim .dev.vars
```

#### 4. 环境变量配置
```env
# .dev.vars

# Dify AI API配置
DIFY_API_KEY=your_dify_general_api_key
DIFY_ARTICLE_API_KEY=your_dify_article_api_key
DIFY_BASE_URL=https://api.dify.ai

# 系统配置
API_KEY=your_api_access_key
ENVIRONMENT=development
DEBUG=true

# 自定义工作流配置(可选)
CUSTOM_WORKFLOWS='{
  "translate": {
    "name": "智能翻译",
    "description": "多语言智能翻译工作流",
    "apiKey": "app-translate-key",
    "type": "url",
    "icon": "ion-md-globe"
  }
}'
```

#### 5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:8787 查看应用。

## 🏗️ 项目结构

```
ai-driven-content-agent/
├── src/                    # 核心源代码
│   ├── index.js           # 主入口文件
│   ├── api/               # API层
│   │   ├── dify.js        # Dify通用工作流集成
│   │   ├── difyArticle.js # Dify文章工作流
│   │   └── routes.js      # RESTful API路由
│   └── services/          # 业务逻辑层
│       └── templateManager.js # 模板管理服务
├── templates/             # 模板文件(6个专业模板)
├── public/                # 前端静态资源
│   ├── index.html        # 主页面(工作流选择器)
│   ├── script.js         # 前端逻辑
│   ├── styles.css        # 样式表
│   └── wiki.html         # API文档页面
├── test/                  # 测试文件
├── docs/                  # 项目文档
├── package.json           # 项目配置
├── wrangler.toml         # Cloudflare Workers配置
└── .dev.vars             # 开发环境变量
```

## 🔧 开发流程

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 部署到生产环境
npm run deploy
```

### Git工作流

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 提交代码
git add .
git commit -m "feat: add your feature description"

# 推送分支
git push origin feature/your-feature-name

# 创建Pull Request
```

### 代码规范

#### JavaScript/Node.js规范
- 使用ES6+语法
- 使用2空格缩进
- 字符串使用单引号
- 对象和数组末尾不加逗号
- 函数名使用camelCase
- 常量使用UPPER_CASE

#### 提交信息规范
```bash
# 格式: type(scope): description

# 类型:
feat:     新功能
fix:      Bug修复
docs:     文档更新
style:    代码格式调整
refactor: 重构
test:     测试相关
chore:    构建过程或辅助工具的变动

# 示例:
git commit -m "feat(api): add custom workflow management"
git commit -m "fix(template): resolve rendering issue in mobile view"
git commit -m "docs: update API documentation"
```

## 🔄 工作流系统

### 核心工作流

#### 1. dify-general (通用内容生成)
- **功能**: 基于URL生成智能内容
- **输入**: URL地址、查询内容
- **输出**: 生成的markdown内容
- **平均执行时间**: 3-8秒

#### 2. dify-article (AI文章创作)
- **功能**: 基于标题创作完整文章
- **输入**: 文章标题、风格、上下文
- **输出**: 完整的文章内容
- **支持流式响应**: 是

### 自定义工作流

#### 添加新工作流
1. 在Dify平台创建工作流
2. 获取工作流API密钥
3. 通过API或环境变量配置工作流
4. 测试工作流功能

#### 工作流配置格式
```json
{
  "id": "workflow-id",
  "name": "工作流名称",
  "description": "工作流描述",
  "apiKey": "app-dify-workflow-key",
  "type": "url|text",
  "icon": "ion-md-icon-name"
}
```

## 🎨 模板系统

### 内置模板

| 模板ID | 名称 | 适用场景 |
|--------|------|----------|
| `article_wechat` | 文章模板 | 通用文章发布 |
| `tech_analysis_wechat` | 技术分析 | 技术深度解析 |
| `news_modern_wechat` | 现代新闻 | 新闻资讯发布 |
| `github_project_wechat` | GitHub项目 | 开源项目介绍 |
| `ai_benchmark_wechat` | AI基准测试 | AI性能评测 |
| `professional_analysis_wechat` | 专业分析 | 行业深度分析 |

### 开发新模板

#### 1. 创建模板文件
```javascript
// templates/custom_template.js
export default {
  name: 'custom_template',
  displayName: '自定义模板',
  description: '我的自定义模板',
  version: '1.0.0',
  
  render: function(content, title = '文档') {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
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

#### 2. 注册模板
在 `src/services/templateManager.js` 中添加:
```javascript
const templates = {
  // ... 现有模板
  custom_template: () => import('../../templates/custom_template.js')
};
```

## 🧪 测试

### 测试结构
```
test/
├── basic.test.js          # 基础功能测试
├── playwright.config.js   # Playwright配置
└── specs/                 # E2E测试用例
    └── workflow.spec.js   # 工作流测试
```

### 运行测试
```bash
# 运行所有测试
npm test

# 运行Playwright E2E测试
npx playwright test

# 运行特定测试文件
npx playwright test test/specs/workflow.spec.js

# 显示测试报告
npx playwright show-report
```

### 编写测试用例

#### 单元测试示例
```javascript
// test/basic.test.js
import { describe, it, expect } from 'vitest';

describe('API Tests', () => {
  it('should return system status', async () => {
    const response = await fetch('http://localhost:8787/api/v1/status');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('healthy');
  });
});
```

#### E2E测试示例
```javascript
// test/specs/workflow.spec.js
import { test, expect } from '@playwright/test';

test('workflow execution', async ({ page }) => {
  await page.goto('http://localhost:8787');
  
  // 选择工作流
  await page.click('[data-workflow="dify-general"]');
  
  // 输入URL
  await page.fill('#url-input', 'https://example.com');
  
  // 执行工作流
  await page.click('#execute-button');
  
  // 验证结果
  await expect(page.locator('#result')).toBeVisible();
});
```

## 🚀 部署

### 本地部署测试
```bash
# 构建项目
npm run build

# 本地预览
wrangler dev
```

### 生产环境部署
```bash
# 设置生产环境变量
wrangler secret put DIFY_API_KEY
wrangler secret put DIFY_ARTICLE_API_KEY
wrangler secret put API_KEY

# 部署到Cloudflare Workers
npm run deploy

# 查看部署状态
wrangler tail
```

## 🐛 调试

### 本地调试
1. 使用 `console.log()` 输出调试信息
2. 使用浏览器开发者工具
3. 查看Wrangler开发服务器日志

### 生产环境调试
```bash
# 查看实时日志
wrangler tail

# 查看特定时间段日志
wrangler tail --since 1h

# 过滤错误日志
wrangler tail | grep ERROR
```

### 常见问题

#### 1. 环境变量未生效
检查 `.dev.vars` 文件是否正确配置，重启开发服务器。

#### 2. API调用失败
检查API密钥是否正确，网络连接是否正常。

#### 3. 模板渲染异常
检查模板文件语法，确认模板注册正确。

#### 4. 部署失败
检查wrangler.toml配置，确认Cloudflare账户权限。

## 💡 开发技巧

### 1. 环境管理
- 使用不同的 `.dev.vars` 文件管理不同环境
- 使用Cloudflare预览功能测试部署

### 2. 性能优化
- 合理使用缓存机制
- 优化API调用频率
- 压缩静态资源

### 3. 错误处理
- 实现完整的错误捕获
- 提供用户友好的错误信息
- 记录详细的错误日志

## 📚 参考资料

- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Dify平台文档](https://docs.dify.ai/)
- [Playwright测试框架](https://playwright.dev/)
- [Vitest测试框架](https://vitest.dev/)

## 🤝 贡献指南

1. Fork项目仓库
2. 创建功能分支
3. 遵循代码规范
4. 添加测试用例
5. 提交Pull Request
6. 等待代码审查

## 📞 获取帮助

如果在开发过程中遇到问题:
- 查看[常见问题](../README.md#常见问题)
- 提交[GitHub Issue](https://github.com/ameureka/ai-driven-content-agent/issues)
- 联系开发团队