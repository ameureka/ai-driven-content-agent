/**
 * 微信公众号专用 - 现代新闻模板 (基于 render_demo 现代风格重构)
 * 专门用于新闻报道、公告发布、实时资讯等内容
 * 融合了 render_demo 中现代风格的设计元素
 */
export default {
  name: 'news_modern_wechat',
  displayName: '现代新闻',
  description: '专为新闻资讯设计的现代化微信公众号模板，适合新闻报道、公告发布等',
  
  styles: `
    /* CSS 变量定义 - 现代新闻风格配色 */
    :root {
      --primary-color: #dc2626;
      --primary-light: #ef4444;
      --primary-dark: #b91c1c;
      --secondary-color: #2563eb;
      --accent-color: #059669;
      --warning-color: #d97706;
      --info-color: #0891b2;
      --text-color: #111827;
      --text-light: #4b5563;
      --text-muted: #6b7280;
      --bg-color: #ffffff;
      --bg-light: #f9fafb;
      --bg-card: #ffffff;
      --bg-urgent: #fef2f2;
      --border-color: #d1d5db;
      --border-light: #e5e7eb;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --max-content-width: 750px;
      --font-size-base: 17px;
      --line-height-base: 1.7;
      --border-radius: 8px;
    }

    /* 全局样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: var(--line-height-base);
      margin: 0;
      padding: 20px;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-size: var(--font-size-base);
      letter-spacing: 0.3px;
      word-break: break-word;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* 主容器 */
    .main-container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      background: var(--bg-card);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    /* 新闻头部 - 现代风格 */
    .news-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 0;
      position: relative;
      overflow: hidden;
    }

    .news-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>') repeat;
    }

    /* 新闻标签栏 */
    .news-category-bar {
      background: rgba(0, 0, 0, 0.1);
      padding: 12px 25px;
      position: relative;
      z-index: 1;
    }

    .news-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      backdrop-filter: blur(10px);
    }

    .news-category.breaking { background: rgba(239, 68, 68, 0.9); }
    .news-category.urgent { background: rgba(217, 119, 6, 0.9); }
    .news-category.update { background: rgba(37, 99, 235, 0.9); }
    .news-category.announcement { background: rgba(5, 150, 105, 0.9); }

    /* 新闻主标题区域 */
    .news-title-section {
      padding: 30px 25px;
      position: relative;
      z-index: 1;
    }

    .news-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 15px 0;
      line-height: 1.2;
      font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    }

    .news-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0 0 20px 0;
      font-weight: 400;
      line-height: 1.4;
    }

    .news-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 14px;
      align-items: center;
    }

    .news-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      padding: 6px 12px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }

    /* 新闻摘要区域 */
    .news-summary {
      background: var(--bg-light);
      padding: 25px;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }

    .news-summary::before {
      content: '📰';
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 24px;
      opacity: 0.3;
    }

    .summary-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .summary-title::before {
      content: '';
      width: 4px;
      height: 16px;
      background: var(--primary-color);
      border-radius: 2px;
    }

    .summary-content {
      font-size: 15px;
      color: var(--text-light);
      line-height: 1.6;
      margin: 0;
    }

    /* 内容区域 */
    .news-content {
      padding: 30px 25px;
    }

    /* 标题样式 - 新闻风格 */
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-dark);
      margin: 30px 0 18px 0;
      line-height: 1.3;
      position: relative;
      padding-left: 20px;
    }

    h1::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--primary-color);
      border-radius: 2px;
    }

    h2 {
      font-size: 21px;
      font-weight: 600;
      color: var(--text-color);
      margin: 28px 0 16px 0;
      padding: 12px 18px;
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border-left: 4px solid var(--secondary-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      box-shadow: var(--shadow-sm);
    }

    h3 {
      font-size: 19px;
      font-weight: 600;
      color: var(--text-color);
      margin: 24px 0 14px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border-light);
    }

    h3::before {
      content: '▸';
      color: var(--secondary-color);
      font-size: 16px;
      font-weight: 700;
    }

    /* 段落样式 */
    p {
      margin: 16px 0;
      line-height: var(--line-height-base);
      font-size: var(--font-size-base);
      color: var(--text-color);
      text-align: justify;
    }

    /* 首段特殊样式 */
    .news-content > p:first-of-type {
      font-size: 18px;
      font-weight: 500;
      color: var(--text-color);
      line-height: 1.6;
      margin-bottom: 25px;
      padding: 20px;
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border-left: 4px solid var(--accent-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }

    /* 强调文本 */
    strong {
      color: var(--primary-dark);
      font-weight: 600;
      background: linear-gradient(120deg, transparent 0%, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%, transparent 100%);
      padding: 2px 4px;
      border-radius: 3px;
    }

    em {
      color: var(--secondary-color);
      font-style: normal;
      font-weight: 500;
      background: rgba(37, 99, 235, 0.1);
      padding: 2px 4px;
      border-radius: 3px;
    }

    /* 引用样式 - 新闻风格 */
    blockquote {
      margin: 25px 0;
      padding: 20px 25px;
      background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
      border-left: 4px solid var(--primary-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      position: relative;
      font-style: italic;
    }

    blockquote::before {
      content: '"';
      font-size: 48px;
      color: var(--primary-color);
      position: absolute;
      top: 10px;
      left: 15px;
      opacity: 0.3;
      font-family: Georgia, serif;
    }

    blockquote p {
      margin: 0;
      padding-left: 30px;
      color: var(--text-light);
    }

    /* 新闻要点列表 */
    .news-highlights {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
      position: relative;
    }

    .news-highlights::before {
      content: '⭐';
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 20px;
      opacity: 0.5;
    }

    .highlights-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-dark);
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .highlights-title::before {
      content: '';
      width: 4px;
      height: 16px;
      background: var(--primary-color);
      border-radius: 2px;
    }

    .highlights-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .highlight-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 12px 0;
      padding: 10px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid var(--accent-color);
    }

    .highlight-icon {
      width: 20px;
      height: 20px;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* 时间线样式 */
    .news-timeline {
      margin: 30px 0;
      position: relative;
      padding-left: 30px;
    }

    .news-timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border-color);
    }

    .timeline-item {
      position: relative;
      margin: 20px 0;
      padding: 15px 20px;
      background: var(--bg-light);
      border-radius: var(--border-radius);
      border-left: 4px solid var(--info-color);
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -35px;
      top: 20px;
      width: 10px;
      height: 10px;
      background: var(--info-color);
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 2px var(--info-color);
    }

    .timeline-time {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 5px;
    }

    .timeline-content {
      font-size: 14px;
      color: var(--text-color);
      margin: 0;
    }

    /* 紧急通知样式 */
    .urgent-notice {
      background: linear-gradient(135deg, var(--bg-urgent) 0%, #ffffff 100%);
      border: 2px solid var(--primary-light);
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 25px 0;
      position: relative;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    }

    .urgent-notice::before {
      content: '🚨';
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 24px;
      animation: shake 1s infinite;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }

    .urgent-title {
      font-weight: 700;
      color: var(--primary-dark);
      margin: 0 0 10px 0;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* 数据统计样式 */
    .news-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 25px 0;
    }

    .stat-item {
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 20px;
      text-align: center;
      position: relative;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0 0 5px 0;
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    /* 链接样式 */
    a {
      color: var(--secondary-color);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    a:hover {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    /* 图片样式 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      margin: 20px auto;
      display: block;
      box-shadow: var(--shadow-md);
    }

    .image-caption {
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 8px;
      font-style: italic;
    }

    /* 页脚 */
    .news-footer {
      background: var(--bg-light);
      padding: 25px;
      text-align: center;
      border-top: 1px solid var(--border-color);
      margin-top: 40px;
    }

    .footer-content {
      font-size: 14px;
      color: var(--text-light);
      line-height: 1.6;
    }

    .footer-disclaimer {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid var(--border-light);
      font-size: 12px;
      color: var(--text-muted);
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      body {
        padding: 15px;
        font-size: 16px;
      }

      .news-title-section {
        padding: 25px 20px;
      }

      .news-title {
        font-size: 24px;
      }

      .news-content {
        padding: 25px 20px;
      }

      .news-meta {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }

      .news-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 10px;
        font-size: 15px;
      }

      .news-title-section {
        padding: 20px 15px;
      }

      .news-title {
        font-size: 20px;
      }

      .news-content {
        padding: 20px 15px;
      }

      .news-stats {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 20px;
      }

      h2 {
        font-size: 18px;
        padding: 10px 15px;
      }

      h3 {
        font-size: 16px;
      }
    }
  `,

  // 模板函数
  template: function(title, content, metadata = {}) {
    // 处理元数据
    const date = metadata.date || new Date();
    const formattedDate = date instanceof Date 
      ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const formattedTime = date instanceof Date 
      ? date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    const author = metadata.author || '新闻编辑部';
    const source = metadata.source || '本站';
    const category = metadata.category || 'news';
    const subtitle = metadata.subtitle || '';
    const summary = metadata.summary || '';
    const location = metadata.location || '';
    
    // 确定新闻类别样式
    const getCategoryInfo = (cat) => {
      switch(cat.toLowerCase()) {
        case 'breaking': return { class: 'breaking', icon: '🚨', text: '突发新闻' };
        case 'urgent': return { class: 'urgent', icon: '⚡', text: '紧急通知' };
        case 'update': return { class: 'update', icon: '🔄', text: '最新更新' };
        case 'announcement': return { class: 'announcement', icon: '📢', text: '官方公告' };
        default: return { class: 'news', icon: '📰', text: '新闻资讯' };
      }
    };
    
    const categoryInfo = getCategoryInfo(category);
    
    // 生成摘要HTML
    const summaryHtml = summary 
      ? `<div class="news-summary">
          <div class="summary-title">新闻摘要</div>
          <p class="summary-content">${summary}</p>
        </div>`
      : '';

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(content);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 新闻资讯</title>
    <style>${this.styles}</style>
</head>
<body>
    <div class="main-container">
        <header class="news-header">
            <div class="news-category-bar">
                <div class="news-category ${categoryInfo.class}">
                    <span>${categoryInfo.icon}</span>
                    <span>${categoryInfo.text}</span>
                </div>
            </div>
            
            <div class="news-title-section">
                <h1 class="news-title">${title}</h1>
                ${subtitle ? `<div class="news-subtitle">${subtitle}</div>` : ''}
                <div class="news-meta">
                    <div class="news-meta-item">
                        <span>📅</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="news-meta-item">
                        <span>🕐</span>
                        <span>${formattedTime}</span>
                    </div>
                    <div class="news-meta-item">
                        <span>✍️</span>
                        <span>${author}</span>
                    </div>
                    <div class="news-meta-item">
                        <span>📡</span>
                        <span>${source}</span>
                    </div>
                    ${location ? `
                    <div class="news-meta-item">
                        <span>📍</span>
                        <span>${location}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </header>

        ${summaryHtml}

        <div class="news-content">
            ${processedContent}
        </div>

        <footer class="news-footer">
            <div class="footer-content">
                <p>📰 及时关注，准确报道</p>
                <div class="footer-disclaimer">
                    <p>新闻资讯 · ${source} · ${new Date().getFullYear()}</p>
                    <p>本文内容仅供参考，具体信息以官方发布为准</p>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`;
  },

  // 渲染方法
  render: function(title, content, metadata = {}) {
    return this.template(title, content, metadata);
  },

  // 处理特殊内容块
  processSpecialBlocks: function(content) {
    return content
      // 新闻要点
      .replace(/:::highlights\s*([\s\S]*?)\s*:::/g, (match, highlightsContent) => {
        const highlights = highlightsContent.trim().split('\n').filter(line => line.trim());
        const highlightsHtml = highlights.map((highlight, index) => 
          `<li class="highlight-item">
            <div class="highlight-icon">${index + 1}</div>
            <div>${highlight.replace(/^[-*]\s*/, '')}</div>
          </li>`
        ).join('');
        return `<div class="news-highlights">
          <div class="highlights-title">新闻要点</div>
          <ul class="highlights-list">${highlightsHtml}</ul>
        </div>`;
      })
      // 时间线
      .replace(/:::timeline\s*([\s\S]*?)\s*:::/g, (match, timelineContent) => {
        const timelineItems = timelineContent.trim().split('\n').filter(line => line.trim());
        const timelineHtml = timelineItems.map(item => {
          const [time, ...contentParts] = item.split(' - ');
          const content = contentParts.join(' - ');
          return `<div class="timeline-item">
            <div class="timeline-time">${time}</div>
            <div class="timeline-content">${content}</div>
          </div>`;
        }).join('');
        return `<div class="news-timeline">${timelineHtml}</div>`;
      })
      // 紧急通知
      .replace(/:::urgent\s*([\s\S]*?)\s*:::/g, '<div class="urgent-notice"><div class="urgent-title">紧急通知</div>$1</div>')
      // 数据统计
      .replace(/:::stats\s*([\s\S]*?)\s*:::/g, (match, statsContent) => {
        const stats = statsContent.trim().split('\n').filter(line => line.trim());
        const statsHtml = stats.map(stat => {
          const [number, label] = stat.split(' - ');
          return `<div class="stat-item">
            <div class="stat-number">${number}</div>
            <div class="stat-label">${label}</div>
          </div>`;
        }).join('');
        return `<div class="news-stats">${statsHtml}</div>`;
      });
  }
};