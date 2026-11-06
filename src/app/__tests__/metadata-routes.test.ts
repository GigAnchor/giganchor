import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `sitemap.ts` reads the generated docs search index. Mocking it keeps the
 * assertions about fragment stripping and de-duplication independent of
 * whatever `content/docs` happens to contain.
 */
vi.mock("@/data/docs-index.json", () => ({
  default: [
    { title: "Getting Started", link: "/docs/getting-started" },
    { title: "Authentication", link: "/docs/guides/overview#authentication" },
    { title: "Same page again", link: "/docs/getting-started" },
    { title: "Blog post", link: "/blog/release" },
    { title: "Entry without a link", link: null },
  ],
}));

const STATIC_ROUTES = [
  "",
  "/use-cases",
  "/blueprint",
  "/pricing",
  "/changelog",
  "/community",
  "/docs",
  "/terms",
  "/privacy",
  "/contact",
  "/accessibility",
];

async function loadMetadataRoutes() {
  const [{ default: sitemap }, { default: robots }, { SITE_URL }] =
    await Promise.all([
      import("../sitemap"),
      import("../robots"),
      import("@/constants/site"),
    ]);

  return { sitemap, robots, SITE_URL };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("sitemap", () => {
  it("lists every static route exactly once under the configured site origin", async () => {
    const { sitemap, SITE_URL } = await loadMetadataRoutes();
    const urls = sitemap().map((entry) => entry.url);

    for (const route of STATIC_ROUTES) {
      const expected = `${SITE_URL}${route}`;
      expect(urls.filter((url) => url === expected)).toHaveLength(1);
    }
  });

  it("gives the root highest priority and the rest a lower one", async () => {
    const { sitemap, SITE_URL } = await loadMetadataRoutes();
    const entries = sitemap();

    expect(entries.find((entry) => entry.url === SITE_URL)?.priority).toBe(1);
    expect(
      entries.find((entry) => entry.url === `${SITE_URL}/pricing`)?.priority
    ).toBe(0.8);
  });

  it("strips hash fragments, de-duplicates docs pages and ignores non-docs links", async () => {
    const { sitemap, SITE_URL } = await loadMetadataRoutes();
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain(`${SITE_URL}/docs/getting-started`);
    expect(urls.filter((url) => url === `${SITE_URL}/docs/getting-started`)).toHaveLength(1);
    expect(urls).toContain(`${SITE_URL}/docs/guides/overview`);
    expect(urls.some((url) => url.includes("#"))).toBe(false);
    expect(urls.some((url) => url.includes("/blog/release"))).toBe(false);
  });

  it("emits absolute URLs with no double slashes", async () => {
    const { sitemap } = await loadMetadataRoutes();

    for (const { url } of sitemap()) {
      expect(url).toMatch(/^https?:\/\/[^/]+(\/[^/].*)?$/);
    }
  });

  it("follows NEXT_PUBLIC_SITE_URL, including a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.example.test/");
    vi.resetModules();

    const { sitemap } = await loadMetadataRoutes();
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.every((url) => url.startsWith("https://staging.example.test"))).toBe(true);
    expect(urls).toContain("https://staging.example.test/pricing");
    expect(urls.some((url) => url.includes("staging.example.test//"))).toBe(false);
  });
});

describe("robots", () => {
  it("allows crawling, blocks the API and admin areas, and points at the sitemap", async () => {
    const { robots, SITE_URL } = await loadMetadataRoutes();

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });

  it("follows NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.example.test/");
    vi.resetModules();

    const { robots } = await loadMetadataRoutes();

    expect(robots().sitemap).toBe("https://staging.example.test/sitemap.xml");
  });
});
