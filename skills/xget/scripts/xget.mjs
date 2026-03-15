#!/usr/bin/env node

import { get } from 'node:https';
import process from 'node:process';
import vm from 'node:vm';

const DEFAULT_SOURCE_URL = 'https://raw.gitcode.com/xixu-me/xget/raw/main/src/config/platforms.js';

const DEFAULT_BASE_PLACEHOLDER = 'https://xget.example.com';

function printHelp() {
  console.log(`Usage: node scripts/xget.mjs <command> [options]

Commands:
  platforms                 Fetch the live Xget platform map.
  convert                   Convert an upstream URL to an Xget URL.
  snippet                   Emit a config snippet preset.
  help                      Show this message.

Global options:
  --source-url URL          Override the remote platforms.js URL.
  --format FORMAT           json (default), text, or table when supported.
  --help                    Show command help.

platforms options:
  --format json|table

convert options:
  --base-url URL            Xget base URL. Defaults to XGET_BASE_URL.
  --url URL                 Upstream URL to convert.
  --format json|text

snippet options:
  --base-url URL            Xget base URL. Defaults to XGET_BASE_URL.
  --preset NAME             One of: npm, pip, go, nuget, cargo, docker-ghcr,
                            openai, anthropic, gemini.
  --format json|text

Examples:
  node scripts/xget.mjs platforms --format table
  node scripts/xget.mjs convert --base-url https://xget.example.com --url https://github.com/microsoft/vscode
  node scripts/xget.mjs snippet --base-url https://xget.example.com --preset npm
`);
}

function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  if (command === '--help') {
    return { command: 'help', options: { help: true } };
  }

  const options = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith('--')) {
      fail(`Unexpected argument "${token}". Use --help for supported options.`, 2);
    }

    const key = token.slice(2);
    if (key === 'help') {
      options.help = true;
      continue;
    }

    const value = rest[index + 1];
    if (!value || value.startsWith('--')) {
      fail(`Missing value for --${key}.`, 2);
    }

    options[key] = value;
    index += 1;
  }

  return { command, options };
}

