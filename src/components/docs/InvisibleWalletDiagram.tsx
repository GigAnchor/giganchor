import { MermaidDiagram } from "@/components/shared/MermaidDiagram";

/**
 * Invisible wallet model diagram.
 *
 * Source of truth in the OFFER-HUB orchestrator repository:
 * - apps/api/src/modules/wallet/wallet.service.ts (createWallet) — generates a
 *   Stellar keypair per user, stores the public address, and persists the
 *   private key encrypted; users interact with an off-chain balance, while
 *   assets live in the omnibus wallet on Stellar.
 * - apps/api/src/utils/crypto.ts — AES-256-GCM encryption of the private key,
 *   stored as iv:authTag:ciphertext in hexadecimal.
 *
 * The flowchart keeps the "what the user sees" vs "what happens behind the
 * scenes" split from the original inline diagram in docs/guide/wallets.mdx.
 */
const INVISIBLE_WALLET_CHART = `flowchart LR
    subgraph UserSees["What the user sees"]
        UI_BALANCE["Balance: 100.00 USD"]
    end

    subgraph Behind["Behind the scenes on Stellar"]
        ADDR["Stellar address: GCV24WNJ..."]
        BAL["USDC balance: 100.0000000"]
        KEY["Private key: AES-256-GCM encrypted"]
    end

    UserSees --> Behind`;

export function InvisibleWalletDiagram() {
  return <MermaidDiagram chart={INVISIBLE_WALLET_CHART} variant="framed" />;
}

export default InvisibleWalletDiagram;
