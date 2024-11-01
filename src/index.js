import { CONFIG } from "./config";

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
 * Validates incoming requests against security rules
 * @param {Request} request - The incoming request object
 * @param {URL} url - Parsed URL object
 * @returns {{valid: boolean, error?: string, status?: number}} Validation result
 */
function validateRequest(request, url) {
	if (!CONFIG.SECURITY.ALLOWED_METHODS.includes(request.method)) {
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
		const [_, platform, ...pathParts] = url.pathname.split("/");
		if (!platform || !CONFIG.PLATFORMS[platform]) {
			return new Response("Invalid or missing platform", {
				status: 400,
				headers: addSecurityHeaders(new Headers()),
			});
		}

		// Transform URL based on platform
		const targetPath = CONFIG.PLATFORMS[platform].transform(url.pathname);
		const targetUrl = `${CONFIG.PLATFORMS[platform].base}${targetPath}`;

		// Check cache first
		const cache = caches.default;
		const cacheKey = new Request(targetUrl, request);
		let response = await cache.match(cacheKey);

		if (response) {
			monitor.mark("cache_hit");
			return response;
		}

		const fetchOptions = {
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
			headers: {
				"Accept-Encoding": "gzip, deflate, br",
				Connection: "keep-alive",
				"User-Agent": "Wget/1.21.3",
				Origin: request.headers.get("Origin") || "*",
			},
		};

		// Handle range requests
		const rangeHeader = request.headers.get("Range");
		if (rangeHeader) {
			fetchOptions.headers["Range"] = rangeHeader;
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

				response = await fetch(targetUrl, {
					...fetchOptions,
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (response.ok || response.status === 206) {
					monitor.mark("success");
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
					return new Response("Request timeout", { status: 408 });
				}
				if (attempts >= CONFIG.MAX_RETRIES) {
					return new Response(
						`Failed after ${CONFIG.MAX_RETRIES} attempts: ${error.message}`,
						{ status: 500 }
					);
				}
			}
		}

		// Prepare response headers
		const headers = new Headers(response.headers);
		headers.set("Cache-Control", `public, max-age=${CONFIG.CACHE_DURATION}`);
		headers.set("X-Content-Type-Options", "nosniff");
		headers.set("Accept-Ranges", "bytes");
		addSecurityHeaders(headers);

		// Create final response
		const finalResponse = new Response(response.body, {
			status: response.status,
			headers: headers,
		});

		// Cache successful responses
		if (response.ok || response.status === 206) {
			ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
		}

		monitor.mark("complete");
		return addPerformanceHeaders(finalResponse, monitor);
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