function fail(message, code = 1) {
  console.error(`Error: ${message}`);
  process.exit(code);
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    get(url, response => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        resolve(httpGet(response.headers.location));
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Unexpected HTTP status ${response.statusCode} for ${url}`));
        response.resume();
        return;
      }

      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
      });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function extractPlatformsModule(jsSource) {
  const match = jsSource.match(/export const PLATFORMS = (\{[\s\S]*?\n\});/);

  if (!match) {
    fail('Could not find `export const PLATFORMS = {...}` in the remote source.');
  }

  try {
    return vm.runInNewContext(`(${match[1]})`);
  } catch (error) {
    fail(`Could not parse remote PLATFORMS object: ${error.message}`);
  }
}

async function loadPlatforms(sourceUrl) {
  const jsSource = await httpGet(sourceUrl);
  const platforms = extractPlatformsModule(jsSource);
  return Object.entries(platforms)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, upstream]) => ({
      key,
      upstream,
      pathPrefix: `/${key.replace(/-/g, '/')}/`,
      category: key.startsWith('ip-')
        ? 'inference'
        : key.startsWith('cr-')
          ? 'registry'
          : 'resource'
    }));
}

function normalizeBaseUrl(value) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/+$/, '');
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    fail(`Invalid --base-url value "${value}". Expected an absolute URL.`);
  }
}

function normalizeAbsoluteUrl(value, flagName) {
  try {
    return new URL(value);
  } catch {
    fail(`Invalid ${flagName} value "${value}". Expected an absolute URL.`);
  }
}

function findPlatformForUrl(platforms, originUrl) {
  const origin = originUrl.origin;
  return platforms.find(({ upstream }) => upstream === origin) ?? null;
}

function buildConvertedUrl(baseUrl, platform, originUrl) {
  const suffix = originUrl.pathname + originUrl.search + originUrl.hash;
  return `${baseUrl}${platform.pathPrefix}${suffix.replace(/^\/+/, '')}`;
}

function createSnippet(baseUrl, preset) {
  const host = new URL(baseUrl).host;

  const snippets = {
    npm: {
      preset,
      summary: 'Configure npm to use the Xget npm registry.',
      commands: [`npm config set registry ${baseUrl}/npm/`, 'npm config get registry']
    },
    pip: {
      preset,
      summary: 'Configure pip to use the Xget PyPI simple index.',
      commands: [
        `pip config set global.index-url ${baseUrl}/pypi/simple/`,
        `pip config set global.trusted-host ${host}`,
        'pip config list'
      ]
    },
    go: {
      preset,
      summary: 'Configure Go modules to use Xget as GOPROXY.',
      commands: [`go env -w GOPROXY=${baseUrl}/golang,direct`]
    },
    nuget: {
      preset,
      summary: 'Add Xget as a NuGet v3 source.',
      commands: [
        `dotnet nuget add source ${baseUrl}/nuget/v3/index.json -n xget`,
        'dotnet nuget list source'
      ]
    },
    cargo: {
      preset,
      summary: 'Route crates.io traffic through Xget.',
      files: {
        '~/.cargo/config.toml': [
          '[source.crates-io]',
          'replace-with = "xget"',
          '',
          '[source.xget]',
          `registry = "${baseUrl}/crates/"`
        ].join('\n')
      }
    },
    'docker-ghcr': {
      preset,
      summary: 'Pull GHCR images through Xget.',
      commands: [`docker pull ${new URL(baseUrl).host}/cr/ghcr/nginxinc/nginx-unprivileged:latest`]
    },
    openai: {
      preset,
      summary: 'Point OpenAI SDKs at Xget.',
      env: {
        OPENAI_BASE_URL: `${baseUrl}/ip/openai`
      }
    },
    anthropic: {
      preset,
      summary: 'Point Anthropic SDKs at Xget.',
      env: {
        ANTHROPIC_BASE_URL: `${baseUrl}/ip/anthropic`
      }
    },
    gemini: {
      preset,
      summary: 'Point Gemini SDKs at Xget.',
      env: {
        GEMINI_BASE_URL: `${baseUrl}/ip/gemini`
      }
    }
  };

  const result = snippets[preset];
  if (!result) {
    fail(
      `Unknown --preset "${preset}". Supported presets: ${Object.keys(snippets).join(', ')}.`,
      2
    );
  }

  return result;
}

function renderJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function renderTable(rows) {
  const headers = ['key', 'category', 'pathPrefix', 'upstream'];
  const widths = headers.map(header =>
    Math.max(header.length, ...rows.map(row => String(row[header]).length))
  );

  const formatRow = row =>
    headers.map((header, index) => String(row[header]).padEnd(widths[index])).join('  ');

  console.log(formatRow(Object.fromEntries(headers.map(header => [header, header]))));
  console.log(widths.map(width => '-'.repeat(width)).join('  '));
  rows.forEach(row => console.log(formatRow(row)));
}

function renderTextSnippet(snippet) {
  console.log(snippet.summary);

  if (snippet.commands) {
    console.log('\nCommands:');
    snippet.commands.forEach(command => console.log(command));
  }

  if (snippet.env) {
    console.log('\nEnvironment:');
    Object.entries(snippet.env).forEach(([key, value]) => console.log(`${key}=${value}`));
  }

  if (snippet.files) {
    console.log('\nFiles:');
    Object.entries(snippet.files).forEach(([file, content]) => {
      console.log(`[${file}]`);
      console.log(content);
    });
  }
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (options.help || command === 'help') {
    printHelp();
    return;
  }

  const sourceUrl = options['source-url'] ?? DEFAULT_SOURCE_URL;
  const format = options.format ?? 'json';

  if (command === 'platforms') {
    const platforms = await loadPlatforms(sourceUrl);
    if (format === 'json') {
      renderJson({
        sourceUrl,
        count: platforms.length,
        platforms
      });
      return;
    }

    if (format === 'table') {
      renderTable(platforms);
      return;
    }

    fail('Unsupported --format for platforms. Use json or table.', 2);
  }

  if (command === 'convert') {
    const baseUrl =
      normalizeBaseUrl(options['base-url'] ?? process.env.XGET_BASE_URL) ??
      fail(`Missing --base-url and XGET_BASE_URL. For docs, use ${DEFAULT_BASE_PLACEHOLDER}.`, 2);

    const rawUrl = options.url;
    if (!rawUrl) {
      fail('Missing --url for convert.', 2);
    }

    const originUrl = normalizeAbsoluteUrl(rawUrl, '--url');
    const platforms = await loadPlatforms(sourceUrl);
    const platform = findPlatformForUrl(platforms, originUrl);

    if (!platform) {
      fail(`No current Xget platform matched upstream origin ${originUrl.origin}.`, 3);
    }

    const payload = {
      sourceUrl,
      baseUrl,
      upstreamUrl: originUrl.toString(),
      matchedPlatform: platform,
      convertedUrl: buildConvertedUrl(baseUrl, platform, originUrl)
    };

    if (format === 'json') {
      renderJson(payload);
      return;
    }

    if (format === 'text') {
      console.log(payload.convertedUrl);
      return;
    }

    fail('Unsupported --format for convert. Use json or text.', 2);
  }

  if (command === 'snippet') {
    const baseUrl =
      normalizeBaseUrl(options['base-url'] ?? process.env.XGET_BASE_URL) ??
      fail(`Missing --base-url and XGET_BASE_URL. For docs, use ${DEFAULT_BASE_PLACEHOLDER}.`, 2);

    const preset = options.preset;
    if (!preset) {
      fail('Missing --preset for snippet.', 2);
    }

    const snippet = createSnippet(baseUrl, preset);
    if (format === 'json') {
      renderJson(snippet);
      return;
    }

    if (format === 'text') {
      renderTextSnippet(snippet);
      return;
    }

    fail('Unsupported --format for snippet. Use json or text.', 2);
  }

  fail(`Unknown command "${command}". Use --help for supported commands.`, 2);
}

main().catch(error => fail(error.message));
