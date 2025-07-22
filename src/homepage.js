/**
 * Generates the modern homepage HTML for Xget
 * @returns {string} The complete HTML page
 */
export function generateHomepage() {
	return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xget - 高性能代理服务</title>
    <meta name="description" content="一个高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载和 Git 操作而设计">
    <meta name="keywords" content="GitHub代理,GitLab加速,Hugging Face镜像,Git加速,文件下载,CDN">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://xget.xi-xu.me/">
    <meta property="og:title" content="Xget - 高性能代理服务">
    <meta property="og:description" content="一个高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载和 Git 操作而设计">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://xget.xi-xu.me/">
    <meta property="twitter:title" content="Xget - 高性能代理服务">
    <meta property="twitter:description" content="一个高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载和 Git 操作而设计">
    
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-color: #3b82f6;
            --primary-dark: #2563eb;
            --accent-color: #06b6d4;
            --bg-color: #0f172a;
            --bg-secondary: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --border-color: #334155;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --github-color: #24292e;
            --gitlab-color: #fc6d26;
            --huggingface-color: #ffd21e;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        /* Header */
        .header {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-color);
            z-index: 1000;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: var(--primary-color);
        }
        
        /* Hero Section */
        .hero {
            padding: 8rem 0 4rem;
            text-align: center;
            background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-secondary) 100%);
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .hero-content {
            position: relative;
            z-index: 1;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }
        
        /* URL Converter */
        .converter {
            background: var(--bg-secondary);
            padding: 3rem 0;
            border-top: 1px solid var(--border-color);
        }
        
        .converter-form {
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg-color);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .input-group {
            position: relative;
        }
        
        .input-group input {
            width: 100%;
            padding: 1rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            color: var(--text-primary);
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .input-group input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .convert-btn {
            background: var(--success-color);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
        }
        
        .convert-btn:hover {
            background: #059669;
        }
        
        .result {
            margin-top: 1.5rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            display: none;
        }
        
        .result.show {
            display: block;
        }
        
        .result-url {
            word-break: break-all;
            color: var(--accent-color);
            font-family: 'Monaco', 'Consolas', monospace;
        }
        
        .copy-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
            margin-top: 0.5rem;
            font-size: 0.875rem;
        }
        
        /* Features Section */
        .features {
            padding: 4rem 0;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: var(--text-primary);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            background: var(--bg-secondary);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .feature-card h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .feature-card p {
            color: var(--text-secondary);
        }
        
        /* Platforms Section */
        .platforms {
            background: var(--bg-secondary);
            padding: 4rem 0;
            border-top: 1px solid var(--border-color);
        }
        
        .platforms h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: var(--text-primary);
        }
        
        .platforms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .platform-card {
            background: var(--bg-color);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .platform-card:hover {
            transform: translateY(-5px);
        }
        
        .platform-logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .github { color: var(--text-primary); }
        .gitlab { color: var(--gitlab-color); }
        .huggingface { color: var(--huggingface-color); }
        
        /* Usage Examples */
        .usage {
            padding: 4rem 0;
        }
        
        .usage h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: var(--text-primary);
        }
        
        .example-tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            background: var(--bg-secondary);
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .example-content {
            background: var(--bg-secondary);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            display: none;
        }
        
        .example-content.active {
            display: block;
        }
        
        .code-block {
            background: var(--bg-color);
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
            color: var(--text-primary);
            margin: 1rem 0;
        }
        
        /* Footer */
        .footer {
            background: var(--bg-color);
            border-top: 1px solid var(--border-color);
            padding: 3rem 0 2rem;
            text-align: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: var(--primary-color);
        }
        
        .footer p {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .features h2,
            .platforms h2,
            .usage h2 {
                font-size: 2rem;
            }
            
            .converter-form {
                padding: 1.5rem;
                margin: 0 1rem;
            }
        }
        
        /* Animation */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="#" class="logo">🚀 Xget</a>
            <ul class="nav-links">
                <li><a href="#features">特性</a></li>
                <li><a href="#platforms">平台</a></li>
                <li><a href="#usage">使用</a></li>
                <li><a href="https://github.com/xixu-me/Xget" target="_blank">GitHub</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content fade-in-up">
                    <h1>Xget</h1>
                    <p>一个高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载和 Git 操作而设计</p>
                    <a href="#converter" class="cta-button">立即开始</a>
                </div>
            </div>
        </section>

        <section id="converter" class="converter">
            <div class="container">
                <div class="converter-form fade-in-up">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: var(--text-primary);">URL 转换器</h2>
                    <form id="urlForm">
                        <div class="form-group">
                            <label for="originalUrl">原始 URL</label>
                            <div class="input-group">
                                <input 
                                    type="url" 
                                    id="originalUrl" 
                                    placeholder="粘贴 GitHub、GitLab 或 Hugging Face 的 URL..." 
                                    required
                                >
                            </div>
                        </div>
                        <button type="submit" class="convert-btn">🚀 转换为加速链接</button>
                    </form>
                    <div id="result" class="result">
                        <strong>加速链接：</strong>
                        <div class="result-url" id="resultUrl"></div>
                        <button class="copy-btn" onclick="copyToClipboard()">📋 复制链接</button>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="features">
            <div class="container">
                <h2 class="fade-in-up">🌟 核心特性</h2>
                <div class="features-grid">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">⚡</div>
                        <h3>全球边缘分发</h3>
                        <p>基于 Cloudflare 全球 CDN，200+ 城市边缘节点，就近响应用户请求，显著提升下载速度</p>
                    </div>
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">🌐</div>
                        <h3>多平台集成</h3>
                        <p>完美支持 GitHub、GitLab、Hugging Face，智能路径转换，无缝访问各平台资源</p>
                    </div>
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">🔒</div>
                        <h3>企业级安全</h3>
                        <p>多层安全标头保护，请求验证机制，超时保护，确保安全可靠的代理服务</p>
                    </div>
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">🎯</div>
                        <h3>Git 完全兼容</h3>
                        <p>支持 git clone、push、pull 等所有 Git 操作，智能协议检测，无需修改工作流</p>
                    </div>
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">📱</div>
                        <h3>生态系统集成</h3>
                        <p>专用浏览器扩展，完美兼容 wget、curl、aria2 等下载工具，CI/CD 环境友好</p>
                    </div>
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">🚀</div>
                        <h3>现代架构</h3>
                        <p>智能重试机制，高效缓存策略，性能监控系统，提供稳定可靠的服务体验</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="platforms" class="platforms">
            <div class="container">
                <h2 class="fade-in-up">🌐 支持平台</h2>
                <div class="platforms-grid">
                    <div class="platform-card fade-in-up">
                        <div class="platform-logo github">🐙</div>
                        <h3>GitHub</h3>
                        <p>加速 Releases、Archives、Raw 文件下载，完整支持 Git 协议操作</p>
                        <div class="code-block">
                            <strong>前缀:</strong> /gh/<br>
                            <strong>示例:</strong> xget.xi-xu.me/gh/microsoft/vscode/archive/main.zip
                        </div>
                    </div>
                    <div class="platform-card fade-in-up">
                        <div class="platform-logo gitlab">🦊</div>
                        <h3>GitLab</h3>
                        <p>全面适配 GitLab.com 的文件下载和版本控制功能</p>
                        <div class="code-block">
                            <strong>前缀:</strong> /gl/<br>
                            <strong>示例:</strong> xget.xi-xu.me/gl/gitlab-org/gitlab/-/archive/master/gitlab-master.zip
                        </div>
                    </div>
                    <div class="platform-card fade-in-up">
                        <div class="platform-logo huggingface">🤗</div>
                        <h3>Hugging Face</h3>
                        <p>针对大型模型文件和数据集进行专门优化，支持高速下载</p>
                        <div class="code-block">
                            <strong>前缀:</strong> /hf/<br>
                            <strong>示例:</strong> xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="usage" class="usage">
            <div class="container">
                <h2 class="fade-in-up">📖 使用示例</h2>
                <div class="example-tabs">
                    <button class="tab-btn active" onclick="showTab('git')">Git 操作</button>
                    <button class="tab-btn" onclick="showTab('download')">文件下载</button>
                    <button class="tab-btn" onclick="showTab('python')">Python 集成</button>
                    <button class="tab-btn" onclick="showTab('cicd')">CI/CD</button>
                </div>
                
                <div id="git" class="example-content active">
                    <h3>🎯 Git 版本控制操作</h3>
                    <p>Xget 完全兼容 Git 协议，支持所有标准 Git 操作：</p>
                    <div class="code-block">
