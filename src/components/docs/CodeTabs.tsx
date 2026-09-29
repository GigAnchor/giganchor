"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { CodeBlock } from "./CodeBlock";

export type CodeTabItem = {
  /** Optional stable id; falls back to the tab index. */
  id?: string;
  /** Tab button label, e.g. `cURL` or `TypeScript SDK`. */
  label: string;
  /** Code language used for syntax highlighting, e.g. `bash`, `typescript`. */
  language: string;
  /** Raw code sample. */
  code: string;
};

export type CodeTabsProps = {
  tabs: CodeTabItem[];
  /** Accessible name for the tab list, e.g. "Request examples". */
  label?: string;
  className?: string;
};

/**
 * Tabbed code samples for docs pages (cURL / TypeScript SDK pairs).
 * Neumorphic, token-only, and keyboard accessible: arrow keys, Home and End
 * move between tabs, matching the WAI-ARIA tabs pattern.
 */
export function CodeTabs({ tabs, label = "Code examples", className }: CodeTabsProps) {
  const items = Array.isArray(tabs) ? tabs : [];
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabId = (index: number) => `${baseId}-tab-${items[index]?.id ?? index}`;
  const panelId = (index: number) => `${baseId}-panel-${items[index]?.id ?? index}`;

  function selectTab(index: number) {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = items.length - 1;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        selectTab(index === lastIndex ? 0 : index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        selectTab(index === 0 ? lastIndex : index - 1);
        break;
      case "Home":
        event.preventDefault();
        selectTab(0);
        break;
      case "End":
        event.preventDefault();
        selectTab(lastIndex);
        break;
      default:
        break;
    }
  }

  if (items.length === 0) return null;

  return (
    <div className={cn("my-10", className)}>
      <div className="overflow-hidden rounded-3xl bg-bg-elevated shadow-neu-raised">
        <div
          role="tablist"
          aria-label={label}
          className="flex flex-wrap items-center gap-1 rounded-t-3xl bg-bg-sunken px-4 py-3 shadow-neu-sunken-subtle"
        >
          {items.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={tab.id ?? index}
                type="button"
                id={tabId(index)}
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId(index)}
                tabIndex={isActive ? 0 : -1}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "min-h-11 rounded-xl px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest",
                  "transition-[color,background-color,box-shadow] duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary",
                  isActive
                    ? "bg-bg-base text-theme-primary shadow-neu-raised-sm"
                    : "text-content-muted hover:text-content-secondary",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {items.map((tab, index) => (
          <div
            key={tab.id ?? index}
            id={panelId(index)}
            role="tabpanel"
            aria-labelledby={tabId(index)}
            hidden={index !== activeIndex}
            tabIndex={0}
            className="bg-bg-elevated"
          >
            <CodeBlock
              code={tab.code}
              language={tab.language}
              className="my-0 rounded-none shadow-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeTabs;
