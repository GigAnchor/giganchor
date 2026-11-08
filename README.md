# Giganchor

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Stellar-Network-black?style=for-the-badge&logo=stellar" alt="Stellar" />
  <img src="https://img.shields.io/badge/MCP-Server-purple?style=for-the-badge" alt="MCP server" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT license" />
</p>

```
 ██████╗  ██╗  ██████╗   █████╗  ███╗   ██╗  ██████╗ ██╗  ██╗  ██████╗  ██████╗
██╔════╝  ██║ ██╔════╝  ██╔══██╗ ████╗  ██║ ██╔════╝ ██║  ██║ ██╔═══██╗ ██╔══██╗
██║  ███╗ ██║ ██║  ███╗ ███████║ ██╔██╗ ██║ ██║      ███████║ ██║   ██║ ██████╔╝
██║   ██║ ██║ ██║   ██║ ██╔══██║ ██║╚██╗██║ ██║      ██╔══██║ ██║   ██║ ██╔══██╗
╚██████╔╝ ██║ ╚██████╔╝ ██║  ██║ ██║ ╚████║ ╚██████╗ ██║  ██║ ╚██████╔╝ ██║  ██║
 ╚═════╝  ╚═╝  ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝  ╚═════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═╝  ╚═╝
------------------- The open record for escrow-anchored work -------------------
```

**Giganchor turns a handshake into a record.** A gig — a freelance sprint, a delivery, a bounty, a payroll stream — becomes an *anchored agreement*: the scope, its milestones, the conditions that release money, the dispute path, and the closing record. Funds sit in escrow on Stellar (Trustless Work) or move through AirTM; Giganchor itself never holds them.

The unit of the system is the **agreement**, not the wallet. Balances, orders and top-ups are plumbing underneath; what people come back for is a shared, auditable answer to *what was agreed, what was delivered, and what was paid*.

> **One-line description for GitHub About**
> Open source infrastructure for escrow-anchored work: milestone agreements, dispute paths and settlement on Stellar — documented for humans and AI agents.

## Why it exists

Most gig work is agreed in a chat thread and remembered in screenshots. When the work is delivered and the money does not follow, there is nothing to appeal to: no milestone list, no release condition, no shared timeline. Payment tools assume the agreement already exists; marketplaces assume the money is the hard part.

Giganchor treats the agreement as the product surface:

- **Milestones are first-class.** Every agreement is a sequence of deliverables with amounts attached, not one lump sum behind a button.
- **Release is a rule, not a favour.** Time-based, milestone-based or dispute-driven conditions are declared up front and evaluated by the same code path that stores the agreement.
- **Disputes have a shape.** Escalation, evidence and resolution are modelled, so a disagreement is a state transition instead of a support ticket.
- **The record is addressable.** Every agreement has a stable id and closed agreements stay readable, so history survives a dashboard redesign instead of disappearing with it.

## How it works

```
1. Anchor      the parties agree on scope, milestones and release conditions
2. Fund        the payer locks the amount in escrow (never with Giganchor)
3. Deliver     the worker submits each milestone against the anchored record
4. Release     conditions pass → escrow releases; conditions fail → dispute path
5. Attest      the closed agreement stays readable as a portable receipt
```

The reference API in [`backend/`](./backend) and the documented flows in [`content/docs/`](./content/docs) implement this lifecycle end to end.

## What makes this repository different

| | Typical payment integration | Giganchor |
| --- | --- | --- |
| Primary object | Transaction | Agreement with milestones |
| Where the rules live | Product code and support macros | Declared on the agreement, evaluated by the API |
| Who holds funds | The platform | Escrow contract (Trustless Work) or the payment provider (AirTM) |
| Disputes | Email thread | Modelled state with evidence and resolution |
| History | Dashboard rows you lose access to | Readable, addressable record |
| Documentation | A PDF and a stale wiki | The product itself — versioned, searchable, machine-readable |

Two more deliberate choices:

- **Documentation is a first-class surface.** This repository is the docs site as much as it is the API. Every endpoint, error code and flow is written in MDX, built into a searchable site, an OpenAPI file and an MCP server from the same source.
- **AI agents are readers too.** [`mcp/`](./mcp) exposes the entire documentation set over the Model Context Protocol, so an assistant can answer "how do milestones release?" from the same text a developer reads — not from a guess.

## What is in the repository

