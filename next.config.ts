import type { NextConfig } from "next";
import { getSecurityHeaders } from "./config/security-headers";
import { logger } from "./src/utils/logger";
import { SITE_URL, normalizeSiteUrl } from "./src/constants/site";

if (
  process.env.NODE_ENV === "production" &&
  !normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
) {
  logger.warn(
    "\x1b[33m%s\x1b[0m",
    `⚠️ WARNING: NEXT_PUBLIC_SITE_URL is missing or invalid in the production environment. ` +
    `Canonical URLs and CORS will fall back to '${SITE_URL}', which is wrong if the site is hosted elsewhere.`
  );
}

const siteUrl = SITE_URL;

const corsHeaders = [
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Origin", value: siteUrl },
  { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
  {
    key: "Access-Control-Allow-Headers",
    value:
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = getSecurityHeaders();
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/api/:path*", headers: [...securityHeaders, ...corsHeaders] },
    ];
  },
  async rewrites() {
    // `[...slug]` is a catch-all and Next.js requires catch-all segments to be
    // the last part of a route, so `/docs/[...slug]/raw/route.ts` cannot exist
    // alongside `/docs/[...slug]/page.tsx`. The raw-Markdown handler instead
    // lives at the non-conflicting `/api/docs-raw/[...slug]` path, and this
    // rewrite keeps the public URL at the documented `/docs/<slug>/raw`.
    return [
      { source: "/docs/:slug*/raw", destination: "/api/docs-raw/:slug*" },
    ];
  },
  turbopack: {
    // mcp/ compiles with Node16 module resolution, so its internal imports
    // carry `.js` extensions that point at `.ts` sources. Webpack's
    // `extensionAlias` used to bridge that; Turbopack needs the mapping spelled
    // out because the server imports mcp/src/index.ts directly.
    resolveAlias: {
      "./docs-loader.js": "./mcp/src/docs-loader.ts",
      "./collect-files.generated.js": "./mcp/src/collect-files.generated.ts",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
