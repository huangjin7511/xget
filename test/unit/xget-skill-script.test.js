import { describe, expect, it } from 'vitest';

import {
  createPlatformEntries,
  extractPlatformsModule,
  loadPlatformsFromSource
} from '../../skills/xget/scripts/xget.mjs';

describe('xget skill script', () => {
  it('extracts platform data from the new platform catalog source', () => {
    const source = `export const PLATFORM_CATALOG = {
  gh: 'https://github.com',
  'cr-ghcr': 'https://ghcr.io'
};

export const PLATFORMS = PLATFORM_CATALOG;
`;

    expect(extractPlatformsModule(source)).toEqual({
      gh: 'https://github.com',
      'cr-ghcr': 'https://ghcr.io'
    });
  });

  it('still accepts the legacy PLATFORMS object source', () => {
    const source = `export const PLATFORMS = {
  npm: 'https://registry.npmjs.org'
};
`;

    expect(extractPlatformsModule(source)).toEqual({
      npm: 'https://registry.npmjs.org'
    });
  });

  it('loads categorized platform entries from the extracted source', () => {
    const entries = loadPlatformsFromSource(`export const PLATFORM_CATALOG = {
  gh: 'https://github.com',
  'ip-openai': 'https://api.openai.com',
  'cr-ghcr': 'https://ghcr.io'
};
`);

    expect(entries).toEqual(
      createPlatformEntries({
        gh: 'https://github.com',
        'ip-openai': 'https://api.openai.com',
        'cr-ghcr': 'https://ghcr.io'
      })
    );
  });
});
