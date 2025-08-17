/**
 * 统一内容管理系统
 * 提供完整的内容生命周期管理、标签系统、批量操作等功能
 */

import { marked } from 'marked';
import { TemplateManager } from './templateManager.js';

// 内容状态枚举
export const ContentStatus = {
    DRAFT: 'draft',           // 草稿
    PUBLISHED: 'published',   // 已发布
    ARCHIVED: 'archived'      // 已归档
};

// 内容类型枚举
export const ContentType = {
    ARTICLE: 'article',       // 文章
    WORKFLOW: 'workflow',     // 工作流生成
    IMPORT: 'import'         // 导入内容
};

/**
 * 内容管理器类
 * 负责所有内容的创建、更新、查询、删除等操作
 */
export class ContentManager {
    constructor(env) {
        this.kv = env.MARKDOWN_KV;
        this.env = env;
    }

    /**
     * 生成唯一ID
     */
    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
    }

    /**
     * 创建新内容
     */
    async createContent({
        content,
        title = '',
        template = 'article_wechat',
        status = ContentStatus.DRAFT,
        type = ContentType.ARTICLE,
        tags = [],
        metadata = {},
        author = null,
        workflowId = null,
        executionId = null
    }) {
        const contentId = this.generateId('content');
        const now = new Date().toISOString();

        // 验证模板
        const templates = TemplateManager.getAvailableTemplates();
        const templateIds = templates.map(t => t.id);
        if (!templateIds.includes(template)) {
            throw new Error(`无效的模板: ${template}`);
        }

        // 渲染HTML
        let html = '';
        try {
            html = TemplateManager.render(template, title, content, metadata);
        } catch (error) {
            console.error('HTML渲染失败:', error);
            html = `<pre>${content}</pre>`;
        }

        // 构建内容数据
        const contentData = {
            contentId,
            content,
            title,
            template,
            status,
            type,
            tags: Array.isArray(tags) ? tags : [],
            metadata: {
                ...metadata,
                source: type,
                version: 1,
                author: author || 'system',
                workflowId,
                executionId
            },
            html,
            stats: {
                views: 0,
                renders: 1,
                exports: 0,
                updates: 0
            },
            versions: [{
                version: 1,
                content,
                updatedAt: now,
                updatedBy: author || 'system'
            }],
            createdAt: now,
            updatedAt: now,
            publishedAt: status === ContentStatus.PUBLISHED ? now : null,
            archivedAt: null
        };

        // 保存到KV
        await this.kv.put(contentId, JSON.stringify(contentData));

        // 创建索引
        await this.createIndexes(contentData);

        return contentData;
    }

    /**
     * 更新内容
     */
    async updateContent(contentId, updates) {
        const existing = await this.getContent(contentId);
        if (!existing) {
            throw new Error(`内容不存在: ${contentId}`);
        }

        const now = new Date().toISOString();
        const { content, title, template, status, tags, metadata, author } = updates;

        // 准备更新数据
        const updatedData = { ...existing };

        // 更新基本字段
        if (content !== undefined && content !== existing.content) {
            updatedData.content = content;
            
            // 保存版本历史
            if (!updatedData.versions) {
                updatedData.versions = [];
            }
            updatedData.versions.push({
                version: (updatedData.metadata?.version || 1) + 1,
                content,
                updatedAt: now,
                updatedBy: author || 'system'
            });
            
            // 限制版本历史数量（最多保留10个版本）
            if (updatedData.versions.length > 10) {
                updatedData.versions = updatedData.versions.slice(-10);
            }
        }

        if (title !== undefined) updatedData.title = title;
        if (template !== undefined) updatedData.template = template;
        if (tags !== undefined) updatedData.tags = Array.isArray(tags) ? tags : [];

        // 更新状态和时间戳
        if (status !== undefined && status !== existing.status) {
            updatedData.status = status;
            
            if (status === ContentStatus.PUBLISHED && !existing.publishedAt) {
                updatedData.publishedAt = now;
            } else if (status === ContentStatus.ARCHIVED && !existing.archivedAt) {
                updatedData.archivedAt = now;
            }
        }

        // 更新元数据
        if (metadata !== undefined) {
            updatedData.metadata = {
                ...existing.metadata,
                ...metadata,
                version: (existing.metadata?.version || 1) + 1
            };
        }

        // 重新渲染HTML（如果内容或模板变化）
        if (content !== existing.content || template !== existing.template) {
            try {
                updatedData.html = TemplateManager.render(
                    updatedData.template,
                    updatedData.title,
                    updatedData.content,
                    updatedData.metadata
                );
            } catch (error) {
                console.error('HTML渲染失败:', error);
            }
        }

        // 更新统计
        updatedData.stats.updates = (updatedData.stats.updates || 0) + 1;
        updatedData.updatedAt = now;

        // 保存更新
        await this.kv.put(contentId, JSON.stringify(updatedData));

        // 更新索引
        await this.updateIndexes(existing, updatedData);

        return updatedData;
    }

    /**
     * 获取内容
     */
    async getContent(contentId) {
        const data = await this.kv.get(contentId);
        if (!data) return null;
        
        const content = JSON.parse(data);
        
        // 更新访问统计
        content.stats.views = (content.stats.views || 0) + 1;
        await this.kv.put(contentId, JSON.stringify(content));
        
        return content;
    }

    /**
     * 删除内容
     */
    async deleteContent(contentId) {
        const content = await this.getContent(contentId);
        if (!content) {
            throw new Error(`内容不存在: ${contentId}`);
        }

        // 删除内容
        await this.kv.delete(contentId);

        // 删除索引
        await this.deleteIndexes(content);

        return { contentId, deletedAt: new Date().toISOString() };
    }

    /**
     * 批量删除内容
     */
    async bulkDeleteContent(contentIds) {
        const results = {
            success: [],
            failed: []
        };

        for (const contentId of contentIds) {
            try {
                await this.deleteContent(contentId);
                results.success.push(contentId);
            } catch (error) {
                results.failed.push({
                    contentId,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * 批量更新状态
     */
    async bulkUpdateStatus(contentIds, status) {
        const results = {
            success: [],
            failed: []
        };

        for (const contentId of contentIds) {
            try {
                await this.updateContent(contentId, { status });
                results.success.push(contentId);
            } catch (error) {
                results.failed.push({
                    contentId,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * 搜索内容
     */
    async searchContent({
        query = '',
        status = null,
        type = null,
        tags = [],
        template = null,
        author = null,
        limit = 20,
        cursor = null,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    }) {
        const listOptions = { limit: limit + 1 };
        if (cursor) listOptions.cursor = cursor;

        const result = await this.kv.list(listOptions);
        const contents = [];

        for (const key of result.keys) {
            // 跳过索引键
            if (key.name.includes(':')) continue;

            try {
                const data = await this.kv.get(key.name);
                if (data) {
                    const content = JSON.parse(data);
                    
                    // 应用过滤条件
                    let match = true;

                    // 状态过滤
                    if (status && content.status !== status) match = false;

                    // 类型过滤
                    if (type && content.type !== type) match = false;

                    // 模板过滤
                    if (template && content.template !== template) match = false;

                    // 作者过滤
                    if (author && content.metadata?.author !== author) match = false;

                    // 标签过滤
                    if (tags.length > 0 && content.tags) {
                        const contentTags = content.tags || [];
                        const hasAllTags = tags.every(tag => contentTags.includes(tag));
                        if (!hasAllTags) match = false;
                    }

                    // 关键词搜索
                    if (query && match) {
                        const searchText = query.toLowerCase();
                        const titleMatch = content.title?.toLowerCase().includes(searchText);
                        const contentMatch = content.content?.toLowerCase().includes(searchText);
                        const tagMatch = content.tags?.some(tag => 
                            tag.toLowerCase().includes(searchText)
                        );
                        match = titleMatch || contentMatch || tagMatch;
                    }

                    if (match) {
                        contents.push({
                            contentId: content.contentId,
                            title: content.title,
                            template: content.template,
                            status: content.status,
                            type: content.type,
                            tags: content.tags,
                            author: content.metadata?.author,
                            createdAt: content.createdAt,
                            updatedAt: content.updatedAt,
                            publishedAt: content.publishedAt,
                            snippet: query ? this.extractSnippet(content.content, query) : undefined
                        });
                    }
                }
            } catch (e) {
                console.warn(`解析内容失败: ${key.name}`, e);
            }
        }

        // 排序
        contents.sort((a, b) => {
            const aVal = a[sortBy] || '';
            const bVal = b[sortBy] || '';
            
            if (sortOrder === 'desc') {
                return bVal.localeCompare(aVal);
            } else {
                return aVal.localeCompare(bVal);
            }
        });

        // 分页
        const hasMore = contents.length > limit;
        const paginatedContents = contents.slice(0, limit);
        const nextCursor = hasMore ? result.cursor : null;

        return {
            contents: paginatedContents,
            pagination: {
                cursor: nextCursor,
                hasMore,
                total: contents.length
            }
        };
    }

    /**
     * 导出内容
     */
    async exportContent(contentId, format = 'json') {
        const content = await this.getContent(contentId);
        if (!content) {
            throw new Error(`内容不存在: ${contentId}`);
        }

        // 更新导出统计
        content.stats.exports = (content.stats.exports || 0) + 1;
        await this.kv.put(contentId, JSON.stringify(content));

        switch (format) {
            case 'json':
                return {
                    format: 'json',
                    data: content,
                    filename: `${contentId}.json`
                };
            
            case 'markdown':
                return {
                    format: 'markdown',
                    data: content.content,
                    filename: `${contentId}.md`
                };
            
            case 'html':
                return {
                    format: 'html',
                    data: content.html,
                    filename: `${contentId}.html`
                };
            
            default:
                throw new Error(`不支持的导出格式: ${format}`);
        }
    }

    /**
     * 导入内容
     */
    async importContent(data, format = 'json') {
        switch (format) {
            case 'json':
                // 验证JSON数据结构
                if (!data.content) {
                    throw new Error('导入数据缺少content字段');
                }
                
                return await this.createContent({
                    content: data.content,
                    title: data.title || '',
                    template: data.template || 'article_wechat',
                    status: ContentStatus.DRAFT,
                    type: ContentType.IMPORT,
                    tags: data.tags || [],
                    metadata: {
                        ...data.metadata,
                        importedFrom: format,
                        importedAt: new Date().toISOString()
                    }
                });
            
            case 'markdown':
                // 将Markdown字符串作为内容导入
                return await this.createContent({
                    content: data,
                    title: '导入的Markdown内容',
                    template: 'article_wechat',
                    status: ContentStatus.DRAFT,
                    type: ContentType.IMPORT,
                    metadata: {
                        importedFrom: format,
                        importedAt: new Date().toISOString()
                    }
                });
            
            default:
                throw new Error(`不支持的导入格式: ${format}`);
        }
    }

    /**
     * 获取内容统计
     */
    async getStatistics() {
        const stats = {
            total: 0,
            byStatus: {
                draft: 0,
                published: 0,
                archived: 0
            },
            byType: {
                article: 0,
                workflow: 0,
                import: 0
            },
            byTemplate: {},
            topTags: [],
            recentUpdates: []
        };

        const result = await this.kv.list({ limit: 1000 });
        const tagCount = {};

        for (const key of result.keys) {
            if (key.name.includes(':')) continue;

            try {
                const data = await this.kv.get(key.name);
                if (data) {
                    const content = JSON.parse(data);
                    
                    stats.total++;
                    
                    // 按状态统计
                    if (content.status) {
                        stats.byStatus[content.status] = (stats.byStatus[content.status] || 0) + 1;
                    }
                    
                    // 按类型统计
                    if (content.type) {
                        stats.byType[content.type] = (stats.byType[content.type] || 0) + 1;
                    }
                    
                    // 按模板统计
                    if (content.template) {
                        stats.byTemplate[content.template] = (stats.byTemplate[content.template] || 0) + 1;
                    }
                    
                    // 统计标签
                    if (content.tags && Array.isArray(content.tags)) {
                        content.tags.forEach(tag => {
                            tagCount[tag] = (tagCount[tag] || 0) + 1;
                        });
                    }
                    
                    // 收集最近更新
                    stats.recentUpdates.push({
                        contentId: content.contentId,
                        title: content.title,
                        updatedAt: content.updatedAt
                    });
                }
            } catch (e) {
                console.warn(`统计内容失败: ${key.name}`, e);
            }
        }

        // 排序标签
        stats.topTags = Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));

        // 排序最近更新
        stats.recentUpdates = stats.recentUpdates
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 10);

        return stats;
    }

    /**
     * 创建索引
     */
    async createIndexes(content) {
        // 状态索引
        if (content.status) {
            await this.kv.put(`status:${content.status}:${content.contentId}`, '1');
        }

        // 类型索引
        if (content.type) {
            await this.kv.put(`type:${content.type}:${content.contentId}`, '1');
        }

        // 标签索引
        if (content.tags && Array.isArray(content.tags)) {
            for (const tag of content.tags) {
                await this.kv.put(`tag:${tag}:${content.contentId}`, '1');
            }
        }

        // 工作流索引
        if (content.metadata?.executionId) {
            await this.kv.put(`workflow:${content.metadata.executionId}`, content.contentId);
        }
    }

    /**
     * 更新索引
     */
    async updateIndexes(oldContent, newContent) {
        // 删除旧索引
        await this.deleteIndexes(oldContent);
        
        // 创建新索引
        await this.createIndexes(newContent);
    }

    /**
     * 删除索引
     */
    async deleteIndexes(content) {
        // 删除状态索引
        if (content.status) {
            await this.kv.delete(`status:${content.status}:${content.contentId}`);
        }

        // 删除类型索引
        if (content.type) {
            await this.kv.delete(`type:${content.type}:${content.contentId}`);
        }

        // 删除标签索引
        if (content.tags && Array.isArray(content.tags)) {
            for (const tag of content.tags) {
                await this.kv.delete(`tag:${tag}:${content.contentId}`);
            }
        }

        // 删除工作流索引
        if (content.metadata?.executionId) {
            await this.kv.delete(`workflow:${content.metadata.executionId}`);
        }
    }

    /**
     * 提取内容片段
     */
    extractSnippet(content, keyword, maxLength = 150) {
        if (!content || !keyword) return '';
        
        const lowerContent = content.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();
        const index = lowerContent.indexOf(lowerKeyword);
        
        if (index === -1) {
            return content.substring(0, maxLength) + '...';
        }
        
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + keyword.length + 100);
        let snippet = content.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        return snippet;
    }
}

export default ContentManager;