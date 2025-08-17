/**
 * 微信公众号专用 - AI基准测试模板
 * 基于通用设计原则重构，完全兼容微信公众号约束条件
 * 专门用于 AI 模型评测、技术对比、数据分析报告等内容
 * 遵循微信公众号CSS约束条件，使用行内样式
 */
export default {
  name: 'ai_benchmark_wechat',
  displayName: 'AI基准测试模板',
  description: '专为 AI 模型评测设计的微信公众号模板，完全兼容微信编辑器约束',
  
  // 微信公众号不支持外部CSS和<style>标签，所有样式都通过行内样式实现
  styles: '',

  template: function(data) {
    // 从内容中提取第一个标题作为主标题
    const extractedTitle = this.extractFirstTitle(data.content) || data.title || 'AI基准测试报告：性能评估与技术对比分析';
    
    // 处理元数据
    const benchmarkType = data.benchmarkType || 'performance';
    const testDate = data.testDate || new Date().toLocaleDateString('zh-CN');
    const version = data.version || 'v1.0';
    const organization = data.organization || 'AI Research Lab';
    const dataset = data.dataset || 'Standard Benchmark';
    const models = data.models || [];
    const environment = data.environment || {};
    const subtitle = data.subtitle || '';
    
    // 确定基准测试类型信息
    const getBenchmarkTypeInfo = (type) => {
      switch(type.toLowerCase()) {
        case 'performance': return { class: 'performance', icon: '⚡', text: '性能测试' };
        case 'accuracy': return { class: 'accuracy', icon: '🎯', text: '准确性测试' };
        case 'efficiency': return { class: 'efficiency', icon: '⚙️', text: '效率测试' };
        case 'comparison': return { class: 'comparison', icon: '📊', text: '对比分析' };
        default: return { class: 'performance', icon: '🔬', text: '基准测试' };
      }
    };
    
    const typeInfo = getBenchmarkTypeInfo(benchmarkType);
    
    // 生成全局排名 HTML
    const generateRankingHtml = (models) => {
      if (!models || models.length === 0) return '';
      
      return models.slice(0, 10).map((model, index) => {
        const position = index + 1;
        const positionStyle = position === 1 ? 'background: linear-gradient(135deg, #ffd700, #ffed4e); color: #92400e;' 
                            : position === 2 ? 'background: linear-gradient(135deg, #c0c0c0, #e5e7eb); color: #374151;' 
                            : position === 3 ? 'background: linear-gradient(135deg, #cd7f32, #d97706); color: white;' 
                            : 'background: #6366f1; color: white;';
        const trend = model.trend || 'stable';
        const trendIcon = trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️';
        const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
        
        return `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; display: flex; align-items: center; gap: 15px; margin: 15px 0; position: relative;">
            <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; ${positionStyle}">${position}</div>
            <div style="flex: 1;">
              <div style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 4px 0;">${model.name}</div>
              <div style="font-size: 14px; color: #4b5563; margin: 0 0 8px 0;">${model.organization || 'Unknown'}</div>
              <div style="font-size: 18px; font-weight: 700; color: #6366f1; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${model.score}</div>
            </div>
            <div style="position: absolute; top: 15px; right: 15px; font-size: 12px; padding: 4px 8px; border-radius: 12px; font-weight: 600; background: rgba(${trend === 'up' ? '16, 185, 129' : trend === 'down' ? '239, 68, 68' : '107, 114, 128'}, 0.1); color: ${trendColor};">
              ${trendIcon} ${model.change || '0'}
            </div>
          </div>
        `;
      }).join('');
    };
    
    const rankingHtml = models.length > 0 
      ? `<div style="background: #f8fafc; padding: 25px; border-bottom: 1px solid #d1d5db;">
          <div style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
            <span>🏆</span>
            <span>全局排名 Top 10</span>
          </div>
          <div>
            ${generateRankingHtml(models)}
          </div>
        </div>`
      : '';
    
    // 生成测试环境信息
    const generateEnvironmentHtml = (env) => {
      if (!env || Object.keys(env).length === 0) return '';
      
      const envItems = Object.entries(env).map(([key, value]) => `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px;">
          <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 5px 0;">${key}</div>
          <div style="font-size: 14px; font-weight: 600; color: #111827; margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${value}</div>
        </div>
      `).join('');
      
      return `
        <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 25px 0;">
          <div style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
            <span>⚙️</span>
            <span>测试环境</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            ${envItems}
          </div>
        </div>
      `;
    };
    
    const environmentHtml = generateEnvironmentHtml(environment);

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(data.content);

    return `
<!-- 微信公众号专用AI基准测试模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
    
    <!-- 文章头部 -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 40px 30px; text-align: center;">
        <div style="background: rgba(0, 0, 0, 0.1); padding: 12px 25px; margin-bottom: 20px; text-align: left;">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                <span>${typeInfo.icon}</span>
                <span>${typeInfo.text}</span>
            </div>
        </div>
        <h1 style="font-size: 18px; font-weight: 700; text-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px; line-height: 1.4; margin: 0px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
            <span>🤖</span>
            <span>${extractedTitle}</span>
        </h1>
        ${subtitle ? `<div style="font-size: 16px; opacity: 0.9; margin: 10px 0 0 0; font-weight: 400; line-height: 1.4;">${subtitle}</div>` : ''}
        <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; margin-top: 20px; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px;">
                <span>📅</span>
                <span>测试日期: ${testDate}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px;">
                <span>🏷️</span>
                <span>版本: ${version}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px;">
                <span>🏢</span>
                <span>机构: ${organization}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px;">
                <span>📊</span>
                <span>数据集: ${dataset}</span>
            </div>
        </div>
    </div>
    
    ${rankingHtml}
    ${environmentHtml}
    
    <!-- 文章内容区 -->
    <div style="padding: 40px 30px;">
        
        <!-- 文章信息 -->
        <div style="text-align: center; margin: 20px 0 30px 0;">
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; font-weight: 500; text-align: center;">
                全文 / 5000 字　阅读 / 大约 10 分钟
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                研究机构：${organization}
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                <br>
            </p>
            <hr style="border-style: solid; border-width: 1px 0 0; border-color: rgba(0,0,0,0.1); -webkit-transform-origin: 0 0; -webkit-transform: scale(1, 0.5); transform-origin: 0 0; transform: scale(1, 0.5);">
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                <br>
            </p>
        </div>
        
        <!-- 目录 -->
        ${this.generateTableOfContents(data.content)}
        
        <!-- 分隔符 -->
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #6366f1, transparent); margin: 30px 0; border: none;">
        
        <!-- 文章正文 -->
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333;">
            ${processedContent}
        </div>
        
        <!-- 分隔符 -->
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #6366f1, transparent); margin: 30px 0; border: none;">
        
        <!-- 参考文献 - 动态生成 -->
        ${this.generateReferences(data.content)}
        
        <p style="color: #333; font-size: 12px; margin: 0 0 8px 0; font-weight: 600; text-align: center;">
            <br>
        </p>
        <hr style="border-style: solid; border-width: 1px 0 0; border-color: rgba(0,0,0,0.1); -webkit-transform-origin: 0 0; -webkit-transform: scale(1, 0.5); transform-origin: 0 0; transform: scale(1, 0.5);">
        <p style="color: #333; font-size: 12px; margin: 0 0 8px 0; font-weight: 600; text-align: center;">
            <br>
        </p>
        <p style="color: #333; font-size: 12px; margin: 0 0 8px 0; font-weight: 600; text-align: center;">
            研究团队 / ${organization}　技术支持 / 深度学习实验室
        </p>
        <p style="color: #666; font-size: 11px; font-style: italic; text-align: center; margin: 0;">
            本报告首发于${testDate}
        </p>
    </div>
</div>
    `;
  },

  generateTableOfContents: function(content) {
    if (!content) return '';
    
    const headings = content.match(/^#{1,3}\s+(.+)$/gm);
    if (!headings || headings.length === 0) return '';
    
    // 过滤掉第一个标题（主题标题）
    const filteredHeadings = headings.slice(1);
    if (filteredHeadings.length === 0) return '';
    
    let tocHtml = `
      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #6366f1; padding: 25px; margin: 30px 0; border-radius: 0 12px 12px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h3 style="color: #6366f1; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">目录</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    filteredHeadings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      
      tocHtml += `
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #6366f1; font-size: 12px;">▶</span>
            <span style="color: #555; font-weight: 500; font-size: 16px; font-style: italic;">${text}</span>
          </li>
      `;
    });
    
    tocHtml += `
        </ul>
      </div>
    `;
    
    return tocHtml;
  },

  processSpecialBlocks: function(content) {
    if (!content) return '';
    
    // 移除参考文献部分，因为它会单独处理
    content = content.replace(/^#{1,6}\s*参考文献[\s\S]*$/im, '');
    
    // 跳过第一个顶级标题或第一个二级标题，因为它已经作为页面主标题显示
    let firstTitleSkipped = false;
    
    // 先处理一级标题
    content = content.replace(/^# (.+)$/gm, (match, title) => {
      if (!firstTitleSkipped) {
        firstTitleSkipped = true;
        return ''; // 移除第一个顶级标题，避免重复
      }
      return match; // 保留其他顶级标题
    });
    
    // 处理二级标题，根据内容调整编号逻辑
    const sectionCounter = { count: 0 };
    content = content.replace(/^## (.+)$/gm, (match, title) => {
      // 如果是第一个二级标题且还没有跳过标题，跳过它（通常是主标题的重复）
      if (!firstTitleSkipped) {
        firstTitleSkipped = true;
        return ''; // 移除第一个二级标题，避免重复
      }
      
      // 特殊处理：如果是"前言"，不添加编号
      if (title.includes('前言')) {
        return `<section id="preface" style="margin: 30px 0;">
          <h2 style="color: #2c3e50; font-size: 22px; font-weight: 600; margin: 35px 0 20px 0; padding: 15px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); text-align: center;">
            ${title}
          </h2>
        </section>`;
      } else {
        sectionCounter.count++;
        return `<section id="section-${sectionCounter.count}" style="margin: 30px 0;">
          <h2 style="color: #2c3e50; font-size: 22px; font-weight: 600; margin: 35px 0 20px 0; padding: 15px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); text-align: center;">
            <span style="font-style: italic; font-weight: bold; color: #6366f1; margin-right: 10px; font-size: 24px;">${sectionCounter.count}:</span>${title}
          </h2>
        </section>`;
      }
    });
    
    // 处理三级标题
    content = content.replace(/^### (.+)$/gm, '<h3 style="color: #34495e; font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; padding-left: 15px; border-left: 3px solid #6366f1;">$1</h3>');
    
    // 处理四级标题  
    content = content.replace(/^#### (.+)$/gm, '<h4 style="color: #555; font-size: 16px; font-weight: 600; margin: 20px 0 12px 0;">$1</h4>');
    
    // 处理段落
    content = this.processMarkdownParagraphs(content);
    
    // 处理强调文本
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #6366f1; font-weight: 600;">$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em style="color: #6366f1; font-style: normal; font-weight: 500;">$1</em>');
    
    // 处理链接 - 只显示链接文本，不添加超链接
    content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 处理有序列表
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.8; color: #333; padding-left: 8px;"><strong style="color: #6366f1; margin-right: 8px;">•</strong>$1</div>');
    
    // 处理无序列表（但排除参考文献中的列表）
    content = content.replace(/^[-*+]\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.8; color: #333; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #6366f1;">•</span>$1</div>');
    
    // 处理引用块
    content = content.replace(/^>\s+(.+)$/gm, '<blockquote style="margin: 30px 0; padding: 24px 28px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(255, 255, 255, 0.8)); border-left: 5px solid #6366f1; border-radius: 0 12px 12px 0; font-style: italic; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);"><p style="margin: 0; font-weight: 500; color: #4f46e5;">$1</p></blockquote>');
    
    // 处理代码块
    content = content.replace(/`([^`]+)`/g, '<code style="background: #f8f9fa; color: #6366f1; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 0.9em; border: 1px solid #e9ecef; font-weight: 500;">$1</code>');
    
    // 处理图片占位符（符合微信公众号要求）
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '<div style="display: block; margin: 20px auto; padding: 20px; border: 2px dashed #d1d1d1; text-align: center; color: #888; background-color: #fafafa; border-radius: 8px;">[ 请在此处手动上传图片：$1 ]</div>');
    
    // 处理分隔符
    content = content.replace(/^---+$/gm, '<hr style="height: 2px; background: linear-gradient(90deg, transparent, #6366f1, transparent); margin: 30px 0; border: none;">');
    
    // 扩展术语高亮范围，包括AI基准测试相关术语
    const highlightTerms = [
      '人工智能', 'AI', '机器学习', '深度学习', '神经网络', '大模型', 'LLMs',
      '基准测试', '性能评测', '准确率', '召回率', 'F1分数', 'BLEU', 'ROUGE',
      '模型对比', '算法优化', '推理速度', '内存消耗', '计算效率', 'GPU加速',
      'Transformer', 'BERT', 'GPT', 'ChatGPT', 'Claude', 'LLaMA'
    ];
    
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(?<!<[^>]*?)\\b${term}\\b(?![^<]*?>)`, 'g');
      content = content.replace(regex, `<strong style="color: #6366f1; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent); padding: 1px 3px; border-radius: 3px;">${term}</strong>`);
    });
    
    return content;
  },

  processMarkdownParagraphs: function(content) {
    if (!content) return '';
    
    // 按行分割内容
    const lines = content.split('\n');
    const processedLines = [];
    let currentParagraph = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 如果是空行或者已经是HTML标签，结束当前段落
      if (line === '' || 
          line.startsWith('<') || 
          line.match(/^#{1,6}\s/) || 
          line.startsWith(':::') ||
          line.match(/^\s*[-*+]\s/) || // 列表项
          line.match(/^\s*\d+\.\s/) || // 有序列表
          line.startsWith('```') || // 代码块
          line.startsWith('|') || // 表格
          line.startsWith('>')) { // 引用
        
        // 如果有累积的段落内容，包装成<p>标签并加上样式
        if (currentParagraph.length > 0) {
          const paragraphContent = currentParagraph.join(' ').trim();
          if (paragraphContent) {
            processedLines.push(`<p style="margin: 15px 0; text-align: justify; font-size: 16px; line-height: 1.8; color: #333;">${paragraphContent}</p>`);
          }
          currentParagraph = [];
        }
        
        // 添加当前行（如果不是空行）
        if (line !== '') {
          processedLines.push(lines[i]); // 保持原始格式
        } else {
          processedLines.push(''); // 保持空行
        }
      } else {
        // 累积普通文本行到当前段落
        currentParagraph.push(line);
      }
    }
    
    // 处理最后的段落
    if (currentParagraph.length > 0) {
      const paragraphContent = currentParagraph.join(' ').trim();
      if (paragraphContent) {
        processedLines.push(`<p style="margin: 15px 0; text-align: justify; font-size: 16px; line-height: 1.8; color: #333;">${paragraphContent}</p>`);
      }
    }
    
    return processedLines.join('\n');
  },

  extractFirstTitle: function(content) {
    if (!content) return null;
    
    // 匹配第一个标题（# 开头的行）
    const titleMatch = content.match(/^#{1,6}\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    return null;
  },

  generateReferences: function(content) {
    if (!content) return '';
    
    // 查找参考文献部分
    const referencesMatch = content.match(/#{1,6}\s*参考文献[\s\S]*$/i);
    if (!referencesMatch) {
      return ''; // 如果没有找到参考文献部分，返回空字符串
    }
    
    const referencesSection = referencesMatch[0];
    
    // 提取所有的引用条目（markdown列表格式）
    const referenceItems = referencesSection.match(/^\*\s+(.+)$/gm);
    
    if (!referenceItems || referenceItems.length === 0) {
      return ''; // 如果没有找到引用条目，返回空字符串
    }
    
    // 构建参考文献HTML
    let referencesHtml = `
      <div style="margin: 40px 0 0 0; padding: 0; background: none; border: none;">
        <h2 style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 15px 20px; margin: 0 0 20px 0; color: #2c3e50; font-size: 22px; font-weight: 600;">
          参考文献
        </h2>
        
        <p>
          <span style="font-size: 14px; font-style: italic;">※研究数据来源，仅供参考。</span>
        </p>
        
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    // 处理每个引用条目
    referenceItems.forEach((item, index) => {
      // 移除markdown列表符号
      let cleanItem = item.replace(/^\*\s+/, '').trim();
      
      // 处理markdown链接格式 [URL](URL) - 移除超链接，只显示URL文本
      cleanItem = cleanItem.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // 只显示URL，不添加超链接
        return url;
      });
      
      // 添加列表项
      const isLastItem = index === referenceItems.length - 1;
      const borderStyle = isLastItem ? '' : 'border-bottom: 1px solid rgb(233, 236, 239);';
      
      referencesHtml += `
        <li style="margin: 0px; padding: 8px 0px; ${borderStyle} font-size: 12px; line-height: 1.5; color: rgb(119, 119, 119);">
          <section>
            <span>${cleanItem}</span>
          </section>
        </li>
      `;
    });
    
    referencesHtml += `
        </ul>
        
        <!-- 间隔行 -->
        <div style="height: 20px;"></div>
      </div>
    `;
    
    return referencesHtml;
  },

  render: function(data) {
    // 确保数据完整性，专门为AI基准测试优化
    const renderData = {
      title: data.title || 'AI基准测试报告：性能评估与技术对比分析',
      content: data.content || '',
      organization: data.organization || 'AI Research Lab',
      testDate: data.testDate || new Date().toLocaleDateString('zh-CN'),
      version: data.version || 'v1.0',
      benchmarkType: data.benchmarkType || 'performance',
      dataset: data.dataset || 'Standard Benchmark',
      models: data.models || [],
      environment: data.environment || {},
      subtitle: data.subtitle || '深度学习模型性能基准测试报告'
    };
    
    return this.template(renderData);
  }
};