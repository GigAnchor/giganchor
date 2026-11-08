import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import type { Express } from "express";
import { createApp } from "../app";

async function withServer(
  app: Express,
  run: (baseUrl: string) => Promise<void>
): Promise<void> {
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test("GET / reports the API is ready", async () => {
  await withServer(createApp({ isProduction: false }), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      message: "Giganchor API - Ready to build something new.",
    });
  });
});

test("GET /health reports ok", async () => {
  await withServer(createApp({ isProduction: false }), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  });
});

test("unknown routes answer with JSON instead of the default HTML page", async () => {
  await withServer(createApp({ isProduction: false }), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/does-not-exist`);
    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type") ?? "", /application\/json/);
    assert.deepEqual(await response.json(), { error: "Not found" });
  });
});

test("malformed JSON bodies are rejected as a client error, not a 500", async () => {
  await withServer(createApp({ isProduction: false }), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "Invalid request body" });
  });
});

test("does not advertise the framework via x-powered-by", async () => {
  await withServer(createApp({ isProduction: false }), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.headers.get("x-powered-by"), null);
  });
});

test("an allowlisted origin is granted cross-origin access", async () => {
  const app = createApp({
    allowedOrigins: ["https://site.example"],
    isProduction: true,
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { origin: "https://site.example" },
    });
    assert.equal(
      response.headers.get("access-control-allow-origin"),
      "https://site.example"
    );
  });
});

test("an origin outside the allowlist gets no CORS grant", async () => {
  const app = createApp({
    allowedOrigins: ["https://site.example"],
    isProduction: true,
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { origin: "https://attacker.example" },
    });
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  });
});

test("production without CORS_ORIGINS grants no cross-origin access", async () => {
  await withServer(createApp({ isProduction: true }), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { origin: "https://any.example" },
    });
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  });
});
