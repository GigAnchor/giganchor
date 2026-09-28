import { MermaidDiagram } from "@/components/shared/MermaidDiagram";

/**
 * Canonical Withdrawal state machine diagram.
 *
 * Source of truth: docs/architecture/state-machines.md (Withdrawal States)
 * and packages/shared/src/enums/withdrawal-status.enum.ts (WITHDRAWAL_TRANSITIONS)
 * in the OFFER-HUB orchestrator repository. The transitions declared there are
 *   WITHDRAWAL_CREATED          -> WITHDRAWAL_COMMITTED | WITHDRAWAL_CANCELED
 *   WITHDRAWAL_COMMITTED        -> WITHDRAWAL_PENDING
 *   WITHDRAWAL_PENDING          -> WITHDRAWAL_PENDING_USER_ACTION | WITHDRAWAL_COMPLETED | WITHDRAWAL_FAILED
 *   WITHDRAWAL_PENDING_USER_ACTION -> WITHDRAWAL_PENDING | WITHDRAWAL_FAILED
 *
 * Two edges from apps/api/src/modules/withdrawals/withdrawals.service.ts are
 * added and labeled as the crypto path: executeCryptoWithdrawal() sends the
 * Stellar payment synchronously, so a crypto withdrawal can go straight from
 * WITHDRAWAL_CREATED to WITHDRAWAL_COMPLETED, or to WITHDRAWAL_FAILED when the
 * send throws (funds are restored and WITHDRAWAL_FAILED is emitted).
 *
 * Entry edge from apps/api/src/modules/withdrawals/withdrawals.controller.ts:
 * POST /api/v1/withdrawals (scope: write) creates the withdrawal. State names
 * use the full WITHDRAWAL_* prefix because base state names like CREATED or
 * PENDING collide with the built-in note/composite syntax of mermaid's
 * stateDiagram-v2 parser.
 */
const WITHDRAWAL_STATE_MACHINE_CHART = `stateDiagram-v2
    [*] --> WITHDRAWAL_CREATED: POST /withdrawals
    WITHDRAWAL_CREATED --> WITHDRAWAL_COMMITTED: POST /withdrawals/{id}/commit
    WITHDRAWAL_CREATED --> WITHDRAWAL_CANCELED: Cancellation
    WITHDRAWAL_COMMITTED --> WITHDRAWAL_PENDING: Airtm processing
    WITHDRAWAL_PENDING --> WITHDRAWAL_PENDING_USER_ACTION: User action required
    WITHDRAWAL_PENDING --> WITHDRAWAL_COMPLETED: Airtm confirms
    WITHDRAWAL_PENDING --> WITHDRAWAL_FAILED: Airtm rejects
    WITHDRAWAL_PENDING_USER_ACTION --> WITHDRAWAL_PENDING: User completes action
    WITHDRAWAL_PENDING_USER_ACTION --> WITHDRAWAL_FAILED: Timeout or failure
    WITHDRAWAL_CREATED --> WITHDRAWAL_COMPLETED: Crypto synchronous send
    WITHDRAWAL_CREATED --> WITHDRAWAL_FAILED: Crypto send fails
    WITHDRAWAL_COMPLETED --> [*]
    WITHDRAWAL_FAILED --> [*]
    WITHDRAWAL_CANCELED --> [*]`;

export function WithdrawalStateMachineDiagram() {
  return <MermaidDiagram chart={WITHDRAWAL_STATE_MACHINE_CHART} variant="framed" />;
}

export default WithdrawalStateMachineDiagram;
