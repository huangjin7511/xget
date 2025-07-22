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
            --github-color: #ffffff;
            --gitlab-color: #fc6d26;
            --huggingface-color: #ffd21e;
        }
        
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.7;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }
        
        /* Header */
        .header {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-color);
            z-index: 1000;
            transition: background-color 0.3s ease;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 4.5rem;
        }
        
        .logo {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
        }

        .logo span {
            color: var(--primary-color);
        }
        
        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }
        
        .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            position: relative;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            transition: width 0.3s ease;
        }

        .nav-links a:hover, .nav-links a.active {
            color: var(--primary-color);
        }

        .nav-links a:hover::after, .nav-links a.active::after {
            width: 100%;
        }
        
        /* Hero Section */
        .hero {
            padding: 10rem 0 6rem;
            text-align: center;
            background: radial-gradient(ellipse at top, var(--bg-secondary) 0%, var(--bg-color) 70%);
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
            transform: translateX(-50%);
            pointer-events: none;
            animation: pulse 5s infinite;
        }

        @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); opacity: 0.15; }
            50% { transform: translateX(-50%) scale(1.2); opacity: 0.2; }
            100% { transform: translateX(-50%) scale(1); opacity: 0.15; }
        }
        
        .hero-content {
            position: relative;
            z-index: 1;
        }
        
        .hero h1 {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 2.5rem;
            max-width: 650px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(59, 130, 246, 0.35);
        }
        
        /* Section Styles */
        .section {
            padding: 6rem 0;
        }

        .section-title {
            text-align: center;
            font-size: 2.75rem;
            margin-bottom: 4rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        /* URL Converter */
        #converter {
            background: var(--bg-secondary);
        }
        
        .converter-form {
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg-color);
            padding: 2.5rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .input-group {
            position: relative;
        }
        
        .input-group input {
            width: 100%;
            padding: 1rem 1.25rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            color: var(--text-primary);
            font-size: 1rem;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .input-group input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
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
            font-size: 1.1rem;
        }
        
        .convert-btn:hover {
            background: #059669;
        }
        
        .result {
            margin-top: 2rem;
            padding: 1.25rem;
            background: var(--bg-secondary);
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            display: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .result.show {
            display: block;
            opacity: 1;
        }
        
        .result-url {
            word-break: break-all;
            color: var(--accent-color);
            font-family: 'SF Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
            margin-bottom: 1rem;
        }
        
        .copy-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background-color 0.3s ease;
        }

        .copy-btn:hover {
            background-color: var(--primary-dark);
        }
        
        /* Features Section */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            background: var(--bg-secondary);
            padding: 2.5rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            display: block;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .feature-card p {
            color: var(--text-secondary);
        }
        
        /* Platforms Section */
        #platforms {
            background: var(--bg-secondary);
        }

        .platforms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .platform-card {
            background: var(--bg-color);
            padding: 2.5rem;
            border-radius: 1rem;
            border: 1px solid var(--border-color);
            text-align: center;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .platform-card:hover {
            transform: translateY(-8px);
            border-color: var(--primary-color);
        }
        
        .platform-logo {
            font-size: 4rem;
            margin-bottom: 1.5rem;
        }
        
        .github { color: var(--github-color); }
        .gitlab { color: var(--gitlab-color); }
        .huggingface { color: var(--huggingface-color); }
        
        /* Usage Examples */
        .usage-container {
            display: flex;
            gap: 2rem;
        }

        .example-tabs {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex-shrink: 0;
        }
        
        .tab-btn {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            font-weight: 600;
        }
        
        .example-content-wrapper {
            flex-grow: 1;
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
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .code-block {
            background: var(--bg-color);
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            font-family: 'SF Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            color: var(--text-primary);
            margin-top: 1.5rem;
            position: relative;
        }

        .code-block pre {
            margin: 0;
        }

        .code-block code {
            white-space: pre;
        }

        .code-block .comment {
            color: #6a9955;
        }
        
        /* Footer */
        .footer {
            background: var(--bg-color);
            border-top: 1px solid var(--border-color);
            padding: 4rem 0 3rem;
            text-align: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
            font-weight: 500;
        }
        
        .footer-links a:hover {
            color: var(--primary-color);
        }
        
        .footer p {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
            .usage-container {
                flex-direction: column;
            }
            .example-tabs {
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
            }
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 3rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
            
            .nav-links {
                display: none; /* Simple hiding for mobile, can be replaced with a burger menu */
            }
            
            .section-title {
                font-size: 2.25rem;
            }

            .converter-form {
                padding: 2rem;
            }
        }
        
        /* Animation on Scroll */
        .fade-in-up {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="#" class="logo">🚀 X<span>get</span></a>
            <ul class="nav-links">
                <li><a href="#features">特性</a></li>
                <li><a href="#platforms">平台</a></li>
                <li><a href="#usage">使用</a></li>
                <li><a href="https://github.com/xixu-me/Xget" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>Xget</h1>
                    <p>一个高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载和 Git 操作而设计。</p>
                    <a href="#converter" class="cta-button">立即开始</a>
                </div>
            </div>
        </section>

        <section id="converter" class="section">
            <div class="container">
                <div class="converter-form">
                    <h2 class="section-title" style="margin-bottom: 2rem;">URL 转换器</h2>
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
                        <button class="copy-btn" id="copyBtn">📋 复制链接</button>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="section">
            <div class="container">
                <h2 class="section-title">🌟 核心特性</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feature-icon">⚡</span>
                        <h3>全球边缘分发</h3>
                        <p>基于 Cloudflare 全球 CDN，200+ 城市边缘节点，就近响应用户请求，显著提升下载速度。</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🌐</span>
                        <h3>多平台集成</h3>
                        <p>完美支持 GitHub、GitLab、Hugging Face，智能路径转换，无缝访问各平台资源。</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🔒</span>
                        <h3>企业级安全</h3>
                        <p>多层安全标头保护，请求验证机制，超时保护，确保安全可靠的代理服务。</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🎯</span>
                        <h3>Git 完全兼容</h3>
                        <p>支持 git clone、push、pull 等所有 Git 操作，智能协议检测，无需修改工作流。</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">📱</span>
                        <h3>生态系统集成</h3>
                        <p>专用浏览器扩展，完美兼容 wget、curl、aria2 等下载工具，CI/CD 环境友好。</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🚀</span>
                        <h3>现代架构</h3>
                        <p>智能重试机制，高效缓存策略，性能监控系统，提供稳定可靠的服务体验。</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="platforms" class="section">
            <div class="container">
                <h2 class="section-title">🌐 支持平台</h2>
                <div class="platforms-grid">
                    <div class="platform-card">
                        <div class="platform-logo github">🐙</div>
                        <h3>GitHub</h3>
                        <p>加速 Releases、Archives、Raw 文件下载，完整支持 Git 协议操作。</p>
                        <div class="code-block">
                            <pre><code><strong>前缀:</strong> /gh/<br><strong>示例:</strong> xget.xi-xu.me/gh/...</code></pre>
                        </div>
                    </div>
                    <div class="platform-card">
                        <div class="platform-logo gitlab">🦊</div>
                        <h3>GitLab</h3>
                        <p>全面适配 GitLab.com 的文件下载和版本控制功能。</p>
                        <div class="code-block">
                            <pre><code><strong>前缀:</strong> /gl/<br><strong>示例:</strong> xget.xi-xu.me/gl/...</code></pre>
                        </div>
                    </div>
                    <div class="platform-card">
                        <div class="platform-logo huggingface">🤗</div>
                        <h3>Hugging Face</h3>
                        <p>针对大型模型文件和数据集进行专门优化，支持高速下载。</p>
                        <div class="code-block">
                            <pre><code><strong>前缀:</strong> /hf/<br><strong>示例:</strong> xget.xi-xu.me/hf/...</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="usage" class="section">
            <div class="container">
                <h2 class="section-title">📖 使用示例</h2>
                <div class="usage-container">
                    <div class="example-tabs">
                        <button class="tab-btn active" data-tab="git">Git 操作</button>
                        <button class="tab-btn" data-tab="download">文件下载</button>
                        <button class="tab-btn" data-tab="python">Python 集成</button>
                        <button class="tab-btn" data-tab="cicd">CI/CD</button>
                    </div>
                    
                    <div class="example-content-wrapper">
                        <div id="git" class="example-content active">
                            <h3>🎯 Git 版本控制操作</h3>
                            <p>Xget 完全兼容 Git 协议，支持所有标准 Git 操作：</p>
                            <div class="code-block">
<pre><code><span class="comment"># 克隆仓库</span>
git clone https://xget.xi-xu.me/gh/microsoft/vscode.git

<span class="comment"># 克隆指定分支</span>
git clone -b main https://xget.xi-xu.me/gh/facebook/react.git

<span class="comment"># 浅克隆（仅最新提交）</span>
git clone --depth 1 https://xget.xi-xu.me/gh/torvalds/linux.git</code></pre>
                            </div>
                        </div>
                        
                        <div id="download" class="example-content">
                            <h3>⬇️ 主流下载工具集成</h3>
                            <p>完美支持 wget、curl、aria2 等下载工具：</p>
                            <div class="code-block">
<pre><code><span class="comment"># wget 下载</span>
wget https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip

<span class="comment"># curl 下载</span>
curl -L -O https://xget.xi-xu.me/gh/golang/go/archive/refs/tags/go1.22.0.tar.gz

<span class="comment"># aria2 多线程下载</span>
aria2c -x 16 -s 16 https://xget.xi-xu.me/hf/microsoft/DialoGPT-large/resolve/main/pytorch_model.bin</code></pre>
                            </div>
                        </div>
                        
                        <div id="python" class="example-content">
                            <h3>🐍 Python 环境中的应用</h3>
                            <p>作为 Hugging Face 镜像使用：</p>
                            <div class="code-block">
<pre><code><span class="comment"># 设置环境变量，让 transformers 库自动使用 Xget 镜像</span>
import os
os.environ['HF_ENDPOINT'] = 'https://xget.xi-xu.me'

from transformers import AutoModel

<span class="comment"># 现在所有模型下载都会通过 Xget 加速</span>
model = AutoModel.from_pretrained('bert-base-uncased')</code></pre>
                            </div>
                        </div>
                        
                        <div id="cicd" class="example-content">
                            <h3>🔄 CI/CD 环境集成</h3>
                            <p>在 GitHub Actions 中使用 Xget：</p>
                            <div class="code-block">
<pre><code>name: Download Dependencies
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Download model files
      run: |
        wget https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin
          
    - name: Clone dependency repo
      run: |
        git clone https://xget.xi-xu.me/gh/some-dependency/repo.git</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-links">
                <a href="https://github.com/xixu-me/Xget" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://github.com/xixu-me/Xget-for-Chromium" target="_blank" rel="noopener noreferrer">浏览器扩展</a>
                <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget" target="_blank" rel="noopener noreferrer">一键部署</a>
                <a href="https://github.com/xixu-me/Xget/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">许可证</a>
            </div>
            <p>&copy; ${new Date().getFullYear()} Xget. 采用 GPL-3.0 许可证开源。</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // URL Converter
            const urlForm = document.getElementById('urlForm');
            if (urlForm) {
                urlForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const originalUrlInput = document.getElementById('originalUrl');
                    const resultDiv = document.getElementById('result');
                    const resultUrlDiv = document.getElementById('resultUrl');
                    
                    const originalUrl = originalUrlInput.value.trim();
                    if (!originalUrl) {
                        alert('请输入有效的 URL');
                        return;
                    }
                    
                    let convertedUrl = '';
                    const serviceHost = 'https://xget.xi-xu.me';
                    
                    try {
                        const url = new URL(originalUrl);
                        const hostname = url.hostname.toLowerCase();
                        
                        if (hostname === 'github.com') {
                            convertedUrl = originalUrl.replace('https://github.com', serviceHost + '/gh');
                        } else if (hostname === 'gitlab.com') {
                            convertedUrl = originalUrl.replace('https://gitlab.com', serviceHost + '/gl');
                        } else if (hostname === 'huggingface.co') {
                            convertedUrl = originalUrl.replace('https://huggingface.co', serviceHost + '/hf');
                        } else {
                            alert('暂不支持该平台，目前仅支持 GitHub、GitLab 和 Hugging Face');
                            return;
                        }
                        
                        resultUrlDiv.textContent = convertedUrl;
                        resultDiv.classList.add('show');
                        
                    } catch (error) {
                        alert('URL 格式不正确，请检查后重试');
                    }
                });
            }

            // Copy to Clipboard
            const copyBtn = document.getElementById('copyBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const resultUrl = document.getElementById('resultUrl').textContent;
                    if (resultUrl) {
                        navigator.clipboard.writeText(resultUrl).then(() => {
                            const originalText = copyBtn.textContent;
                            copyBtn.textContent = '✅ 已复制';
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                            }, 2000);
                        }).catch(err => {
                            console.error('无法复制: ', err);
                            alert('复制失败，请手动复制。');
                        });
                    }
                });
            }
            
            // Tabs
            const tabsContainer = document.querySelector('.example-tabs');
            if (tabsContainer) {
                tabsContainer.addEventListener('click', (e) => {
                    if (e.target.matches('.tab-btn')) {
                        const tabName = e.target.dataset.tab;
                        
                        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                        e.target.classList.add('active');
                        
                        document.querySelectorAll('.example-content').forEach(content => {
                            content.classList.remove('active');
                        });
                        document.getElementById(tabName).classList.add('active');
                    }
                });
            }
            
            // Animation on Scroll
            const animatedElements = document.querySelectorAll('.feature-card, .platform-card, .converter-form, .section-title');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });

            animatedElements.forEach(el => {
                el.classList.add('fade-in-up');
                observer.observe(el);
            });
        });
    </script>
</body>
</html>`;
}