# 克隆仓库
git clone https://xget.xi-xu.me/gh/microsoft/vscode.git

# 克隆指定分支
git clone -b main https://xget.xi-xu.me/gh/facebook/react.git

# 浅克隆（仅最新提交）
git clone --depth 1 https://xget.xi-xu.me/gh/torvalds/linux.git

# 添加远程仓库
git remote add upstream https://xget.xi-xu.me/gh/[用户名]/[仓库名].git
                    </div>
                </div>
                
                <div id="download" class="example-content">
                    <h3>⬇️ 主流下载工具集成</h3>
                    <p>完美支持 wget、curl、aria2 等下载工具：</p>
                    <div class="code-block">
# wget 下载
wget https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip

# curl 下载
curl -L -O https://xget.xi-xu.me/gh/golang/go/archive/refs/tags/go1.22.0.tar.gz

# aria2 多线程下载
aria2c -x 16 -s 16 https://xget.xi-xu.me/hf/microsoft/DialoGPT-large/resolve/main/pytorch_model.bin
                    </div>
                </div>
                
                <div id="python" class="example-content">
                    <h3>🐍 Python 环境中的应用</h3>
                    <p>作为 Hugging Face 镜像使用：</p>
                    <div class="code-block">
import os
from transformers import AutoTokenizer, AutoModelForCausalLM

