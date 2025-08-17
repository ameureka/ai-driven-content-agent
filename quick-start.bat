@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 AI驱动内容代理 - 快速启动脚本 (Windows)
echo ======================================

REM 检查是否安装了wrangler
where wrangler >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 wrangler 命令
    echo 请先安装 wrangler: npm install -g wrangler
    pause
    exit /b 1
)

REM 检查是否存在public目录
if not exist "./public" (
    echo ❌ 错误: 未找到 public 目录
    echo 请确保在项目根目录下运行此脚本
    pause
    exit /b 1
)

echo 📁 检查文件存在性...

REM 检查必要文件是否存在
if not exist "./public/index.html" (
    echo ❌ 错误: 文件 ./public/index.html 不存在
    pause
    exit /b 1
)

if not exist "./public/styles.css" (
    echo ❌ 错误: 文件 ./public/styles.css 不存在
    pause
    exit /b 1
)

if not exist "./public/script.js" (
    echo ❌ 错误: 文件 ./public/script.js 不存在
    pause
    exit /b 1
)

echo ✅ 所有文件检查通过
echo.

REM 询问用户是否要上传文件到R2
set /p upload_choice="📤 是否要上传文件到 Cloudflare R2? (y/n): "

if /i "!upload_choice!"=="y" (
    echo 📤 开始上传文件到 Cloudflare R2...
    echo.
    
    echo 📄 上传 index.html...
    wrangler r2 object put ai-driven-content-agent-assets-dev/index.html --file ./public/index.html --remote
    if !errorlevel! equ 0 (
        echo ✅ index.html 上传成功
    ) else (
        echo ❌ index.html 上传失败
    )
    
    echo 🎨 上传 styles.css...
    wrangler r2 object put ai-driven-content-agent-assets-dev/styles.css --file ./public/styles.css --remote
    if !errorlevel! equ 0 (
        echo ✅ styles.css 上传成功
    ) else (
        echo ❌ styles.css 上传失败
    )
    
    echo ⚡ 上传 script.js...
    wrangler r2 object put ai-driven-content-agent-assets-dev/script.js --file ./public/script.js --remote
    if !errorlevel! equ 0 (
        echo ✅ script.js 上传成功
    ) else (
        echo ❌ script.js 上传失败
    )
    
    echo.
    echo 🎉 文件上传完成！
    echo 💡 提示: 请刷新您在浏览器中的 R2 存储桶页面查看文件
    echo.
) else (
    echo ⏭️  跳过文件上传
    echo.
)

REM 询问用户启动方式
echo 🚀 选择启动方式:
echo 1^) npm run dev ^(推荐^)
echo 2^) npm start
echo 3^) wrangler dev
echo 4^) 跳过启动
set /p start_choice="请选择 (1-4): "

if "!start_choice!"=="1" (
    echo 🚀 使用 npm run dev 启动开发服务器...
    npm run dev
) else if "!start_choice!"=="2" (
    echo 🚀 使用 npm start 启动服务器...
    npm start
) else if "!start_choice!"=="3" (
    echo 🚀 使用 wrangler dev 启动开发服务器...
    wrangler dev
) else if "!start_choice!"=="4" (
    echo ⏭️  跳过启动
) else (
    echo ❌ 无效选择，跳过启动
)

echo.
echo ✨ 快速启动脚本执行完成！
echo 📖 如需帮助，请查看项目文档
pause