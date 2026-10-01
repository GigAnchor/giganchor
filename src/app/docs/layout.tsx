import type { Metadata } from "next";
import { getSidebarNav } from "@/lib/mdx";
import { DocsLayoutShell } from "@/components/docs/DocsLayoutShell";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Explore OFFER-HUB documentation: getting started guides, API reference, TypeScript SDK, escrow workflows, and self-hosting instructions.",
  keywords: [
    "documentation",
    "API reference",
    "SDK",
    "escrow",
    "getting started",
    "OFFER-HUB",
    "self-hosting",
  ],
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getSidebarNav();

  return <DocsLayoutShell nav={nav}>{children}</DocsLayoutShell>;
}
