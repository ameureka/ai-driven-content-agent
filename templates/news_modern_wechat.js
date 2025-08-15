/**
 * 微信公众号专用 - 现代新闻模板
 * 基于通用设计原则重构，完全兼容微信公众号约束条件
 * 专门用于新闻报道、公告发布、实时资讯等内容
 * 遵循微信公众号CSS约束条件，使用行内样式
 */
export default {
  name: 'news_modern_wechat',
  displayName: '现代新闻模板',
  description: '专为新闻资讯设计的微信公众号模板，完全兼容微信编辑器约束',
  
  // 微信公众号不支持外部CSS和<style>标签，所有样式都通过行内样式实现
  styles: '',

  template: function(data) {
    // 从内容中提取第一个标题作为主标题
    const extractedTitle = this.extractFirstTitle(data.content) || data.title || '重要新闻：最新资讯报道';
    
    // 处理元数据
    const newsType = data.newsType || 'news';
    const publishDate = data.publishDate || new Date().toLocaleDateString('zh-CN');
    const publishTime = data.publishTime || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const author = data.author || '新闻编辑部';
    const source = data.source || '本站';
    const location = data.location || '';
    const subtitle = data.subtitle || '';
    const summary = data.summary || '';
    const urgentLevel = data.urgentLevel || 'normal'; // normal, important, urgent, breaking
    
    // 确定新闻类别信息
    const getNewsTypeInfo = (type) => {
      switch(type.toLowerCase()) {
        case 'breaking': return { class: 'breaking', icon: '🚨', text: '突发新闻', color: '#dc2626' };
        case 'urgent': return { class: 'urgent', icon: '⚡', text: '紧急通知', color: '#d97706' };
        case 'update': return { class: 'update', icon: '🔄', text: '最新更新', color: '#2563eb' };
        case 'announcement': return { class: 'announcement', icon: '📢', text: '官方公告', color: '#059669' };
        default: return { class: 'news', icon: '📰', text: '新闻资讯', color: '#dc2626' };
      }
    };
    
    const typeInfo = getNewsTypeInfo(newsType);
    
    // 生成紧急程度样式
    const getUrgentStyle = (level) => {
      switch(level) {
        case 'breaking': return 'background: linear-gradient(135deg, #fee2e2, #fef2f2); border: 2px solid #dc2626; animation: pulse 2s infinite;';
        case 'urgent': return 'background: linear-gradient(135deg, #fef3c7, #fffbeb); border: 2px solid #d97706;';
        case 'important': return 'background: linear-gradient(135deg, #dbeafe, #eff6ff); border: 2px solid #2563eb;';
        default: return '';
      }
    };
    
    // 生成摘要HTML
    const summaryHtml = summary 
      ? `<div style="background: #f8fafc; padding: 25px; border-bottom: 1px solid #d1d5db; position: relative;">
          <div style="position: absolute; top: 20px; right: 20px; font-size: 24px; opacity: 0.3;">📰</div>
          <div style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
            <span style="width: 4px; height: 16px; background: ${typeInfo.color}; border-radius: 2px;"></span>
            <span>新闻摘要</span>
          </div>
          <div style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0;">${summary}</div>
        </div>`
      : '';

    // 生成时间线HTML（如果内容中包含）
    const generateTimelineHtml = (content) => {
      const timelineMatch = content.match(/:::timeline\s*([\s\S]*?)\s*:::/g);
      if (!timelineMatch) return '';
      
      return timelineMatch.map(match => {
        const timelineContent = match.replace(/:::timeline\s*/, '').replace(/\s*:::/, '');
        const timelineItems = timelineContent.trim().split('\n').filter(line => line.trim());
        
        const timelineHtml = timelineItems.map(item => {
          const [time, ...contentParts] = item.split(' - ');
          const content = contentParts.join(' - ');
          return `
            <div style="position: relative; margin: 20px 0; padding: 15px 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0891b2;">
              <div style="position: absolute; left: -35px; top: 20px; width: 10px; height: 10px; background: #0891b2; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #0891b2;"></div>
              <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 5px;">${time}</div>
              <div style="font-size: 14px; color: #111827; margin: 0;">${content}</div>
            </div>
          `;
        }).join('');
        
        return `
          <div style="margin: 30px 0; position: relative; padding-left: 30px;">
            <div style="position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #cbd5e1;"></div>
            <div style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
              <span>⏰</span>
              <span>事件时间线</span>
            </div>
            ${timelineHtml}
          </div>
        `;
      }).join('');
    };

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(data.content);

    return `
<!-- 微信公众号专用现代新闻模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
    
    <!-- 新闻头部 -->
    <div style="background: linear-gradient(135deg, ${typeInfo.color} 0%, #991b1b 100%); color: white; padding: 0; position: relative; overflow: hidden;">
        <!-- 新闻类别标签 -->
        <div style="background: rgba(0, 0, 0, 0.1); padding: 12px 25px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; backdrop-filter: blur(10px);">
                <span>${typeInfo.icon}</span>
                <span>${typeInfo.text}</span>
            </div>
        </div>
        
        <!-- 主标题区域 -->
        <div style="padding: 30px 25px; position: relative;">
            ${urgentLevel !== 'normal' ? `<div style="position: absolute; top: 20px; right: 20px; font-size: 24px; animation: shake 1s infinite;">🚨</div>` : ''}
            <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 15px 0; line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <span>📰</span>
                <span>${extractedTitle}</span>
            </h1>
            ${subtitle ? `<div style="font-size: 16px; opacity: 0.9; margin: 0 0 20px 0; font-weight: 400; line-height: 1.4;">${subtitle}</div>` : ''}
            
            <!-- 新闻元信息 -->
            <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <span>📅</span>
                    <span>${publishDate}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <span>🕐</span>
                    <span>${publishTime}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <span>✍️</span>
                    <span>${author}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <span>📡</span>
                    <span>${source}</span>
                </div>
                ${location ? `
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <span>📍</span>
                    <span>${location}</span>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
    
    ${summaryHtml}
    
    <!-- 紧急通知区域 -->
    ${urgentLevel !== 'normal' ? `
    <div style="${getUrgentStyle(urgentLevel)} border-radius: 8px; padding: 20px; margin: 25px; position: relative;">
        <div style="font-weight: 700; color: #991b1c; margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${urgentLevel === 'breaking' ? '突发新闻' : urgentLevel === 'urgent' ? '紧急通知' : '重要消息'}
        </div>
        <div style="color: #374151; font-size: 14px;">请关注最新进展，及时获取权威信息</div>
    </div>
    ` : ''}
    
    <!-- 文章内容区 -->
    <div style="padding: 40px 30px;">
        
        <!-- 文章信息 -->
        <div style="text-align: center; margin: 20px 0 30px 0;">
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; font-weight: 500; text-align: center;">
                全文 / 3000 字　阅读 / 大约 6 分钟
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                新闻来源：${source} · 发布时间：${publishDate} ${publishTime}
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
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, ${typeInfo.color}, transparent); margin: 30px 0; border: none;">
        
        <!-- 文章正文 -->
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333;">
            ${processedContent}
        </div>
        
        <!-- 分隔符 -->
        <hr style="height: 2px; background: linear-gradient(90deg, transparent, ${typeInfo.color}, transparent); margin: 30px 0; border: none;">
        
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
            新闻编辑部 / ${author}　信息来源 / ${source}
        </p>
        <p style="color: #666; font-size: 11px; font-style: italic; text-align: center; margin: 0;">
            📰 及时关注，准确报道 · 本文首发于${publishDate}
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
      <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; padding: 25px; margin: 30px 0; border-radius: 0 12px 12px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h3 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">新闻导读</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    filteredHeadings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      
      tocHtml += `
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #dc2626; font-size: 12px;">▶</span>
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
      
      // 特殊处理：如果是"导语"或"前言"，不添加编号
      if (title.includes('导语') || title.includes('前言')) {
        return `<section id="lead" style="margin: 30px 0;">
          <h2 style="color: #991b1c; font-size: 22px; font-weight: 600; margin: 35px 0 20px 0; padding: 15px 20px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); text-align: center;">
            ${title}
          </h2>
        </section>`;
      } else {
        sectionCounter.count++;
        return `<section id="section-${sectionCounter.count}" style="margin: 30px 0;">
          <h2 style="color: #991b1c; font-size: 22px; font-weight: 600; margin: 35px 0 20px 0; padding: 15px 20px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); text-align: center;">
            <span style="font-style: italic; font-weight: bold; color: #dc2626; margin-right: 10px; font-size: 24px;">${sectionCounter.count}:</span>${title}
          </h2>
        </section>`;
      }
    });
    
    // 处理三级标题
    content = content.replace(/^### (.+)$/gm, '<h3 style="color: #7f1d1d; font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; padding-left: 15px; border-left: 3px solid #dc2626;">$1</h3>');
    
    // 处理四级标题  
    content = content.replace(/^#### (.+)$/gm, '<h4 style="color: #555; font-size: 16px; font-weight: 600; margin: 20px 0 12px 0;">$1</h4>');
    
    // 处理紧急通知块
    content = content.replace(/:::urgent\s*([\s\S]*?)\s*:::/g, 
      '<div style="background: linear-gradient(135deg, #fef2f2, #ffffff); border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 25px 0; position: relative; animation: pulse 2s infinite;"><div style="font-weight: 700; color: #991b1c; margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">🚨 紧急通知</div>$1</div>');
    
    // 处理时间线
    content = content.replace(/:::timeline\s*([\s\S]*?)\s*:::/g, (match, timelineContent) => {
      const timelineItems = timelineContent.trim().split('\n').filter(line => line.trim());
      const timelineHtml = timelineItems.map(item => {
        const [time, ...contentParts] = item.split(' - ');
        const content = contentParts.join(' - ');
        return `
          <div style="position: relative; margin: 20px 0; padding: 15px 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0891b2;">
            <div style="position: absolute; left: -35px; top: 20px; width: 10px; height: 10px; background: #0891b2; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #0891b2;"></div>
            <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 5px;">${time}</div>
            <div style="font-size: 14px; color: #111827; margin: 0;">${content}</div>
          </div>
        `;
      }).join('');
      
      return `
        <div style="margin: 30px 0; position: relative; padding-left: 30px;">
          <div style="position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #cbd5e1;"></div>
          <div style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
            <span>⏰</span>
            <span>事件时间线</span>
          </div>
          ${timelineHtml}
        </div>
      `;
    });
    
    // 处理新闻要点
    content = content.replace(/:::highlights\s*([\s\S]*?)\s*:::/g, (match, highlightsContent) => {
      const highlights = highlightsContent.trim().split('\n').filter(line => line.trim());
      const highlightsHtml = highlights.map((highlight, index) => 
        `<div style="display: flex; align-items: flex-start; gap: 12px; margin: 12px 0; padding: 10px; background: white; border-radius: 6px; border-left: 3px solid #059669;">
          <div style="width: 20px; height: 20px; background: #059669; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; flex-shrink: 0; margin-top: 2px;">${index + 1}</div>
          <div>${highlight.replace(/^[-*]\s*/, '')}</div>
        </div>`
      ).join('');
      
      return `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin: 25px 0; position: relative;">
          <div style="position: absolute; top: 20px; right: 20px; font-size: 20px; opacity: 0.5;">⭐</div>
          <div style="font-size: 16px; font-weight: 600; color: #166534; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
            <span style="width: 4px; height: 16px; background: #16a34a; border-radius: 2px;"></span>
            <span>新闻要点</span>
          </div>
          <div>${highlightsHtml}</div>
        </div>
      `;
    });
    
    // 处理段落
    content = this.processMarkdownParagraphs(content);
    
    // 处理强调文本
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #dc2626; font-weight: 600;">$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em style="color: #dc2626; font-style: normal; font-weight: 500;">$1</em>');
    
    // 处理链接 - 只显示链接文本，不添加超链接
    content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 处理有序列表
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.8; color: #333; padding-left: 8px;"><strong style="color: #dc2626; margin-right: 8px;">•</strong>$1</div>');
    
    // 处理无序列表（但排除参考文献中的列表）
    content = content.replace(/^[-*+]\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.8; color: #333; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #dc2626;">•</span>$1</div>');
    
    // 处理引用块
    content = content.replace(/^>\s+(.+)$/gm, '<blockquote style="margin: 30px 0; padding: 24px 28px; background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(255, 255, 255, 0.8)); border-left: 5px solid #dc2626; border-radius: 0 12px 12px 0; font-style: italic; box-shadow: 0 4px 16px rgba(220, 38, 38, 0.1);"><p style="margin: 0; font-weight: 500; color: #991b1c;">$1</p></blockquote>');
    
    // 处理代码块
    content = content.replace(/`([^`]+)`/g, '<code style="background: #fef2f2; color: #dc2626; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 0.9em; border: 1px solid #fecaca; font-weight: 500;">$1</code>');
    
    // 处理图片占位符（符合微信公众号要求）
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '<div style="display: block; margin: 20px auto; padding: 20px; border: 2px dashed #d1d1d1; text-align: center; color: #888; background-color: #fafafa; border-radius: 8px;">[ 请在此处手动上传图片：$1 ]</div>');
    
    // 处理分隔符
    content = content.replace(/^---+$/gm, '<hr style="height: 2px; background: linear-gradient(90deg, transparent, #dc2626, transparent); margin: 30px 0; border: none;">');
    
    // 扩展新闻术语高亮范围
    const highlightTerms = [
      '突发', '最新', '重要', '紧急', '官方', '权威', '消息', '通知', '公告',
      '新闻', '报道', '资讯', '信息', '发布', '更新', '进展', '动态',
      '政府', '部门', '机构', '组织', '企业', '市民', '民众', '社会'
    ];
    
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(?<!<[^>]*?)\\b${term}\\b(?![^<]*?>)`, 'g');
      content = content.replace(regex, `<strong style="color: #dc2626; background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), transparent); padding: 1px 3px; border-radius: 3px;">${term}</strong>`);
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
        <h2 style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 15px 20px; margin: 0 0 20px 0; color: #991b1c; font-size: 22px; font-weight: 600;">
          参考来源
        </h2>
        
        <p>
          <span style="font-size: 14px; font-style: italic;">※新闻信息来源，仅供参考。</span>
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
    // 确保数据完整性，专门为新闻优化
    const renderData = {
      title: data.title || '重要新闻：最新资讯报道',
      content: data.content || '',
      author: data.author || '新闻编辑部',
      publishDate: data.publishDate || new Date().toLocaleDateString('zh-CN'),
      publishTime: data.publishTime || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      source: data.source || '本站',
      newsType: data.newsType || 'news',
      urgentLevel: data.urgentLevel || 'normal',
      location: data.location || '',
      subtitle: data.subtitle || '',
      summary: data.summary || ''
    };
    
    return this.template(renderData);
  }
};