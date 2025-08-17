/**
 * API路由处理器 - 重构后的标准化RESTful API
 * 符合标准API设计规范，支持MCP协议集成
 */

import { marked } from 'marked';
import { TemplateManager } from '../services/templateManager.js';
import { ContentManager, ContentStatus, ContentType } from '../services/contentManager.js';
import { IndexManager, IndexType } from '../services/indexManager.js';
import { callDifyWorkflow, callDifyWorkflowStreaming } from './dify.js';
import { callDifyArticleWorkflow } from './difyArticle.js';

// API版本
const API_VERSION = 'v1';
const API_BASE_PATH = `/api/${API_VERSION}`;

// 标准响应格式
class ApiResponse {
    static success(data, message = 'Success', meta = {}) {
        return {
            success: true,
            message,
            data,
            meta: {
                timestamp: new Date().toISOString(),
                version: API_VERSION,
                ...meta
            }
        };
    }

    static error(message, code = 'UNKNOWN_ERROR', details = null, statusCode = 500) {
        return {
            success: false,
            error: {
                code,
                message,
                details,
                timestamp: new Date().toISOString()
            }
        };
    }
}

// 错误代码定义
const ERROR_CODES = {
    INVALID_API_KEY: 'INVALID_API_KEY',
    MISSING_API_KEY: 'MISSING_API_KEY',
    INVALID_INPUT: 'INVALID_INPUT',
    TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
    CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
    CONTENT_TOO_LARGE: 'CONTENT_TOO_LARGE',
    WORKFLOW_NOT_FOUND: 'WORKFLOW_NOT_FOUND',
    WORKFLOW_ERROR: 'WORKFLOW_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
};

// 工作流配置管理器
class WorkflowManager {
    constructor() {
        this.defaultWorkflows = {
            'dify-general': {
                id: 'dify-general',
                name: 'URL内容生成',
                description: '从URL生成内容（默认）',
                type: 'url',
                apiKeyEnv: 'DIFY_API_KEY',
                inputFields: ['url'],
                icon: 'ion-md-cloud-download',
                isDefault: true
            },
            'dify-article': {
                id: 'dify-article',
                name: 'AI文章生成',
                description: '基于关键词生成文章（默认）',
                type: 'text',
                apiKeyEnv: 'DIFY_ARTICLE_API_KEY',
                inputFields: ['title', 'style', 'context'],
                icon: 'ion-md-create',
                isDefault: true
            }
        };
        this.customWorkflows = new Map();
        this.loadCustomWorkflows();
    }

    loadCustomWorkflows() {
        try {
            // 这里从环境变量加载自定义工作流
            // 在实际环境中，会通过env对象传入
            console.log('WorkflowManager: 准备加载自定义工作流');
        } catch (error) {
            console.error('Failed to load custom workflows:', error);
        }
    }

    loadCustomWorkflowsFromEnv(env) {
        try {
            if (env.CUSTOM_WORKFLOWS) {
                const customWorkflowsConfig = JSON.parse(env.CUSTOM_WORKFLOWS);
                this.customWorkflows.clear();
                
                for (const [id, config] of Object.entries(customWorkflowsConfig)) {
                    this.customWorkflows.set(id, {
                        id,
                        ...config,
                        isCustom: true
                    });
                }
                console.log(`Loaded ${this.customWorkflows.size} custom workflows`);
            }
        } catch (error) {
            console.error('Failed to parse CUSTOM_WORKFLOWS:', error);
        }
    }

    getAllWorkflows(env) {
        // 首次调用时加载自定义工作流
        if (env && env.CUSTOM_WORKFLOWS) {
            this.loadCustomWorkflowsFromEnv(env);
        }

        const allWorkflows = { ...this.defaultWorkflows };
        
        // 添加自定义工作流
        for (const [id, config] of this.customWorkflows) {
            allWorkflows[id] = config;
        }
        
        return allWorkflows;
    }

    getWorkflow(workflowId, env) {
        const allWorkflows = this.getAllWorkflows(env);
        return allWorkflows[workflowId] || null;
    }

    getApiKey(workflow, env) {
        if (workflow.isCustom) {
            return workflow.apiKey;
        } else {
            return env[workflow.apiKeyEnv];
        }
    }
}

// 创建全局工作流管理器实例
const workflowManager = new WorkflowManager();

// 保持向后兼容的WORKFLOWS定义
const WORKFLOWS = {
    'dify-general': workflowManager.defaultWorkflows['dify-general'],
    'dify-article': workflowManager.defaultWorkflows['dify-article']
};

