// Cloudflare Workers 限制绕过方案

/**
 * 方案1: 异步任务队列模式
 * 将长时间运行的任务转换为异步处理
 */
export async function createAsyncTask(request, env) {
    // 1. 创建任务ID
    const taskId = crypto.randomUUID();
    
    // 2. 立即返回任务ID
    const response = {
        success: true,
        message: '任务已创建，请使用任务ID查询状态',
        data: {
            taskId,
            status: 'pending',
            checkUrl: `/api/v1/tasks/${taskId}/status`,
            estimatedTime: '30-60秒'
        }
    };
    
    // 3. 在后台处理任务（使用 waitUntil）
    const ctx = {
        waitUntil: async (promise) => {
            // 这允许Worker立即返回响应，同时继续处理
            await promise;
        }
    };
    
    ctx.waitUntil(processInBackground(taskId, request, env));
    
    return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * 方案2: 使用 Service Bindings 分散负载
 */
export async function distributeWorkload(request, env) {
    // 将工作分解为多个小任务
    const subtasks = splitIntoSubtasks(request);
    
    // 并行处理
    const results = await Promise.all(
        subtasks.map(task => processSubtask(task, env))
    );
    
    // 合并结果
    return combineResults(results);
}

/**
 * 方案3: 使用外部服务处理
 */
export async function useExternalService(request, env) {
    // 1. 将任务发送到外部服务（如 AWS Lambda, Google Cloud Functions）
    const externalResponse = await fetch('https://your-external-service.com/process', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.EXTERNAL_SERVICE_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    
    // 2. 立即返回结果或轮询URL
    return externalResponse;
}

/**
 * 方案4: 改进的流式响应
 */
export async function improvedStreaming(request, env) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    
    // 设置响应头
    const response = new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // 禁用Nginx缓冲
            'Access-Control-Allow-Origin': '*'
        }
    });
    
    // 异步处理
    (async () => {
        try {
            // 定期发送心跳包保持连接
            const heartbeatInterval = setInterval(async () => {
                await writer.write(encoder.encode('event: heartbeat\ndata: {"status":"processing"}\n\n'));
            }, 5000);
            
            // 调用Dify API
            const result = await callDifyWithTimeout(request, env, 25000); // 25秒超时
            
            clearInterval(heartbeatInterval);
            
            // 发送结果
            await writer.write(encoder.encode(`event: complete\ndata: ${JSON.stringify(result)}\n\n`));
            await writer.write(encoder.encode('event: close\ndata: [DONE]\n\n'));
        } catch (error) {
            await writer.write(encoder.encode(`event: error\ndata: ${JSON.stringify({error: error.message})}\n\n`));
        } finally {
            await writer.close();
        }
    })();
    
    return response;
}

/**
 * 方案5: 使用 KV 存储缓存结果
 */
export async function cacheStrategy(request, env) {
    // 生成请求的唯一键
    const cacheKey = await generateCacheKey(request);
    
    // 检查缓存
    const cached = await env.MARKDOWN_KV.get(cacheKey, 'json');
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1小时缓存
        return {
            success: true,
            data: cached.data,
            fromCache: true
        };
    }
    
    // 处理请求
    const result = await processRequest(request, env);
    
    // 存储到缓存
    await env.MARKDOWN_KV.put(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now()
    }), {
        expirationTtl: 3600 // 1小时过期
    });
    
    return {
        success: true,
        data: result,
        fromCache: false
    };
}

// 辅助函数
async function processInBackground(taskId, request, env) {
    try {
        // 存储任务状态
        await env.MARKDOWN_KV.put(`task:${taskId}`, JSON.stringify({
            status: 'processing',
            startedAt: new Date().toISOString()
        }));
        
        // 执行实际工作
        const result = await callDifyWorkflow(request, env);
        
        // 更新任务状态
        await env.MARKDOWN_KV.put(`task:${taskId}`, JSON.stringify({
            status: 'completed',
            result: result,
            completedAt: new Date().toISOString()
        }), {
            expirationTtl: 3600 // 1小时后过期
        });
    } catch (error) {
        await env.MARKDOWN_KV.put(`task:${taskId}`, JSON.stringify({
            status: 'failed',
            error: error.message,
            failedAt: new Date().toISOString()
        }));
    }
}

async function generateCacheKey(request) {
    const text = JSON.stringify(request);
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function callDifyWithTimeout(request, env, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch('https://api.dify.ai/v1/workflows/run', {
            signal: controller.signal,
            // ... 其他配置
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('请求超时，请尝试使用异步模式');
        }
        throw error;
    }
}