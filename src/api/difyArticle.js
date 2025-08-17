// Dify工作流集成模块 - 专门用于文章生成功能
const DIFY_API_URL = 'https://api.dify.ai/v1';

/**
 * 调用Dify工作流API生成文章内容(流式响应)
 * @param {Object} inputs - 输入参数：prompt(标题)、style(风格)、context(上下文)
 * @param {string} apiKey - Dify API密钥
 * @param {Object} callbacks - 回调函数对象
 * @param {Function} callbacks.onStart - 开始生成时的回调
 * @param {Function} callbacks.onProgress - 生成进度回调，接收状态和数据
 * @param {Function} callbacks.onComplete - 完成生成时的回调，接收最终内容
 * @param {Function} callbacks.onError - 错误处理回调
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise<Object>} 返回带cancel方法的对象，可取消生成
 */
export function callDifyArticleWorkflow(inputs, apiKey, callbacks = {}, maxRetries = 2) {
  return new Promise(async (resolve, reject) => {
    const { onStart, onProgress, onComplete, onError } = callbacks;

    // 日志和回调辅助函数
    const log = (message, data = null) => {
      const logMsg = data ? `${message}: ${JSON.stringify(data).substring(0, 100)}${data.length > 100 ? '...' : ''}` : message;
      console.log(logMsg);
    };

    const notify = (status, data = {}) => {
      if (onProgress) onProgress(status, data);
    };

    if (onStart) onStart();
    log(`开始调用Dify文章工作流: ${inputs.prompt || inputs.title || '未知标题'}`);

    let streamTimeout;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        clearTimeout(streamTimeout); // 清除上一轮的超时
        streamTimeout = setTimeout(() => {
          reject(new Error("Stream timed out after 60 seconds of inactivity."));
        }, 60000); // 60秒无数据超时
        const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            inputs,
            response_mode: "streaming",
            user: "markdown-renderer-user",
          }),
          signal: AbortSignal.timeout(300000), // 5分钟超时
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API响应错误 (${response.status}): ${errorText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalContent = "";
        let lastDataTimestamp = Date.now();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            log("流读取完成");
            clearTimeout(streamTimeout);
            if (onComplete) onComplete(finalContent);
            resolve(finalContent);
            return;
          }

          clearTimeout(streamTimeout);
          streamTimeout = setTimeout(() => {
            reject(new Error("Stream timed out after 60 seconds of inactivity."));
          }, 60000);

          const chunk = decoder.decode(value, { stream: true });
          log(`Received chunk`, chunk);
          buffer += chunk;
          let boundary;
          while ((boundary = buffer.indexOf('\n')) !== -1) {
            const line = buffer.substring(0, boundary);
            buffer = buffer.substring(boundary + 1);

            if (!line.startsWith("data:")) continue;

            const data = line.slice(5).trim();
            log(`Received raw data: ${data}`); // 增加原始数据日志

            if (data === "[DONE]") {
              log("收到流结束标记 [DONE]");
              clearTimeout(streamTimeout);
              if (onComplete) onComplete(finalContent);
              resolve(finalContent);
              return;
            }

            try {
              const parsedData = JSON.parse(data);
              console.log("=== DIFY API DEBUG: Parsed data ===");
              console.log("Event type:", parsedData.event);
              console.log("Full parsed data:", JSON.stringify(parsedData, null, 2));
              
              if (parsedData.event === 'workflow_finished') {
                console.log('=== DIFY API DEBUG: workflow_finished event ===');
                console.log('Event data:', JSON.stringify(parsedData.data, null, 2));
                
                // 尝试从不同可能的字段提取内容
                let extractedContent = null;
                
                if (parsedData.data && parsedData.data.outputs) {
                  console.log('=== DIFY API DEBUG: Found outputs ===');
                  console.log('Outputs keys:', Object.keys(parsedData.data.outputs));
                  
                  // 尝试多种可能的字段名
                  const possibleFields = ['out', 'text', 'content', 'result', 'answer', 'output'];
                  for (const field of possibleFields) {
                    if (parsedData.data.outputs[field]) {
                      extractedContent = parsedData.data.outputs[field];
                      console.log(`=== DIFY API DEBUG: Found content in outputs.${field} ===`);
                      console.log('Content preview:', extractedContent.substring(0, 200) + '...');
                      break;
                    }
                  }
                }
                
                if (!extractedContent && parsedData.data) {
                  console.log('=== DIFY API DEBUG: Checking data directly ===');
                  console.log('Data keys:', Object.keys(parsedData.data));
                  
                  const possibleFields = ['out', 'text', 'content', 'result', 'answer', 'output'];
                  for (const field of possibleFields) {
                    if (parsedData.data[field]) {
                      extractedContent = parsedData.data[field];
                      console.log(`=== DIFY API DEBUG: Found content in data.${field} ===`);
                      console.log('Content preview:', extractedContent.substring(0, 200) + '...');
                      break;
                    }
                  }
                }
                
                if (extractedContent) {
                  finalContent = extractedContent;
                  console.log('=== DIFY API DEBUG: Final content set from workflow_finished ===');
                  console.log('Final content length:', finalContent.length);
                  console.log('Final content preview:', finalContent.substring(0, 300) + '...');
                } else {
                  console.log('=== DIFY API DEBUG: No content found in workflow_finished ===');
                  console.log('Full event data:', JSON.stringify(parsedData, null, 2));
                }
                
                clearTimeout(streamTimeout);
                console.log("=== DIFY API DEBUG: Calling onComplete with finalContent ===");
                console.log("Final content being passed:", finalContent);
                if (onComplete) onComplete(finalContent);
                resolve(finalContent);
                return;
              } else if (parsedData.event === 'node_finished') {
                console.log('=== DIFY API DEBUG: node_finished event ===');
                console.log('Event data preview:', JSON.stringify(parsedData.data, null, 2).substring(0, 500) + '...');
                
                // 检查是否有输出内容
                if (parsedData.data && parsedData.data.outputs) {
                  console.log('=== DIFY API DEBUG: Found outputs in node_finished ===');
                  console.log('Outputs keys:', Object.keys(parsedData.data.outputs));
                  
                  // 尝试多种可能的字段名
                  const possibleFields = ['out', 'text', 'content', 'result', 'answer', 'output'];
                  for (const field of possibleFields) {
                    if (parsedData.data.outputs[field]) {
                      const nodeContent = parsedData.data.outputs[field];
                      console.log(`=== DIFY API DEBUG: Found content in node outputs.${field} ===`);
                      
                      // 类型检查：确保是字符串后再调用 substring
                      const contentStr = typeof nodeContent === 'string' ? nodeContent : String(nodeContent);
                      console.log('Content preview:', contentStr.substring(0, 200) + '...');
                      console.log('Content type:', typeof nodeContent);
                      
                      // 如果还没有最终内容，或者这个内容更长，就使用这个内容
                      if (!finalContent || contentStr.length > finalContent.length) {
                        finalContent = contentStr;
                        console.log('=== DIFY API DEBUG: Updated final content from node_finished ===');
                        console.log('Final content length:', finalContent.length);
                      }
                      break;
                    }
                  }
                }
              } else if (parsedData.event === 'text_chunk') {
                console.log("=== DIFY API DEBUG: Text chunk event ===");
                console.log("Has data field:", !!parsedData.data);
                console.log("Has text field:", !!(parsedData.data && parsedData.data.text));
                
                if (parsedData.data && parsedData.data.text) {
                  console.log("=== DIFY API DEBUG: Adding text chunk to finalContent ===");
                  console.log("Chunk text:", parsedData.data.text);
                  console.log("Current finalContent length before:", finalContent.length);
                  
                  finalContent += parsedData.data.text;
                  
                  console.log("Current finalContent length after:", finalContent.length);
                  notify('接收内容', { content: parsedData.data.text });
                } else {
                  console.log("=== DIFY API DEBUG: No text in text_chunk event ===");
                  if (parsedData.data) {
                    console.log("Available data fields:", Object.keys(parsedData.data));
                  }
                }
              } else {
                console.log("=== DIFY API DEBUG: Unknown event type ===");
                console.log("Event:", parsedData.event);
                console.log("Available fields:", Object.keys(parsedData));
              }
            } catch (e) {
              console.error("=== DIFY API DEBUG: Parse error ===");
              console.error("Parse error:", e.message);
              console.error("Raw data that failed to parse:", data);
              console.error("Data type:", typeof data);
              console.error("Data length:", data.length);
            }
          }
        }
      } catch (error) {
        log(`第 ${attempt} 次尝试失败: ${error.message}`);
        if (attempt > maxRetries) {
          log('所有重试都失败，切换到模拟数据');
          // 切换到模拟数据
          createMockResponse(inputs, {
            ...callbacks,
            onComplete: (content) => {
              if (onComplete) onComplete(content);
              resolve(content);
            }
          });
          return;
        }
        await new Promise(res => setTimeout(res, 2000 * attempt));
      }
    }
  });
}