// 随机ID生成
function generateRandomId(length = 16) {
    const characters = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 输入清理函数 - 用于清理JSON字符串中的特殊字符
function sanitizeJsonString(str) {
    if (typeof str !== 'string') return str;
    
    // 转义特殊字符，防止JSON解析错误
    return str
        .replace(/\\/g, '\\\\')  // 反斜杠
        .replace(/"/g, '\\"')     // 双引号
        .replace(/\n/g, '\\n')    // 换行
        .replace(/\r/g, '\\r')    // 回车
        .replace(/\t/g, '\\t')    // 制表符
        .replace(/\f/g, '\\f')    // 换页符
        .replace(/\b/g, '\\b');   // 退格符
}

// 内容验证函数
function validateContent(content) {
    const errors = [];
    
    // 检查内容是否为空
    if (!content || (typeof content === 'string' && content.trim().length === 0)) {
        errors.push('内容不能为空');
    }
    
    // 检查内容大小（25MB限制）
    if (typeof content === 'string' && content.length > 25 * 1024 * 1024) {
        errors.push('内容超过25MB限制');
    }
    
    // 检查是否包含有效的Markdown标记（警告级别，不阻止提交）
    if (typeof content === 'string' && 
        !content.includes('#') && 
        !content.includes('*') && 
        !content.includes('_') &&
        !content.includes('[') &&
        !content.includes('`')) {
        console.warn('内容可能不是有效的Markdown格式');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// API密钥验证
function validateApiKey(request, env) {
    const apiKey = request.headers.get('X-API-Key') || request.headers.get('Authorization')?.replace('Bearer ', '');
    
    // 硬编码的测试API密钥 - 用于开发和测试阶段
    // TODO: 后续需要移除硬编码，使用环境变量或配置文件管理
    const HARDCODED_TEST_API_KEY = 'aiwenchuang';
    
    // 添加调试日志
    console.log('API Key validation:');
    console.log('- Received API Key:', apiKey ? `${apiKey.substring(0, 4)}...` : 'null');
    console.log('- Expected API Key:', env.API_KEY ? `${env.API_KEY.substring(0, 4)}...` : 'null');
    console.log('- Hardcoded Test Key:', HARDCODED_TEST_API_KEY ? `${HARDCODED_TEST_API_KEY.substring(0, 4)}...` : 'null');
    console.log('- Keys match (env):', apiKey === env.API_KEY);
    console.log('- Keys match (hardcoded):', apiKey === HARDCODED_TEST_API_KEY);
    
    if (!apiKey) {
        console.log('- Result: MISSING_API_KEY');
        return { valid: false, error: ERROR_CODES.MISSING_API_KEY, message: 'API密钥缺失' };
    }
    
    // 验证环境变量中的API密钥或硬编码的测试密钥
    if (apiKey !== env.API_KEY && apiKey !== HARDCODED_TEST_API_KEY) {
        console.log('- Result: INVALID_API_KEY');
        return { valid: false, error: ERROR_CODES.INVALID_API_KEY, message: 'API密钥无效' };
    }
    
    console.log('- Result: VALID');
    return { valid: true };
}

// CORS头设置
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization'
};

// API路由处理器
export class ApiRouter {
    constructor() {
        this.routes = new Map();
        this.setupRoutes();
    }

    setupRoutes() {
        // 1. 服务状态API
        this.addRoute('GET', `${API_BASE_PATH}/status`, this.getServiceStatus.bind(this));
        
        // 2. 模板管理API
        this.addRoute('GET', `${API_BASE_PATH}/templates`, this.getTemplates.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/templates/:templateId`, this.getTemplate.bind(this));
        
        // 3. 工作流管理API
        this.addRoute('GET', `${API_BASE_PATH}/workflows`, this.getWorkflows.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/workflows/:workflowId`, this.getWorkflow.bind(this));
        this.addRoute('POST', `${API_BASE_PATH}/workflows/:workflowId/execute`, this.executeWorkflow.bind(this));
        
        // 3a. 新增：自定义工作流管理API
        this.addRoute('GET', `${API_BASE_PATH}/workflows/available`, this.getAvailableWorkflows.bind(this));
        this.addRoute('POST', `${API_BASE_PATH}/workflows/custom`, this.addCustomWorkflow.bind(this));
        this.addRoute('DELETE', `${API_BASE_PATH}/workflows/custom/:workflowId`, this.deleteCustomWorkflow.bind(this));
        
        // 4. 内容渲染API
        this.addRoute('POST', `${API_BASE_PATH}/content/render`, this.renderContent.bind(this));
        
        // 5. 结果查看API
        // 注意：静态路由必须在动态路由之前注册
        this.addRoute('GET', `${API_BASE_PATH}/content/workflow/:executionId`, this.getContentByWorkflow.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content/search`, this.searchContent.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId/html`, this.getContentHtml.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId/url`, this.getContentUrl.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId`, this.getContent.bind(this));
        
        // 6. 内容管理API  
        this.addRoute('DELETE', `${API_BASE_PATH}/content/:contentId`, this.deleteContent.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content`, this.listContent.bind(this));
        this.addRoute('PUT', `${API_BASE_PATH}/content/:contentId`, this.updateContent.bind(this));
        
        // 7. 批量操作API
        this.addRoute('POST', `${API_BASE_PATH}/content/bulk/delete`, this.bulkDeleteContent.bind(this));
        this.addRoute('POST', `${API_BASE_PATH}/content/bulk/status`, this.bulkUpdateStatus.bind(this));
        
        // 8. 导入导出API
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId/export`, this.exportContent.bind(this));
        this.addRoute('POST', `${API_BASE_PATH}/content/import`, this.importContent.bind(this));
        
        // 9. 统计API
        this.addRoute('GET', `${API_BASE_PATH}/content/statistics`, this.getContentStatistics.bind(this));
        
        // 10. 索引管理API
        this.addRoute('GET', `${API_BASE_PATH}/index/search`, this.searchWithIndex.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/index/statistics`, this.getIndexStatistics.bind(this));
        this.addRoute('POST', `${API_BASE_PATH}/index/rebuild`, this.rebuildIndexes.bind(this));
        this.addRoute('POST', `${API_BASE_PATH}/index/optimize`, this.optimizeIndexes.bind(this));
    }

    addRoute(method, path, handler) {
        const key = `${method}:${path}`;
        this.routes.set(key, { method, path, handler });
    }

    async handleRequest(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // 处理OPTIONS请求
        if (method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders,
                status: 204
            });
        }

        try {
            // 查找匹配的路由
            const route = this.findRoute(method, path);
            if (!route) {
                return this.createErrorResponse(
                    '路由不存在',
                    'ROUTE_NOT_FOUND',
                    null,
                    404
                );
            }

            // 执行路由处理器
            const result = await route.handler(request, env, route.params);
            return result;

        } catch (error) {
            console.error('API错误:', error);
            return this.createErrorResponse(
                '内部服务器错误',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    findRoute(method, path) {
        // 首先尝试精确匹配
        const exactKey = `${method}:${path}`;
        if (this.routes.has(exactKey)) {
            return { ...this.routes.get(exactKey), params: {} };
        }

        // 然后尝试参数匹配
        for (const [key, route] of this.routes) {
            if (route.method !== method) continue;
            
            const params = this.matchPath(route.path, path);
            if (params !== null) {
                return { ...route, params };
            }
        }

        return null;
    }

    matchPath(routePath, requestPath) {
        const routeParts = routePath.split('/');
        const requestParts = requestPath.split('/');

        if (routeParts.length !== requestParts.length) {
            return null;
        }

        const params = {};
        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const requestPart = requestParts[i];

            if (routePart.startsWith(':')) {
                // 参数匹配
                const paramName = routePart.slice(1);
                params[paramName] = requestPart;
            } else if (routePart !== requestPart) {
                // 字面量不匹配
                return null;
            }
        }

        return params;
    }

    createSuccessResponse(data, message = 'Success', meta = {}, statusCode = 200) {
        return new Response(JSON.stringify(ApiResponse.success(data, message, meta)), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            status: statusCode
        });
    }

    createErrorResponse(message, code = 'UNKNOWN_ERROR', details = null, statusCode = 500) {
        return new Response(JSON.stringify(ApiResponse.error(message, code, details, statusCode)), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            },
            status: statusCode
        });
    }

    // API处理器方法

    // 1. 服务状态API
    async getServiceStatus(request, env) {
        const templates = TemplateManager.getAvailableTemplates();
        const workflows = Object.keys(WORKFLOWS);
        
        const response = this.createSuccessResponse({
            status: 'healthy',
            uptime: Date.now(),
            version: API_VERSION,
            capabilities: {
                templates: templates.length,
                workflows: workflows.length,
                features: ['content_rendering', 'ai_workflows', 'template_system']
            }
        }, '服务运行正常');
        return response;
    }

    // 2. 模板管理API
    async getTemplates(request, env) {
        const templates = TemplateManager.getAvailableTemplates();
        const templateDetails = templates.map(template => ({
            id: template.name,
            name: template.displayName,
            description: template.description,
            type: 'html'
        }));
        
        return this.createSuccessResponse(templateDetails, '获取模板列表成功');
    }

    async getTemplate(request, env, params) {
        const { templateId } = params;
        const templates = TemplateManager.getAvailableTemplates();
        const template = templates.find(t => t.name === templateId);

        if (!template) {
            return this.createErrorResponse(
                '模板不存在',
                ERROR_CODES.TEMPLATE_NOT_FOUND,
                `模板 ${templateId} 未找到`,
                404
            );
        }

        return this.createSuccessResponse({
            id: template.name,
            name: template.displayName,
            description: template.description,
            type: 'html',
            available: true
        }, '获取模板详情成功');
    }

    // 3. 工作流管理API
    async getWorkflows(request, env) {
        const workflowList = Object.values(WORKFLOWS);
        return this.createSuccessResponse(workflowList, '获取工作流列表成功');
    }

    async getWorkflow(request, env, params) {
        const { workflowId } = params;
        const workflow = WORKFLOWS[workflowId];
        
        if (!workflow) {
            return this.createErrorResponse(
                '工作流不存在',
                ERROR_CODES.WORKFLOW_NOT_FOUND,
                `工作流 ${workflowId} 未找到`,
                404
            );
        }
        
        return this.createSuccessResponse(workflow, '获取工作流详情成功');
    }

    async executeWorkflow(request, env, params) {
        console.log('=== executeWorkflow called (Enhanced) ===');
        console.log('- workflowId:', params.workflowId);
        console.log('- request method:', request.method);
        
        const { workflowId } = params;
        
        // 使用新的工作流管理器获取工作流配置
        const workflow = workflowManager.getWorkflow(workflowId, env);
        
        if (!workflow) {
            return this.createErrorResponse(
                '工作流不存在',
                ERROR_CODES.WORKFLOW_NOT_FOUND,
                `工作流 ${workflowId} 未找到`,
                404
            );
        }

        console.log('- workflow config:', {
            name: workflow.name,
            type: workflow.type,
            isCustom: workflow.isCustom || false
        });

        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }

        try {
            const requestData = await request.json();
            const url = new URL(request.url);
            const stream = url.searchParams.get('stream') === 'true';
            
            // 获取工作流的API Key
            const apiKey = workflowManager.getApiKey(workflow, env);
            if (!apiKey) {
                return this.createErrorResponse(
                    '工作流API密钥未配置',
                    'CONFIG_ERROR',
                    `工作流 ${workflowId} 的API密钥未配置`,
                    403
                );
            }

            console.log('- apiKey configured:', !!apiKey);
            console.log('- stream mode:', stream);

            let result;

            // 根据工作流类型处理
            if (workflow.type === 'url') {
                if (stream) {
                    return this.handleStreamingWorkflowGeneral(requestData, { ...env, DIFY_API_KEY: apiKey });
                } else {
                    result = await callDifyWorkflow(requestData.inputs.url, apiKey);
                }
            } else if (workflow.type === 'text') {
                if (stream) {
                    return this.handleStreamingWorkflow(requestData, { ...env, DIFY_ARTICLE_API_KEY: apiKey });
                } else {
                    result = await this.executeArticleWorkflow(requestData, { ...env, DIFY_ARTICLE_API_KEY: apiKey });
                }
            } else {
                return this.createErrorResponse(
                    '不支持的工作流类型',
                    ERROR_CODES.WORKFLOW_ERROR,
                    `工作流类型 ${workflow.type} 暂不支持`,
                    400
                );
            }

            // 生成执行ID
            const executionId = generateRandomId();
            
            // 如果工作流返回了内容，自动创建content记录并建立关联
            if (result && (result.answer || result.content || result.text)) {
                const contentText = result.answer || result.content || result.text;
                const contentId = generateRandomId();
                const baseUrl = new URL(request.url).origin;
                
                // 确定模板
                const template = requestData.template || 'article_wechat';
                const title = requestData.title || requestData.inputs?.title || '工作流生成内容';
                
                // 构建metadata
                const metadata = {
                    source: 'workflow',
                    workflowId,
                    workflowName: workflow.name,
                    executionId,
                    workflowType: workflow.type,
                    isCustom: workflow.isCustom || false,
                    ...requestData.metadata
                };
                
                // 渲染HTML
                let renderedHtml;
                try {
                    renderedHtml = TemplateManager.render(template, title, contentText, metadata);
                } catch (renderError) {
                    console.error('工作流内容渲染失败:', renderError);
                    renderedHtml = `<pre>${contentText}</pre>`;
                }
                
                // 保存内容
                const contentData = {
                    contentId,
                    content: contentText,
                    template,
                    title,
                    metadata,
                    html: renderedHtml,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    stats: {
                        views: 0,
                        renders: 1
                    }
                };
                
                // 存储内容和关联索引
                await env.MARKDOWN_KV.put(contentId, JSON.stringify(contentData));
                await env.MARKDOWN_KV.put(`workflow:${executionId}`, contentId);
                
                // 在结果中添加内容相关信息
                result.contentId = contentId;
                result.htmlUrl = `${baseUrl}/api/v1/content/${contentId}/html`;
                result.viewUrl = `${baseUrl}/api/v1/content/${contentId}`;
            }
            
            return this.createSuccessResponse({
                workflowId,
                workflowName: workflow.name,
                isCustom: workflow.isCustom || false,
                executionId,
                result,
                executedAt: new Date().toISOString()
            }, '工作流执行成功');

        } catch (error) {
            console.error('工作流执行错误:', error);
            return this.createErrorResponse(
                '工作流执行失败',
                ERROR_CODES.WORKFLOW_ERROR,
                error.message,
                500
            );
        }
    }

    async executeArticleWorkflow(requestData, env) {
        const inputs = {
            prompt: requestData.title, // Dify workflow expects 'prompt'
            style: requestData.style || '',
            context: requestData.context || ''
        };

        const result = await callDifyArticleWorkflow(
            inputs,
            env.DIFY_ARTICLE_API_KEY
        );

        return { content: result };
    }

    async handleStreamingWorkflow(requestData, env) {
        if (!env.DIFY_ARTICLE_API_KEY) {
            return this.createErrorResponse(
                'Dify article API key is not configured.',
                'CONFIG_ERROR',
                null,
                500
            );
        }
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        const inputs = {
            prompt: requestData.title, // Dify workflow expects 'prompt'
            style: requestData.style || '',
            context: requestData.context || ''
        };

        // 启动流式处理
        callDifyArticleWorkflow(
            inputs,
            env.DIFY_ARTICLE_API_KEY,
            {
                onStart: () => {
                    const startEvent = `data: ${JSON.stringify({ type: 'start', message: '开始生成文章' })}\n\n`;
                    writer.write(encoder.encode(startEvent));
                },
                onProgress: (status, data) => {
                    const progressEvent = `data: ${JSON.stringify({ type: 'progress', status, data })}\n\n`;
                    writer.write(encoder.encode(progressEvent));
                },
                onComplete: (finalContent) => {
                    console.log('=== ROUTES DEBUG: onComplete called ===');
                    console.log('finalContent type:', typeof finalContent);
                    console.log('finalContent value:', finalContent);
                    console.log('finalContent length:', finalContent ? finalContent.length : 0);
                    console.log('finalContent preview:', finalContent ? finalContent.substring(0, 200) : 'null/empty');
                    
                    // 确保finalContent不为空或undefined
                    const content = finalContent && finalContent.trim() ? finalContent : null;
                    
                    console.log('=== ROUTES DEBUG: Processed content ===');
                    console.log('content after processing:', content);
                    console.log('hasContent value:', !!content);
                    
                    const completeEventData = { 
                        type: 'complete', 
                        message: '文章生成完成', 
                        content: content,
                        hasContent: !!content
                    };
                    
                    console.log('=== ROUTES DEBUG: Complete event data ===');
                    console.log('Complete event object:', JSON.stringify(completeEventData, null, 2));
                    
                    const completeEvent = `data: ${JSON.stringify(completeEventData)}\n\n`;
                    
                    console.log('=== ROUTES DEBUG: Sending complete event ===');
                    console.log('Complete event string:', completeEvent);
                    
                    writer.write(encoder.encode(completeEvent));
                    writer.write(encoder.encode('data: [DONE]\n\n'));
                    writer.close();
                },
                onError: (error) => {
                    const errorEvent = `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`;
                    writer.write(encoder.encode(errorEvent));
                    writer.close();
                }
            }
        );

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                ...corsHeaders
            }
        });
    }

    async handleStreamingWorkflowGeneral(requestData, env) {
        if (!env.DIFY_API_KEY) {
            return this.createErrorResponse(
                'Dify API key is not configured.',
                'CONFIG_ERROR',
                null,
                500
            );
        }
        
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        // 启动流式处理
        callDifyWorkflowStreaming(
            requestData.inputs.url,
            env.DIFY_API_KEY,
            {
                onStart: () => {
                    const startEvent = `data: ${JSON.stringify({ type: 'start', message: '开始处理URL内容' })}\n\n`;
                    writer.write(encoder.encode(startEvent));
                },
                onProgress: (status, data) => {
                    const progressEvent = `data: ${JSON.stringify({ type: 'progress', status, data })}\n\n`;
                    writer.write(encoder.encode(progressEvent));
                },
                onComplete: (finalContent) => {
                    console.log('=== URL WORKFLOW ROUTES DEBUG: onComplete called ===');
                    console.log('finalContent type:', typeof finalContent);
                    console.log('finalContent length:', finalContent ? finalContent.length : 0);
                    
                    // 确保finalContent不为空或undefined
                    const content = finalContent && finalContent.trim() ? finalContent : null;
                    
                    const completeEventData = { 
                        type: 'complete', 
                        message: 'URL内容处理完成',
                        content: content,
                        hasContent: !!content
                    };
                    
                    const completeEvent = `data: ${JSON.stringify(completeEventData)}\n\n`;
                    writer.write(encoder.encode(completeEvent));
                    writer.write(encoder.encode('data: [DONE]\n\n'));
                    writer.close();
                },
                onError: (error) => {
                    const errorEvent = `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`;
                    writer.write(encoder.encode(errorEvent));
                    writer.close();
                }
            }
        );

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                ...corsHeaders
            }
        });
    }

    // 4. 内容渲染API
    async renderContent(request, env, params) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }

        try {
            // 增强的JSON解析错误处理
            let requestData;
            try {
                requestData = await request.json();
            } catch (jsonError) {
                console.error('JSON解析错误:', jsonError);
                return this.createErrorResponse(
                    '请求体JSON格式错误',
                    ERROR_CODES.INVALID_INPUT,
                    jsonError.message,
                    400
                );
            }
            
            // 确保数据类型正确并提供默认值
            let { content, template = 'article_wechat', title = '', metadata = {} } = requestData;
            
            // 确保content是字符串
            if (typeof content !== 'string') {
                if (content === null || content === undefined) {
                    content = '';
                } else {
                    content = String(content);
                }
            }

            // 使用验证函数验证内容
            const validation = validateContent(content);
            if (!validation.valid) {
                return this.createErrorResponse(
                    '内容验证失败',
                    ERROR_CODES.INVALID_INPUT,
                    validation.errors.join('; '),
                    400
                );
            }

            // 验证模板
            const templates = TemplateManager.getAvailableTemplates();
            const templateIds = templates.map(t => t.id);
            if (!templateIds.includes(template)) {
                // 尝试按名称匹配（向后兼容）
                const templateNames = templates.map(t => t.name);
                if (!templateNames.includes(template)) {
                    return this.createErrorResponse(
                        '模板不存在',
                        ERROR_CODES.TEMPLATE_NOT_FOUND,
                        `模板 ${template} 未找到。可用模板: ${templateIds.join(', ')}`,
                        400
                    );
                }
            }

            // 生成唯一ID
            const contentId = generateRandomId();
            
            // 确保metadata有默认结构
            const enrichedMetadata = {
                source: 'api',
                version: API_VERSION,
                renderEngine: 'marked',
                ...metadata  // 用户提供的metadata会覆盖默认值
            };
            
            // 渲染HTML（预渲染以提高查询性能）
            let renderedHtml;
            try {
                renderedHtml = TemplateManager.render(template, title || '未命名内容', content, enrichedMetadata);
            } catch (renderError) {
                console.error('HTML渲染错误:', renderError);
                // 如果渲染失败，至少保存原始内容
                renderedHtml = `<pre>${content}</pre>`;
            }
            
            // 保存完整的数据结构到KV存储
            const contentData = {
                contentId,
                content,
                template,
                title: title || '',
                metadata: enrichedMetadata,
                html: renderedHtml,  // 保存渲染后的HTML
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                stats: {
                    views: 0,
                    renders: 1
                }
            };
            
            await env.MARKDOWN_KV.put(contentId, JSON.stringify(contentData));

            // 生成访问URL
            const baseUrl = new URL(request.url).origin;
            const viewUrl = `${baseUrl}/api/v1/content/${contentId}`;
            const htmlUrl = `${baseUrl}/api/v1/content/${contentId}/html`;

            // 返回兼容前端期望的响应结构
            return this.createSuccessResponse({
                contentId,
                viewUrl,
                htmlUrl,
                template,
                title: title || '',
                metadata: enrichedMetadata,
                createdAt: contentData.createdAt,
                // 添加嵌套的data字段以兼容前端
                data: {
                    htmlUrl  // 前端从 data.data.htmlUrl 获取
                }
            }, '内容渲染成功', {}, 201);

        } catch (error) {
            console.error('内容渲染错误:', error);
            return this.createErrorResponse(
                '内容渲染失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 5. 结果查看API
    async getContent(request, env, params) {
        const { contentId } = params;
        
        try {
            const contentData = await env.MARKDOWN_KV.get(contentId);
            if (!contentData) {
                // 改进的错误消息
                return this.createErrorResponse(
                    '内容不存在',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `内容ID "${contentId}" 未找到。请先使用 GET /api/v1/content 获取有效的内容ID列表`,
                    404
                );
            }

            const data = JSON.parse(contentData);
            
            // 🚀 动态生成HTML访问URL和相关链接
            const baseUrl = new URL(request.url).origin;
            const enhancedData = {
                ...data,
                // 核心URL信息
                viewUrl: `${baseUrl}/api/v1/content/${contentId}`,
                htmlUrl: `${baseUrl}/api/v1/content/${contentId}/html`,
                exportUrl: `${baseUrl}/api/v1/content/${contentId}/export`,
                
                // HTML访问信息
                htmlInfo: {
                    url: `${baseUrl}/api/v1/content/${contentId}/html`,
                    directAccess: `${baseUrl}/api/v1/content/${contentId}/html`,
                    withTemplate: `${baseUrl}/api/v1/content/${contentId}/html?template=${data.template}`,
                    withTitle: `${baseUrl}/api/v1/content/${contentId}/html?title=${encodeURIComponent(data.title || '未命名')}`
                },
                
                // 导出链接
                exportFormats: {
                    json: `${baseUrl}/api/v1/content/${contentId}/export?format=json`,
                    markdown: `${baseUrl}/api/v1/content/${contentId}/export?format=markdown`,
                    html: `${baseUrl}/api/v1/content/${contentId}/export?format=html`
                },
                
                // 元数据增强
                urlGenerated: true,
                urlGeneratedAt: new Date().toISOString()
            };
            
            return this.createSuccessResponse(enhancedData, '获取内容成功');

        } catch (error) {
            console.error('获取内容错误:', error);
            return this.createErrorResponse(
                '获取内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    async getContentHtml(request, env, params) {
        const { contentId } = params;
        const url = new URL(request.url);
        
        // 🚀 增强参数处理 - 明确可选参数用途
        const templateOverride = url.searchParams.get('template'); // 可选: 临时覆盖模板
        const titleOverride = url.searchParams.get('title');       // 可选: 临时覆盖标题
        const format = url.searchParams.get('format') || 'html';   // 可选: json|html (默认html)
        const includeInfo = url.searchParams.get('info') === 'true'; // 可选: 是否包含元数据
        
        try {
            const contentData = await env.MARKDOWN_KV.get(contentId);
            if (!contentData) {
                return this.createErrorResponse(
                    '内容不存在',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `内容ID "${contentId}" 未找到。可用参数: ?format=json&info=true&template={id}&title={name}`,
                    404
                );
            }

            const data = JSON.parse(contentData);
            const template = templateOverride || data.template;
            const title = titleOverride || data.title || '未命名内容';
            
            // 🚀 智能HTML生成逻辑
            let html;
            let renderMethod = 'cache';
            
            if (data.html && !templateOverride && !titleOverride) {
                // 使用缓存的HTML
                html = data.html;
                renderMethod = 'cached';
                console.log('✅ 使用缓存的HTML');
            } else {
                // 重新渲染HTML
                try {
                    html = TemplateManager.render(template, title, data.content, data.metadata || {});
                    renderMethod = 'rendered';
                    console.log('✅ 重新渲染HTML');
                } catch (renderError) {
                    console.error('❌ HTML渲染错误:', renderError);
                    // 降级处理：生成简单HTML
                    html = this.generateFallbackHtml(title, data.content, renderError.message);
                    renderMethod = 'fallback';
                }
            }
            
            // 🚀 生成完整的URL信息
            const baseUrl = new URL(request.url).origin;
            const htmlInfo = {
                contentId,
                htmlUrl: `${baseUrl}/api/v1/content/${contentId}/html`,
                viewUrl: `${baseUrl}/api/v1/content/${contentId}`,
                template: template,
                title: title,
                renderMethod: renderMethod,
                
                // 参数示例
                urlExamples: {
                    withTemplate: `${baseUrl}/api/v1/content/${contentId}/html?template=${template}`,
                    withTitle: `${baseUrl}/api/v1/content/${contentId}/html?title=${encodeURIComponent(title)}`,
                    asJson: `${baseUrl}/api/v1/content/${contentId}/html?format=json`,
                    withInfo: `${baseUrl}/api/v1/content/${contentId}/html?info=true`
                },
                
                generatedAt: new Date().toISOString()
            };
            
            // 🚀 异步更新访问统计(解决stream读取冲突)
            this.updateViewStatsAsync(env, contentId, data);

            // 🚀 多格式响应支持
            if (format === 'json') {
                // JSON格式: 返回HTML内容和元数据
                const jsonResponse = {
                    success: true,
                    contentId,
                    html: html,
                    htmlInfo: htmlInfo,
                    metadata: {
                        template: template,
                        title: title,
                        originalTemplate: data.template,
                        originalTitle: data.title,
                        renderMethod: renderMethod,
                        contentLength: html.length,
                        hasOverrides: !!(templateOverride || titleOverride)
                    }
                };
                
                return new Response(JSON.stringify(jsonResponse, null, 2), {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Cache-Control': 'public, max-age=3600',
                        ...corsHeaders
                    }
                });
            } else {
                // HTML格式: 直接返回HTML内容
                const htmlHeaders = {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600',
                    'X-Content-Id': contentId,
                    'X-Template': template,
                    'X-Render-Method': renderMethod,
                    ...corsHeaders
                };
                
                // 如果需要包含信息，在HTML中添加元数据
                if (includeInfo) {
                    const metaInfo = `<!-- Content Info: ${JSON.stringify(htmlInfo)} -->`;
                    html = metaInfo + '\n' + html;
                }
                
                return new Response(html, { headers: htmlHeaders });
            }

        } catch (error) {
            console.error('❌ 获取HTML错误:', error);
            return this.createErrorResponse(
                '获取HTML失败',
                ERROR_CODES.INTERNAL_ERROR,
                `错误详情: ${error.message}. 参数格式: ?format=json&template={id}&title={name}&info=true`,
                500
            );
        }
    }
    
    /**
     * 异步更新访问统计(解决stream读取冲突)
     */
    async updateViewStatsAsync(env, contentId, data) {
        try {
            if (data.stats) {
                data.stats.views = (data.stats.views || 0) + 1;
                data.updatedAt = new Date().toISOString();
                // 异步更新，不阻塞主响应
                await env.MARKDOWN_KV.put(contentId, JSON.stringify(data));
                console.log(`✅ 更新访问统计: ${contentId} -> ${data.stats.views} views`);
            }
        } catch (error) {
            console.warn(`⚠️ 更新统计失败: ${contentId}`, error.message);
        }
    }
    
    /**
     * 生成降级HTML(当模板渲染失败时)
     */
    generateFallbackHtml(title, content, errorMessage) {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        .error-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; }
        h1 { color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class="error-notice">
        <strong>⚠️ 渲染失败降级显示</strong><br>
        错误: ${errorMessage}
    </div>
    <h1>${title}</h1>
    <div class="content">${content || '无内容'}</div>
    <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px;">
        生成时间: ${new Date().toISOString()}
    </footer>
</body>
</html>`;
    }

    async getContentUrl(request, env, params) {
        const { contentId } = params;
        
        try {
            const contentData = await env.MARKDOWN_KV.get(contentId);
            if (!contentData) {
                return this.createErrorResponse(
                    '内容不存在',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `内容 ${contentId} 未找到`,
                    404
                );
            }

            const baseUrl = new URL(request.url).origin;
            const htmlUrl = `${baseUrl}/api/v1/content/${contentId}/html`;

            return this.createSuccessResponse({
                contentId,
                htmlUrl,
                directUrl: htmlUrl
            }, '获取内容URL成功');

        } catch (error) {
            console.error('获取URL错误:', error);
            return this.createErrorResponse(
                '获取URL失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 6. 内容管理API
    async deleteContent(request, env, params) {
        const { contentId } = params;
        
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const contentData = await env.MARKDOWN_KV.get(contentId);
            if (!contentData) {
                return this.createErrorResponse(
                    '内容不存在',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `内容 ${contentId} 未找到`,
                    404
                );
            }

            await env.MARKDOWN_KV.delete(contentId);
            
            // 如果存在工作流关联，也删除关联索引
            const data = JSON.parse(contentData);
            if (data.metadata?.executionId) {
                await env.MARKDOWN_KV.delete(`workflow:${data.metadata.executionId}`).catch(e => 
                    console.warn('删除工作流索引失败:', e)
                );
            }
            
            return this.createSuccessResponse({
                contentId,
                deletedAt: new Date().toISOString()
            }, '内容删除成功');

        } catch (error) {
            console.error('删除内容错误:', error);
            return this.createErrorResponse(
                '删除内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    async listContent(request, env, params) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get('limit')) || 10;
            const cursor = url.searchParams.get('cursor');
            
            const listOptions = { limit };
            if (cursor) {
                listOptions.cursor = cursor;
            }
            
            const result = await env.MARKDOWN_KV.list(listOptions);
            const contents = [];
            
            for (const key of result.keys) {
                try {
                    const contentData = await env.MARKDOWN_KV.get(key.name);
                    if (contentData) {
                        const data = JSON.parse(contentData);
                        contents.push({
                            contentId: key.name,
                            title: data.title,
                            template: data.template,
                            createdAt: data.createdAt,
                            metadata: data.metadata
                        });
                    }
                } catch (e) {
                    console.warn(`解析内容失败: ${key.name}`, e);
                }
            }
            
            return this.createSuccessResponse({
                contents,
                pagination: {
                    cursor: result.cursor,
                    hasMore: !result.list_complete
                }
            }, '获取内容列表成功');

        } catch (error) {
            console.error('获取内容列表错误:', error);
            return this.createErrorResponse(
                '获取内容列表失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 7. 增强查询API实现
    async getContentByWorkflow(request, env, params) {
        const { executionId } = params;
        
        try {
            // 查找关联的contentId
            const contentId = await env.MARKDOWN_KV.get(`workflow:${executionId}`);
            if (!contentId) {
                return this.createErrorResponse(
                    '未找到相关内容',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `工作流执行ID "${executionId}" 没有关联的内容`,
                    404
                );
            }
            
            // 获取内容详情
            const contentData = await env.MARKDOWN_KV.get(contentId);
            if (!contentData) {
                // 索引存在但内容已删除
                await env.MARKDOWN_KV.delete(`workflow:${executionId}`);
                return this.createErrorResponse(
                    '内容已删除',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `关联的内容已被删除`,
                    404
                );
            }
            
            const data = JSON.parse(contentData);
            return this.createSuccessResponse({
                ...data,
                workflowExecutionId: executionId
            }, '获取工作流内容成功');
            
        } catch (error) {
            console.error('获取工作流内容错误:', error);
            return this.createErrorResponse(
                '获取工作流内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }
    
    async searchContent(request, env, params) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const url = new URL(request.url);
            const query = url.searchParams.get('q') || '';
            const type = url.searchParams.get('type'); // workflow, manual, all
            const template = url.searchParams.get('template');
            const limit = parseInt(url.searchParams.get('limit')) || 20;
            const cursor = url.searchParams.get('cursor');
            
            // 构建列表选项
            const listOptions = { limit };
            if (cursor) {
                listOptions.cursor = cursor;
            }
            
            // 获取所有内容键
            const result = await env.MARKDOWN_KV.list(listOptions);
            const contents = [];
            
            for (const key of result.keys) {
                // 跳过索引键
                if (key.name.includes(':')) continue;
                
                try {
                    const contentData = await env.MARKDOWN_KV.get(key.name);
                    if (contentData) {
                        const data = JSON.parse(contentData);
                        
                        // 应用过滤条件
                        let match = true;
                        
                        // 类型过滤
                        if (type && type !== 'all') {
                            const contentType = data.metadata?.source || 'manual';
                            if (type !== contentType) match = false;
                        }
                        
                        // 模板过滤
                        if (template && data.template !== template) {
                            match = false;
                        }
                        
                        // 关键词搜索（在标题和内容中搜索）
                        if (query && match) {
                            const searchText = query.toLowerCase();
                            const titleMatch = data.title?.toLowerCase().includes(searchText);
                            const contentMatch = data.content?.toLowerCase().includes(searchText);
                            match = titleMatch || contentMatch;
                        }
                        
                        if (match) {
                            contents.push({
                                contentId: key.name,
                                title: data.title,
                                template: data.template,
                                createdAt: data.createdAt,
                                metadata: data.metadata,
                                // 如果搜索关键词，添加内容片段
                                snippet: query ? this.extractSnippet(data.content, query, 100) : undefined
                            });
                        }
                    }
                } catch (e) {
                    console.warn(`解析内容失败: ${key.name}`, e);
                }
            }
            
            return this.createSuccessResponse({
                query,
                filters: { type, template },
                contents,
                pagination: {
                    cursor: result.cursor,
                    hasMore: !result.list_complete
                }
            }, '搜索内容成功');
            
        } catch (error) {
            console.error('搜索内容错误:', error);
            return this.createErrorResponse(
                '搜索内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }
    
    // 辅助方法：提取包含关键词的内容片段
    extractSnippet(content, keyword, maxLength = 100) {
        if (!content || !keyword) return '';
        
        const lowerContent = content.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();
        const index = lowerContent.indexOf(lowerKeyword);
        
        if (index === -1) return content.substring(0, maxLength) + '...';
        
        const start = Math.max(0, index - 30);
        const end = Math.min(content.length, index + keyword.length + 70);
        let snippet = content.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        return snippet;
    }

    // 新增：获取可用工作流列表
    async getAvailableWorkflows(request, env) {
        try {
            const allWorkflows = workflowManager.getAllWorkflows(env);
            const workflowList = Object.values(allWorkflows).map(workflow => ({
                id: workflow.id,
                name: workflow.name,
                description: workflow.description,
                type: workflow.type,
                icon: workflow.icon,
                inputFields: workflow.inputFields,
                isDefault: workflow.isDefault || false,
                isCustom: workflow.isCustom || false
            }));
            
            console.log(`返回 ${workflowList.length} 个可用工作流`);
            return this.createSuccessResponse(workflowList, '获取可用工作流列表成功');
        } catch (error) {
            console.error('获取工作流列表错误:', error);
            return this.createErrorResponse(
                '获取工作流列表失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 新增：添加自定义工作流
    async addCustomWorkflow(request, env, params) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }

        try {
            const workflowConfig = await request.json();
            const { id, name, description, apiKey, type, inputFields, icon } = workflowConfig;
            
            // 验证必填字段
            if (!id || !name || !apiKey || !type) {
                return this.createErrorResponse(
                    '缺少必填字段',
                    ERROR_CODES.INVALID_INPUT,
                    '请提供 id、name、apiKey 和 type 字段',
                    400
                );
            }

            // 检查工作流ID是否已存在
            const existingWorkflow = workflowManager.getWorkflow(id, env);
            if (existingWorkflow) {
                return this.createErrorResponse(
                    '工作流ID已存在',
                    ERROR_CODES.INVALID_INPUT,
                    `工作流 ${id} 已存在`,
                    409
                );
            }

            // 添加到自定义工作流（这里只是演示，实际需要持久化）
            workflowManager.customWorkflows.set(id, {
                id,
                name,
                description: description || '',
                apiKey,
                type,
                inputFields: inputFields || (type === 'url' ? ['url'] : ['title', 'style', 'context']),
                icon: icon || (type === 'url' ? 'ion-md-globe' : 'ion-md-create'),
                isCustom: true,
                createdAt: new Date().toISOString()
            });

            console.log(`添加自定义工作流: ${id} (${name})`);
            
            return this.createSuccessResponse({
                id,
                name,
                description,
                type,
                message: '自定义工作流添加成功'
            }, '自定义工作流添加成功');
            
        } catch (error) {
            console.error('添加自定义工作流错误:', error);
            return this.createErrorResponse(
                '添加工作流失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 新增：删除自定义工作流
    async deleteCustomWorkflow(request, env, params) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }

        const { workflowId } = params;
        
        try {
            const workflow = workflowManager.getWorkflow(workflowId, env);
            if (!workflow) {
                return this.createErrorResponse(
                    '工作流不存在',
                    ERROR_CODES.WORKFLOW_NOT_FOUND,
                    `工作流 ${workflowId} 未找到`,
                    404
                );
            }

            // 不能删除默认工作流
            if (workflow.isDefault) {
                return this.createErrorResponse(
                    '不能删除默认工作流',
                    ERROR_CODES.INVALID_INPUT,
                    `默认工作流 ${workflowId} 不能删除`,
                    400
                );
            }

            // 删除自定义工作流
            workflowManager.customWorkflows.delete(workflowId);
            
            console.log(`删除自定义工作流: ${workflowId}`);
            
            return this.createSuccessResponse({
                workflowId,
                deletedAt: new Date().toISOString()
            }, '自定义工作流删除成功');
            
        } catch (error) {
            console.error('删除自定义工作流错误:', error);
            return this.createErrorResponse(
                '删除工作流失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 内容管理系统新增方法

    /**
     * 更新内容
     */
    async updateContent(request, env, params) {
        const { contentId } = params;
        
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const updates = await request.json();
            const contentManager = new ContentManager(env);
            const updatedContent = await contentManager.updateContent(contentId, updates);
            
            return this.createSuccessResponse(updatedContent, '内容更新成功');
        } catch (error) {
            console.error('更新内容错误:', error);
            return this.createErrorResponse(
                '更新内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 批量删除内容
     */
    async bulkDeleteContent(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const { contentIds } = await request.json();
            
            if (!Array.isArray(contentIds) || contentIds.length === 0) {
                return this.createErrorResponse(
                    '无效的内容ID列表',
                    ERROR_CODES.INVALID_INPUT,
                    'contentIds必须是非空数组',
                    400
                );
            }
            
            const contentManager = new ContentManager(env);
            const results = await contentManager.bulkDeleteContent(contentIds);
            
            return this.createSuccessResponse(results, '批量删除完成');
        } catch (error) {
            console.error('批量删除错误:', error);
            return this.createErrorResponse(
                '批量删除失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 批量更新状态
     */
    async bulkUpdateStatus(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const { contentIds, status } = await request.json();
            
            if (!Array.isArray(contentIds) || contentIds.length === 0) {
                return this.createErrorResponse(
                    '无效的内容ID列表',
                    ERROR_CODES.INVALID_INPUT,
                    'contentIds必须是非空数组',
                    400
                );
            }
            
            if (!Object.values(ContentStatus).includes(status)) {
                return this.createErrorResponse(
                    '无效的状态值',
                    ERROR_CODES.INVALID_INPUT,
                    `状态必须是: ${Object.values(ContentStatus).join(', ')}`,
                    400
                );
            }
            
            const contentManager = new ContentManager(env);
            const results = await contentManager.bulkUpdateStatus(contentIds, status);
            
            return this.createSuccessResponse(results, '批量更新状态完成');
        } catch (error) {
            console.error('批量更新状态错误:', error);
            return this.createErrorResponse(
                '批量更新状态失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 导出内容
     */
    async exportContent(request, env, params) {
        const { contentId } = params;
        const url = new URL(request.url);
        const format = url.searchParams.get('format') || 'json';
        
        try {
            const contentManager = new ContentManager(env);
            const exportData = await contentManager.exportContent(contentId, format);
            
            // 根据格式返回不同的响应
            if (format === 'json') {
                return new Response(JSON.stringify(exportData.data, null, 2), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Disposition': `attachment; filename="${exportData.filename}"`,
                        ...corsHeaders
                    }
                });
            } else if (format === 'markdown') {
                return new Response(exportData.data, {
                    headers: {
                        'Content-Type': 'text/markdown',
                        'Content-Disposition': `attachment; filename="${exportData.filename}"`,
                        ...corsHeaders
                    }
                });
            } else if (format === 'html') {
                return new Response(exportData.data, {
                    headers: {
                        'Content-Type': 'text/html',
                        'Content-Disposition': `attachment; filename="${exportData.filename}"`,
                        ...corsHeaders
                    }
                });
            }
            
            return this.createErrorResponse(
                '不支持的导出格式',
                ERROR_CODES.INVALID_INPUT,
                `格式 ${format} 不支持`,
                400
            );
        } catch (error) {
            console.error('导出内容错误:', error);
            return this.createErrorResponse(
                '导出内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 导入内容
     */
    async importContent(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const contentType = request.headers.get('Content-Type');
            let data;
            let format = 'json';
            
            if (contentType?.includes('application/json')) {
                data = await request.json();
                format = 'json';
            } else if (contentType?.includes('text/markdown')) {
                data = await request.text();
                format = 'markdown';
            } else {
                // 尝试作为JSON解析
                try {
                    data = await request.json();
                    format = 'json';
                } catch {
                    data = await request.text();
                    format = 'markdown';
                }
            }
            
            const contentManager = new ContentManager(env);
            const importedContent = await contentManager.importContent(data, format);
            
            return this.createSuccessResponse(importedContent, '内容导入成功', {}, 201);
        } catch (error) {
            console.error('导入内容错误:', error);
            return this.createErrorResponse(
                '导入内容失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 获取内容统计
     */
    async getContentStatistics(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const contentManager = new ContentManager(env);
            const statistics = await contentManager.getStatistics();
            
            return this.createSuccessResponse(statistics, '获取统计信息成功');
        } catch (error) {
            console.error('获取统计信息错误:', error);
            return this.createErrorResponse(
                '获取统计信息失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    // 索引管理系统方法

    /**
     * 使用索引搜索内容
     */
    async searchWithIndex(request, env) {
        const url = new URL(request.url);
        const query = url.searchParams.get('q') || '';
        const indexType = url.searchParams.get('type');
        const limit = parseInt(url.searchParams.get('limit')) || 20;
        
        try {
            const indexManager = new IndexManager(env);
            let contentIds = [];
            
            if (indexType) {
                // 使用特定索引类型搜索
                const value = url.searchParams.get('value');
                if (!value) {
                    return this.createErrorResponse(
                        '缺少索引值',
                        ERROR_CODES.INVALID_INPUT,
                        '使用索引搜索时必须提供value参数',
                        400
                    );
                }
                contentIds = await indexManager.queryByIndex(indexType, value, limit);
            } else if (query) {
                // 全文搜索
                contentIds = await indexManager.fullTextSearch(query, limit);
            } else {
                // 多条件搜索
                const conditions = [];
                
                // 构建搜索条件
                const status = url.searchParams.get('status');
                if (status) conditions.push({ type: 'status', value: status });
                
                const contentType = url.searchParams.get('contentType');
                if (contentType) conditions.push({ type: 'type', value: contentType });
                
                const template = url.searchParams.get('template');
                if (template) conditions.push({ type: 'template', value: template });
                
                const author = url.searchParams.get('author');
                if (author) conditions.push({ type: 'author', value: author });
                
                const tag = url.searchParams.get('tag');
                if (tag) conditions.push({ type: 'tag', value: tag.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, '') });
                
                if (conditions.length > 0) {
                    contentIds = await indexManager.queryByMultipleIndexes(conditions, limit);
                } else {
                    return this.createErrorResponse(
                        '缺少搜索条件',
                        ERROR_CODES.INVALID_INPUT,
                        '请提供至少一个搜索条件',
                        400
                    );
                }
            }
            
            // 获取内容详情
            const contents = [];
            for (const contentId of contentIds) {
                try {
                    const data = await env.MARKDOWN_KV.get(contentId);
                    if (data) {
                        const content = JSON.parse(data);
                        contents.push({
                            contentId: content.contentId,
                            title: content.title,
                            template: content.template,
                            status: content.status,
                            type: content.type,
                            tags: content.tags,
                            createdAt: content.createdAt,
                            snippet: query ? this.extractSnippet(content.content, query) : undefined
                        });
                    }
                } catch (e) {
                    console.warn(`获取内容失败: ${contentId}`, e);
                }
            }
            
            return this.createSuccessResponse({
                query,
                conditions: { indexType, ...Object.fromEntries(url.searchParams) },
                results: contents,
                total: contents.length
            }, '搜索完成');
            
        } catch (error) {
            console.error('索引搜索错误:', error);
            return this.createErrorResponse(
                '搜索失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 获取索引统计信息
     */
    async getIndexStatistics(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const indexManager = new IndexManager(env);
            const statistics = await indexManager.getIndexStatistics();
            
            return this.createSuccessResponse(statistics, '获取索引统计成功');
        } catch (error) {
            console.error('获取索引统计错误:', error);
            return this.createErrorResponse(
                '获取索引统计失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 重建索引
     */
    async rebuildIndexes(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const indexManager = new IndexManager(env);
            const result = await indexManager.rebuildAllIndexes();
            
            return this.createSuccessResponse(result, '索引重建完成');
        } catch (error) {
            console.error('重建索引错误:', error);
            return this.createErrorResponse(
                '重建索引失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

    /**
     * 优化索引
     */
    async optimizeIndexes(request, env) {
        // 验证API密钥
        const authResult = validateApiKey(request, env);
        if (!authResult.valid) {
            return this.createErrorResponse(
                authResult.message,
                authResult.error,
                null,
                authResult.error === ERROR_CODES.MISSING_API_KEY ? 401 : 403
            );
        }
        
        try {
            const indexManager = new IndexManager(env);
            const result = await indexManager.optimizeIndexes();
            
            return this.createSuccessResponse(result, '索引优化完成');
        } catch (error) {
            console.error('优化索引错误:', error);
            return this.createErrorResponse(
                '优化索引失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
    }

}

export { ERROR_CODES, API_VERSION };