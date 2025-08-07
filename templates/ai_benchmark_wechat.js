/**
 * 微信公众号专用 - AI 基准测试模板 (基于 render_demo AI 基准风格重构)
 * 专门用于 AI 模型评测、技术对比、数据分析报告等内容
 * 融合了 render_demo 中 AI 基准测试的设计元素
 */
export default {
  name: 'ai_benchmark_wechat',
  displayName: 'AI 基准测试',
  description: '专为 AI 模型评测设计的微信公众号模板，适合技术对比、数据分析报告等',
  
  styles: `
    /* CSS 变量定义 - AI 基准测试风格配色 */
    :root {
      --primary-color: #6366f1;
      --primary-light: #818cf8;
      --primary-dark: #4f46e5;
      --secondary-color: #10b981;
      --accent-color: #f59e0b;
      --warning-color: #ef4444;
      --info-color: #06b6d4;
      --text-color: #111827;
      --text-light: #4b5563;
      --text-muted: #6b7280;
      --bg-color: #ffffff;
      --bg-light: #f8fafc;
      --bg-card: #ffffff;
      --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --border-color: #d1d5db;
      --border-light: #e5e7eb;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --max-content-width: 750px;
      --font-size-base: 16px;
      --line-height-base: 1.6;
      --border-radius: 8px;
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
      box-shadow: var(--shadow-lg);
    }

    /* AI 基准测试头部 */
    .benchmark-header {
      background: var(--bg-gradient);
      color: white;
      padding: 0;
      position: relative;
      overflow: hidden;
    }

    .benchmark-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="ai-pattern" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="5" cy="5" r="0.5" fill="%23ffffff" opacity="0.05"/><circle cx="25" cy="25" r="0.5" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23ai-pattern)"/></svg>') repeat;
    }

    /* 基准测试类型标签 */
    .benchmark-type-bar {
      background: rgba(0, 0, 0, 0.15);
      padding: 12px 25px;
      position: relative;
      z-index: 1;
    }

    .benchmark-type {
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

    .benchmark-type.performance { background: rgba(16, 185, 129, 0.8); }
    .benchmark-type.accuracy { background: rgba(99, 102, 241, 0.8); }
    .benchmark-type.efficiency { background: rgba(245, 158, 11, 0.8); }
    .benchmark-type.comparison { background: rgba(6, 182, 212, 0.8); }

    /* 基准测试主信息区域 */
    .benchmark-info-section {
      padding: 30px 25px;
      position: relative;
      z-index: 1;
    }

    .benchmark-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ai-icon {
      font-size: 32px;
    }

    .benchmark-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0 0 20px 0;
      font-weight: 400;
      line-height: 1.4;
    }

    .benchmark-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 14px;
      align-items: center;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 12px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }

    /* 全局排名 Top 10 */
    .global-ranking {
      background: var(--bg-light);
      padding: 25px;
      border-bottom: 1px solid var(--border-color);
    }

    .ranking-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .ranking-title::before {
      content: '🏆';
      font-size: 24px;
    }

    .ranking-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .ranking-item {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.2s ease;
      position: relative;
    }

    .ranking-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .ranking-position {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      color: white;
      flex-shrink: 0;
    }

    .ranking-position.top-1 { background: linear-gradient(135deg, #ffd700, #ffed4e); color: #92400e; }
    .ranking-position.top-2 { background: linear-gradient(135deg, #c0c0c0, #e5e7eb); color: #374151; }
    .ranking-position.top-3 { background: linear-gradient(135deg, #cd7f32, #d97706); }
    .ranking-position.top-other { background: var(--primary-color); }

    .ranking-info {
      flex: 1;
    }

    .ranking-model {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 4px 0;
    }

    .ranking-org {
      font-size: 14px;
      color: var(--text-light);
      margin: 0 0 8px 0;
    }

    .ranking-score {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-color);
      font-family: var(--font-mono);
    }

    .ranking-trend {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    .ranking-trend.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--secondary-color);
    }

    .ranking-trend.down {
      background: rgba(239, 68, 68, 0.1);
      color: var(--warning-color);
    }

    .ranking-trend.stable {
      background: rgba(107, 114, 128, 0.1);
      color: var(--text-muted);
    }

    /* 内容区域 */
    .benchmark-content {
      padding: 30px 25px;
    }

    /* 标题样式 - AI 基准风格 */
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-color);
      margin: 30px 0 18px 0;
      line-height: 1.25;
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
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
      margin: 28px 0 16px 0;
      padding: 15px 20px;
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border-left: 4px solid var(--secondary-color);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      box-shadow: var(--shadow-sm);
    }

    h3 {
      font-size: 18px;
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
      content: '📊';
      font-size: 16px;
    }

    /* 段落样式 */
    p {
      margin: 16px 0;
      line-height: var(--line-height-base);
      font-size: var(--font-size-base);
      color: var(--text-color);
    }

    /* 性能指标卡片 */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 25px 0;
    }

    .metric-card {
      background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 25px;
      text-align: center;
      position: relative;
      transition: all 0.2s ease;
    }

    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .metric-icon {
      font-size: 32px;
      margin-bottom: 15px;
      display: block;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0 0 8px 0;
      font-family: var(--font-mono);
    }

    .metric-label {
      font-size: 14px;
      color: var(--text-light);
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .metric-change {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    .metric-change.positive {
      background: rgba(16, 185, 129, 0.1);
      color: var(--secondary-color);
    }

    .metric-change.negative {
      background: rgba(239, 68, 68, 0.1);
      color: var(--warning-color);
    }

    /* 对比表格 */
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      background: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .comparison-table th {
      background: var(--bg-gradient);
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

    .comparison-table .model-name {
      font-weight: 600;
      color: var(--text-color);
    }

    .comparison-table .score {
      font-family: var(--font-mono);
      font-weight: 600;
      color: var(--primary-color);
    }

    .comparison-table .best-score {
      background: rgba(16, 185, 129, 0.1);
      color: var(--secondary-color);
      font-weight: 700;
    }

    /* 测试结果图表区域 */
    .chart-container {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
      text-align: center;
    }

    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .chart-placeholder {
      width: 100%;
      height: 300px;
      background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
      border: 2px dashed var(--border-color);
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 14px;
    }

    /* 测试环境信息 */
    .test-environment {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      padding: 25px;
      margin: 25px 0;
    }

    .env-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .env-title::before {
      content: '⚙️';
      font-size: 18px;
    }

    .env-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .env-item {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 6px;
      padding: 15px;
    }

    .env-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 5px 0;
    }

    .env-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
      font-family: var(--font-mono);
    }

    /* 代码样式 */
    code {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: 3px;
      padding: 2px 6px;
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--text-color);
    }

    pre {
      background: #1f2937;
      color: #f9fafb;
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 20px 0;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 14px;
      line-height: 1.5;
    }

    pre code {
      background: none;
      border: none;
      padding: 0;
      color: inherit;
    }

    /* 强调文本 */
    strong {
      color: var(--primary-dark);
      font-weight: 600;
    }

    em {
      color: var(--secondary-color);
      font-style: normal;
      font-weight: 500;
      background: rgba(16, 185, 129, 0.1);
      padding: 2px 4px;
      border-radius: 3px;
    }

    /* 链接样式 */
    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease;
    }

    a:hover {
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
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 8px;
      font-style: italic;
    }

    /* 页脚 */
    .benchmark-footer {
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
        font-size: 15px;
      }

      .benchmark-info-section {
        padding: 25px 20px;
      }

      .benchmark-title {
        font-size: 24px;
        flex-direction: column;
        gap: 8px;
      }

      .benchmark-content {
        padding: 25px 20px;
      }

      .benchmark-meta {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }

      .ranking-grid {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .env-grid {
        grid-template-columns: 1fr;
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
        font-size: 14px;
      }

      .benchmark-info-section {
        padding: 20px 15px;
      }

      .benchmark-title {
        font-size: 20px;
      }

      .benchmark-content {
        padding: 20px 15px;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 20px;
      }

      h2 {
        font-size: 18px;
        padding: 12px 15px;
      }

      h3 {
        font-size: 16px;
      }

      .metric-value {
        font-size: 24px;
      }

      .chart-placeholder {
        height: 200px;
      }
    }
  `,

  // 模板函数
  template: function(title, content, metadata = {}) {
    // 处理元数据
    const benchmarkType = metadata.benchmarkType || 'performance';
    const testDate = metadata.testDate || new Date().toLocaleDateString('zh-CN');
    const version = metadata.version || 'v1.0';
    const organization = metadata.organization || 'AI Research Lab';
    const dataset = metadata.dataset || 'Standard Benchmark';
    const models = metadata.models || [];
    const environment = metadata.environment || {};
    const subtitle = metadata.subtitle || '';
    
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
        const positionClass = position === 1 ? 'top-1' : position === 2 ? 'top-2' : position === 3 ? 'top-3' : 'top-other';
        const trend = model.trend || 'stable';
        const trendIcon = trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️';
        
        return `
          <div class="ranking-item">
            <div class="ranking-position ${positionClass}">${position}</div>
            <div class="ranking-info">
              <div class="ranking-model">${model.name}</div>
              <div class="ranking-org">${model.organization || 'Unknown'}</div>
              <div class="ranking-score">${model.score}</div>
            </div>
            <div class="ranking-trend ${trend}">
              ${trendIcon} ${model.change || '0'}
            </div>
          </div>
        `;
      }).join('');
    };
    
    const rankingHtml = models.length > 0 
      ? `<div class="global-ranking">
          <div class="ranking-title">全局排名 Top 10</div>
          <div class="ranking-grid">
            ${generateRankingHtml(models)}
          </div>
        </div>`
      : '';
    
    // 生成测试环境信息
    const generateEnvironmentHtml = (env) => {
      const envItems = Object.entries(env).map(([key, value]) => `
        <div class="env-item">
          <div class="env-label">${key}</div>
          <div class="env-value">${value}</div>
        </div>
      `).join('');
      
      return envItems ? `
        <div class="test-environment">
          <div class="env-title">测试环境</div>
          <div class="env-grid">
            ${envItems}
          </div>
        </div>
      ` : '';
    };
    
    const environmentHtml = generateEnvironmentHtml(environment);

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(content);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - AI 基准测试报告</title>
    <style>${this.styles}</style>
