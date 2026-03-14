import { describe, expect, it } from 'vitest';

import { createConfig } from '../../src/config/index.js';
import { isGitLFSRequest, isGitRequest } from '../../src/protocols/git.js';
import {
  addSecurityHeaders,
  createErrorResponse,
  resolveAllowedOrigin
} from '../../src/utils/security.js';
import { getAllowedMethods, validateRequest } from '../../src/utils/validation.js';

describe('Utility Functions', () => {
  describe('isGitRequest', () => {
    it('should identify Git info/refs requests', () => {
      const request = new Request('https://example.com/repo.git/info/refs');
      const url = new URL(request.url);

      expect(isGitRequest(request, url)).toBe(true);
    });

    it('should identify Git requests by User-Agent', () => {
      const request = new Request('https://example.com/repo.git', {
        headers: { 'User-Agent': 'git/2.34.1' }
      });
      const url = new URL(request.url);

      expect(isGitRequest(request, url)).toBe(true);
    });

    it('should not identify regular file requests as Git', () => {
      const request = new Request('https://example.com/repo/file.txt');
      const url = new URL(request.url);

      expect(isGitRequest(request, url)).toBe(false);
    });
  });

  describe('isGitLFSRequest', () => {
    it('should identify LFS batch API requests', () => {
      const request = new Request('https://example.com/repo.git/objects/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/vnd.git-lfs+json' }
      });
      const url = new URL(request.url);

      expect(isGitLFSRequest(request, url)).toBe(true);
    });

    it('should identify LFS requests by User-Agent', () => {
      const request = new Request('https://example.com/repo.git', {
        headers: { 'User-Agent': 'git-lfs/3.0.0 (GitHub; darwin amd64; go 1.17.2)' }
      });
      const url = new URL(request.url);

      expect(isGitLFSRequest(request, url)).toBe(true);
    });

    it('should not identify regular file requests as LFS', () => {
      const request = new Request('https://example.com/repo/file.txt');
      const url = new URL(request.url);

      expect(isGitLFSRequest(request, url)).toBe(false);
    });
  });

  describe('validateRequest', () => {
    it('should allow GET requests', () => {
      const request = new Request('https://example.com/test', { method: 'GET' });
      const url = new URL(request.url);

      const result = validateRequest(request, url, createConfig());
      expect(result.valid).toBe(true);
    });

    it('should allow POST requests for Git operations', () => {
      const request = new Request('https://example.com/repo.git/git-upload-pack', {
        method: 'POST',
        headers: { 'User-Agent': 'git/2.34.1' }
      });
      const url = new URL(request.url);

      const result = validateRequest(request, url, createConfig());
      expect(result.valid).toBe(true);
    });

    it('should reject encoded traversal attempts against the production validator', () => {
      const request = new Request('https://example.com/gh/user/repo/%2e%2e%2fsecret');
      const url = new URL(request.url);

      const result = validateRequest(request, url, createConfig());
      expect(result.valid).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe('getAllowedMethods', () => {
    it('should respect configured methods for regular requests', () => {
      const config = createConfig({ ALLOWED_METHODS: 'GET,HEAD,POST' });
      const request = new Request('https://example.com/gh/test/repo/issues', { method: 'POST' });
      const url = new URL(request.url);

      expect(getAllowedMethods(request, url, config)).toEqual(['GET', 'HEAD', 'POST']);
    });
  });

  describe('addSecurityHeaders', () => {
    it('should add all required security headers', () => {
      const headers = new Headers();
      const result = addSecurityHeaders(headers);

      expect(result.get('Strict-Transport-Security')).toContain('max-age=31536000');
      expect(result.get('X-Frame-Options')).toBe('DENY');
      expect(result.get('X-XSS-Protection')).toBe('1; mode=block');
      expect(result.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      expect(result.get('Content-Security-Policy')).toContain("default-src 'none'");
      expect(result.get('Permissions-Policy')).toContain('interest-cohort=()');
    });

    it('should return the same Headers object', () => {
      const headers = new Headers();
      const result = addSecurityHeaders(headers);

      expect(result).toBe(headers);
    });
  });

  describe('resolveAllowedOrigin', () => {
    it('should return the matching origin from the production config', () => {
      const config = createConfig({ ALLOWED_ORIGINS: 'https://app.example.com' });
      const request = new Request('https://example.com/gh/test/repo', {
        headers: { Origin: 'https://app.example.com' }
      });

      expect(resolveAllowedOrigin(request, config)).toBe('https://app.example.com');
    });

    it('should reject origins that are not configured', () => {
      const config = createConfig({ ALLOWED_ORIGINS: 'https://app.example.com' });
      const request = new Request('https://example.com/gh/test/repo', {
        headers: { Origin: 'https://evil.example.com' }
      });

      expect(resolveAllowedOrigin(request, config)).toBeNull();
    });
  });

  describe('createErrorResponse', () => {
    it('should create a plain-text error response with security headers', async () => {
      const response = createErrorResponse('Bad Request', 400);

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('text/plain');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(await response.text()).toBe('Bad Request');
    });
  });
});
