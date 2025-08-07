/**
 * 微信公众号专用 - 技术解读模板 (基于 render_demo 技术风格重构)
 * 专门用于技术产品、工具、框架的深度分析和解读
 * 融合了 render_demo 中技术风格的设计元素
 */
export default {
  name: 'tech_analysis_wechat',
  displayName: '技术解读',
  description: '专为技术内容解读设计的微信公众号模板，适合技术产品分析、工具介绍等',
  
  styles: `
    /* CSS 变量定义 - 技术风格配色 */
    :root {
      --primary-color: #0f172a;
      --primary-light: #1e293b;
      --secondary-color: #3b82f6;
      --accent-color: #06b6d4;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --danger-color: #ef4444;
      --text-color: #0f172a;
      --text-light: #475569;
      --text-muted: #64748b;
      --bg-color: #ffffff;
      --bg-light: #f8fafc;
      --bg-dark: #0f172a;
      --bg-code: #1e293b;
      --border-color: #e2e8f0;
      --border-light: #f1f5f9;
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
      background: var(--bg-color);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    /* 技术风格头部 */
    .tech-header {
      background: var(--bg-dark);
      color: white;
      padding: 35px 25px;
      position: relative;
      overflow: hidden;
    }

    .tech-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
      animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
      0%, 100% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
    }

    .tech-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 15px 0;
      line-height: 1.2;
      position: relative;
      z-index: 1;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .tech-subtitle {
      font-size: 16px;
      opacity: 0.8;
      margin: 0 0 20px 0;
      position: relative;
      z-index: 1;
      font-weight: 400;
    }

    .tech-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }

    .tech-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.1);
      padding: 6px 12px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
    }

    /* 技术标签区域 */
    .tech-tags {
      background: var(--bg-light);
      padding: 20px 25px;
      border-bottom: 1px solid var(--border-color);
    }

    .tech-tags-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-light);
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .tech-tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-tag {
      background: var(--secondary-color);
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tech-tag.framework { background: var(--accent-color); }
    .tech-tag.language { background: var(--success-color); }
    .tech-tag.tool { background: var(--warning-color); }
    .tech-tag.platform { background: var(--danger-color); }

    /* 内容区域 */
    .tech-content {
      padding: 30px 25px;
    }

    /* 技术概览卡片 */
    .tech-overview {
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 0 0 30px 0;
      position: relative;
    }

    .tech-overview::before {
      content: '🔍';
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 24px;
      opacity: 0.3;
    }

    .overview-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .overview-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: var(--secondary-color);
      border-radius: 2px;
    }

    /* 标题样式 - 技术风格 */
    h1 {
      font-size: 26px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 35px 0 20px 0;
      line-height: 1.3;
      position: relative;
      padding-left: 25px;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    h1::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
      background: linear-gradient(to bottom, var(--secondary-color), var(--accent-color));
      border-radius: 3px;
    }

    h1::after {
      content: '#';
      position: absolute;
      left: -20px;
      top: 0;
      color: var(--secondary-color);
      font-size: 20px;
      opacity: 0.3;
      font-weight: 400;
    }

    h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-color);
      margin: 30px 0 18px 0;
      padding: 15px 20px;
      background: var(--bg-light);
      border-left: 4px solid var(--secondary-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      position: relative;
    }

    h2::before {
      content: '##';
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--secondary-color);
      font-size: 14px;
      opacity: 0.5;
      font-weight: 400;
    }

    h3 {
      font-size: 19px;
      font-weight: 600;
      color: var(--text-color);
      margin: 25px 0 15px 0;
      display: flex;
      align-items: center;
      gap: 10px;
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
      margin: 18px 0;
      line-height: var(--line-height-base);
      font-size: var(--font-size-base);
      color: var(--text-color);
      text-align: justify;
    }

    /* 技术重点强调 */
    strong {
      color: var(--secondary-color);
      font-weight: 600;
      background: linear-gradient(120deg, transparent 0%, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%, transparent 100%);
      padding: 2px 4px;
      border-radius: 3px;
    }

    em {
      color: var(--accent-color);
      font-style: normal;
      font-weight: 500;
      background: rgba(6, 182, 212, 0.1);
      padding: 2px 4px;
      border-radius: 3px;
    }

    /* 代码样式 - 技术风格增强 */
    code {
      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      background: var(--bg-code);
      color: #e2e8f0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    pre {
      background: var(--bg-code);
      color: #e2e8f0;
      padding: 25px;
      border-radius: var(--border-radius);
      overflow-x: auto;
      margin: 25px 0;
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(59, 130, 246, 0.2);
      position: relative;
    }

    pre::before {
      content: 'CODE';
      position: absolute;
      top: 8px;
      right: 15px;
      font-size: 10px;
      color: rgba(226, 232, 240, 0.5);
      font-weight: 600;
      letter-spacing: 1px;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
      font-size: 14px;
      line-height: 1.6;
    }

    /* 技术特性列表 */
    .tech-features {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
    }

    .tech-features-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tech-features-title::before {
      content: '⚡';
      font-size: 20px;
    }

    .tech-features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .tech-feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 15px 0;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid var(--secondary-color);
    }

    .tech-feature-icon {
      width: 24px;
      height: 24px;
      background: var(--secondary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* 技术对比表格 */
    .tech-comparison {
      margin: 30px 0;
      overflow-x: auto;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .comparison-table th {
      background: var(--primary-color);
      color: white;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }

    .comparison-table td {
      padding: 12px;
      border-bottom: 1px solid var(--border-light);
      font-size: 14px;
    }

    .comparison-table tr:hover {
      background: var(--bg-light);
    }

    /* 技术架构图 */
    .tech-architecture {
      background: var(--bg-light);
      border: 2px dashed var(--border-color);
      border-radius: var(--border-radius);
      padding: 30px;
      margin: 30px 0;
      text-align: center;
      position: relative;
    }

    .tech-architecture::before {
      content: '🏗️';
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 24px;
      opacity: 0.3;
    }

    .architecture-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-light);
      margin: 0 0 15px 0;
    }

    .architecture-placeholder {
      color: var(--text-muted);
      font-style: italic;
      font-size: 14px;
    }

    /* 引用样式 - 技术风格 */
    blockquote {
      margin: 25px 0;
      padding: 20px 25px;
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border-left: 4px solid var(--accent-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      position: relative;
      font-style: italic;
    }

    blockquote::before {
      content: '💬';
      position: absolute;
      top: 15px;
      right: 20px;
      font-size: 20px;
      opacity: 0.3;
    }

    blockquote p {
      margin: 0;
      color: var(--text-light);
    }

    /* 技术提示框 */
    .tech-tip {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #0ea5e9;
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 25px 0;
      position: relative;
    }

    .tech-tip::before {
      content: '💡';
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 20px;
    }

    .tech-tip-title {
      font-weight: 600;
      color: #0369a1;
      margin: 0 0 10px 0;
      font-size: 16px;
    }

    /* 技术警告框 */
    .tech-warning {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 1px solid #f59e0b;
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 25px 0;
      position: relative;
    }

    .tech-warning::before {
      content: '⚠️';
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 20px;
    }

    .tech-warning-title {
      font-weight: 600;
      color: #92400e;
      margin: 0 0 10px 0;
      font-size: 16px;
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
      color: var(--accent-color);
      border-bottom-color: var(--accent-color);
    }

    /* 页脚 */
    .tech-footer {
      background: var(--bg-dark);
      color: white;
      padding: 25px;
      text-align: center;
      margin-top: 40px;
    }

    .footer-content {
      font-size: 14px;
      opacity: 0.8;
      line-height: 1.6;
    }

    .footer-tech-info {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
      opacity: 0.6;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      body {
        padding: 15px;
        font-size: 16px;
      }

      .tech-header {
        padding: 25px 20px;
      }

      .tech-title {
        font-size: 24px;
      }

      .tech-content {
        padding: 25px 20px;
      }

      .tech-meta {
        flex-direction: column;
        gap: 10px;
      }

      .comparison-table {
        font-size: 12px;
      }

      .comparison-table th,
      .comparison-table td {
        padding: 8px 6px;
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 10px;
        font-size: 15px;
      }

      .tech-header {
        padding: 20px 15px;
      }

      .tech-title {
        font-size: 20px;
      }

      .tech-content {
        padding: 20px 15px;
      }

      h1 {
        font-size: 22px;
      }

      h2 {
        font-size: 20px;
        padding: 12px 15px;
      }

      h3 {
        font-size: 18px;
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
    
    const author = metadata.author || '技术团队';
    const version = metadata.version || 'v1.0';
    const difficulty = metadata.difficulty || '中级';
    const category = metadata.category || '技术解读';
    const tags = metadata.tags || [];
    const subtitle = metadata.subtitle || '深度技术分析';
    
    // 生成技术标签HTML
    const tagsHtml = tags.length > 0 
      ? `<div class="tech-tags">
          <div class="tech-tags-title">技术标签</div>
          <div class="tech-tags-list">
            ${tags.map(tag => {
              let tagClass = 'tech-tag';
              if (tag.includes('框架') || tag.includes('Framework')) tagClass += ' framework';
              else if (tag.includes('语言') || tag.includes('Language')) tagClass += ' language';
              else if (tag.includes('工具') || tag.includes('Tool')) tagClass += ' tool';
              else if (tag.includes('平台') || tag.includes('Platform')) tagClass += ' platform';
              return `<span class="${tagClass}">${tag}</span>`;
            }).join('')}
          </div>
        </div>`
      : '';

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(content);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 技术解读</title>
    <style>${this.styles}</style>
</head>
<body>
    <div class="main-container">
        <header class="tech-header">
            <h1 class="tech-title">${title}</h1>
            <div class="tech-subtitle">${subtitle}</div>
            <div class="tech-meta">
                <div class="tech-meta-item">
                    <span>📅</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="tech-meta-item">
                    <span>👨‍💻</span>
                    <span>${author}</span>
                </div>
                <div class="tech-meta-item">
                    <span>🏷️</span>
                    <span>${version}</span>
                </div>
                <div class="tech-meta-item">
                    <span>📊</span>
                    <span>${difficulty}</span>
                </div>
                <div class="tech-meta-item">
                    <span>📂</span>
                    <span>${category}</span>
                </div>
            </div>
        </header>

        ${tagsHtml}

        <div class="tech-content">
            <div class="tech-overview">
                <div class="overview-title">技术概览</div>
                <p>本文将深入分析 <strong>${title}</strong> 的技术特性、架构设计、应用场景以及最佳实践，帮助开发者全面理解这项技术的核心价值和实际应用。</p>
            </div>
            
            <div class="tech-body">
                ${processedContent}
            </div>
        </div>

        <footer class="tech-footer">
            <div class="footer-content">
                <p>🚀 持续关注技术前沿，深度解读技术趋势</p>
                <div class="footer-tech-info">
                    <p>技术解读 · ${category} · ${new Date().getFullYear()}</p>
                    <p>由智能技术分析系统生成</p>
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
      // 技术特性列表
      .replace(/:::features\s*([\s\S]*?)\s*:::/g, (match, featuresContent) => {
        const features = featuresContent.trim().split('\n').filter(line => line.trim());
        const featuresHtml = features.map((feature, index) => 
          `<li class="tech-feature-item">
            <div class="tech-feature-icon">${index + 1}</div>
            <div>${feature.replace(/^[-*]\s*/, '')}</div>
          </li>`
        ).join('');
        return `<div class="tech-features">
          <div class="tech-features-title">核心特性</div>
          <ul class="tech-features-list">${featuresHtml}</ul>
        </div>`;
      })
      // 技术提示
      .replace(/:::tip\s*([\s\S]*?)\s*:::/g, '<div class="tech-tip"><div class="tech-tip-title">技术提示</div>$1</div>')
      // 技术警告
      .replace(/:::warning\s*([\s\S]*?)\s*:::/g, '<div class="tech-warning"><div class="tech-warning-title">注意事项</div>$1</div>')
      // 架构图占位符
      .replace(/:::architecture\s*([\s\S]*?)\s*:::/g, '<div class="tech-architecture"><div class="architecture-title">技术架构</div><div class="architecture-placeholder">$1</div></div>')
      // 技术对比表格
      .replace(/:::comparison\s*([\s\S]*?)\s*:::/g, (match, tableContent) => {
        const lines = tableContent.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) return match;
        
        const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = lines.slice(1).map(line => 
          line.split('|').map(cell => cell.trim()).filter(cell => cell)
        );
        
        const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
        const rowsHtml = rows.map(row => 
          `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');
        
        return `<div class="tech-comparison">
          <table class="comparison-table">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`;
      });
  }
};