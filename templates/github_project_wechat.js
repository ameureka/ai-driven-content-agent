/**
 * 微信公众号专用 - GitHub项目推荐模板
 * 基于通用设计原则重构，完全兼容微信公众号约束条件
 * 专门用于开源项目介绍、技术工具推荐、GitHub仓库分析等内容
 * 保持GitHub风格特色，遵循微信公众号CSS约束条件，使用行内样式
 */
export default {
  name: 'github_project_wechat',
  displayName: 'GitHub项目推荐模板',
  description: '专为开源项目推荐设计的微信公众号模板，完全兼容微信编辑器约束',
  
  // 微信公众号不支持外部CSS和<style>标签，所有样式都通过行内样式实现
  styles: '',

  template: function(data) {
    // 从内容中提取第一个标题作为主标题
    const extractedTitle = this.extractFirstTitle(data.content) || data.title || '开源项目推荐：优秀的GitHub仓库深度解析';
    
    // 处理GitHub项目元数据
    const projectName = data.projectName || extractedTitle;
    const description = data.description || '';
    const author = data.author || 'GitHub';
    const language = data.language || 'JavaScript';
    const stars = data.stars || '0';
    const forks = data.forks || '0';
    const issues = data.issues || '0';
    const license = data.license || 'MIT';
    const version = data.version || 'v1.0.0';
    const lastUpdate = data.lastUpdate || new Date().toLocaleDateString('zh-CN');
    const projectType = data.projectType || 'library';
    const githubUrl = data.githubUrl || '';
    const demoUrl = data.demoUrl || '';
    const docsUrl = data.docsUrl || '';
    const techStack = data.techStack || [];
    
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
    
    // 生成技术栈标签HTML
    const techStackHtml = techStack.length > 0 
      ? `<div style="background: #f6f8fa; padding: 20px 25px; border-bottom: 1px solid #d1d5db;">
          <div style="font-size: 14px; font-weight: 600; color: #475569; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">技术栈</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${techStack.map(tech => {
              let bgColor = '#0969da'; // 默认蓝色
              if (typeof tech === 'object') {
                switch(tech.type) {
                  case 'framework': bgColor = '#8250df'; break;
                  case 'language': bgColor = '#1f883d'; break;
                  case 'tool': bgColor = '#fb8500'; break;
                  case 'platform': bgColor = '#cf222e'; break;
                }
                return `<span style="background: ${bgColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">${tech.name}</span>`;
              }
              return `<span style="background: ${bgColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">${tech}</span>`;
            }).join('')}
          </div>
        </div>`
      : '';

    // 生成项目快速信息卡片
    const quickInfoHtml = `
      <div style="background: #f6f8fa; padding: 25px; border-bottom: 1px solid #d1d5db; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="background: white; border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; text-align: center; position: relative;">
          <span style="font-size: 24px; margin-bottom: 10px; display: block;">🏷️</span>
          <div style="font-size: 14px; font-weight: 600; color: #24292f; margin: 0 0 8px 0;">最新版本</div>
          <div style="font-size: 18px; font-weight: 700; color: #0969da; margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${version}</div>
        </div>
        <div style="background: white; border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; text-align: center; position: relative;">
          <span style="font-size: 24px; margin-bottom: 10px; display: block;">📅</span>
          <div style="font-size: 14px; font-weight: 600; color: #24292f; margin: 0 0 8px 0;">最后更新</div>
          <div style="font-size: 18px; font-weight: 700; color: #0969da; margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${lastUpdate}</div>
        </div>
        <div style="background: white; border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; text-align: center; position: relative;">
          <span style="font-size: 24px; margin-bottom: 10px; display: block;">👨‍💻</span>
          <div style="font-size: 14px; font-weight: 600; color: #24292f; margin: 0 0 8px 0;">维护者</div>
          <div style="font-size: 18px; font-weight: 700; color: #0969da; margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${author}</div>
        </div>
      </div>
    `;

    // 生成项目链接
    const linksHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 30px 0;">
        ${githubUrl ? `
        <div style="display: flex; align-items: center; gap: 12px; padding: 15px 20px; background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; color: #24292f; font-weight: 500;">
          <span style="font-size: 20px;">🐙</span>
          <span>GitHub 仓库</span>
        </div>
        ` : ''}
        ${demoUrl ? `
        <div style="display: flex; align-items: center; gap: 12px; padding: 15px 20px; background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; color: #24292f; font-weight: 500;">
          <span style="font-size: 20px;">🚀</span>
          <span>在线演示</span>
        </div>
        ` : ''}
        ${docsUrl ? `
        <div style="display: flex; align-items: center; gap: 12px; padding: 15px 20px; background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; color: #24292f; font-weight: 500;">
          <span style="font-size: 20px;">📖</span>
          <span>项目文档</span>
        </div>
        ` : ''}
      </div>
    `;

    // 处理特殊内容块
    const processedContent = this.processSpecialBlocks(data.content);

    return `
<!-- 微信公众号专用GitHub项目推荐模板 - 完全兼容微信编辑器 -->
<div style="max-width: 750px; margin: 0 auto; background: #fff; border-radius: 6px; border: 1px solid #d1d5db; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <!-- GitHub风格头部 -->
    <div style="background: linear-gradient(135deg, #24292f 0%, #1c2128 100%); color: white; padding: 0; position: relative; overflow: hidden;">
        <div style="background: rgba(0, 0, 0, 0.2); padding: 12px 25px; position: relative; z-index: 1; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.15); padding: 8px 16px; border-radius: 25px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <span>${typeInfo.icon}</span>
                <span>${typeInfo.text}</span>
            </div>
        </div>
        
        <div style="padding: 40px 30px; position: relative; z-index: 1;">
            <h1 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.2; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; display: flex; align-items: center; gap: 12px;">
                <span style="width: 32px; height: 32px; display: inline-block;">🐙</span>
                <span>${projectName}</span>
            </h1>
            ${description ? `<div style="font-size: 16px; opacity: 0.9; margin: 0 0 25px 0; font-weight: 400; line-height: 1.4;">${description}</div>` : ''}
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; font-size: 14px;">
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="width: 16px; height: 16px; display: inline-block;">⭐</span>
                    <span>${stars} Stars</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="width: 16px; height: 16px; display: inline-block;">🍴</span>
                    <span>${forks} Forks</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span style="width: 16px; height: 16px; display: inline-block;">❗</span>
                    <span>${issues} Issues</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span>💻</span>
                    <span>${language}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                    <span>📄</span>
                    <span>${license}</span>
                </div>
            </div>
        </div>
    </div>

    ${quickInfoHtml}
    ${techStackHtml}
    
    <!-- 文章内容区 -->
    <div style="padding: 40px 30px;">
        
        <!-- 文章信息 -->
        <div style="text-align: center; margin: 20px 0 30px 0;">
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; font-weight: 500; text-align: center;">
                开源项目 / 技术分享　阅读 / 大约 8 分钟
            </p>
            <p style="color: #999; font-size: 11px; font-style: italic; margin: 0; text-align: center;">
                项目作者：${author}
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
        <hr style="height: 1px; background: #e1e4e8; margin: 30px 0; border: none;">
        
        <!-- 项目链接 -->
        ${linksHtml}
        
        <!-- 分隔符 -->
        <hr style="height: 1px; background: #e1e4e8; margin: 30px 0; border: none;">
        
        <!-- 文章正文 -->
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333;">
            ${processedContent}
        </div>
        
        <!-- 分隔符 -->
        <hr style="height: 1px; background: #e1e4e8; margin: 30px 0; border: none;">
        
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
            项目维护 / ${author}　技术推荐 / 开源社区
        </p>
        <p style="color: #666; font-size: 11px; font-style: italic; text-align: center; margin: 0;">
            🚀 开源改变世界，代码创造未来
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
      <div style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #0969da; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">目录</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;
    
    filteredHeadings.forEach((heading, index) => {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      
      tocHtml += `
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #0969da; font-size: 12px;">#</span>
            <span style="color: #24292f; font-weight: 500; font-size: 16px;">${text}</span>
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
    
    // 处理二级标题 - GitHub风格
    const sectionCounter = { count: 0 };
    content = content.replace(/^## (.+)$/gm, (match, title) => {
      // 如果是第一个二级标题且还没有跳过标题，跳过它（通常是主标题的重复）
      if (!firstTitleSkipped) {
        firstTitleSkipped = true;
        return ''; // 移除第一个二级标题，避免重复
      }
      
      return `<h2 style="font-size: 20px; font-weight: 600; color: #24292f; margin: 28px 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e1e4e8; position: relative;">
        <span style="position: absolute; bottom: -1px; left: 0; width: 40px; height: 2px; background: #0969da;"></span>
        ${title}
      </h2>`;
    });
    
    // 处理三级标题 - GitHub风格
    content = content.replace(/^### (.+)$/gm, '<h3 style="font-size: 18px; font-weight: 600; color: #24292f; margin: 24px 0 14px 0; display: flex; align-items: center; gap: 8px;"><span style="color: #656d76; font-size: 16px; font-weight: 400;">#</span>$1</h3>');
    
    // 处理四级标题  
    content = content.replace(/^#### (.+)$/gm, '<h4 style="color: #555; font-size: 16px; font-weight: 600; margin: 20px 0 12px 0;">$1</h4>');
    
    // 处理段落
    content = this.processMarkdownParagraphs(content);
    
    // 处理强调文本 - GitHub风格
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #24292f; font-weight: 600;">$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em style="color: #0969da; font-style: normal; font-weight: 500;">$1</em>');
    
    // 处理链接 - 只显示链接文本，不添加超链接
    content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 处理代码块 - GitHub风格
    content = content.replace(/`([^`]+)`/g, '<code style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 3px; padding: 2px 6px; font-family: \'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 14px; color: #24292f;">$1</code>');
    
    // 处理代码块
    content = content.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
      return `<div style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin: 20px 0; overflow-x: auto;">
        <pre style="margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 14px; line-height: 1.45; color: #24292f;">${code}</pre>
      </div>`;
    });
    
    // 处理有序列表
    content = content.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.6; color: #333; padding-left: 8px;"><strong style="color: #0969da; margin-right: 8px;">•</strong>$1</div>');
    
    // 处理无序列表（但排除参考文献中的列表）
    content = content.replace(/^[-*+]\s+(.+)$/gm, '<div style="margin: 12px 0; line-height: 1.6; color: #333; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #0969da;">•</span>$1</div>');
    
    // 处理引用块 - GitHub风格
    content = content.replace(/^>\s+(.+)$/gm, '<blockquote style="margin: 20px 0; padding: 0 16px; color: #656d76; border-left: 4px solid #d1d5db; background: #f6f8fa; border-radius: 0 6px 6px 0;"><p style="margin: 16px 0;">$1</p></blockquote>');
    
    // 处理图片占位符（符合微信公众号要求）
    content = content.replace(/!\[([^\]]*)\]\([^)]*\)/g, '<div style="display: block; margin: 20px auto; padding: 20px; border: 2px dashed #d1d1d1; text-align: center; color: #888; background-color: #fafafa; border-radius: 6px;">[ 请在此处手动上传图片：$1 ]</div>');
    
    // 处理分隔符
    content = content.replace(/^---+$/gm, '<hr style="height: 1px; background: #e1e4e8; margin: 30px 0; border: none;">');
    
    // GitHub项目相关术语高亮
    const highlightTerms = [
      'GitHub', 'Git', 'Open Source', '开源', 'Repository', '仓库', 'Fork', 'Pull Request', 'Issue',
      'JavaScript', 'TypeScript', 'Python', 'React', 'Vue', 'Node.js', 'API',
      'Framework', '框架', 'Library', '库', 'Package', 'npm', 'yarn', 'Docker',
      'CI/CD', 'Testing', '测试', 'Documentation', '文档', 'License', 'MIT'
    ];
    
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(?<!<[^>]*?)\\b${term}\\b(?![^<]*?>)`, 'g');
      content = content.replace(regex, `<strong style="color: #0969da; background: linear-gradient(135deg, rgba(9, 105, 218, 0.1), transparent); padding: 1px 3px; border-radius: 3px;">${term}</strong>`);
    });
    
    // 处理特殊语法块
    content = this.processGitHubSpecialBlocks(content);
    
    return content;
  },

  processGitHubSpecialBlocks: function(content) {
    // 处理功能特性列表
    content = content.replace(/:::features\s*([\s\S]*?)\s*:::/g, (match, featuresContent) => {
      const features = featuresContent.trim().split('\n').filter(line => line.trim());
      const featuresHtml = features.map((feature, index) => {
        const [icon, title, ...descParts] = feature.split(' - ');
        const description = descParts.join(' - ');
        return `<div style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; position: relative; margin: 15px 0;">
          <span style="font-size: 24px; margin-bottom: 12px; display: block;">${icon}</span>
          <div style="font-size: 16px; font-weight: 600; color: #24292f; margin: 0 0 8px 0;">${title}</div>
          <div style="font-size: 14px; color: #656d76; margin: 0; line-height: 1.5;">${description}</div>
        </div>`;
      }).join('');
      return `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 25px 0;">${featuresHtml}</div>`;
    });
    
    // 处理安装指南
    content = content.replace(/:::install\s*([\s\S]*?)\s*:::/g, (match, installContent) => {
      const commands = installContent.trim().split('\n').filter(line => line.trim());
      const commandsHtml = commands.map(cmd => 
        `<div style="background: #24292f; color: #f0f6fc; border-radius: 6px; padding: 15px; margin: 15px 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 14px; position: relative; overflow-x: auto;">
          <span style="color: #7c3aed; font-weight: 600;">$ </span>${cmd}
        </div>`
      ).join('');
      return `<div style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 25px; margin: 25px 0; position: relative;">
        <div style="font-size: 18px; font-weight: 600; color: #24292f; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 18px; background: #1f883d; border-radius: 2px;"></span>
          <span>安装方法</span>
        </div>
        ${commandsHtml}
      </div>`;
    });
    
    // 处理警告框
    content = content.replace(/:::note\s*([\s\S]*?)\s*:::/g, '<div style="padding: 16px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #0969da; background: #dbeafe; color: #1e40af;">$1</div>');
    content = content.replace(/:::warning\s*([\s\S]*?)\s*:::/g, '<div style="padding: 16px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #fb8500; background: #fef3c7; color: #92400e;">$1</div>');
    content = content.replace(/:::danger\s*([\s\S]*?)\s*:::/g, '<div style="padding: 16px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #cf222e; background: #fee2e2; color: #991b1b;">$1</div>');
    
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
            processedLines.push(`<p style="margin: 16px 0; line-height: 1.6; font-size: 16px; color: #333;">${paragraphContent}</p>`);
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
        processedLines.push(`<p style="margin: 16px 0; line-height: 1.6; font-size: 16px; color: #333;">${paragraphContent}</p>`);
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
        <h2 style="background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 15px 20px; margin: 0 0 20px 0; color: #24292f; font-size: 18px; font-weight: 600;">
          📚 参考文献
        </h2>
        
        <p>
          <span style="font-size: 14px; font-style: italic;">※项目相关资源，仅供参考。</span>
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
      const borderStyle = isLastItem ? '' : 'border-bottom: 1px solid #e1e4e8;';
      
      referencesHtml += `
        <li style="margin: 0px; padding: 8px 0px; ${borderStyle} font-size: 12px; line-height: 1.6; color: #656d76;">
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
    // 确保数据完整性，专门为GitHub项目优化
    const renderData = {
      title: data.title || '开源项目推荐：优秀的GitHub仓库深度解析',
      content: data.content || '',
      projectName: data.projectName || data.title || '优秀开源项目',
      description: data.description || '',
      author: data.author || 'GitHub',
      language: data.language || 'JavaScript',
      stars: data.stars || '0',
      forks: data.forks || '0',
      issues: data.issues || '0',
      license: data.license || 'MIT',
      version: data.version || 'v1.0.0',
      lastUpdate: data.lastUpdate || new Date().toLocaleDateString('zh-CN'),
      projectType: data.projectType || 'library',
      githubUrl: data.githubUrl || '',
      demoUrl: data.demoUrl || '',
      docsUrl: data.docsUrl || '',
      techStack: data.techStack || []
    };
    
    return this.template(renderData);
  }
};