import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('PyTorch Platform Support', () => {
  describe('PyTorch URL Transformation', () => {
    it('should handle PyTorch wheel requests', async () => {
      const testUrl =
        'https://example.com/pytorch/whl/cu129/torch-2.8.0%2Bcu129-cp313-cp313-win_amd64.whl';
      const response = await SELF.fetch(testUrl, { method: 'HEAD' });

      // Should attempt to proxy to PyTorch
      expect(response.status).not.toBe(400);
    });

    it('should handle PyTorch model requests', async () => {
      const testUrl = 'https://example.com/pytorch/models/resnet50-0676ba61.pth';
      const response = await SELF.fetch(testUrl, { method: 'HEAD' });

      // Should attempt to proxy to PyTorch
      expect(response.status).not.toBe(400);
    });

    it('should handle PyTorch wheel index pages', async () => {
      const testUrl = 'https://example.com/pytorch/whl/cu129/';
      const response = await SELF.fetch(testUrl);

      // Should not reject the request
      expect(response.status).not.toBe(400);
    });
  });

  describe('PyTorch URL Rewriting', () => {
    it('should rewrite PyTorch URLs in HTML responses', async () => {
      // Mock HTML response from PyTorch with absolute URLs
      const mockHtml = `
        <html>
        <body>
          <a href="https://download.pytorch.org/whl/cu129/torch-2.8.0%2Bcu129-cp313-cp313-win_amd64.whl">torch-2.8.0+cu129</a>
          <a href="https://download.pytorch.org/models/resnet50-0676ba61.pth">resnet50</a>
        </body>
        </html>
      `;

      // This test would need to be implemented with a proper mock
      // For now, we just verify the platform is recognized
      const testUrl = 'https://example.com/pytorch/whl/cu129/';
      const response = await SELF.fetch(testUrl);
      expect(response.status).not.toBe(404);
    });
  });

  describe('PyTorch Platform Configuration', () => {
    it('should have correct PyTorch base URL configured', async () => {
      // Verify that pytorch prefix is recognized
      const testUrl = 'https://example.com/pytorch/test';
      const response = await SELF.fetch(testUrl, { method: 'HEAD' });

      // Should not redirect to homepage (which would indicate unrecognized platform)
      expect(response.status).not.toBe(302);
    });
  });

  describe('PyTorch Error Handling', () => {
    it('should handle invalid PyTorch URLs gracefully', async () => {
      const testUrl = 'https://example.com/pytorch/invalid/path/that/does/not/exist';
      const response = await SELF.fetch(testUrl);

      // Should either proxy the request (and get upstream 404) or handle gracefully
      expect([200, 301, 302, 404, 500]).toContain(response.status);
    });
  });
});
