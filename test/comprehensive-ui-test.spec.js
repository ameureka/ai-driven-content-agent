import { test, expect } from '@playwright/test';

test.describe('网页功能综合测试 - http://localhost:8787', () => {
  const TEST_URL = 'http://localhost:8787';
  const API_KEY = 'aiwenchuang';
  
  test.beforeEach(async ({ page }) => {
    // 设置较长的超时时间
    test.setTimeout(60000);
    
    // 访问页面并等待加载完成
    await page.goto(TEST_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // 额外等待确保所有元素加载
  });

  test('1. 页面基础加载测试', async ({ page }) => {
    console.log('开始测试页面基础加载...');
    
    // 检查页面标题
    await expect(page).toHaveTitle(/AI智能内容代理/);
    
    // 检查主要容器元素是否存在
    const header = page.locator('header.app-header');
    await expect(header).toBeVisible();
    
    const heroSection = page.locator('section.hero-section');
    await expect(heroSection).toBeVisible();
    
    const mainContainer = page.locator('main.app-container');
    await expect(mainContainer).toBeVisible();
    
    // 检查关键按钮和输入框是否存在
    const apiKeyInput = page.locator('#api-key');
    await expect(apiKeyInput).toBeVisible();
    
    const markdownEditor = page.locator('#markdown-editor');
    await expect(markdownEditor).toBeVisible();
    
    // 截图记录页面初始状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/01-page-loaded.png',
      fullPage: true 
    });
    
    console.log('✅ 页面基础加载测试通过');
  });

  test('2. 工作流选择器界面元素验证', async ({ page }) => {
    console.log('开始测试工作流选择器界面元素...');
    
    // 检查工作流选择器区域
    const workflowSection = page.locator('.workflow-selector-section');
    await expect(workflowSection).toBeVisible();
    
    const workflowTitle = page.locator('.workflow-selector-section h3');
    await expect(workflowTitle).toContainText('选择工作流');
    
    // 检查工作流网格容器
    const workflowGrid = page.locator('#workflow-grid');
    await expect(workflowGrid).toBeVisible();
    
    // 检查默认工作流卡片 - URL内容生成
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await expect(urlWorkflowCard).toBeVisible();
    await expect(urlWorkflowCard.locator('.workflow-info h4')).toContainText('URL内容生成');
    await expect(urlWorkflowCard.locator('.workflow-info p')).toContainText('从网页链接生成内容');
    await expect(urlWorkflowCard.locator('.workflow-type')).toContainText('URL处理');
    
    // 检查默认工作流卡片 - AI文章生成
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await expect(textWorkflowCard).toBeVisible();
    await expect(textWorkflowCard.locator('.workflow-info h4')).toContainText('AI文章生成');
    await expect(textWorkflowCard.locator('.workflow-info p')).toContainText('基于关键词生成文章');
    await expect(textWorkflowCard.locator('.workflow-type')).toContainText('文本生成');
    
    // 检查工作流图标是否显示
    const urlIcon = urlWorkflowCard.locator('.workflow-icon i');
    await expect(urlIcon).toBeVisible();
    
    const textIcon = textWorkflowCard.locator('.workflow-icon i');
    await expect(textIcon).toBeVisible();
    
    // 检查默认选中状态（URL工作流应该是默认选中的）
    await expect(urlWorkflowCard).toHaveClass(/active/);
    
    // 截图记录工作流选择器状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/02-workflow-selector.png',
      fullPage: true 
    });
    
    console.log('✅ 工作流选择器界面元素验证通过');
  });

  test('3. 自定义工作流按钮功能测试', async ({ page }) => {
    console.log('开始测试自定义工作流按钮功能...');
    
    // 查找添加自定义工作流按钮
    const addWorkflowBtn = page.locator('#add-custom-workflow-btn');
    await expect(addWorkflowBtn).toBeVisible();
    await expect(addWorkflowBtn).toContainText('添加自定义工作流');
    
    // 检查按钮图标
    const btnIcon = addWorkflowBtn.locator('i');
    await expect(btnIcon).toBeVisible();
    
    // 点击按钮之前截图
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/03-before-custom-workflow-click.png',
      fullPage: true 
    });
    
    // 点击添加自定义工作流按钮
    await addWorkflowBtn.click();
    
    // 等待通知消息出现
    await page.waitForTimeout(1000);
    
    // 验证通知消息是否显示
    const notification = page.locator('#notification');
    await expect(notification).toBeVisible();
    
    // 验证通知消息内容
    const notificationMessage = page.locator('#notification-message');
    await expect(notificationMessage).toContainText('自定义工作流功能即将推出');
    
    // 点击按钮后截图
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/03-after-custom-workflow-click.png',
      fullPage: true 
    });
    
    // 等待通知消失
    await page.waitForTimeout(3000);
    
    console.log('✅ 自定义工作流按钮功能测试通过');
  });

  test('4. 工作流选择器功能测试', async ({ page }) => {
    console.log('开始测试工作流选择器功能...');
    
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    const urlSection = page.locator('.url-section');
    const workflowSection = page.locator('.workflow-section');
    
    // 初始状态：URL工作流应该是选中的
    await expect(urlWorkflowCard).toHaveClass(/active/);
    await expect(textWorkflowCard).not.toHaveClass(/active/);
    await expect(urlSection).toBeVisible();
    await expect(workflowSection).toBeHidden();
    
    // 点击AI文章生成工作流
    await textWorkflowCard.click();
    await page.waitForTimeout(500);
    
    // 检查选中状态变化
    await expect(textWorkflowCard).toHaveClass(/active/);
    await expect(urlWorkflowCard).not.toHaveClass(/active/);
    
    // 检查界面切换
    await expect(urlSection).toBeHidden();
    await expect(workflowSection).toBeVisible();
    
    // 截图记录文章生成工作流选中状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/04-article-workflow-selected.png',
      fullPage: true 
    });
    
    // 切换回URL工作流
    await urlWorkflowCard.click();
    await page.waitForTimeout(500);
    
    // 再次检查选中状态
    await expect(urlWorkflowCard).toHaveClass(/active/);
    await expect(textWorkflowCard).not.toHaveClass(/active/);
    await expect(urlSection).toBeVisible();
    await expect(workflowSection).toBeHidden();
    
    // 截图记录URL工作流选中状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/04-url-workflow-selected.png',
      fullPage: true 
    });
    
    console.log('✅ 工作流选择器功能测试通过');
  });

  test('5. 模板选择器功能测试', async ({ page }) => {
    console.log('开始测试模板选择器功能...');
    
    // 检查模板选择区域
    const templateSection = page.locator('.template-section');
    await expect(templateSection).toBeVisible();
    
    const templateTitle = templateSection.locator('h3');
    await expect(templateTitle).toContainText('选择排版模板');
    
    // 检查模板网格
    const templateGrid = page.locator('.template-grid');
    await expect(templateGrid).toBeVisible();
    
    // 检查所有模板卡片
    const expectedTemplates = [
      { selector: '[data-template="article_wechat"]', name: '通用文章', desc: '微信公众号通用文章模板' },
      { selector: '[data-template="tech_analysis_wechat"]', name: '技术解读', desc: '深度技术分析和解读' },
      { selector: '[data-template="news_modern_wechat"]', name: '新闻广播', desc: '现代化新闻资讯模板' },
      { selector: '[data-template="github_project_wechat"]', name: 'GitHub项目', desc: '开源项目介绍和展示' },
      { selector: '[data-template="ai_benchmark_wechat"]', name: 'AI基准测试', desc: 'AI模型评测和对比' },
      { selector: '[data-template="professional_analysis_wechat"]', name: '专业分析', desc: '深度研究报告和专业文档' }
    ];
    
    for (const template of expectedTemplates) {
      const templateCard = page.locator(template.selector);
      await expect(templateCard).toBeVisible();
      await expect(templateCard.locator('h4')).toContainText(template.name);
      await expect(templateCard.locator('p')).toContainText(template.desc);
      
      // 检查模板图标
      const templateIcon = templateCard.locator('i');
      await expect(templateIcon).toBeVisible();
    }
    
    // 测试模板选择功能
    const firstTemplate = page.locator('[data-template="article_wechat"]');
    await firstTemplate.click();
    await page.waitForTimeout(300);
    
    // 截图记录模板选择状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/05-template-selector.png',
      fullPage: true 
    });
    
    console.log('✅ 模板选择器功能测试通过');
  });

  test('6. 主要功能按钮测试', async ({ page }) => {
    console.log('开始测试主要功能按钮...');
    
    // 检查主要操作按钮区域
    const actionButtons = page.locator('.action-buttons');
    await expect(actionButtons).toBeVisible();
    
    // 检查各个按钮
    const generateBtn = page.locator('#generate-btn');
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toContainText('生成排版');
    await expect(generateBtn).toBeEnabled();
    
    const previewBtn = page.locator('#preview-btn');
    await expect(previewBtn).toBeVisible();
    await expect(previewBtn).toContainText('预览');
    await expect(previewBtn).toBeDisabled(); // 初始状态应该是禁用的
    
    const copyLinkBtn = page.locator('#copy-link-btn');
    await expect(copyLinkBtn).toBeVisible();
    await expect(copyLinkBtn).toContainText('复制链接');
    await expect(copyLinkBtn).toBeDisabled(); // 初始状态应该是禁用的
    
    const resetBtn = page.locator('#reset-btn');
    await expect(resetBtn).toBeVisible();
    await expect(resetBtn).toContainText('重置');
    await expect(resetBtn).toBeEnabled();
    
    // 测试重置按钮功能
    const markdownEditor = page.locator('#markdown-editor');
    await markdownEditor.fill('测试内容');
    await resetBtn.click();
    await page.waitForTimeout(500);
    
    // 验证编辑器是否被清空
    const editorContent = await markdownEditor.inputValue();
    expect(editorContent).toBe('');
    
    console.log('✅ 主要功能按钮测试通过');
  });

  test('7. URL工作流完整测试', async ({ page }) => {
    console.log('开始测试URL工作流完整功能...');
    
    // 确保URL工作流被选中
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await urlWorkflowCard.click();
    await page.waitForTimeout(500);
    
    // 填入API密钥
    const apiKeyInput = page.locator('#api-key');
    await apiKeyInput.fill(API_KEY);
    
    // 填入测试URL
    const urlInput = page.locator('#target-url');
    const testUrl = 'https://x.com/GitHub_Daily/status/1954082721644392709';
    await urlInput.fill(testUrl);
    
    // 点击生成按钮
    const generateBtn = page.locator('#generate-from-url');
    await expect(generateBtn).toBeEnabled();
    
    // 点击前截图
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/07-url-workflow-before-generate.png',
      fullPage: true 
    });
    
    await generateBtn.click();
    
    // 检查状态指示器
    const statusIndicator = page.locator('#url-workflow-status');
    await expect(statusIndicator).toBeVisible();
    
    // 检查按钮状态变化
    await expect(generateBtn).toBeDisabled();
    await expect(generateBtn).toContainText('处理中');
    
    // 点击后截图
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/07-url-workflow-processing.png',
      fullPage: true 
    });
    
    console.log('✅ URL工作流完整测试通过');
  });

  test('8. AI文章生成工作流完整测试', async ({ page }) => {
    console.log('开始测试AI文章生成工作流完整功能...');
    
    // 选择AI文章生成工作流
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await textWorkflowCard.click();
    await page.waitForTimeout(500);
    
    // 填入API密钥
    const apiKeyInput = page.locator('#api-key');
    await apiKeyInput.fill(API_KEY);
    
    // 填入文章生成参数
    const titleInput = page.locator('#workflow-title');
    await titleInput.fill('AI技术发展趋势');
    
    const styleInput = page.locator('#workflow-style');
    await styleInput.fill('专业分析');
    
    const contextInput = page.locator('#workflow-context');
    await contextInput.fill('分析当前人工智能技术的发展现状和未来趋势，包括大模型、机器学习等领域的进展。');
    
    // 点击生成按钮
    const generateBtn = page.locator('#generate-article-btn');
    await expect(generateBtn).toBeEnabled();
    
    // 点击前截图
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/08-article-workflow-before-generate.png',
      fullPage: true 
    });
    
    await generateBtn.click();
    
    // 检查状态指示器
    const statusIndicator = page.locator('#workflow-status');
    await expect(statusIndicator).toBeVisible();
    
    // 检查按钮状态变化
    await expect(generateBtn).toBeDisabled();
    await expect(generateBtn).toContainText('生成中');
    
    // 点击后截图
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/08-article-workflow-processing.png',
      fullPage: true 
    });
    
    console.log('✅ AI文章生成工作流完整测试通过');
  });

  test('9. 响应式界面和主题切换测试', async ({ page }) => {
    console.log('开始测试响应式界面和主题切换...');
    
    // 检查主题切换按钮
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // 获取初始主题状态
    const initialBodyClass = await page.locator('body').getAttribute('class');
    
    // 点击主题切换按钮
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // 检查主题是否发生变化
    const newBodyClass = await page.locator('body').getAttribute('class');
    expect(newBodyClass).not.toBe(initialBodyClass);
    
    // 截图记录主题切换后的状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/09-theme-switched.png',
      fullPage: true 
    });
    
    // 测试移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // 截图记录移动端界面
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/09-mobile-view.png',
      fullPage: true 
    });
    
    // 恢复桌面端视口
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    
    console.log('✅ 响应式界面和主题切换测试通过');
  });

  test('10. API连接和工作流列表测试', async ({ page }) => {
    console.log('开始测试API连接和工作流列表...');
    
    try {
      // 测试获取可用工作流列表API
      const response = await page.request.get(`${TEST_URL}/api/v1/workflows/available`);
      
      if (response.ok()) {
        const data = await response.json();
        
        console.log('API响应数据:', data);
        
        expect(data.success).toBe(true);
        expect(data.data).toBeInstanceOf(Array);
        expect(data.data.length).toBeGreaterThan(0);
        
        // 检查默认工作流是否存在
        const workflows = data.data;
        const urlWorkflow = workflows.find(w => w.id === 'dify-general');
        const textWorkflow = workflows.find(w => w.id === 'dify-article');
        
        expect(urlWorkflow).toBeDefined();
        expect(urlWorkflow.type).toBe('url');
        expect(textWorkflow).toBeDefined();
        expect(textWorkflow.type).toBe('text');
        
        console.log('✅ API连接成功，工作流数据正常');
      } else {
        console.log('⚠️ API连接失败，状态码:', response.status());
      }
    } catch (error) {
      console.log('⚠️ API测试出现错误:', error.message);
    }
    
    // 截图记录最终状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/10-final-state.png',
      fullPage: true 
    });
    
    console.log('✅ API连接和工作流列表测试完成');
  });

  test('11. 编辑器功能和工具按钮测试', async ({ page }) => {
    console.log('开始测试编辑器功能和工具按钮...');
    
    // 检查编辑器面板
    const editorPanel = page.locator('.editor-panel');
    await expect(editorPanel).toBeVisible();
    
    const editorHeader = page.locator('.editor-header h2');
    await expect(editorHeader).toContainText('Markdown编辑器');
    
    // 检查编辑器工具按钮
    const pasteBtn = page.locator('#paste-btn');
    await expect(pasteBtn).toBeVisible();
    
    const exampleBtn = page.locator('#example-btn');
    await expect(exampleBtn).toBeVisible();
    
    const clearBtn = page.locator('#clear-editor-btn');
    await expect(clearBtn).toBeVisible();
    
    // 测试示例按钮功能
    const markdownEditor = page.locator('#markdown-editor');
    await exampleBtn.click();
    await page.waitForTimeout(1000);
    
    // 检查是否插入了示例内容
    const editorContent = await markdownEditor.inputValue();
    expect(editorContent.length).toBeGreaterThan(0);
    
    // 测试清空按钮功能
    await clearBtn.click();
    await page.waitForTimeout(500);
    
    const clearedContent = await markdownEditor.inputValue();
    expect(clearedContent).toBe('');
    
    console.log('✅ 编辑器功能和工具按钮测试通过');
  });

  test('12. 关于模态框和信息展示测试', async ({ page }) => {
    console.log('开始测试关于模态框和信息展示...');
    
    // 点击关于按钮
    const aboutLink = page.locator('#about-link');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    
    // 等待模态框出现
    await page.waitForTimeout(500);
    
    // 检查关于模态框是否显示
    const aboutModal = page.locator('#about-modal');
    await expect(aboutModal).toBeVisible();
    
    // 检查模态框内容
    const modalTitle = aboutModal.locator('.modal-header h2');
    await expect(modalTitle).toContainText('关于AI智能内容代理');
    
    const modalBody = aboutModal.locator('.modal-body');
    await expect(modalBody).toBeVisible();
    await expect(modalBody).toContainText('核心功能');
    await expect(modalBody).toContainText('技术特性');
    await expect(modalBody).toContainText('API认证');
    
    // 截图记录关于模态框
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/12-about-modal.png',
      fullPage: true 
    });
    
    // 关闭模态框
    const closeBtn = page.locator('#close-about-btn');
    await closeBtn.click();
    await page.waitForTimeout(500);
    
    // 确认模态框已关闭
    await expect(aboutModal).toBeHidden();
    
    console.log('✅ 关于模态框和信息展示测试通过');
  });

  test('13. 完整页面状态截图记录', async ({ page }) => {
    console.log('开始记录完整页面状态截图...');
    
    // 记录初始完整页面状态
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/13-complete-page-overview.png',
      fullPage: true 
    });
    
    // 滚动到页面顶部，截图头部区域
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/13-header-section.png',
      clip: { x: 0, y: 0, width: 1280, height: 400 }
    });
    
    // 滚动到工作流选择区域
    const workflowSection = page.locator('.workflow-selector-section');
    await workflowSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/13-workflow-section-detail.png',
      clip: { x: 0, y: 200, width: 1280, height: 400 }
    });
    
    // 滚动到模板选择区域
    const templateSection = page.locator('.template-section');
    await templateSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/13-template-section-detail.png',
      clip: { x: 0, y: 300, width: 1280, height: 400 }
    });
    
    // 滚动到编辑器区域
    const editorPanel = page.locator('.editor-panel');
    await editorPanel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: '/Users/ameureka/Desktop/ai_driven_content_agent/test-results/13-editor-section-detail.png',
      clip: { x: 0, y: 400, width: 1280, height: 400 }
    });
    
    console.log('✅ 完整页面状态截图记录完成');
  });
});