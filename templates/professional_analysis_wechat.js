/**
 * 微信公众号专用 - 专业分析模板
 * 基于通用设计原则重构，完全兼容微信公众号约束条件
 * 专门用于深度技术分析、研究报告、学术论文解读、专业文档等内容
 * 遵循微信公众号CSS约束条件，使用行内样式
 */
export default {
  name: 'professional_analysis_wechat',
  displayName: '专业分析模板',
  description: '专为深度技术分析设计的微信公众号模板，完全兼容微信编辑器约束',
  
  // 微信公众号不支持外部CSS和<style>标签，所有样式都通过行内样式实现
  styles: '',

  template: function(data) {
    // 从内容中提取第一个标题作为主标题
    const extractedTitle = this.extractFirstTitle(data.content) || data.title || '专业技术分析报告：深度研究与解读';
    
    // 处理元数据
    const docType = data.docType || 'analysis';
    const author = data.author || '研究员';
    const institution = data.institution || '研究机构';
    const publishDate = data.publishDate || new Date().toLocaleDateString('zh-CN');
    const keywords = data.keywords || [];
    const abstract = data.abstract || '';
    const doi = data.doi || '';
    const version = data.version || 'v1.0';
    const subtitle = data.subtitle || '深度技术分析与专业解读';
    
    // 确定文档类型信息
    const getDocTypeInfo = (type) => {
      switch(type.toLowerCase()) {
        case 'research': return { class: 'research', icon: '🔬', text: '研究论文', color: '#0ea5e9' };
        case 'analysis': return { class: 'analysis', icon: '📊', text: '技术分析', color: '#8b5cf6' };
        case 'report': return { class: 'report', icon: '📋', text: '研究报告', color: '#10b981' };
        case 'academic': return { class: 'academic', icon: '🎓', text: '学术论文', color: '#f59e0b' };
        default: return { class: 'professional', icon: '📄', text: '专业文档', color: '#1e293b' };
      }
    };
    
    const typeInfo = getDocTypeInfo(docType);
    
    // 生成关键词HTML
    const keywordsHtml = keywords.length > 0 
      ? `<div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);">
          <span style="font-size: 16px; opacity: 0.8;">🏷️</span>
          <span>关键词: ${keywords.join(', ')}</span>
        </div>`
      : '';
    
    // 生成摘要HTML
    const abstractHtml = abstract 
      ? `<div style="background: #f1f5f9; padding: 30px; border-bottom: 1px solid #e2e8f0;">
          <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px; font-family: 'Times New Roman', 'Noto Serif SC', serif;">
            <span>📋</span>
            <span>摘要</span>
          </div>
          <div style="font-size: 16px; line-height: 1.8; color: #475569; background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-style: italic;">${abstract}</div>
        </div>`
      : '';

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(data.content);

    return `
<!-- 微信公众号专用专业分析模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    
    <!-- 专业版头部 -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: #ffffff; padding: 0; position: relative; overflow: hidden;">
        <!-- 文档类型标签 -->
        <div style="background: rgba(0, 0, 0, 0.2); padding: 15px 25px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(${typeInfo.color === '#0ea5e9' ? '14, 165, 233' : typeInfo.color === '#8b5cf6' ? '139, 92, 246' : typeInfo.color === '#10b981' ? '16, 185, 129' : typeInfo.color === '#f59e0b' ? '245, 158, 11' : '30, 41, 59'}, 0.8); padding: 8px 16px; border-radius: 25px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
                <span>${typeInfo.icon}</span>
                <span>${typeInfo.text}</span>
            </div>
        </div>
        
        <!-- 主信息区域 -->
        <div style="padding: 40px 30px; position: relative;">
            <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.2; font-family: 'Times New Roman', 'Noto Serif SC', serif; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <span>🎓</span>
                <span>${extractedTitle}</span>
            </h1>
            <div style="font-size: 18px; opacity: 0.9; margin: 0 0 25px 0; font-weight: 400; line-height: 1.4; font-style: italic;">${subtitle}</div>
            
            <!-- 专业版元信息 -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; font-size: 14px;">
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="font-size: 16px; opacity: 0.8;">👤</span>
                    <span>作者: ${author}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="font-size: 16px; opacity: 0.8;">🏛️</span>
                    <span>机构: ${institution}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="font-size: 16px; opacity: 0.8;">📅</span>
                    <span>日期: ${publishDate}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="font-size: 16px; opacity: 0.8;">🏷️</span>
                    <span>版本: ${version}</span>
                </div>
                ${doi ? `
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="font-size: 16px; opacity: 0.8;">🔗</span>
                    <span>DOI: ${doi}</span>
                </div>
                ` : ''}
                ${keywordsHtml}
            </div>
        </div>
    </div>
    
    ${abstractHtml}
    
    <!-- 文章内容区 -->
    <div style="padding: 40px 30px;">
        
        <!-- 文章信息 -->
        <div style="text-align: center; margin: 20px 0 30px 0;">
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; font-weight: 500; text-align: center;">
                全文 / 8000 字　阅读 / 大约 15 分钟
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                研究机构：${institution} · 发布时间：${publishDate} · 研究类型：${typeInfo.text}
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
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #1e293b, transparent); margin: 30px 0; border: none;">
        
        <!-- 文章正文 -->
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333;">
            ${processedContent}
        </div>
        
        <!-- 分隔符 -->
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #1e293b, transparent); margin: 30px 0; border: none;">
        
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
            研究作者 / ${author}　研究机构 / ${institution}
        </p>
        <p style="color: #666; font-size: 11px; font-style: italic; text-align: center; margin: 0;">
            🎓 专业严谨，深度分析 · 本研究首发于${publishDate}
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
      <div style="background: white; padding: 30px; border-bottom: 1px solid #e2e8f0;">
        <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px; font-family: 'Times New Roman', 'Noto Serif SC', serif;">
          <span>📑</span>
          <span>目录</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    filteredHeadings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      
      const levelStyle = level === 1 ? 'font-weight: 600; font-size: 16px;' : 
                        level === 2 ? 'margin-left: 20px; font-size: 15px;' : 
                        'margin-left: 40px; font-size: 14px; color: #475569;';
      
      tocHtml += `
          <li style="margin: 12px 0; padding: 12px 20px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #cbd5e1; transition: all 0.2s ease; ${levelStyle}">
            <div style="color: #1e293b; text-decoration: none; display: flex; align-items: center; gap: 8px;">
              <span>${text}</span>
            </div>
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
    let sectionCounter = 0;
    let subsectionCounter = 0;
    let subsubsectionCounter = 0;
    
    // 先处理一级标题
    content = content.replace(/^# (.+)$/gm, (match, title) => {
      if (!firstTitleSkipped) {
        firstTitleSkipped = true;
        return ''; // 移除第一个顶级标题，避免重复
      }
      
      sectionCounter++;
      subsectionCounter = 0; // 重置子计数器
      
      return `<section id="section-${sectionCounter}" style="margin: 40px 0;">
        <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin: 40px 0 20px 0; line-height: 1.3; font-family: 'Times New Roman', 'Noto Serif SC', serif; position: relative; padding: 25px 30px; background: linear-gradient(135deg, #f1f5f9 0%, white 100%); border-radius: 8px; border-left: 5px solid #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <span style="color: #1e293b; margin-right: 15px; font-size: 20px;">${sectionCounter}.</span>${title}
        </h1>
      </section>`;
    });
    
    // 处理二级标题
    content = content.replace(/^## (.+)$/gm, (match, title) => {
      // 如果是第一个二级标题且还没有跳过标题，跳过它（通常是主标题的重复）
      if (!firstTitleSkipped) {
        firstTitleSkipped = true;
        return ''; // 移除第一个二级标题，避免重复
      }
      
      subsectionCounter++;
      subsubsectionCounter = 0; // 重置子子计数器
      
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const letter = letters[subsectionCounter - 1] || 'A';
      
      return `<section id="subsection-${sectionCounter}-${subsectionCounter}" style="margin: 35px 0;">
        <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 35px 0 18px 0; padding: 20px 25px; background: white; border: 1px solid #e2e8f0; border-left: 4px solid #0ea5e9; border-radius: 8px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-family: 'Times New Roman', 'Noto Serif SC', serif;">
          <span style="color: #0ea5e9; margin-right: 10px; font-weight: 700;">${letter}.</span>${title}
        </h2>
      </section>`;
    });
    
    // 处理三级标题
    content = content.replace(/^### (.+)$/gm, (match, title) => {
      subsubsectionCounter++;
      
      return `<section id="subsubsection-${sectionCounter}-${subsectionCounter}-${subsubsectionCounter}" style="margin: 30px 0;">
        <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 30px 0 16px 0; padding: 15px 20px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #8b5cf6; display: flex; align-items: center; gap: 10px;">
          <div style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">${subsubsectionCounter}</div>
          <span>${title}</span>
        </h3>
      </section>`;
    });
    
    // 处理四级标题  
    content = content.replace(/^#### (.+)$/gm, '<h4 style="color: #555; font-size: 16px; font-weight: 600; margin: 20px 0 12px 0;">$1</h4>');
    
    // 处理研究方法块
    content = content.replace(/:::methodology\s*([\s\S]*?)\s*:::/g, 
      '<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 8px; padding: 25px; margin: 30px 0; position: relative;"><div style="position: absolute; top: -12px; left: 20px; background: #0ea5e9; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">🔬 研究方法</div>$1</div>');
    
    // 处理公式块
    content = content.replace(/:::formula\s*([\s\S]*?)\s*:::/g, 
      '<div style="background: white; border: 2px solid #8b5cf6; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center; font-family: \'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 18px; position: relative; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"><div style="position: absolute; top: -12px; left: 20px; background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">📐 公式</div>$1</div>');
    
    // 处理数据表格
    content = content.replace(/:::table\s*([\s\S]*?)\s*:::/g, 
      '<div style="width: 100%; border-collapse: collapse; margin: 25px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">$1</div>');
    
    // 处理段落
    content = this.processMarkdownParagraphs(content);
    
    // 处理强调文本
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #1e293b; font-weight: 700;">$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em style="color: #0ea5e9; font-style: italic; background: linear-gradient(120deg, transparent 0%, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%, transparent 100%); padding: 2px 4px; border-radius: 3px;">$1</em>');
    
    // 处理链接 - 只显示链接文本，不添加超链接
    content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 处理有序列表
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 18px 0; line-height: 1.8; color: #333; padding-left: 8px; text-align: justify; text-indent: 2em;"><strong style="color: #1e293b; margin-right: 8px;">•</strong>$1</div>');
    
    // 处理无序列表（但排除参考文献中的列表）
    content = content.replace(/^[-*+]\s+(.+)$/gm, '<div style="margin: 18px 0; line-height: 1.8; color: #333; padding-left: 30px; position: relative;"><span style="position: absolute; left: 0; color: #0ea5e9;">•</span>$1</div>');
    
    // 处理引用块 - 学术风格
    content = content.replace(/^>\s+(.+)$/gm, '<blockquote style="margin: 25px 0; padding: 25px 30px; background: white; border-left: 5px solid #0ea5e9; border-radius: 0 8px 8px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: relative; font-style: italic; color: #475569;"><div style="position: absolute; left: -15px; top: 20px; font-size: 48px; color: #0ea5e9; opacity: 0.3; font-family: \'Times New Roman\', \'Noto Serif SC\', serif; line-height: 1;">\"</div><p style="margin: 0; font-weight: 500;">$1</p></blockquote>');
    
    // 处理代码块
    content = content.replace(/`([^`]+)`/g, '<code style="background: #f8fafc; color: #1e293b; padding: 3px 6px; border-radius: 4px; font-family: \'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 0.9em; border: 1px solid #cbd5e1;">$1</code>');
    
    // 处理图片占位符（符合微信公众号要求）
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '<div style="display: block; margin: 25px auto; padding: 20px; border: 2px dashed #d1d1d1; text-align: center; color: #888; background-color: #fafafa; border-radius: 8px;">[ 请在此处手动上传图片：$1 ]</div>');
    
    // 处理分隔符
    content = content.replace(/^---+$/gm, '<hr style="height: 2px; background: linear-gradient(90deg, transparent, #1e293b, transparent); margin: 30px 0; border: none;">');
    
    // 扩展学术术语高亮范围
    const highlightTerms = [
      '研究', '分析', '方法', '结论', '假设', '理论', '模型', '算法', '实验',
      '数据', '统计', '结果', '发现', '创新', '技术', '系统', '架构', '优化',
      '深度学习', '机器学习', '人工智能', '神经网络', '算法', '模型',
      '学术', '论文', '期刊', '会议', '引用', '文献'
    ];
    
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(?<!<[^>]*?)\\b${term}\\b(?![^<]*?>)`, 'g');
      content = content.replace(regex, `<strong style="color: #1e293b; background: linear-gradient(135deg, rgba(30, 41, 59, 0.1), transparent); padding: 1px 3px; border-radius: 3px;">${term}</strong>`);
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
            processedLines.push(`<p style="margin: 18px 0; line-height: 1.8; font-size: 16px; color: #1e293b; text-align: justify; text-indent: 2em;">${paragraphContent}</p>`);
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
        processedLines.push(`<p style="margin: 18px 0; line-height: 1.8; font-size: 16px; color: #1e293b; text-align: justify; text-indent: 2em;">${paragraphContent}</p>`);
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
      <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px; font-family: 'Times New Roman', 'Noto Serif SC', serif;">
          <span>📚</span>
          <span>参考文献</span>
        </div>
        
        <p>
          <span style="font-size: 14px; font-style: italic;">※学术研究参考资料，严格遵循引用规范。</span>
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
      const borderStyle = isLastItem ? '' : 'border-bottom: 1px solid #e2e8f0;';
      
      referencesHtml += `
        <li style="margin: 12px 0; padding: 12px 0; ${borderStyle} font-size: 14px; line-height: 1.6;">
          <section>
            <span style="color: #475569;">[${index + 1}] ${cleanItem}</span>
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
    // 确保数据完整性，专门为专业分析优化
    const renderData = {
      title: data.title || '专业技术分析报告：深度研究与解读',
      content: data.content || '',
      author: data.author || '研究员',
      institution: data.institution || '研究机构',
      publishDate: data.publishDate || new Date().toLocaleDateString('zh-CN'),
      docType: data.docType || 'analysis',
      keywords: data.keywords || [],
      abstract: data.abstract || '',
      doi: data.doi || '',
      version: data.version || 'v1.0',
      subtitle: data.subtitle || '深度技术分析与专业解读'
    };
    
    return this.template(renderData);
  }
};