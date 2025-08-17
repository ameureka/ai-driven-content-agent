#!/bin/bash

# AI驱动内容代理 - 快速启动脚本
# 此脚本用于快速上传静态文件到Cloudflare R2并启动开发服务器

echo "🚀 AI驱动内容代理 - 快速启动脚本"
echo "======================================"

# 检查是否安装了wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 错误: 未找到 wrangler 命令"
    echo "请先安装 wrangler: npm install -g wrangler"
    exit 1
fi

# 检查是否存在public目录
if [ ! -d "./public" ]; then
    echo "❌ 错误: 未找到 public 目录"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

echo "📁 检查文件存在性..."

# 检查必要文件是否存在
files=("./public/index.html" "./public/styles.css" "./public/script.js")
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 错误: 文件 $file 不存在"
        exit 1
    fi
done

echo "✅ 所有文件检查通过"
echo ""

# 询问用户是否要上传文件到R2
read -p "📤 是否要上传文件到 Cloudflare R2? (y/n): " upload_choice

if [[ $upload_choice =~ ^[Yy]$ ]]; then
    echo "📤 开始上传文件到 Cloudflare R2..."
    echo ""
    
    # 上传HTML文件
    echo "📄 上传 index.html..."
    wrangler r2 object put ai-driven-content-agent-assets-dev/index.html --file ./public/index.html --remote
    
    if [ $? -eq 0 ]; then
        echo "✅ index.html 上传成功"
    else
        echo "❌ index.html 上传失败"
    fi
    
    # 上传CSS文件
    echo "🎨 上传 styles.css..."
    wrangler r2 object put ai-driven-content-agent-assets-dev/styles.css --file ./public/styles.css --remote
    
    if [ $? -eq 0 ]; then
        echo "✅ styles.css 上传成功"
    else
        echo "❌ styles.css 上传失败"
    fi
    
    # 上传JS文件
    echo "⚡ 上传 script.js..."
    wrangler r2 object put ai-driven-content-agent-assets-dev/script.js --file ./public/script.js --remote
    
    if [ $? -eq 0 ]; then
        echo "✅ script.js 上传成功"
    else
        echo "❌ script.js 上传失败"
    fi
    
    echo ""
    echo "🎉 文件上传完成！"
    echo "💡 提示: 请刷新您在浏览器中的 R2 存储桶页面查看文件"
    echo ""
else
    echo "⏭️  跳过文件上传"
    echo ""
fi

# 询问用户启动方式
echo "🚀 选择启动方式:"
echo "1) npm run dev (推荐)"
echo "2) npm start"
echo "3) wrangler dev"
echo "4) 跳过启动"
read -p "请选择 (1-4): " start_choice

case $start_choice in
    1)
        echo "🚀 使用 npm run dev 启动开发服务器..."
        npm run dev
        ;;
    2)
        echo "🚀 使用 npm start 启动服务器..."
        npm start
        ;;
    3)
        echo "🚀 使用 wrangler dev 启动开发服务器..."
        wrangler dev
        ;;
    4)
        echo "⏭️  跳过启动"
        ;;
    *)
        echo "❌ 无效选择，跳过启动"
        ;;
esac

echo ""
echo "✨ 快速启动脚本执行完成！"
echo "📖 如需帮助，请查看项目文档"