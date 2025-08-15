/**
 * API路由处理器 - 重构后的标准化RESTful API
 * 符合标准API设计规范，支持MCP协议集成
 */

import { marked } from 'marked';
import { TemplateManager } from '../services/templateManager.js';
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
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId`, this.getContent.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId/html`, this.getContentHtml.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content/:contentId/url`, this.getContentUrl.bind(this));
        
        // 6. 内容管理API
        this.addRoute('DELETE', `${API_BASE_PATH}/content/:contentId`, this.deleteContent.bind(this));
        this.addRoute('GET', `${API_BASE_PATH}/content`, this.listContent.bind(this));
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

            return this.createSuccessResponse({
                workflowId,
                workflowName: workflow.name,
                isCustom: workflow.isCustom || false,
                executionId: generateRandomId(),
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
            const requestData = await request.json();
            const { content, template = 'general', title = '', metadata = {} } = requestData;

            // 验证输入
            if (!content || !content.trim()) {
                return this.createErrorResponse(
                    '内容不能为空',
                    ERROR_CODES.INVALID_INPUT,
                    '请提供有效的内容',
                    400
                );
            }

            // 检查内容大小（25MB限制）
            if (content.length > 25 * 1024 * 1024) {
                return this.createErrorResponse(
                    '内容过大',
                    ERROR_CODES.CONTENT_TOO_LARGE,
                    '内容大小不能超过25MB',
                    413
                );
            }

            // 验证模板
            const templates = TemplateManager.getAvailableTemplates();
            const templateNames = templates.map(t => t.name);
            if (!templateNames.includes(template)) {
                return this.createErrorResponse(
                    '模板不存在',
                    ERROR_CODES.TEMPLATE_NOT_FOUND,
                    `模板 ${template} 未找到`,
                    400
                );
            }

            // 生成唯一ID
            const contentId = generateRandomId();
            
            // 保存内容到KV存储
            const contentData = {
                content,
                template,
                title,
                metadata,
                createdAt: new Date().toISOString(),
                id: contentId
            };
            
            await env.MARKDOWN_KV.put(contentId, JSON.stringify(contentData));

            // 生成访问URL
            const baseUrl = new URL(request.url).origin;
            const viewUrl = `${baseUrl}/api/v1/content/${contentId}`;
            const htmlUrl = `${baseUrl}/api/v1/content/${contentId}/html`;

            return this.createSuccessResponse({
                contentId,
                viewUrl,
                htmlUrl,
                template,
                title,
                createdAt: contentData.createdAt
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
                return this.createErrorResponse(
                    '内容不存在',
                    ERROR_CODES.CONTENT_NOT_FOUND,
                    `内容 ${contentId} 未找到`,
                    404
                );
            }

            const data = JSON.parse(contentData);
            return this.createSuccessResponse(data, '获取内容成功');

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
        const templateOverride = url.searchParams.get('template');
        const titleOverride = url.searchParams.get('title');
        
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

            const data = JSON.parse(contentData);
            const template = templateOverride || data.template;
            const title = titleOverride || data.title;

            // 渲染HTML
            const html = TemplateManager.render(template, title, data.content, data.metadata);

            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    ...corsHeaders
                }
            });

        } catch (error) {
            console.error('获取HTML错误:', error);
            return this.createErrorResponse(
                '获取HTML失败',
                ERROR_CODES.INTERNAL_ERROR,
                error.message,
                500
            );
        }
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
}

export { ERROR_CODES, API_VERSION };