function createMockResponse(inputs, callbacks = {}) {
  const { onStart, onProgress, onComplete } = callbacks;
  const { title, style = '', context = '' } = inputs;
  
  console.log('使用模拟数据生成文章，标题:', title);
  
  // 生成模拟内容
  const mockContent = generateMockContent(title, style, context);
  
  // 模拟事件发送状态
  let isCancelled = false;
  
  // 首次回调
  if (onStart) onStart();
  
  // 定义模拟的事件序列
  const mockEvents = [
    { status: '正在初始化生成...', delay: 300 },
    { status: '工作流已开始', data: { workflowRunId: `mock-${Date.now()}` }, delay: 400 },
    { status: '节点开始处理', data: { nodeId: 'node-input-processing' }, delay: 500 },
    { status: '接收内容', data: { 
      content: mockContent.substring(0, mockContent.indexOf('\n\n') + 4),
      result: mockContent.substring(0, mockContent.indexOf('\n\n') + 4)
    }, delay: 700 },
    { status: '节点处理完成 (1)', data: { nodeCount: 1 }, delay: 300 },
    { status: '节点开始处理', data: { nodeId: 'node-content-generation' }, delay: 300 },
    { status: '接收内容', data: { 
      content: mockContent.substring(0, Math.floor(mockContent.length * 0.4)),
      result: mockContent.substring(0, Math.floor(mockContent.length * 0.4))
    }, delay: 1200 },
    { status: '接收内容', data: { 
      content: mockContent.substring(0, Math.floor(mockContent.length * 0.7)),
      result: mockContent.substring(0, Math.floor(mockContent.length * 0.7))
    }, delay: 1000 },
    { status: '节点处理完成 (2)', data: { nodeCount: 2 }, delay: 300 },
    { status: '节点开始处理', data: { nodeId: 'node-final-formatting' }, delay: 400 },
    { status: '接收内容', data: { 
      content: mockContent,
      result: mockContent
    }, delay: 800 },
    { status: '节点处理完成 (3)', data: { nodeCount: 3 }, delay: 300 },
    { status: '生成完成', data: { 
      content: mockContent, 
      result: mockContent,
      done: true 
    }, delay: 400 }
  ];
  
  // 发送模拟事件的函数
  const sendEvents = (index = 0) => {
    if (isCancelled || index >= mockEvents.length) return;
    
    const event = mockEvents[index];
    if (onProgress) onProgress(event.status, event.data || {});
    
    if (index === mockEvents.length - 1) {
      // 最后一个事件后完成生成
      setTimeout(() => {
        if (!isCancelled && onComplete) onComplete(mockContent);
      }, event.delay);
    } else {
      // 继续发送下一个事件
      setTimeout(() => sendEvents(index + 1), event.delay);
    }
  };
  
  // 开始发送模拟事件
  setTimeout(() => sendEvents(0), 200);
  
  // 返回取消函数
  return {
    cancel: () => {
      isCancelled = true;
      if (onProgress) onProgress('已取消', { canceled: true });
      console.log('用户取消了模拟生成');
    }
  };
}

