import { describe, expect, it } from 'vitest';
import { PLATFORMS } from '../src/config/platforms.js';

describe('Platform Configuration', () => {
  describe('Platform Definitions', () => {
    it('should have all required platforms defined', () => {
      const requiredPlatforms = ['gh', 'gl', 'hf', 'npm', 'pypi', 'conda'];
      
      requiredPlatforms.forEach(platform => {
        expect(PLATFORMS).toHaveProperty(platform);
        expect(PLATFORMS[platform]).toBeDefined();
      });
    });

    it('should have valid base URLs for all platforms', () => {
      Object.entries(PLATFORMS).forEach(([key, config]) => {
        expect(config.base).toBeDefined();
        expect(config.base).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should have transform functions for all platforms', () => {
      Object.entries(PLATFORMS).forEach(([key, config]) => {
        expect(config.transform).toBeDefined();
        expect(typeof config.transform).toBe('function');
      });
    });
  });

  describe('GitHub Platform', () => {
    it('should transform GitHub paths correctly', () => {
      const transform = PLATFORMS.gh.transform;
      
      expect(transform('/gh/microsoft/vscode/archive/main.zip'))
        .toBe('/microsoft/vscode/archive/main.zip');
      
      expect(transform('/gh/user/repo.git'))
        .toBe('/user/repo.git');
    });

    it('should have correct base URL', () => {
      expect(PLATFORMS.gh.base).toBe('https://github.com');
    });
  });

  describe('GitLab Platform', () => {
    it('should transform GitLab paths correctly', () => {
      const transform = PLATFORMS.gl.transform;
      
      expect(transform('/gl/gitlab-org/gitlab/-/archive/master/gitlab-master.zip'))
        .toBe('/gitlab-org/gitlab/-/archive/master/gitlab-master.zip');
    });

    it('should have correct base URL', () => {
      expect(PLATFORMS.gl.base).toBe('https://gitlab.com');
    });
  });

  describe('Hugging Face Platform', () => {
    it('should transform Hugging Face paths correctly', () => {
      const transform = PLATFORMS.hf.transform;
      
      expect(transform('/hf/microsoft/DialoGPT-medium/resolve/main/config.json'))
        .toBe('/microsoft/DialoGPT-medium/resolve/main/config.json');
      
      expect(transform('/hf/datasets/squad/resolve/main/train.json'))
        .toBe('/datasets/squad/resolve/main/train.json');
    });

    it('should have correct base URL', () => {
      expect(PLATFORMS.hf.base).toBe('https://huggingface.co');
    });
  });

  describe('npm Platform', () => {
    it('should transform npm paths correctly', () => {
      const transform = PLATFORMS.npm.transform;
      
      expect(transform('/npm/react/-/react-18.2.0.tgz'))
        .toBe('/react/-/react-18.2.0.tgz');
      
      expect(transform('/npm/lodash'))
        .toBe('/lodash');
    });

    it('should have correct base URL', () => {
      expect(PLATFORMS.npm.base).toBe('https://registry.npmjs.org');
    });
  });

  describe('PyPI Platform', () => {
    it('should transform PyPI paths correctly', () => {
      const transform = PLATFORMS.pypi.transform;
      
      expect(transform('/pypi/packages/source/r/requests/requests-2.31.0.tar.gz'))
        .toBe('/packages/source/r/requests/requests-2.31.0.tar.gz');
      
      expect(transform('/pypi/simple/requests/'))
        .toBe('/simple/requests/');
    });

    it('should have correct base URL', () => {
      expect(PLATFORMS.pypi.base).toBe('https://pypi.org');
    });
  });

  describe('conda Platform', () => {
    it('should transform conda default channel paths correctly', () => {
      const transform = PLATFORMS.conda.transform;
      
      expect(transform('/conda/pkgs/main/linux-64/numpy-1.24.3.conda'))
        .toBe('/pkgs/main/linux-64/numpy-1.24.3.conda');
    });

    it('should transform conda community channel paths correctly', () => {
      const transform = PLATFORMS.conda.transform;
      
      expect(transform('/conda/community/conda-forge/linux-64/repodata.json'))
        .toBe('/conda-forge/linux-64/repodata.json');
    });

    it('should have correct base URLs', () => {
      expect(PLATFORMS.conda.base).toBe('https://repo.anaconda.com');
      expect(PLATFORMS.conda.communityBase).toBe('https://conda.anaconda.org');
    });
  });

  describe('Path Transformation Edge Cases', () => {
    it('should handle empty paths gracefully', () => {
      Object.entries(PLATFORMS).forEach(([key, config]) => {
        expect(() => config.transform('')).not.toThrow();
      });
    });

    it('should handle paths without platform prefix', () => {
      Object.entries(PLATFORMS).forEach(([key, config]) => {
        const testPath = '/some/random/path';
        expect(() => config.transform(testPath)).not.toThrow();
      });
    });

    it('should handle paths with query parameters', () => {
      const transform = PLATFORMS.gh.transform;
      
      expect(transform('/gh/user/repo/file.txt?ref=main'))
        .toBe('/user/repo/file.txt?ref=main');
    });

    it('should handle paths with fragments', () => {
      const transform = PLATFORMS.gh.transform;
      
      expect(transform('/gh/user/repo/README.md#section'))
        .toBe('/user/repo/README.md#section');
    });
  });

  describe('URL Construction', () => {
    it('should construct valid URLs for all platforms', () => {
      Object.entries(PLATFORMS).forEach(([key, config]) => {
        const testPath = `/${key}/test/path`;
        const transformedPath = config.transform(testPath);
        const fullUrl = config.base + transformedPath;
        
        expect(() => new URL(fullUrl)).not.toThrow();
      });
    });

    it('should handle conda community URLs correctly', () => {
      const config = PLATFORMS.conda;
      const communityPath = '/conda/community/conda-forge/test';
      const transformedPath = config.transform(communityPath);
      const fullUrl = config.communityBase + transformedPath;
      
      expect(() => new URL(fullUrl)).not.toThrow();
      expect(fullUrl).toContain('conda.anaconda.org');
    });
  });
});