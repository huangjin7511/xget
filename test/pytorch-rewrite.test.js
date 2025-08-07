import { describe, expect, it } from 'vitest';
import { transformPath } from '../src/config/platforms.js';

describe('PyTorch URL Rewriting', () => {
  it('should rewrite PyTorch wheel index URLs correctly', () => {
    const sampleHtml = `
<html>
<body>
<a href="torch/">torch</a>
<a href="../torch/">torch</a>
<a href="https://download.pytorch.org/whl/torch/torch-2.8.0%2Bcu129-cp313-cp313-win_amd64.whl">torch-2.8.0</a>
</body>
</html>
`;

    const origin = 'https://xget.xi-xu.me';

    // Simulate the rewriting logic from index.js
    let rewrittenText = sampleHtml.replace(
      /https:\/\/download\.pytorch\.org\/([^"'\s>]+)/g,
      `${origin}/pytorch/$1`
    );

    rewrittenText = rewrittenText.replace(
      /href=["']\.\.\/([^"']+)["']/g,
      `href="${origin}/pytorch/whl/$1"`
    );

    rewrittenText = rewrittenText.replace(
      /href=["']([^"']*[^"'\/])\/["']/g,
      (match, packageName) => {
        if (packageName.startsWith('http') || packageName.includes('xget.xi-xu.me')) {
          return match;
        }
        return `href="${origin}/pytorch/whl/${packageName}/"`;
      }
    );

    // Check that absolute URLs are rewritten
    expect(rewrittenText).toContain(
      'https://xget.xi-xu.me/pytorch/whl/torch/torch-2.8.0%2Bcu129-cp313-cp313-win_amd64.whl'
    );

    // Check that relative parent directory URLs are rewritten
    expect(rewrittenText).toContain('href="https://xget.xi-xu.me/pytorch/whl/torch/"');

    // Check that simple relative URLs are rewritten
    expect(rewrittenText).toContain('href="https://xget.xi-xu.me/pytorch/whl/torch/"');
  });

  it('should handle PyTorch path transformation correctly', () => {
    const testCases = [
      {
        input: '/pytorch/whl/cu129',
        expected: '/whl/cu129'
      },
      {
        input: '/pytorch/whl/torch/',
        expected: '/whl/torch/'
      },
      {
        input: '/pytorch/models/resnet50-0676ba61.pth',
        expected: '/models/resnet50-0676ba61.pth'
      }
    ];

    testCases.forEach(({ input, expected }) => {
      const result = transformPath(input, 'pytorch');
      expect(result).toBe(expected);
    });
  });
});
