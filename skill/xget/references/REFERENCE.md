# Xget Reference

## Self-hosted first

Use these defaults in order:

1. User-provided Xget base URL
2. `XGET_BASE_URL` from the environment
3. `https://xget.example.com` for templates and docs
4. `https://xget.xi-xu.me` only as a clearly labeled public-demo fallback

The Xget README explicitly labels `xget.xi-xu.me` as a pre-deployed instance with no reliability guarantee, while the self-hosting docs and DigitalOcean guide show recommended self-hosted domains such as `xget.example.com`.

## Live platform source

The authoritative platform list for this skill comes from:

`https://raw.gitcode.com/xixu-me/xget/raw/main/src/config/platforms.js`

Fetch it with:

```bash
node scripts/xget.mjs platforms --format json
```

The script derives these path shapes from platform keys:

- plain keys like `gh` become `/gh/...`
- `ip-openai` becomes `/ip/openai/...`
- `cr-ghcr` becomes `/cr/ghcr/...`

## Common Xget patterns

### Source code and file downloads

- GitHub: `https://{base}/gh/...`
- GitHub Gist: `https://{base}/gist/...`
- GitLab: `https://{base}/gl/...`
- Hugging Face: `https://{base}/hf/...`

### Package managers

- npm registry: `https://{base}/npm/`
- pip simple index: `https://{base}/pypi/simple/`
- Go proxy: `https://{base}/golang`
- NuGet v3 index: `https://{base}/nuget/v3/index.json`
- Cargo registry: `https://{base}/crates/`

### Container registries

- Docker Hub: `https://{base}/cr/docker/...`
- GHCR: `https://{base}/cr/ghcr/...`
- GCR: `https://{base}/cr/gcr/...`
- MCR: `https://{base}/cr/mcr/...`

### Inference APIs

- OpenAI: `https://{base}/ip/openai`
- Anthropic: `https://{base}/ip/anthropic`
- Gemini: `https://{base}/ip/gemini`

## Common snippets

Generate the latest snippets with:

```bash
node scripts/xget.mjs snippet --base-url https://xget.example.com --preset npm
```

Representative presets:

- `npm`
- `pip`
- `go`
- `nuget`
- `cargo`
- `docker-ghcr`
- `openai`
- `anthropic`
- `gemini`

## Deployment defaults

For self-hosting guidance, prefer one of these paths:

1. Docker / Docker Compose with `ghcr.io/xixu-me/xget:latest`
2. Cloudflare Workers with a bound custom domain
3. Managed hosting with a custom domain in front

Representative Docker Compose service:

```yaml
services:
  xget:
    image: ghcr.io/xixu-me/xget:latest
    container_name: xget
    ports:
      - "127.0.0.1:8080:8080"
    restart: unless-stopped
```

Representative reverse-proxy outcome:

- Public HTTPS domain such as `https://xget.example.com`
- Xget container bound privately to `127.0.0.1:8080`

## Troubleshooting heuristics

- `404` on converted URLs often means the wrong prefix or an unmatched upstream platform.
- pip issues often come from mixing the right `index-url` with the wrong host in `trusted-host`.
- Docker examples must use `/cr/{registry}` prefixes, not plain `/{prefix}`.
- AI SDK examples usually need the Xget base URL changed but keep the original API key behavior.
- If the user asks for the “latest” supported platform, refresh the live platform map before answering.
