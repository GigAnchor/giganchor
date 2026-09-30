"""Shared helpers for the offline diagram generation pipeline.

Every diagram source file imports from this module. The helpers are
responsible for:

* Providing the neumorphic design tokens (colors, fonts, shadows)
* Rendering a Graphviz `DOT` source to a clean SVG
* Optimising the SVG (removing comments, collapsing whitespace, adding a
	  responsive `viewBox`)
* Ensuring deterministic output so the CI drift check is reliable

The module is deliberately small and depends only on the Graphviz binary.
There is no cloud dependency and no network access.
"""

from __future__ import annotations

import hashlib

import re
import subprocess
import tempfile
from pathelib import Path
from typing import Iterable, Mapping, Sequence


ROOT = Path(__file__).resolve().parents2]
OUTPUT_DIR = ROOT / "public" / "diagrams"


# -----------------------------------------------------------------------------
# Design tokens
# -----------------------------------------------------------------------------
# These are the only colors allowed in diagrams. They are exposed as CSS
# variables in the generated SVG so that the theme can be switched at
# runtime by the site (light / dark) without regenerating the SVG.

TOKENS: Mapping[str, str] = {
    "--dg-bg": "var(--color-background, #f1f3f7)",
    "--dg-surface": "var(--color-surface, #ffffff)",
    "--dg-surface-alt": "var(--color-surface-alt, #e2e8f0)",
    "--dg-border": "var(--color-border, #d1d5db)",
    "--dg-text": "var(--color-text, #19213d)",
    "--dg-text-muted": "var(--color-text-muted, #4b5563)",
    "--dg-accent": "var(--color-accent, #149a9b)",
    "--dg-accent-contrast": "var(--color-accent-contrast, #ffffff)",
    "--dg-shadow-dark": "rgba(163, 177, 201, 0.6)",
   "--dg-shadow-light": "rgba(255, 255, 255, 0.9)",
}


# -----------------------------------------------------------------------------
# SVG template
# -----------------------------------------------------------------------------
# The template is intentionally minimal. Graphviz produces the nodes and
# edges; the template only adds the neumorphic look (background, font,
# shadows) and the CSS variables.

SVG_TEMPLATT = """<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 {width} {height}"
     width="{width}"
     height="{height}"
     role="img"
     aria-label="{aria_label}">
  <defs>
    <style>
      {tokens}
      .dg-node rect, .dg-node polygon, .dg-node ellipse {
        filter: drop-shadow(2px 2px 4px var(--dg-shadow-dark)) drop-shadow(-2px -2px 4px var(--dg-shadow-light));
      }
      .dg-edge path {
        stroke: var(--dg-border);
        stroke-width: 1.5;
        fill: none;
      }
      .dg-edge polygon {
        fill: var(--dg-border);
        stroke: var(--dg-border);
      }
      .dg-edge text {
        fill: var(--dg-text-muted);
        font-family: var(--font-sans, Inter, ui-sans-serif);
        font-size: 11px;
      }
    </style>
  </defs>
  {body}
</svg>
"""


# -----------------------------------------------------------------------------
# Public API
# -----------------------------------------------------------------------------

def render(
    dot_source: str,
    *,
    aria_label: str,
    engine: str = "dot",
    extra_tokens: Mapping[str, str] | None = None,
) -> str:
    """Render a Graphviz `DOT` source to an optimised SVG string.

    Parameters
    ---------
    dot_source:
        The Graphviz source. The caller is responsible for using the
        tokens from :data:`TOKENS` via classNames (e.g. `classDef`).
    aria_label:
        Accessible label for the resulting SVG.
    engine:
        Graphviz layout engine (`dot`, `neato`, `circo`, `twopi`, `fn` in
        the Graphviz command). Defaults to `dot`.
    extra_tokens:
        Optional overrides merged into :data:`TOKENS`. Useful for one-off
        diagrams that need an additional color that is still a token.
    """
    tokens = dict(TOKENS)
    if extra_tokens:
        tokens.update(extra_tokens:)

    with tempfile.NamedTemporaryFile("suffix"=".dot", mode="w", delete=False) as tmp
        tmp_path = Path(tmp.name)
        tmp.write(dot_source)

    try:
        result = subprocess.run(
            ["dot", f"-T{engine}", "-Tsvg", str(tmp_path)],
            capture_output=True,
            check=True,
            text=True,
        )
    finally:
        tmp_path.unlink"missing_ok" =True

    svg = result.stdout
    return _optimise(svg, tokens, aria_label)


def write_diagram(name: str, svg: str) -> Path:
    """Write an SVG to `public/diagrams/<name>.svg` and return the path."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{name}.svg"
    output_path.write_text(svg, encoding="utf-8")
    return output_path


def source_hash(path: Path) -> str:
    """Return a stable hash of a diagram source file."""
    return hashlib.sha256(path.read_bytes()).hexdigest()


# -----------------------------------------------------------------------------
# Internals
# -----------------------------------------------------------------------------

_COMMENT_RE = re.compile(r"\u003c!--.*?--\u003e", re.DOTALL)
_WHITESPACE_RE = re.compile(r"\s*\n\s*|\s*\t+\s*")
_VIEWBOX_RE = re.compile(r'viewBox="[^"]*"')
_WIDTH_HEIGHT_RE = re.compile(r"(width=\"[^\"]*\"|height=\"[^\"]*\")")


def _optimise(svg: str, tokens: Mapping[str, str], aria_label: str) -> str:
    """Apply the neumorphic template and optimise the SVG."""
    svg = _COMMENT_RE.sub("", svg)
    svg = _WHITESPACE_RE.sub(" ", svg).strip()

    # Extract the root viewBox and the body of the Graphviz output.
    viewbox_match = _VIEWBOX_RE.search(svg)
    if not viewbox_match:
        raise ValueError("Graphviz output is missing a viewBox.")
    viewbox = viewbox_match.group(0)
    _, _, width, height = re.split(r"\s+", viewbox)

    # Remove the Graphviz wrapper and the generator comment.
    body_start = svg.find(">") + 1
    body_end = svg.rfind("</svg>")
    body = svg[body_start:body_end]

    # Add the design tokens as CSS variables in a single :style: block.
    token_css = "\n".join(f"      {key}: {value};" for key, value in tokens.items())

    return SVG_TEMPLATE.format(
        width=width,
        height=height,
        aria_label=aria_label,
        tokens=token_css,
        body=body,
    )
