import { CONFIG } from "./config/index.js";

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
 * Detects if a request is a Git operation
 * @param {Request} request - The incoming request object
 * @param {URL} url - Parsed URL object
 * @returns {boolean} True if this is a Git operation
 */
function isGitRequest(request, url) {
	// Check for Git-specific endpoints
	if (url.pathname.endsWith("/info/refs")) {
		return true;
	}

	if (
		url.pathname.endsWith("/git-upload-pack") ||
		url.pathname.endsWith("/git-receive-pack")
	) {
		return true;
	}

	// Check for Git user agents (more comprehensive check)
	const userAgent = request.headers.get("User-Agent") || "";
	if (userAgent.includes("git/") || userAgent.startsWith("git/")) {
		return true;
	}

	// Check for Git-specific query parameters
	if (url.searchParams.has("service")) {
		const service = url.searchParams.get("service");
		return service === "git-upload-pack" || service === "git-receive-pack";
	}

	// Check for Git-specific content types
	const contentType = request.headers.get("Content-Type") || "";
	if (
		contentType.includes("git-upload-pack") ||
		contentType.includes("git-receive-pack")
	) {
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
	// Allow POST method for Git operations
	const allowedMethods = isGitRequest(request, url)
		? ["GET", "HEAD", "POST"]
		: CONFIG.SECURITY.ALLOWED_METHODS;

	if (!allowedMethods.includes(request.method)) {
		return { valid: false, error: "Method not allowed", status: 405 };
	}

	if (url.pathname.length > CONFIG.SECURITY.MAX_PATH_LENGTH) {
		return { valid: false, error: "Path too long", status: 414 };
	}

	return { valid: true };
}

/**
 * Adds security headers to the response
 * @param {Headers} headers - Headers object to modify
 * @returns {Headers} Modified headers object
 */
function addSecurityHeaders(headers) {
	headers.set(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains; preload"
	);
	headers.set("X-Frame-Options", "DENY");
	headers.set("X-XSS-Protection", "1; mode=block");
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set(
		"Content-Security-Policy",
		"default-src 'none'; img-src 'self'; script-src 'none'"
	);
	headers.set("Permissions-Policy", "interest-cohort=()");
	return headers;
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

		// Serve homepage for root path
		if (url.pathname === "/" || url.pathname === "") {
			const HOME_PAGE_URL = "https://xixu-me.github.io/Xget-page/";
			const requestHeaders = new Headers(request.headers);

			const homePageRequest = new Request(HOME_PAGE_URL, {
				method: request.method,
				headers: requestHeaders,
				body: request.body,
				redirect: "manual",
			});

			return fetch(homePageRequest, { redirect: "manual" });
		}

		const monitor = new PerformanceMonitor();

		const validation = validateRequest(request, url);
		if (!validation.valid) {
			return new Response(validation.error, {
				status: validation.status,
				headers: addSecurityHeaders(new Headers()),
			});
		}

		// Parse platform and path
		const [_, platform] = url.pathname.split("/");
		if (!platform || !CONFIG.PLATFORMS[platform]) {
			return new Response("Invalid or missing platform", {
				status: 400,
				headers: addSecurityHeaders(new Headers()),
			});
		}

		// Transform URL based on platform
		const targetPath = CONFIG.PLATFORMS[platform].transform(url.pathname);
		const targetUrl = `${CONFIG.PLATFORMS[platform].base}${targetPath}${url.search}`;

		// Check if this is a Git operation
		const isGit = isGitRequest(request, url);

		// Check cache first (skip cache for Git operations)
		const cache = caches.default;
		const cacheKey = new Request(targetUrl, request);
		let response;

		if (!isGit) {
			response = await cache.match(cacheKey);
			if (response) {
				monitor.mark("cache_hit");
				return response;
			}
		}

		const fetchOptions = {
			method: request.method,
			headers: new Headers(),
		};

		// Add body for POST requests (Git operations)
		if (request.method === "POST" && isGit) {
			// For Git operations, we need to preserve the original body stream
			fetchOptions.body = request.body;
		}

		// Set appropriate headers for Git vs regular requests
		if (isGit) {
			// For Git operations, copy all headers from the original request
			// This ensures Git protocol compliance
			for (const [key, value] of request.headers.entries()) {
				// Skip headers that might cause issues with proxying
				if (
					!["host", "connection", "upgrade", "proxy-connection"].includes(
						key.toLowerCase()
					)
				) {
					fetchOptions.headers.set(key, value);
				}
			}

			// Set Git-specific headers if not present
			if (!fetchOptions.headers.has("User-Agent")) {
				fetchOptions.headers.set("User-Agent", "git/2.34.1");
			}

			// For Git upload-pack requests, ensure proper content type
			if (
				request.method === "POST" &&
				url.pathname.endsWith("/git-upload-pack")
			) {
				if (!fetchOptions.headers.has("Content-Type")) {
					fetchOptions.headers.set(
						"Content-Type",
						"application/x-git-upload-pack-request"
					);
				}
			}

			// For Git receive-pack requests, ensure proper content type
			if (
				request.method === "POST" &&
				url.pathname.endsWith("/git-receive-pack")
			) {
				if (!fetchOptions.headers.has("Content-Type")) {
					fetchOptions.headers.set(
						"Content-Type",
						"application/x-git-receive-pack-request"
					);
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
						html: true,
					},
					preconnect: true,
				},
			});

			fetchOptions.headers.set("Accept-Encoding", "gzip, deflate, br");
			fetchOptions.headers.set("Connection", "keep-alive");
			fetchOptions.headers.set("User-Agent", "Wget/1.21.3");
			fetchOptions.headers.set("Origin", request.headers.get("Origin") || "*");

			// Handle range requests
			const rangeHeader = request.headers.get("Range");
			if (rangeHeader) {
				fetchOptions.headers.set("Range", rangeHeader);
			}
		}

		// Implement retry mechanism
		let attempts = 0;
		while (attempts < CONFIG.MAX_RETRIES) {
			try {
				monitor.mark("attempt_" + attempts);

				// Fetch with timeout
				const controller = new AbortController();
				const timeoutId = setTimeout(
					() => controller.abort(),
					CONFIG.TIMEOUT_SECONDS * 1000
				);

				// For Git operations, don't use Cloudflare-specific options
				const finalFetchOptions = isGit
					? { ...fetchOptions, signal: controller.signal }
					: { ...fetchOptions, signal: controller.signal };

				response = await fetch(targetUrl, finalFetchOptions);

				clearTimeout(timeoutId);

				if (response.ok || response.status === 206) {
					monitor.mark("success");
					break;
				}

				// Don't retry on client errors (4xx) - these won't improve with retries
				if (response.status >= 400 && response.status < 500) {
					monitor.mark("client_error");
					break;
				}

				attempts++;
				if (attempts < CONFIG.MAX_RETRIES) {
					await new Promise((resolve) =>
						setTimeout(resolve, CONFIG.RETRY_DELAY_MS * attempts)
					);
				}
			} catch (error) {
				attempts++;
				if (error.name === "AbortError") {
					return new Response("Request timeout", {
						status: 408,
						headers: addSecurityHeaders(new Headers()),
					});
				}
				if (attempts >= CONFIG.MAX_RETRIES) {
					return new Response(
						`Failed after ${CONFIG.MAX_RETRIES} attempts: ${error.message}`,
						{
							status: 500,
							headers: addSecurityHeaders(new Headers()),
						}
					);
				}
				// Wait before retrying
				await new Promise((resolve) =>
					setTimeout(resolve, CONFIG.RETRY_DELAY_MS * attempts)
				);
			}
		}

		// Check if we have a valid response after all attempts
		if (!response) {
			return new Response("No response received after all retry attempts", {
				status: 500,
				headers: addSecurityHeaders(new Headers()),
			});
		}

		// If response is still not ok after all retries, return the error
		if (!response.ok && response.status !== 206) {
			const errorText = await response.text().catch(() => "Unknown error");
			return new Response(
				`Upstream server error (${response.status}): ${errorText}`,
				{
					status: response.status,
					headers: addSecurityHeaders(new Headers()),
				}
			);
		}

		// Prepare response headers
		const headers = new Headers(response.headers);

		if (isGit) {
			// For Git operations, preserve all headers from the upstream response
			// Git protocol is very sensitive to header changes
			// Don't add any additional headers that might interfere with Git protocol
			// The response headers from GitHub/GitLab should be passed through as-is
		} else {
			// Regular file download headers
			headers.set("Cache-Control", `public, max-age=${CONFIG.CACHE_DURATION}`);
			headers.set("X-Content-Type-Options", "nosniff");
			headers.set("Accept-Ranges", "bytes");
			addSecurityHeaders(headers);
		}

		// Create final response
		const finalResponse = new Response(response.body, {
			status: response.status,
			headers: headers,
		});

		// Cache successful responses (skip caching for Git operations)
		if (!isGit && (response.ok || response.status === 206)) {
			ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
		}

		monitor.mark("complete");
		return isGit
			? finalResponse
			: addPerformanceHeaders(finalResponse, monitor);
	} catch (error) {
		console.error("Error handling request:", error);
		return new Response(`Internal Server Error: ${error.message}`, {
			status: 500,
			headers: addSecurityHeaders(new Headers()),
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
	headers.set("X-Performance-Metrics", JSON.stringify(monitor.getMetrics()));
	addSecurityHeaders(headers);
	return new Response(response.body, {
		status: response.status,
		headers: headers,
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
	},
};
