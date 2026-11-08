# Drips Appeal — Giganchor

## The question

> **What development work / improvements have you made since the repo was initially rejected?**

## Short answer

The repository went from a docs site that happened to pass CI to a project with a
hardened API, zero high-severity advisories, a build that runs on the current
framework major, an accessibility suite that catches real regressions, and a
documentation set that matches what the code actually does.

Seven pull requests, each reviewed by CI (typecheck, lint, class audit, build,
coverage, backend tests, and a Playwright route-level accessibility run) and each
merged only when green:

| PR | What it does | Evidence |
| --- | --- | --- |
| [#15](https://github.com/GigAnchor/giganchor/pull/15) | zod 3 → 4 across site and MCP, glob 11 → 14, patched `picomatch`, refreshed test toolchain | MCP advisories **3 → 0**; root advisories 19 → 12, high 3 → 1 |
| [#16](https://github.com/GigAnchor/giganchor/pull/16) | Backend hardening: fail-closed CORS, JSON error contract, request limits, port validation, graceful shutdown | **14 new API tests**; CORS now denies by default in production |
| [#17](https://github.com/GigAnchor/giganchor/pull/17) | Coverage for the sitemap and robots metadata routes, including the canonical-URL override | **7 new tests**; suite 587 → 594 |
| [#18](https://github.com/GigAnchor/giganchor/pull/18) | Next.js 15 → 16, flat ESLint config, Turbopack migration | root **high advisories 1 → 0** |
| [#19](https://github.com/GigAnchor/giganchor/pull/19) | MCP sources resolve natively under Turbopack (no alias bridge) | emitted MCP build unchanged and verified at runtime |
| [#21](https://github.com/GigAnchor/giganchor/pull/21) | README rewritten to describe the real project, stack and maintainer | every internal link checked; no code touched |
| [#22](https://github.com/GigAnchor/giganchor/pull/22) | 25 React Compiler violations fixed and the rules re-enabled | lint **0 errors**, no suppressions added |

## 1. Dependency and framework majors

The repo was pinned to a Next.js major whose vendored `postcss` copy carried an
unpatched XSS / source-map advisory. `npm audit` only offers a fix at Next 16, so
the framework major was the last high-severity item.

That upgrade was not a version bump. Next 16 **removed `next lint`** and made
**Turbopack the default**, which refuses a `webpack` config. Both were real
migrations:

- lint moved to the ESLint CLI against a new flat `eslint.config.mjs` that keeps
  the previous site-only scope;
- the webpack `resolve.extensionAlias` existed only so the server could import
  the MCP package's TypeScript sources; it was replaced properly in #19 rather
  than carried forward.

zod 3 → 4 also needed real code changes in both packages, and the MCP `glob`
major came with it.

**Result:** root advisories 19 (3 high) → 12 (0 high, 0 critical); MCP 3 → 0;
backend 0.

## 2. Backend hardening

The API was a single file with permissive defaults. It now has a tested shape:

- **CORS fails closed.** `CORS_ORIGINS` is an allowlist; unset allows any origin
  outside production and **none** in production. Previously every deployment
  accepted every origin.
- **One error contract.** Malformed JSON returns `400` with a JSON body instead
  of an HTML stack trace, unknown routes return JSON `404`, and unhandled errors
  return a JSON `500` without leaking internals.
- **`x-powered-by` disabled**, JSON bodies capped at 100 kB, `PORT` validated at
  startup instead of failing later.
- **Graceful shutdown.** SIGTERM/SIGINT stop accepting connections and give
  in-flight requests 10 seconds before exiting.

All of it is covered by 14 `node:test` cases that exercise the real HTTP surface
through `createApp()`, no new runtime dependency was added, and the root test
runner was taught to exclude the backend package so both suites stay independent.

## 3. Build correctness

The Turbopack upgrade initially shipped with two `turbopack.resolveAlias` entries
pointing back into `mcp/src`, because the MCP package compiles with Node16
resolution (`.js` specifiers) while the app imports its `.ts` sources. That bridge
would need a new entry for every future module and could silently redirect any
matching specifier elsewhere in the graph.

#19 removes it using TypeScript 5.7's `rewriteRelativeImportExtensions`: sources
name `.ts` files, Turbopack resolves real paths, and the compiler rewrites the
specifiers back to `.js` on emit so the published CLI still runs under Node's ESM
loader. The emitted output was verified by importing `build/docs-loader.js` after
the build.

## 4. Accessibility

CI runs a Playwright suite that checks every route at multiple widths and colour
schemes for touch-target size, overflow, and keyboard navigation. It surfaced a
control sitting exactly on the 24×24 floor whose measured height dropped below it
depending on the text length of the pull requests fetched at build time. The
target now has a 28px floor, so the route is deterministic instead of
intermittently failing.

## 5. Coverage gaps

The sitemap and robots handlers were the only route handlers without tests. #17
adds 7 cases covering the route list, the canonical origin, the `NEXT_PUBLIC_SITE_URL`
override, and the invalid-URL fallback — the same logic that feeds search engine
metadata for every page.

The suite now stands at **60 files / 594 tests**, plus **14 backend tests** and the
Playwright accessibility run.

## 6. Lint and React Compiler correctness

Enabling the React Compiler rules from `eslint-plugin-react-hooks` v6 surfaced 25
genuine issues: state written from effects, refs read during render, components
constructed during render. All 25 were fixed with the patterns React documents —
`useSyncExternalStore` for browser reads, render-time derivation instead of effect
write-backs, route-keyed state, `IntersectionObserver`/`ResizeObserver` for
measurement, and DOM queries instead of ref arrays. **No rule is disabled and no
suppression was added.**

That last change also removed a stale-state bug: the page-actions menu kept a
mutable ref array indexed by render position, which could retain stale entries
when the menu items changed. It now reads the rendered items at event time.

## 7. Documentation accuracy

The root README described a different stack (NestJS, Prisma, BullMQ) and listed
maintainers who do not work on this repository. It now documents what is in the
tree — Next.js 16, React 19, TypeScript, the Express API, the MCP server, the test
setup — with a quick start that works from a clean clone, a configuration table
that matches `.env.example`, and a documentation map whose links all resolve.

## Verification snapshot

- `main` CI: **Frontend Build, Backend Build, OpenAPI Spec Staleness, Route-level
  a11y & keyboard-nav — all passing** after every merge.
- `npm test`: **60 files / 594 tests** passing (up from 587 before this work).
- `cd backend && npm test`: **14 tests** passing (the package had no suite).
- `npm run typecheck`, `npm run lint` (0 errors), `npm run build` (Turbopack, 71
  static pages), `npm run build --workspace mcp`: all clean.
- `npm audit`: root **0 high / 0 critical**, `mcp/` **0 advisories**, `backend/` **0**.

## What is next (not claimed as done)

- The remaining moderate advisories need upstream majors: `@typescript-eslint`
  (npm's proposed "fix" downgrades to a version that crashes ESLint 9),
  `@tailwindcss/typography`, and the Mermaid/KaTeX chain. Each is tracked rather
  than papered over.
- The API scaffold is intentionally small; the next meaningful step is a real
  order/milestone lifecycle behind the endpoints that already have contracts and
  documentation.
