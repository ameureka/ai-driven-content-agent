#!/bin/bash

# 上传静态文件到R2存储桶
echo "🚀 开始上传静态文件到R2存储桶..."

BUCKET_NAME="ai-driven-content-agent-assets"
PUBLIC_DIR="./public"

# 检查public目录是否存在
if [ ! -d "$PUBLIC_DIR" ]; then
    echo "❌ 错误: public目录不存在"
    exit 1
fi

# 上传每个文件
for file in "$PUBLIC_DIR"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "📁 上传文件: $filename"
        
        # 根据文件类型设置Content-Type
        case "$filename" in
            *.html) content_type="text/html" ;;
            *.css)  content_type="text/css" ;;
            *.js)   content_type="application/javascript" ;;
            *.png)  content_type="image/png" ;;
            *.jpg|*.jpeg) content_type="image/jpeg" ;;
            *.gif)  content_type="image/gif" ;;
            *.svg)  content_type="image/svg+xml" ;;
            *)      content_type="application/octet-stream" ;;
        esac
        
        npx wrangler@latest r2 object put "$BUCKET_NAME/$filename" --remote --file "$file" --content-type "$content_type"
        
        if [ $? -eq 0 ]; then
            echo "✅ 成功上传: $filename"
        else
            echo "❌ 上传失败: $filename"
        fi
    fi
done

echo "🎉 静态文件上传完成！"
echo "📍 R2存储桶: $BUCKET_NAME"