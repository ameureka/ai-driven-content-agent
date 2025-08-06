import { marked } from 'marked';
import { TemplateManager } from './services/templateManager.js';
import { callDifyWorkflow } from './api/dify.js';
import { callDifyArticleWorkflow } from './api/difyArticle.js';

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
        const method = request.method;

        // CORS头设置
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Template, X-Title'
        };

        // 处理OPTIONS请求（预检请求）
        if (method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders,
                status: 204
            });
        }

        try {
            // 路由处理
            // 0. 处理favicon请求
            if (path === '/favicon.ico') {
                return new Response(null, { status: 204 });
            }
            
            // 1. 状态检查 API
            if (path === '/status' && method === 'GET') {
                return new Response(JSON.stringify({
                    status: 'ok',
                    message: 'Worker 运行正常',
                    templates: TemplateManager.getAvailableTemplates()
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    status: 200,
                });
            }

            // 2. 获取模板列表
            if (path === '/templates' && method === 'GET') {
                return new Response(JSON.stringify({
                    success: true,
                    templates: TemplateManager.getAvailableTemplates()
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    status: 200,
                });
            }

            // 3. Markdown 上传 API
            if (path === '/upload' && method === 'POST') {
                // 验证 API 密钥
                const apiKey = request.headers.get('X-API-Key');
                
                if (!apiKey) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '未提供 API 密钥。请在请求头中包含 X-API-Key。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 401,
                    });
                }
                
                if (apiKey !== env.API_KEY) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: 'API 密钥无效。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 403,
                    });
                }

                // 处理上传的内容
                let content = '';
                let template = 'general'; // 默认模板
                let title = ''; // 默认标题
                
                const contentType = request.headers.get('Content-Type') || '';
                
                if (contentType.includes('application/json')) {
                    // JSON格式上传
                    const jsonData = await request.json();
                    content = jsonData.content || '';
                    template = jsonData.template || template;
                    title = jsonData.title || '';
                } else {
                    // 纯文本格式上传
                    content = await request.text();
                    // 从请求头获取模板和标题
                    const headerTemplate = request.headers.get('X-Template');
                    const headerTitle = request.headers.get('X-Title');
                    if (headerTemplate) template = headerTemplate;
                    if (headerTitle) title = headerTitle;
                }
                
                // 检查内容是否为空
                if (!content.trim()) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: 'Markdown 内容不能为空。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 400,
                    });
                }

                // 检查模板是否有效
                if (!TemplateManager.isValidTemplate(template)) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: `模板 "${template}" 不存在。可用模板: ${TemplateManager.getAvailableTemplates().map(t => t.name).join(', ')}`
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 400,
                    });
                }

                // 内容验证 - 添加内容大小限制检查
                const contentSizeInBytes = new TextEncoder().encode(content).length;
                const MAX_CONTENT_SIZE = 25 * 1024 * 1024; // 25MB
                
                if (contentSizeInBytes > MAX_CONTENT_SIZE) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: `内容大小超过限制，最大允许25MB，当前大小约 ${(contentSizeInBytes / 1024 / 1024).toFixed(2)}MB。`
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 413, // Payload Too Large
                    });
                }

                // 生成唯一ID并保存内容
                const id = generateRandomId();
                
                // 保存到KV存储
                await env.MARKDOWN_KV.put(id, JSON.stringify({
                    content,
                    template,
                    title,
                    createdAt: new Date().toISOString()
                }));
                
                // 返回成功响应
                const viewUrl = `${url.origin}/view/${id}`;
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Markdown 上传成功。',
                    id,
                    url: viewUrl,
                    template
                }), {
                    headers: { 
                        'Content-Type': 'application/json',
                        ...corsHeaders 
                    },
                    status: 201,
                });
            }

            // 4. 查看渲染后的内容
            if (path.startsWith('/view/') && method === 'GET') {
                const id = path.replace('/view/', '');
                
                // 从KV存储获取内容
                const storedItem = await env.MARKDOWN_KV.get(id);
                
                if (!storedItem) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '未找到内容。可能指定了无效的ID，或者内容已被删除。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 404,
                    });
                }

                const parsedItem = JSON.parse(storedItem);
                const markdownContent = parsedItem.content;
                
                // 将Markdown转换为HTML
                const htmlContent = marked(markdownContent);

                // 获取查询参数，允许覆盖模板和标题
                const queryParams = url.searchParams;
                const templateOverride = queryParams.get('template');
                const titleOverride = queryParams.get('title');
                
                // 确定要使用的模板和标题
                const templateName = templateOverride || parsedItem.template || 'general';
                const titleToUse = titleOverride || parsedItem.title || '';
                
                // 使用模板渲染HTML
                try {
                    const finalHtml = TemplateManager.render(templateName, titleToUse, htmlContent);
                    
                    // 检查Accept头，决定返回HTML还是JSON
                    const acceptHeader = request.headers.get('Accept') || '';
                    const wantsJson = acceptHeader.includes('application/json');
                    
                    if (wantsJson) {
                        // 返回JSON格式的内容
                        return new Response(JSON.stringify({
                            success: true,
                            id,
                            template: templateName,
                            title: titleToUse,
                            html: finalHtml
                        }), {
                            headers: { 
                                'Content-Type': 'application/json',
                                ...corsHeaders
                            },
                            status: 200,
                        });
                    } else {
                        // 返回HTML内容，供浏览器直接渲染
                        return new Response(finalHtml, {
                            headers: { 
                                'Content-Type': 'text/html;charset=UTF-8',
                                ...corsHeaders
                            },
                            status: 200,
                        });
                    }
                } catch (error) {
                    console.error('渲染模板时出错:', error);
                    return new Response(JSON.stringify({
                        success: false,
                        message: `渲染内容时出错: ${error.message}`
                    }), { 
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 500,
                    });
                }
            }

            // 5. 静态文件处理
            if (path === '/' || path === '/index.html') {
                const indexHtml = await env.ASSETS.get('index.html');
                if (indexHtml) {
                    const content = await indexHtml.text();
                    return new Response(content, {
                        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
                        status: 200,
                    });
                }
            }
            
            if (path === '/styles.css') {
                const css = await env.ASSETS.get('styles.css');
                if (css) {
                    const content = await css.text();
                    return new Response(content, {
                        headers: { 'Content-Type': 'text/css;charset=UTF-8' },
                        status: 200,
                    });
                }
            }
            
            if (path === '/script.js') {
                const js = await env.ASSETS.get('script.js');
                if (js) {
                    const content = await js.text();
                    return new Response(content, {
                        headers: { 'Content-Type': 'application/javascript;charset=UTF-8' },
                        status: 200,
                    });
                }
            }
            
            // 添加处理测试页面的路由
            if (path === '/test-article.html') {
                console.log('尝试获取 test-article.html');
                try {
                    const testHtml = await env.ASSETS.get('test-article.html');
                    console.log('获取结果:', testHtml ? '找到文件' : '文件不存在');
                    
                    if (testHtml) {
                        const content = await testHtml.text();
                        return new Response(content, {
                            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
                            status: 200,
                        });
                    } else {
                        // 明确的错误处理
                        return new Response('未找到test-article.html文件', {
                            status: 404,
                            headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
                        });
                    }
                } catch (error) {
                    console.error('获取test-article.html时出错:', error);
                    return new Response(`获取test-article.html时出错: ${error.message}`, {
                        status: 500,
                        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
                    });
                }
            }

            // 处理Dify原始工作流调用
            if (path === '/api/dify/generate' && request.method === 'POST') {
                try {
                    const { url } = await request.json();
                    
                    // 强制从环境变量获取原始工作流的API Key
                    const apiKey = env.DIFY_API_KEY;

                    if (!apiKey) {
                        console.error('服务器错误: 环境变量 DIFY_API_KEY 未设置');
                        return new Response(JSON.stringify({
                            success: false,
                            message: '服务器配置错误，无法处理请求' // 不暴露密钥问题给前端
                        }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            }
                        });
                    }
                    
                    if (!url) {
                        return new Response(JSON.stringify({
                            success: false,
                            message: '请求体中缺少url字段'
                        }), {
                            status: 400,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            }
                        }); 
                    }

                    console.log(`处理URL生成请求: ${url}, 使用 DIFY_API_KEY`);
                    const result = await callDifyWorkflow(url, apiKey);
                    
                    return new Response(JSON.stringify({
                        success: true,
                        content: result.answer
                    }), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: error.message
                    }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            }

            // 处理Dify文章生成工作流调用（流式响应）
            if (path === '/api/dify/generateArticle' && request.method === 'GET') {
                const url = new URL(request.url);
                const apiKey = env.DIFY_ARTICLE_API_KEY || url.searchParams.get('apiKey');
                const title = url.searchParams.get('title');
                const style = url.searchParams.get('style') || '';
                const context = url.searchParams.get('context') || '';
                
                console.log('接收文章生成请求:', title, style ? `风格: ${style}` : '');
                
                if (!apiKey) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '未提供API密钥'
                    }), {
                        status: 401,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                if (!title) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '请提供文章标题'
                    }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                try {
                    // 创建一个TransformStream来处理流式响应
                    const { readable, writable } = new TransformStream();
                    const writer = writable.getWriter();
                    
                    // 定义事件发送函数
                    const sendEvent = (data) => {
                        writer.write(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                    };
                    
                    // 定义回调函数
                    const callbacks = {
                        onStart: () => {
                            sendEvent({ status: '正在开始生成...' });
                        },
                        onProgress: (status, data) => {
                            // 检查data是否存在并且有content属性
                            if (data && data.content) {
                                sendEvent({ 
                                    status: status, 
                                    content: data.content,
                                    result: data.content  // 同时通过result字段发送
                                });
                            } else if (data && data.result) {  // 新增：处理result字段
                                sendEvent({ 
                                    status: status, 
                                    content: data.result,
                                    result: data.result
                                });
                            } else {
                                // 如果没有content或result，只发送status
                                sendEvent({ status: status });
                            }
                        },
                        onComplete: (result) => {
                            sendEvent({ 
                                status: '生成完成', 
                                content: result,
                                result: result,  // 同时通过result字段发送
                                done: true
                            });
                            sendEvent('[DONE]');
                            writer.close();
                        },
                        onError: (error) => {
                            sendEvent({ 
                                error: error.message || '生成过程中发生错误'
                            });
                            sendEvent('[DONE]');
                            writer.close();
                        }
                    };
                    
                    // 准备输入参数
                    const inputs = {
                        prompt: title,
                        style: style,
                        context: context || `生成关于${title}的高质量文章内容`
                    };
                    
                    // 异步调用Dify文章生成API
                    callDifyArticleWorkflow(inputs, apiKey, callbacks).catch(error => {
                        console.error('调用文章生成工作流时出错:', error);
                        // 错误会被onError回调处理
                    });
                    
                    // 返回SSE响应
                    return new Response(readable, {
                        headers: {
                            'Content-Type': 'text/event-stream',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                    
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: error.message
                    }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            }

            // 6. 处理404
            return new Response(JSON.stringify({
                success: false,
                message: '未找到请求的资源。'
            }), { 
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders 
                },
                status: 404,
            });
        } catch (error) {
            // 错误处理
            console.error('处理请求时发生错误:', error);
            return new Response(JSON.stringify({
                success: false,
                message: `服务器错误: ${error.message}`,
                error: {
                    type: error.name,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }
            }), {
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders 
                },
                status: 500,
            });
        }
    },
};