```
giganchor/
├── src/                # Next.js app: marketing site + documentation website
├── content/docs/       # Public docs (MDX) rendered under /docs and indexed for search
├── backend/            # Standalone Express API (own package.json, installed separately)
├── mcp/                # MCP server exposing content/docs/ to AI assistants
├── docs/               # Internal engineering documentation (read on GitHub)
├── config/             # Shared app config (security headers)
└── scripts/            # Codegen: OpenAPI spec, docs search index, class checks
```

- **Site + docs:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS.
- **API:** Express, runnable on its own, with strict JSON handling, configurable CORS and graceful shutdown.
- **MCP server:** TypeScript, published from `mcp/` as an npm workspace of the root package.
- **Tests:** Vitest + Testing Library for the frontend, Node's test runner for the API, Playwright for route-level accessibility.

## Quick start

```bash
git clone https://github.com/GigAnchor/giganchor.git
cd giganchor
npm ci
npm run dev          # http://localhost:3000
```

No database, Docker or credentials are needed for the site: every page is built from `content/docs/` and the local `src/` code.

```bash
npm test             # frontend suite
npm run test:coverage
npm run typecheck
npm run lint
npm run build
```

To work on the API instead, install it inside its own folder — the root dev script only starts the site:

```bash
cd backend
npm ci
npm run dev          # http://localhost:4000
npm test
```

## Configuration

Everything has a working default; set these only when deploying somewhere real.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://giganchor.tech` | Canonical origin for metadata, sitemap, robots, `llms.txt` and absolute links. |
| `NEXT_PUBLIC_GITHUB_REPO` | `GigAnchor/giganchor` | `owner/name` used by "Edit this page", release feed and community metrics. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the API when running the site locally. |
| `PORT` | `4000` | API port. Invalid values fail at startup. |
| `CORS_ORIGINS` | unset | Comma-separated browser origins allowed to call the API. Unset allows any origin outside production and none in production. |
| `GIGANCHOR_API_KEY` | — | Server-side API key for the orchestrator. Never expose it to a browser. |

The full list, including provider credentials, lives in [`.env.example`](./.env.example).

## Use cases

The docs ship a walkthrough for each of these, with the API calls and the escrow behaviour spelled out:

- **Freelance marketplaces** — milestone escrow from brief to final delivery.
- **E-commerce** — buyer protection with delivery-confirmed release.
- **Service platforms** — bookings held until the service is completed.
- **DAO payroll** — streaming or milestone-based contributor payouts.
- **Real estate** — staged payments tied to inspection checkpoints.

Start with [Build your first marketplace](./content/docs/guide/build-your-first-marketplace.mdx) or the [use case library](./src/components/use-cases).

## Documentation

| Start here | Then |
| --- | --- |
| [Getting started](./content/docs/getting-started.mdx) | [Quick start](./content/docs/guide/quick-start.mdx) |
| [Architecture overview](./docs/architecture/overview.md) | [Data model](./docs/architecture/data-model.md) |
| [Payment flows](./docs/architecture/payment-flows.md) | [Provider integration](./docs/architecture/provider-integration.md) |
| [API reference](./content/docs/api-reference/overview.mdx) | [Error codes](./content/docs/api-reference/errors.mdx) |
| [SDK reference](./content/docs/sdk/quick-start.mdx) | [Self-hosting](./content/docs/guide/self-hosting.mdx) |
| [Contributing](./docs/CONTRIBUTING.md) | [AI context](./docs/ai-context.md) |

The same content is available three ways: the rendered site (`/docs`), the OpenAPI file at [`public/openapi.json`](./public/openapi.json), and the MCP server in [`mcp/`](./mcp).

## Contributing

1. Fork the repository and create a topic branch.
2. Make the change with tests where behaviour changes.
3. Run `npm run typecheck`, `npm run lint` and `npm test` before opening the PR.
4. Describe the *why* in the PR; CI runs typecheck, lint, build, coverage and route-level accessibility.

Conventions, commit style and the review checklist are in [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Maintainer

- **Emmanuel Itighise** — [@EmeditWeb](https://github.com/EmeditWeb) — maintainer and full-stack developer.

## Acknowledgments

- [Stellar](https://stellar.org/) — the settlement network.
- [Trustless Work](https://trustlesswork.com/) — non-custodial escrow contracts.
- [AirTM](https://www.airtm.com/) — fiat on/off ramps for balances.
- [Next.js](https://nextjs.org/) and [Model Context Protocol](https://modelcontextprotocol.io/) — the site and the AI-readable docs layer.

## License

MIT — see [LICENSE](./LICENSE).

---

<p align="center">
  <i>Anchor the work. Settle it fairly.</i>
</p>
