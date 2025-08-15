import { test, expect } from '@playwright/test';

test.describe('Placeholder 效果验证', () => {
  const TEST_URL = 'http://localhost:8787';

  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
    await page.waitForLoadState('networkidle');
  });

  test('验证API密钥输入框的placeholder效果', async ({ page }) => {
    console.log('开始检查API密钥输入框...');
    
    // 查找API密钥输入框
    const apiKeyInput = page.locator('#api-key');
    await expect(apiKeyInput).toBeVisible();
    
    // 检查placeholder属性值
    const placeholder = await apiKeyInput.getAttribute('placeholder');
    console.log('API密钥输入框的placeholder:', placeholder);
    expect(placeholder).toBe('test-api-key-for-demo');
    
    // 验证输入框为空时显示placeholder
    const value = await apiKeyInput.inputValue();
    console.log('API密钥输入框的当前值:', value);
    expect(value).toBe('');
    
    // 截图记录当前状态
    await page.screenshot({ path: 'api-key-placeholder.png' });
  });

  test('验证URL输入框的placeholder效果', async ({ page }) => {
    console.log('开始检查URL输入框...');
    
    // 查找URL输入框
    const urlInput = page.locator('#target-url');
    await expect(urlInput).toBeVisible();
    
    // 检查placeholder属性值
    const placeholder = await urlInput.getAttribute('placeholder');
    console.log('URL输入框的placeholder:', placeholder);
    expect(placeholder).toBe('https://example.com/article');
    
    // 验证输入框为空时显示placeholder
    const value = await urlInput.inputValue();
    console.log('URL输入框的当前值:', value);
    expect(value).toBe('');
    
    // 截图记录当前状态
    await page.screenshot({ path: 'url-placeholder.png' });
  });

  test('对比文章标题框的placeholder效果', async ({ page }) => {
    console.log('开始检查文章标题框作为对比...');
    
    // 查找文章标题输入框
    const titleInput = page.locator('#page-title');
    await expect(titleInput).toBeVisible();
    
    // 检查placeholder属性值
    const placeholder = await titleInput.getAttribute('placeholder');
    console.log('文章标题框的placeholder:', placeholder);
    expect(placeholder).toBe('输入文章标题 (可选)');
    
    // 验证输入框为空时显示placeholder
    const value = await titleInput.inputValue();
    console.log('文章标题框的当前值:', value);
    expect(value).toBe('');
    
    // 截图记录当前状态
    await page.screenshot({ path: 'title-placeholder.png' });
  });

  test('交互测试：输入和清空placeholder效果', async ({ page }) => {
    console.log('开始交互测试...');
    
    // 测试API密钥输入框
    const apiKeyInput = page.locator('#api-key');
    
    // 输入一些文本
    await apiKeyInput.fill('test-input');
    let value = await apiKeyInput.inputValue();
    console.log('输入后的值:', value);
    expect(value).toBe('test-input');
    
    // 清空输入框
    await apiKeyInput.clear();
    value = await apiKeyInput.inputValue();
    console.log('清空后的值:', value);
    expect(value).toBe('');
    
    // 检查placeholder是否恢复显示
    const placeholder = await apiKeyInput.getAttribute('placeholder');
    console.log('清空后的placeholder:', placeholder);
    expect(placeholder).toBe('test-api-key-for-demo');
    
    await page.screenshot({ path: 'placeholder-interaction-test.png' });
  });

  test('检查所有输入框的placeholder样式', async ({ page }) => {
    console.log('检查所有输入框的样式...');
    
    // 获取所有输入框
    const inputs = await page.locator('input[type="text"], input[type="password"]').all();
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      const value = await input.inputValue();
      
      console.log(`输入框 #${id}:`);
      console.log(`  - placeholder: ${placeholder}`);
      console.log(`  - value: ${value}`);
      console.log(`  - 是否为空: ${value === ''}`);
    }
    
    await page.screenshot({ path: 'all-placeholders.png' });
  });
});