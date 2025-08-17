import { marked } from 'marked';
import { TemplateManager } from './services/templateManager.js';
import { callDifyWorkflow } from './api/dify.js';
import { callDifyArticleWorkflow } from './api/difyArticle.js';
import { ApiRouter } from './api/routes.js';

// 配置 marked 选项
marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
  smartypants: true
});

// 模板定义已移至独立文件，通过TemplateManager管理
// 随机ID生成，用于为上传的 Markdown 文档分配唯一标识符
function generateRandomId(length = 16) {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 主要的 Worker 处理函数
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // 初始化API路由器
        const apiRouter = new ApiRouter();

        try {
            // 检查是否是新版API路径
            if (path.startsWith('/api/v1/')) {
                return await apiRouter.handleRequest(request, env);
            }

            // 处理 /wiki 路径，返回API文档页面
            if (path === '/wiki') {
                // 优先使用本地开发资源绑定
                if (env.LOCAL_ASSETS && typeof env.LOCAL_ASSETS.fetch === 'function') {
                    const wikiRequest = new Request(new URL('/wiki.html', request.url));
                    return env.LOCAL_ASSETS.fetch(wikiRequest);
                } else if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
                    const wikiRequest = new Request(new URL('/wiki.html', request.url));
                    return env.ASSETS.fetch(wikiRequest);
                } else {
                    // 如果静态资源绑定不可用，返回简化的API文档页面
                    return new Response(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API文档 - AI驱动内容代理</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .api-section { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }
        .endpoint { font-family: monospace; background: #e9ecef; padding: 5px 10px; border-radius: 3px; }
        .status { color: #28a745; font-weight: bold; }
        .back-link { display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← 返回首页</a>
        <h1>📚 API文档</h1>
        <p class="status">✅ 开发模式运行中</p>
        
        <div class="api-section">
            <h3>📋 可用的API端点：</h3>
            <p><span class="endpoint">GET /api/v1/status</span> - 获取服务状态</p>
            <p><span class="endpoint">GET /api/v1/templates</span> - 获取所有模板</p>
            <p><span class="endpoint">GET /api/v1/templates/{id}</span> - 获取特定模板</p>
            <p><span class="endpoint">GET /api/v1/workflows</span> - 获取所有工作流</p>
            <p><span class="endpoint">GET /api/v1/workflows/{id}</span> - 获取特定工作流</p>
            <p><span class="endpoint">POST /api/v1/workflows/{id}/execute</span> - 执行工作流</p>
            <p><span class="endpoint">POST /api/v1/content/render</span> - 渲染内容</p>
            <p><span class="endpoint">GET /api/v1/content/{id}</span> - 获取内容详情</p>
            <p><span class="endpoint">GET /api/v1/content/{id}/html</span> - 获取渲染后的HTML</p>
            <p><span class="endpoint">DELETE /api/v1/content/{id}</span> - 删除内容</p>
        </div>
        
        <div class="api-section">
            <h3>🔧 开发说明：</h3>
            <p>当前运行在本地开发模式，静态资源绑定不可用。</p>
            <p>完整的API文档请在生产环境中查看。</p>
            <p>请使用上述API端点进行测试和开发。</p>
        </div>
    </div>
</body>
</html>
                    `, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                    });
                }
            }

            // 对于所有其他请求，都视为对静态资源的请求
            // 这将处理 index.html 以及由其引用的 css, js, image 等文件
            
            // 检查 ASSETS 绑定是否存在且有 fetch 方法
            // 优先使用本地开发资源绑定
            if (env.LOCAL_ASSETS && typeof env.LOCAL_ASSETS.fetch === 'function') {
                return env.LOCAL_ASSETS.fetch(request);
            } else if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
                return env.ASSETS.fetch(request);
            } else {
                // 在本地开发环境中，如果 R2 绑定不可用，返回一个简单的 HTML 页面
                console.warn('[DEV] ASSETS binding not available, serving fallback content');
                const url = new URL(request.url);
                
                if (url.pathname === '/' || url.pathname === '/index.html') {
                    return new Response(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI驱动内容代理 - 开发模式</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .api-section { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }
        .endpoint { font-family: monospace; background: #e9ecef; padding: 5px 10px; border-radius: 3px; }
        .status { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI驱动内容代理</h1>
        <p class="status">✅ 开发模式运行中</p>
        
        <div class="api-section">
            <h3>📋 可用的API端点：</h3>
            <p><span class="endpoint">GET /api/v1/templates</span> - 获取所有模板</p>
            <p><span class="endpoint">GET /api/v1/templates/{id}</span> - 获取特定模板</p>
            <p><span class="endpoint">GET /api/v1/workflows</span> - 获取所有工作流</p>
            <p><span class="endpoint">GET /api/v1/workflows/{id}</span> - 获取特定工作流</p>
            <p><span class="endpoint">POST /api/v1/content/render</span> - 渲染内容</p>
            <p><span class="endpoint">GET /api/v1/content/result/{id}</span> - 获取渲染结果</p>
        </div>
        
        <div class="api-section">
            <h3>🔧 开发说明：</h3>
            <p>当前运行在本地开发模式，R2存储桶绑定不可用。</p>
            <p>请使用上述API端点进行测试和开发。</p>
        </div>
    </div>
</body>
</html>
                    `, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                    });
                } else {
                    // 对于其他静态资源请求，返回404
                    return new Response('File not found in development mode', { status: 404 });
                }
            }

        } catch (error) {
            // 捕获所有未处理的异常，并以标准JSON格式返回错误
            console.error(`[WORKER_ERROR] 捕获到未处理的异常: ${error.stack}`);
            return new Response(JSON.stringify({
                success: false,
                message: '服务器内部发生未知错误。',
                error: error.message
            }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            });
        }
    }
};