# Xget

一个高性能、安全的代理服务，用于加速从 GitHub、GitLab 和 Hugging Face 的下载。

🌐 [https://Xget.xi-xu.me](https://xget.xi-xu.me)

## 功能特性

- **多平台支持**：无缝处理以下平台的下载：
  - GitHub (`/gh/...`)
  - GitLab (`/gl/...`)
  - Hugging Face (`/hf/...`)

- **Git 操作支持**：
  - 完整的 Git 克隆支持
  - 智能 Git 协议检测
  - 支持 `git clone`、`git fetch`、`git pull` 等操作
  - 自动处理 Git 智能 HTTP 传输协议

- **性能优化**：
  - 智能缓存，TTL 为 30 分钟（Git 操作除外）
  - HTTP/3 支持
  - 指数退避的自动重试
  - 内容压缩（gzip、deflate、brotli）
  - 资源预连接
  - JS、CSS 和 HTML 内容压缩

- **安全功能**：
  - 严格的安全头
  - 内容安全策略（CSP）
  - HSTS 预加载
  - XSS 防护
  - 框架保护
  - 引用策略强制执行
  - 权限策略控制

- **可靠性**：
  - 自动请求重试（最多 3 次）
  - 请求超时保护
  - 范围请求支持
  - 详细的性能监控

## 使用方法

### 浏览器扩展（推荐）

为了获得最佳用户体验，请使用 **Xget for Chrome** 扩展程序来自动重定向下载：

🔗 **[Xget for Chrome 存储库](https://github.com/xixu-me/Xget-for-Chrome)**

可在以下平台获取：

- [Chrome 网上应用店](https://chromewebstore.google.com/detail/ajiejgobfcifcikbahpijopolfjoodgf)
- [Microsoft Edge 插件商店](https://microsoftedge.microsoft.com/addons/detail/jigpfhbegabdenhihpplcjhpfdcgnalc)
- [GitHub Releases](https://github.com/xixu-me/Xget-for-Chrome/releases/latest)

适用于一切基于 Chromium 的浏览器。

### Git 克隆支持

Xget 现在完全支持 Git 操作！您可以直接使用 Git 命令克隆仓库：

```bash
# 克隆 GitHub 仓库
git clone https://xget.xi-xu.me/gh/username/repository.git

# 克隆 GitLab 仓库  
git clone https://xget.xi-xu.me/gl/username/repository.git

# 克隆 Hugging Face 模型仓库
git clone https://xget.xi-xu.me/hf/username/model.git
```

支持所有标准 Git 操作：

- `git clone` - 克隆仓库
- `git fetch` - 获取更新
- `git pull` - 拉取更新
- `git push` - 推送更改（如果有权限）

### 手动 URL 前缀

或者，您可以手动在下载 URL 前面添加 `https://xget.xi-xu.me/<platform>/`，其中 `<platform>` 为以下之一：

- `gh` 用于 GitHub
- `gl` 用于 GitLab
- `hf` 用于 Hugging Face

### 示例

```bash
# GitHub 文件下载
https://xget.xi-xu.me/gh/username/repository/archive/main.zip

# GitLab 文件下载
https://xget.xi-xu.me/gl/username/repository/-/archive/main.zip

# Hugging Face 文件下载
https://xget.xi-xu.me/hf/username/model/resolve/main/model.bin

# Git 克隆操作
git clone https://xget.xi-xu.me/gh/username/repository.git

# Git 其他操作
git clone https://xget.xi-xu.me/gl/username/repository.git
git clone https://xget.xi-xu.me/hf/username/model.git
```

## 技术细节

- 基于 Cloudflare Workers 构建，实现全球边缘分发
- 智能 Git 协议检测和处理，支持完整的 Git 操作
- 实现了具有可配置延迟的智能重试机制
- 全面的错误处理和日志记录
- 性能指标跟踪，用于监控和优化
- Git 操作绕过缓存以确保实时协议通信

## 部署

只需点击 [![部署到 Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget)。

## 状态

[![部署到 Cloudflare Workers](https://github.com/xixu-me/xget/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg)](https://github.com/xixu-me/Xget/actions/workflows/deploy.yml)

## 许可证

版权所有 &copy; [Xi Xu](https://xi-xu.me)。保留所有权利。

基于 [GPL-3.0](LICENSE) 许可证授权。  