/**
 * 根据标题、风格和上下文生成模拟文章内容
 * @param {string} title - 文章标题
 * @param {string} style - 文章风格
 * @param {string} context - 上下文/要求
 * @returns {string} 生成的Markdown内容
 */
function generateMockContent(title, style = '', context = '') {
  // 确保标题安全
  const safeTitle = title.replace(/[<>]/g, '');
  const styleText = style ? `以${style}的风格` : '';
  const contextDesc = context ? `根据"${context}"的要求` : '';
  
  // 基本模拟内容框架
  return `# ${safeTitle}

## 引言

这是关于${safeTitle}的内容${styleText}${contextDesc}。这是一个由本地模拟数据生成的内容，因为Dify API连接不可用。

## 主要内容

### 1. ${safeTitle}的重要性

在当今快速发展的世界中，${safeTitle}变得越来越重要。理解它的核心概念和应用场景可以帮助我们更好地应对挑战。

${context ? `根据您提供的上下文："${context}"，我们可以进一步探讨以下内容。\n\n` : ''}

### 2. 关键技术和方法

- 结构化思维应用
- 清晰表达的技巧
- 实用技术和工具
- 真实案例分析
${style === '专业' ? '- 数据驱动的决策方法\n- 领域特定的最佳实践' : ''}
${style === '活泼' ? '- 生动有趣的演示方式\n- 互动参与的技巧' : ''}
${style === '学术' ? '- 研究方法论\n- 文献综述技巧' : ''}

### 3. 应用场景

${safeTitle}可以应用于多个领域，包括但不限于：

1. 教育培训
2. 企业管理
3. 个人发展
4. 技术创新
${context ? '5. ' + context.split(' ')[0] : ''}

### 4. 未来展望

随着技术的不断发展，${safeTitle}将继续演化，并在更多领域发挥作用。我们可以预见：

- 更智能化的应用
- 更广泛的融合
- 更深入的专业化

## 总结

${safeTitle}是一个重要的话题，它将继续影响我们的工作和生活。通过深入理解和应用，我们能够从中获得更多价值和机会。

希望本文对您了解${safeTitle}有所帮助。`;
}