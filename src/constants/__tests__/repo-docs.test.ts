import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { REPO_DOC_PATHS, repoDocUrl } from "../repo-docs";
import { GITHUB_REPO_URL } from "../github";

describe("repository documentation links", () => {
  it.each(Object.entries(REPO_DOC_PATHS))(
    "links %s to a file that exists in the checkout",
    (_key, relativePath) => {
      expect(existsSync(path.resolve(process.cwd(), relativePath))).toBe(true);
    },
  );

  it.each(Object.keys(REPO_DOC_PATHS) as (keyof typeof REPO_DOC_PATHS)[])(
    "builds a blob URL for %s",
    (key) => {
      expect(repoDocUrl(key)).toBe(
        `${GITHUB_REPO_URL}/blob/main/${REPO_DOC_PATHS[key]}`,
      );
    },
  );
});
