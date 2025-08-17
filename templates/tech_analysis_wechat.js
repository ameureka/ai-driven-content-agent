/**
 * 微信公众号专用 - 技术解读模板
 * 基于通用设计原则重构，完全兼容微信公众号约束条件
 * 专门用于技术产品、工具、框架的深度分析和解读
 * 遵循微信公众号CSS约束条件，使用行内样式
 */
export default {
  name: 'tech_analysis_wechat',
  displayName: '技术解读模板',
  description: '专为技术内容解读设计的微信公众号模板，完全兼容微信编辑器约束',
  
  // 微信公众号不支持外部CSS和<style>标签，所有样式都通过行内样式实现
  styles: '',

  template: function(data) {
    // 从内容中提取第一个标题作为主标题
    const extractedTitle = this.extractFirstTitle(data.content) || data.title || '技术深度解读：创新技术与实践分析';
    
    // 处理元数据
    const author = data.author || '技术团队';
    const publishDate = data.publishDate || new Date().toLocaleDateString('zh-CN');
    const version = data.version || 'v1.0';
    const difficulty = data.difficulty || '中级';
    const category = data.category || '技术解读';
    const tags = data.tags || [];
    const subtitle = data.subtitle || '深度技术分析与实践指南';
    const techStack = data.techStack || [];
    const githubUrl = data.githubUrl || '';
    const demoUrl = data.demoUrl || '';
    
    // 生成技术标签HTML
    const generateTagsHtml = (tags) => {
      if (!tags || tags.length === 0) return '';
      
      return tags.map(tag => {
        let tagColor = '#3b82f6'; // 默认蓝色
        if (tag.includes('框架') || tag.includes('Framework')) tagColor = '#06b6d4';
        else if (tag.includes('语言') || tag.includes('Language')) tagColor = '#10b981';
        else if (tag.includes('工具') || tag.includes('Tool')) tagColor = '#f59e0b';
        else if (tag.includes('平台') || tag.includes('Platform')) tagColor = '#ef4444';
        
        return `<span style="background: ${tagColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 4px;">${tag}</span>`;
      }).join('');
    };
    
    const tagsHtml = tags.length > 0 
      ? `<div style="background: #f8fafc; padding: 20px 25px; border-bottom: 1px solid #e2e8f0;">
          <div style="font-size: 14px; font-weight: 600; color: #475569; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">技术标签</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${generateTagsHtml(tags)}
          </div>
        </div>`
      : '';

    // 生成技术栈HTML
    const techStackHtml = techStack.length > 0 
      ? `<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9; border-radius: 8px; padding: 25px; margin: 25px 0; position: relative;">
          <div style="position: absolute; top: -12px; left: 20px; background: #0ea5e9; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">🛠️ 技术栈</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 10px;">
            ${techStack.map(tech => 
              `<div style="background: white; padding: 8px 12px; border-radius: 6px; text-align: center; font-size: 14px; font-weight: 500; border: 1px solid #e0f2fe;">${tech}</div>`
            ).join('')}
          </div>
        </div>`
      : '';

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(data.content);

    return `
<!-- 微信公众号专用技术解读模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden;">
    
    <!-- 技术风格头部 -->
    <div style="background: #0f172a; color: white; padding: 35px 25px; position: relative; overflow: hidden;">
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 15px 0; line-height: 1.2; position: relative; z-index: 1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <span>💻</span>
            <span>${extractedTitle}</span>
        </h1>
        <div style="font-size: 16px; opacity: 0.8; margin: 0 0 20px 0; position: relative; z-index: 1; font-weight: 400;">${subtitle}</div>
        
        <!-- 技术元信息 -->
        <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>📅</span>
                <span>${publishDate}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>👨‍💻</span>
                <span>${author}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>🏷️</span>
                <span>${version}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>📊</span>
                <span>难度: ${difficulty}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>📂</span>
                <span>${category}</span>
            </div>
            ${githubUrl ? `
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>🔗</span>
                <span>GitHub</span>
            </div>
            ` : ''}
            ${demoUrl ? `
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 20px; backdrop-filter: blur(10px);">
                <span>🚀</span>
                <span>Demo</span>
            </div>
            ` : ''}
        </div>
    </div>
    
    ${tagsHtml}
    
    <!-- 文章内容区 -->
    <div style="padding: 30px 25px;">
        
        <!-- 技术概览卡片 -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 0 0 30px 0; position: relative;">
            <div style="position: absolute; top: 20px; right: 20px; font-size: 24px; opacity: 0.3;">🔍</div>
            <div style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                <div style="width: 4px; height: 20px; background: #3b82f6; border-radius: 2px;"></div>
                <span>技术概览</span>
            </div>
            <p style="margin: 0; line-height: 1.7; font-size: 16px; color: #0f172a;">本文将深入分析 <strong style="color: #3b82f6; font-weight: 600; background: linear-gradient(120deg, transparent 0%, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%, transparent 100%); padding: 2px 4px; border-radius: 3px;">${extractedTitle}</strong> 的技术特性、架构设计、应用场景以及最佳实践，帮助开发者全面理解这项技术的核心价值和实际应用。</p>
        </div>
        
        ${techStackHtml}
        
        <!-- 文章信息 -->
        <div style="text-align: center; margin: 20px 0 30px 0;">
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; font-weight: 500; text-align: center;">
                全文 / 6000 字　阅读 / 大约 12 分钟
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                技术团队：${author} · 发布时间：${publishDate} · 技术难度：${difficulty}
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
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent); margin: 30px 0; border: none;">
        
        <!-- 文章正文 -->
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333;">
            ${processedContent}
        </div>
        
        <!-- 分隔符 -->
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent); margin: 30px 0; border: none;">
        
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
            技术团队 / ${author}　技术分类 / ${category}
        </p>
        <p style="color: #666; font-size: 11px; font-style: italic; text-align: center; margin: 0;">
            💻 持续关注技术前沿，深度解读技术趋势 · 本文首发于${publishDate}
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
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 25px; margin: 30px 0; border-radius: 0 12px 12px 0; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
        <h3 style="color: #3b82f6; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">技术导读</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    filteredHeadings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      
      tocHtml += `
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #3b82f6; font-size: 12px;">▶</span>
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
      
      // 特殊处理：如果是"概述"或"介绍"，不添加编号
      if (title.includes('概述') || title.includes('介绍') || title.includes('前言')) {
        return `<section id="intro" style="margin: 35px 0;">
          <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin: 30px 0 18px 0; padding: 15px 20px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; position: relative;">
            <span style="position: absolute; left: -15px; top: 50%; transform: translateY(-50%); color: #3b82f6; font-size: 14px; opacity: 0.5; font-weight: 400;">##</span>
            ${title}
          </h2>
        </section>`;
      } else {
        sectionCounter.count++;
        return `<section id="section-${sectionCounter.count}" style="margin: 35px 0;">
          <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin: 30px 0 18px 0; padding: 15px 20px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; position: relative;">
            <span style="position: absolute; left: -15px; top: 50%; transform: translateY(-50%); color: #3b82f6; font-size: 14px; opacity: 0.5; font-weight: 400;">##</span>
            <span style="font-style: italic; font-weight: bold; color: #3b82f6; margin-right: 10px; font-size: 20px;">${sectionCounter.count}.</span>${title}
          </h2>
        </section>`;
      }
    });
    
    // 处理三级标题
    content = content.replace(/^### (.+)$/gm, '<h3 style="font-size: 19px; font-weight: 600; color: #0f172a; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 10px; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9;"><span style="color: #3b82f6; font-size: 16px; font-weight: 700;">▸</span><span>$1</span></h3>');
    
    // 处理四级标题  
    content = content.replace(/^#### (.+)$/gm, '<h4 style="color: #555; font-size: 16px; font-weight: 600; margin: 20px 0 12px 0;">$1</h4>');
    
    // 处理技术特性列表
    content = content.replace(/:::features\s*([\s\S]*?)\s*:::/g, (match, featuresContent) => {
      const features = featuresContent.trim().split('\n').filter(line => line.trim());
      const featuresHtml = features.map((feature, index) => 
        `<div style="display: flex; align-items: flex-start; gap: 12px; margin: 15px 0; padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #3b82f6;">
          <div style="width: 24px; height: 24px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; margin-top: 2px;">${index + 1}</div>
          <div>${feature.replace(/^[-*]\s*/, '')}</div>
        </div>`
      ).join('');
      
      return `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 25px 0;">
          <div style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px;">
            <span>⚡</span>
            <span>核心特性</span>
          </div>
          <div>${featuresHtml}</div>
        </div>
      `;
    });
    
    // 处理技术提示
    content = content.replace(/:::tip\s*([\s\S]*?)\s*:::/g, 
      '<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 25px 0; position: relative;"><div style="position: absolute; top: 15px; right: 15px; font-size: 20px;">💡</div><div style="font-weight: 600; color: #0369a1; margin: 0 0 10px 0; font-size: 16px;">技术提示</div>$1</div>');
    
    // 处理技术警告
    content = content.replace(/:::warning\s*([\s\S]*?)\s*:::/g, 
      '<div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; position: relative;"><div style="position: absolute; top: 15px; right: 15px; font-size: 20px;">⚠️</div><div style="font-weight: 600; color: #92400e; margin: 0 0 10px 0; font-size: 16px;">注意事项</div>$1</div>');
    
    // 处理架构图占位符
    content = content.replace(/:::architecture\s*([\s\S]*?)\s*:::/g, 
      '<div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center; position: relative;"><div style="position: absolute; top: 15px; right: 15px; font-size: 24px; opacity: 0.3;">🏗️</div><div style="font-size: 16px; font-weight: 600; color: #475569; margin: 0 0 15px 0;">技术架构</div><div style="color: #64748b; font-style: italic; font-size: 14px;">$1</div></div>');
    
    // 处理技术对比表格
    content = content.replace(/:::comparison\s*([\s\S]*?)\s*:::/g, (match, tableContent) => {
      const lines = tableContent.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) return match;
      
      const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
      const rows = lines.slice(1).map(line => 
        line.split('|').map(cell => cell.trim()).filter(cell => cell)
      );
      
      const headerHtml = headers.map(h => `<th style="background: #0f172a; color: white; padding: 15px 12px; text-align: left; font-weight: 600; font-size: 14px;">${h}</th>`).join('');
      const rowsHtml = rows.map(row => 
        `<tr style="border-bottom: 1px solid #f1f5f9;">${row.map(cell => `<td style="padding: 12px; font-size: 14px;">${cell}</td>`).join('')}</tr>`
      ).join('');
      
      return `
        <div style="margin: 30px 0; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `;
    });
    
    // 处理段落
    content = this.processMarkdownParagraphs(content);
    
    // 处理强调文本 - 技术重点强调
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #3b82f6; font-weight: 600; background: linear-gradient(120deg, transparent 0%, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%, transparent 100%); padding: 2px 4px; border-radius: 3px;">$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em style="color: #06b6d4; font-style: normal; font-weight: 500; background: rgba(6, 182, 212, 0.1); padding: 2px 4px; border-radius: 3px;">$1</em>');
    
    // 处理链接 - 只显示链接文本，不添加超链接
    content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 处理有序列表
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 18px 0; line-height: 1.8; color: #333; padding-left: 8px;"><strong style="color: #3b82f6; margin-right: 8px;">•</strong>$1</div>');
    
    // 处理无序列表（但排除参考文献中的列表）
    content = content.replace(/^[-*+]\s+(.+)$/gm, '<div style="margin: 18px 0; line-height: 1.8; color: #333; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #3b82f6;">•</span>$1</div>');
    
    // 处理引用块 - 技术风格
    content = content.replace(/^>\s+(.+)$/gm, '<blockquote style="margin: 25px 0; padding: 20px 25px; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border-left: 4px solid #06b6d4; border-radius: 0 8px 8px 0; position: relative; font-style: italic;"><div style="position: absolute; top: 15px; right: 20px; font-size: 20px; opacity: 0.3;">💬</div><p style="margin: 0; color: #475569;">$1</p></blockquote>');
    
    // 处理代码块 - 技术风格增强
    content = content.replace(/`([^`]+)`/g, '<code style="font-family: \'SF Mono\', \'Monaco\', \'Cascadia Code\', \'Roboto Mono\', Consolas, \'Courier New\', monospace; background: #1e293b; color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: 500; border: 1px solid rgba(59, 130, 246, 0.2);">$1</code>');
    
    // 处理代码块（多行）
    content = content.replace(/```([\s\S]*?)```/g, '<div style="background: #1e293b; color: #e2e8f0; padding: 25px; border-radius: 8px; overflow-x: auto; margin: 25px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); position: relative;"><div style="position: absolute; top: 8px; right: 15px; font-size: 10px; color: rgba(226, 232, 240, 0.5); font-weight: 600; letter-spacing: 1px;">CODE</div><pre style="margin: 0; font-family: \'SF Mono\', \'Monaco\', \'Cascadia Code\', \'Roboto Mono\', Consolas, \'Courier New\', monospace; font-size: 14px; line-height: 1.6; color: inherit;">$1</pre></div>');
    
    // 处理图片占位符（符合微信公众号要求）
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '<div style="display: block; margin: 25px auto; padding: 20px; border: 2px dashed #d1d1d1; text-align: center; color: #888; background-color: #fafafa; border-radius: 8px;">[ 请在此处手动上传图片：$1 ]</div>');
    
    // 处理分隔符
    content = content.replace(/^---+$/gm, '<hr style="height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent); margin: 30px 0; border: none;">');
    
    // 扩展技术术语高亮范围
    const highlightTerms = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java',
      'API', '接口', '框架', '库', '组件', '模块', '插件', '中间件',
      '算法', '数据结构', '设计模式', '架构', '性能', '优化', '缓存',
      '前端', '后端', '全栈', '移动端', '服务端', '客户端',
      '开源', '技术栈', '工具链', '部署', '测试', '调试'
    ];
    
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(?<!<[^>]*?)\\b${term}\\b(?![^<]*?>)`, 'g');
      content = content.replace(regex, `<strong style="color: #3b82f6; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent); padding: 1px 3px; border-radius: 3px;">${term}</strong>`);
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
            processedLines.push(`<p style="margin: 18px 0; line-height: 1.8; font-size: 17px; color: #0f172a; text-align: justify;">${paragraphContent}</p>`);
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
        processedLines.push(`<p style="margin: 18px 0; line-height: 1.8; font-size: 17px; color: #0f172a; text-align: justify;">${paragraphContent}</p>`);
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
        <h2 style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 15px 20px; margin: 0 0 20px 0; color: #1e40af; font-size: 22px; font-weight: 600;">
          技术参考
        </h2>
        
        <p>
          <span style="font-size: 14px; font-style: italic;">※技术资源与参考资料，仅供学习交流。</span>
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
    // 确保数据完整性，专门为技术解读优化
    const renderData = {
      title: data.title || '技术深度解读：创新技术与实践分析',
      content: data.content || '',
      author: data.author || '技术团队',
      publishDate: data.publishDate || new Date().toLocaleDateString('zh-CN'),
      version: data.version || 'v1.0',
      difficulty: data.difficulty || '中级',
      category: data.category || '技术解读',
      tags: data.tags || [],
      subtitle: data.subtitle || '深度技术分析与实践指南',
      techStack: data.techStack || [],
      githubUrl: data.githubUrl || '',
      demoUrl: data.demoUrl || ''
    };
    
    return this.template(renderData);
  }
};