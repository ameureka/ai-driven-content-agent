import { TemplateManager } from '../src/services/templateManager.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== 模板测试 ===');

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
        return '# 测试标题\n\n这是一个测试内容。';
    }
}

try {
  // 测试获取可用模板
  console.log('\n1. 测试获取可用模板:');
  const templates = TemplateManager.getAvailableTemplates();
  console.log('可用模板数量:', templates.length);
  console.log('模板列表:', templates);

  // 测试获取特定模板
  console.log('\n2. 测试获取article_wechat模板:');
  const template = TemplateManager.getTemplate('article_wechat');
  console.log('模板对象:', template ? '存在' : '不存在');
  if (template) {
    console.log('模板名称:', template.name);
    console.log('模板显示名称:', template.displayName);
  }

  // 测试模板渲染
  if (template && template.render) {
    console.log('\n3. 测试模板渲染:');
    const testContent = readTestMarkdown();
    const rendered = template.render('程序员的未来之路：技术浪潮下的结构性机会', testContent);
    console.log('渲染结果长度:', rendered.length);
    console.log('渲染成功!');
  }

} catch (error) {
  console.error('测试过程中出现错误:', error);
  console.error('错误堆栈:', error.stack);
}