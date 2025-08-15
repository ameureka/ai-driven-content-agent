import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 测试目录
  testDir: './test',
  
  // 全局测试配置
  globalTimeout: 30 * 60 * 1000, // 30 minutes
  timeout: 60 * 1000, // 60 seconds per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
  
  // 并行执行配置
  fullyParallel: false, // 禁用并行执行以避免端口冲突
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // 单线程执行
  
  // 报告器配置
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['list']
  ],
  
  // 全局测试配置
  use: {
    // 基础URL
    baseURL: 'http://localhost:8787',
    
    // 浏览器配置
    headless: false, // 非无头模式，方便观察测试过程
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // 截图和视频配置
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // 超时配置
    actionTimeout: 10 * 1000, // 10 seconds for actions
    navigationTimeout: 30 * 1000, // 30 seconds for navigation
  },
  
  // 输出目录
  outputDir: 'test-results',
  
  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // 添加一些Chrome特定的配置
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
    },
    
    // 可选：添加其他浏览器测试
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  
  // 本地开发服务器配置（如果需要的话）
  webServer: {
    command: 'npm run dev',
    port: 8787,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes to start server
    stdout: 'pipe',
    stderr: 'pipe',
  },
});