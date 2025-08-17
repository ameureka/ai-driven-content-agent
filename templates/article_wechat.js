/**
 * 微信公众号专用 - 通用文章模板
 * 基于ai-medical-article-v5.html设计风格重构
 * 专门针对微信公众号内容阅读体验优化
 * 遵循微信公众号CSS约束条件，使用行内样式
 */
export default {
  name: 'article_wechat',
  displayName: '微信文章通用模板',
  description: '专为微信公众号设计的通用文章模板，完全兼容微信编辑器约束',
  
  // 微信公众号不支持外部CSS和<style>标签，所有样式都通过行内样式实现
  styles: '',

  template: function(data) {
    // 从内容中提取第一个标题作为主标题
    const extractedTitle = this.extractFirstTitle(data.content) || data.title || '震撼！人工智能在医疗领域的应用前景：18个领域引爆医疗变革！';
    
    return `
<!-- 微信公众号专用医疗文章模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
    
    <!-- 文章头部 -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
        <h1 style="font-size: 18px; font-weight: 700; text-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px; line-height: 1.4; margin: 0px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
            <span>${extractedTitle}</span>
        </h1>
    </div>
    
    <!-- 文章内容区 -->
    <div style="padding: 40px 30px;">
        
        <!-- 文章信息 -->
        <div style="text-align: center; margin: 20px 0 30px 0;">
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; font-weight: 500; text-align: center;">
                全文 / 5000 字　阅读 / 大约 10 分钟
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                作者：ameureka
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
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #667eea, transparent); margin: 30px 0; border: none;">
        
        <!-- 文章正文 -->
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333;">
            ${this.processSpecialBlocks(data.content)}
        </div>
        
        <!-- 分隔符 -->
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #667eea, transparent); margin: 30px 0; border: none;">
        
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
            主笔 / 景九　版面 / 黄静
        </p>
        <p style="color: #666; font-size: 11px; font-style: italic; text-align: center; margin: 0;">
            本文首发于2025年1月
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
      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #667eea; padding: 25px; margin: 30px 0; border-radius: 0 12px 12px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h3 style="color: #667eea; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">目录</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    filteredHeadings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      
      tocHtml += `
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #667eea; font-size: 12px;">▶</span>
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
          <h2 style="color: #2c3e50; font-size: 22px; font-weight: 600; margin: 35px 0 20px 0; padding: 15px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #667eea; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); text-align: center;">
            ${title}
          </h2>
        </section>`;
      } else {
        sectionCounter.count++;
        return `<section id="section-${sectionCounter.count}" style="margin: 30px 0;">
          <h2 style="color: #2c3e50; font-size: 22px; font-weight: 600; margin: 35px 0 20px 0; padding: 15px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #667eea; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); text-align: center;">
            <span style="font-style: italic; font-weight: bold; color: #667eea; margin-right: 10px; font-size: 24px;">${sectionCounter.count}:</span>${title}
          </h2>
        </section>`;
      }
    });
    
    // 处理三级标题
    content = content.replace(/^### (.+)$/gm, '<h3 style="color: #34495e; font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; padding-left: 15px; border-left: 3px solid #667eea;">$1</h3>');
    
    // 处理四级标题  
    content = content.replace(/^#### (.+)$/gm, '<h4 style="color: #555; font-size: 16px; font-weight: 600; margin: 20px 0 12px 0;">$1</h4>');
    
    // 处理段落
    content = this.processMarkdownParagraphs(content);
    
    // 处理强调文本
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #667eea; font-weight: 600;">$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em style="color: #667eea; font-style: normal; font-weight: 500;">$1</em>');
    
    // 处理链接 - 只显示链接文本，不添加超链接
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    
    // 处理有序列表
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.8; color: #333; padding-left: 8px;"><strong style="color: #667eea; margin-right: 8px;">•</strong>$1</div>');
    
    // 处理无序列表（但排除参考文献中的列表）
    content = content.replace(/^[-*+]\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.8; color: #333; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #667eea;">•</span>$1</div>');
    
    // 处理引用块
    content = content.replace(/^>\s+(.+)$/gm, '<blockquote style="margin: 30px 0; padding: 24px 28px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(255, 255, 255, 0.8)); border-left: 5px solid #667eea; border-radius: 0 12px 12px 0; font-style: italic; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);"><p style="margin: 0; font-weight: 500; color: #764ba2;">$1</p></blockquote>');
    
    // 处理代码块
    content = content.replace(/`([^`]+)`/g, '<code style="background: #f8f9fa; color: #667eea; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 0.9em; border: 1px solid #e9ecef; font-weight: 500;">$1</code>');
    
    // 处理图片占位符（符合微信公众号要求）
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '<div style="display: block; margin: 20px auto; padding: 20px; border: 2px dashed #d1d1d1; text-align: center; color: #888; background-color: #fafafa; border-radius: 8px;">[ 请在此处手动上传图片：$1 ]</div>');
    
    // 处理分隔符
    content = content.replace(/^---+$/gm, '<hr style="height: 2px; background: linear-gradient(90deg, transparent, #667eea, transparent); margin: 30px 0; border: none;">');
    
    // 扩展术语高亮范围，包括大模型相关术语
    const highlightTerms = [
      '人工智能', 'AI', '机器学习', '深度学习', '神经网络', '大模型', 'LLMs',
      '医疗诊断', '影像诊断', '病理诊断', '精准医疗', '个性化治疗',
      '药物研发', '临床试验', '生物标志物', '基因测序', 'DNA',
      '微创手术', '机器人手术', '远程医疗', '数字化医疗',
      '智能客服', '内容创作', '大语言模型', 'AI Agent', '金融科技'
    ];
    
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(?<!<[^>]*?)\\b${term}\\b(?![^<]*?>)`, 'g');
      content = content.replace(regex, `<strong style="color: #667eea; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), transparent); padding: 1px 3px; border-radius: 3px;">${term}</strong>`);
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
        <h2 style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #667eea; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 15px 20px; margin: 0 0 20px 0; color: #2c3e50; font-size: 22px; font-weight: 600;">
          参考文献
        </h2>
        
        <p>
          <span style="font-size: 14px; font-style: italic;">※个人观点，仅供参考。</span>
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
    // 确保数据完整性，专门为医疗文章优化
    const renderData = {
      title: data.title || '震撼！人工智能在医疗领域的应用前景：18个领域引爆医疗变革！',
      content: data.content || '',
      author: data.author || 'ameureka',
      date: data.date || '2025年1月',
      readingTime: data.readingTime || '全文 / 5000 字　阅读 / 大约 10 分钟',
      category: data.category || '医疗科技',
      description: data.description || '探索人工智能在医疗领域的最新应用与发展前景，包括智能诊断、影像分析、药物研发、精准医疗等前沿技术的深度解析。',
      tags: data.tags || ['人工智能', '医疗科技', '智能诊断', '精准医疗', '药物研发', '微创手术']
    };
    
    return this.template(renderData);
  }
};