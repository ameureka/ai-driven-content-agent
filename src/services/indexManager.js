/**
 * 内容索引管理系统
 * 提供高性能的多维度索引、全文搜索、查询优化等功能
 */

/**
 * 索引类型枚举
 */
export const IndexType = {
    STATUS: 'status',           // 状态索引
    TYPE: 'type',              // 类型索引
    TAG: 'tag',                // 标签索引
    TEMPLATE: 'template',      // 模板索引
    AUTHOR: 'author',          // 作者索引
    DATE: 'date',              // 日期索引
    WORKFLOW: 'workflow',      // 工作流索引
    FULLTEXT: 'fulltext'       // 全文索引
};

/**
 * 索引管理器类
 * 负责创建、更新、查询和维护所有内容索引
 */
export class IndexManager {
    constructor(env) {
        this.kv = env.MARKDOWN_KV;
        this.env = env;
    }

    /**
     * 创建内容的所有索引
     */
    async createIndexes(content) {
        const promises = [];
        
        // 1. 状态索引
        if (content.status) {
            promises.push(
                this.kv.put(`idx:status:${content.status}:${content.contentId}`, '1')
            );
        }

        // 2. 类型索引
        if (content.type) {
            promises.push(
                this.kv.put(`idx:type:${content.type}:${content.contentId}`, '1')
            );
        }

        // 3. 标签索引
        if (content.tags && Array.isArray(content.tags)) {
            for (const tag of content.tags) {
                promises.push(
                    this.kv.put(`idx:tag:${this.normalizeTag(tag)}:${content.contentId}`, '1')
                );
            }
        }

        // 4. 模板索引
        if (content.template) {
            promises.push(
                this.kv.put(`idx:template:${content.template}:${content.contentId}`, '1')
            );
        }

        // 5. 作者索引
        const author = content.metadata?.author || 'system';
        promises.push(
            this.kv.put(`idx:author:${author}:${content.contentId}`, '1')
        );

        // 6. 日期索引（按年月分组）
        if (content.createdAt) {
            const date = new Date(content.createdAt);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            promises.push(
                this.kv.put(`idx:date:${yearMonth}:${content.contentId}`, '1')
            );
        }

        // 7. 工作流索引
        if (content.metadata?.executionId) {
            promises.push(
                this.kv.put(`idx:workflow:${content.metadata.executionId}`, content.contentId)
            );
        }

        // 8. 全文索引（提取关键词）
        const keywords = this.extractKeywords(content);
        for (const keyword of keywords) {
            promises.push(
                this.kv.put(`idx:keyword:${keyword}:${content.contentId}`, '1')
            );
        }

        // 9. 标题索引（用于快速标题搜索）
        if (content.title) {
            const titleWords = this.tokenize(content.title);
            for (const word of titleWords) {
                promises.push(
                    this.kv.put(`idx:title:${word}:${content.contentId}`, '1')
                );
            }
        }

        // 执行所有索引创建
        await Promise.all(promises);
        
        // 更新索引元数据
        await this.updateIndexMetadata(content.contentId, {
            indexed: true,
            indexedAt: new Date().toISOString(),
            indexCount: promises.length
        });
    }

    /**
     * 删除内容的所有索引
     */
    async deleteIndexes(content) {
        const promises = [];
        
        // 删除各类索引
        if (content.status) {
            promises.push(
                this.kv.delete(`idx:status:${content.status}:${content.contentId}`)
            );
        }

        if (content.type) {
            promises.push(
                this.kv.delete(`idx:type:${content.type}:${content.contentId}`)
            );
        }

        if (content.tags && Array.isArray(content.tags)) {
            for (const tag of content.tags) {
                promises.push(
                    this.kv.delete(`idx:tag:${this.normalizeTag(tag)}:${content.contentId}`)
                );
            }
        }

        if (content.template) {
            promises.push(
                this.kv.delete(`idx:template:${content.template}:${content.contentId}`)
            );
        }

        const author = content.metadata?.author || 'system';
        promises.push(
            this.kv.delete(`idx:author:${author}:${content.contentId}`)
        );

        if (content.createdAt) {
            const date = new Date(content.createdAt);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            promises.push(
                this.kv.delete(`idx:date:${yearMonth}:${content.contentId}`)
            );
        }

        if (content.metadata?.executionId) {
            promises.push(
                this.kv.delete(`idx:workflow:${content.metadata.executionId}`)
            );
        }

        // 删除关键词索引
        const keywords = this.extractKeywords(content);
        for (const keyword of keywords) {
            promises.push(
                this.kv.delete(`idx:keyword:${keyword}:${content.contentId}`)
            );
        }

        // 删除标题索引
        if (content.title) {
            const titleWords = this.tokenize(content.title);
            for (const word of titleWords) {
                promises.push(
                    this.kv.delete(`idx:title:${word}:${content.contentId}`)
                );
            }
        }

        await Promise.all(promises);
        
        // 删除索引元数据
        await this.kv.delete(`idx:meta:${content.contentId}`);
    }

