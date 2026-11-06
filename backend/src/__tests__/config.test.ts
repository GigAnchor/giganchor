import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PORT,
  buildCorsOptions,
  parseAllowedOrigins,
  parsePort,
} from "../config";

test("parsePort falls back to the default port when PORT is unset", () => {
  assert.equal(parsePort(undefined), DEFAULT_PORT);
  assert.equal(parsePort(""), DEFAULT_PORT);
});

test("parsePort accepts a valid port", () => {
  assert.equal(parsePort("8080"), 8080);
  assert.equal(parsePort("1"), 1);
  assert.equal(parsePort("65535"), 65535);
});

test("parsePort rejects values that would make the server listen on NaN", () => {
  for (const raw of ["not-a-port", "0", "-1", "65536", "3000.5"]) {
    assert.throws(() => parsePort(raw), /Invalid PORT/, `expected ${raw} to fail`);
  }
});

test("parseAllowedOrigins splits, trims, strips trailing slashes and dedupes", () => {
  assert.deepEqual(
    parseAllowedOrigins(" https://a.example/ , https://b.example ,https://a.example"),
    ["https://a.example", "https://b.example"]
  );
  assert.deepEqual(parseAllowedOrigins(undefined), []);
  assert.deepEqual(parseAllowedOrigins(""), []);
  assert.deepEqual(parseAllowedOrigins(" , "), []);
});

test("buildCorsOptions allows any origin outside production when no allowlist is set", () => {
  assert.equal(buildCorsOptions([], false).origin, "*");
});

test("buildCorsOptions fails closed in production when no allowlist is set", () => {
  assert.equal(buildCorsOptions([], true).origin, false);
});
