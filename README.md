# Giganchor

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" alt="Node.js 20" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript" alt="TS 5.4" />
  <img src="https://img.shields.io/badge/NestJS-10.x-red?style=for-the-badge&logo=nestjs" alt="NestJS 10" />
  <img src="https://img.shields.io/badge/Prisma-5.x-teal?style=for-the-badge&logo=prisma" alt="Prisma 5" />
  <img src="https://img.shields.io/badge/Stellar-Wallet-black?style=for-the-badge&logo=stellar" alt="Stellar" />
</p>

```
 ██████╗  ██╗  ██████╗   █████╗  ███╗   ██╗  ██████╗ ██╗  ██╗  ██████╗  ██████╗
██╔════╝  ██║ ██╔════╝  ██╔══██╗ ████╗  ██║ ██╔════╝ ██║  ██║ ██╔═══██╗ ██╔══██╗
██║  ███╗ ██║ ██║  ███╗ ███████║ ██╔██╗ ██║ ██║      ███████║ ██║   ██║ ██████╔╝
██║   ██║ ██║ ██║   ██║ ██╔══██║ ██║╚██╗██║ ██║      ██╔══██║ ██║   ██║ ██╔══██╗
╚██████╔╝ ██║ ╚██████╔╝ ██║  ██║ ██║ ╚████║ ╚██████╗ ██║  ██║ ╚██████╔╝ ██║  ██║
 ╚═════╝  ╚═╝  ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝  ╚═════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═╝  ╚═╝

--------------- Marketplaces Orchestrator & Freelance Platform ---------------
```

**Giganchor** is a self-hosted payments orchestration system designed for Marketplaces. It manages a Web2-like experience (balances, top-ups, payments with escrow, and withdrawals) using **Airtm** for fund management and **Trustless Work** for non-custodial escrows on the Stellar network.

##  Features

- 💰 **User Balances**: Internal management of available and reserved balances.
- ⚡ **Top-ups**: Fast reloads via Airtm.
- 🤝 **Smart Escrow**: Secure checkout with non-custodial escrow via TW.
- 💸 **Withdrawals**: Direct withdrawals to Airtm accounts.
- 🔐 **Secure & Audited**: Native idempotency, audit logs, and modular architecture.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (API Server)
- **Runtime**: Node.js 20 LTS
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache & Queues**: Redis + [BullMQ](https://docs.bullmq.io/)
- **Monorepo**: npm Workspaces

## 🏁 Quick Start

1. **Clone and Prepare**:
   ```bash
   git clone https://github.com/GigAnchor/giganchor.git
   cd giganchor
   ```

2. **Install Dependencies**:
   ```bash
   npm ci
   ```

3. **Run the Docs Site in Development**:
   ```bash
   npm run dev
   ```
   The site is served at <http://localhost:3000>. No database, Docker or
   credentials are needed for the docs site; every page is built from
   `content/docs/` and the local `src/` code.

4. **Run the Tests** (optional but recommended before a PR):
   ```bash
   npm test
   ```

To work on the standalone API instead, install its dependencies inside
`backend/` and start it separately — `npm run dev` from the repository root
only starts the Next.js app:

```bash
cd backend
npm ci
npm run dev      # http://localhost:4000
```

The MCP server in `mcp/` is an npm workspace of the root package, so the root
`npm ci` installs it too; see [`mcp/README.md`](./mcp/README.md) for its build
and usage instructions.

## 🏗️ Project Structure

```
giganchor/
├── src/              # Next.js app: marketing site + docs website
├── backend/          # Standalone Express API (own package.json, installed separately)
├── mcp/              # MCP server exposing content/docs/ to AI assistants
│                     # (npm workspace of the root package)
├── content/docs/     # Public docs website content (MDX, rendered under /docs)
├── docs/             # Internal engineering documentation (Markdown, read on GitHub)
├── config/           # Shared app-level config (e.g. security headers)
└── scripts/          # Build/codegen scripts (OpenAPI, docs search index)
```

The root `package.json` declares `mcp` as a workspace, so `npm ci` at the
repository root installs the docs site and the MCP server. `backend/` is not
a workspace: it has its own `package.json` and lockfile and must be installed
separately.

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs/) folder:

### Quick Start
- 🧠 **[AI Context](./docs/ai-context.md)** - Development guide for AI assistants (Read first!)
- 📖 **[Main Documentation](./docs/README.md)** - Complete documentation index

### Core Documentation
- 📐 [Architecture Overview](./docs/architecture/overview.md) - System architecture
- 📋 [Product Overview](./docs/business/product-overview.md) - Vision, goals, and value proposition
- 📚 [Use Cases](./docs/business/use-cases.md) - Common marketplace scenarios

### Development
- 💻 [Naming Conventions](./docs/standards/naming-conventions.md) - File, variable, and function naming rules
- 🔌 [API Design](./docs/backend/api-design.md) - Backend API patterns
- 🤝 [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute

## 🎯 Use Cases

### Freelance Marketplace (Primary)
Connect freelancers with clients using escrow protection:
1. Client tops up balance via Airtm
2. Client pays for project → funds go to escrow (Trustless Work)
3. Freelancer completes work
4. Client approves → funds released instantly to freelancer
5. Freelancer withdraws to Airtm

### Other Marketplaces
- **E-commerce**: Buyer/seller escrow with delivery confirmation
- **Service Marketplaces**: Service booking with payment protection
- **Digital Goods**: Instant or escrow-based delivery
- **Gig Economy**: Worker/client escrow with job completion

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 🧪 Tests

The frontend suite runs on Vitest. A plain `npm ci` is enough — no `.env` file,
no credentials, and no network access are required.

```bash
npm run test          # run the suite once
npm run test:watch    # re-run affected tests as you edit
npm run test:coverage # run the suite and enforce coverage thresholds
```

Tests live in `__tests__/` folders beside the code they cover. CI runs
`npm run typecheck`, `npm run lint`, `npm run build` and
`npm run test:coverage`, and fails when coverage drops below the thresholds
in `vitest.config.ts`. See the
[Testing section of the contribution guide](./docs/CONTRIBUTING.md#testing)
for conventions and what is expected of a PR.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [/docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/GigAnchor/giganchor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GigAnchor/giganchor/discussions)

## 👥 Maintainers

- [@Josue19-08](https://github.com/Josue19-08) - Project Lead & Full-Stack Developer
- [@KevinMB0220](https://github.com/KevinMB0220) - Core Contributor & Developer

## 🙏 Acknowledgments

Built with ❤️ for the decentralized marketplace future.

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [BullMQ](https://docs.bullmq.io/) - Premium message queue
- [Airtm](https://www.airtm.com/) - Payment infrastructure
- [Trustless Work](https://trustlesswork.com/) - Non-custodial escrow on Stellar

---

<p align="center">
  <i>🚀 Empowering marketplaces with trustless payments 🚀</i>
</p>

---
