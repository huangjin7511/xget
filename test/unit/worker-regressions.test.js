import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import worker from '../../src/index.js';

/** @type {ExecutionContext} */
const executionContext = {
  waitUntil() {},
  passThroughOnException() {}
};

describe('Worker regression coverage', () => {
  /** @type {{ match: ReturnType<typeof vi.fn>, put: ReturnType<typeof vi.fn> }} */
  let cacheDefault;

  beforeEach(() => {
    cacheDefault = {
      match: vi.fn(async () => null),
      put: vi.fn(async () => undefined)
    };

    vi.stubGlobal('caches', {
      default: cacheDefault
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not leak thrown upstream error details to clients', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('secret-upstream-detail'));

    const response = await worker.fetch(
      new Request('https://example.com/gh/user/repo/file.txt'),
      { MAX_RETRIES: '1', RETRY_DELAY_MS: '0', TIMEOUT_SECONDS: '1' },
      executionContext
    );

    const body = await response.text();

    expect(response.status).toBe(502);
    expect(body).not.toContain('secret-upstream-detail');
    expect(body).not.toContain('Failed after');
  });

  it('clears timeout handles when upstream fetch rejects', async () => {
    const timeoutToken = { id: 'timeout-token' };
    const setTimeoutSpy = vi.fn(() => timeoutToken);
    const clearTimeoutSpy = vi.fn();

    vi.stubGlobal('setTimeout', setTimeoutSpy);
    vi.stubGlobal('clearTimeout', clearTimeoutSpy);
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('boom'));

    const response = await worker.fetch(
      new Request('https://example.com/gh/user/repo/file.txt'),
      { MAX_RETRIES: '1', RETRY_DELAY_MS: '0', TIMEOUT_SECONDS: '5' },
      executionContext
    );

    expect(response.status).toBe(502);
    expect(setTimeoutSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutToken);
  });

  it('forwards body and content type for configured non-protocol POST requests', async () => {
    /** @type {{ url: string, method: string | undefined, body: string | null, contentType: string | null, cf: unknown }} */
    let observed = {
      url: '',
      method: undefined,
      body: null,
      contentType: null,
      cf: undefined
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      observed = {
        url: String(input),
        method: init?.method,
        body: init?.body ? await new Response(init.body).text() : null,
        contentType: new Headers(init?.headers).get('Content-Type'),
        cf: /** @type {RequestInit & { cf?: unknown }} */ (init || {}).cf
      };

      return new Response('created', {
        status: 201,
        headers: { 'Content-Type': 'text/plain' }
      });
    });

    const response = await worker.fetch(
      new Request('https://example.com/gh/user/repo/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'test' })
      }),
      { ALLOWED_METHODS: 'GET,HEAD,POST' },
      executionContext
    );

    expect(response.status).toBe(201);
    expect(observed).toEqual({
      url: 'https://github.com/user/repo/issues',
      method: 'POST',
      body: JSON.stringify({ title: 'test' }),
      contentType: 'application/json',
      cf: undefined
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(cacheDefault.match).not.toHaveBeenCalled();
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
