import { describe, expect, it } from 'vitest';
import { transformPath } from '../../src/config/platforms.js';

describe('Scoop path transformation', () => {
  it('should handle default bucket repository paths correctly', () => {
    const path = '/scoop/Main.git/info/refs?service=git-upload-pack';
    const result = transformPath(path, 'scoop');
    expect(result).toBe('/Main.git/info/refs?service=git-upload-pack');
  });

  it('should handle bucket manifest paths correctly', () => {
    const path = '/scoop/Main/blob/master/bucket/git.json';
    const result = transformPath(path, 'scoop');
    expect(result).toBe('/Main/blob/master/bucket/git.json');
  });

  it('should handle additional official bucket paths correctly', () => {
    const path = '/scoop/Extras/tree/master/bucket';
    const result = transformPath(path, 'scoop');
    expect(result).toBe('/Extras/tree/master/bucket');
  });

  it('should handle Scoop core repository paths correctly', () => {
    const path = '/scoop/Scoop/archive/refs/heads/master.zip';
    const result = transformPath(path, 'scoop');
    expect(result).toBe('/Scoop/archive/refs/heads/master.zip');
  });
});
