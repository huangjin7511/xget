#!/usr/bin/env node

import { get } from 'node:https';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

const DEFAULT_SOURCE_URL = 'https://raw.gitcode.com/xixu-me/xget/raw/main/src/config/platforms.js';

const DEFAULT_BASE_PLACEHOLDER = 'https://xget.example.com';

const CRATES_API_PREFIX = '/api/v1/crates';

/**
 * @typedef {'resource' | 'registry' | 'inference'} PlatformCategory
 */

/**
 * @typedef {{ key: string, upstream: string, pathPrefix: string, category: PlatformCategory }} PlatformEntry
 */

/**
 * @typedef {{
 *   help?: boolean,
 *   format?: string,
 *   url?: string,
 *   preset?: string,
 *   'source-url'?: string,
 *   'base-url'?: string,
 *   [key: string]: string | boolean | undefined
 * }} CliOptions
 */

/**
 * @typedef {{ command: string, options: CliOptions }} ParsedArgs
 */

/**
 * @typedef {{
 *   preset: string,
 *   summary: string,
 *   commands?: string[],
 *   env?: Record<string, string>,
 *   files?: Record<string, string>,
 *   notes?: string[],
 *   supported?: boolean
 * }} Snippet
 */

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
                            openai, anthropic, gemini. The cargo preset
                            explains the current limitation instead of
                            emitting source replacement config.
  --format json|text

Examples:
  node scripts/xget.mjs platforms --format table
  node scripts/xget.mjs convert --base-url https://xget.example.com --url https://github.com/microsoft/vscode
  node scripts/xget.mjs snippet --base-url https://xget.example.com --preset npm
`);
}

/**
 * @param {string[]} argv
 * @returns {ParsedArgs}
 */
function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  if (command === '--help') {
    return { command: 'help', options: { help: true } };
  }

  /** @type {CliOptions} */
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

/**
 * @param {unknown} error
 * @returns {string}
 */
function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} message
 * @param {number} [code]
 * @returns {never}
 */
function fail(message, code = 1) {
  console.error(`Error: ${message}`);
  process.exit(code);
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
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

/**
 * @param {string} jsSource
 * @returns {Record<string, string>}
 */
export function extractPlatformsModule(jsSource) {
  const match = jsSource.match(/export const PLATFORMS = (\{[\s\S]*?\n\});/);

  if (!match) {
    fail('Could not find `export const PLATFORMS = {...}` in the remote source.');
  }

  try {
    return vm.runInNewContext(`(${match[1]})`);
  } catch (error) {
    fail(`Could not parse remote PLATFORMS object: ${getErrorMessage(error)}`);
  }
}

/**
 * @param {Record<string, string>} platforms
 * @returns {PlatformEntry[]}
 */
export function createPlatformEntries(platforms) {
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

/**
 * @param {string} jsSource
 * @returns {PlatformEntry[]}
 */
export function loadPlatformsFromSource(jsSource) {
  const platforms = extractPlatformsModule(jsSource);
  return createPlatformEntries(platforms);
}

/**
 * @param {string} sourceUrl
 * @returns {Promise<PlatformEntry[]>}
 */
async function loadPlatforms(sourceUrl) {
  const jsSource = await httpGet(sourceUrl);
  return loadPlatformsFromSource(jsSource);
}

/**
 * @param {string | undefined} value
 * @returns {string | null}
 */
function normalizeBaseUrl(value) {
  if (typeof value !== 'string' || !value) {
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

/**
 * @param {string} value
 * @param {string} flagName
 * @returns {URL}
 */
function normalizeAbsoluteUrl(value, flagName) {
  try {
    return new URL(value);
  } catch {
    fail(`Invalid ${flagName} value "${value}". Expected an absolute URL.`);
  }
}

/**
 * @param {string} pathname
 * @returns {string}
 */
function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '';
  }

  return pathname.replace(/\/+$/, '');
}

/**
 * @param {string} pathname
 * @param {string} prefix
 * @param {boolean} [caseInsensitive]
 * @returns {boolean}
 */
function matchesPathPrefix(pathname, prefix, caseInsensitive = false) {
  const normalizedPath = normalizePathname(pathname);
  const normalizedPrefix = normalizePathname(prefix);

  if (!normalizedPrefix) {
    return true;
  }

  if (!normalizedPath) {
    return false;
  }

  if (caseInsensitive) {
    const lowerPath = normalizedPath.toLowerCase();
    const lowerPrefix = normalizedPrefix.toLowerCase();
    return lowerPath === lowerPrefix || lowerPath.startsWith(`${lowerPrefix}/`);
  }

  return normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`);
}

