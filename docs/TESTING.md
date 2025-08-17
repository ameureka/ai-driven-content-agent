# 测试指南

## 📋 概述

本文档介绍AI驱动内容代理系统的测试策略、测试环境搭建和测试执行方法。

## 🧪 测试架构

### 测试类型分布
```
        🔺 E2E测试 (5%)
       /              \
      /   集成测试 (25%)   \
     /                    \
    /    单元测试 (70%)      \
   /________________________\
```

| 测试类型 | 占比 | 执行速度 | 主要目的 |
|----------|------|----------|----------|
| **单元测试** | 70% | 极快 | 验证单个函数/组件逻辑 |
| **集成测试** | 25% | 中等 | 验证模块间交互 |
| **端到端测试** | 5% | 较慢 | 验证完整用户流程 |

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- 浏览器支持 (Chrome/Firefox)
- Playwright测试框架

### 安装测试依赖
```bash
# 项目依赖已包含测试框架
npm install

# 安装Playwright浏览器
npx playwright install
```

### 运行测试

#### 运行所有测试
```bash
npm test
```

#### 运行特定类型测试
```bash
# 单元测试
npm run test:unit

# E2E测试
npx playwright test

# 特定测试文件
npx playwright test test/specs/workflow.spec.js

# 显示测试报告
npx playwright show-report
```

## 📁 测试结构

```
test/
├── basic.test.js          # 基础功能测试
├── playwright.config.js   # Playwright配置
└── specs/                 # E2E测试用例
    └── workflow.spec.js   # 工作流测试
```

## 🧩 测试类型详解

### 1. 单元测试

#### API测试示例
```javascript
// test/basic.test.js
import { describe, it, expect } from 'vitest';

describe('API Tests', () => {
  it('should return system status', async () => {
    const response = await fetch('http://localhost:8787/api/v1/status');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('healthy');
  });

  it('should return template list', async () => {
    const response = await fetch('http://localhost:8787/api/v1/templates');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });
});
```

#### 组件测试示例
```javascript
// 工具函数测试
import { validateWorkflowConfig } from '../src/utils/validation.js';

describe('Validation Utils', () => {
  it('should validate workflow config', () => {
    const validConfig = {
      id: 'test-workflow',
      name: '测试工作流',
      apiKey: 'app-valid-key',
      type: 'url'
    };
    
    expect(validateWorkflowConfig(validConfig)).toBe(true);
  });
});
```

### 2. 集成测试

#### API集成测试
```javascript
describe('Workflow Integration', () => {
  it('should execute workflow end-to-end', async () => {
    // 获取工作流列表
    const workflowsResponse = await fetch('/api/v1/workflows/available');
    const workflows = await workflowsResponse.json();
    
    // 执行工作流
    const executeResponse = await fetch('/api/v1/workflows/dify-general/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key'
      },
      body: JSON.stringify({
        inputs: { url: 'https://example.com' }
      })
    });
    
    const result = await executeResponse.json();
    expect(result.success).toBe(true);
  });
});
```

### 3. 端到端测试

#### 工作流E2E测试
```javascript
// test/specs/workflow.spec.js
import { test, expect } from '@playwright/test';

test('workflow execution flow', async ({ page }) => {
  // 访问主页
  await page.goto('http://localhost:8787');
  
  // 选择工作流
  await page.click('[data-workflow="dify-general"]');
  
  // 输入URL
  await page.fill('#url-input', 'https://example.com');
  
  // 执行工作流
  await page.click('#execute-button');
  
  // 等待结果
  await page.waitForSelector('#result', { timeout: 30000 });
  
  // 验证结果
  const result = await page.textContent('#result');
  expect(result).toBeTruthy();
});

test('custom workflow management', async ({ page }) => {
  await page.goto('http://localhost:8787');
  
  // 添加自定义工作流
  await page.click('#add-workflow-btn');
  await page.fill('#workflow-name', '测试工作流');
  await page.fill('#workflow-description', '这是一个测试工作流');
  await page.fill('#workflow-api-key', 'app-test-key');
  await page.selectOption('#workflow-type', 'url');
  await page.click('#save-workflow-btn');
  
  // 验证工作流已添加
  await expect(page.locator('[data-workflow-name="测试工作流"]')).toBeVisible();
});
```

## ⚙️ 测试配置

### Playwright配置
```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/specs',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:8787',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    port: 8787,
    reuseExistingServer: !process.env.CI
  }
});
```

### Vitest配置
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30000
  }
});
```

## 📊 测试覆盖率

### 当前覆盖率目标
- **单元测试覆盖率**: > 80%
- **集成测试覆盖率**: > 70%
- **端到端测试覆盖率**: > 60%

### 检查覆盖率
```bash
# 生成覆盖率报告
npm run test:coverage

# 查看详细报告
open coverage/index.html
```

## 🔧 测试环境

### 本地测试环境
```bash
# 启动测试环境
npm run dev

# 运行测试
npm test
```

### CI/CD环境
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npx playwright test
```

## 🐛 测试调试

### 调试单元测试
```bash
# 运行单个测试
npm test -- --grep "specific test name"

# 调试模式
npm test -- --inspect-brk
```

### 调试E2E测试
```bash
# 显示浏览器界面
npx playwright test --headed

# 调试模式
npx playwright test --debug

# 生成测试录制
npx playwright codegen http://localhost:8787
```

### 常见问题

#### 1. 测试超时
```javascript
// 增加超时时间
test('long running test', async ({ page }) => {
  test.setTimeout(60000); // 60秒超时
  // ... 测试代码
});
```

#### 2. 异步操作等待
```javascript
// 正确等待异步操作
await page.waitForSelector('#result');
await page.waitForFunction(() => document.querySelector('#status').textContent === 'complete');
```

#### 3. API测试认证
```javascript
// 设置测试用的API密钥
const testApiKey = process.env.TEST_API_KEY || 'test-key';
```

## 📝 测试最佳实践

### 1. 测试命名规范
- 描述性测试名称
- 使用 `should` + 动作 + 期望结果
- 分组相关测试用例

### 2. 测试数据管理
- 使用固定的测试数据
- 避免依赖外部API
- 模拟时间敏感的测试

### 3. 测试隔离
- 每个测试独立运行
- 清理测试产生的数据
- 避免测试间依赖

### 4. 断言策略
```javascript
// 明确的断言
expect(result.status).toBe('success');
expect(result.data).toHaveProperty('content');
expect(result.data.content).toMatch(/expected pattern/);

// 避免模糊断言
expect(result).toBeTruthy(); // 不够明确
```

## 📈 性能测试

### 简单性能测试
```javascript
test('API response time', async () => {
  const start = Date.now();
  const response = await fetch('/api/v1/status');
  const duration = Date.now() - start;
  
  expect(response.ok).toBe(true);
  expect(duration).toBeLessThan(2000); // 2秒内响应
});
```

### 负载测试
```bash
# 使用简单的curl测试
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code} %{time_total}\n" \
    http://localhost:8787/api/v1/status
done
```

## 📞 测试支持

测试相关问题:
1. 查看测试日志和错误信息
2. 检查测试环境配置
3. 参考[Playwright文档](https://playwright.dev/)
4. 联系开发团队获取帮助