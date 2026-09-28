import { MermaidDiagram } from "@/components/shared/MermaidDiagram";

/**
 * AirTM top-up flow diagram.
 *
 * Source of truth in the OFFER-HUB orchestrator repository:
 * - apps/api/src/modules/topups/topups.controller.ts — POST /api/v1/topups
 *   (@Scopes('write'), userId from @CurrentUser, body: CreateTopUpDto).
 * - apps/api/src/modules/topups/topups.service.ts — createTopUp() creates the
 *   AirTM payin and returns a CreateTopUpResponse with a confirmationUri.
 * - apps/api/src/modules/webhooks/webhooks.controller.ts — POST /api/v1/webhooks/airtm
 *   verifies the Svix signature and credits the balance; always returns 200.
 *
 * Distinct from the crypto-native deposit flow (CryptoDepositFlowDiagram): AirTM
 * is provider-mediated, requires the user to complete payment at confirmationUri,
 * and settles asynchronously through the webhook instead of a blockchain monitor.
 */
const AIRTM_TOP_UP_FLOW_CHART = `sequenceDiagram
    autonumber
    participant App as Your App
    participant OH as OFFER-HUB Orchestrator
    participant AT as AirTM
    participant U as User

    App->>OH: POST /api/v1/topups (amount, currency)
    OH->>AT: Create payin
    AT-->>OH: confirmationUri
    OH-->>App: Top-up awaiting user confirmation
    App->>U: Redirect to confirmationUri
    U->>AT: Complete payment
    AT->>OH: POST /api/v1/webhooks/airtm
    Note over OH: Verify Svix signature, credit balance
    OH-->>App: topup.succeeded (SSE)`;

export function AirTmTopUpFlowDiagram() {
  return <MermaidDiagram chart={AIRTM_TOP_UP_FLOW_CHART} variant="framed" />;
}

export default AirTmTopUpFlowDiagram;
