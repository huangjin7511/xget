import { CONFIG } from './config/index.js';
import { transformPath } from './config/platforms.js';

/**
 * Monitors performance metrics during request processing
 */
class PerformanceMonitor {
  /**
   * Initializes a new performance monitor
   */
  constructor() {
    this.startTime = Date.now();
    this.marks = new Map();
  }

  /**
   * Marks a timing point with the given name
   * @param {string} name - The name of the timing mark
   */
  mark(name) {
    if (this.marks.has(name)) {
      console.warn(`Mark with name ${name} already exists.`);
    }
    this.marks.set(name, Date.now() - this.startTime);
  }

  /**
   * Returns all collected metrics
   * @returns {Object.<string, number>} Object containing name-timestamp pairs
   */
  getMetrics() {
    return Object.fromEntries(this.marks.entries());
  }
}

/**
 * Detects if a request is a Docker registry operation
 * @param {Request} request - The incoming request object
 * @param {URL} url - Parsed URL object
 * @returns {boolean} True if this is a Docker registry operation
 */
function isDockerRequest(request, url) {
  // Check for Docker registry API endpoints
  if (url.pathname.startsWith('/v2/')) {
    return true;
  }

  // Check for Docker-specific User-Agent
  const userAgent = request.headers.get('User-Agent') || '';
  if (userAgent.toLowerCase().includes('docker/')) {
    return true;
  }

  // Check for Docker-specific Accept headers
  const accept = request.headers.get('Accept') || '';
  if (
    accept.includes('application/vnd.docker.distribution.manifest') ||
    accept.includes('application/vnd.oci.image.manifest') ||
    accept.includes('application/vnd.docker.image.rootfs.diff.tar.gzip')
  ) {
    return true;
  }

  return false;
}

/**
 * Detects if a request is a Git operation
 * @param {Request} request - The incoming request object
 * @param {URL} url - Parsed URL object
 * @returns {boolean} True if this is a Git operation
 */
function isGitRequest(request, url) {
  // Check for Git-specific endpoints
  if (url.pathname.endsWith('/info/refs')) {
    return true;
  }

  if (url.pathname.endsWith('/git-upload-pack') || url.pathname.endsWith('/git-receive-pack')) {
    return true;
  }

  // Check for Git user agents (more comprehensive check)
  const userAgent = request.headers.get('User-Agent') || '';
  if (userAgent.includes('git/') || userAgent.startsWith('git/')) {
    return true;
  }

  // Check for Git-specific query parameters
  if (url.searchParams.has('service')) {
    const service = url.searchParams.get('service');
    return service === 'git-upload-pack' || service === 'git-receive-pack';
  }

  // Check for Git-specific content types
  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('git-upload-pack') || contentType.includes('git-receive-pack')) {
    return true;
  }

  return false;
}

/**
 * Validates incoming requests against security rules
 * @param {Request} request - The incoming request object
 * @param {URL} url - Parsed URL object
 * @returns {{valid: boolean, error?: string, status?: number}} Validation result
 */
function validateRequest(request, url) {
  // Allow POST method for Git and Docker operations
  const isGit = isGitRequest(request, url);
  const isDocker = isDockerRequest(request, url);

  const allowedMethods =
    isGit || isDocker ? ['GET', 'HEAD', 'POST', 'PUT', 'PATCH'] : CONFIG.SECURITY.ALLOWED_METHODS;

  if (!allowedMethods.includes(request.method)) {
    return { valid: false, error: 'Method not allowed', status: 405 };
  }

  if (url.pathname.length > CONFIG.SECURITY.MAX_PATH_LENGTH) {
    return { valid: false, error: 'Path too long', status: 414 };
  }

  return { valid: true };
}

/**
 * Adds security headers to the response
 * @param {Headers} headers - Headers object to modify
 * @returns {Headers} Modified headers object
 */
function addSecurityHeaders(headers) {
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Content-Security-Policy', "default-src 'none'; img-src 'self'; script-src 'none'");
  headers.set('Permissions-Policy', 'interest-cohort=()');
  return headers;
}

/**
 * Parses Docker WWW-Authenticate header
 * @param {string} authenticateStr - The WWW-Authenticate header value
 * @returns {{realm: string, service: string}} Parsed authentication info
 */
