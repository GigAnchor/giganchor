import { describe, it, expect } from "vitest";
import { getDocBySlug } from "../mdx";

describe("docs/guide/cli", () => {
  it("resolves through the docs pipeline with correct frontmatter", () => {
    const doc = getDocBySlug("guide/cli");
    expect(doc).not.toBeNull();
    expect(doc!.frontmatter.title).toBe("CLI Tool");
    expect(doc!.frontmatter.section).toBe("Guides");
    expect(doc!.frontmatter.order).toBe(23);
  });

  it("documents configuration resolution priority order accurately", () => {
    const doc = getDocBySlug("guide/cli")!;
    expect(doc.content).toContain("OFFERHUB_API_URL");
    expect(doc.content).toContain("OFFERHUB_API_KEY");
    expect(doc.content).toContain("~/.offerhub/config.json");
    expect(doc.content).toContain(".env");
  });

  it("marks keys revoke as unavailable in API", () => {
    const doc = getDocBySlug("guide/cli")!;
    expect(doc.content).toContain("keys revoke");
    expect(doc.content).toContain("Unavailable in API");
    expect(doc.content).toContain("DELETE /auth/api-keys/:id");
  });

  it("marks maintenance commands as unavailable in API", () => {
    const doc = getDocBySlug("guide/cli")!;
    expect(doc.content).toContain("Maintenance Commands");
    expect(doc.content).toContain("Unavailable in API");
    expect(doc.content).toContain("admin/maintenance");
  });

  it("clarifies that keys list/create user-id option is not supported by API", () => {
    const doc = getDocBySlug("guide/cli")!;
    expect(doc.content).toContain("--user-id");
    expect(doc.content).toContain("Not supported in API");
  });

  it("documents that token TTL is fixed at 1 hour by backend", () => {
    const doc = getDocBySlug("guide/cli")!;
    expect(doc.content).toContain("keys token");
    expect(doc.content).toContain("1 hour");
    expect(doc.content).toContain("3600");
  });

  it("includes cross-link to the scaffolder guide", () => {
    const doc = getDocBySlug("guide/cli")!;
    expect(doc.content).toContain("/docs/guide/scaffolder");
  });
});
