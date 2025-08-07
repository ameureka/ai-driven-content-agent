/**
 * 微信公众号专用 - 文章模板 (基于 render_demo 设计理念重构)
 * 融合了现代设计、技术风格和专业版的优秀元素
 * 专门针对微信公众号阅读体验优化
 */
export default {
  name: 'article_wechat',
  displayName: '微信文章',
  description: '专为微信公众号设计的现代文章模板，融合多种风格元素',
  
  styles: `
    /* CSS 变量定义 - 基于 render_demo 的设计系统 */
    :root {
      --primary-color: #3b82f6;
      --primary-dark: #2563eb;
      --secondary-color: #0ea5e9;
      --accent-color: #10b981;
      --text-color: #1e293b;
      --text-light: #64748b;
      --text-muted: #94a3b8;
      --bg-color: #ffffff;
      --bg-light: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
      --border-light: #f1f5f9;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --max-content-width: 750px; /* 微信推荐的最大内容宽度 */
      --font-size-base: 17px; /* 微信推荐的基础字体大小 */
      --line-height-base: 1.75; /* 微信推荐的行高 */
    }

    /* 全局样式 - 微信公众号优化 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: var(--line-height-base);
      margin: 0;
      padding: 20px;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-size: var(--font-size-base);
      letter-spacing: 0.5px;
      word-break: break-word;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* 主容器 */
    .main-container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      background: var(--bg-card);
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    /* 头部区域 - 融合现代和专业风格 */
    .article-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 30px 25px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .article-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
      opacity: 0.3;
    }

    .article-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 15px 0;
      line-height: 1.3;
      position: relative;
      z-index: 1;
    }

    .article-meta {
      font-size: 14px;
      opacity: 0.9;
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* 目录区域 - 基于 render_demo 的设计 */
    .table-of-contents {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin: 25px 0;
      padding: 20px;
    }

    .toc-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--primary-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toc-title::before {
      content: '📋';
      font-size: 16px;
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-item {
      margin: 8px 0;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .toc-item:hover {
      background: var(--border-light);
      border-left-color: var(--primary-color);
    }

    .toc-item a {
      color: var(--text-color);
      text-decoration: none;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toc-item-number {
      background: var(--primary-color);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }

    /* 内容区域 */
    .article-content {
      padding: 30px 25px;
    }

    /* 标题样式 - 层次化设计 */
    h1 {
      font-size: 26px;
      font-weight: 700;
      color: var(--primary-dark);
      margin: 30px 0 20px 0;
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
      background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
      border-radius: 2px;
    }

    h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-color);
      margin: 35px 0 18px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--border-color);
      position: relative;
    }

    h2::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background: var(--primary-color);
    }

    h3 {
      font-size: 19px;
      font-weight: 600;
      color: var(--text-color);
      margin: 25px 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h3::before {
      content: '▶';
      color: var(--primary-color);
      font-size: 14px;
    }

    /* 段落样式 */
    p {
      margin: 18px 0;
      line-height: var(--line-height-base);
      font-size: var(--font-size-base);
      color: var(--text-color);
      text-align: justify;
      text-indent: 2em;
    }

    /* 强调文本 */
    strong {
      color: var(--primary-dark);
      font-weight: 600;
    }

    em {
      color: var(--secondary-color);
      font-style: normal;
      background: linear-gradient(120deg, transparent 0%, var(--border-light) 0%, var(--border-light) 100%, transparent 100%);
      padding: 2px 4px;
      border-radius: 3px;
    }

    /* 引用样式 - 多种风格 */
    blockquote {
      margin: 25px 0;
      padding: 20px 25px;
      background: var(--bg-light);
      border-left: 4px solid var(--primary-color);
      border-radius: 0 8px 8px 0;
      position: relative;
      font-style: italic;
    }

    blockquote::before {
      content: '💡';
      position: absolute;
      left: -10px;
      top: 15px;
      background: var(--primary-color);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    /* 代码样式 */
    code {
      background: var(--bg-light);
      color: var(--primary-dark);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 0.9em;
      border: 1px solid var(--border-color);
    }

    pre {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      overflow-x: auto;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
    }

    pre code {
      background: none;
      border: none;
      padding: 0;
      color: var(--text-color);
    }

    /* 列表样式 */
    ul, ol {
      margin: 20px 0;
      padding-left: 30px;
    }

    li {
      margin: 8px 0;
      line-height: var(--line-height-base);
    }

    ul li::marker {
      color: var(--primary-color);
    }

    /* 链接样式 */
    a {
      color: var(--primary-color);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease;
    }

    a:hover {
      color: var(--primary-dark);
      border-bottom-color: var(--primary-color);
    }

    /* 图片样式 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: var(--shadow-sm);
    }

    /* 特殊内容块 */
    .note-block {
      background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
      border-left: 4px solid var(--secondary-color);
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }

    .tip-block {
      background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
      border-left: 4px solid var(--accent-color);
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }

    .warning-block {
      background: linear-gradient(135deg, #fef3c7 0%, #fefce8 100%);
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }

    .danger-block {
      background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
      border-left: 4px solid #ef4444;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }

    /* 分隔符 */
    hr {
      border: none;
      height: 2px;
      background: linear-gradient(to right, transparent, var(--border-color), transparent);
      margin: 40px 0;
    }

    /* 标签样式 */
    .tag {
      display: inline-block;
      background: var(--primary-color);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      margin: 2px 4px;
    }

    /* 页脚 */
    .article-footer {
      background: var(--bg-light);
      padding: 25px;
      text-align: center;
      border-top: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 14px;
    }

    /* 响应式设计 - 微信移动端优化 */
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      
      .main-container {
        border-radius: 0;
        box-shadow: none;
      }
      
      .article-header {
        padding: 25px 20px;
      }
      
      .article-title {
        font-size: 24px;
      }
      
      .article-content {
        padding: 25px 20px;
      }
      
      h1 {
        font-size: 22px;
      }
      
      h2 {
        font-size: 20px;
      }
      
      h3 {
        font-size: 18px;
      }
    }
  `,

  template: function(title, content, metadata = {}) {
    // 处理文章元数据
    const currentDate = new Date().toLocaleDateString('zh-CN');
    const tags = metadata.tags || [];
    const author = metadata.author || '作者';
    const readTime = metadata.readTime || '5分钟';
    
    // 生成目录
    const tocHtml = this.generateTableOfContents(content);
    
    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(content);
    
    return `
      <div class="main-container">
        <header class="article-header">
          <h1 class="article-title">${title}</h1>
          <div class="article-meta">
            <span class="meta-item">📅 ${currentDate}</span>
            <span class="meta-item">👤 ${author}</span>
            <span class="meta-item">⏱️ ${readTime}</span>
          </div>
        </header>
        
        ${tocHtml}
        
        <main class="article-content">
          ${processedContent}
        </main>
        
        <footer class="article-footer">
          <p>感谢阅读 | 欢迎分享</p>
          ${tags.length > 0 ? `<div class="tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
        </footer>
      </div>
    `;
  },

  generateTableOfContents: function(content) {
    const headings = content.match(/<h[2-3][^>]*>.*?<\/h[2-3]>/gi) || [];
    if (headings.length === 0) return '';
    
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/<h([2-3])/)[1];
      const text = heading.replace(/<[^>]*>/g, '');
      const id = `heading-${index}`;
      return `<li class="toc-item toc-level-${level}"><a href="#${id}"><span class="toc-item-number">${index + 1}</span>${text}</a></li>`;
    }).join('');
    
    return `
      <nav class="table-of-contents">
        <h2 class="toc-title">目录</h2>
        <ul class="toc-list">${tocItems}</ul>
      </nav>
    `;
  },

  processSpecialBlocks: function(content) {
    return content
      .replace(/:::note([\s\S]*?):::/g, '<div class="note-block">$1</div>')
      .replace(/:::tip([\s\S]*?):::/g, '<div class="tip-block">$1</div>')
      .replace(/:::warning([\s\S]*?):::/g, '<div class="warning-block">$1</div>')
      .replace(/:::danger([\s\S]*?):::/g, '<div class="danger-block">$1</div>');
  },

  render: function(title, content, metadata = {}) {
    return this.template(title, content, metadata);
  }
};