# 设置环境变量，让 transformers 库自动使用 Xget 镜像
os.environ['HF_ENDPOINT'] = 'https://xget.xi-xu.me/hf'

# 现在所有模型下载都会通过 Xget 加速
model_name = 'microsoft/DialoGPT-medium'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
                    </div>
                </div>
                
                <div id="cicd" class="example-content">
                    <h3>🔄 CI/CD 环境集成</h3>
                    <p>在 GitHub Actions 中使用 Xget：</p>
                    <div class="code-block">
name: Download Dependencies
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Download model files
        run: |
          wget https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin
          
      - name: Clone dependency repo
        run: |
          git clone https://xget.xi-xu.me/gh/[依赖项目]/[仓库名].git
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-links">
                <a href="https://github.com/xixu-me/Xget" target="_blank">GitHub</a>
                <a href="https://github.com/xixu-me/Xget-for-Chromium" target="_blank">浏览器扩展</a>
                <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget" target="_blank">一键部署</a>
                <a href="https://github.com/xixu-me/Xget/blob/main/LICENSE" target="_blank">许可证</a>
            </div>
            <p>&copy; 2025 Xget. 采用 GPL-3.0 许可证开源</p>
        </div>
    </footer>

    <script>
        // URL 转换器
        document.getElementById('urlForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const originalUrl = document.getElementById('originalUrl').value.trim();
            const resultDiv = document.getElementById('result');
            const resultUrlDiv = document.getElementById('resultUrl');
            
            if (!originalUrl) {
                alert('请输入有效的 URL');
                return;
            }
            
            let convertedUrl = '';
            
            try {
                const url = new URL(originalUrl);
                const hostname = url.hostname.toLowerCase();
                
                if (hostname === 'github.com') {
                    convertedUrl = originalUrl.replace('https://github.com', 'https://xget.xi-xu.me/gh');
                } else if (hostname === 'gitlab.com') {
                    convertedUrl = originalUrl.replace('https://gitlab.com', 'https://xget.xi-xu.me/gl');
                } else if (hostname === 'huggingface.co') {
                    convertedUrl = originalUrl.replace('https://huggingface.co', 'https://xget.xi-xu.me/hf');
                } else {
                    alert('暂不支持该平台，目前仅支持 GitHub、GitLab 和 Hugging Face');
                    return;
                }
                
                resultUrlDiv.textContent = convertedUrl;
                resultDiv.classList.add('show');
                
                // 保存转换后的 URL 供复制使用
                window.lastConvertedUrl = convertedUrl;
                
            } catch (error) {
                alert('URL 格式不正确，请检查后重试');
            }
        });
        
        // 复制到剪贴板
        function copyToClipboard() {
            if (window.lastConvertedUrl) {
                navigator.clipboard.writeText(window.lastConvertedUrl).then(function() {
                    const btn = document.querySelector('.copy-btn');
                    const originalText = btn.textContent;
                    btn.textContent = '✅ 已复制';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                }).catch(function() {
                    // 降级方案
                    const textArea = document.createElement('textarea');
                    textArea.value = window.lastConvertedUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    const btn = document.querySelector('.copy-btn');
                    const originalText = btn.textContent;
                    btn.textContent = '✅ 已复制';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                });
            }
        }
        
        // 选项卡切换
        function showTab(tabName) {
            // 隐藏所有内容
            document.querySelectorAll('.example-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 移除所有按钮的活动状态
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 显示选中的内容
            document.getElementById(tabName).classList.add('active');
            
            // 激活对应的按钮
            event.target.classList.add('active');
        }
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // 滚动动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);
        
        // 观察所有可能需要动画的元素
        document.querySelectorAll('.feature-card, .platform-card, .converter-form').forEach(el => {
            observer.observe(el);
        });
        
        // 页面加载完成后的处理
        document.addEventListener('DOMContentLoaded', function() {
            // 预填充示例 URL（如果有查询参数）
            const urlParams = new URLSearchParams(window.location.search);
            const exampleUrl = urlParams.get('url');
            if (exampleUrl) {
                document.getElementById('originalUrl').value = decodeURIComponent(exampleUrl);
            }
        });
    </script>
</body>
</html>`;
}
