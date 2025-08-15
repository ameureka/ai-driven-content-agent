import { test, expect } from '@playwright/test';

test.describe('工作流选择器功能测试', () => {
  const TEST_URL = 'http://localhost:8787';
  const API_KEY = 'aiwenchuang';
  const TEST_URL_INPUT = 'https://x.com/GitHub_Daily/status/1954082721644392709';

  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
    await page.waitForLoadState('networkidle');
  });

  test('应该正确渲染工作流选择器', async ({ page }) => {
    // 检查工作流选择器容器是否存在
    const workflowSelector = page.locator('.workflow-selector-section');
    await expect(workflowSelector).toBeVisible();

    // 检查工作流网格容器
    const workflowGrid = page.locator('#workflow-grid');
    await expect(workflowGrid).toBeVisible();

    // 检查默认工作流卡片
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await expect(urlWorkflowCard).toBeVisible();
    await expect(urlWorkflowCard.locator('.workflow-info h4')).toContainText('URL内容生成');

    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await expect(textWorkflowCard).toBeVisible();
    await expect(textWorkflowCard.locator('.workflow-info h4')).toContainText('AI文章生成');

    // 检查添加自定义工作流按钮
    const addWorkflowBtn = page.locator('#add-custom-workflow-btn');
    await expect(addWorkflowBtn).toBeVisible();
  });

  test('应该能够选择不同的工作流', async ({ page }) => {
    // 默认应该选中 dify-general
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await expect(urlWorkflowCard).toHaveClass(/active/);

    // 点击文章生成工作流
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await textWorkflowCard.click();

    // 检查选中状态
    await expect(textWorkflowCard).toHaveClass(/active/);
    await expect(urlWorkflowCard).not.toHaveClass(/active/);

    // 切换回URL工作流
    await urlWorkflowCard.click();
    await expect(urlWorkflowCard).toHaveClass(/active/);
    await expect(textWorkflowCard).not.toHaveClass(/active/);
  });

  test('应该根据工作流类型正确显示UI界面', async ({ page }) => {
    const urlSection = page.locator('.url-section');
    const workflowSection = page.locator('.workflow-section');

    // 选择URL工作流
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await urlWorkflowCard.click();
    await page.waitForTimeout(500);

    // URL工作流应该显示URL输入界面，隐藏文章生成界面
    await expect(urlSection).toBeVisible();
    await expect(workflowSection).toBeHidden();

    // 选择文本工作流
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await textWorkflowCard.click();
    await page.waitForTimeout(500);

    // 文本工作流应该显示文章生成界面，隐藏URL输入界面
    await expect(urlSection).toBeHidden();
    await expect(workflowSection).toBeVisible();
  });

  test('应该能够成功调用工作流API端点', async ({ page }) => {
    // 测试获取可用工作流列表API
    const response = await page.request.get(`${TEST_URL}/api/v1/workflows/available`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);

    // 检查默认工作流
    const workflows = data.data;
    const urlWorkflow = workflows.find(w => w.id === 'dify-general');
    const textWorkflow = workflows.find(w => w.id === 'dify-article');

    expect(urlWorkflow).toBeDefined();
    expect(urlWorkflow.type).toBe('url');
    expect(textWorkflow).toBeDefined();
    expect(textWorkflow.type).toBe('text');
  });

  test('应该能够执行URL工作流并显示状态', async ({ page }) => {
    // 选择URL工作流
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await urlWorkflowCard.click();

    // 填入API密钥
    const apiKeyInput = page.locator('#api-key');
    await apiKeyInput.fill(API_KEY);

    // 填入测试URL
    const urlInput = page.locator('#target-url');
    await urlInput.fill(TEST_URL_INPUT);

    // 点击生成按钮
    const generateBtn = page.locator('#generate-from-url');
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    // 检查状态指示器是否显示
    const statusIndicator = page.locator('#url-workflow-status');
    await expect(statusIndicator).toBeVisible();
    
    // 检查按钮状态变化
    await expect(generateBtn).toBeDisabled();
    await expect(generateBtn).toContainText('处理中');
  });

  test('应该能够执行文本工作流并显示状态', async ({ page }) => {
    // 选择文本工作流
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await textWorkflowCard.click();

    // 填入API密钥
    const apiKeyInput = page.locator('#api-key');
    await apiKeyInput.fill(API_KEY);

    // 填入测试内容
    const titleInput = page.locator('#workflow-title');
    await titleInput.fill('AI技术发展');

    const styleInput = page.locator('#workflow-style');
    await styleInput.fill('专业');

    const contextInput = page.locator('#workflow-context');
    await contextInput.fill('人工智能技术的发展趋势');

    // 点击生成按钮
    const generateBtn = page.locator('#generate-article-btn');
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    // 检查状态指示器是否显示
    const statusIndicator = page.locator('#workflow-status');
    await expect(statusIndicator).toBeVisible();
    
    // 检查按钮状态变化
    await expect(generateBtn).toBeDisabled();
    await expect(generateBtn).toContainText('生成中');
  });

  test('应该在选择错误工作流类型时显示错误提示', async ({ page }) => {
    // 首先选择文本工作流
    const textWorkflowCard = page.locator('[data-workflow="dify-article"]');
    await textWorkflowCard.click();

    // 但是尝试填入URL并点击URL生成按钮
    const apiKeyInput = page.locator('#api-key');
    await apiKeyInput.fill(API_KEY);

    // 强制显示URL界面（通过JavaScript）
    await page.evaluate(() => {
      document.querySelector('.url-section').style.display = 'block';
    });

    const urlInput = page.locator('#target-url');
    await urlInput.fill(TEST_URL_INPUT);

    const generateBtn = page.locator('#generate-from-url');
    await generateBtn.click();

    // 应该显示错误通知
    const notification = page.locator('#notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('不支持URL处理');
  });

  test('应该能够点击添加自定义工作流按钮', async ({ page }) => {
    const addWorkflowBtn = page.locator('#add-custom-workflow-btn');
    await addWorkflowBtn.click();

    // 应该显示提示信息
    const notification = page.locator('#notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('自定义工作流功能即将推出');
  });

  test('应该保持向后兼容性', async ({ page }) => {
    // 测试原有的URL生成功能
    const urlWorkflowCard = page.locator('[data-workflow="dify-general"]');
    await urlWorkflowCard.click();

    const apiKeyInput = page.locator('#api-key');
    await apiKeyInput.fill(API_KEY);

    const urlInput = page.locator('#target-url');
    await urlInput.fill(TEST_URL_INPUT);

    const generateBtn = page.locator('#generate-from-url');
    await generateBtn.click();

    // 检查是否调用了正确的API端点
    const response = await page.waitForResponse(response => 
      response.url().includes('/api/v1/workflows/dify-general/execute') && 
      response.request().method() === 'POST'
    );

    expect(response.ok()).toBeTruthy();
  });
});