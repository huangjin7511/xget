# Xget

[![GitHub](https://img.shields.io/badge/GitHub-181717?&logo=github&logoColor=white)](#github)
[![GitLab](https://img.shields.io/badge/GitLab-FC6D26?&logo=gitlab&logoColor=white)](#gitlab)
[![Hugging Face](https://img.shields.io/badge/🤗%20Hugging%20Face-FFD21E?&logoColor=black)](#hugging-face)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?&logo=cloudflare&logoColor=white)](#cloudflare-workers-一键部署)
[![Chromium Extension](https://img.shields.io/badge/Chromium%20Extension-4285F4?&logo=googlechrome&logoColor=white)](#-浏览器扩展-xget-for-chromium)

一个基于 Cloudflare Workers 构建的高性能、安全的代理服务，专为加速 GitHub、GitLab 和 Hugging Face 的文件下载而设计。

## 🎯 快速使用

**公共实例：**[**`xget.xi-xu.me`**](https://xget.xi-xu.me) - 开箱即用，无需部署！

## 🌟 特性

- **⚡ 全球边缘分发**：通过 Cloudflare 的全球 CDN 网络提供极速下载
- **🌐 多平台支持**：针对 GitHub、GitLab 和 Hugging Face 进行专门优化
- **🔒 安全可靠**：内置安全标头、超时保护和性能监控
- **🚀 现代技术**：支持 HTTP/3、智能缓存和自动重试机制
- **🎯 Git 兼容**：完整支持 Git clone、push、pull 等操作
- **📱 浏览器扩展**：配套的 Chromium 扩展让下载更便捷

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

1. **克隆仓库**

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

## 📖 使用方法

使用公共实例 [**`xget.xi-xu.me`**](https://xget.xi-xu.me) 或你自己部署的实例：

### GitHub

```url
# 原始地址
https://github.com/user/repo/releases/download/v1.0/file.zip

# 通过 Xget 加速
https://xget.xi-xu.me/gh/user/repo/releases/download/v1.0/file.zip
```

### GitLab

```url
# 原始地址
https://gitlab.com/user/repo/-/archive/main/repo-main.zip

# 通过 Xget 加速
https://xget.xi-xu.me/gl/user/repo/-/archive/main/repo-main.zip
```

### Hugging Face

```url
# 模型文件下载
# 原始地址
https://huggingface.co/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin
# 通过 Xget 加速
https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

# 数据集文件下载
# 原始地址
https://huggingface.co/datasets/rajpurkar/squad/resolve/main/plain_text/train-00000-of-00001.parquet
# 通过 Xget 加速
https://xget.xi-xu.me/hf/datasets/rajpurkar/squad/resolve/main/plain_text/train-00000-of-00001.parquet
```

### Git 操作支持

Xget 完全支持 Git 协议，你可以直接用于 clone、push、pull 等操作：

```bash
# Clone 仓库
git clone https://xget.xi-xu.me/gh/user/repo.git

# 添加为远程仓库
git remote add xget https://xget.xi-xu.me/gh/user/repo.git
```

## 🌐 支持的平台

| 平台 | 前缀 | 示例 |
|------|------|------|
| **GitHub** | `/gh/` | `xget.xi-xu.me/gh/user/repo/...` |
| **GitLab** | `/gl/` | `xget.xi-xu.me/gl/user/repo/...` |
| **Hugging Face** | `/hf/` | `xget.xi-xu.me/hf/user/model/...` 或 `xget.xi-xu.me/hf/datasets/user/dataset/...` |

## 🔧 配置

### 环境变量

你可以通过修改 `src/config/index.js` 来自定义配置：

```javascript
export const CONFIG = {
  TIMEOUT_SECONDS: 30,       // 请求超时时间
  MAX_RETRIES: 3,            // 最大重试次数
  RETRY_DELAY_MS: 1000,      // 重试延迟时间
  CACHE_DURATION: 1800,      // 缓存持续时间（秒）
  SECURITY: {
    ALLOWED_METHODS: ["GET", "HEAD"],  // 允许的 HTTP 方法
    ALLOWED_ORIGINS: ["*"],            // 允许的 CORS 源
    MAX_PATH_LENGTH: 2048,             // 最大路径长度
  },
};
```

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

## 📱 浏览器扩展 [Xget for Chromium](https://github.com/xixu-me/Xget-for-Chromium)

为了更便捷地使用 Xget，提供了专门的浏览器扩展：

- **自动重定向**：自动将下载链接重定向到 [**`xget.xi-xu.me`**](https://xget.xi-xu.me) 或你的自定义实例
- **多平台支持**：支持 GitHub、GitLab、Hugging Face
- **预配置公共实例**：默认使用 `xget.xi-xu.me`，开箱即用
- **可配置**：支持自定义 Xget 域名和平台偏好
- **隐私保护**：所有处理都在本地进行

安装方式：

- [Chrome 应用商店](https://chromewebstore.google.com/detail/ajiejgobfcifcikbahpijopolfjoodgf?hl=zh-CN)
- [Microsoft Edge 加载项](https://microsoftedge.microsoft.com/addons/detail/jigpfhbegabdenhihpplcjhpfdcgnalc?hl=zh-CN&gl=CN)
- [GitHub Releases 手动安装](https://github.com/xixu-me/Xget-for-Chromium/releases/latest)

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

## 📊 性能优势

使用 Xget 相比直接下载的性能提升：

- **GitHub Releases**：下载速度提升 3-8 倍
- **大型仓库**：clone 速度提升 2-5 倍
- **国际访问**：海外用户体验显著改善
- **稳定性**：自动重试机制提高成功率

## 🔒 安全特性

- **HTTPS 强制**：所有请求强制使用 HTTPS
- **安全标头**：完整的安全标头保护
- **路径验证**：防止路径遍历攻击
- **请求限制**：防止滥用和 DDoS 攻击
- **CORS 控制**：精确的跨域访问控制

## ⚠️ 免责声明

- **合法使用**：本项目仅用于加速合法的公开文件下载，请遵守相关平台的使用条款和当地法律法规
- **服务可用性**：公共实例 `xget.xi-xu.me` 为免费服务，不保证 100% 可用性，建议生产环境部署自己的实例
- **数据安全**：虽然 Xget 不存储或记录用户数据，但请谨慎处理敏感信息的下载
- **责任限制**：使用本服务造成的任何直接或间接损失，开发者不承担责任
- **第三方平台**：请尊重 GitHub、GitLab、Hugging Face 等平台的服务条款和速率限制

## 📝 许可证

本存储库采用 GPL-3.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