function parseAuthenticate(authenticateStr) {
  // sample: Bearer realm="https://auth.ipv6.docker.com/token",service="registry.docker.io"
  const re = /(?<=\=")(?:\\.|[^"\\])*(?=")/g;
  const matches = authenticateStr.match(re);
  if (matches == null || matches.length < 2) {
    throw new Error(`invalid Www-Authenticate Header: ${authenticateStr}`);
  }
  return {
    realm: matches[0],
    service: matches[1]
  };
}

/**
 * Fetches authentication token from Docker registry
 * @param {{realm: string, service: string}} wwwAuthenticate - Authentication info
 * @param {string} scope - The scope for the token
 * @param {string} authorization - Authorization header value
 * @returns {Promise<Response>} Token response
 */
async function fetchToken(wwwAuthenticate, scope, authorization) {
  const url = new URL(wwwAuthenticate.realm);
  if (wwwAuthenticate.service.length) {
    url.searchParams.set('service', wwwAuthenticate.service);
  }
  if (scope) {
    url.searchParams.set('scope', scope);
  }
  const headers = new Headers();
  if (authorization) {
    headers.set('Authorization', authorization);
  }
  return await fetch(url, { method: 'GET', headers: headers });
}

/**
 * Creates unauthorized response for Docker registry
 * @param {URL} url - Request URL
 * @returns {Response} Unauthorized response
 */
function responseUnauthorized(url) {
  const headers = new Headers();
  headers.set(
    'WWW-Authenticate',
    `Bearer realm="https://${url.hostname}/v2/auth",service="xget.xi-xu.me"`
  );
  headers.set('Content-Type', 'application/json');
  return new Response(
    JSON.stringify({
      errors: [
        {
          code: 'UNAUTHORIZED',
          message: 'authentication required',
          detail: null
        }
      ]
    }),
    {
      status: 401,
      headers: headers
    }
  );
}

/**
 * Handles incoming requests with caching, retries, and security measures
 * @param {Request} request - The incoming request
 * @param {Object} env - Environment variables
 * @param {ExecutionContext} ctx - Cloudflare Workers execution context
 * @returns {Promise<Response>} The response object
 */
