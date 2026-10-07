"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import mermaid from "mermaid";
import { useTheme } from "@/components/providers/ThemeProvider";

interface MermaidDiagramProps {
  chart?: string;
  children?: ReactNode;
  caption?: string;
}

/**
 * Extract string content from children (handles MDX transformations)
 */
function extractChartContent(
  chart: string | undefined,
  children: ReactNode,
): string {
  if (typeof chart === "string" && chart.trim()) return chart.trim();
  if (typeof children === "string" && children.trim()) return (children as string).trim();
  if (children && typeof children === "object" && "props" in children) {
    const el = children as { props?: { children?: ReactNode } };
    if (typeof el.props?.children === "string") return el.props.children.trim();
  }
  return "";
}

export function MermaidDiagram({
  chart,
  children,
  caption,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const chartContent = extractChartContent(chart, children);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      if (!chartContent) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setSvg("");

      const isDark = resolvedTheme === "dark";

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: isDark
          ? {
              primaryColor: "#2e2e3f",
              primaryTextColor: "#f1f3f7",
              primaryBorderColor: "#1fb8b9",
              secondaryColor: "#242433",
              secondaryTextColor: "#b8bfd0",
              secondaryBorderColor: "#3d3d5c",
              tertiaryColor: "#1a1a26",
              tertiaryTextColor: "#f1f3f7",
              tertiaryBorderColor: "#3d3d5c",
              background: "#242433",
              mainBkg: "#2e2e3f",
              textColor: "#f1f3f7",
              lineColor: "#6D758F",
              fontFamily: "inherit",
              fontSize: "14px",
              nodeBorder: "#1fb8b9",
              nodeTextColor: "#f1f3f7",
              clusterBkg: "#2e2e3f",
              clusterBorder: "#3d3d5c",
              edgeLabelBackground: "#2e2e3f",
              labelBackgroundColor: "#2e2e3f",
              stateBkg: "#2e2e3f",
              stateLabelColor: "#f1f3f7",
              compositeTitleBackground: "#1fb8b9",
              compositeBackground: "#242433",
              compositeBorder: "#3d3d5c",
              noteBkgColor: "#2e2e3f",
              noteTextColor: "#f1f3f7",
              noteBorderColor: "#3d3d5c",
              actorBkg: "#2e2e3f",
              actorTextColor: "#f1f3f7",
              actorBorder: "#3d3d5c",
            }
          : {
              primaryColor: "#E8F7F7",
              primaryTextColor: "#19213D",
              primaryBorderColor: "#149A9B",
              secondaryColor: "#F1F3F7",
              secondaryTextColor: "#19213D",
              secondaryBorderColor: "#6D758F",
              tertiaryColor: "#ffffff",
              tertiaryTextColor: "#19213D",
              tertiaryBorderColor: "#d1d5db",
              background: "#ffffff",
              mainBkg: "#E8F7F7",
              textColor: "#19213D",
              lineColor: "#6D758F",
              fontFamily: "inherit",
              fontSize: "14px",
              nodeBorder: "#149A9B",
              nodeTextColor: "#19213D",
              clusterBkg: "#F1F3F7",
              clusterBorder: "#149A9B",
              edgeLabelBackground: "#ffffff",
              labelBackgroundColor: "#ffffff",
              stateBkg: "#E8F7F7",
              stateLabelColor: "#19213D",
              compositeTitleBackground: "#149A9B",
              compositeBackground: "#F1F3F7",
              compositeBorder: "#149A9B",
              noteBkgColor: "#E8F7F7",
              noteTextColor: "#19213D",
              noteBorderColor: "#149A9B",
              actorBkg: "#E8F7F7",
              actorTextColor: "#19213D",
              actorBorder: "#149A9B",
            },
        flowchart: { htmlLabels: true, curve: "basis", padding: 24 },
      });

      try {
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chartContent);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    renderChart();
    return () => { cancelled = true; };
  }, [chartContent, resolvedTheme]);

  if (error) {
    return (
      <div className="my-10 rounded-2xl overflow-hidden bg-bg-elevated p-6 border border-theme-error/30">
        <p className="text-theme-error text-sm font-semibold">Failed to render diagram</p>
        <pre className="mt-2 text-xs text-content-secondary overflow-auto max-h-32">{error}</pre>
      </div>
    );
  }

  return (
    <figure className="my-10">
      <div
        className="rounded-3xl overflow-hidden bg-bg-elevated relative z-10"
        style={{
          boxShadow: "6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 rounded-t-3xl bg-bg-sunken shadow-neu-sunken-subtle">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-primary/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-theme-primary/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-theme-primary/20" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] font-mono text-content-secondary/80">
              Mermaid
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="mermaid-diagram-canvas w-full overflow-x-auto overflow-y-hidden p-8 flex items-center justify-center min-h-[200px] bg-bg-elevated"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-content-secondary">
              <div className="w-8 h-8 rounded-full border-2 border-theme-primary/30 border-t-theme-primary animate-spin" />
              <span className="text-sm font-medium">Rendering diagram…</span>
            </div>
          ) : (
            svg && (
              <div
                className="mermaid-svg-wrapper [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:min-w-0"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-sm font-medium text-content-secondary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
