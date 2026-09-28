import { MermaidDiagram } from "@/components/shared/MermaidDiagram";

/**
 * Crypto (Stellar USDC) deposit flow diagram.
 *
 * Source of truth in the OFFER-HUB orchestrator repository:
 * - apps/api/src/modules/wallet/wallet.controller.ts — GET /users/:userId/wallet/deposit
 *   returns the dedicated Stellar address, asset (USDC code + issuer), network and instructions.
 * - apps/api/src/modules/blockchain-monitor/blockchain-monitor.service.ts — streams
 *   Stellar payments and detects inbound USDC to monitored addresses.
 * - apps/api/src/modules/events — emits balance.credited so apps receive the credit
 *   in real time over SSE.
 *
 * Distinct from the AirTM top-up flow (AirTmTopUpFlowDiagram), which is an
 * off-ramp-provider flow with a confirmationUri and webhook.
 */
const CRYPTO_DEPOSIT_FLOW_CHART = `sequenceDiagram
    autonumber
    participant U as User Wallet
    participant S as Stellar Network
    participant OH as OFFER-HUB Orchestrator
    participant App as Your App

    U->>S: Send USDC to deposit address
    OH->>S: Stream payments via Horizon
    S-->>OH: Payment confirmed
    Note over OH: Credit off-chain balance (available)
    OH-->>App: balance.credited (SSE)`;

export function CryptoDepositFlowDiagram() {
  return <MermaidDiagram chart={CRYPTO_DEPOSIT_FLOW_CHART} variant="framed" />;
}

export default CryptoDepositFlowDiagram;