/**
 * @param {string} pathname
 * @param {string} prefix
 * @param {boolean} [caseInsensitive]
 * @returns {string}
 */
function stripPathPrefix(pathname, prefix, caseInsensitive = false) {
  const normalizedPrefix = normalizePathname(prefix);
  if (!normalizedPrefix) {
    return pathname;
  }

  const flags = caseInsensitive ? 'i' : '';
  const escapedPrefix = normalizedPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return pathname.replace(new RegExp(`^${escapedPrefix}(?=/|$)`, flags), '');
}

/**
 * @param {PlatformEntry[]} platforms
 * @param {string} key
 * @returns {PlatformEntry | null}
 */
function findPlatformByKey(platforms, key) {
  return platforms.find(platform => platform.key === key) ?? null;
}

/**
 * @param {PlatformEntry[]} platforms
 * @param {URL} originUrl
 * @returns {PlatformEntry | null}
 */
function findSpecialPlatformForUrl(platforms, originUrl) {
  if (originUrl.hostname === 'ghcr.io') {
    if (originUrl.pathname.startsWith('/v2/homebrew/')) {
      return findPlatformByKey(platforms, 'homebrew-bottles');
    }

    return findPlatformByKey(platforms, 'cr-ghcr');
  }

  return null;
}

/**
 * @param {PlatformEntry[]} platforms
 * @param {URL} originUrl
 * @returns {PlatformEntry | null}
 */
export function findPlatformForUrl(platforms, originUrl) {
  const specialPlatform = findSpecialPlatformForUrl(platforms, originUrl);
  if (specialPlatform) {
    return specialPlatform;
  }

  const matchingPlatforms = platforms
    .filter(platform => {
      const upstreamUrl = new URL(platform.upstream);
      if (upstreamUrl.origin !== originUrl.origin) {
        return false;
      }

      const caseInsensitive = platform.key === 'homebrew' || platform.key === 'homebrew-api';
      return matchesPathPrefix(originUrl.pathname, upstreamUrl.pathname, caseInsensitive);
    })
    .sort((left, right) => {
      const leftPathLength = normalizePathname(new URL(left.upstream).pathname).length;
      const rightPathLength = normalizePathname(new URL(right.upstream).pathname).length;
      return rightPathLength - leftPathLength;
    });

  return matchingPlatforms[0] ?? null;
}

/**
 * @param {PlatformEntry} platform
 * @param {URL} originUrl
 * @returns {string}
 */
export function getConvertedSuffix(platform, originUrl) {
  let pathname = originUrl.pathname;

  if (platform.key === 'homebrew') {
    pathname = stripPathPrefix(pathname, '/Homebrew', true);
  } else if (platform.key === 'homebrew-api') {
    pathname = stripPathPrefix(pathname, '/api', true);
  } else if (platform.key === 'crates') {
    pathname = stripPathPrefix(pathname, CRATES_API_PREFIX, true);
  } else {
    const upstreamPath = new URL(platform.upstream).pathname;
    pathname = stripPathPrefix(pathname, upstreamPath);
  }

  if (!pathname) {
    pathname = '/';
  }

  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  return `${pathname}${originUrl.search}${originUrl.hash}`;
}

/**
 * @param {string} baseUrl
 * @param {PlatformEntry} platform
 * @param {URL} originUrl
 * @returns {string}
 */
export function buildConvertedUrl(baseUrl, platform, originUrl) {
  const suffix = getConvertedSuffix(platform, originUrl);
  return `${baseUrl}${platform.pathPrefix}${suffix.replace(/^\/+/, '')}`;
}

