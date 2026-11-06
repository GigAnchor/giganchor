import { DOCS_REPO_BLOB_BASE } from "./github";

/**
 * Repository-relative documentation files that the marketing site links to as
 * "read the source" references.
 *
 * Keeping the paths in one map lets `repo-docs.test.ts` assert that every target
 * exists in the checkout, so a renamed page cannot silently turn into a 404.
 */
export const REPO_DOC_PATHS = {
  apiReferenceOverview: "content/docs/api-reference/overview.mdx",
  sdkQuickStart: "content/docs/sdk/quick-start.mdx",
  architectureOverview: "docs/architecture/overview.md",
  paymentFlows: "docs/architecture/payment-flows.md",
  dataModel: "docs/architecture/data-model.md",
} as const;

export type RepoDocKey = keyof typeof REPO_DOC_PATHS;

export function repoDocUrl(key: RepoDocKey): string {
  return `${DOCS_REPO_BLOB_BASE}/${REPO_DOC_PATHS[key]}`;
}
