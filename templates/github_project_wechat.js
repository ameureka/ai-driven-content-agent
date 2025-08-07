/**
 * 微信公众号专用 - GitHub 项目推荐模板 (基于 render_demo GitHub 风格重构)
 * 专门用于开源项目介绍、技术工具推荐、GitHub 仓库分析等内容
 * 融合了 render_demo 中 GitHub 风格的设计元素
 */
export default {
  name: 'github_project_wechat',
  displayName: 'GitHub 项目',
  description: '专为开源项目推荐设计的微信公众号模板，适合技术工具介绍、GitHub 仓库分析等',
  
  styles: `
    /* CSS 变量定义 - GitHub 风格配色 */
    :root {
      --primary-color: #0969da;
      --primary-light: #218bff;
      --primary-dark: #0550ae;
      --secondary-color: #1f883d;
      --accent-color: #8250df;
      --warning-color: #fb8500;
      --danger-color: #cf222e;
      --text-color: #1f2328;
      --text-light: #656d76;
      --text-muted: #8b949e;
      --bg-color: #ffffff;
      --bg-light: #f6f8fa;
      --bg-card: #ffffff;
      --bg-code: #f6f8fa;
      --border-color: #d1d9e0;
      --border-light: #e1e4e8;
      --shadow-sm: 0 1px 0 rgba(27, 31, 36, 0.04);
      --shadow-md: 0 3px 6px rgba(140, 149, 159, 0.15);
      --shadow-lg: 0 8px 24px rgba(140, 149, 159, 0.2);
      --max-content-width: 750px;
      --font-size-base: 16px;
      --line-height-base: 1.6;
      --border-radius: 6px;
      --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }

    /* 全局样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: var(--line-height-base);
      margin: 0;
      padding: 20px;
      background-color: var(--bg-light);
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
      border: 1px solid var(--border-color);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    /* GitHub 风格头部 */
    .github-header {
      background: linear-gradient(135deg, #24292f 0%, #1c2128 100%);
      color: white;
      padding: 0;
      position: relative;
      overflow: hidden;
    }

    .github-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="github-pattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="0.5" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23github-pattern)"/></svg>') repeat;
    }

    /* 项目类型标签 */
    .project-type-bar {
      background: rgba(0, 0, 0, 0.2);
      padding: 12px 25px;
      position: relative;
      z-index: 1;
    }

    .project-type {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      backdrop-filter: blur(10px);
    }

    .project-type.library { background: rgba(9, 105, 218, 0.8); }
    .project-type.framework { background: rgba(130, 80, 223, 0.8); }
    .project-type.tool { background: rgba(31, 136, 61, 0.8); }
    .project-type.app { background: rgba(251, 133, 0, 0.8); }

    /* 项目主信息区域 */
    .project-info-section {
      padding: 30px 25px;
      position: relative;
      z-index: 1;
    }

    .project-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      line-height: 1.2;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .github-icon {
      width: 32px;
      height: 32px;
      fill: currentColor;
    }

    .project-description {
      font-size: 16px;
      opacity: 0.9;
      margin: 0 0 20px 0;
      font-weight: 400;
      line-height: 1.4;
    }

    .project-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 14px;
      align-items: center;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 12px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }

    .stat-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    /* 项目快速信息卡片 */
    .project-quick-info {
      background: var(--bg-light);
      padding: 25px;
      border-bottom: 1px solid var(--border-color);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 20px;
      text-align: center;
      position: relative;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .info-card-icon {
      font-size: 24px;
      margin-bottom: 10px;
      display: block;
    }

    .info-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 8px 0;
    }

    .info-card-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
      font-family: var(--font-mono);
    }

    .info-card-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      margin: 5px 0 0 0;
    }

    /* 内容区域 */
    .project-content {
      padding: 30px 25px;
    }

    /* 标题样式 - GitHub 风格 */
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-color);
      margin: 30px 0 18px 0;
      line-height: 1.25;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-light);
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
      margin: 28px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-light);
      position: relative;
    }

    h2::before {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 40px;
      height: 2px;
      background: var(--primary-color);
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin: 24px 0 14px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h3::before {
      content: '#';
      color: var(--text-muted);
      font-size: 16px;
      font-weight: 400;
    }

    /* 段落样式 */
    p {
      margin: 16px 0;
      line-height: var(--line-height-base);
      font-size: var(--font-size-base);
      color: var(--text-color);
    }

    /* 代码样式 - GitHub 风格 */
    code {
      background: var(--bg-code);
      border: 1px solid var(--border-light);
      border-radius: 3px;
      padding: 2px 6px;
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--text-color);
    }

    pre {
      background: var(--bg-code);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 16px;
      margin: 20px 0;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 14px;
      line-height: 1.45;
    }

    pre code {
      background: none;
      border: none;
      padding: 0;
      font-size: inherit;
    }

    /* 功能特性列表 */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 25px 0;
    }

    .feature-card {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 20px;
      position: relative;
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-md);
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 12px;
      display: block;
    }

    .feature-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 8px 0;
    }

    .feature-description {
      font-size: 14px;
      color: var(--text-light);
      margin: 0;
      line-height: 1.5;
    }

    /* 安装指南样式 */
    .installation-guide {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
      position: relative;
    }

    .installation-guide::before {
      content: '📦';
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 24px;
      opacity: 0.5;
    }

    .installation-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .installation-title::before {
      content: '';
      width: 4px;
      height: 18px;
      background: var(--secondary-color);
      border-radius: 2px;
    }

    .install-command {
      background: #24292f;
      color: #f0f6fc;
      border-radius: var(--border-radius);
      padding: 15px;
      margin: 15px 0;
      font-family: var(--font-mono);
      font-size: 14px;
      position: relative;
      overflow-x: auto;
    }

    .install-command::before {
      content: '$ ';
      color: #7c3aed;
      font-weight: 600;
    }

    /* 技术栈标签 */
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 20px 0;
    }

    .tech-tag {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      color: var(--text-color);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .tech-tag:hover {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .tech-tag.language { border-color: var(--primary-color); color: var(--primary-color); }
    .tech-tag.framework { border-color: var(--accent-color); color: var(--accent-color); }
    .tech-tag.tool { border-color: var(--secondary-color); color: var(--secondary-color); }

    /* 贡献者区域 */
    .contributors-section {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
    }

    .contributors-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contributors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 15px;
    }

    .contributor-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid var(--border-light);
      transition: all 0.2s ease;
    }

    .contributor-avatar:hover {
      border-color: var(--primary-color);
      transform: scale(1.1);
    }

    /* 项目链接 */
    .project-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 30px 0;
    }

    .project-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px 20px;
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      text-decoration: none;
      color: var(--text-color);
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .project-link:hover {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .project-link-icon {
      font-size: 20px;
    }

    /* 引用样式 - GitHub 风格 */
    blockquote {
      margin: 20px 0;
      padding: 0 16px;
      color: var(--text-light);
      border-left: 4px solid var(--border-color);
      background: var(--bg-light);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }

    blockquote p {
      margin: 16px 0;
    }

    /* 警告框样式 */
    .alert {
      padding: 16px;
      margin: 20px 0;
      border-radius: var(--border-radius);
      border-left: 4px solid;
    }

    .alert-note {
      background: #dbeafe;
      border-color: var(--primary-color);
      color: #1e40af;
    }

    .alert-warning {
      background: #fef3c7;
      border-color: var(--warning-color);
      color: #92400e;
    }

    .alert-danger {
      background: #fee2e2;
      border-color: var(--danger-color);
      color: #991b1b;
    }

    /* 链接样式 */
    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }

    /* 图片样式 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      margin: 20px auto;
      display: block;
      border: 1px solid var(--border-light);
    }

    .image-caption {
      text-align: center;
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 8px;
      font-style: italic;
    }

    /* 页脚 */
    .project-footer {
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

    .footer-links {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid var(--border-light);
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 0 15px;
      color: var(--primary-color);
      text-decoration: none;
      font-size: 14px;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      body {
        padding: 15px;
        font-size: 15px;
      }

      .project-info-section {
        padding: 25px 20px;
      }

      .project-title {
        font-size: 24px;
        flex-direction: column;
        gap: 8px;
      }

      .project-content {
        padding: 25px 20px;
      }

      .project-stats {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }

      .project-quick-info {
        grid-template-columns: 1fr;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .project-links {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 10px;
        font-size: 14px;
      }

      .project-info-section {
        padding: 20px 15px;
      }

      .project-title {
        font-size: 20px;
      }

      .project-content {
        padding: 20px 15px;
      }

      h1 {
        font-size: 20px;
      }

      h2 {
        font-size: 18px;
      }

      h3 {
        font-size: 16px;
      }

      .contributors-grid {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      }

      .contributor-avatar {
        width: 50px;
        height: 50px;
      }
    }
  `,

  // 模板函数
  template: function(title, content, metadata = {}) {
    // 处理元数据
    const projectName = metadata.projectName || title;
    const description = metadata.description || '';
    const author = metadata.author || 'GitHub';
    const language = metadata.language || 'JavaScript';
    const stars = metadata.stars || '0';
    const forks = metadata.forks || '0';
    const issues = metadata.issues || '0';
    const license = metadata.license || 'MIT';
    const version = metadata.version || 'v1.0.0';
    const lastUpdate = metadata.lastUpdate || new Date().toLocaleDateString('zh-CN');
    const projectType = metadata.projectType || 'library';
    const githubUrl = metadata.githubUrl || '#';
    const demoUrl = metadata.demoUrl || '';
    const docsUrl = metadata.docsUrl || '';
    const techStack = metadata.techStack || [];
    
    // 确定项目类型信息
    const getProjectTypeInfo = (type) => {
      switch(type.toLowerCase()) {
        case 'library': return { class: 'library', icon: '📚', text: '开源库' };
        case 'framework': return { class: 'framework', icon: '🏗️', text: '框架' };
        case 'tool': return { class: 'tool', icon: '🔧', text: '工具' };
        case 'app': return { class: 'app', icon: '📱', text: '应用' };
        default: return { class: 'library', icon: '📦', text: '项目' };
      }
    };
    
    const typeInfo = getProjectTypeInfo(projectType);
    
    // 生成技术栈标签
    const techStackHtml = techStack.length > 0 
      ? `<div class="tech-stack">
          ${techStack.map(tech => {
            const type = tech.type || 'tool';
            return `<span class="tech-tag ${type}">${tech.name || tech}</span>`;
          }).join('')}
        </div>`
      : '';

    // 生成项目链接
    const linksHtml = `
      <div class="project-links">
        <a href="${githubUrl}" class="project-link">
          <span class="project-link-icon">🐙</span>
          <span>GitHub 仓库</span>
        </a>
        ${demoUrl ? `
        <a href="${demoUrl}" class="project-link">
          <span class="project-link-icon">🚀</span>
          <span>在线演示</span>
        </a>
        ` : ''}
        ${docsUrl ? `
        <a href="${docsUrl}" class="project-link">
          <span class="project-link-icon">📖</span>
          <span>项目文档</span>
        </a>
        ` : ''}
      </div>
    `;

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(content);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} - GitHub 项目推荐</title>
    <style>${this.styles}</style>
</head>
<body>
    <div class="main-container">
        <header class="github-header">
            <div class="project-type-bar">
                <div class="project-type ${typeInfo.class}">
                    <span>${typeInfo.icon}</span>
                    <span>${typeInfo.text}</span>
                </div>
            </div>
            
            <div class="project-info-section">
                <h1 class="project-title">
                    <svg class="github-icon" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    <span>${projectName}</span>
                </h1>
                ${description ? `<div class="project-description">${description}</div>` : ''}
                <div class="project-stats">
                    <div class="stat-item">
                        <svg class="stat-icon" viewBox="0 0 16 16">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
                        </svg>
                        <span>${stars} Stars</span>
                    </div>
                    <div class="stat-item">
                        <svg class="stat-icon" viewBox="0 0 16 16">
                            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.25 2.25 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                        </svg>
                        <span>${forks} Forks</span>
                    </div>
                    <div class="stat-item">
                        <svg class="stat-icon" viewBox="0 0 16 16">
                            <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                        </svg>
                        <span>${issues} Issues</span>
                    </div>
                    <div class="stat-item">
                        <span>💻</span>
                        <span>${language}</span>
                    </div>
                    <div class="stat-item">
                        <span>📄</span>
                        <span>${license}</span>
                    </div>
                </div>
            </div>
        </header>

        <div class="project-quick-info">
            <div class="info-card">
                <span class="info-card-icon">🏷️</span>
                <div class="info-card-title">最新版本</div>
                <div class="info-card-value">${version}</div>
            </div>
            <div class="info-card">
                <span class="info-card-icon">📅</span>
                <div class="info-card-title">最后更新</div>
                <div class="info-card-value">${lastUpdate}</div>
            </div>
            <div class="info-card">
                <span class="info-card-icon">👨‍💻</span>
                <div class="info-card-title">维护者</div>
                <div class="info-card-value">${author}</div>
            </div>
        </div>

        <div class="project-content">
            ${techStackHtml}
            ${processedContent}
            ${linksHtml}
        </div>

        <footer class="project-footer">
            <div class="footer-content">
                <p>🚀 开源改变世界，代码创造未来</p>
                <div class="footer-links">
                    <a href="${githubUrl}" class="footer-link">
                        <span>🐙</span>
                        <span>GitHub</span>
                    </a>
                    <a href="#" class="footer-link">
                        <span>⭐</span>
                        <span>Star 项目</span>
                    </a>
                    <a href="#" class="footer-link">
                        <span>🍴</span>
                        <span>Fork 项目</span>
                    </a>
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
      // 功能特性网格
      .replace(/:::features\s*([\s\S]*?)\s*:::/g, (match, featuresContent) => {
        const features = featuresContent.trim().split('\n').filter(line => line.trim());
        const featuresHtml = features.map(feature => {
          const [icon, title, ...descParts] = feature.split(' - ');
          const description = descParts.join(' - ');
          return `<div class="feature-card">
            <span class="feature-icon">${icon}</span>
            <div class="feature-title">${title}</div>
            <div class="feature-description">${description}</div>
          </div>`;
        }).join('');
        return `<div class="features-grid">${featuresHtml}</div>`;
      })
      // 安装指南
      .replace(/:::install\s*([\s\S]*?)\s*:::/g, (match, installContent) => {
        const commands = installContent.trim().split('\n').filter(line => line.trim());
        const commandsHtml = commands.map(cmd => 
          `<div class="install-command">${cmd}</div>`
        ).join('');
        return `<div class="installation-guide">
          <div class="installation-title">安装方法</div>
          ${commandsHtml}
        </div>`;
      })
      // 警告框
      .replace(/:::note\s*([\s\S]*?)\s*:::/g, '<div class="alert alert-note">$1</div>')
      .replace(/:::warning\s*([\s\S]*?)\s*:::/g, '<div class="alert alert-warning">$1</div>')
      .replace(/:::danger\s*([\s\S]*?)\s*:::/g, '<div class="alert alert-danger">$1</div>')
      // 贡献者
      .replace(/:::contributors\s*([\s\S]*?)\s*:::/g, (match, contributorsContent) => {
        const contributors = contributorsContent.trim().split('\n').filter(line => line.trim());
        const contributorsHtml = contributors.map(contributor => {
          const [name, avatar] = contributor.split(' - ');
          return `<img src="${avatar}" alt="${name}" class="contributor-avatar" title="${name}">`;
        }).join('');
        return `<div class="contributors-section">
          <div class="contributors-title">👥 贡献者</div>
          <div class="contributors-grid">${contributorsHtml}</div>
        </div>`;
      });
  }
};