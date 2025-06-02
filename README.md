# Xget

A high-performance, secure proxy service for accelerating downloads from popular platforms like GitHub, GitLab, Hugging Face, and Kaggle.

🌐 [https://Xget.xi-xu.me](https://xget.xi-xu.me)

## Features

- **Multi-Platform Support**: Seamlessly handles downloads from:
  - GitHub (`/gh/...`)
  - GitLab (`/gl/...`)
  - Hugging Face (`/hf/...`)
  - Kaggle (`/kg/...`)

- **Performance Optimizations**:
  - Intelligent caching with 30-minute TTL
  - HTTP/3 support
  - Automatic retries with exponential backoff
  - Content compression (gzip, deflate, brotli)
  - Resource preconnection
  - Content minification for JS, CSS, and HTML

- **Security Features**:
  - Strict security headers
  - Content Security Policy (CSP)
  - HSTS preloading
  - XSS protection
  - Frame protection
  - Referrer policy enforcement
  - Permissions policy controls

- **Reliability**:
  - Automatic request retries (up to 3 attempts)
  - Request timeout protection
  - Range request support
  - Detailed performance monitoring

## Usage

Simply prefix your download URL with `https://xget.xi-xu.me/<platform>/`, where `<platform>` is one of:

- `gh` for GitHub
- `gl` for GitLab
- `hf` for Hugging Face
- `kg` for Kaggle

### Examples

```bash
# GitHub download
https://xget.xi-xu.me/gh/username/repository/archive/main.zip

# GitLab download
https://xget.xi-xu.me/gl/username/repository/-/archive/main.zip

# Hugging Face download
https://xget.xi-xu.me/hf/username/model/resolve/main/model.bin

# Kaggle download
https://xget.xi-xu.me/kg/username/dataset/data
```

## Technical Details

- Built on Cloudflare Workers for global edge distribution
- Implements intelligent retry mechanisms with configurable delays
- Comprehensive error handling and logging
- Performance metrics tracking for monitoring and optimization

## Deployment

Just click [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget).

## Status

[![Deploy to Cloudflare Workers](https://github.com/xixu-me/xget/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg)](https://github.com/xixu-me/Xget/actions/workflows/deploy.yml)

## License

Copyright &copy; [Xi Xu](https://xi-xu.me). All rights reserved.

Licensed under the [GPL-3.0](LICENSE) license.  