/**
 * @param {string} baseUrl
 * @param {string} preset
 * @returns {Snippet}
 */
export function createSnippet(baseUrl, preset) {
  const host = new URL(baseUrl).host;

  /** @type {Record<string, Snippet>} */
  const snippets = {
    npm: {
      preset,
      summary: 'Configure npm to use the Xget npm registry.',
      commands: [`npm config set registry ${baseUrl}/npm/`, 'npm config get registry']
    },
    pip: {
      preset,
      summary: 'Configure pip to use the Xget PyPI simple index.',
      commands: [`pip config set global.index-url ${baseUrl}/pypi/simple/`, 'pip config list'],
      notes: [
        `Only add "pip config set global.trusted-host ${host}" when the deployment really needs it.`
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
      supported: false,
      summary: 'Cargo registry source replacement is not currently supported by Xget.',
      notes: [
        'Xget can convert direct crates.io HTTP URLs under /crates/..., but it does not expose a Cargo registry index.',
        'Do not generate ~/.cargo/config.toml source replacement entries until Xget provides a registry index endpoint.'
      ]
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

/**
 * @param {unknown} value
 * @returns {void}
 */
function renderJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

/**
 * @param {PlatformEntry[]} rows
 * @returns {void}
 */
function renderTable(rows) {
  /** @type {Array<keyof PlatformEntry>} */
  const headers = ['key', 'category', 'pathPrefix', 'upstream'];
  const widths = headers.map(header =>
    Math.max(header.length, ...rows.map(row => String(row[header]).length))
  );

  /**
   * @param {Record<string, string>} row
   * @returns {string}
   */
  const formatRow = row =>
    headers.map((header, index) => String(row[header]).padEnd(widths[index])).join('  ');

  console.log(formatRow(Object.fromEntries(headers.map(header => [header, header]))));
  console.log(widths.map(width => '-'.repeat(width)).join('  '));
  rows.forEach(row => console.log(formatRow(row)));
}

/**
 * @param {Snippet} snippet
 * @returns {void}
 */
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

  if (snippet.notes) {
    console.log('\nNotes:');
    snippet.notes.forEach(note => console.log(note));
  }
}

/**
 * @param {CliOptions} options
 * @param {string} key
 * @returns {string | undefined}
 */
function getStringOption(options, key) {
  const value = options[key];
  return typeof value === 'string' ? value : undefined;
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (options.help || command === 'help') {
    printHelp();
    return;
  }

  const sourceUrl = getStringOption(options, 'source-url') ?? DEFAULT_SOURCE_URL;
  const format = getStringOption(options, 'format') ?? 'json';

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
      normalizeBaseUrl(getStringOption(options, 'base-url') ?? process.env.XGET_BASE_URL) ??
      fail(`Missing --base-url and XGET_BASE_URL. For docs, use ${DEFAULT_BASE_PLACEHOLDER}.`, 2);

    const rawUrl = getStringOption(options, 'url');
    if (!rawUrl) {
      fail('Missing --url for convert.', 2);
    }

    const originUrl = normalizeAbsoluteUrl(rawUrl, '--url');
    const platforms = await loadPlatforms(sourceUrl);
    const platform = findPlatformForUrl(platforms, originUrl);

    if (!platform) {
      fail(`No current Xget platform matched upstream origin ${originUrl.origin}.`, 3);
    }

    const convertedUrl = buildConvertedUrl(baseUrl, platform, originUrl);
    const payload = {
      sourceUrl,
      baseUrl,
      upstreamUrl: originUrl.toString(),
      matchedPlatform: platform,
      convertedUrl
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
      normalizeBaseUrl(getStringOption(options, 'base-url') ?? process.env.XGET_BASE_URL) ??
      fail(`Missing --base-url and XGET_BASE_URL. For docs, use ${DEFAULT_BASE_PLACEHOLDER}.`, 2);

    const preset = getStringOption(options, 'preset');
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

const entryHref = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (entryHref === import.meta.url) {
  main().catch(error => fail(getErrorMessage(error)));
}
