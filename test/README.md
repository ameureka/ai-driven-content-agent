# 测试文件夹说明

本文件夹包含了AI驱动内容代理系统的所有测试脚本，用于验证6个微信公众号模板的渲染功能。

## 文件结构

```
test/
├── README.md                    # 本说明文件
├── test_templates_backend.cjs   # 后端API测试脚本
├── test_frontend_ui.js          # 前端界面测试脚本
├── test_templates.js            # 模板管理器测试脚本
├── test_automation.js           # 自动化测试脚本
└── test_browser.html            # 浏览器端测试页面
```

## 测试内容

所有测试脚本使用 `/Users/ameureka/Desktop/ai_driven_content_agent/docs/test_markdown.md` 文件中的内容作为测试数据，该文件包含了关于"程序员的未来之路：技术浪潮下的结构性机会"的完整文章内容。

## 测试的模板

系统支持以下6个微信公众号模板：

1. **article_wechat** - 文章模板
2. **tech_analysis_wechat** - 技术分析模板
3. **news_modern_wechat** - 现代新闻模板
4. **github_project_wechat** - GitHub项目模板
5. **ai_benchmark_wechat** - AI基准测试模板
6. **professional_analysis_wechat** - 专业分析模板

## 使用方法

### 1. 后端API测试

运行后端测试脚本来验证所有模板的API功能：

```bash
cd test
node test_templates_backend.cjs
```

该脚本会：
- 测试所有6个模板的渲染功能
- 验证API响应格式
- 输出每个模板的测试结果和生成的内容ID
- 提供查看链接用于验证渲染效果

### 2. 模板管理器测试

测试模板管理器功能：

```bash
node test/test_templates.js
```

### 3. 自动化测试

运行完整的自动化测试套件：

```bash
node test/test_automation.js
```

### 4. 前端界面测试

在浏览器中打开测试页面：

```bash
# 确保开发服务器正在运行
npm run dev

# 然后在浏览器中访问
http://localhost:8787/test/test.html
# 或者访问浏览器端测试页面（已复制到 public 文件夹）
http://localhost:8787/test_browser.html
```

测试页面提供：
- 可视化的测试界面
- 一键测试所有模板功能
- 实时日志显示
- 测试结果展示

### 5. 手动前端测试

如果需要在浏览器控制台中手动运行前端测试：

```javascript
// 在浏览器控制台中加载并运行测试脚本
fetch('/test/test_frontend_ui.js')
  .then(response => response.text())
  .then(script => eval(script));
```

## 测试配置

- **API密钥**: `aiwenchuang`
- **服务器地址**: `http://localhost:8787`
- **API端点**: `/api/v1/content/render`
- **测试超时**: 30秒

## 预期结果

成功的测试应该返回：
- HTTP状态码: 200
- 响应包含: `contentId`, `viewUrl`, `htmlUrl`
- 所有6个模板都能正常渲染
- 生成的HTML内容格式正确

## 故障排除

1. **服务器未启动**: 确保运行 `npm run dev` 启动开发服务器
2. **API密钥错误**: 检查配置中的API密钥是否正确
3. **网络连接问题**: 确保能够访问 `http://localhost:8787`
4. **模板渲染失败**: 检查服务器日志获取详细错误信息

## 扩展测试

要添加新的测试内容或模板：

1. 修改测试脚本中的 `testContent` 变量
2. 在 `templates` 数组中添加新的模板配置
3. 更新相应的测试逻辑

## 注意事项

- 测试脚本会生成实际的内容，请注意清理测试数据
- 确保测试环境与生产环境隔离
- 定期更新测试内容以保持测试的有效性

# 模板管理器测试
node test/test_templates.js

# 自动化测试
node test/test_automation.js

# 后端API测试
node test/test_templates_backend.cjs

# 浏览器测试
open http://localhost:8787/test_browser.html