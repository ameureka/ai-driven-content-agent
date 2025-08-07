/**
 * 微信公众号专用 - 专业分析模板 (基于 render_demo 专业版风格重构)
 * 专门用于深度技术分析、研究报告、学术论文解读、专业文档等内容
 * 融合了 render_demo 中专业版的设计元素
 */
export default {
  name: 'professional_analysis_wechat',
  displayName: '专业分析',
  description: '专为深度技术分析设计的微信公众号模板，适合研究报告、学术论文解读等',
  
  styles: `
    /* CSS 变量定义 - 专业版风格配色 */
    :root {
      --primary-color: #1e293b;
      --primary-light: #334155;
      --primary-dark: #0f172a;
      --secondary-color: #0ea5e9;
      --accent-color: #8b5cf6;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --danger-color: #ef4444;
      --text-color: #1e293b;
      --text-light: #475569;
      --text-muted: #64748b;
      --text-inverse: #ffffff;
      --bg-color: #ffffff;
      --bg-light: #f8fafc;
      --bg-dark: #1e293b;
      --bg-card: #ffffff;
      --bg-section: #f1f5f9;
      --border-color: #cbd5e1;
      --border-light: #e2e8f0;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      --max-content-width: 750px;
      --font-size-base: 16px;
      --line-height-base: 1.7;
      --border-radius: 8px;
      --font-serif: 'Times New Roman', 'Noto Serif SC', serif;
      --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }

    /* 全局样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: var(--line-height-base);
      margin: 0;
      padding: 20px;
      background: var(--bg-light);
      color: var(--text-color);
      font-size: var(--font-size-base);
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
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-light);
    }

    /* 专业版头部 */
    .professional-header {
      background: linear-gradient(135deg, var(--bg-dark) 0%, var(--primary-light) 100%);
      color: var(--text-inverse);
      padding: 0;
      position: relative;
      overflow: hidden;
    }

    .professional-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="professional-pattern" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="none"/><circle cx="10" cy="10" r="0.5" fill="%23ffffff" opacity="0.1"/><line x1="0" y1="10" x2="20" y2="10" stroke="%23ffffff" stroke-width="0.2" opacity="0.05"/><line x1="10" y1="0" x2="10" y2="20" stroke="%23ffffff" stroke-width="0.2" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23professional-pattern)"/></svg>') repeat;
    }

    /* 文档类型标签 */
    .document-type-bar {
      background: rgba(0, 0, 0, 0.2);
      padding: 15px 25px;
      position: relative;
      z-index: 1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .document-type {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .document-type.research { background: rgba(14, 165, 233, 0.8); }
    .document-type.analysis { background: rgba(139, 92, 246, 0.8); }
    .document-type.report { background: rgba(16, 185, 129, 0.8); }
    .document-type.academic { background: rgba(245, 158, 11, 0.8); }

    /* 专业版主信息区域 */
    .professional-info-section {
      padding: 40px 30px;
      position: relative;
      z-index: 1;
    }

    .professional-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 12px 0;
      line-height: 1.2;
      font-family: var(--font-serif);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .professional-subtitle {
      font-size: 18px;
      opacity: 0.9;
      margin: 0 0 25px 0;
      font-weight: 400;
      line-height: 1.4;
      font-style: italic;
    }

    .professional-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      font-size: 14px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      padding: 12px 16px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .meta-icon {
      font-size: 16px;
      opacity: 0.8;
    }

    /* 摘要区域 */
    .abstract-section {
      background: var(--bg-section);
      padding: 30px;
      border-bottom: 1px solid var(--border-light);
    }

    .abstract-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-serif);
    }

    .abstract-title::before {
      content: '📋';
      font-size: 20px;
    }

    .abstract-content {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-light);
      background: white;
      padding: 25px;
      border-radius: var(--border-radius);
      border-left: 4px solid var(--secondary-color);
      box-shadow: var(--shadow-sm);
      font-style: italic;
    }

    /* 目录区域 */
    .toc-section {
      background: white;
      padding: 30px;
      border-bottom: 1px solid var(--border-light);
    }

    .toc-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-serif);
    }

    .toc-title::before {
      content: '📑';
      font-size: 20px;
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-item {
      margin: 12px 0;
      padding: 12px 20px;
      background: var(--bg-light);
      border-radius: 6px;
      border-left: 3px solid var(--border-color);
      transition: all 0.2s ease;
    }

    .toc-item:hover {
      border-left-color: var(--secondary-color);
      background: #e0f2fe;
    }

    .toc-item.level-1 {
      font-weight: 600;
      font-size: 16px;
    }

    .toc-item.level-2 {
      margin-left: 20px;
      font-size: 15px;
    }

    .toc-item.level-3 {
      margin-left: 40px;
      font-size: 14px;
      color: var(--text-light);
    }

    .toc-link {
      color: var(--text-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toc-link:hover {
      color: var(--secondary-color);
    }

    /* 内容区域 */
    .professional-content {
      padding: 40px 30px;
    }

    /* 标题样式 - 专业版风格 */
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-color);
      margin: 40px 0 20px 0;
      line-height: 1.3;
      font-family: var(--font-serif);
      position: relative;
      padding: 25px 30px;
      background: linear-gradient(135deg, var(--bg-section) 0%, white 100%);
      border-radius: var(--border-radius);
      border-left: 5px solid var(--primary-color);
      box-shadow: var(--shadow-md);
    }

    h1::before {
      content: counter(section) '.';
      counter-increment: section;
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }

    h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-color);
      margin: 35px 0 18px 0;
      padding: 20px 25px;
      background: white;
      border: 1px solid var(--border-light);
      border-left: 4px solid var(--secondary-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      font-family: var(--font-serif);
    }

    h2::before {
      content: counter(subsection, upper-alpha) '.';
      counter-increment: subsection;
      margin-right: 10px;
      color: var(--secondary-color);
      font-weight: 700;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin: 30px 0 16px 0;
      padding: 15px 20px;
      background: var(--bg-light);
      border-radius: 6px;
      border-left: 3px solid var(--accent-color);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h3::before {
      content: counter(subsubsection) '.';
      counter-increment: subsubsection;
      background: var(--accent-color);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }

    /* 重置计数器 */
    body {
      counter-reset: section;
    }

    h1 {
      counter-reset: subsection;
    }

    h2 {
      counter-reset: subsubsection;
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

    /* 首段不缩进 */
    h1 + p,
    h2 + p,
    h3 + p {
      text-indent: 0;
    }

    /* 引用样式 - 学术风格 */
    blockquote {
      margin: 25px 0;
      padding: 25px 30px;
      background: white;
      border-left: 5px solid var(--secondary-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      box-shadow: var(--shadow-md);
      position: relative;
      font-style: italic;
      color: var(--text-light);
    }

    blockquote::before {
      content: '"';
      position: absolute;
      left: -15px;
      top: 20px;
      font-size: 48px;
      color: var(--secondary-color);
      opacity: 0.3;
      font-family: var(--font-serif);
      line-height: 1;
    }

    /* 研究方法框 */
    .methodology-block {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid var(--secondary-color);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 30px 0;
      position: relative;
    }

    .methodology-block::before {
      content: '🔬 研究方法';
      position: absolute;
      top: -12px;
      left: 20px;
      background: var(--secondary-color);
      color: white;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
    }

    /* 数据表格 */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      background: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    .data-table th {
      background: var(--primary-color);
      color: white;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }

    .data-table td {
      padding: 12px;
      border-bottom: 1px solid var(--border-light);
      font-size: 14px;
    }

    .data-table tr:nth-child(even) {
      background: var(--bg-light);
    }

    .data-table tr:hover {
      background: #e0f2fe;
    }

    /* 公式样式 */
    .formula-block {
      background: white;
      border: 2px solid var(--accent-color);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 30px 0;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 18px;
      position: relative;
      box-shadow: var(--shadow-md);
    }

    .formula-block::before {
      content: '📐 公式';
      position: absolute;
      top: -12px;
      left: 20px;
      background: var(--accent-color);
      color: white;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
    }

    /* 代码样式 */
    code {
      background: var(--bg-light);
      color: var(--primary-color);
      padding: 3px 6px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.9em;
      border: 1px solid var(--border-color);
    }

    pre {
      background: var(--bg-dark);
      color: #e2e8f0;
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 14px;
      line-height: 1.6;
      box-shadow: var(--shadow-md);
    }

    pre code {
      background: none;
      border: none;
      padding: 0;
      color: inherit;
    }

    /* 强调文本 */
    strong {
      color: var(--primary-color);
      font-weight: 700;
    }

    em {
      color: var(--secondary-color);
      font-style: italic;
      background: linear-gradient(120deg, transparent 0%, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%, transparent 100%);
      padding: 2px 4px;
      border-radius: 3px;
    }

    /* 脚注样式 */
    .footnote {
      font-size: 12px;
      color: var(--text-muted);
      border-top: 1px solid var(--border-light);
      padding-top: 15px;
      margin-top: 30px;
    }

    .footnote-ref {
      color: var(--secondary-color);
      text-decoration: none;
      font-weight: 600;
      vertical-align: super;
      font-size: 0.8em;
    }

    /* 参考文献 */
    .references-block {
      background: var(--bg-section);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 30px 0;
    }

    .references-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-serif);
    }

    .references-title::before {
      content: '📚';
      font-size: 20px;
    }

    .reference-item {
      margin: 12px 0;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-light);
      font-size: 14px;
      line-height: 1.6;
    }

    .reference-item:last-child {
      border-bottom: none;
    }

    /* 链接样式 */
    a {
      color: var(--secondary-color);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease;
    }

    a:hover {
      color: var(--primary-color);
      border-bottom-color: var(--secondary-color);
    }

    /* 图片样式 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      margin: 25px 0;
      box-shadow: var(--shadow-md);
    }

    .figure {
      text-align: center;
      margin: 30px 0;
    }

    .figure-caption {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 10px;
      font-style: italic;
    }

    /* 列表样式 */
    ul, ol {
      margin: 20px 0;
      padding-left: 30px;
    }

    li {
      margin: 10px 0;
      line-height: var(--line-height-base);
    }

    ul li::marker {
      color: var(--secondary-color);
    }

    ol li::marker {
      color: var(--primary-color);
      font-weight: 600;
    }

    /* 页脚 */
    .professional-footer {
      background: var(--bg-dark);
      color: var(--text-inverse);
      padding: 30px;
      text-align: center;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .footer-section h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 10px 0;
      color: var(--secondary-color);
    }

    .footer-section p {
      font-size: 14px;
      margin: 5px 0;
      opacity: 0.8;
      text-indent: 0;
    }

    .footer-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 20px 0;
    }

    .footer-copyright {
      font-size: 12px;
      opacity: 0.6;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      
      .main-container {
        border-radius: 0;
        box-shadow: none;
      }
      
      .professional-info-section {
        padding: 30px 20px;
      }
      
      .professional-title {
        font-size: 26px;
      }
      
      .professional-content {
        padding: 30px 20px;
      }
      
      .abstract-section,
      .toc-section {
        padding: 25px 20px;
      }
      
      h1 {
        font-size: 24px;
        padding: 20px 25px;
      }
      
      h2 {
        font-size: 20px;
        padding: 15px 20px;
      }
      
      h3 {
        font-size: 16px;
        padding: 12px 15px;
      }
      
      .professional-meta {
        grid-template-columns: 1fr;
      }
    }
  `,

  template: function(title, content, metadata = {}) {
    // 处理文章元数据
    const currentDate = new Date().toLocaleDateString('zh-CN');
    const author = metadata.author || '研究员';
    const institution = metadata.institution || '研究机构';
    const docType = metadata.docType || 'analysis';
    const keywords = metadata.keywords || [];
    const abstract = metadata.abstract || '';
    const doi = metadata.doi || '';
    
    // 生成关键词HTML
    const keywordsHtml = keywords.length > 0 ? 
      `<div class="meta-item"><span class="meta-icon">🏷️</span>关键词: ${keywords.join(', ')}</div>` : '';
    
    // 生成摘要HTML
    const abstractHtml = abstract ? `
      <section class="abstract-section">
        <h2 class="abstract-title">摘要</h2>
        <div class="abstract-content">${abstract}</div>
      </section>
    ` : '';
    
    // 生成目录
    const tocHtml = this.generateTableOfContents(content);
    
    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(content);
    
    return `
      <div class="main-container">
        <header class="professional-header">
          <div class="document-type-bar">
            <span class="document-type ${docType}">
              ${this.getDocTypeIcon(docType)} ${this.getDocTypeName(docType)}
            </span>
          </div>
          
          <div class="professional-info-section">
            <h1 class="professional-title">${title}</h1>
            <p class="professional-subtitle">专业技术分析报告</p>
            
            <div class="professional-meta">
              <div class="meta-item">
                <span class="meta-icon">👤</span>
                作者: ${author}
              </div>
              <div class="meta-item">
                <span class="meta-icon">🏛️</span>
                机构: ${institution}
              </div>
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                日期: ${currentDate}
              </div>
              ${doi ? `<div class="meta-item"><span class="meta-icon">🔗</span>DOI: ${doi}</div>` : ''}
              ${keywordsHtml}
            </div>
          </div>
        </header>
        
        ${abstractHtml}
        
        ${tocHtml}
        
        <main class="professional-content">
          ${processedContent}
        </main>
        
        <footer class="professional-footer">
          <div class="footer-content">
            <div class="footer-section">
              <h4>作者信息</h4>
              <p>${author}</p>
              <p>${institution}</p>
            </div>
            <div class="footer-section">
              <h4>发布信息</h4>
              <p>发布日期: ${currentDate}</p>
              <p>文档类型: ${this.getDocTypeName(docType)}</p>
            </div>
            <div class="footer-section">
              <h4>版权声明</h4>
              <p>本文档受版权保护</p>
              <p>转载请注明出处</p>
            </div>
          </div>
          <div class="footer-divider"></div>
          <div class="footer-copyright">
            © ${new Date().getFullYear()} ${institution}. 保留所有权利。
          </div>
        </footer>
      </div>
    `;
  },

  getDocTypeIcon: function(type) {
    const icons = {
      research: '🔬',
      analysis: '📊',
      report: '📋',
      academic: '🎓'
    };
    return icons[type] || '📄';
  },

  getDocTypeName: function(type) {
    const names = {
      research: '研究论文',
      analysis: '技术分析',
      report: '研究报告',
      academic: '学术论文'
    };
    return names[type] || '专业文档';
  },

  generateTableOfContents: function(content) {
    const headings = content.match(/<h[1-3][^>]*>.*?<\/h[1-3]>/gi) || [];
    if (headings.length === 0) return '';
    
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/<h([1-3])/)[1];
      const text = heading.replace(/<[^>]*>/g, '');
      const id = `heading-${index}`;
      return `<li class="toc-item level-${level}"><a href="#${id}" class="toc-link">${text}</a></li>`;
    }).join('');
    
    return `
      <section class="toc-section">
        <h2 class="toc-title">目录</h2>
        <ul class="toc-list">${tocItems}</ul>
      </section>
    `;
  },

  processSpecialBlocks: function(content) {
    return content
      .replace(/:::methodology([\s\S]*?):::/g, '<div class="methodology-block">$1</div>')
      .replace(/:::table([\s\S]*?):::/g, '<div class="data-table">$1</div>')
      .replace(/:::formula([\s\S]*?):::/g, '<div class="formula-block">$1</div>')
      .replace(/:::references([\s\S]*?):::/g, '<div class="references-block"><h3 class="references-title">参考文献</h3>$1</div>')
      .replace(/:::figure([\s\S]*?):::/g, '<div class="figure">$1</div>');
  },

  render: function(title, content, metadata = {}) {
    return this.template(title, content, metadata);
  }
};