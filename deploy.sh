#!/bin/bash

# 部署脚本 - 上传静态资源并部署Worker

echo "=== AI驱动内容代理部署脚本 ==="
echo "----------------------------------------"

# 1. 上传前端资源到生产环境
echo "正在上传静态资源到生产环境..."
wrangler r2 object put ai-driven-content-agent-assets/index.html --file ./public/index.html --content-type "text/html"
wrangler r2 object put ai-driven-content-agent-assets/styles.css --file ./public/styles.css --content-type "text/css"
wrangler r2 object put ai-driven-content-agent-assets/script.js --file ./public/script.js --content-type "application/javascript"

echo "----------------------------------------"

# 2. 上传前端资源到开发环境
echo "正在上传静态资源到开发环境..."
wrangler r2 object put ai-driven-content-agent-assets-dev/index.html --file ./public/index.html --content-type "text/html"
wrangler r2 object put ai-driven-content-agent-assets-dev/styles.css --file ./public/styles.css --content-type "text/css"
wrangler r2 object put ai-driven-content-agent-assets-dev/script.js --file ./public/script.js --content-type "application/javascript"

echo "----------------------------------------"

# 3. 部署Worker
echo "正在部署Worker..."
wrangler deploy

echo "----------------------------------------"
echo "✅ 部署完成！"
echo "访问您的Worker URL，AI驱动内容代理已启动。"
