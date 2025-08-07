// 自动化测试脚本
// 测试AI驱动内容代理的主要功能

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取测试markdown文件
function readTestMarkdown() {
    const testFilePath = path.join(__dirname, '..', 'docs', 'test_markdown.md');
    try {
        const content = fs.readFileSync(testFilePath, 'utf8');
        console.log('✅ 成功读取测试markdown文件');
        console.log(`文件长度: ${content.length} 字符`);
        return content;
    } catch (error) {
        console.error('❌ 读取测试markdown文件失败:', error.message);
        return null;
    }
}

// 测试API端点
async function testApiEndpoints() {
    const baseUrl = 'http://localhost:8787';
    const endpoints = [
        '/api/v1/status',
        '/api/v1/templates',
        '/api/v1/workflows'
    ];

    console.log('\n🔍 测试API端点...');
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${baseUrl}${endpoint}`);
            if (response.ok) {
                console.log(`✅ ${endpoint} - 状态: ${response.status}`);
            } else {
                console.log(`⚠️  ${endpoint} - 状态: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint} - 错误: ${error.message}`);
        }
    }
}

// 测试内容渲染API
async function testContentRender(markdownContent) {
    const baseUrl = 'http://localhost:8787';
    const apiKey = 'aiwenchuang';
    
    console.log('\n📝 测试内容渲染功能...');
    
    try {
        const response = await fetch(`${baseUrl}/api/v1/content/render`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                content: markdownContent,
                template: 'article_wechat',
                title: '程序员的未来之路：技术浪潮下的结构性机会'
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 内容渲染成功');
            console.log(`生成的内容ID: ${result.id || 'N/A'}`);
            return result;
        } else {
            const errorText = await response.text();
            console.log(`❌ 内容渲染失败 - 状态: ${response.status}`);
            console.log(`错误信息: ${errorText}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 内容渲染请求失败: ${error.message}`);
        return null;
    }
}

// 测试模板获取
async function testTemplates() {
    const baseUrl = 'http://localhost:8787';
    
    console.log('\n📋 测试模板获取...');
    
    try {
        const response = await fetch(`${baseUrl}/api/v1/templates`);
        if (response.ok) {
            const templates = await response.json();
            console.log('✅ 模板获取成功');
            console.log(`可用模板数量: ${templates.length || 0}`);
            if (templates.length > 0) {
                console.log('模板列表:');
                templates.forEach((template, index) => {
                    console.log(`  ${index + 1}. ${template.id} - ${template.name}`);
                });
            }
            return templates;
        } else {
            console.log(`❌ 模板获取失败 - 状态: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 模板获取请求失败: ${error.message}`);
        return null;
    }
}

// 主测试函数
async function runTests() {
    console.log('🚀 开始自动化测试...');
    console.log('测试配置:');
    console.log('- API密钥: aiwenchuang');
    console.log('- 测试文件: /Users/ameureka/Desktop/ai_driven_content_agent/docs/test_markdown.md');
    console.log('- 服务器地址: http://localhost:8787');
    
    // 1. 读取测试文件
    const markdownContent = readTestMarkdown();
    if (!markdownContent) {
        console.log('❌ 无法继续测试，测试文件读取失败');
        return;
    }
    
    // 2. 测试API端点
    await testApiEndpoints();
    
    // 3. 测试模板获取
    await testTemplates();
    
    // 4. 测试内容渲染
    const renderResult = await testContentRender(markdownContent);
    
    console.log('\n📊 测试总结:');
    console.log('- 文件读取: ✅');
    console.log('- API端点测试: 已完成');
    console.log('- 模板获取: 已完成');
    console.log(`- 内容渲染: ${renderResult ? '✅' : '❌'}`);
    
    if (renderResult && renderResult.id) {
        console.log('\n🔗 生成的内容链接:');
        console.log(`http://localhost:8787/content/${renderResult.id}`);
        console.log(`HTML版本: http://localhost:8787/content/${renderResult.id}/html`);
    }
    
    console.log('\n✨ 测试完成!');
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export {
    readTestMarkdown,
    testApiEndpoints,
    testContentRender,
    testTemplates,
    runTests
};