    /**
     * 更新内容索引
     */
    async updateIndexes(oldContent, newContent) {
        // 先删除旧索引
        await this.deleteIndexes(oldContent);
        // 再创建新索引
        await this.createIndexes(newContent);
    }

    /**
     * 使用索引查询内容ID
     */
    async queryByIndex(indexType, value, limit = 100) {
        const prefix = `idx:${indexType}:${value}:`;
        const result = await this.kv.list({ prefix, limit });
        
        return result.keys.map(key => {
            // 从键名中提取内容ID
            const parts = key.name.split(':');
            return parts[parts.length - 1];
        });
    }

    /**
     * 多条件查询（交集）
     */
    async queryByMultipleIndexes(conditions, limit = 100) {
        const resultSets = [];
        
        // 获取每个条件的结果集
        for (const condition of conditions) {
            const ids = await this.queryByIndex(condition.type, condition.value, 1000);
            resultSets.push(new Set(ids));
        }
        
        if (resultSets.length === 0) {
            return [];
        }
        
        // 计算交集
        let intersection = resultSets[0];
        for (let i = 1; i < resultSets.length; i++) {
            intersection = new Set([...intersection].filter(x => resultSets[i].has(x)));
        }
        
        return Array.from(intersection).slice(0, limit);
    }

    /**
     * 全文搜索
     */
    async fullTextSearch(query, limit = 100) {
        const keywords = this.tokenize(query.toLowerCase());
        const resultMap = new Map();
        
        // 搜索每个关键词
        for (const keyword of keywords) {
            // 搜索标题
            const titleMatches = await this.queryByIndex('title', keyword, 100);
            for (const id of titleMatches) {
                resultMap.set(id, (resultMap.get(id) || 0) + 2); // 标题匹配权重更高
            }
            
            // 搜索内容关键词
            const keywordMatches = await this.queryByIndex('keyword', keyword, 100);
            for (const id of keywordMatches) {
                resultMap.set(id, (resultMap.get(id) || 0) + 1);
            }
        }
        
        // 按相关度排序
        const sortedResults = Array.from(resultMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);
        
        return sortedResults;
    }

    /**
     * 获取索引统计
     */
    async getIndexStatistics() {
        const stats = {
            totalIndexes: 0,
            byType: {},
            topKeywords: [],
            recentIndexed: []
        };
        
        // 统计各类索引
        const indexTypes = Object.values(IndexType);
        for (const type of indexTypes) {
            const prefix = `idx:${type}:`;
            const result = await this.kv.list({ prefix, limit: 1000 });
            stats.byType[type] = result.keys.length;
            stats.totalIndexes += result.keys.length;
        }
        
        // 获取热门关键词
        const keywordPrefix = 'idx:keyword:';
        const keywordResult = await this.kv.list({ prefix: keywordPrefix, limit: 1000 });
        const keywordCount = {};
        
        for (const key of keywordResult.keys) {
            const keyword = key.name.replace(keywordPrefix, '').split(':')[0];
            keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        }
        
        stats.topKeywords = Object.entries(keywordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([keyword, count]) => ({ keyword, count }));
        
        return stats;
    }

