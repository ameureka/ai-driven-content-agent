// 工作流选择器功能测试脚本
// 测试新实现的自定义工作流选择功能

(function() {
  'use strict';
  
  const testConfig = {
    apiKey: 'aiwenchuang',
    testUrl: 'https://x.com/GitHub_Daily/status/1954082721644392709',
    testContent: {
      title: 'AI 技术发展',
      style: '专业',
      context: '人工智能技术的发展趋势'
    }
  };
  
  function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 测试工作流选择器是否正确渲染
  async function testWorkflowSelectorRendering() {
    log('🔍 测试工作流选择器渲染...');
    
    const workflowGrid = document.getElementById('workflow-grid');
    if (!workflowGrid) {
      log('未找到工作流选择器容器', 'error');
      return false;
    }
    
    const workflowCards = workflowGrid.querySelectorAll('.workflow-card');
    if (workflowCards.length === 0) {
      log('未找到工作流卡片', 'error');
      return false;
    }
    
    log(`找到 ${workflowCards.length} 个工作流卡片`, 'success');
    
    // 检查默认工作流
    const defaultWorkflows = ['dify-general', 'dify-article'];
    const foundWorkflows = [];
    
    workflowCards.forEach(card => {
      const workflowId = card.dataset.workflow;
      const workflowType = card.dataset.type;
      const workflowName = card.querySelector('.workflow-info h4')?.textContent;
      
      if (workflowId) {
        foundWorkflows.push({ id: workflowId, type: workflowType, name: workflowName });
        log(`  - 工作流: ${workflowName} (${workflowId}, 类型: ${workflowType})`);
      }
    });
    
    const hasDefaultWorkflows = defaultWorkflows.every(id => 
      foundWorkflows.some(w => w.id === id)
    );
    
    if (hasDefaultWorkflows) {
      log('默认工作流渲染正常', 'success');
      return true;
    } else {
      log('缺少必要的默认工作流', 'error');
      return false;
    }
  }

  // 测试工作流选择功能
  async function testWorkflowSelection() {
    log('🎯 测试工作流选择功能...');
    
    const workflowGrid = document.getElementById('workflow-grid');
    const workflowCards = workflowGrid.querySelectorAll('.workflow-card');
    
    if (workflowCards.length === 0) {
      log('没有可选择的工作流', 'error');
      return false;
    }
    
    // 测试选择不同的工作流
    for (const card of workflowCards) {
      const workflowId = card.dataset.workflow;
      const workflowName = card.querySelector('.workflow-info h4')?.textContent;
      
      log(`选择工作流: ${workflowName} (${workflowId})`);
      
      // 点击工作流卡片
      card.click();
      await sleep(500);
      
      // 检查是否被选中
      if (card.classList.contains('active')) {
        log(`工作流 ${workflowName} 选择成功`, 'success');
      } else {
        log(`工作流 ${workflowName} 选择失败`, 'error');
        return false;
      }
      
      // 检查UI是否相应更新
      await testUIUpdatesForWorkflow(workflowId);
    }
    
    return true;
  }

  // 测试选择工作流后UI是否正确更新
  async function testUIUpdatesForWorkflow(workflowId) {
    const workflow = window.availableWorkflows?.get(workflowId);
    if (!workflow) {
      log(`无法获取工作流信息: ${workflowId}`, 'warning');
      return;
    }
    
    const urlSection = document.querySelector('.url-section');
    const workflowSection = document.querySelector('.workflow-section');
    
    if (workflow.type === 'url') {
      // URL类型工作流应该显示URL输入，隐藏文章生成
      if (urlSection.style.display !== 'none' && workflowSection.style.display === 'none') {
        log(`  UI更新正确: 显示URL输入界面`, 'success');
      } else {
        log(`  UI更新错误: URL工作流界面显示不正确`, 'error');
      }
    } else if (workflow.type === 'text') {
      // 文本类型工作流应该显示文章生成，隐藏URL输入
      if (urlSection.style.display === 'none' && workflowSection.style.display !== 'none') {
        log(`  UI更新正确: 显示文章生成界面`, 'success');
      } else {
        log(`  UI更新错误: 文本工作流界面显示不正确`, 'error');
      }
    }
  }

  // 测试API端点
  async function testWorkflowAPIEndpoints() {
    log('🌐 测试工作流API端点...');
    
    try {
      // 测试获取可用工作流列表
      const response = await fetch('/api/v1/workflows/available');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          log(`成功获取工作流列表: ${data.data.length} 个工作流`, 'success');
          data.data.forEach(workflow => {
            log(`  - ${workflow.name} (${workflow.id}, 类型: ${workflow.type})`);
          });
          return true;
        } else {
          log('工作流列表响应格式错误', 'error');
          return false;
        }
      } else {
        log(`API请求失败: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      log(`API请求异常: ${error.message}`, 'error');
      return false;
    }
  }

  // 测试URL工作流执行
  async function testUrlWorkflowExecution() {
    log('🔗 测试URL工作流执行...');
    
    // 1. 选择URL类型工作流
    const urlWorkflowCard = document.querySelector('[data-workflow="dify-general"]');
    if (!urlWorkflowCard) {
      log('未找到URL工作流卡片', 'error');
      return false;
    }
    
    urlWorkflowCard.click();
    await sleep(500);
    
    // 2. 填入API密钥
    const apiKeyInput = document.getElementById('api-key');
    if (apiKeyInput) {
      apiKeyInput.value = testConfig.apiKey;
      apiKeyInput.dispatchEvent(new Event('input', { bubbles: true }));
      log('API密钥已填入');
    }
    
    // 3. 填入测试URL
    const urlInput = document.getElementById('target-url');
    if (urlInput) {
      urlInput.value = testConfig.testUrl;
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));
      log('测试URL已填入');
    }
    
    // 4. 点击生成按钮
    const generateBtn = document.getElementById('generate-from-url');
    if (generateBtn && !generateBtn.disabled) {
      log('点击URL生成按钮...');
      generateBtn.click();
      
      // 等待处理开始
      await sleep(2000);
      
      // 检查状态指示器
      const statusIndicator = document.getElementById('url-workflow-status');
      if (statusIndicator && !statusIndicator.classList.contains('hidden')) {
        log('URL工作流状态指示器已显示', 'success');
        return true;
      } else {
        log('URL工作流状态指示器未显示', 'warning');
        return false;
      }
    } else {
      log('URL生成按钮不可用', 'error');
      return false;
    }
  }

  // 测试文本工作流执行
  async function testTextWorkflowExecution() {
    log('📝 测试文本工作流执行...');
    
    // 1. 选择文本类型工作流
    const textWorkflowCard = document.querySelector('[data-workflow="dify-article"]');
    if (!textWorkflowCard) {
      log('未找到文本工作流卡片', 'error');
      return false;
    }
    
    textWorkflowCard.click();
    await sleep(500);
    
    // 2. 填入API密钥
    const apiKeyInput = document.getElementById('api-key');
    if (apiKeyInput) {
      apiKeyInput.value = testConfig.apiKey;
      apiKeyInput.dispatchEvent(new Event('input', { bubbles: true }));
      log('API密钥已填入');
    }
    
    // 3. 填入测试内容
    const titleInput = document.getElementById('workflow-title');
    const styleInput = document.getElementById('workflow-style');
    const contextInput = document.getElementById('workflow-context');
    
    if (titleInput) {
      titleInput.value = testConfig.testContent.title;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (styleInput) {
      styleInput.value = testConfig.testContent.style;
      styleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (contextInput) {
      contextInput.value = testConfig.testContent.context;
      contextInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    log('测试内容已填入');
    
    // 4. 点击生成按钮
    const generateBtn = document.getElementById('generate-article-btn');
    if (generateBtn && !generateBtn.disabled) {
      log('点击文章生成按钮...');
      generateBtn.click();
      
      // 等待处理开始
      await sleep(2000);
      
      // 检查状态指示器
      const statusIndicator = document.getElementById('workflow-status');
      if (statusIndicator && !statusIndicator.classList.contains('hidden')) {
        log('文章工作流状态指示器已显示', 'success');
        return true;
      } else {
        log('文章工作流状态指示器未显示', 'warning');
        return false;
      }
    } else {
      log('文章生成按钮不可用', 'error');
      return false;
    }
  }

  // 综合测试函数
  async function runAllWorkflowTests() {
    log('🚀 开始工作流选择器综合测试...');
    const results = [];
    
    try {
      // 1. 测试工作流选择器渲染
      const renderingTest = await testWorkflowSelectorRendering();
      results.push({ test: '工作流选择器渲染', success: renderingTest });
      
      await sleep(1000);
      
      // 2. 测试工作流选择功能
      const selectionTest = await testWorkflowSelection();
      results.push({ test: '工作流选择功能', success: selectionTest });
      
      await sleep(1000);
      
      // 3. 测试API端点
      const apiTest = await testWorkflowAPIEndpoints();
      results.push({ test: 'API端点测试', success: apiTest });
      
      await sleep(1000);
      
      // 4. 测试URL工作流执行
      const urlTest = await testUrlWorkflowExecution();
      results.push({ test: 'URL工作流执行', success: urlTest });
      
      await sleep(3000); // 等待URL工作流处理
      
      // 5. 测试文本工作流执行
      const textTest = await testTextWorkflowExecution();
      results.push({ test: '文本工作流执行', success: textTest });
      
    } catch (error) {
      log(`测试过程中发生异常: ${error.message}`, 'error');
    }
    
    // 汇总结果
    log('\n📊 工作流选择器测试结果汇总:');
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      log(`${status} ${result.test}`);
    });
    
    log(`\n总计: ${successCount}/${totalCount} 项测试通过`, 
         successCount === totalCount ? 'success' : 'warning');
    
    if (successCount === totalCount) {
      log('🎉 所有工作流选择器功能测试通过!', 'success');
    } else {
      log('⚠️ 部分测试未通过，请检查相关功能', 'warning');
    }
    
    return results;
  }

  // 将测试函数暴露到全局
  window.workflowTester = {
    runAllWorkflowTests,
    testWorkflowSelectorRendering,
    testWorkflowSelection,
    testWorkflowAPIEndpoints,
    testUrlWorkflowExecution,
    testTextWorkflowExecution,
    config: testConfig
  };
  
  log('🧪 工作流选择器测试器已加载!');
  log('使用 workflowTester.runAllWorkflowTests() 开始综合测试');
  
})();

// 使用说明:
// 1. 在浏览器中打开 http://localhost:8787
// 2. 打开开发者工具控制台
// 3. 复制粘贴此脚本并运行
// 4. 运行 workflowTester.runAllWorkflowTests() 开始综合测试
// 5. 或者运行单独的测试函数，如 workflowTester.testWorkflowSelection()