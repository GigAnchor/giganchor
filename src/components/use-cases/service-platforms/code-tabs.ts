import { Server, Monitor } from "lucide-react";
import { repoDocUrl } from "@/constants/repo-docs";
import type {
  CodeIntegrationShowcaseProps,
  CodeTab,
  SdkCard,
} from "@/components/use-cases/shared/CodeIntegrationShowcase";

export const description: CodeIntegrationShowcaseProps["description"] =
  "turns a scope of work into a milestone-based contract — creation, budget funding, and per-milestone release in three explicit calls.";

export const tabs: CodeTab[] = [
  {
    id: "server",
    label: "server.ts",
    lang: "typescript",
    icon: Server,
    description:
      "Service contract creation and budget funding on the server side.",
    docHref: repoDocUrl("apiReferenceOverview"),
    docLabel: "API Reference",
    code: `import { Giganchor } from "@giganchor/sdk";

const oh = new Giganchor({ apiKey: process.env.GIGANCHOR_API_KEY! });

// Create a milestone-based service contract
const contract = await oh.contracts.create({
  client: "GCLIENT_WALLET_ADDRESS",
  provider: "GPROVIDER_WALLET_ADDRESS",
  amount: 8000,
  asset: "USDC",
  currency: "USD",
  milestones: [
    { title: "UX Research & Wireframes", percentage: 30 },
    { title: "Design & Prototyping",     percentage: 40 },
    { title: "Final Delivery & QA",      percentage: 30 },
  ],
});

// Client funds the full contract up-front
const escrow = await oh.escrows.fund(contract.id, {
  walletId: "GCLIENT_WALLET_ADDRESS",
});

console.log("Contract funded:", escrow.status);
// Output: Contract funded: ACTIVE`,
  },
  {
    id: "client",
    label: "client.js",
    lang: "javascript",
    icon: Monitor,
    description:
      "Milestone approval from the client side — releases the matching payment.",
    docHref: repoDocUrl("sdkQuickStart"),
    docLabel: "SDK Guide",
    code: `import { Giganchor } from "@giganchor/sdk";

const oh = new Giganchor({ apiKey: process.env.GIGANCHOR_API_KEY });

// Provider completes milestone 1 — client approves
const approval = await oh.milestones.approve(
  contract.id,
  "milestone_01_id"
);

// Funds for that milestone are released immediately on Stellar
console.log("Milestone released:", approval.released);
// Output: Milestone released: 2400.00 USDC`,
  },
];

export const sdkCards: SdkCard[] = [
  {
    method: "oh.contracts.create()",
    label: "Contract Creation",
    detail:
      "Initialize a milestone-based service contract with SOW terms.",
  },
  {
    method: "oh.escrows.fund()",
    label: "Budget Lock",
    detail: "Lock the full project budget on-chain before work begins.",
  },
  {
    method: "oh.milestones.approve()",
    label: "Milestone Approval",
    detail:
      "Approve a milestone and instantly release the corresponding payment.",
  },
];
