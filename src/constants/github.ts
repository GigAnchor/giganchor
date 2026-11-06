/**
 * Single source of truth for every GitHub URL rendered by the site: the docs
 * "Edit this page" action, code-tab source links, the changelog release feed,
 * the community metrics and the footer/channel links.
 *
 * `NEXT_PUBLIC_GITHUB_REPO` (owner/name) lets a fork or a staging deployment
 * point the site at its own repository without editing code. Invalid values are
 * ignored so a typo cannot produce broken links across the site.
 */
const DEFAULT_REPO_SLUG = "GigAnchor/giganchor";
const REPO_SLUG_PATTERN = /^[^/\s]+\/[^/\s]+$/;

function resolveRepoSlug(): string {
  const configured = process.env.NEXT_PUBLIC_GITHUB_REPO?.trim();

  if (configured && REPO_SLUG_PATTERN.test(configured)) {
    return configured;
  }

  return DEFAULT_REPO_SLUG;
}

export const GITHUB_REPO_SLUG = resolveRepoSlug();
export const GITHUB_REPO_OWNER = GITHUB_REPO_SLUG.split("/")[0];

export const GITHUB_ORG_URL = `https://github.com/${GITHUB_REPO_OWNER}`;
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO_SLUG}`;
export const GITHUB_RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO_SLUG}/releases`;

/** Repositories whose live metrics are aggregated on the community page. */
export const GITHUB_TRACKED_REPOS = [GITHUB_REPO_SLUG];

export const DOCS_REPO_BASE = `${GITHUB_REPO_URL}/blob/main/content/docs`;
export const DOCS_EDIT_BASE = `${GITHUB_REPO_URL}/edit/main`;
export const DOCS_REPO_BLOB_BASE = `${GITHUB_REPO_URL}/blob/main`;