</head>
<body>
    <div class="main-container">
        <header class="benchmark-header">
            <div class="benchmark-type-bar">
                <div class="benchmark-type ${typeInfo.class}">
                    <span>${typeInfo.icon}</span>
                    <span>${typeInfo.text}</span>
                </div>
            </div>
            
            <div class="benchmark-info-section">
                <h1 class="benchmark-title">
                    <span class="ai-icon">🤖</span>
                    <span>${title}</span>
                </h1>
                ${subtitle ? `<div class="benchmark-subtitle">${subtitle}</div>` : ''}
                <div class="benchmark-meta">
                    <div class="meta-item">
                        <span>📅</span>
                        <span>测试日期: ${testDate}</span>
                    </div>
                    <div class="meta-item">
                        <span>🏷️</span>
                        <span>版本: ${version}</span>
                    </div>
                    <div class="meta-item">
                        <span>🏢</span>
                        <span>机构: ${organization}</span>
                    </div>
                    <div class="meta-item">
                        <span>📊</span>
                        <span>数据集: ${dataset}</span>
                    </div>
                </div>
            </div>
        </header>

        ${rankingHtml}
        ${environmentHtml}

        <div class="benchmark-content">
            ${processedContent}
        </div>

        <footer class="benchmark-footer">
            <div class="footer-content">
                <p>🔬 科学测试，客观评估，推动 AI 技术发展</p>
                <div class="footer-disclaimer">
                    <p>AI 基准测试报告 · ${organization} · ${new Date().getFullYear()}</p>
                    <p>测试结果仅供参考，实际性能可能因环境和使用场景而异</p>
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
      // 性能指标网格
      .replace(/:::metrics\s*([\s\S]*?)\s*:::/g, (match, metricsContent) => {
        const metrics = metricsContent.trim().split('\n').filter(line => line.trim());
        const metricsHtml = metrics.map(metric => {
          const [icon, value, label, change] = metric.split(' - ');
          const changeClass = change && change.startsWith('+') ? 'positive' : change && change.startsWith('-') ? 'negative' : '';
          return `<div class="metric-card">
            <span class="metric-icon">${icon}</span>
            <div class="metric-value">${value}</div>
            <div class="metric-label">${label}</div>
            ${change ? `<div class="metric-change ${changeClass}">${change}</div>` : ''}
          </div>`;
        }).join('');
        return `<div class="metrics-grid">${metricsHtml}</div>`;
      })
      // 对比表格
      .replace(/:::comparison\s*([\s\S]*?)\s*:::/g, (match, tableContent) => {
        const lines = tableContent.trim().split('\n').filter(line => line.trim());
        const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = lines.slice(1).map(line => {
          const cells = line.split('|').map(c => c.trim()).filter(c => c);
          return cells;
        });
        
        const headerHtml = headers.map(header => `<th>${header}</th>`).join('');
        const rowsHtml = rows.map(row => {
          const cellsHtml = row.map((cell, index) => {
            const isScore = index > 0 && !isNaN(parseFloat(cell));
            const className = isScore ? 'score' : index === 0 ? 'model-name' : '';
            return `<td class="${className}">${cell}</td>`;
          }).join('');
          return `<tr>${cellsHtml}</tr>`;
        }).join('');
        
        return `<table class="comparison-table">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>`;
      })
      // 图表占位符
      .replace(/:::chart\s*([\s\S]*?)\s*:::/g, (match, chartContent) => {
        const title = chartContent.trim() || '性能对比图表';
        return `<div class="chart-container">
          <div class="chart-title">
            <span>📈</span>
            <span>${title}</span>
          </div>
          <div class="chart-placeholder">
            📊 图表数据可视化区域<br>
            <small>（实际使用时可嵌入 Chart.js、ECharts 等图表库）</small>
          </div>
        </div>`;
      });
  }
};