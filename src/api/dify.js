// Dify工作流集成模块
const DIFY_API_URL = 'https://api.dify.ai/v1';

/**
 * 调用Dify工作流API (URL生成，阻塞模式)
 * @param {string} url - 要处理的URL
 * @param {string} apiKey - Dify API密钥
 * @param {number} maxRetries - 最大重试次数
 * @param {number} timeoutMs - 请求超时时间 (毫秒)
 * @returns {Promise<{answer: string}>} - 返回生成的内容
 */
export async function callDifyWorkflow(url, apiKey, maxRetries = 2, timeoutMs = 60000) { // 默认1分钟超时
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    let timeoutId;
    try {
      console.log(`调用Dify URL工作流API (尝试 ${retryCount + 1}/${maxRetries + 1})，URL: ${url}`);

      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: { url},
          response_mode: "blocking",
          user: "url-renderer"
        }),
        signal: controller.signal // 添加超时控制
      });

      if (!response.ok) {
        const errorText = await response.text();
        const status = response.status;
        let errorMessage = `Dify API responded with status ${status}`;
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
          errorMessage += `: ${parsedError.message || errorText}`;
        } catch (e) {
          errorMessage += `: ${errorText}`;
        }
        console.error(`API响应错误 (${status}):`, errorMessage, parsedError || errorText);

        // 针对特定错误进行重试 (例如: 502, 504 网关错误, 429 速率限制)
        if ((status === 502 || status === 504 || status === 429) && retryCount < maxRetries) {
          retryCount++;
          const waitTime = 1500 * Math.pow(2, retryCount - 1); // 指数退避
          console.log(`错误 ${status}，将在 ${waitTime / 1000} 秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // 继续下一次循环尝试
        }
        
        // 对于其他不可重试错误或达到最大重试次数，直接抛出
        throw new Error(errorMessage);
      }

      // 成功响应
      const data = await response.json();
      console.log("Dify URL工作流API调用成功，收到响应。");
      console.log("完整响应数据:", JSON.stringify(data));

      // 提取内容，处理可能的嵌套结构
      let answer = null;
      if (data.answer) {
        answer = data.answer;
      } else if (data.data?.outputs?.text) {
        answer = data.data.outputs.text;
      } else if (data.data?.outputs?.output) {
        answer = data.data.outputs.output;
      } else if (data.outputs?.output) {
        answer = data.outputs.output;
      } else if (data.outputs?.text) {
        answer = data.outputs.text;
      } else if (typeof data.output === 'string') {
        answer = data.output;
      } else if (typeof data.text === 'string') {
        answer = data.text;
      }

      return { answer: answer || '无法获取生成内容' };

    } catch (error) {
      // 如果是 AbortError (超时)
      if (error.name === 'AbortError') {
          console.error(`Dify API请求超时 (${timeoutMs}ms)`);
          if (retryCount < maxRetries) {
              retryCount++;
              console.log(`请求超时，将在 2 秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue; // 继续下一次循环尝试
          } else {
              throw new Error(`Dify API请求在 ${maxRetries + 1} 次尝试后均超时 (${timeoutMs}ms)`);
          }
      } 
      // 其他网络错误或不可重试的 API 错误
      else {
          console.error('调用Dify URL工作流出错:', error.message);
          if (retryCount < maxRetries) {
              retryCount++;
              const waitTime = 1500 * Math.pow(2, retryCount - 1);
              console.log(`网络或未知错误，将在 ${waitTime / 1000} 秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue; // 继续下一次循环尝试
          } else {
              // 达到最大重试次数，抛出最终错误
                      throw new Error(`调用Dify URL工作流失败，经过 ${maxRetries + 1} 次尝试后仍然出错: ${error.message}`);
                  }
              }
            } finally {
              clearTimeout(timeoutId);
            }
  }
  // 如果循环结束仍未成功（理论上不应发生，因为错误会抛出）
  throw new Error(`调用Dify URL工作流最终失败 (重试 ${maxRetries} 次后)`);
}

/**
 * 调用Dify工作流API (URL生成，流式模式)
 * @param {string} url - 要处理的URL
 * @param {string} apiKey - Dify API密钥
 * @param {Object} callbacks - 回调函数
 * @param {Function} callbacks.onStart - 开始处理时的回调
 * @param {Function} callbacks.onProgress - 处理进度回调
 * @param {Function} callbacks.onComplete - 完成处理时的回调
 * @param {Function} callbacks.onError - 错误处理回调
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise<string>} - 返回生成的内容
 */
export function callDifyWorkflowStreaming(url, apiKey, callbacks = {}, maxRetries = 2) {
  return new Promise(async (resolve, reject) => {
    const { onStart, onProgress, onComplete, onError } = callbacks;
    
    // 日志和回调辅助函数
    const log = (message, data = null) => {
      const logMsg = data ? `${message}: ${JSON.stringify(data).substring(0, 100)}${JSON.stringify(data).length > 100 ? '...' : ''}` : message;
      console.log(logMsg);
    };

    const notify = (status, data = {}) => {
      if (onProgress) onProgress(status, data);
    };

    if (onStart) onStart();
    log(`开始调用Dify URL工作流 (流式): ${url}`);

    let streamTimeout;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        clearTimeout(streamTimeout);
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
            inputs: { url },
            response_mode: "streaming", // 关键改动：启用流式模式
            user: "url-renderer-streaming"
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
            log(`Received raw data: ${data}`);

            if (data === "[DONE]") {
              log("收到流结束标记 [DONE]");
              clearTimeout(streamTimeout);
              if (onComplete) onComplete(finalContent);
              resolve(finalContent);
              return;
            }

            try {
              const parsedData = JSON.parse(data);
              console.log("=== URL WORKFLOW DEBUG: Parsed data ===");
              console.log("Event type:", parsedData.event);
              console.log("Full parsed data:", JSON.stringify(parsedData, null, 2));
              
              if (parsedData.event === 'workflow_finished') {
                console.log('=== URL WORKFLOW DEBUG: workflow_finished event ===');
                console.log('Event data:', JSON.stringify(parsedData.data, null, 2));
                
                // 提取最终结果 - 复用difyArticle.js的逻辑
                let extractedContent = extractContentFromResponse(parsedData.data);
                if (extractedContent) {
                  finalContent = extractedContent;
                  console.log('=== URL WORKFLOW DEBUG: Final content set ===');
                  console.log('Final content length:', finalContent.length);
                }
                
                clearTimeout(streamTimeout);
                if (onComplete) onComplete(finalContent);
                resolve(finalContent);
                return;
              } else if (parsedData.event === 'node_finished') {
                console.log('=== URL WORKFLOW DEBUG: node_finished event ===');
                
                // 检查是否有输出内容
                if (parsedData.data && parsedData.data.outputs) {
                  let nodeContent = extractContentFromResponse(parsedData.data);
                  if (nodeContent && (!finalContent || nodeContent.length > finalContent.length)) {
                    finalContent = nodeContent;
                    console.log('=== URL WORKFLOW DEBUG: Updated content from node_finished ===');
                  }
                }
              } else if (parsedData.event === 'text_chunk') {
                console.log("=== URL WORKFLOW DEBUG: Text chunk event ===");
                if (parsedData.data && parsedData.data.text) {
                  finalContent += parsedData.data.text;
                  notify('接收内容', { content: parsedData.data.text });
                }
              }
              
              // 进度更新
              if (onProgress) {
                onProgress(`处理中: ${parsedData.event}`, { event: parsedData.event });
              }
              
            } catch (e) {
              console.error("=== URL WORKFLOW DEBUG: Parse error ===");
              console.error("Parse error:", e.message);
              console.error("Raw data that failed to parse:", data);
            }
          }
        }
        
      } catch (error) {
        log(`第 ${attempt} 次尝试失败: ${error.message}`);
        if (attempt > maxRetries) {
          log('所有重试都失败');
          if (onError) onError(error);
          reject(error);
          return;
        }
        await new Promise(res => setTimeout(res, 2000 * attempt));
      }
    }
  });
}

// 内容提取辅助函数 - 与difyArticle.js保持一致
function extractContentFromResponse(data) {
  if (!data) return null;
  
  const possibleFields = ['out', 'text', 'content', 'result', 'answer', 'output'];
  
  // 先检查outputs字段
  if (data.outputs) {
    for (const field of possibleFields) {
      if (data.outputs[field]) {
        console.log(`=== URL WORKFLOW DEBUG: Found content in outputs.${field} ===`);
        return data.outputs[field];
      }
    }
  }
  
  // 再检查data字段本身
  for (const field of possibleFields) {
    if (data[field]) {
      console.log(`=== URL WORKFLOW DEBUG: Found content in data.${field} ===`);
      return data[field];
    }
  }
  
  return null;
}