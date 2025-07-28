/**
 * Docker Hub specific configuration and utilities
 */

export const DOCKER_HUB_REGISTRY = 'https://registry-1.docker.io';
export const DOCKER_HUB_AUTH = 'https://auth.docker.io';

/**
 * Parses Docker WWW-Authenticate header
 * @param {string} authenticateStr - The WWW-Authenticate header value
 * @returns {{realm: string, service: string}} Parsed authentication info
 */
export function parseDockerAuthenticate(authenticateStr) {
  // sample: Bearer realm="https://auth.docker.io/token",service="registry.docker.io"
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
export async function fetchDockerToken(wwwAuthenticate, scope, authorization) {
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
export function createDockerUnauthorizedResponse(url) {
  const headers = new Headers();
  headers.set(
    'WWW-Authenticate',
    `Bearer realm="https://${url.hostname}/v2/auth",service="cloudflare-docker-proxy"`
  );
  return new Response(JSON.stringify({ message: 'UNAUTHORIZED' }), {
    status: 401,
    headers: headers
  });
}

/**
 * Handles Docker Hub library image path transformation
 * Docker Hub library images need special handling - they need "library/" prefix
 * @param {string} path - Original path
 * @returns {string} Transformed path
 */
export function transformDockerHubPath(path) {
  // Handle Docker Hub library images
  // Example: /v2/busybox/manifests/latest => /v2/library/busybox/manifests/latest
  const pathParts = path.split('/');
  if (pathParts.length >= 4 && pathParts[1] === 'v2' && !pathParts[2].includes('/')) {
    // Check if this is a library image (no namespace)
    if (pathParts.length === 5 && (pathParts[3] === 'manifests' || pathParts[3] === 'blobs')) {
      pathParts.splice(2, 0, 'library');
      return pathParts.join('/');
    }
  }
  return path;
}

/**
 * Handles Docker Hub scope transformation for authentication
 * @param {string} scope - Original scope
 * @returns {string} Transformed scope
 */
export function transformDockerHubScope(scope) {
  if (!scope) return scope;
  
  // autocomplete repo part into scope for DockerHub library images
  // Example: repository:busybox:pull => repository:library/busybox:pull
  const scopeParts = scope.split(':');
  if (scopeParts.length === 3 && !scopeParts[1].includes('/')) {
    scopeParts[1] = 'library/' + scopeParts[1];
    return scopeParts.join(':');
  }
  return scope;
}

/**
 * Checks if the upstream is Docker Hub
 * @param {string} upstream - Upstream URL
 * @returns {boolean} True if Docker Hub
 */
export function isDockerHub(upstream) {
  return upstream === DOCKER_HUB_REGISTRY;
}