# Xget

***[汉语](README.md)***

[![Chromium Extension](https://img.shields.io/badge/Chromium%20Extension-4285F4?logo=googlechrome&logoColor=white)](#-ecosystem-integration)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?&logo=cloudflare&logoColor=white)](#cloudflare-workers-one-click-deployment)

[![GitHub](https://img.shields.io/badge/GitHub-181717?&logo=github&logoColor=white)](#github)
[![GitLab](https://img.shields.io/badge/GitLab-FC6D26?&logo=gitlab&logoColor=white)](#gitlab)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?&logo=huggingface&logoColor=white)](#as-hugging-face-mirror)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)](#npm-package-management-acceleration)
[![PyPI](https://img.shields.io/badge/PyPI-3775A9?logo=pypi&logoColor=white)](#python-package-management-acceleration)
[![conda](https://img.shields.io/badge/conda-44A833?logo=anaconda&logoColor=white)](#conda-package-management-acceleration)
[![Container Registry](https://img.shields.io/badge/Container%20Registry-%23007EC6.svg?logo=docker&logoColor=white)](#container-registry)

Ultra-high performance, secure, all-in-one open-source resource acceleration engine. Its performance far exceeds traditional accelerators, providing you with unified and efficient download experience across multiple platforms, covering code repositories, package management, container images, models and datasets.

## 🎯 Quick Start

**Public Instance:** [**`xget.xi-xu.me`**](https://xget.xi-xu.me) - Ready to use, no deployment required!

> **⚡ Experience lightning-fast downloads instantly**: No registration, no configuration required, use directly to experience blazing fast download speeds!

## 🌟 Core Advantages - Why Choose Xget?

### ⚡ Extreme Performance - Breaking Traditional Accelerator Bottlenecks

- **⚡ Millisecond Response**: Cloudflare's global 330+ edge nodes, average response time < 50ms
- **🌐 HTTP/3 Ultra-fast Protocol**: Latest HTTP/3 protocol enabled, 40% reduction in connection latency, 30% improvement in transfer speed
- **📦 Smart Multi-layer Compression**: Triple compression algorithms (gzip, deflate, brotli), 60% improvement in transfer efficiency
- **🔗 Zero-latency Pre-connection**: Connection warm-up and keep-alive, eliminating handshake overhead for instant response
- **⚡ Parallel Chunked Downloads**: Full HTTP Range request support, multi-threaded download speed multiplication
- **🎯 Smart Route Optimization**: Automatic selection of optimal transmission paths, avoiding network congestion nodes

### 🌐 Deep Multi-platform Integration

- **One-stop Multi-platform Support**: Unified support for high-speed downloads from code repositories, package managers, container registries, model and dataset hosting platforms
- **Smart Recognition and Conversion**: Automatic recognition of platform prefixes (gh, gl, hf, npm, pypi, conda, cr) and conversion to correct URL structures for target platforms
- **Consistent Acceleration Experience**: Enjoy unified and stable ultra-fast download service regardless of file type or source

### 🔒 Enterprise-grade Security Assurance

- **Multi-layer Security Headers**:
  - `Strict-Transport-Security`: Force HTTPS transmission, prevent man-in-the-middle attacks
  - `X-Frame-Options: DENY`: Prevent clickjacking attacks
  - `X-XSS-Protection`: Built-in XSS protection mechanism
  - `Content-Security-Policy`: Strict content security policy
  - `Referrer-Policy`: Control referrer information leakage
- **Request Validation Mechanism**:
  - HTTP method whitelist: Regular requests limited to GET/HEAD, Git operations dynamically allow POST
  - Path length limitation: Prevent overly long URL attacks (maximum 2048 characters)
  - Input sanitization: Prevent path traversal and injection attacks
- **Timeout Protection**: 30-second request timeout, prevent resource exhaustion and malicious requests

### 🚀 Modern Architecture and Reliability

- **Smart Retry Mechanism**:
  - Maximum 3 retries with linear delay strategy (1000ms × retry count)
  - Automatic error recovery, improving download success rate
  - Timeout detection and interruption handling
- **Efficient Caching Strategy**:
  - 1800 seconds (30 minutes) default cache duration, significantly reducing origin server pressure
  - Git operations skip cache to ensure real-time performance
  - Edge caching based on Cloudflare Cache API
- **Performance Monitoring System**:
  - Built-in `PerformanceMonitor` class, real-time tracking of request stage timing
  - Detailed performance data provided through `X-Performance-Metrics` response header
  - Support for cache hit rate statistics and optimization suggestions

### 🎯 Full Git Protocol Compatibility

- **Smart Protocol Detection**:
  - Automatic recognition of Git-specific endpoints (`/info/refs`, `/git-upload-pack`, `/git-receive-pack`)
  - Detection of Git client User-Agent patterns
  - Support for query parameters like `service=git-upload-pack`
- **Complete Operation Support**:
  - `git clone`: Full repository cloning, support for shallow cloning and branch specification
  - `git push`: Code pushing and branch management
  - `git pull/fetch`: Incremental updates and remote synchronization
  - `git submodule`: Recursive submodule cloning
- **Protocol Optimization**:
  - Maintain Git-specific request headers and authentication information
  - Smart User-Agent handling (default `git/2.34.1`)
  - Support for Git LFS large file transfer

### 📱 Ecosystem Integration

- **Dedicated Browser Extension**: [Xget for Chromium](https://github.com/xixu-me/Xget-for-Chromium) provides seamless experience
  - Automatic link redirection, no need to manually modify URLs
  - Support for custom Xget instance domains
  - Multi-platform preference settings and blacklist/whitelist management
  - Local processing ensures privacy and security
- **Download Tool Compatibility**: Perfect support for wget, cURL, aria2, IDM and other mainstream download tools
- **CI/CD Integration**: Can be used directly in GitHub Actions, GitLab CI and other environments

## 📖 Link Conversion Rules

Using the public instance [**`xget.xi-xu.me`**](https://xget.xi-xu.me) or your own deployed instance, simply replace the domain and add platform prefix:

### Conversion Format

| Platform | Platform Prefix | Original Link Format | Accelerated Link Format |
|----------|-----------------|---------------------|-------------------------|
| GitHub | `gh` | `https://github.com/...` | `https://xget.xi-xu.me/gh/...` |
| GitLab | `gl` | `https://gitlab.com/...` | `https://xget.xi-xu.me/gl/...` |
| Hugging Face | `hf` | `https://huggingface.co/...` | `https://xget.xi-xu.me/hf/...` |
| npm | `npm` | `https://registry.npmjs.org/...` | `https://xget.xi-xu.me/npm/...` |
| PyPI | `pypi` | `https://pypi.org/...` | `https://xget.xi-xu.me/pypi/...` |
| conda | `conda` | `https://repo.anaconda.com/...` and `https://conda.anaconda.org/...` | `https://xget.xi-xu.me/conda/...` and `https://xget.xi-xu.me/conda/community/...` |
| Container Registry | `cr` | See [Container Registry](#container-registry) | See [Container Registry](#container-registry) |

### Platform Conversion Examples

#### GitHub

```url
# Original link
https://github.com/microsoft/vscode/archive/refs/heads/main.zip

# Converted (add gh prefix)
https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip
```

#### GitLab

```url
# Original link
https://gitlab.com/gitlab-org/gitlab/-/archive/master/gitlab-master.zip

# Converted (add gl prefix)
https://xget.xi-xu.me/gl/gitlab-org/gitlab/-/archive/master/gitlab-master.zip
```

#### Hugging Face

```url
# Model file original link
https://huggingface.co/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

# Converted (add hf prefix)
https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

# Dataset file original link
https://huggingface.co/datasets/rajpurkar/squad/resolve/main/plain_text/train-00000-of-00001.parquet

# Converted (add hf prefix)
https://xget.xi-xu.me/hf/datasets/rajpurkar/squad/resolve/main/plain_text/train-00000-of-00001.parquet
```

#### npm

```url
# Package file original link
https://registry.npmjs.org/react/-/react-18.2.0.tgz

# Converted (add npm prefix)
https://xget.xi-xu.me/npm/react/-/react-18.2.0.tgz

# Package metadata original link
https://registry.npmjs.org/lodash

# Converted (add npm prefix)
https://xget.xi-xu.me/npm/lodash
```

#### PyPI

```url
# Python package file original link
https://pypi.org/packages/source/r/requests/requests-2.31.0.tar.gz

# Converted (add pypi prefix)
https://xget.xi-xu.me/pypi/packages/source/r/requests/requests-2.31.0.tar.gz

# Wheel file original link
https://pypi.org/packages/py3/r/requests/requests-2.31.0-py3-none-any.whl

# Converted (add pypi prefix)
https://xget.xi-xu.me/pypi/packages/py3/r/requests/requests-2.31.0-py3-none-any.whl
```

#### conda

```url
# Default channel package file original link
https://repo.anaconda.com/pkgs/main/linux-64/numpy-1.24.3-py311h08b1b3b_1.conda

# Converted (add conda prefix)
https://xget.xi-xu.me/conda/pkgs/main/linux-64/numpy-1.24.3-py311h08b1b3b_1.conda

# Community channel metadata original link
https://conda.anaconda.org/conda-forge/linux-64/repodata.json

# Converted (add conda/community prefix)
https://xget.xi-xu.me/conda/community/conda-forge/linux-64/repodata.json
```

#### Container Registry

Xget supports multiple container registries using the `cr/[container-registry-prefix]` format:

| Container Registry | Registry Prefix | Original Link Format | Accelerated Link Format |
|-------------------|-----------------|---------------------|-------------------------|
| Quay.io | `quay` | `https://quay.io/...` | `https://xget.xi-xu.me/cr/quay/...` |
| Google | `gcr` | `https://gcr.io/...` | `https://xget.xi-xu.me/cr/gcr/...` |
| Microsoft | `mcr` | `https://mcr.microsoft.com/...` | `https://xget.xi-xu.me/cr/mcr/...` |
| Amazon ECR | `ecr` | `https://public.ecr.aws/...` | `https://xget.xi-xu.me/cr/ecr/...` |
| GitHub | `ghcr` | `https://ghcr.io/...` | `https://xget.xi-xu.me/cr/ghcr/...` |
| GitLab | `gitlab` | `https://registry.gitlab.com/...` | `https://xget.xi-xu.me/cr/gitlab/...` |
| Red Hat | `redhat` | `https://registry.redhat.io/...` | `https://xget.xi-xu.me/cr/redhat/...` |
| Oracle | `oracle` | `https://container-registry.oracle.com/...` | `https://xget.xi-xu.me/cr/oracle/...` |
| Cloudsmith | `cloudsmith` | `https://docker.cloudsmith.io/...` | `https://xget.xi-xu.me/cr/cloudsmith/...` |
| DigitalOcean | `digitalocean` | `https://registry.digitalocean.com/...` | `https://xget.xi-xu.me/cr/digitalocean/...` |
| VMware | `vmware` | `https://projects.registry.vmware.com/...` | `https://xget.xi-xu.me/cr/vmware/...` |
| Kubernetes | `k8s` | `https://registry.k8s.io/...` | `https://xget.xi-xu.me/cr/k8s/...` |
| Heroku | `heroku` | `https://registry.heroku.com/...` | `https://xget.xi-xu.me/cr/heroku/...` |
| SUSE | `suse` | `https://registry.suse.com/...` | `https://xget.xi-xu.me/cr/suse/...` |
| openSUSE | `opensuse` | `https://registry.opensuse.org/...` | `https://xget.xi-xu.me/cr/opensuse/...` |
| Gitpod | `gitpod` | `https://registry.gitpod.io/...` | `https://xget.xi-xu.me/cr/gitpod/...` |

```url
# GitHub Container Registry original link
https://ghcr.io/v2/nginxinc/nginx-unprivileged/manifests/latest

# Converted (add cr/ghcr prefix)
https://xget.xi-xu.me/cr/ghcr/v2/nginxinc/nginx-unprivileged/manifests/latest

# Google Container Registry original link
https://gcr.io/v2/distroless/base/manifests/latest

# Converted (add cr/gcr prefix)
https://xget.xi-xu.me/cr/gcr/v2/distroless/base/manifests/latest
```

## 🎯 Use Cases

### Git Version Control Operations

Xget is fully compatible with Git protocol, supporting all standard Git operations:

```bash
# Clone repository
git clone https://xget.xi-xu.me/gh/microsoft/vscode.git

# Clone specific branch
git clone -b main https://xget.xi-xu.me/gh/facebook/react.git

# Shallow clone (latest commit only)
git clone --depth 1 https://xget.xi-xu.me/gh/torvalds/linux.git

# Add remote repository
git remote add upstream https://xget.xi-xu.me/gh/[owner]/[repository].git

# Pull updates
git pull https://xget.xi-xu.me/gh/microsoft/vscode.git main

# Recursive submodule clone
git clone --recursive https://xget.xi-xu.me/gh/[username]/[repository-with-submodules].git
```

### Mainstream Download Tool Integration

#### wget Downloads

```bash
# Download single file
wget https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip

# Resume download
wget -c https://xget.xi-xu.me/hf/microsoft/DialoGPT-large/resolve/main/pytorch_model.bin

# Batch download
wget -i urls.txt  # urls.txt contains multiple Xget links
```

#### cURL Downloads

```bash
# Basic download
curl -L -O https://xget.xi-xu.me/gh/golang/go/archive/refs/tags/go1.22.0.tar.gz

# Show progress bar
curl -L --progress-bar -o model.bin https://xget.xi-xu.me/hf/openai/whisper-large-v3/resolve/main/pytorch_model.bin

# Set user agent
curl -L -H "User-Agent: MyApp/1.0" https://xget.xi-xu.me/gl/gitlab-org/gitlab-runner/-/archive/main/gitlab-runner-main.zip
```

#### aria2 Multi-threaded Downloads

```bash
# Multi-threaded download of large files
aria2c -x 16 -s 16 https://xget.xi-xu.me/hf/microsoft/DialoGPT-large/resolve/main/pytorch_model.bin

# Resume download
aria2c -c https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip

# Batch download configuration file
aria2c -i download-list.txt  # File containing multiple Xget links
```

### As Hugging Face Mirror

```python
import os
from transformers import AutoTokenizer, AutoModelForCausalLM

# Set environment variable to make transformers library automatically use Xget mirror
os.environ['HF_ENDPOINT'] = 'https://xget.xi-xu.me/hf'

# Define model name
model_name = 'microsoft/DialoGPT-medium'

print(f"Downloading model from mirror: {model_name}")

# Use AutoModelForCausalLM to load dialogue generation model
# Since we set the environment variable above, no additional parameters needed here
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

print("Model and tokenizer loaded successfully!")

# You can now use the tokenizer and model
# For example:
# new_user_input_ids = tokenizer.encode("Hello, how are you?", return_tensors='pt')
# chat_history_ids = model.generate(new_user_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
# print(tokenizer.decode(chat_history_ids[:, new_user_input_ids.shape[-1]:][0], skip_special_tokens=True))
```

### npm Package Management Acceleration

#### Configure npm to use Xget mirror

```bash
# Temporarily use Xget mirror
npm install --registry https://xget.xi-xu.me/npm/

# Globally configure npm mirror
npm config set registry https://xget.xi-xu.me/npm/

# Verify configuration
npm config get registry
```

#### Use in projects

```bash
# Configure project-level mirror in .npmrc file
echo "registry=https://xget.xi-xu.me/npm/" > .npmrc

# Install dependencies
npm install

# Or use yarn
yarn config set registry https://xget.xi-xu.me/npm/
yarn install
```

### Python Package Management Acceleration

#### Configure pip to use Xget mirror

```bash
# Temporarily use Xget mirror
pip install requests -i https://xget.xi-xu.me/pypi/simple/

# Globally configure pip mirror
pip config set global.index-url https://xget.xi-xu.me/pypi/simple/
pip config set global.trusted-host xget.xi-xu.me

# Verify configuration
pip config list
```

#### Use in projects

```bash
# Create pip.conf file (Linux/macOS)
mkdir -p ~/.pip
cat > ~/.pip/pip.conf << EOF
[global]
index-url = https://xget.xi-xu.me/pypi/simple/
trusted-host = xget.xi-xu.me
EOF

# Or create pip.conf in project root directory
cat > pip.conf << EOF
[global]
index-url = https://xget.xi-xu.me/pypi/simple/
trusted-host = xget.xi-xu.me
EOF

# Install using configuration file
pip install -r requirements.txt --config-file pip.conf
```

#### Specify mirror in requirements.txt

```txt
# requirements.txt
--index-url https://xget.xi-xu.me/pypi/simple/
--trusted-host xget.xi-xu.me

requests>=2.25.0
numpy>=1.21.0
pandas>=1.3.0
matplotlib>=3.4.0
```

### conda Package Management Acceleration

#### Configure conda to use Xget mirror

```bash
# Configure default channel mirrors
conda config --add default_channels https://xget.xi-xu.me/conda/pkgs/msys2
conda config --add default_channels https://xget.xi-xu.me/conda/pkgs/r
conda config --add default_channels https://xget.xi-xu.me/conda/pkgs/main

# Configure all community channel mirrors (recommended)
conda config --set channel_alias https://xget.xi-xu.me/conda/community

# Or configure specific community channels
conda config --add channels https://xget.xi-xu.me/conda/community/conda-forge
conda config --add channels https://xget.xi-xu.me/conda/community/bioconda

# Set channel priority
conda config --set channel_priority strict

# Verify configuration
conda config --show
```

#### Configure in .condarc

The .condarc file can be placed in the user home directory (`~/.condarc`) or project root directory:

```yaml
default_channels:
  - https://xget.xi-xu.me/conda/pkgs/main
  - https://xget.xi-xu.me/conda/pkgs/r
  - https://xget.xi-xu.me/conda/pkgs/msys2
channel_alias: https://xget.xi-xu.me/conda/community
channel_priority: strict
show_channel_urls: true
```

#### Use environment files

Environment files can directly specify complete mirror URLs:

```yaml
# environment.yml
name: myproject
channels:
  - https://xget.xi-xu.me/conda/pkgs/main
  - https://xget.xi-xu.me/conda/pkgs/r
  - https://xget.xi-xu.me/conda/community/bioconda
  - https://xget.xi-xu.me/conda/community/conda-forge
dependencies:
  - python=3.11
  - numpy>=1.24.0
  - pandas>=2.0.0
  - matplotlib>=3.7.0
  - scipy>=1.10.0
  - pip
  - pip:
    - requests>=2.28.0
```

```bash
# Create environment using environment file
conda env create -f environment.yml

# Update environment
conda env update -f environment.yml
```

### Container Image Acceleration

Xget provides comprehensive acceleration support for container image pulling, compatible with Docker, Podman, containerd and other container runtimes.

#### Docker Configuration

```bash
# Configure Docker to use Xget image acceleration
# Edit /etc/docker/daemon.json (Linux) or ~/.docker/daemon.json (macOS/Windows)
{
  "registry-mirrors": [
    "https://xget.xi-xu.me/cr/ghcr"
  ]
}

# Restart Docker service
sudo systemctl restart docker  # Linux
# Or restart service in Docker Desktop

# Verify configuration
docker info | grep -A 10 "Registry Mirrors"
```

#### Direct Image Pulling

```bash
# Pull GitHub Container Registry images
docker pull xget.xi-xu.me/cr/ghcr/nginxinc/nginx-unprivileged:latest

# Pull Google Container Registry images
docker pull xget.xi-xu.me/cr/gcr/distroless/base:latest

# Pull Microsoft Container Registry images
docker pull xget.xi-xu.me/cr/mcr/dotnet/runtime:8.0
```

#### Kubernetes Deployment Configuration

```yaml
# deployment.yaml - Using Xget accelerated images
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: xget.xi-xu.me/cr/ghcr/nginxinc/nginx-unprivileged:latest
        ports:
        - containerPort: 80
      - name: redis
        image: xget.xi-xu.me/cr/ghcr/bitnami/redis:alpine
        ports:
        - containerPort: 6379
```

#### Docker Compose Configuration

```yaml
# docker-compose.yml - Using Xget accelerated images
version: '3.8'
services:
  web:
    image: xget.xi-xu.me/cr/ghcr/nginxinc/nginx-unprivileged:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
  
  database:
    image: xget.xi-xu.me/cr/mcr/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: "MyStrongPassword123!"
    volumes:
      - mssql_data:/var/opt/mssql
  
  cache:
    image: xget.xi-xu.me/cr/ghcr/bitnami/redis:alpine
    ports:
      - "6379:6379"

volumes:
  mssql_data:
```

#### Dockerfile Optimization

```dockerfile
# Use Xget accelerated base images in Dockerfile
FROM xget.xi-xu.me/cr/ghcr/nodejs/node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM xget.xi-xu.me/cr/ghcr/nginxinc/nginx-unprivileged:latest
COPY --from=builder /app/dist /usr/share/nginx/html

# Use Microsoft Container Registry .NET images
FROM xget.xi-xu.me/cr/mcr/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=builder /app/publish .
ENTRYPOINT ["dotnet", "MyApp.dll"]
```

#### CI/CD Integration

```yaml
# GitHub Actions - Using Xget accelerated container builds
name: Build and Deploy
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build with accelerated base images
        run: |
          # Build using Xget accelerated base images
          docker build -t myapp:latest \
            --build-arg BASE_IMAGE=xget.xi-xu.me/cr/ghcr/nodejs/node:18-alpine .
          
      - name: Test with accelerated images
        run: |
          # Test using accelerated images
          docker run --rm \
            xget.xi-xu.me/cr/mcr/dotnet/runtime:8.0 \
            dotnet --version
```

#### Podman Configuration

```bash
# Configure Podman to use Xget image acceleration
# Edit /etc/containers/registries.conf
[[registry]]
prefix = "ghcr.io"
location = "xget.xi-xu.me/cr/ghcr"

# Or pull directly
podman pull xget.xi-xu.me/cr/ghcr/alpine/alpine:latest
podman pull xget.xi-xu.me/cr/ghcr/nginxinc/nginx-unprivileged:latest
```

#### containerd Configuration

```toml
# Configure containerd to use Xget acceleration
# Edit /etc/containerd/config.toml
[plugins."io.containerd.grpc.v1.cri".registry.mirrors]
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."ghcr.io"]
    endpoint = ["https://xget.xi-xu.me/cr/ghcr"]
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."gcr.io"]
    endpoint = ["https://xget.xi-xu.me/cr/gcr"]
```

```bash
# Restart containerd
sudo systemctl restart containerd
```

### Development Environment Configuration

#### Configure Git Global Acceleration

```bash
# Configure Git to use Xget for specific domains
git config --global url."https://xget.xi-xu.me/gh/".insteadOf "https://github.com/"
git config --global url."https://xget.xi-xu.me/gl/".insteadOf "https://gitlab.com/"

# Verify configuration
git config --global --get-regexp url

# Now all git clone https://github.com/... will automatically use Xget acceleration
git clone https://github.com/microsoft/vscode.git  # Automatically converted to Xget link
```

#### IDE Integration

```bash
# Configure Git to use Xget in VS Code
# Add to settings.json:
{
  "git.defaultCloneDirectory": "~/Projects",
  "terminal.integrated.env.linux": {
    "GIT_CONFIG_GLOBAL": "~/.gitconfig-xget"
  }
}

# Create dedicated Git configuration file
echo '[url "https://xget.xi-xu.me/gh/"]' > ~/.gitconfig-xget
echo '    insteadOf = https://github.com/' >> ~/.gitconfig-xget
```

### CI/CD Environment Integration

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
          # Use Xget to accelerate large model file downloads
          wget https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin
          
      - name: Clone dependency repo
        run: |
          # Use Xget to accelerate Git cloning
          git clone https://xget.xi-xu.me/gh/[owner]/[repository].git
          
      - name: Download release assets
        run: |
          # Batch download release files
          curl -L -O https://xget.xi-xu.me/gh/[owner]/[repository]/releases/download/v1.0.0/[filename].tar.gz
          curl -L -O https://xget.xi-xu.me/gh/[owner]/[repository]/releases/download/v1.0.0/[filename].zip
```

#### GitLab CI

```yaml
stages:
  - download
  - build

download_dependencies:
  stage: download
  script:
    # Use Xget acceleration for downloads
    - wget https://xget.xi-xu.me/gl/gitlab-org/gitlab-runner/-/archive/main/gitlab-runner-main.zip
    - git clone https://xget.xi-xu.me/gh/[owner]/[dependency-repository].git
    # Download Hugging Face datasets
    - curl -L -O https://xget.xi-xu.me/hf/datasets/wikitext/resolve/main/wikitext-103-v1/wiki.train.tokens
  artifacts:
    paths:
      - "*.zip"
      - "*.json"
      - dependency/
```

#### Docker Build Optimization

```dockerfile
FROM ubuntu:22.04

# Use Xget acceleration for downloads in Docker builds
RUN apt-get update && apt-get install -y wget curl git

# Download large files
RUN wget https://xget.xi-xu.me/gh/microsoft/vscode/archive/refs/heads/main.zip

# Clone source code
RUN git clone https://xget.xi-xu.me/gh/[owner]/[source-repository].git /app

# Download model files
RUN curl -L -O /models/model.bin https://xget.xi-xu.me/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin

# Configure and install conda packages
RUN echo "default_channels:" > ~/.condarc && \
    echo "  - https://xget.xi-xu.me/conda/pkgs/main" >> ~/.condarc && \
    echo "  - https://xget.xi-xu.me/conda/pkgs/r" >> ~/.condarc && \
    echo "  - https://xget.xi-xu.me/conda/pkgs/msys2" >> ~/.condarc && \
    echo "channel_alias: https://xget.xi-xu.me/conda/community" >> ~/.condarc && \
    echo "channel_priority: strict" >> ~/.condarc && \
    conda install -y numpy pandas matplotlib

WORKDIR /app
```

## 🚀 Deployment Options

### Cloudflare Workers One-Click Deployment

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xixu-me/Xget)

After deployment, your Xget service will be available at `your-worker-name.your-subdomain.workers.dev`.

### Manual Deployment

If you prefer manual deployment or need custom configuration:

#### Prerequisites

1. Register a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages)
2. Install [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### Deployment Steps

1. **Clone Repository**

   ```bash
   git clone https://github.com/xixu-me/Xget.git
   cd Xget
   ```

2. **Install Dependencies and Authenticate**

   ```bash
   npm install
   npx wrangler auth login
   ```

3. **Custom Configuration (Optional)**

   Edit the `wrangler.toml` file to set your repository name:

   ```toml
   name = "your-xget-project-name"
   ```

4. **Deploy**

   ```bash
   npm run deploy
   ```

After deployment, your Xget service will be available at `your-worker-name.your-subdomain.workers.dev`.

## 🔧 Configuration

### Configuration Parameters

You can customize configuration by modifying `src/config/index.js`:

```javascript
export const CONFIG = {
  TIMEOUT_SECONDS: 30,       // Request timeout (seconds)
  MAX_RETRIES: 3,            // Maximum retry attempts
  RETRY_DELAY_MS: 1000,      // Retry delay (milliseconds)
  CACHE_DURATION: 1800,      // Cache duration (1800 seconds = 30 minutes)
  SECURITY: {
    ALLOWED_METHODS: ["GET", "HEAD"],  // Allowed HTTP methods (Git operations dynamically allow POST)
    ALLOWED_ORIGINS: ["*"],            // Allowed CORS origins
    MAX_PATH_LENGTH: 2048,             // Maximum path length (characters)
  },
};
```

### Performance Tuning Recommendations

- **Cache Optimization**: Adjust `CACHE_DURATION` based on usage patterns, reduce for frequently updated repositories
- **Timeout Settings**: Increase `TIMEOUT_SECONDS` appropriately for poor network conditions
- **Retry Strategy**: Increase `MAX_RETRIES` and `RETRY_DELAY_MS` for high-latency environments

### Adding New Platforms

To add support for new platforms, edit `src/config/platforms.js`:

```javascript
export const PLATFORMS = {
  // Existing platforms...
  
  // New platform example
  custom: {
    base: "https://example.com",
    transform: (path) => path.replace(/^\/custom\//, "/"),
  },
};
```

## 🚧 Development

1. **Repository Setup**

   ```bash
   git clone https://github.com/xixu-me/Xget.git
   cd Xget
   npm install
   npx wrangler auth login  # First time use
   ```

2. **Local Development**

   ```bash
   npm run dev              # Start development server (http://localhost:8787)
   npm run test:run         # Run complete test suite
   npm run test:coverage    # Generate test coverage report
   npm run lint             # Code linting
   npm run format           # Code formatting
   npm run deploy           # Deploy to production
   ```

## 🧪 Testing

The repository includes a comprehensive test suite to ensure code quality and functionality.

### Complete Testing

```bash
# Install test dependencies
npm install

# Run all tests
npm run test:run

# Generate coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

- **Unit Tests**: Core functionality, platform configuration, performance monitoring
- **Integration Tests**: End-to-end processes, platform integration, Git protocol
- **Security Tests**: Input validation, security headers, permission control
- **Performance Tests**: Response time, memory usage, concurrent processing

## 🔍 Troubleshooting

### Common Issues

**Q: Download speed not significantly improved?**  
A: Check if source files are already cached on CDN edge nodes. First access may be slower, subsequent accesses will be significantly faster.

**Q: Git operations failing?**  
A: Confirm correct URL format is used and Git client version supports HTTPS proxy.

**Q: Cannot access after deployment?**  
A: Check if Cloudflare Workers domain is correctly bound, confirm `wrangler.toml` configuration is correct.

**Q: Getting 400 errors?**  
A: Check URL path format, confirm platform prefix is used correctly.

### Performance Monitoring

The service returns performance metrics in response headers:

- `X-Performance-Metrics`: Contains detailed timing statistics for request stages
- `X-Cache-Status`: Shows cache hit status

### Debug Logging

In development environment, you can view detailed logs through Cloudflare Workers console:

```bash
npx wrangler dev --log-level debug
```

## ⚠️ Disclaimer

- **Legal Use**: This repository is only for accelerating legal public file downloads and Git operations. Please comply with relevant platform terms of service and local laws and regulations
- **Service Availability**: Public instance `xget.xi-xu.me` is a free service with no guarantee of 100% availability. Production environments should deploy their own instances
- **Data Security**: Although Xget does not store or log user data, please handle sensitive information downloads carefully
- **Liability Limitation**: Developers are not responsible for any direct or indirect losses caused by using this service
- **Third-party Platforms**: Please respect the terms of service and rate limits of platforms like GitHub, GitLab, Hugging Face, etc.

## 🤝 Contributing

We welcome all forms of contributions! Please check the [Contributing Guide](CONTRIBUTING.md) to learn how to participate in repository development.

1. **Report Issues**: Use [issue templates](https://github.com/xixu-me/Xget/issues/new/choose) to report bugs or request features
2. **Submit Code**: Fork repository, create feature branch, submit pull request
3. **Improve Documentation**: Fix errors, add examples, improve descriptions
4. **Test Feedback**: Test in different environments and provide feedback

## 🌟 Star History

<a href="https://www.star-history.com/#xixu-me/Xget&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=xixu-me/Xget&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=xixu-me/Xget&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=xixu-me/Xget&type=Date" />
 </picture>
</a>

## 📞 Contact

- **Author**: [Xi Xu](https://xi-xu.me)
- **Email**: [Contact Email](mailto:i@xi-xu.me)
- **Sponsor**: [Sponsor Link](https://xi-xu.me/#sponsorships)

## 📝 License

This repository is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**If this repository helps you, please consider giving it a ⭐ star!**

Made with ❤️ by [Xi Xu](https://xi-xu.me)

</div>
