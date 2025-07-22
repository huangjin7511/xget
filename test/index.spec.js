import {
	createExecutionContext,
	env,
	waitOnExecutionContext,
} from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src";

describe("Xget Worker", () => {
	it("serves homepage for root path", async () => {
		const request = new Request("http://example.com/");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		// The homepage should return HTML content
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/html");

		const html = await response.text();
		expect(html).toContain("<!DOCTYPE html>");
		expect(html).toContain("Xget - 高性能代理服务");
		expect(html).toContain("URL 转换器");
	});

	it("handles invalid platform", async () => {
		const request = new Request("http://example.com/invalid/test");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);
		expect(await response.text()).toBe("Invalid or missing platform");
	});

	it("detects Git clone requests", async () => {
		const request = new Request(
			"http://example.com/gh/user/repo/info/refs?service=git-upload-pack"
		);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		// Should attempt to proxy the Git request (might fail due to network, but shouldn't be 400)
		expect(response.status).not.toBe(400);
	});

	it("handles regular file downloads", async () => {
		const request = new Request(
			"http://example.com/gh/user/repo/archive/main.zip"
		);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		// Should attempt to proxy the file request
		expect(response.status).not.toBe(400);
	});
});
