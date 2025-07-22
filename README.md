# Xget

[![GitHub](https://img.shields.io/badge/GitHub-181717?&logo=github&logoColor=white)](#github)
[![GitLab](https://img.shields.io/badge/GitLab-FC6D26?&logo=gitlab&logoColor=white)](#gitlab)
[![Hugging Face](https://img.shields.io/badge/🤗%20Hugging%20Face-FFD21E?&logoColor=black)](#hugging-face)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?&logo=cloudflare&logoColor=white)](#cloudflare-workers-一键部署)
[![Chromium Extension](https://img.shields.io/badge/Chromium%20Extension-4285F4?&logo=googlechrome&logoColor=white)](#-生态系统集成)

一个高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载和 Git 操作而设计。

## 🎯 快速使用

**公共实例：**[**`xget.xi-xu.me`**](https://xget.xi-xu.me) - 开箱即用，无需部署！

## 🌟 特性

### ⚡ 全球边缘分发与性能加速

- **Cloudflare 全球 CDN**：利用遍布全球 200+ 个城市的边缘节点，就近响应用户请求
- **HTTP/3 支持**：启用最新的 HTTP/3 协议，显著降低连接延迟和传输时间
- **智能压缩**：自动启用 gzip、deflate、brotli 多重压缩算法，最大化传输效率
- **预连接优化**：通过连接预热和保持活跃连接，减少握手开销
- **Range 请求支持**：完整支持分片下载和断点续传，适配各种下载工具

### 🌐 多平台深度集成

- **GitHub 生态**：完美支持 Releases、Archives、Raw 文件和完整的 Git 协议操作
- **GitLab 兼容**：全面适配 GitLab.com 的文件下载和版本控制功能
- **Hugging Face 优化**：针对大型模型文件和数据集进行专门优化，支持模型和数据集的高速下载
- **路径智能转换**：自动识别平台前缀（/gh/、/gl/、/hf/）并转换为目标平台的正确 URL 结构

### 🔒 企业级安全保障

- **多层安全标头**：
  - `Strict-Transport-Security`：强制 HTTPS 传输，预防中间人攻击
  - `X-Frame-Options: DENY`：防止点击劫持攻击
  - `X-XSS-Protection`：内置 XSS 防护机制
  - `Content-Security-Policy`：严格的内容安全策略
  - `Referrer-Policy`：控制引用信息泄露
- **请求验证机制**：
  - HTTP 方法白名单：常规请求限制为 GET/HEAD，Git 操作动态允许 POST
  - 路径长度限制：防止超长 URL 攻击（最大 2048 字符）
  - 输入清理：防止路径遍历和注入攻击
- **超时保护**：30 秒请求超时，防止资源耗尽和恶意请求

### 🚀 现代架构与可靠性

- **智能重试机制**：
  - 最大 3 次重试，线性延迟策略（1000ms × 重试次数）
  - 自动错误恢复，提高下载成功率
  - 超时检测和中断处理
- **高效缓存策略**：
  - 1800 秒（30 分钟）默认缓存时长，显著减少源站压力
  - Git 操作跳过缓存，确保实时性
  - 基于 Cloudflare Cache API 的边缘缓存
- **性能监控系统**：
  - 内置 `PerformanceMonitor` 类，实时追踪请求各阶段耗时
  - 通过 `X-Performance-Metrics` 响应头提供详细性能数据
  - 支持缓存命中率统计和优化建议

### 🎯 Git 协议完全兼容

- **智能协议检测**：
  - 自动识别 Git 特定端点（`/info/refs`、`/git-upload-pack`、`/git-receive-pack`）
  - 检测 Git 客户端 User-Agent 模式
  - 支持 `service=git-upload-pack` 等查询参数
- **完整操作支持**：
  - `git clone`：完整仓库克隆，支持浅克隆和分支指定
  - `git push`：代码推送和分支管理
  - `git pull/fetch`：增量更新和远程同步
  - `git submodule`：子模块递归克隆
- **协议优化**：
  - 保持 Git 专用请求头和认证信息
  - 智能 User-Agent 处理（默认 `git/2.34.1`）
  - 支持 Git LFS 大文件传输

### 📱 生态系统集成

- **专用浏览器扩展**：[Xget for Chromium](https://github.com/xixu-me/Xget-for-Chromium) 提供无缝体验
  - 自动链接重定向，无需手动修改 URL
  - 支持自定义 Xget 实例域名
  - 多平台偏好设置和黑白名单管理
  - 本地处理，确保隐私安全
- **下载工具兼容**：完美支持 wget、curl、aria2、IDM 等主流下载工具
- **CI/CD 集成**：可直接在 GitHub Actions、GitLab CI 等环境中使用

## 🚀 部署选择

### Cloudflare Workers 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget)

部署后，你的 Xget 服务将在 `your-worker-name.your-subdomain.workers.dev` 上可用。

### 手动部署

如果你更喜欢手动部署或需要自定义配置：

#### 前置要求

1. 注册 [Cloudflare 账户](https://dash.cloudflare.com/sign-up/workers-and-pages)
2. 安装 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### 部署步骤

1. **克隆存储库**

   ```bash
   git clone https://github.com/xixu-me/Xget.git
   cd Xget
   ```

2. **安装依赖并认证**

   ```bash
   npm install
   npx wrangler auth login
   ```

3. **自定义配置（可选）**

   编辑 `wrangler.toml` 文件设置你的项目名称：

   ```toml
   name = "你的-xget-项目名"
   ```

4. **部署**

   ```bash
   npm run deploy
   ```

部署完成后，你的 Xget 服务将在 `your-worker-name.your-subdomain.workers.dev` 上可用。

## 📖 链接转换规则

使用公共实例 [**`xget.xi-xu.me`**](https://xget.xi-xu.me) 或你自己部署的实例，只需简单替换域名并添加平台前缀：

### 转换格式

```
原始链接：https://[平台域名]/[路径]
加速链接：https://[Xget域名]/[平台前缀]/[路径]
```

### 各平台转换示例

#### GitHub 文件加速

```url
# 原始链接
https://github.com/microsoft/vscode/archive/refs/heads/main.zip

# 转换后（添加 /gh/ 前缀）
https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip
```

#### GitLab 文件加速

```url
# 原始链接
https://gitlab.com/gitlab-org/gitlab/-/archive/master/gitlab-master.zip

# 转换后（添加 /gl/ 前缀）
https://xget.xi-xu.me/gl/gitlab-org/gitlab/-/archive/master/gitlab-master.zip
```

#### Hugging Face 模型/数据集加速

```url
# 模型文件原始链接
https://huggingface.co/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

# 转换后（添加 /hf/ 前缀）
https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

# 数据集文件原始链接
https://huggingface.co/datasets/squad/resolve/main/train-v1.1.json

# 转换后（添加 /hf/ 前缀）
https://xget.xi-xu.me/hf/datasets/squad/resolve/main/train-v1.1.json
```

## 🎯 应用场景

### Git 版本控制操作

Xget 完全兼容 Git 协议，支持所有标准 Git 操作：

```bash
# 克隆仓库
git clone https://xget.xi-xu.me/gh/microsoft/vscode.git

# 克隆指定分支
git clone -b main https://xget.xi-xu.me/gh/facebook/react.git

# 浅克隆（仅最新提交）
git clone --depth 1 https://xget.xi-xu.me/gh/torvalds/linux.git

# 添加远程仓库
git remote add upstream https://xget.xi-xu.me/gh/original/repo.git

# 拉取更新
git pull https://xget.xi-xu.me/gh/microsoft/vscode.git main

# 子模块递归克隆
git clone --recursive https://xget.xi-xu.me/gh/project/with-submodules.git
```

### 主流下载工具集成

#### wget 下载

```bash
# 下载单个文件
wget https://xget.xi-xu.me/gh/microsoft/vscode/releases/download/1.85.0/VSCode-linux-x64.tar.gz

# 断点续传
wget -c https://xget.xi-xu.me/hf/microsoft/DialoGPT-large/resolve/main/pytorch_model.bin

# 批量下载
wget -i urls.txt  # urls.txt 包含多个 Xget 链接
```

#### curl 下载

```bash
# 基本下载
curl -L -O https://xget.xi-xu.me/gh/golang/go/archive/refs/tags/go1.21.5.tar.gz

# 显示进度条
curl -L --progress-bar -o model.bin https://xget.xi-xu.me/hf/openai/whisper-large-v3/resolve/main/pytorch_model.bin

# 设置用户代理
curl -L -H "User-Agent: MyApp/1.0" https://xget.xi-xu.me/gl/gitlab-org/gitlab-runner/-/archive/main/gitlab-runner-main.zip
```

#### aria2 多线程下载

```bash
# 多线程下载大文件
aria2c -x 16 -s 16 https://xget.xi-xu.me/hf/microsoft/DialoGPT-large/resolve/main/pytorch_model.bin

# 断点续传
aria2c -c https://xget.xi-xu.me/gh/microsoft/vscode/releases/download/1.85.0/VSCode-win32-x64.zip

# 批量下载配置文件
aria2c -i download-list.txt  # 包含多个 Xget 链接的文件
```

### Python 环境中的应用

#### 作为 Hugging Face 镜像

```python
# 设置环境变量使用 Xget 作为 Hugging Face 镜像
import os
os.environ['HF_ENDPOINT'] = 'https://xget.xi-xu.me/hf'

# 或者在代码中直接指定
from transformers import AutoTokenizer, AutoModel

# 下载模型时会自动通过 Xget 加速
tokenizer = AutoTokenizer.from_pretrained('microsoft/DialoGPT-medium')
model = AutoModel.from_pretrained('microsoft/DialoGPT-medium')
```

#### 直接文件下载

```python
import requests
from urllib.parse import urlparse

def download_with_xget(original_url, save_path):
    """使用 Xget 加速下载文件"""
    # 自动转换链接
    if 'github.com' in original_url:
        xget_url = original_url.replace('https://github.com', 'https://xget.xi-xu.me/gh')
    elif 'gitlab.com' in original_url:
        xget_url = original_url.replace('https://gitlab.com', 'https://xget.xi-xu.me/gl')
    elif 'huggingface.co' in original_url:
        xget_url = original_url.replace('https://huggingface.co', 'https://xget.xi-xu.me/hf')
    else:
        xget_url = original_url
    
    # 下载文件
    response = requests.get(xget_url, stream=True)
    response.raise_for_status()
    
    with open(save_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"文件已下载到: {save_path}")

# 使用示例
download_with_xget(
    'https://github.com/microsoft/vscode/archive/refs/heads/main.zip',
    'vscode-main.zip'
)
```

### CI/CD 环境集成

#### GitHub Actions

```yaml
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
          # 使用 Xget 加速下载大型模型文件
          wget https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin
          
      - name: Clone dependency repo
        run: |
          # 使用 Xget 加速 Git 克隆
          git clone https://xget.xi-xu.me/gh/dependency/repo.git
          
      - name: Download release assets
        run: |
          # 批量下载发布文件
          curl -L -O https://xget.xi-xu.me/gh/project/releases/download/v1.0.0/asset1.tar.gz
          curl -L -O https://xget.xi-xu.me/gh/project/releases/download/v1.0.0/asset2.zip
```

#### GitLab CI

```yaml
stages:
  - download
  - build

download_dependencies:
  stage: download
  script:
    # 使用 Xget 加速下载
    - wget https://xget.xi-xu.me/gl/gitlab-org/gitlab-runner/-/archive/main/gitlab-runner-main.zip
    - git clone https://xget.xi-xu.me/gh/external/dependency.git
    # 下载 Hugging Face 数据集
    - curl -L -O https://xget.xi-xu.me/hf/datasets/squad/resolve/main/train-v1.1.json
  artifacts:
    paths:
      - "*.zip"
      - "*.json"
      - dependency/
```

#### Docker 构建优化

```dockerfile
FROM ubuntu:22.04

# 在 Docker 构建中使用 Xget 加速下载
RUN apt-get update && apt-get install -y wget curl git

# 下载大型文件
RUN wget https://xget.xi-xu.me/gh/microsoft/vscode/releases/download/1.85.0/code_1.85.0-1702462158_amd64.deb

# 克隆源码
RUN git clone https://xget.xi-xu.me/gh/project/source.git /app

# 下载模型文件
RUN curl -L -o /models/model.bin https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

WORKDIR /app
```

### 开发环境配置

#### 配置 Git 全局加速

```bash
# 为特定域名配置 Git 使用 Xget
git config --global url."https://xget.xi-xu.me/gh/".insteadOf "https://github.com/"
git config --global url."https://xget.xi-xu.me/gl/".insteadOf "https://gitlab.com/"

# 验证配置
git config --global --get-regexp url

# 现在所有 git clone https://github.com/... 都会自动使用 Xget 加速
git clone https://github.com/microsoft/vscode.git  # 自动转换为 Xget 链接
```

#### IDE 集成

```bash
# VS Code 中配置 Git 使用 Xget
# 在 settings.json 中添加：
{
  "git.defaultCloneDirectory": "~/Projects",
  "terminal.integrated.env.linux": {
    "GIT_CONFIG_GLOBAL": "~/.gitconfig-xget"
  }
}

# 创建专用的 Git 配置文件
echo '[url "https://xget.xi-xu.me/gh/"]' > ~/.gitconfig-xget
echo '    insteadOf = https://github.com/' >> ~/.gitconfig-xget
```

## 🔧 配置

### 环境变量

你可以通过修改 `src/config/index.js` 来自定义配置：

```javascript
export const CONFIG = {
  TIMEOUT_SECONDS: 30,       // 请求超时时间（秒）
  MAX_RETRIES: 3,            // 最大重试次数
  RETRY_DELAY_MS: 1000,      // 重试延迟时间（毫秒）
  CACHE_DURATION: 1800,      // 缓存持续时间（1800秒 = 30分钟）
  SECURITY: {
    ALLOWED_METHODS: ["GET", "HEAD"],  // 允许的 HTTP 方法（Git 操作会动态允许 POST）
    ALLOWED_ORIGINS: ["*"],            // 允许的 CORS 源
    MAX_PATH_LENGTH: 2048,             // 最大路径长度（字符）
  },
};
```

### 性能调优建议

- **缓存优化**：根据使用模式调整 `CACHE_DURATION`，频繁更新的仓库可适当降低
- **超时设置**：网络条件较差时可适当增加 `TIMEOUT_SECONDS`
- **重试策略**：高延迟环境下可增加 `MAX_RETRIES` 和 `RETRY_DELAY_MS`

### 添加新平台

要添加对新平台的支持，编辑 `src/config/platforms.js`：

```javascript
export const PLATFORMS = {
  // 现有平台...
  
  // 新平台示例
  custom: {
    base: "https://example.com",
    transform: (path) => path.replace(/^\/custom\//, "/"),
  },
};
```

## 🚧 开发

1. **项目设置**

   ```bash
   git clone https://github.com/xixu-me/Xget.git
   cd Xget
   npm install
   npx wrangler auth login  # 首次使用
   ```

2. **本地开发**

   ```bash
   npm run dev              # 启动开发服务器 (http://localhost:8787)
   npm test                 # 运行测试
   npm run deploy           # 部署到生产
   ```

## 🔍 故障排除

### 常见问题

**Q: 下载速度没有明显提升？**  
A: 检查源文件是否已经在 CDN 边缘节点缓存，首次访问可能较慢，后续访问会显著提升。

**Q: Git 操作失败？**  
A: 确认使用了正确的 URL 格式，且 Git 客户端版本支持 HTTPS 代理。

**Q: 部署后无法访问？**  
A: 检查 Cloudflare Workers 域名是否正确绑定，确认 `wrangler.toml` 配置正确。

**Q: 出现 400 错误？**  
A: 检查 URL 路径格式，确认平台前缀（/gh/、/gl/、/hf/）正确使用。

### 性能监控

服务会在响应头中返回性能指标：

- `X-Performance-Metrics`: 包含请求各阶段的耗时统计
- `X-Cache-Status`: 显示缓存命中状态

### 日志调试

在开发环境中，你可以通过 Cloudflare Workers 控制台查看详细日志：

```bash
npx wrangler dev --log-level debug
```

## ⚠️ 免责声明

- **合法使用**：本项目仅用于加速合法的公开文件下载和 Git 操作，请遵守相关平台的使用条款和当地法律法规
- **服务可用性**：公共实例 `xget.xi-xu.me` 为免费服务，不保证 100% 可用性，建议生产环境部署自己的实例
- **数据安全**：虽然 Xget 不存储或记录用户数据，但请谨慎处理敏感信息的下载
- **责任限制**：使用本服务造成的任何直接或间接损失，开发者不承担责任
- **第三方平台**：请尊重 GitHub、GitLab、Hugging Face 等平台的服务条款和速率限制

## 📝 许可证

本存储库采用 GPL-3.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
