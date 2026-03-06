import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from '../../src/index.js';
import { CONFIG } from '../../src/config/index.js';
import { isAIInferenceRequest } from '../../src/protocols/ai.js';
import { handleDockerAuth } from '../../src/protocols/docker.js';
import { isDockerRequest } from '../../src/utils/validation.js';

/** @type {ExecutionContext} */
const executionContext = {
  waitUntil() {},
  passThroughOnException() {}
};

describe('Protocol Detection', () => {
  it('only treats /ip-prefixed paths as AI inference requests', () => {
    const request = new Request('https://example.com/gh/user/repo/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const url = new URL(request.url);

    expect(isAIInferenceRequest(request, url)).toBe(false);
  });

  it('does not treat nested /v2/ segments in regular paths as Docker requests', () => {
    const request = new Request(
      'https://example.com/gh/user/repo/releases/download/v2/file.tar.gz'
    );
    const url = new URL(request.url);

    expect(isDockerRequest(request, url)).toBe(false);
  });
});

describe('Docker Authentication', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes Docker Hub official image scopes during auth proxying', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async input => {
      const url = String(input);

      if (url === 'https://registry-1.docker.io/v2/') {
        return new Response('', {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="https://auth.docker.io/token",service="registry.docker.io"'
          }
        });
      }

      return new Response(JSON.stringify({ token: 'token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });

    const request = new Request(
      'https://example.com/cr/docker/v2/auth?scope=repository:cr/docker/nginx:pull&service=Xget'
    );
    const response = await handleDockerAuth(request, new URL(request.url), CONFIG);

    expect(response.status).toBe(200);
    expect(String(fetchSpy.mock.calls[1][0])).toContain(
      'scope=repository%3Alibrary%2Fnginx%3Apull'
    );
  });

  it('routes platform-prefixed auth endpoints without duplicating /v2', async () => {
    /** @type {string[]} */
    const upstreamCalls = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async input => {
      upstreamCalls.push(String(input));

      if (String(input) === 'https://ghcr.io/v2/') {
        return new Response('', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="https://ghcr.io/token",service="ghcr.io"'
          }
        });
      }

      return new Response(JSON.stringify({ token: 'token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });

    const request = new Request('https://example.com/cr/ghcr/v2/auth?service=Xget');
    const response = await worker.fetch(request, {}, executionContext);

    expect(response.status).toBe(200);
    expect(upstreamCalls[0]).toBe('https://ghcr.io/v2/');
  });
});

describe('Protocol Header Configuration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not send Git user-agent for AI inference requests', async () => {
    /** @type {{ url: string, userAgent: string | null }[]} */
    const observed = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const headers = new Headers(init?.headers);
      observed.push({
        url: String(input),
        userAgent: headers.get('User-Agent')
      });

      return new Response('{}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });

    const request = new Request('https://example.com/ip/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const response = await worker.fetch(request, {}, executionContext);

    expect(response.status).toBe(200);
    expect(observed[0]).toEqual({
      url: 'https://api.openai.com/v1/chat/completions',
      userAgent: 'Xget-AI-Proxy/1.0'
    });
  });
});
