// 通用模板
const styles = `
/* 全局样式 */
body { 
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.75;
  padding: 0;
  margin: 0;
  background-color: #ffffff;
  color: #333333;
  font-size: 15px; /* 适合公众号阅读的字体大小 */
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 12px 16px;
}

/* 目录样式 */
.sidebar {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  border-left: 3px solid #c06000;
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 10px;
}

.nav-list li a {
  display: flex;
  align-items: center;
  color: #333333;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.nav-list li a:hover {
  background-color: rgba(7, 193, 96, 0.1); /* 这个颜色未在变量中定义，保留原样 */
}

.nav-list li a::before {
  content: "•";
  color: #c06000;
  margin-right: 8px;
  font-weight: bold;
}

.nav-list .h3-item {
  padding-left: 20px;
  font-size: 13px;
  color: #8c8c8c;
}

/* 主内容区 */
main {
  background-color: #ffffff;
  padding: 20px 0;
}

/* 内容头部 */
.content-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

/* 标题样式 */
h1 {
  font-size: 22px;
  font-weight: bold;
  color: #333333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  line-height: 1.5;
  text-align: center;
}

h2 {
  font-size: 18px;
  color: #333333;
  margin-top: 30px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

h2::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 64px;
  height: 2px;
  background-color: #c06000;
}

h3 {
  font-size: 16px;
  color: #333333;
  margin-top: 25px;
  margin-bottom: 15px;
  position: relative;
  padding-left: 12px;
}

h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 3px;
  background-color: #c06000;
  border-radius: 3px;
}

/* 段落样式 */
p {
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.8;
  color: #333333;
  text-align: justify;
}

/* 列表样式 */
ul, ol {
  margin: 0 0 20px;
  padding-left: 24px;
}

li {
  margin-bottom: 8px;
  line-height: 1.7;
}

li > ul, li > ol {
  margin-top: 8px;
  margin-bottom: 0;
}

/* 代码样式 */
code { 
  background-color: #f8f8f8;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 14px;
  color: #d14; /* 这个颜色未在变量中定义，保留原样 */
}

pre { 
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #e8e8e8;
}

pre code {
  background-color: transparent;
  padding: 0;
  color: #333333;
  font-size: 13px;
  line-height: 1.5;
}

/* 引用样式 */
blockquote { 
  background-color: #f8f8f8;
  border-left: 4px solid #c06000;
  padding: 15px;
  margin: 20px 0;
  color: #595959;
  border-radius: 0 4px 4px 0;
}

blockquote > *:last-child {
  margin-bottom: 0;
}

/* 表格样式 */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 14px;
}

th {
  background-color: #f7f7f7; /* 这个颜色未在变量中定义，保留原样 */
  color: #333333;
  font-weight: bold;
  padding: 10px;
  text-align: left;
  border: 1px solid #e8e8e8;
}

td {
  padding: 10px;
  border: 1px solid #e8e8e8;
}

tr:nth-child(even) {
  background-color: #fafafa; /* 这个颜色未在变量中定义，保留原样 */
}

/* 图片样式 */
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 4px;
}

/* 链接样式 */
a {
  color: #c06000;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 参考资料样式 */
.references-section {
  margin-top: 40px;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
  list-style: none;
}

.personal-opinion {
  font-size: 8px;
  color: #999999;
  margin-bottom: 15px;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 10px;
  background-color: #fafafa;
}

.references-title {
  font-size: 8px;
  color: #999999;
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 5px;
  display: block;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 10px;
  background-color: #fafafa;
  margin-top: 15px;
}

.references-list {
  padding-left: 0;
  list-style: none;
}

.references-section li {
  font-size: 13px;
  color: #666666;
  margin-bottom: 10px;
}

.references-section a {
  color: #666666 !important;
  word-break: break-all;
}

.references-section a:hover {
  text-decoration: underline;
}

/* 页脚样式 */
.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  color: #8c8c8c;
  font-size: 13px;
  text-align: center;
}

.footer-info {
  margin-bottom: 10px;
  color: #8c8c8c;
  font-size: 14px;
}

.footer-brand {
  margin-bottom: 10px;
  margin-top: 15px;
}

.footer-article-number {
  margin-bottom: 10px;
  color: #8c8c8c;
}

.footer-links {
  margin-bottom: 15px;
}

.footer-reply {
  font-style: italic;
  margin-top: 10px;
}

/* 微信二维码容器样式 */
.qrcode-container {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  text-align: center;
}

.qrcode-image-container {
  display: inline-block;
  width: 180px;
  margin: 10px auto;
  border: 2px solid #e74c3c;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
}

.qrcode-img {
  width: 100%;
  height: auto;
  display: block;
}

.qrcode-text {
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  color: #333;
}

.qrcode-subtext {
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  color: #666;
}

@media (max-width: 768px) {
  .qrcode-image-container {
    width: 150px;
  }
}

/* 历史文章区域样式 */
.history-articles {
  margin: 0;
  padding: 0;
}

.history-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-card {
  border-radius: 8px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: white;
  transition: box-shadow 0.3s ease;
  height: 70px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.history-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.15;
  z-index: -1;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 30% 65%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 60% 10%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-size: 120px 120px;
}

.history-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%);
}

.history-card:hover {
  /* 移除 transform 以提高微信兼容性 */
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

.history-card:hover .card-icon {
  /* 移除 transform 以提高微信兼容性 */
  background-color: rgba(255, 255, 255, 0.25);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.history-card h3 {
  color: white;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  padding: 0;
  border: none;
}

.history-card h3::before {
  display: none;
}

.card-icon {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
  transition: background-color 0.3s ease;
}

.card-1 {
  background: linear-gradient(135deg, #a04000 0%, #b05000 100%);
  background-image: linear-gradient(135deg, #a04000 0%, #b05000 100%);
  /* 移除 SVG 图案以提高微信兼容性 */
}

.card-2 {
  background: linear-gradient(135deg, #c06000 0%, #c07000 100%);
  background-image: linear-gradient(135deg, #c06000 0%, #c07000 100%);
  /* 移除 SVG 图案以提高微信兼容性 */
}

.card-3 {
  background: linear-gradient(135deg, #d07000 0%, #d08010 100%);
  background-image: linear-gradient(135deg, #d07000 0%, #d08010 100%);
  /* 移除 SVG 图案以提高微信兼容性 */
}

.card-4 {
  background: linear-gradient(135deg, #e09010 0%, #e0a010 100%);
  background-image: linear-gradient(135deg, #e09010 0%, #e0a010 100%);
  /* 移除 SVG 图案以提高微信兼容性 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  .history-card {
    padding: 12px 15px;
    height: 60px;
  }
  
  .history-card h3 {
    font-size: 16px;
  }
}

/* 链接区域样式 */
.links-section {
  margin: 30px 0;
  border-top: 1px solid #e8e8e8;
  padding-top: 20px;
  position: relative;
}

.links-section::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  width: 80px;
  height: 3px;
  background-color: #a04000;
}

.links-title {
  font-size: 20px;
  font-weight: bold;
  color: #a04000;
  margin-bottom: 20px;
  padding-left: 10px;
  position: relative;
  border-left: 3px solid #a04000;
}

.links-title::before {
  display: none;
}
`;

