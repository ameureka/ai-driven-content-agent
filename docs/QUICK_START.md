# 快速启动指南

本项目提供了便捷的快速启动脚本，帮助您快速上传静态文件到 Cloudflare R2 并启动开发服务器。

## 🚀 使用方法

### macOS/Linux 用户

在项目根目录下运行：

```bash
./quick-start.sh
```

### Windows 用户

在项目根目录下双击运行 `quick-start.bat` 或在命令提示符中运行：

```cmd
quick-start.bat
```

## 📋 脚本功能

### 1. 环境检查
- 检查 `wrangler` 命令是否已安装
- 验证 `public` 目录是否存在
- 确认必要文件（`index.html`, `styles.css`, `script.js`）是否存在

### 2. 文件上传（可选）
脚本会询问是否要上传文件到 Cloudflare R2，如果选择是，将执行以下命令：

```bash
# 上传 HTML 文件到远程存储桶
wrangler r2 object put ai-driven-content-agent-assets-dev/index.html --file ./public/index.html --remote

# 上传 CSS 文件到远程存储桶
wrangler r2 object put ai-driven-content-agent-assets-dev/styles.css --file ./public/styles.css --remote

# 上传 JS 文件到远程存储桶
wrangler r2 object put ai-driven-content-agent-assets-dev/script.js --file ./public/script.js --remote
```

### 3. 启动开发服务器
脚本提供多种启动方式供选择：

1. **npm run dev**（推荐）- 使用 package.json 中定义的开发脚本
2. **npm start** - 使用标准启动脚本
3. **wrangler dev** - 直接使用 Wrangler 开发服务器
4. **跳过启动** - 仅执行文件上传，不启动服务器

## ⚙️ 前置要求

### 必需工具
- **Node.js** (版本 16 或更高)
- **npm** 或 **yarn**
- **wrangler CLI** - Cloudflare 的命令行工具

### 安装 Wrangler

```bash
npm install -g wrangler
```

### Cloudflare 认证

确保您已经通过以下方式之一完成 Cloudflare 认证：

```bash
# 方式1: 使用 API Token
wrangler auth login

# 方式2: 设置环境变量
export CLOUDFLARE_API_TOKEN="your-api-token"
```

## 📁 项目结构

脚本期望以下文件结构：

```
ai_driven_content_agent/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── quick-start.sh      # macOS/Linux 脚本
├── quick-start.bat     # Windows 脚本
└── package.json
```

## 🔧 故障排除

### 常见问题

1. **"未找到 wrangler 命令"**
   - 确保已安装 wrangler: `npm install -g wrangler`
   - 检查 PATH 环境变量是否包含 npm 全局包路径

2. **"未找到 public 目录"**
   - 确保在项目根目录下运行脚本
   - 检查 `public` 目录是否存在

3. **"文件不存在"**
   - 确保 `public` 目录下包含所有必需文件
   - 检查文件名是否正确

4. **上传失败**
   - 检查 Cloudflare 认证是否正确
   - 确认 R2 存储桶名称是否正确
   - 检查网络连接

### 手动执行命令

如果脚本遇到问题，您也可以手动执行以下命令：

```bash
# 检查 wrangler 状态
wrangler whoami

# 手动上传文件
wrangler r2 object put ai-driven-content-agent-assets-dev/index.html --file ./public/index.html --remote
wrangler r2 object put ai-driven-content-agent-assets-dev/styles.css --file ./public/styles.css --remote
wrangler r2 object put ai-driven-content-agent-assets-dev/script.js --file ./public/script.js --remote

# 启动开发服务器
npm run dev
```

## 📝 注意事项

- **远程标志**: 所有上传命令都包含 `--remote` 标志，确保文件上传到真正的 Cloudflare R2 存储桶，而不是本地模拟环境
- **存储桶名称**: 脚本中使用的存储桶名称是 `ai-driven-content-agent-assets-dev`，请根据您的实际配置进行调整
- **文件覆盖**: 重复上传会覆盖现有文件
- **权限**: macOS/Linux 用户需要确保脚本有执行权限（`chmod +x quick-start.sh`）

## 🎯 下一步

脚本执行完成后：

1. 刷新 Cloudflare 控制台中的 R2 存储桶页面，确认文件已上传
2. 访问开发服务器地址（通常是 `http://localhost:8787` 或类似）
3. 开始开发和测试您的应用

---

如有任何问题，请查看项目文档或联系开发团队。