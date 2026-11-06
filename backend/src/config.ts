import type { CorsOptions } from "cors";

export const DEFAULT_PORT = 4000;

/**
 * Parses PORT, failing at startup instead of silently listening on NaN.
 */
export function parsePort(raw: string | undefined = process.env.PORT): number {
  if (raw === undefined || raw.trim() === "") return DEFAULT_PORT;

  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT "${raw}": expected an integer between 1 and 65535.`
    );
  }
  return port;
}

/**
 * CORS_ORIGINS is a comma-separated allowlist, e.g.
 * "https://giganchor.example,https://staging.giganchor.example".
 * Trailing slashes are dropped so entries compare equal to the Origin header.
 */
export function parseAllowedOrigins(
  raw: string | undefined = process.env.CORS_ORIGINS
): string[] {
  if (!raw) return [];

  const origins = raw
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return [...new Set(origins)];
}

/**
 * Without an allowlist the API stays usable for local development, where the
 * site and the API run on different ports. In production an empty allowlist
 * means no browser origin is granted cross-origin access, so a missing
 * CORS_ORIGINS fails closed rather than exposing the API to every site.
 */
export function buildCorsOptions(
  allowedOrigins: string[],
  isProduction: boolean
): CorsOptions {
  if (allowedOrigins.length === 0) {
    return { origin: isProduction ? false : "*" };
  }

  return {
    origin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  };
}