    /**
     * 重建所有索引
     */
    async rebuildAllIndexes() {
        console.log('开始重建所有索引...');
        const startTime = Date.now();
        
        // 删除所有现有索引
        const indexPrefixes = [
            'idx:status:', 'idx:type:', 'idx:tag:', 'idx:template:',
            'idx:author:', 'idx:date:', 'idx:workflow:', 'idx:keyword:',
            'idx:title:', 'idx:meta:'
        ];
        
        for (const prefix of indexPrefixes) {
            const result = await this.kv.list({ prefix, limit: 1000 });
            for (const key of result.keys) {
                await this.kv.delete(key.name);
            }
        }
        
        // 重新索引所有内容
        const contentResult = await this.kv.list({ limit: 1000 });
        let indexedCount = 0;
        
        for (const key of contentResult.keys) {
            // 跳过索引键
            if (key.name.includes(':')) continue;
            
            try {
                const data = await this.kv.get(key.name);
                if (data) {
                    const content = JSON.parse(data);
                    await this.createIndexes(content);
                    indexedCount++;
                }
            } catch (error) {
                console.error(`重建索引失败: ${key.name}`, error);
            }
        }
        
        const duration = Date.now() - startTime;
        console.log(`索引重建完成: ${indexedCount} 个内容，耗时 ${duration}ms`);
        
        return {
            success: true,
            indexedCount,
            duration
        };
    }

    /**
     * 优化索引（清理无效索引）
     */
    async optimizeIndexes() {
        console.log('开始优化索引...');
        const startTime = Date.now();
        let removedCount = 0;
        
        // 获取所有内容ID
        const contentIds = new Set();
        const contentResult = await this.kv.list({ limit: 1000 });
        for (const key of contentResult.keys) {
            if (!key.name.includes(':')) {
                contentIds.add(key.name);
            }
        }
        
        // 检查并删除无效索引
        const indexPrefixes = [
            'idx:status:', 'idx:type:', 'idx:tag:', 'idx:template:',
            'idx:author:', 'idx:date:', 'idx:keyword:', 'idx:title:'
        ];
        
        for (const prefix of indexPrefixes) {
            const result = await this.kv.list({ prefix, limit: 1000 });
            for (const key of result.keys) {
                const contentId = key.name.split(':').pop();
                if (!contentIds.has(contentId)) {
                    await this.kv.delete(key.name);
                    removedCount++;
                }
            }
        }
        
        const duration = Date.now() - startTime;
        console.log(`索引优化完成: 删除 ${removedCount} 个无效索引，耗时 ${duration}ms`);
        
        return {
            success: true,
            removedCount,
            duration
        };
    }

    // 辅助方法

    /**
     * 提取关键词
     */
    extractKeywords(content) {
        const keywords = new Set();
        
        // 从标题提取
        if (content.title) {
            const titleWords = this.tokenize(content.title);
            titleWords.forEach(word => keywords.add(word));
        }
        
        // 从内容提取（限制前1000字符）
        if (content.content) {
            const text = content.content.substring(0, 1000);
            const words = this.tokenize(text);
            
            // 只保留出现频率较高的词
            const wordCount = {};
            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1;
            });
            
            // 选择频率最高的前20个词
            const topWords = Object.entries(wordCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 20)
                .map(([word]) => word);
            
            topWords.forEach(word => keywords.add(word));
        }
        
        // 添加标签作为关键词
        if (content.tags && Array.isArray(content.tags)) {
            content.tags.forEach(tag => {
                keywords.add(this.normalizeTag(tag));
            });
        }
        
        return Array.from(keywords);
    }

    /**
     * 分词处理
     */
    tokenize(text) {
        if (!text) return [];
        
        // 转换为小写
        text = text.toLowerCase();
        
        // 移除特殊字符，保留中文、英文、数字
        text = text.replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, ' ');
        
        // 分词
        const words = text.split(/\s+/).filter(word => {
            // 过滤掉太短的词（少于2个字符）
            if (word.length < 2) return false;
            
            // 过滤掉停用词
            const stopWords = ['的', '了', '和', '是', '在', '有', '我', '你', '他', '她', '它', 
                             'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
            if (stopWords.includes(word)) return false;
            
            return true;
        });
        
        return words;
    }

    /**
     * 标准化标签
     */
    normalizeTag(tag) {
        return tag.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');
    }

    /**
     * 更新索引元数据
     */
    async updateIndexMetadata(contentId, metadata) {
        await this.kv.put(`idx:meta:${contentId}`, JSON.stringify(metadata));
    }

    /**
     * 获取索引元数据
     */
    async getIndexMetadata(contentId) {
        const data = await this.kv.get(`idx:meta:${contentId}`);
        return data ? JSON.parse(data) : null;
    }
}

export default IndexManager;