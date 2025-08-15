// 手动验证 placeholder 效果的脚本
// 在浏览器控制台运行此脚本

(function() {
  'use strict';
  
  console.log('🔍 开始手动验证 placeholder 效果...');
  
  // 检查 API 密钥输入框
  const apiKeyInput = document.getElementById('api-key');
  if (apiKeyInput) {
    console.log('\n=== API密钥输入框 ===');
    console.log('✅ 找到API密钥输入框');
    console.log('📝 Placeholder:', apiKeyInput.placeholder);
    console.log('💾 当前值:', apiKeyInput.value);
    console.log('🎯 期望placeholder: "test-api-key-for-demo"');
    console.log('✨ 正确性:', apiKeyInput.placeholder === 'test-api-key-for-demo' ? '✅ 正确' : '❌ 错误');
  } else {
    console.log('❌ 未找到API密钥输入框');
  }
  
  // 检查 URL 输入框
  const urlInput = document.getElementById('target-url');
  if (urlInput) {
    console.log('\n=== URL输入框 ===');
    console.log('✅ 找到URL输入框');
    console.log('📝 Placeholder:', urlInput.placeholder);
    console.log('💾 当前值:', urlInput.value);
    console.log('🎯 期望placeholder: "https://example.com/article"');
    console.log('✨ 正确性:', urlInput.placeholder === 'https://example.com/article' ? '✅ 正确' : '❌ 错误');
  } else {
    console.log('❌ 未找到URL输入框');
  }
  
  // 检查文章标题框作为对比
  const titleInput = document.getElementById('page-title');
  if (titleInput) {
    console.log('\n=== 文章标题框（对比） ===');
    console.log('✅ 找到文章标题输入框');
    console.log('📝 Placeholder:', titleInput.placeholder);
    console.log('💾 当前值:', titleInput.value);
  } else {
    console.log('❌ 未找到文章标题输入框');
  }
  
  // 提供交互测试函数
  window.testPlaceholder = function() {
    console.log('\n🧪 开始交互测试...');
    
    if (apiKeyInput) {
      console.log('测试API密钥框：');
      apiKeyInput.focus();
      setTimeout(() => {
        apiKeyInput.value = 'test-input';
        console.log('✏️ 输入测试文本:', apiKeyInput.value);
        
        setTimeout(() => {
          apiKeyInput.value = '';
          apiKeyInput.blur();
          console.log('🧹 清空输入框');
          console.log('🔄 Placeholder恢复:', apiKeyInput.placeholder);
        }, 1000);
      }, 500);
    }
  };
  
  console.log('\n📖 使用说明:');
  console.log('1. 检查上面的输出结果');
  console.log('2. 观察页面中输入框的视觉效果');
  console.log('3. 运行 testPlaceholder() 进行交互测试');
  console.log('4. 手动点击输入框查看placeholder消失和恢复效果');
  
  // 自动高亮相关输入框
  [apiKeyInput, urlInput, titleInput].forEach(input => {
    if (input) {
      input.style.boxShadow = '0 0 5px #007bff';
      setTimeout(() => {
        input.style.boxShadow = '';
      }, 3000);
    }
  });
  
  console.log('\n✨ 输入框已高亮显示3秒，方便您查看效果！');
})();