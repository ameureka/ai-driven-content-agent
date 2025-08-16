// 异步任务API路由 - 绕过Cloudflare 30秒限制

export class AsyncTaskRouter {
    constructor() {
        this.routes = new Map();
        this.setupRoutes();
    }
    
    setupRoutes() {
        // 创建异步任务
        this.routes.set('POST:/api/v1/workflows/:workflowId/execute-async', this.createAsyncTask.bind(this));
        // 查询任务状态
        this.routes.set('GET:/api/v1/tasks/:taskId/status', this.getTaskStatus.bind(this));
        // 获取任务结果
        this.routes.set('GET:/api/v1/tasks/:taskId/result', this.getTaskResult.bind(this));
    }
    
    /**
     * 创建异步任务 - 立即返回任务ID
     */
    async createAsyncTask(request, env, params) {
        const { workflowId } = params;
        const taskId = crypto.randomUUID();
        const requestData = await request.json();
        
        // 立即保存任务到KV
        const task = {
            id: taskId,
            workflowId,
            inputs: requestData.inputs,
            status: 'pending',
            createdAt: new Date().toISOString(),
            estimatedDuration: 60 // 秒
        };
        
        await env.MARKDOWN_KV.put(`task:${taskId}`, JSON.stringify(task));
        
        // 使用 Service Worker 的 waitUntil 在后台处理
        // 注意：这需要在 fetch 事件处理器中调用
        request.ctx?.waitUntil(this.processTaskInBackground(taskId, workflowId, requestData, env));
        
        // 立即返回响应
        return new Response(JSON.stringify({
            success: true,
            message: '任务已创建',
            data: {
                taskId,
                status: 'pending',
                statusUrl: `/api/v1/tasks/${taskId}/status`,
                resultUrl: `/api/v1/tasks/${taskId}/result`,
                estimatedDuration: 60
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    /**
     * 获取任务状态
     */
    async getTaskStatus(request, env, params) {
        const { taskId } = params;
        const task = await env.MARKDOWN_KV.get(`task:${taskId}`, 'json');
        
        if (!task) {
            return new Response(JSON.stringify({
                success: false,
                error: '任务不存在'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 计算进度
        let progress = 0;
        if (task.status === 'processing') {
            const elapsed = Date.now() - new Date(task.startedAt).getTime();
            progress = Math.min(90, Math.floor((elapsed / (task.estimatedDuration * 1000)) * 100));
        } else if (task.status === 'completed') {
            progress = 100;
        }
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                taskId: task.id,
                status: task.status,
                progress,
                message: this.getStatusMessage(task.status),
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    /**
     * 获取任务结果
     */
    async getTaskResult(request, env, params) {
        const { taskId } = params;
        const task = await env.MARKDOWN_KV.get(`task:${taskId}`, 'json');
        
        if (!task) {
            return new Response(JSON.stringify({
                success: false,
                error: '任务不存在'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (task.status !== 'completed') {
            return new Response(JSON.stringify({
                success: false,
                error: `任务尚未完成，当前状态: ${task.status}`,
                status: task.status,
                statusUrl: `/api/v1/tasks/${taskId}/status`
            }), {
                status: 202, // Accepted but not complete
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                taskId: task.id,
                workflowId: task.workflowId,
                result: task.result,
                completedAt: task.completedAt,
                duration: task.duration
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    /**
     * 后台处理任务
     */
    async processTaskInBackground(taskId, workflowId, requestData, env) {
        const startTime = Date.now();
        
        try {
            // 更新状态为处理中
            await this.updateTaskStatus(taskId, env, {
                status: 'processing',
                startedAt: new Date().toISOString()
            });
            
            // 根据工作流类型调用不同的处理函数
            let result;
            if (workflowId === 'dify-general') {
                // URL内容生成
                const apiKey = env.DIFY_API_KEY;
                result = await this.callDifyWithRetry(
                    requestData.inputs.url,
                    apiKey,
                    3, // 最多重试3次
                    20000 // 每次20秒超时
                );
            } else if (workflowId === 'dify-article') {
                // 文章生成
                const apiKey = env.DIFY_ARTICLE_API_KEY;
                result = await this.callDifyArticleWithRetry(
                    requestData.inputs,
                    apiKey,
                    3,
                    20000
                );
            } else {
                throw new Error(`未知的工作流: ${workflowId}`);
            }
            
            // 更新为完成状态
            await this.updateTaskStatus(taskId, env, {
                status: 'completed',
                result: result,
                completedAt: new Date().toISOString(),
                duration: Math.round((Date.now() - startTime) / 1000)
            });
            
        } catch (error) {
            // 更新为失败状态
            await this.updateTaskStatus(taskId, env, {
                status: 'failed',
                error: error.message,
                failedAt: new Date().toISOString(),
                duration: Math.round((Date.now() - startTime) / 1000)
            });
        }
    }
    
    /**
     * 更新任务状态
     */
    async updateTaskStatus(taskId, env, updates) {
        const task = await env.MARKDOWN_KV.get(`task:${taskId}`, 'json');
        if (!task) return;
        
        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await env.MARKDOWN_KV.put(
            `task:${taskId}`,
            JSON.stringify(updatedTask),
            {
                expirationTtl: 7200 // 2小时后过期
            }
        );
    }
    
    /**
     * 带重试的Dify调用
     */
    async callDifyWithRetry(url, apiKey, maxRetries, timeout) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                const response = await fetch('https://api.dify.ai/v1/workflows/run', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        inputs: { url },
                        response_mode: 'blocking',
                        user: 'async-worker'
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const data = await response.json();
                    return data;
                }
                
                throw new Error(`Dify API error: ${response.status}`);
                
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(r => setTimeout(r, 2000 * (i + 1))); // 指数退避
            }
        }
    }
    
    /**
     * 带重试的Dify文章生成调用
     */
    async callDifyArticleWithRetry(inputs, apiKey, maxRetries, timeout) {
        // 类似的实现，调用文章生成API
        // ...
    }
    
    getStatusMessage(status) {
        const messages = {
            'pending': '任务已创建，等待处理',
            'processing': '正在处理中，请稍候',
            'completed': '任务已完成',
            'failed': '任务处理失败'
        };
        return messages[status] || '未知状态';
    }
}

export default AsyncTaskRouter;