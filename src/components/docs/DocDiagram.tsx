import { useEffect, useRef, useState } from "react";
import { MermaidDiagram } from "@/components/shared/MermaidDiagram";

/**
 * DocDiagram — the single entry point for all generated documentation
 * diagrams. It wraps the existing neumorphic `MermaidDiagram` implementation
 * (see `src/lib/diagram-theme.ts` for the token contract) and adds:
 *
 *   - a titled caption frame that matches the neumorphic design system,
 *   - an accessible `description` for screen readers,
 *   - a `provider` badge so provider-specific paths (crypto vs AirTM)
 *     are visually distinguished without adding colored border lines.
 *
 * All colors come from the CSS custom properties defined in
 * `src/app/globals.css`, so the component works identically in light and
 * dark mode with no hardcoded colors and no `border-l-4`/style accent bars.
 */

export type DocDiagramProvider = "crypto" | "airtm" | "both" | "neutral";

export interface DocDiagramProps {
  /** Mermaid source for the diagram. */
  chart: string;
  /** Optional caption rendered above the diagram. */
  title?: string;
  /** Short prose description for screen readers. */
  description?: string;
  /** Provider path highlighted by this diagram. */
  provider?: DocDiagramProvider;
  /** Optional className for the outer wrapper. */
  className?: string;
  /** Optional additional Mermaid config. */
  config?: Record<string, unknown>;
}

const PROVIDER_LABEL: Record<DocDiagramProvider, string> = {
  crypto: "Crypto (Stellar USDC)",
  airtm: "AirTM",
  both: "Crypto + AirTM",
  neutral: "Neutral",
};

export function DocDiagram({
  chart,
  title,
  description,
  provider,
  className,
  config,
}: DocDiagramProps) {
  const wrapperRef = useRef<HTMLFigureElement>(null);
  const [rendered, setRendered] = useState(false);

  // Marks the diagram as mounted so the associated caption can be
  // announced by screen readers once the SVG is actually in the DOM.
  useEffect(() => {
    setRendered(true);
  }, []);

  const hasCaption = Boolean(title || description || provider);

  return (
    <figure
      ref={wrapperRef}
      className={[
        "doc-diagram",
        "my-6 flex flex-col gap-3 rounded-xl bg-bg-base p-4",
        "shadow-neu-raised",
        className ?? "",
      ].join(" ").trim()}
      data-rendered={rendered ? "true" : "false"}
    >
      {hasCaption && (
        <figcaption
          className="flex flex-wrap items-center gap-2 text-sm text-text-secondary"
        >
          {title && (
            <span className="font-medium text-text-primary">{title}</span>
          )}
          {provider && (
            <span
              className="rounded-full bg-bg-sunken px-2 py-0.5 text-xs font-medium text-text-secondary"
              data-provider={provider}
            >
              {PROVIDER_LABEL[provider]}
            </span>
          )}
          {description && (
            <span className="text-xs text-text-secondary">{description}</span>
          )}
        </figcaption>
      )}
      <MermaidDiagram chart={chart} variant="framed" config={config} />
    </figure>
  );
}

export default DocDiagram;
