/**
 * Community channels.
 *
 * The project does not run its own chat servers, so every channel points at a
 * GitHub surface that maintainers actually monitor. Keeping them in one module
 * means the footer, the community page and the accessibility page cannot drift
 * apart.
 */
import { GITHUB_REPO_URL } from "./github";

export const SOCIAL_GITHUB = GITHUB_REPO_URL;
export const SOCIAL_DISCUSSIONS = `${GITHUB_REPO_URL}/discussions`;
export const SOCIAL_ISSUES = `${GITHUB_REPO_URL}/issues`;
