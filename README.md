# Xget

一个高性能、安全的代理服务，用于加速从 GitHub、GitLab 和 Hugging Face 的下载。

🌐 [https://Xget.xi-xu.me](https://xget.xi-xu.me)

## 功能特性

- **多平台支持**：无缝处理以下平台的下载：
  - GitHub (`/gh/...`)
  - GitLab (`/gl/...`)
  - Hugging Face (`/hf/...`)

- **性能优化**：
  - 智能缓存，TTL 为 30 分钟
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

🔗 **[Xget for Chrome 扩展程序](https://github.com/xixu-me/Xget-for-Chrome)**

可在以下平台获取：

- [Chrome 网上应用店](https://chromewebstore.google.com/detail/ajiejgobfcifcikbahpijopolfjoodgf)
- [Microsoft Edge 插件商店](https://microsoftedge.microsoft.com/addons/detail/jigpfhbegabdenhihpplcjhpfdcgnalc)
- 所有其他基于 Chromium 的浏览器可通过 .crx 文件安装

### 手动 URL 前缀

或者，您可以手动在下载 URL 前面添加 `https://xget.xi-xu.me/<platform>/`，其中 `<platform>` 为以下之一：

- `gh` 用于 GitHub
- `gl` 用于 GitLab
- `hf` 用于 Hugging Face

### 示例

```bash
# GitHub 下载
https://xget.xi-xu.me/gh/username/repository/archive/main.zip

# GitLab 下载
https://xget.xi-xu.me/gl/username/repository/-/archive/main.zip

# Hugging Face 下载
https://xget.xi-xu.me/hf/username/model/resolve/main/model.bin
```

## 技术细节

- 基于 Cloudflare Workers 构建，实现全球边缘分发
- 实现了具有可配置延迟的智能重试机制
- 全面的错误处理和日志记录
- 性能指标跟踪，用于监控和优化

## 部署

只需点击 [![部署到 Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget)。

## 状态

[![部署到 Cloudflare Workers](https://github.com/xixu-me/xget/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg)](https://github.com/xixu-me/Xget/actions/workflows/deploy.yml)

## 许可证

版权所有 &copy; [Xi Xu](https://xi-xu.me)。保留所有权利。

基于 [GPL-3.0](LICENSE) 许可证授权。  