// 添加渲染函数
export default {
  name: 'general',
  displayName: '通用',
  description: '适合一般文章',
  styles,
  render: function(title, content, config = {}) {
    // 设置默认配置
    const defaults = {
      qrCodeUrl: 'https://mmbiz.qpic.cn/mmbiz_png/Lq1oUy6ODwzWiciaIYv0TGr6lN25BJBPDoXUqKzRR7dBzd9x2iaUQOAMtovXHjcdOOV90n7h2XsOMJ7Cpib220Qzsg/0?wx_fmt=png&from=appmsg',
      qrCodeCaption: '长按扫码联系我们',
      qrCodeNote: '添加好友请注明来意哦',
      footerInfo: '观点 / 阿橘 主笔 / ameureka 编辑 /',
      footerArticleNumber: '这是阿橘公众号的第325原创文章',
      footerLinks: '有求必答 | 免费分享 | AI咨询',
      footerReply: '请在公众号后台回复',
      footerBrand: '感谢阅读',
      historyArticles: [] // 添加 historyArticles 默认空数组
    };
    // 合并用户配置和默认配置
    const settings = { ...defaults, ...config };

    // 将表格包裹在 .table-wrapper 中使其可横向滚动
    content = content.replace(/<table([^>]*)>/g, '<div class="table-wrapper"><table$1>');
    content = content.replace(/<\/table>/g, '</table></div>');
    
    // 处理参考资料部分
    // 匹配以"个人观点"或"参考资料"开头的部分，通常在文章末尾
    let mainContent = content;
    let referencesContent = '';
    
    // 查找参考资料部分的起始位置
    const opinionMatch = content.match(/<h2>.*?个人观点.*?<\/h2>|<p>.*?个人观点.*?<\/p>/i);
    const refsMatch = content.match(/<h3>.*?参考.*?<\/h3>|<h2>.*?参考.*?<\/h2>|<p>.*?参考.*?<\/p>/i);
    
    if (opinionMatch || refsMatch) {
      // 找到匹配位置较早的那个
      let matchIndex = -1;
      if (opinionMatch && refsMatch) {
        matchIndex = Math.min(content.indexOf(opinionMatch[0]), content.indexOf(refsMatch[0]));
      } else if (opinionMatch) {
        matchIndex = content.indexOf(opinionMatch[0]);
      } else {
        matchIndex = content.indexOf(refsMatch[0]);
      }
      
      if (matchIndex > -1) {
        // 分离主内容和参考资料
        mainContent = content.substring(0, matchIndex);
        const rawRefsContent = content.substring(matchIndex);
        
        // 处理参考资料部分，转换链接和列表格式
        let processedRefs = rawRefsContent;
        
        // 优化：仅对识别出的参考文献区域内的链接应用特定样式，避免全局替换
        // (保留此逻辑，因为之前的交互确认其效果是需要的)
        /* 移除：不再通过 JS 添加内联样式，改由 CSS 控制
        processedRefs = processedRefs.replace(/<a\s+href="([^"]+)"([^>]*)>(.*?)<\/a>/g, 
          '<a href="$1"$2 style="color: #999999; text-decoration: none;">$3</a>');
        */
        
        // 包装参考资料部分
        referencesContent = `<div class="references-section">${processedRefs}</div>`;
      }
    }
    
    // 生成历史文章部分 HTML
    let historyArticlesHtml = '';
    if (settings.historyArticles && settings.historyArticles.length > 0) {
      const cardClasses = ['card-1', 'card-2', 'card-3', 'card-4'];
      const historyCards = settings.historyArticles.map((article, index) => {
        const cardClass = cardClasses[index % cardClasses.length];
        return `
          <a href="${article.url || '#'}" class="history-card ${cardClass}">
            <div class="card-content">
              <h3>${article.title || '历史文章'}</h3>
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
              </div>
            </div>
          </a>
        `;
      }).join('');
      
      historyArticlesHtml = `
        <div class="history-articles">
          <div class="links-title" style="margin-bottom: 15px; font-size: 16px; color: #555; border-left: 3px solid #ccc;">往期推荐</div> 
          <div class="history-cards">
            ${historyCards}
          </div>
        </div>
      `;
    }

    // 生成HTML结构
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <main>
          <div class="content-header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${mainContent}
          </div>
          ${referencesContent}
        </main>
        
        ${historyArticlesHtml}

        <div class="qrcode-container">
          <div class="qrcode-image-container">
            <img src="${settings.qrCodeUrl}" alt="微信二维码" class="qrcode-img">
          </div>
          <div class="qrcode-caption">${settings.qrCodeCaption}</div>
          <div class="qrcode-note">${settings.qrCodeNote}</div>
        </div>
        
        <footer class="footer">
          <div class="footer-info">${settings.footerInfo}</div>
          <div class="footer-article-number">${settings.footerArticleNumber}</div>
          <div class="footer-links">
            ${settings.footerLinks}
          </div>
          <div class="footer-reply">${settings.footerReply}</div>
          <div class="footer-brand">${settings.footerBrand}</div>
        </footer>
      </div>
    </body>
    </html>
    `;
  }
};