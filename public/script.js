document.addEventListener('DOMContentLoaded', () => {
  // 应用主逻辑
  const apiKeyInput = document.getElementById('api-key');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const rememberKeyCheckbox = document.getElementById('remember-key');
  const templateCards = document.querySelectorAll('.template-card');
  const pageTitleInput = document.getElementById('page-title');
  const markdownEditor = document.getElementById('markdown-editor');
  const generateBtn = document.getElementById('generate-btn');
  const previewBtn = document.getElementById('preview-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const resetBtn = document.getElementById('reset-btn');
  const pasteBtn = document.getElementById('paste-btn');
  const exampleBtn = document.getElementById('example-btn');
  const clearEditorBtn = document.getElementById('clear-editor-btn');
  const resultPanel = document.getElementById('result-panel');
  const closeResultBtn = document.getElementById('close-result-btn');
  const resultUrl = document.getElementById('result-url');
  const copyUrlBtn = document.getElementById('copy-url-btn');
  const openLinkBtn = document.getElementById('open-link-btn');
  const createNewBtn = document.getElementById('create-new-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const aboutLink = document.getElementById('about-link');
  const aboutModal = document.getElementById('about-modal');
  const closeAboutBtn = document.getElementById('close-about-btn');
  const viewSourceBtn = document.getElementById('view-source-btn');
  const sourceModal = document.getElementById('source-modal');
  const closeSourceBtn = document.getElementById('close-source-btn');
  const copySourceBtn = document.getElementById('copy-source-btn');
  const sourceCodeDisplay = document.getElementById('source-code-display');

  // URL生成功能
  const targetUrlInput = document.getElementById('target-url');
  const generateFromUrlBtn = document.getElementById('generate-from-url');

  // 文章生成功能 - 添加新元素
  const workflowTitleInput = document.getElementById('workflow-title');
  const workflowStyleInput = document.getElementById('workflow-style');
  const workflowContextInput = document.getElementById('workflow-context');
  const generateArticleBtn = document.getElementById('generate-article-btn');
  const workflowStatusIndicator = document.getElementById('workflow-status');
  const urlWorkflowStatusIndicator = document.getElementById('url-workflow-status');

  // 工作流选择器
  const workflowGrid = document.getElementById('workflow-grid');
  const addCustomWorkflowBtn = document.getElementById('add-custom-workflow-btn');

  // 状态变量
  let selectedTemplate = 'article_wechat'; // 默认模板
  let selectedWorkflow = 'dify-general'; // 当前选中的工作流
  let availableWorkflows = new Map(); // 可用工作流列表
  let generatedUrl = null;
  let isDarkTheme = localStorage.getItem('darkTheme') !== null ? localStorage.getItem('darkTheme') === 'true' : true; // 默认使用深色模式
  let isGeneratingArticle = false; // 用于跟踪文章生成状态
  let isGeneratingFromUrl = false; // 用于跟踪URL工作流状态

  // 初始化应用
  function initializeApp() {
    // 加载保存的API密钥
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      apiKeyInput.value = savedApiKey;
      rememberKeyCheckbox.checked = true;
    }

    // 设置默认选中的模板
    templateCards.forEach(card => {
      if (card.dataset.template === selectedTemplate) {
        card.classList.add('selected');
      }
    });

    // 应用主题
    applyTheme();

    // 初始化工作流选择器
    initializeWorkflowSelector();

    // 确保模态框和加载动画初始化为隐藏状态
    aboutModal.classList.add('hidden');
    loadingOverlay.classList.add('hidden');
    
    // 隐藏源码模态框
    sourceModal.classList.add('hidden');
    
    // 检查workflow-section是否正确显示
    const workflowSection = document.querySelector('.workflow-section');
    if (workflowSection) {
      console.log('文章生成功能区域存在于DOM中');
      // 确保不被隐藏
      workflowSection.style.display = 'flex';
    } else {
      console.error('文章生成功能区域不存在于DOM中');
    }
  }

  // 应用主题
  function applyTheme() {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      themeToggleBtn.innerHTML = '<i class="icon ion-md-sunny"></i>';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggleBtn.innerHTML = '<i class="icon ion-md-moon"></i>';
    }
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notification-icon');
    const notificationMessage = document.getElementById('notification-message');

    // 设置图标和类
    notificationIcon.className = 'icon';
    switch (type) {
      case 'success':
        notificationIcon.classList.add('ion-md-checkmark-circle');
        notificationIcon.classList.add('success');
        break;
      case 'error':
        notificationIcon.classList.add('ion-md-close-circle');
        notificationIcon.classList.add('error');
        break;
      case 'warning':
        notificationIcon.classList.add('ion-md-warning');
        notificationIcon.classList.add('warning');
        break;
      default:
        notificationIcon.classList.add('ion-md-information-circle');
        notificationIcon.classList.add('info');
    }

    // 设置消息并显示
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');

    // 3秒后自动隐藏
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }

  // 生成排版
  async function generateFormatting() {
    const apiKey = apiKeyInput.value.trim();
    const content = markdownEditor.value.trim();
    const title = pageTitleInput.value.trim();

    // 验证输入
    if (!apiKey) {
      showNotification('请输入API密钥', 'error');
      apiKeyInput.focus();
      return;
    }

    if (!content) {
      showNotification('请输入Markdown内容', 'error');
      markdownEditor.focus();
      return;
    }

    try {
      // 显示加载动画
      loadingOverlay.classList.remove('hidden');

      // 准备请求数据
      const requestData = {
        content: content,
        template: selectedTemplate
      };

      // 如果有标题，添加到请求数据
      if (title) {
        requestData.title = title;
      }

      // 发送API请求 - 使用新的RESTful API端点
      // const apiUrl = 'https://my-markdown-renderer.lynnwongchina.workers.dev/upload';
      const apiUrl = `${window.location.protocol}//${window.location.host}/api/v1/content/render`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      // 确保无论如何都隐藏加载动画
      loadingOverlay.classList.add('hidden');

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      if (data.success) {
        // 保存API密钥（如果选择了记住）
        if (rememberKeyCheckbox.checked) {
          localStorage.setItem('apiKey', apiKey);
        } else {
          localStorage.removeItem('apiKey');
        }

        // 保存生成的URL并显示结果 - 兼容多种响应格式
        // 尝试从不同的路径获取htmlUrl
        generatedUrl = data.data?.htmlUrl || 
                      data.htmlUrl || 
                      data.data?.data?.htmlUrl ||
                      null;
        
        if (!generatedUrl) {
          console.error('响应数据结构:', data);
          throw new Error('无法从响应中获取生成的URL');
        }
        
        resultUrl.textContent = generatedUrl;
        resultUrl.href = generatedUrl;
        resultPanel.classList.remove('hidden');
        previewBtn.disabled = false;
        copyLinkBtn.disabled = false;
      } else {
        throw new Error(data.message || '未知错误');
      }
    } catch (error) {
      // 确保隐藏加载动画
      loadingOverlay.classList.add('hidden');
      showNotification(`错误: ${error.message}`, 'error');
    }
  }

  // 重置应用
  function resetApp() {
    // 清空输入
    markdownEditor.value = '';
    pageTitleInput.value = '';
    generatedUrl = null;

    // 重置模板选择
    templateCards.forEach(card => {
      card.classList.remove('selected');
      if (card.dataset.template === 'article_wechat') {
      card.classList.add('selected');
      selectedTemplate = 'article_wechat';
      }
    });

    // 禁用相关按钮
    previewBtn.disabled = true;
    copyLinkBtn.disabled = true;

    showNotification('已重置', 'info');
  }

  // 提供Markdown示例
  function insertExample() {
    const examples = {
      article_wechat: `# 通用文章示例

这是一个**微信公众号**文章示例。支持丰富的*排版样式*和特殊内容块。

## 主要内容

- 支持目录自动生成
- 响应式设计
- 微信HTML兼容

:::note
这是一个提示信息块，用于展示重要提醒。
:::

### 代码示例

\`\`\`javascript
// 微信公众号文章代码展示
function wechatArticle() {
  console.log("Hello WeChat!");
}
\`\`\`

更多信息请访问[官方文档](https://example.com)。`,

      tech_analysis_wechat: `# 技术深度解析：AI大模型发展趋势

**人工智能大模型**正在重塑整个科技行业，本文将深入分析其发展趋势和技术原理。

## 核心技术突破

1. Transformer架构优化
2. 多模态融合技术
3. 参数高效微调

:::tip
大模型的发展离不开算力、数据和算法的协同进步。
:::

## 技术架构分析

\`\`\`python
# GPT模型核心结构
class TransformerBlock:
    def __init__(self, d_model, n_heads):
        self.attention = MultiHeadAttention(d_model, n_heads)
        self.ffn = FeedForward(d_model)
        
    def forward(self, x):
        x = self.attention(x) + x
        x = self.ffn(x) + x
        return x
\`\`\`

## 未来展望

:::warning
大模型发展需要关注安全性、可解释性等关键问题。
:::`,

      news_modern_wechat: `# 科技快讯：OpenAI发布GPT-5模型

**2024年最重要的AI突破**来了！OpenAI今日正式发布GPT-5，性能较前代提升显著。

## 核心亮点

🚀 **性能提升**：推理能力提升300%
🎯 **多模态**：支持文本、图像、音频
⚡ **效率优化**：响应速度提升50%

:::note
本次发布标志着AGI时代的重要里程碑。
:::

## 技术规格

| 参数 | GPT-4 | GPT-5 |
|------|-------|-------|
| 参数量 | 1.76T | 10T+ |
| 上下文长度 | 128K | 1M |
| 训练数据 | 13T tokens | 50T+ tokens |

> 这将彻底改变人工智能应用的格局。

更多详情请关注[OpenAI官网](https://openai.com)。`,

      github_project_wechat: `# 开源项目推荐：Next.js 15.0

**Next.js 15.0** 正式发布！这个React全栈框架带来了革命性的改进。

## 🌟 主要特性

### App Router 2.0
- 更快的路由性能
- 改进的缓存策略
- 增强的开发体验

### Turbopack稳定版
\`\`\`bash
# 安装最新版本
npm install next@latest

# 启用Turbopack
npm run dev -- --turbo
\`\`\`

:::tip
Turbopack比Webpack快10倍，显著提升开发效率。
:::

## 📊 性能对比

| 构建工具 | 冷启动时间 | 热更新时间 |
|----------|------------|------------|
| Webpack | 2.3s | 0.8s |
| Turbopack | 0.2s | 0.1s |

## 🚀 快速开始

\`\`\`javascript
// app/page.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js 15!</h1>
    </div>
  )
}
\`\`\`

⭐ **GitHub**: [vercel/next.js](https://github.com/vercel/next.js)`,

      ai_benchmark_wechat: `# AI模型基准测试：Claude 3.5 vs GPT-4o

最新的**AI模型对比测试**结果出炉！我们对两大主流模型进行了全面评估。

## 📊 测试维度

### 代码能力测试
\`\`\`python
# 测试用例：算法实现
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\`

## 🏆 评测结果

| 测试项目 | Claude 3.5 | GPT-4o | 胜者 |
|----------|------------|--------|---------|
| 代码生成 | 92% | 89% | 🥇 Claude |
| 数学推理 | 88% | 94% | 🥇 GPT-4o |
| 创意写作 | 91% | 87% | 🥇 Claude |
| 多语言理解 | 85% | 90% | 🥇 GPT-4o |

:::note
测试基于1000个标准化任务，结果仅供参考。
:::

## 💡 使用建议

:::tip
**代码开发**：推荐Claude 3.5
**数学计算**：推荐GPT-4o
**内容创作**：两者都很优秀
:::`,

      professional_analysis_wechat: `# 专业分析报告：2024年AI行业发展白皮书

## 📋 执行摘要

本报告深入分析了**2024年人工智能行业**的发展现状、技术趋势和市场机遇。

:::note
本报告基于500+企业调研和100+专家访谈。
:::

## 🔍 市场现状分析

### 市场规模
- 全球AI市场：$1,847亿美元（+37.3% YoY）
- 中国AI市场：$462亿美元（+42.1% YoY）
- 预计2025年突破$3,000亿美元

## 📈 发展趋势

### 1. 大模型商业化加速
:::tip
**关键指标**：
- 企业采用率：68%（+23% YoY）
- 平均ROI：312%
- 部署周期：缩短至3-6个月
:::

## 🎯 投资建议

:::warning
**风险提示**：
- 技术迭代风险
- 监管政策变化
- 数据安全挑战
:::`
    };

    // 根据选中的模板插入示例
    markdownEditor.value = examples[selectedTemplate] || examples.article_wechat;
    pageTitleInput.value = '示例文档';
    showNotification('已插入示例内容', 'success');
  }

  // 查看源码功能
  async function viewSourceCode() {
    if (!generatedUrl) return;
    
    try {
      // 显示加载动画
      loadingOverlay.classList.remove('hidden');
      
      // 使用fetch获取页面HTML源码
      const response = await fetch(generatedUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取源码失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // 将HTML源码显示在模态框中
        // 转义HTML以防止浏览器解析
        const escapedHtml = data.html
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        
        sourceCodeDisplay.innerHTML = escapedHtml;
        sourceModal.classList.remove('hidden');
      } else {
        throw new Error(data.message || '未知错误');
      }
    } catch (error) {
      showNotification(`错误: ${error.message}`, 'error');
    } finally {
      // 隐藏加载动画
      loadingOverlay.classList.add('hidden');
    }
  }

  // 从URL生成内容（支持流式处理）
  async function generateFromUrl() {
    console.log('=== 使用动态工作流的generateFromUrl函数被调用 ===');
    const apiKey = apiKeyInput.value.trim();
    const url = targetUrlInput.value.trim();
    
    // 获取当前选中的工作流
    const workflow = availableWorkflows.get(selectedWorkflow);
    console.log('当前选中的工作流:', workflow);

    // 验证输入
    if (!apiKey) {
      showNotification('请输入API密钥', 'error');
      apiKeyInput.focus();
      return;
    }

    if (!url) {
      showNotification('请输入目标URL', 'error');
      targetUrlInput.focus();
      return;
    }

    if (!workflow) {
      showNotification('请选择一个工作流', 'error');
      return;
    }
    if (workflow.type !== 'url') {
      showNotification('当前选择的工作流不支持URL处理，请选择URL类型的工作流', 'error');
      return;
    }

    try {
      // 更新按钮状态
      isGeneratingFromUrl = true;
      generateFromUrlBtn.disabled = true;
      generateFromUrlBtn.innerHTML = '<i class="icon ion-md-sync animated-spin"></i> 处理中...';
      
      // 显示状态指示器
      if (urlWorkflowStatusIndicator) {
        urlWorkflowStatusIndicator.innerHTML = '<span class="status-dot active"></span> 准备中...';
        urlWorkflowStatusIndicator.classList.remove('hidden');
      }

      // 保存API密钥（如果选择了记住）
      if (rememberKeyCheckbox.checked) {
        localStorage.setItem('apiKey', apiKey);
      } else {
        localStorage.removeItem('apiKey');
      }

      // 构建流式API请求（使用动态工作流ID）
      const apiUrl = `${window.location.protocol}//${window.location.host}/api/v1/workflows/${selectedWorkflow}/execute`;
      const requestBody = { inputs: { url } };
      
      console.log(`请求URL: ${apiUrl}`);
      console.log('请求参数:', { ...requestBody });
      
      // 开始API调用，使用POST请求
      await fetchWithRetryUrl(apiUrl, requestBody, apiKey);
      
    } catch (error) {
      console.error('URL处理错误:', error);
      showNotification(`错误: ${error.message}`, 'error');
      completeUrlGeneration();
    }
  }

  // 生成文章内容
  async function generateArticleContent() {
    console.log('=== 使用动态工作流的generateArticleContent函数被调用 ===');
    const apiKey = apiKeyInput.value.trim();
    console.log('API密钥值:', apiKey ? '已设置' : '未设置', '长度:', apiKey.length);
    const title = workflowTitleInput.value.trim();
    const style = workflowStyleInput.value.trim();
    const context = workflowContextInput.value.trim();
    
    // 获取当前选中的工作流
    const workflow = availableWorkflows.get(selectedWorkflow);
    console.log('当前选中的工作流:', workflow);

    // 验证输入
    if (!apiKey) {
      showNotification('请输入API密钥', 'error');
      apiKeyInput.focus();
      return;
    }

    if (!title) {
      showNotification('请输入标题', 'error');
      workflowTitleInput.focus();
      return;
    }
    if (!workflow) {
      showNotification('请选择一个工作流', 'error');
      return;
    }
    if (workflow.type !== 'text') {
      showNotification('当前选择的工作流不支持文本生成，请选择文本类型的工作流', 'error');
      return;
    }

    try {
      // 更新状态
      isGeneratingArticle = true;
      generateArticleBtn.disabled = true;
      generateArticleBtn.innerHTML = '<i class="icon ion-md-sync animated-spin"></i> 生成中...';
      workflowStatusIndicator.innerHTML = '<span class="status-dot active"></span> 准备中...';
      workflowStatusIndicator.classList.remove('hidden');

      // 保存API密钥（如果选择了记住）
      if (rememberKeyCheckbox.checked) {
        localStorage.setItem('apiKey', apiKey);
      } else {
        localStorage.removeItem('apiKey');
      }

      // 构建API请求（使用动态工作流ID）
      const apiUrl = `${window.location.protocol}//${window.location.host}/api/v1/workflows/${selectedWorkflow}/execute`;
      const requestBody = {
        title: title,
        style: style || '',
        context: context || ''
      };
      
      console.log(`请求URL: ${apiUrl}`);
      console.log('请求参数:', { ...requestBody });
      
      // 开始API调用，使用POST请求
      await fetchWithRetryPost(apiUrl, requestBody, apiKey);
      
    } catch (error) {
      console.error('文章生成错误:', error);
      showNotification(`错误: ${error.message}`, 'error');
      completeArticleGeneration();
    }
  }
  
  // 带重试机制的EventSource请求
  async function fetchWithRetry(url, maxRetries = 2) {
    let currentRetry = 0;
    let currentEventSource = null;
    
    // 创建一个Promise包装EventSource
    return new Promise((resolve, reject) => {
      function setupEventSource() {
        // 关闭前一个连接（如果存在）
        if (currentEventSource && currentEventSource.readyState !== 2) {
          currentEventSource.close();
        }
        
        // 创建新连接
        currentEventSource = new EventSource(url);
        console.log(`建立EventSource连接 (尝试 ${currentRetry + 1}/${maxRetries + 1})`);
        
        // 配置消息处理
        currentEventSource.onmessage = (event) => {
          try {
            console.log('=== SSE DEBUG: Raw message received ===');
            console.log('Event data:', event.data);
            console.log('Event type:', typeof event.data);
            console.log('Event length:', event.data.length);
            
            if (event.data === '[DONE]') {
              console.log('=== SSE DEBUG: Received DONE signal ===');
              currentEventSource.close();
              completeArticleGeneration();
              resolve();
              return;
            }
            
            const data = JSON.parse(event.data);
            console.log('=== SSE DEBUG: Parsed data ===');
            console.log('Data type:', data.type);
            console.log('Full data object:', JSON.stringify(data, null, 2));
            
            // 处理不同类型的事件
            if (data.type === 'complete' && data.content) {
              console.log('=== SSE DEBUG: Complete event with content ===');
              console.log(`生成完成，收到最终内容: ${data.content.length} 字符`);
              console.log('Content preview (first 200 chars):', data.content.substring(0, 200));
              markdownEditor.value = data.content;
              markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
              currentEventSource.close();
              completeArticleGeneration();
              resolve();
              return;
            } else if (data.type === 'progress' && data.data && data.data.content) {
              console.log('=== SSE DEBUG: Progress event ===');
              console.log(`进度更新: 收到 ${data.data.content.length} 字符`);
              console.log('Progress content preview:', data.data.content.substring(0, 100));
              markdownEditor.value += data.data.content;
              markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (data.status) {
              console.log('=== SSE DEBUG: Status event ===');
              console.log(`状态更新: ${data.status}`);
              console.log('Has content field:', !!data.content);
              console.log('Has result field:', !!data.result);
              console.log('Has done field:', !!data.done);
              workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> ${data.status}`;
              
              // 如果有内容更新，填充到编辑器
              if (data.content) {
                console.log('=== SSE DEBUG: Content update from status event ===');
                console.log(`内容更新: 收到 ${data.content.length} 字符`);
                console.log('Content preview:', data.content.substring(0, 200));
                markdownEditor.value = data.content;
                // 触发input事件以便可能的双向绑定能够更新
                markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
              }
              // 新增: 处理data.result字段
              else if (data.result) {
                console.log('=== SSE DEBUG: Result update from status event ===');
                console.log(`内容更新 (result): 收到 ${data.result.length} 字符`);
                console.log('Result preview:', data.result.substring(0, 200));
                markdownEditor.value = data.result;
                // 触发input事件以便可能的双向绑定能够更新
                markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
              }
              
              // 如果生成完成
              if (data.done) {
                console.log('=== SSE DEBUG: Generation done ===');
                currentEventSource.close();
                completeArticleGeneration();
                resolve();
              }
            } else if (data.error) {
              const errorMsg = data.error || '未知错误';
              console.error('=== SSE DEBUG: Error event ===');
              console.error(`服务器返回错误: ${errorMsg}`);
              currentEventSource.close();
              reject(new Error(errorMsg));
            } else {
              console.log('=== SSE DEBUG: Unknown event type ===');
              console.log('Unknown type:', data.type);
              console.log('Full unknown data:', JSON.stringify(data, null, 2));
            }
          } catch (error) {
            console.error('=== SSE DEBUG: JSON Parse Error ===');
            console.error('Parse error:', error);
            console.error('Raw data that failed to parse:', event.data);
            console.error('Raw data type:', typeof event.data);
          }
        };
        
        // 配置错误处理
        currentEventSource.onerror = (error) => {
          console.error('EventSource错误:', error);
          currentEventSource.close();
          
          if (currentRetry < maxRetries) {
            // 准备重试
            currentRetry++;
            const retryDelay = 1000 * currentRetry; // 逐渐增加延迟
            
            workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 连接中断，${retryDelay/1000}秒后重试 (${currentRetry}/${maxRetries})...`;
            console.log(`连接中断，${retryDelay/1000}秒后进行第${currentRetry}次重试`);
            
            // 延迟后重试
            setTimeout(setupEventSource, retryDelay);
          } else {
            // 所有重试失败，切换到模拟数据
            console.log('所有重试均失败，使用模拟数据');
            workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 切换到本地数据生成...`;
            showNotification('无法连接到服务器，将使用本地数据生成内容', 'warning');
            
            // 获取表单数据
            const title = workflowTitleInput.value.trim();
            const style = workflowStyleInput.value.trim();
            const context = workflowContextInput.value.trim();
            
            // 使用模拟数据并解析Promise
            useMockData(title, style, context);
            resolve();
          }
        };
        
        // 配置打开处理
        currentEventSource.onopen = () => {
          console.log('EventSource连接已打开');
          workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 连接已建立，等待响应...`;
        };
      }
      
      // 开始第一次连接
      setupEventSource();
    });
  }
  
  // 带重试机制的POST请求（用于新API）
  async function fetchWithRetryPost(url, requestBody, apiKey, maxRetries = 2) {
    let currentRetry = 0;
    
    return new Promise(async (resolve, reject) => {
      async function makeRequest() {
        try {
          console.log(`发起POST请求 (尝试 ${currentRetry + 1}/${maxRetries + 1})`);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          // 检查响应的Content-Type来决定如何处理
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            // 处理JSON响应
            const data = await response.json();
            console.log('收到JSON响应:', data);
            console.log('markdownEditor元素:', markdownEditor);
            console.log('markdownEditor是否存在:', !!markdownEditor);
            
            // 提取内容 - 修复Dify工作流的响应解析
            let content = null;
            console.log('=== 响应数据结构分析 ===');
            console.log('完整响应:', JSON.stringify(data, null, 2));
            
            // 根据终端日志显示的实际响应格式进行解析
            if (data.success && data.data && data.data.result) {
              // 检查result是否是字符串（直接内容）
              if (typeof data.data.result === 'string') {
                content = data.data.result;
                console.log('从data.data.result提取内容（字符串格式）');
              }
              // 检查result是否是对象且包含content字段
              else if (data.data.result && typeof data.data.result === 'object' && data.data.result.content) {
                content = data.data.result.content;
                console.log('从data.data.result.content提取内容');
              }
              // 检查result是否是对象且包含answer字段
              else if (data.data.result && typeof data.data.result === 'object' && data.data.result.answer) {
                content = data.data.result.answer;
                console.log('从data.data.result.answer提取内容');
              }
            }
            // 备用提取路径
            else if (data.content) {
              content = data.content;
              console.log('从data.content提取内容');
            } else if (data.answer) {
              content = data.answer;
              console.log('从data.answer提取内容');
            } else if (data.result) {
              content = data.result;
              console.log('从data.result提取内容');
            }
            
            console.log('提取的内容:', content);
            console.log('内容类型:', typeof content);
            
            if (content && content !== 'undefined') {
              console.log(`生成完成，收到内容: ${content.length} 字符`);
              if (markdownEditor) {
                markdownEditor.value = content;
                console.log('已设置markdownEditor.value:', markdownEditor.value.substring(0, 100) + '...');
                markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('已触发input事件');
              } else {
                console.error('markdownEditor元素未找到!');
              }
            } else {
              console.log('响应中没有有效内容');
              if (markdownEditor) {
                markdownEditor.value = '# 生成完成\n\n抱歉，本次生成没有返回内容。请尝试重新生成或检查输入参数。';
                markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
            
            completeArticleGeneration();
            resolve();
            return;
          } else {
            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');
              
              for (const line of lines) {
                if (line.trim() === '') continue;
                
                try {
                  if (line === '[DONE]') {
                    console.log('接收到完成信号');
                    completeArticleGeneration();
                    resolve();
                    return;
                  }
                  
                  const data = JSON.parse(line);
                  
                  // 处理不同类型的事件
                  console.log('=== POST STREAM DEBUG: Processing line ===');
                  console.log('Line content:', line);
                  console.log('Line type:', typeof line);
                  
                  if (data.type === 'complete') {
                    console.log('=== POST STREAM DEBUG: Complete event ===');
                    console.log('Complete data structure:', JSON.stringify(data, null, 2));
                    console.log('Has hasContent field:', !!data.hasContent);
                    console.log('HasContent value:', data.hasContent);
                    console.log('Has content field:', !!data.content);
                    console.log('Content value type:', typeof data.content);
                    console.log('Content value:', data.content);
                    
                    // 修复：正确处理content字段，即使hasContent为false也要检查content
                    if (data.content && data.content !== 'undefined' && data.content.trim()) {
                      console.log('=== POST STREAM DEBUG: Valid content found ===');
                      console.log(`生成完成，收到最终内容: ${data.content.length} 字符`);
                      console.log('Content preview (first 200 chars):', data.content.substring(0, 200));
                      markdownEditor.value = data.content;
                      markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                      console.log('=== POST STREAM DEBUG: No valid content in complete event ===');
                      console.log('完成事件中没有有效内容，保持当前编辑器内容');
                      console.log('Current editor content length:', markdownEditor.value.length);
                      // 如果编辑器仍然是空的，显示一个提示
                      if (!markdownEditor.value.trim()) {
                        console.log('=== POST STREAM DEBUG: Editor is empty, adding fallback content ===');
                        markdownEditor.value = '# 文章生成完成\n\n抱歉，本次生成没有返回内容。请尝试重新生成或检查输入参数。';
                        markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }
                    completeArticleGeneration();
                    resolve();
                    return;
                  } else if (data.type === 'progress' && data.data && data.data.content) {
                    console.log('=== POST STREAM DEBUG: Progress event ===');
                    console.log(`进度更新: 收到 ${data.data.content.length} 字符`);
                    console.log('Progress content preview:', data.data.content.substring(0, 100));
                    markdownEditor.value += data.data.content;
                    markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                  } else if (data.status) {
                    console.log('=== POST STREAM DEBUG: Status event ===');
                    console.log(`状态更新: ${data.status}`);
                    console.log('Has content field:', !!data.content);
                    console.log('Has result field:', !!data.result);
                    console.log('Has done field:', !!data.done);
                    workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> ${data.status}`;
                    
                    if (data.content && data.content !== 'undefined') {
                      console.log('=== POST STREAM DEBUG: Content update from status ===');
                      console.log(`内容更新: 收到 ${data.content.length} 字符`);
                      console.log('Content preview:', data.content.substring(0, 200));
                      markdownEditor.value = data.content;
                      markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (data.result && data.result !== 'undefined') {
                      console.log('=== POST STREAM DEBUG: Result update from status ===');
                      console.log(`内容更新 (result): 收到 ${data.result.length} 字符`);
                      console.log('Result preview:', data.result.substring(0, 200));
                      markdownEditor.value = data.result;
                      markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    
                    if (data.done) {
                      console.log('=== POST STREAM DEBUG: Generation done ===');
                      completeArticleGeneration();
                      resolve();
                      return;
                    }
                  } else if (data.error) {
                    const errorMsg = data.error || '未知错误';
                    console.error('=== POST STREAM DEBUG: Error event ===');
                    console.error(`服务器返回错误: ${errorMsg}`);
                    reject(new Error(errorMsg));
                    return;
                  } else {
                    console.log('=== POST STREAM DEBUG: Unknown event type ===');
                    console.log('Unknown type:', data.type);
                    console.log('Full unknown data:', JSON.stringify(data, null, 2));
                  }
                } catch (parseError) {
                  console.error('=== POST STREAM DEBUG: Parse Error ===');
                  console.error('Parse error:', parseError);
                  console.error('Failed line:', line);
                  console.error('Line type:', typeof line);
                  console.error('Line length:', line.length);
                }
              }
            }
          }
          
          completeArticleGeneration();
          resolve();
          
        } catch (error) {
          console.error('请求失败:', error);
          
          if (currentRetry < maxRetries) {
            currentRetry++;
            const retryDelay = 1000 * currentRetry;
            
            workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 请求失败，${retryDelay/1000}秒后重试 (${currentRetry}/${maxRetries})...`;
            console.log(`请求失败，${retryDelay/1000}秒后进行第${currentRetry}次重试`);
            
            setTimeout(makeRequest, retryDelay);
          } else {
            console.log('所有重试均失败，使用模拟数据');
            workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 切换到本地数据生成...`;
            showNotification('无法连接到服务器，将使用本地数据生成内容', 'warning');
            
            const title = requestBody.title;
            const style = requestBody.style;
            const context = requestBody.context;
            
            useMockData(title, style, context);
            resolve();
          }
        }
      }
      
      makeRequest();
    });
  }
  
  // 使用模拟数据生成内容
  function useMockData(title, style, context) {
    const styleText = style ? `以${style}的风格` : '';
    const mockContent = `# ${title}

## 引言

这是关于${title}的内容${styleText}。这是一个由本地模拟数据生成的内容，因为服务器连接暂时不可用。

## 主要内容

### 1. ${title}的重要性

在当今快速发展的世界中，${title}变得越来越重要。理解它的核心概念和应用场景可以帮助我们更好地应对挑战。

### 2. 关键技术和方法

- 结构化思维
- 清晰表达
- 技术应用
- 实践案例

### 3. 未来展望

随着技术的不断发展，${title}将继续演化，并在更多领域发挥作用。

## 总结

${title}是一个重要的话题，它将继续影响我们的工作和生活。通过深入理解和应用，我们能够从中获得更多价值。`;

    // 模拟进度更新
    const steps = [
      { status: '准备模拟数据...', delay: 500 },
      { status: '生成标题...', content: `# ${title}\n\n`, delay: 800 },
      { status: '生成引言...', content: `# ${title}\n\n## 引言\n\n这是关于${title}的内容${styleText}。`, delay: 1200 },
      { status: '生成主要内容...', content: mockContent.substring(0, Math.floor(mockContent.length * 0.6)), delay: 1500 },
      { status: '完善详细内容...', content: mockContent, delay: 1000 },
      { status: '生成完成', content: mockContent, done: true, delay: 800 }
    ];
    
    // 更新编辑器内容
    let stepIndex = 0;
    
    function processNextStep() {
      if (stepIndex >= steps.length) {
        completeArticleGeneration();
        return;
      }
      
      const step = steps[stepIndex++];
      workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> ${step.status}`;
      
      if (step.content) {
        markdownEditor.value = step.content;
        markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      if (step.done) {
        setTimeout(() => {
          completeArticleGeneration();
        }, step.delay);
      } else {
        setTimeout(processNextStep, step.delay);
      }
    }
    
    // 开始模拟数据生成
    processNextStep();
  }

  // 完成文章生成
  function completeArticleGeneration() {
    isGeneratingArticle = false;
    generateArticleBtn.disabled = false;
    generateArticleBtn.innerHTML = '<i class="icon ion-md-create"></i> AI生成';
    workflowStatusIndicator.innerHTML = '<span class="status-dot completed"></span> 生成完成';
    
    // 5秒后隐藏状态指示器
    setTimeout(() => {
      if (!isGeneratingArticle) {
        workflowStatusIndicator.classList.add('hidden');
      }
    }, 5000);
  }

  // 完成URL生成
  function completeUrlGeneration() {
    isGeneratingFromUrl = false;
    generateFromUrlBtn.disabled = false;
    generateFromUrlBtn.innerHTML = '<i class="icon ion-md-cloud-download"></i> 从URL生成';
    
    if (urlWorkflowStatusIndicator) {
      urlWorkflowStatusIndicator.innerHTML = '<span class="status-dot completed"></span> 处理完成';
      setTimeout(() => {
        if (!isGeneratingFromUrl) {
          urlWorkflowStatusIndicator.classList.add('hidden');
        }
      }, 3000);
    }
  }

  // URL工作流的流式处理函数
  async function fetchWithRetryUrl(url, requestBody, apiKey, maxRetries = 2) {
    // 首先尝试流式处理
    try {
      await fetchWithRetryUrlStreaming(url, requestBody, apiKey, maxRetries);
    } catch (error) {
      console.log('流式处理失败，降级到阻塞模式:', error.message);
      await fallbackToBlockingMode(url, requestBody, apiKey);
    }
  }

  // URL工作流流式处理
  async function fetchWithRetryUrlStreaming(apiUrl, requestBody, apiKey, maxRetries = 2) {
    const streamUrl = `${apiUrl}?stream=true`;
    
    let currentRetry = 0;
    let currentEventSource = null;
    
    return new Promise((resolve, reject) => {
      function setupEventSource() {
        if (currentEventSource && currentEventSource.readyState !== 2) {
          currentEventSource.close();
        }
        
        // 构建流式请求URL（需要POST数据的特殊处理）
        const postData = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
          },
          body: JSON.stringify(requestBody)
        };
        
        // 使用fetch创建流式连接
        setupStreamingFetch(streamUrl, postData, resolve, reject);
      }
      
      function setupStreamingFetch(url, options, resolve, reject) {
        fetch(url, options)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            function readStream() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  console.log('URL工作流流式读取完成');
                  completeUrlGeneration();
                  resolve();
                  return;
                }
                
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                
                let boundary;
                while ((boundary = buffer.indexOf('\n')) !== -1) {
                  const line = buffer.substring(0, boundary);
                  buffer = buffer.substring(boundary + 1);
                  
                  if (!line.startsWith('data:')) continue;
                  const data = line.slice(5).trim();
                  
                  if (data === '[DONE]') {
                    console.log('收到URL工作流完成信号');
                    completeUrlGeneration();
                    resolve();
                    return;
                  }
                  
                  try {
                    const parsedData = JSON.parse(data);
                    console.log('=== URL WORKFLOW DEBUG: 收到事件 ===', parsedData.type);
                    
                    if (parsedData.type === 'complete' && parsedData.content) {
                      console.log(`URL处理完成，收到内容: ${parsedData.content.length} 字符`);
                      markdownEditor.value = parsedData.content;
                      markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                      showNotification('内容已生成', 'success');
                      completeUrlGeneration();
                      resolve();
                      return;
                    } else if (parsedData.status) {
                      if (urlWorkflowStatusIndicator) {
                        urlWorkflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> ${parsedData.status}`;
                      }
                      
                      if (parsedData.content) {
                        markdownEditor.value = parsedData.content;
                        markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                      
                      if (parsedData.done) {
                        completeUrlGeneration();
                        resolve();
                      }
                    } else if (parsedData.type === 'error') {
                      throw new Error(parsedData.message || '处理出错');
                    }
                  } catch (e) {
                    console.error('URL工作流解析错误:', e);
                  }
                }
                
                return readStream();
              });
            }
            
            return readStream();
          })
          .catch(error => {
            console.error('URL工作流流式连接错误:', error);
            
            if (currentRetry < maxRetries) {
              currentRetry++;
              const retryDelay = 1000 * currentRetry;
              
              if (urlWorkflowStatusIndicator) {
                urlWorkflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 连接中断，${retryDelay/1000}秒后重试 (${currentRetry}/${maxRetries})...`;
              }
              
              setTimeout(() => setupEventSource(), retryDelay);
            } else {
              console.log('所有重试均失败，抛出错误');
              reject(error);
            }
          });
      }
      
      setupEventSource();
    });
  }

  // 降级到阻塞模式的函数
  async function fallbackToBlockingMode(baseUrl, requestBody, apiKey) {
    try {
      if (urlWorkflowStatusIndicator) {
        urlWorkflowStatusIndicator.innerHTML = '<span class="status-dot active"></span> 使用备用处理模式...';
      }
      
      showNotification('正在使用备用处理模式', 'warning');
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '处理失败');
      }
      
      if (data.success) {
        let content = null;
        if (data.data?.result?.content) {
          content = data.data.result.content;
        } else if (data.data?.result?.answer) {
          content = data.data.result.answer;
        } else if (data.content) {
          content = data.content;
        } else {
          content = '无法获取生成内容';
        }
        
        markdownEditor.value = content;
        markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
        showNotification('内容已生成（备用模式）', 'success');
      } else {
        throw new Error(data.message || '未知错误');
      }
    } catch (error) {
      showNotification(`处理失败: ${error.message}`, 'error');
    }
    completeUrlGeneration();
  }

  // ======= 事件监听器 =======

  // 处理模板选择
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      // 移除所有卡片的选中状态
      templateCards.forEach(c => c.classList.remove('selected'));
      // 添加当前卡片的选中状态
      card.classList.add('selected');
      // 更新选中的模板
      selectedTemplate = card.dataset.template;
    });
  });

  // 密码显示/隐藏切换
  togglePasswordBtn.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      togglePasswordBtn.innerHTML = '<i class="icon ion-md-eye-off"></i>';
    } else {
      apiKeyInput.type = 'password';
      togglePasswordBtn.innerHTML = '<i class="icon ion-md-eye"></i>';
    }
  });

  // 生成按钮点击
  generateBtn.addEventListener('click', generateFormatting);

  // 预览按钮点击
  previewBtn.addEventListener('click', () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  });

  // 复制链接按钮点击
  copyLinkBtn.addEventListener('click', () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
        .then(() => {
          showNotification('链接已复制到剪贴板', 'success');
        })
        .catch(err => {
          showNotification('复制失败: ' + err, 'error');
        });
    }
  });

  // 重置按钮点击
  resetBtn.addEventListener('click', () => {
    resetApp();
    // 确保加载动画被隐藏
    loadingOverlay.classList.add('hidden');
  });

  // 粘贴按钮点击
  pasteBtn.addEventListener('click', () => {
    navigator.clipboard.readText()
      .then(text => {
        if (text) {
          markdownEditor.value = text;
          showNotification('内容已从剪贴板粘贴', 'success');
        } else {
          showNotification('剪贴板为空', 'warning');
        }
      })
      .catch(err => {
        showNotification('无法访问剪贴板: ' + err, 'error');
      });
  });

  // 示例按钮点击
  exampleBtn.addEventListener('click', insertExample);

  // 清空编辑器按钮点击
  clearEditorBtn.addEventListener('click', () => {
    markdownEditor.value = '';
    showNotification('编辑器已清空', 'info');
  });

  // 结果面板关闭按钮
  closeResultBtn.addEventListener('click', () => {
    resultPanel.classList.add('hidden');
  });

  // 复制URL按钮
  copyUrlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedUrl)
      .then(() => {
        showNotification('链接已复制到剪贴板', 'success');
      })
      .catch(err => {
        showNotification('复制失败: ' + err, 'error');
      });
  });

  // 打开链接按钮
  openLinkBtn.addEventListener('click', () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  });

  // 创建新排版按钮
  createNewBtn.addEventListener('click', () => {
    resultPanel.classList.add('hidden');
    resetApp();
  });

  // 主题切换按钮
  themeToggleBtn.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('darkTheme', isDarkTheme);
    applyTheme();
  });

  // 关于链接
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.classList.remove('hidden');
  });

  // 关闭关于模态框
  closeAboutBtn.addEventListener('click', () => {
    aboutModal.classList.add('hidden');
  });

  // 点击模态框背景关闭
  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.add('hidden');
    }
  });
  
  // 自定义工作流相关事件监听器
  const customWorkflowModal = document.getElementById('custom-workflow-modal');
  const closeCustomWorkflowBtn = document.getElementById('close-custom-workflow-btn');
  const cancelWorkflowBtn = document.getElementById('cancel-workflow-btn');
  const customWorkflowForm = document.getElementById('custom-workflow-form');
  
  // 关闭自定义工作流模态框
  if (closeCustomWorkflowBtn) {
    closeCustomWorkflowBtn.addEventListener('click', hideCustomWorkflowModal);
  }
  
  if (cancelWorkflowBtn) {
    cancelWorkflowBtn.addEventListener('click', hideCustomWorkflowModal);
  }
  
  // 点击模态框背景关闭
  if (customWorkflowModal) {
    customWorkflowModal.addEventListener('click', (e) => {
      if (e.target === customWorkflowModal) {
        hideCustomWorkflowModal();
      }
    });
  }
  
  // 自定义工作流表单提交
  if (customWorkflowForm) {
    customWorkflowForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(customWorkflowForm);
      const data = {
        id: document.getElementById('workflow-id').value.trim().toLowerCase(),
        name: document.getElementById('workflow-name').value.trim(),
        description: document.getElementById('workflow-description').value.trim(),
        type: document.getElementById('workflow-type').value,
        apiKey: document.getElementById('workflow-api-key').value.trim(),
        icon: document.getElementById('workflow-icon').value
      };
      
      // 设置根据类型的inputFields
      if (data.type === 'url') {
        data.inputFields = ['url'];
      } else if (data.type === 'text') {
        data.inputFields = ['title', 'style', 'context'];
      }
      
      // 验证表单
      if (validateWorkflowForm(data)) {
        await saveCustomWorkflow(data);
      }
    });
  }

  // 查看源码按钮
  viewSourceBtn.addEventListener('click', async () => {
    if (generatedUrl) {
      try {
        // 显示加载状态
        loadingOverlay.classList.remove('hidden');
        
        // 使用fetch获取HTML内容
        const response = await fetch(generatedUrl, {
          headers: {
            'Accept': 'text/html'
          }
        });
        
        if (!response.ok) {
          throw new Error('获取源代码失败');
        }
        
        // 获取HTML源码
        const htmlSource = await response.text();
        
        // 在模态框中显示源码，转义HTML以正确显示
        sourceCodeDisplay.textContent = htmlSource;
        
        // 显示模态框
        sourceModal.classList.remove('hidden');
      } catch (error) {
        showNotification(`错误: ${error.message}`, 'error');
      } finally {
        // 隐藏加载状态
        loadingOverlay.classList.add('hidden');
      }
    }
  });
  
  // 关闭源码模态框
  closeSourceBtn.addEventListener('click', () => {
    sourceModal.classList.add('hidden');
  });
  
  // 点击源码模态框背景关闭
  sourceModal.addEventListener('click', (e) => {
    if (e.target === sourceModal) {
      sourceModal.classList.add('hidden');
    }
  });
  
  // 复制源代码按钮
  copySourceBtn.addEventListener('click', () => {
    const sourceToCopy = sourceCodeDisplay.textContent;
    if (sourceToCopy) {
      navigator.clipboard.writeText(sourceToCopy)
        .then(() => {
          showNotification('源代码已复制到剪贴板', 'success');
        })
        .catch(err => {
          showNotification('复制失败: ' + err, 'error');
        });
    }
  });

  // 按ESC键关闭模态框和结果面板
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resultPanel.classList.add('hidden');
      aboutModal.classList.add('hidden');
      sourceModal.classList.add('hidden');
      // 确保加载动画被隐藏
      loadingOverlay.classList.add('hidden');
    }
  });

  // 页面加载完成时强制隐藏加载动画
  window.addEventListener('load', function() {
    setTimeout(() => {
      // 确保加载动画被隐藏（额外的安全措施）
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }
    }, 500);
  });

  // 绑定事件
  generateFromUrlBtn.addEventListener('click', generateFromUrl);

  // URL输入框回车事件
  targetUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateFromUrl();
    }
  });

  // 更新按钮状态的函数
  function updateGenerateFromUrlButton() {
    const url = targetUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    generateFromUrlBtn.disabled = !url || !apiKey;
  }

  // 添加输入监听
  targetUrlInput.addEventListener('input', updateGenerateFromUrlButton);
  apiKeyInput.addEventListener('input', updateGenerateFromUrlButton);

  // 初始化按钮状态
  updateGenerateFromUrlButton();

  // 工作流选择器相关函数
  async function initializeWorkflowSelector() {
    console.log('初始化工作流选择器...');
    
    // 初始化默认工作流
    availableWorkflows.set('dify-general', {
      id: 'dify-general',
      name: 'URL内容生成',
      description: '从网页链接生成内容',
      type: 'url',
      icon: 'ion-md-cloud-download',
      isCustom: false
    });
    
    availableWorkflows.set('dify-article', {
      id: 'dify-article',
      name: 'AI文章生成',
      description: '基于关键词生成文章',
      type: 'text',
      icon: 'ion-md-create',
      isCustom: false
    });
    
    // 从服务器加载自定义工作流
    await loadCustomWorkflows();
    
    // 渲染工作流选择器
    renderWorkflowSelector();
    
    // 绑定工作流选择事件
    bindWorkflowEvents();
  }
  
  async function loadCustomWorkflows() {
    try {
      const response = await fetch('/api/v1/workflows/available');
      if (response.ok) {
        const { success, data } = await response.json();
        if (success && Array.isArray(data)) {
          // 过滤出自定义工作流（isCustom为true）
          const customWorkflows = data.filter(workflow => workflow.isCustom);
          customWorkflows.forEach(workflow => {
            availableWorkflows.set(workflow.id, {
              ...workflow,
              isCustom: true
            });
          });
          console.log(`加载了 ${customWorkflows.length} 个自定义工作流`);
        }
      }
    } catch (error) {
      console.log('加载自定义工作流失败:', error.message);
    }
  }
  
  function renderWorkflowSelector() {
    const defaultWorkflows = Array.from(availableWorkflows.values()).filter(w => !w.isCustom);
    const customWorkflows = Array.from(availableWorkflows.values()).filter(w => w.isCustom);
    
    workflowGrid.innerHTML = '';
    
    // 渲染默认工作流
    defaultWorkflows.forEach(workflow => {
      const workflowCard = createWorkflowCard(workflow);
      workflowGrid.appendChild(workflowCard);
    });
    
    // 渲染自定义工作流
    customWorkflows.forEach(workflow => {
      const workflowCard = createWorkflowCard(workflow);
      workflowCard.classList.add('custom');
      workflowGrid.appendChild(workflowCard);
    });
  }
  
  function createWorkflowCard(workflow) {
    const isActive = workflow.id === selectedWorkflow;
    const iconColor = workflow.type === 'url' ? 
      'background-color: rgba(54, 112, 254, 0.1); color: #3670fe;' : 
      'background-color: rgba(54, 179, 126, 0.1); color: #36b37e;';
    
    const card = document.createElement('div');
    card.className = `workflow-card ${isActive ? 'active' : ''}`;
    card.dataset.workflow = workflow.id;
    card.dataset.type = workflow.type;
    
    card.innerHTML = `
      <div class="workflow-icon" style="${iconColor}">
        <i class="icon ${workflow.icon}"></i>
      </div>
      <div class="workflow-info">
        <h4>${workflow.name}</h4>
        <p>${workflow.description}</p>
        <span class="workflow-type">${workflow.type === 'url' ? 'URL处理' : '文本生成'}</span>
      </div>
      ${workflow.isCustom ? '<button class="delete-workflow-btn" data-workflow-id="' + workflow.id + '" title="删除工作流"><i class="icon ion-md-close"></i></button>' : ''}
    `;
    
    return card;
  }
  
  function bindWorkflowEvents() {
    // 工作流选择和删除事件
    workflowGrid.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-workflow-btn');
      if (deleteBtn) {
        // 阻止事件冒泡，防止触发工作流选择
        e.stopPropagation();
        const workflowId = deleteBtn.dataset.workflowId;
        deleteCustomWorkflow(workflowId);
        return;
      }
      
      const workflowCard = e.target.closest('.workflow-card');
      if (workflowCard) {
        selectWorkflow(workflowCard.dataset.workflow);
      }
    });
    
    // 添加自定义工作流按钮事件
    addCustomWorkflowBtn.addEventListener('click', showAddWorkflowModal);
  }
  
  function selectWorkflow(workflowId) {
    if (!availableWorkflows.has(workflowId)) {
      console.error('工作流不存在:', workflowId);
      return;
    }
    
    // 更新选中状态
    selectedWorkflow = workflowId;
    
    // 更新UI
    workflowGrid.querySelectorAll('.workflow-card').forEach(card => {
      card.classList.toggle('active', card.dataset.workflow === workflowId);
    });
    
    // 更新界面可见性
    updateWorkflowUI();
    
    console.log('选择了工作流:', workflowId);
  }
  
  function updateWorkflowUI() {
    const workflow = availableWorkflows.get(selectedWorkflow);
    if (!workflow) return;
    
    // 根据工作流类型显示/隐藏相应的输入区域
    const urlSection = document.querySelector('.url-section');
    const workflowSection = document.querySelector('.workflow-section');
    
    if (workflow.type === 'url') {
      // URL类型工作流：显示URL输入，隐藏文章生成
      urlSection.style.display = 'block';
      workflowSection.style.display = 'none';
    } else if (workflow.type === 'text') {
      // 文本类型工作流：显示文章生成，隐藏URL输入
      urlSection.style.display = 'none';
      workflowSection.style.display = 'block';
    }
  }
  
  function showAddWorkflowModal() {
    const modal = document.getElementById('custom-workflow-modal');
    const form = document.getElementById('custom-workflow-form');
    
    // 重置表单
    form.reset();
    clearFormErrors();
    
    // 显示模态框
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // 聚焦第一个输入框
    setTimeout(() => {
      document.getElementById('workflow-id').focus();
    }, 100);
  }
  
  function hideCustomWorkflowModal() {
    const modal = document.getElementById('custom-workflow-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  
  function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const errorInputs = document.querySelectorAll('.error');
    
    errorElements.forEach(el => el.remove());
    errorInputs.forEach(el => el.classList.remove('error'));
  }
  
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // 移除已存在的错误
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // 添加错误样式和消息
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
  }
  
  function validateWorkflowForm(data) {
    clearFormErrors();
    let isValid = true;
    
    // 验证ID格式
    if (!data.id.match(/^[a-z0-9-]+$/)) {
      showFieldError('workflow-id', 'ID只能包含小写字母、数字和连字符');
      isValid = false;
    }
    
    // 验证必填字段
    if (!data.id.trim()) {
      showFieldError('workflow-id', '请输入工作流ID');
      isValid = false;
    }
    
    if (!data.name.trim()) {
      showFieldError('workflow-name', '请输入工作流名称');
      isValid = false;
    }
    
    if (!data.type) {
      showFieldError('workflow-type', '请选择工作流类型');
      isValid = false;
    }
    
    if (!data.apiKey.trim()) {
      showFieldError('workflow-api-key', '请输入Dify API密钥');
      isValid = false;
    }
    
    // 验证API密钥格式
    if (data.apiKey && !data.apiKey.startsWith('app-')) {
      showFieldError('workflow-api-key', 'API密钥应以"app-"开头');
      isValid = false;
    }
    
    return isValid;
  }
  
  async function saveCustomWorkflow(data) {
    const saveBtn = document.getElementById('save-workflow-btn');
    const originalText = saveBtn.innerHTML;
    
    try {
      // 显示加载状态
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="icon ion-md-refresh rotating"></i>保存中...';
      
      const response = await fetch('/api/v1/workflows/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCurrentApiKey()}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // 成功添加
        showNotification('自定义工作流添加成功！', 'success');
        hideCustomWorkflowModal();
        
        // 重新加载工作流列表
        await loadCustomWorkflows();
        renderWorkflowSelector();
        
        // 自动选择新添加的工作流
        selectWorkflow(data.id);
        
      } else {
        // 处理业务错误
        const errorMessage = result.error?.details || result.message || '添加工作流失败';
        showNotification(errorMessage, 'error');
        
        // 如果是ID冲突，高亮ID字段
        if (result.error?.code === 'INVALID_INPUT' && errorMessage.includes('已存在')) {
          showFieldError('workflow-id', '该ID已存在，请使用其他ID');
        }
      }
      
    } catch (error) {
      console.error('保存自定义工作流失败:', error);
      showNotification('网络错误，请稍后重试', 'error');
    } finally {
      // 恢复按钮状态
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  }
  
  function getCurrentApiKey() {
    // 从页面获取当前设置的API密钥
    const apiKeyInput = document.getElementById('api-key');
    return apiKeyInput ? apiKeyInput.value || 'aiwenchuang' : 'aiwenchuang';
  }
  
  async function deleteCustomWorkflow(workflowId) {
    const workflow = availableWorkflows.get(workflowId);
    if (!workflow || !workflow.isCustom) {
      showNotification('只能删除自定义工作流', 'error');
      return;
    }
    
    // 确认删除
    if (!confirm(`确定要删除工作流"${workflow.name}"吗？此操作不可撤销。`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/v1/workflows/custom/${workflowId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCurrentApiKey()}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // 成功删除
        showNotification('工作流删除成功', 'success');
        
        // 从本地列表中移除
        availableWorkflows.delete(workflowId);
        
        // 如果删除的是当前选中的工作流，切换到默认工作流
        if (selectedWorkflow === workflowId) {
          selectedWorkflow = 'dify-general';
        }
        
        // 重新渲染工作流选择器
        renderWorkflowSelector();
        updateWorkflowUI();
        
      } else {
        const errorMessage = result.error?.details || result.message || '删除工作流失败';
        showNotification(errorMessage, 'error');
      }
      
    } catch (error) {
      console.error('删除自定义工作流失败:', error);
      showNotification('网络错误，请稍后重试', 'error');
    }
  }

// 添加文章生成按钮点击事件
  if (generateArticleBtn) {
    generateArticleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateArticleContent();
    });
  }

  // 初始化应用
  initializeApp();
  
  // 自动填入测试数据并触发生成 - 已注释掉以显示placeholder效果
  /*
  setTimeout(() => {
    // 先填入API密钥
    const apiKeyInput = document.getElementById('api-key');
    if (apiKeyInput) {
      apiKeyInput.value = 'test-api-key-for-demo';
      console.log('已自动填入测试API密钥');
    }
    
    // 填入测试URL
    const urlInput = document.getElementById('target-url');
    if (urlInput) {
      urlInput.value = 'https://x.com/GitHub_Daily/status/1954082721644392709';
      console.log('已自动填入测试URL:', urlInput.value);
      
      // 再等待2秒后自动点击生成按钮
      setTimeout(() => {
        const generateBtn = document.getElementById('generate-from-url');
        if (generateBtn && !generateBtn.disabled) {
          console.log('自动触发文章生成...');
          generateBtn.click();
        } else {
          console.log('生成按钮不可用或未找到');
        }
      }, 2000);
    }
  }, 1000);
  */
});