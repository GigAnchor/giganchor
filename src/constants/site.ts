/** Used when `NEXT_PUBLIC_SITE_URL` is unset or malformed. */
export const SITE_URL_FALLBACK = "https://giganchor.tech";
export const SITE_NAME = "GIGANCHOR";

/**
 * Normalizes a configured site URL to an absolute origin without a trailing
 * slash, so `${SITE_URL}${path}` never produces a double slash.
 *
 * Returns `null` for empty, relative or non-http(s) values instead of throwing,
 * which keeps a bad environment variable from breaking the build.
 */
export function normalizeSiteUrl(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Canonical origin for metadata, sitemap, robots, llms.txt and absolute links.
 * Read this instead of `process.env.NEXT_PUBLIC_SITE_URL` so every surface uses
 * the same value and the same fallback.
 */
export const SITE_URL =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? SITE_URL_FALLBACK;
