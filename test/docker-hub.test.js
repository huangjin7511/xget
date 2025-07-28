import { describe, expect, it } from 'vitest';
import {
  DOCKER_HUB_REGISTRY,
  isDockerHub,
  parseDockerAuthenticate,
  transformDockerHubPath,
  transformDockerHubScope
} from '../src/config/docker.js';

describe('Docker Hub Support', () => {
  describe('parseDockerAuthenticate', () => {
    it('should parse Docker Hub WWW-Authenticate header correctly', () => {
      const authenticateStr = 'Bearer realm="https://auth.docker.io/token",service="registry.docker.io"';
      const result = parseDockerAuthenticate(authenticateStr);
      
      expect(result.realm).toBe('https://auth.docker.io/token');
      expect(result.service).toBe('registry.docker.io');
    });

    it('should throw error for invalid WWW-Authenticate header', () => {
      const invalidHeader = 'Bearer invalid-header';
      
      expect(() => parseDockerAuthenticate(invalidHeader)).toThrow('invalid Www-Authenticate Header');
    });
  });

  describe('transformDockerHubPath', () => {
    it('should add library prefix for Docker Hub library images', () => {
      const path = '/v2/nginx/manifests/latest';
      const result = transformDockerHubPath(path);
      
      expect(result).toBe('/v2/library/nginx/manifests/latest');
    });

    it('should add library prefix for blob requests', () => {
      const path = '/v2/alpine/blobs/sha256:abc123';
      const result = transformDockerHubPath(path);
      
      expect(result).toBe('/v2/library/alpine/blobs/sha256:abc123');
    });

    it('should not modify paths with existing namespace', () => {
      const path = '/v2/nginxinc/nginx-unprivileged/manifests/latest';
      const result = transformDockerHubPath(path);
      
      expect(result).toBe('/v2/nginxinc/nginx-unprivileged/manifests/latest');
    });

    it('should not modify non-Docker API paths', () => {
      const path = '/some/other/path';
      const result = transformDockerHubPath(path);
      
      expect(result).toBe('/some/other/path');
    });
  });

  describe('transformDockerHubScope', () => {
    it('should add library prefix to scope for library images', () => {
      const scope = 'repository:nginx:pull';
      const result = transformDockerHubScope(scope);
      
      expect(result).toBe('repository:library/nginx:pull');
    });

    it('should not modify scope with existing namespace', () => {
      const scope = 'repository:nginxinc/nginx-unprivileged:pull';
      const result = transformDockerHubScope(scope);
      
      expect(result).toBe('repository:nginxinc/nginx-unprivileged:pull');
    });

    it('should handle empty scope', () => {
      const result = transformDockerHubScope('');
      expect(result).toBe('');
    });

    it('should handle null scope', () => {
      const result = transformDockerHubScope(null);
      expect(result).toBe(null);
    });
  });

  describe('isDockerHub', () => {
    it('should identify Docker Hub registry URL', () => {
      expect(isDockerHub(DOCKER_HUB_REGISTRY)).toBe(true);
      expect(isDockerHub('https://registry-1.docker.io')).toBe(true);
    });

    it('should not identify other registries as Docker Hub', () => {
      expect(isDockerHub('https://ghcr.io')).toBe(false);
      expect(isDockerHub('https://quay.io')).toBe(false);
      expect(isDockerHub('https://gcr.io')).toBe(false);
    });
  });
});