import { describe, expect, it } from 'vitest';

import { PLATFORMS } from '../../src/config/platforms.js';
import {
  buildConvertedUrl,
  createPlatformEntries,
  createSnippet,
  findPlatformForUrl
} from '../../skills/xget/scripts/xget.mjs';

const BASE_URL = 'https://xget.example.com';
const platforms = createPlatformEntries(PLATFORMS);

/**
 * Convert an upstream URL with the xget skill helpers.
 * @param {string} url
 * @returns {{ platform: { key: string } | null, convertedUrl: string | null }} Converted result.
 */
function convert(url) {
  const upstreamUrl = new URL(url);
  const platform = findPlatformForUrl(platforms, upstreamUrl);

  return {
    platform,
    convertedUrl: platform ? buildConvertedUrl(BASE_URL, platform, upstreamUrl) : null
  };
}

describe('xget skill helpers', () => {
  describe('URL conversion', () => {
    it('converts Homebrew repository URLs to the homebrew prefix', () => {
      const result = convert('https://github.com/Homebrew/homebrew-core/raw/HEAD/Formula/g/git.rb');

      expect(result.platform?.key).toBe('homebrew');
      expect(result.convertedUrl).toBe(
        'https://xget.example.com/homebrew/homebrew-core/raw/HEAD/Formula/g/git.rb'
      );
    });

    it('converts Homebrew API URLs to the homebrew/api prefix', () => {
      const result = convert('https://formulae.brew.sh/api/formula/git.json');

      expect(result.platform?.key).toBe('homebrew-api');
      expect(result.convertedUrl).toBe('https://xget.example.com/homebrew/api/formula/git.json');
    });

    it('routes Homebrew bottle URLs to homebrew/bottles instead of cr/ghcr', () => {
      const result = convert('https://ghcr.io/v2/homebrew/core/git/manifests/2.39.0');

      expect(result.platform?.key).toBe('homebrew-bottles');
      expect(result.convertedUrl).toBe(
        'https://xget.example.com/homebrew/bottles/v2/homebrew/core/git/manifests/2.39.0'
      );
    });

    it('normalizes crates.io API URLs to the documented /crates path shape', () => {
      const result = convert('https://crates.io/api/v1/crates/serde/1.0.0/download');

      expect(result.platform?.key).toBe('crates');
      expect(result.convertedUrl).toBe('https://xget.example.com/crates/serde/1.0.0/download');
    });
  });

  describe('snippets', () => {
    it('omits trusted-host from the default pip preset', () => {
      const snippet = createSnippet(BASE_URL, 'pip');

      expect(snippet.commands).toEqual([
        'pip config set global.index-url https://xget.example.com/pypi/simple/',
        'pip config list'
      ]);
      expect(snippet.notes).toContain(
        'Only add "pip config set global.trusted-host xget.example.com" when the deployment really needs it.'
      );
    });

    it('returns an explicit unsupported notice for cargo instead of a broken config file', () => {
      const snippet = createSnippet(BASE_URL, 'cargo');

      expect(snippet.supported).toBe(false);
      expect(snippet.files).toBeUndefined();
      expect(snippet.notes).toContain(
        'Do not generate ~/.cargo/config.toml source replacement entries until Xget provides a registry index endpoint.'
      );
    });
  });
});
