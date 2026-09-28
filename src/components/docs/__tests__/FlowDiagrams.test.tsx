import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CryptoDepositFlowDiagram } from "../CryptoDepositFlowDiagram";
import { AirTmTopUpFlowDiagram } from "../AirTmTopUpFlowDiagram";
import { InvisibleWalletDiagram } from "../InvisibleWalletDiagram";

vi.mock("@/components/shared/MermaidDiagram", () => ({
  MermaidDiagram: ({ chart, variant }: { chart?: string; variant?: string }) => (
    <div data-testid="mermaid" data-chart={chart} data-variant={variant} />
  ),
}));

describe("provider flow diagrams", () => {
  it("renders the crypto deposit flow through MermaidDiagram", () => {
    render(<CryptoDepositFlowDiagram />);
    const diagram = screen.getByTestId("mermaid");
    const chart = diagram.getAttribute("data-chart") ?? "";

    expect(diagram.getAttribute("data-variant")).toBe("framed");
    expect(chart).toContain("sequenceDiagram");

    // Participants: user's external wallet, Stellar, orchestrator, integrating app
    for (const label of ["User Wallet", "Stellar Network", "OFFER-HUB Orchestrator", "Your App"]) {
      expect(chart).toContain(`as ${label}`);
    }

    // Crypto-native path: user sends USDC to a Stellar address, the orchestrator
    // detects it via Horizon streaming and credits the off-chain balance
    for (const step of [
      "Send USDC to deposit address",
      "Stream payments via Horizon",
      "Payment confirmed",
      "Credit off-chain balance (available)",
      "balance.credited (SSE)",
    ]) {
      expect(chart).toContain(step);
    }

    // Crypto deposits never touch the AirTM provider
    for (const bogus of ["AirTM", "confirmationUri", "webhook", "payin", "Svix"]) {
      expect(chart).not.toContain(bogus);
    }
  });

  it("renders the AirTM top-up flow through MermaidDiagram", () => {
    render(<AirTmTopUpFlowDiagram />);
    const diagram = screen.getByTestId("mermaid");
    const chart = diagram.getAttribute("data-chart") ?? "";

    expect(diagram.getAttribute("data-variant")).toBe("framed");
    expect(chart).toContain("sequenceDiagram");

    // Participants: integrating app, orchestrator, AirTM provider, user
    for (const label of ["Your App", "OFFER-HUB Orchestrator", "AirTM", "User"]) {
      expect(chart).toContain(`as ${label}`);
    }

    // AirTM path: create payin → confirmationUri → user completes payment at
    // AirTM → Svix-verified inbound webhook credits the balance
    for (const step of [
      "POST /api/v1/topups (amount, currency)",
      "Create payin",
      "confirmationUri",
      "Redirect to confirmationUri",
      "Complete payment",
      "POST /api/v1/webhooks/airtm",
      "Verify Svix signature, credit balance",
      "topup.succeeded (SSE)",
    ]) {
      expect(chart).toContain(step);
    }

    // AirTM top-ups never mention blockchain monitoring
    for (const bogus of ["Horizon", "Send USDC to deposit address"]) {
      expect(chart).not.toContain(bogus);
    }
  });

  it("renders the invisible wallet model through MermaidDiagram", () => {
    render(<InvisibleWalletDiagram />);
    const diagram = screen.getByTestId("mermaid");
    const chart = diagram.getAttribute("data-chart") ?? "";

    expect(diagram.getAttribute("data-variant")).toBe("framed");
    expect(chart).toContain("flowchart LR");

    // The user-facing balance vs what happens on Stellar
    for (const node of [
      "Balance: 100.00 USD",
      "Stellar address: GCV24WNJ...",
      "USDC balance: 100.0000000",
      "Private key: AES-256-GCM encrypted",
    ]) {
      expect(chart).toContain(node);
    }

    // Key material is never shown unencrypted
    for (const bogus of ["plaintext", "seed phrase", "unencrypted"]) {
      expect(chart).not.toContain(bogus);
    }
  });
});
