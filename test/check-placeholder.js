// 简单的 Playwright 脚本来验证 placeholder 效果
import { chromium } from 'playwright';

(async () => {
  console.log('🔍 开始检查 placeholder 效果...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 导航到站点
    console.log('📍 访问站点: http://localhost:8787');
    await page.goto('http://localhost:8787');
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== API密钥输入框检查 ===');
    
    // 检查API密钥输入框
    const apiKeyInput = page.locator('#api-key');
    const apiKeyPlaceholder = await apiKeyInput.getAttribute('placeholder');
    const apiKeyValue = await apiKeyInput.inputValue();
    
    console.log(`✅ API密钥输入框找到`);
    console.log(`📝 Placeholder: "${apiKeyPlaceholder}"`);
    console.log(`💾 当前值: "${apiKeyValue}"`);
    console.log(`🎯 期望placeholder: "test-api-key-for-demo"`);
    console.log(`✨ Placeholder正确: ${apiKeyPlaceholder === 'test-api-key-for-demo' ? '是' : '否'}`);
    
    console.log('\n=== URL输入框检查 ===');
    
    // 检查URL输入框
    const urlInput = page.locator('#target-url');
    const urlPlaceholder = await urlInput.getAttribute('placeholder');
    const urlValue = await urlInput.inputValue();
    
    console.log(`✅ URL输入框找到`);
    console.log(`📝 Placeholder: "${urlPlaceholder}"`);
    console.log(`💾 当前值: "${urlValue}"`);
    console.log(`🎯 期望placeholder: "https://example.com/article"`);
    console.log(`✨ Placeholder正确: ${urlPlaceholder === 'https://example.com/article' ? '是' : '否'}`);
    
    console.log('\n=== 文章标题框对比检查 ===');
    
    // 检查文章标题输入框作为对比
    const titleInput = page.locator('#page-title');
    const titlePlaceholder = await titleInput.getAttribute('placeholder');
    const titleValue = await titleInput.inputValue();
    
    console.log(`✅ 文章标题输入框找到`);
    console.log(`📝 Placeholder: "${titlePlaceholder}"`);
    console.log(`💾 当前值: "${titleValue}"`);
    
    console.log('\n=== 视觉效果检查 ===');
    
    // 截图保存当前状态
    await page.screenshot({ path: 'placeholder-check.png', fullPage: true });
    console.log('📸 页面截图已保存为 placeholder-check.png');
    
    // 交互测试 - 输入然后清空
    console.log('\n=== 交互测试 ===');
    
    // 测试API密钥框
    console.log('🧪 测试API密钥框交互...');
    await apiKeyInput.click();
    await apiKeyInput.fill('test-input');
    let newValue = await apiKeyInput.inputValue();
    console.log(`✏️ 输入后的值: "${newValue}"`);
    
    await apiKeyInput.clear();
    newValue = await apiKeyInput.inputValue();
    console.log(`🧹 清空后的值: "${newValue}"`);
    
    const finalPlaceholder = await apiKeyInput.getAttribute('placeholder');
    console.log(`🔄 清空后placeholder: "${finalPlaceholder}"`);
    
    // 等待一下让用户看到效果
    console.log('\n⏳ 等待5秒让您查看效果...');
    await page.waitForTimeout(5000);
    
    console.log('\n🎉 检查完成！');
    
    // 总结结果
    const apiKeyCorrect = apiKeyPlaceholder === 'test-api-key-for-demo';
    const urlCorrect = urlPlaceholder === 'https://example.com/article';
    
    console.log('\n📊 检查结果总结:');
    console.log(`API密钥框 placeholder: ${apiKeyCorrect ? '✅ 正确' : '❌ 错误'}`);
    console.log(`URL框 placeholder: ${urlCorrect ? '✅ 正确' : '❌ 错误'}`);
    console.log(`总体效果: ${apiKeyCorrect && urlCorrect ? '✅ 全部正确' : '❌ 需要修复'}`);
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
  }
  
  await browser.close();
})();