---
name: xget
description:
  Convert upstream resource URLs and package manager, container registry, or AI
  SDK settings to Xget, explain Xget platform prefixes, and help deploy or use a
  self-hosted Xget instance. Use this skill when a task involves Xget URL
  rewriting, registry acceleration, proxy base URLs, self-hosting, or choosing
  the correct Xget prefix for Git, packages, OCI images, or inference APIs.
  Prefer the user's own Xget domain; treat the public demo as a last-resort
  fallback.
license: GPL-3.0-or-later
compatibility:
  Requires network access to refresh the live platform map. Optional Node.js 18+
  lets the bundled script run. Designed to work as a standalone skill directory
  installed at /xget.
allowed-tools: Bash(node:*) Bash(curl:*) Read
---

# Xget

Use this skill for Xget-specific tasks only. Default to the user's self-hosted
Xget domain or an explicit internal instance. Do not default to
`https://xget.xi-xu.me` unless the user explicitly wants the public demo or no
self-hosted option exists.

## Defaults

1. Resolve the base URL in this order:
   - the user explicitly gives a domain
   - `XGET_BASE_URL` from the environment
   - `https://xget.example.com` as a placeholder for docs or templates
   - `https://xget.xi-xu.me` only as an explicitly labeled fallback
2. Keep platform data fresh. Do not hardcode the full prefix list from memory.
   Run:

```bash
node scripts/xget.mjs platforms --format json
```

3. For URL conversion or prefix detection, prefer the script over manual
   guessing:

```bash
node scripts/xget.mjs convert --base-url https://xget.example.com --url https://github.com/microsoft/vscode
```

## Workflow

1. Identify the user's goal:
   - convert one or more upstream URLs
   - generate config snippets for npm, pip, Go, NuGet, Cargo, Docker, or AI SDKs
   - explain which Xget prefix to use
   - propose or document a self-hosted deployment
2. Refresh the live platform map with `scripts/xget.mjs` if the answer depends
   on current prefixes.
3. Use the user's self-hosted domain in every generated example when possible.
4. If the user needs deployment or configuration details, read
   [the reference guide](references/REFERENCE.md).
5. Before finishing, sanity-check that every example uses the right Xget path
   shape:
   - repo/content: `/{prefix}/...`
   - inference APIs: `/ip/{provider}/...`
   - OCI registries: `/cr/{registry}/...`

## Common tasks

### Convert URLs

```bash
node scripts/xget.mjs convert --base-url https://xget.example.com --url https://github.com/microsoft/vscode --format json
```

### Emit config snippets

```bash
node scripts/xget.mjs snippet --base-url https://xget.example.com --preset npm
node scripts/xget.mjs snippet --base-url https://xget.example.com --preset pip
node scripts/xget.mjs snippet --base-url https://xget.example.com --preset openai
```

### List current platforms

```bash
node scripts/xget.mjs platforms --format table
```

## Edge cases

- If the live platform fetch fails, say that the platform map could not be
  refreshed and fall back to the common patterns in
  [references/REFERENCE.md](references/REFERENCE.md).
- If an upstream URL does not match any known platform, do not invent a prefix.
  Report that no current Xget mapping was found.
- When writing pip config for HTTPS domains, keep `trusted-host` aligned with
  the actual host only if the user really needs it.
- When generating docs or templates without a real domain, prefer
  `https://xget.example.com` over the public demo.