async function handleRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const isDocker = isDockerRequest(request, url);

    const monitor = new PerformanceMonitor();

    // Handle Docker API version check
    if (isDocker && (url.pathname === '/v2/' || url.pathname === '/v2')) {
      const headers = new Headers({
        'Docker-Distribution-Api-Version': 'registry/2.0',
        'Content-Type': 'application/json'
      });
      addSecurityHeaders(headers);
      return new Response('{}', { status: 200, headers });
    }

    // Redirect root path or invalid platforms to GitHub repository
    if (url.pathname === '/' || url.pathname === '') {
      const HOME_PAGE_URL = 'https://github.com/xixu-me/Xget';
      return Response.redirect(HOME_PAGE_URL, 302);
    }

    const validation = validateRequest(request, url);
    if (!validation.valid) {
      return new Response(validation.error, {
        status: validation.status,
        headers: addSecurityHeaders(new Headers())
      });
    }

    // Parse platform and path
    let platform;
    let effectivePath = url.pathname;

    // Handle Docker registry paths specially
    if (isDocker) {
      // For Docker requests (excluding version check which is handled above),
      // check if they have /cr/ prefix
      if (!url.pathname.startsWith('/cr/') && !url.pathname.startsWith('/v2/cr/')) {
        return new Response('Docker registry requests must use /cr/ prefix', {
          status: 400,
          headers: addSecurityHeaders(new Headers())
        });
      }
      // Remove /v2 from the path for Docker registry API consistency if present
      effectivePath = url.pathname.replace(/^\/v2/, '');
    }

    // Platform detection using transform patterns
    // Sort platforms by path length (descending) to prioritize more specific paths
    // e.g., conda/community should match before conda, pypi/files before pypi
    const sortedPlatforms = Object.keys(CONFIG.PLATFORMS).sort((a, b) => {
      const pathA = `/${a.replace('-', '/')}/`;
      const pathB = `/${b.replace('-', '/')}/`;
      return pathB.length - pathA.length;
    });

    platform =
      sortedPlatforms.find(key => {
        const expectedPrefix = `/${key.replace('-', '/')}/`;
        return effectivePath.startsWith(expectedPrefix);
      }) || effectivePath.split('/')[1];

    if (!platform || !CONFIG.PLATFORMS[platform]) {
      const HOME_PAGE_URL = 'https://github.com/xixu-me/Xget';
      return Response.redirect(HOME_PAGE_URL, 302);
    }

    // Transform URL based on platform using unified logic
    const targetPath = transformPath(effectivePath, platform);

    // For Docker registries, ensure we add the /v2 prefix for the Docker API
    let finalTargetPath;
    if (platform.startsWith('cr-')) {
      finalTargetPath = `/v2${targetPath}`;

      // Handle Docker Hub library image path transformation
      // Example: /v2/nginx/manifests/latest => /v2/library/nginx/manifests/latest
      if (platform === 'cr-docker') {
        const pathParts = finalTargetPath.split('/');
        // Check if this is a library image path (no namespace)
        if (pathParts.length === 5 && (pathParts[3] === 'manifests' || pathParts[3] === 'blobs')) {
          pathParts.splice(2, 0, 'library');
          finalTargetPath = pathParts.join('/');
        }
      }
    } else {
      finalTargetPath = targetPath;
    }

    const targetUrl = `${CONFIG.PLATFORMS[platform]}${finalTargetPath}${url.search}`;
    const isDockerHub = platform === 'cr-docker';
    const authorization = request.headers.get('Authorization');

    // Handle Docker authentication
    if (isDocker && url.pathname === '/v2/auth') {
      const newUrl = new URL(CONFIG.PLATFORMS[platform] + '/v2/');
      const resp = await fetch(newUrl.toString(), {
        method: 'GET',
        redirect: 'follow'
      });
      if (resp.status !== 401) {
        return resp;
      }
      const authenticateStr = resp.headers.get('WWW-Authenticate');
      if (authenticateStr === null) {
        return resp;
      }
      const wwwAuthenticate = parseAuthenticate(authenticateStr);
      let scope = url.searchParams.get('scope');
      // autocomplete repo part into scope for DockerHub library images
      // Example: repository:busybox:pull => repository:library/busybox:pull
      if (scope && isDockerHub) {
        let scopeParts = scope.split(':');
        if (scopeParts.length == 3 && !scopeParts[1].includes('/')) {
          scopeParts[1] = 'library/' + scopeParts[1];
          scope = scopeParts.join(':');
        }
      }
      return await fetchToken(wwwAuthenticate, scope || '', authorization || '');
    }

    // Handle DockerHub library image redirects before making the request
    if (isDocker && isDockerHub) {
      const pathParts = url.pathname.split('/');
      if (pathParts.length == 5) {
        pathParts.splice(2, 0, 'library');
        const redirectUrl = new URL(url);
        redirectUrl.pathname = pathParts.join('/');
        return Response.redirect(redirectUrl, 301);
      }
    }

    // Check if this is a Git operation
    const isGit = isGitRequest(request, url);

    // Check cache first (skip cache for Git and Docker operations)
    // @ts-ignore
    const cache = caches.default;
    const cacheKey = new Request(targetUrl, request);
    let response;

    if (!isGit && !isDocker) {
      response = await cache.match(cacheKey);
      if (response) {
        monitor.mark('cache_hit');
        return response;
      }
    }

    /** @type {RequestInit} */
    const fetchOptions = {
      method: request.method,
      headers: new Headers(),
      // For Docker Hub, use manual redirect to handle blob redirects properly
      redirect: isDockerHub ? 'manual' : 'follow'
    };

    // Add body for POST/PUT/PATCH requests (Git/Docker operations)
    if (['POST', 'PUT', 'PATCH'].includes(request.method) && (isGit || isDocker)) {
      fetchOptions.body = request.body;
    }

    // Cast headers to Headers for proper typing
    const requestHeaders = /** @type {Headers} */ (fetchOptions.headers);

    // Set appropriate headers for Git/Docker vs regular requests
    if (isGit || isDocker) {
      // For Git/Docker operations, copy all headers from the original request
      // This ensures protocol compliance
      for (const [key, value] of request.headers.entries()) {
        // Skip headers that might cause issues with proxying
        if (!['host', 'connection', 'upgrade', 'proxy-connection'].includes(key.toLowerCase())) {
          requestHeaders.set(key, value);
        }
      }

      // Set Git-specific headers if not present
      if (isGit && !requestHeaders.has('User-Agent')) {
        requestHeaders.set('User-Agent', 'git/2.34.1');
      }

      // For Git upload-pack requests, ensure proper content type
      if (isGit && request.method === 'POST' && url.pathname.endsWith('/git-upload-pack')) {
        if (!requestHeaders.has('Content-Type')) {
          requestHeaders.set('Content-Type', 'application/x-git-upload-pack-request');
        }
      }

      // For Git receive-pack requests, ensure proper content type
      if (isGit && request.method === 'POST' && url.pathname.endsWith('/git-receive-pack')) {
        if (!requestHeaders.has('Content-Type')) {
          requestHeaders.set('Content-Type', 'application/x-git-receive-pack-request');
        }
      }
    } else {
      // Regular file download headers
      Object.assign(fetchOptions, {
        cf: {
          http3: true,
          cacheTtl: CONFIG.CACHE_DURATION,
          cacheEverything: true,
          minify: {
            javascript: true,
            css: true,
            html: true
          },
          preconnect: true
        }
      });

      requestHeaders.set('Accept-Encoding', 'gzip, deflate, br');
      requestHeaders.set('Connection', 'keep-alive');
      requestHeaders.set('User-Agent', 'Wget/1.21.3');
      requestHeaders.set('Origin', request.headers.get('Origin') || '*');

      // Handle range requests
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader) {
        requestHeaders.set('Range', rangeHeader);
      }
    }

    // Implement retry mechanism
    let attempts = 0;
    while (attempts < CONFIG.MAX_RETRIES) {
      try {
        monitor.mark('attempt_' + attempts);

        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_SECONDS * 1000);

        // For Git/Docker operations, don't use Cloudflare-specific options
        const finalFetchOptions =
          isGit || isDocker
            ? { ...fetchOptions, signal: controller.signal }
            : { ...fetchOptions, signal: controller.signal };

        response = await fetch(targetUrl, finalFetchOptions);

        clearTimeout(timeoutId);

        // Handle Docker Hub blob redirects manually (similar to cloudflare-docker-proxy)
        if (isDocker && isDockerHub && response.status === 307) {
          const location = response.headers.get('Location');
          if (location) {
            const redirectResponse = await fetch(location, {
              method: 'GET',
              redirect: 'follow'
            });
            response = redirectResponse;
          }
        }

        if (response.ok || response.status === 206) {
          monitor.mark('success');
          break;
        }

        // For Docker registry, handle authentication challenges
        if (isDocker && response.status === 401) {
          monitor.mark('docker_auth_challenge');

          // Try to get an anonymous token for public images
          const authenticateStr = response.headers.get('WWW-Authenticate');
          if (authenticateStr) {
            try {
              const wwwAuthenticate = parseAuthenticate(authenticateStr);
              let scope = null;

              // Extract scope from the original request path if it's a manifest request
              if (url.pathname.includes('/manifests/')) {
                const pathParts = url.pathname.split('/');
                const registryPrefix = platform.replace('cr-', '');
                if (registryPrefix === 'docker') {
                  // For Docker Hub, construct scope from path
                  // /v2/cr/docker/library/nginx/manifests/latest -> repository:library/nginx:pull
                  const imagePathStart = pathParts.indexOf('manifests');
                  if (imagePathStart >= 3) {
                    const imageName = pathParts.slice(3, imagePathStart).join('/');
                    scope = `repository:${imageName}:pull`;
                  }
                }
              }

              // Try to get anonymous token
              const tokenResponse = await fetchToken(wwwAuthenticate, scope || '', '');
              if (tokenResponse.ok) {
                // Retry the original request with the token
                const tokenData = await tokenResponse.json();
                if (tokenData.token) {
                  const retryHeaders = new Headers(request.headers);
                  retryHeaders.set('Authorization', `Bearer ${tokenData.token}`);

                  const retryResponse = await fetch(targetUrl, {
                    ...finalFetchOptions,
                    headers: retryHeaders
                  });

                  if (retryResponse.ok) {
                    response = retryResponse;
                    break;
                  }
                }
              }
            } catch (error) {
              console.log('Anonymous token fetch failed:', error);
            }
          }

          // If anonymous access fails, return unauthorized response
          return responseUnauthorized(url);
        }

        // Don't retry on client errors (4xx) - these won't improve with retries
        if (response.status >= 400 && response.status < 500) {
          monitor.mark('client_error');
          break;
        }

        attempts++;
        if (attempts < CONFIG.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * attempts));
        }
      } catch (error) {
        attempts++;
        if (error instanceof Error && error.name === 'AbortError') {
          return new Response('Request timeout', {
            status: 408,
            headers: addSecurityHeaders(new Headers())
          });
        }
        if (attempts >= CONFIG.MAX_RETRIES) {
          const message = error instanceof Error ? error.message : String(error);
          return new Response(`Failed after ${CONFIG.MAX_RETRIES} attempts: ${message}`, {
            status: 500,
            headers: addSecurityHeaders(new Headers())
          });
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * attempts));
      }
    }

    // Check if we have a valid response after all attempts
    if (!response) {
      return new Response('No response received after all retry attempts', {
        status: 500,
        headers: addSecurityHeaders(new Headers())
      });
    }

    // If response is still not ok after all retries, return the error
    if (!response.ok && response.status !== 206) {
      // For Docker authentication, we must pass the 401 challenge through
      if (isDocker && response.status === 401) {
        return responseUnauthorized(url);
      }
      const errorText = await response.text().catch(() => 'Unknown error');
      return new Response(`Upstream server error (${response.status}): ${errorText}`, {
        status: response.status,
        headers: addSecurityHeaders(new Headers())
      });
    }

    // Handle URL rewriting for different platforms
    let responseBody = response.body;

    // Handle PyPI simple index URL rewriting
    if (platform === 'pypi' && response.headers.get('content-type')?.includes('text/html')) {
      const originalText = await response.text();
      // Rewrite URLs in the response body to go through the Cloudflare Worker
      // files.pythonhosted.org URLs should be rewritten to go through our pypi/files endpoint
      const rewrittenText = originalText.replace(
        /https:\/\/files\.pythonhosted\.org/g,
        `${url.origin}/pypi/files`
      );
      responseBody = rewrittenText;
    }

    // Handle npm registry URL rewriting
    if (platform === 'npm' && response.headers.get('content-type')?.includes('application/json')) {
      const originalText = await response.text();
      // Rewrite tarball URLs in npm registry responses to go through our npm endpoint
      // https://registry.npmjs.org/package/-/package-version.tgz -> https://xget.xi-xu.me/npm/package/-/package-version.tgz
      const rewrittenText = originalText.replace(
        /https:\/\/registry\.npmjs\.org\/([^\/]+)/g,
        `${url.origin}/npm/$1`
      );
      responseBody = rewrittenText;
    }

    // Prepare response headers
    const headers = new Headers(response.headers);

    if (isGit || isDocker) {
      // For Git/Docker operations, preserve all headers from the upstream response
      // These protocols are very sensitive to header changes
      // Don't add any additional headers that might interfere with protocol operation
      // The response headers from upstream should be passed through as-is
    } else {
      // Regular file download headers
      headers.set('Cache-Control', `public, max-age=${CONFIG.CACHE_DURATION}`);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Accept-Ranges', 'bytes');
      addSecurityHeaders(headers);
    }

    // Create final response
    const finalResponse = new Response(responseBody, {
      status: response.status,
      headers: headers
    });

    // Cache successful responses (skip caching for Git and Docker operations)
    if (!isGit && !isDocker && (response.ok || response.status === 206)) {
      ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
    }

    monitor.mark('complete');
    return isGit || isDocker ? finalResponse : addPerformanceHeaders(finalResponse, monitor);
  } catch (error) {
    console.error('Error handling request:', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`Internal Server Error: ${message}`, {
      status: 500,
      headers: addSecurityHeaders(new Headers())
    });
  }
}

/**
 * Adds performance metrics to response headers
 * @param {Response} response - The response object
 * @param {PerformanceMonitor} monitor - Performance monitor instance
 * @returns {Response} New response with performance headers
 */
function addPerformanceHeaders(response, monitor) {
  const headers = new Headers(response.headers);
  headers.set('X-Performance-Metrics', JSON.stringify(monitor.getMetrics()));
  addSecurityHeaders(headers);
  return new Response(response.body, {
    status: response.status,
    headers: headers
  });
}

export default {
  /**
   * Main entry point for the Cloudflare Worker
   * @param {Request} request - The incoming request
   * @param {Object} env - Environment variables
   * @param {ExecutionContext} ctx - Cloudflare Workers execution context
   * @returns {Promise<Response>} The response object
   */
  fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};
