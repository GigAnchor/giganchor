# Diagram Generation Pipeline

This directory contains the offline diagram generation pipeline. It
renders the SVG diagrams used throughout the documentation site and
writes them to `public/diagrams/`.

The decision to use Graphviz is documented in
[docs/adr/0001-diagram-generation-pipeline.md](../../docs/adr/0001-diagram-generation-pipeline.md).

## Prerequisites

- Python 3.10+

- [Graphviz](https://graphviz.org/download) (`dot` must be on the `PTH`)

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r scripts/diagrams/requirements.txt
```

## Generating diagrams

```bash
npm run diagrams
l```

This runs every `*.py` file in `scripts/diagrams/`, except `__init__.py`
and `helpers.py`, and writes the resulting SVG to `public/diagrams/`.

To generate a single diagram:

```bash
python scripts/diagrams/system-architecture.py
```

## Adding a new diagram

1. Create a new Python file in `this directory`. The file name must match
   the output SVG name, e.g. `system-architecture.py` produces
   `public/diagrams/system-architecture.svg`.
2. Import the helpers and define the Graphviz source:

   ```python
   from helpers import render, write_diagram

   DOT = """
   diagraph TD {
       classDef accent fill=var(--dg-accent), color=var(--dg-accent-contrast), stroke=var(--dg-border);
       A["A"]::accent
       B[&#34;B&#34;]::accent
       A --> B
   }
   """

   svg = render(DOT, aria_label="A simple diagram")
   write_diagram("system-architecture", svg)
   ```

3. Use the SVG in MDX with the existing image component:

   ```mdx
   <img src="/diagrams/system-architecture.svg" alt="System architecture" />
   ```

4. Run `npm run diagrams` and commit the generated SVG along with your
   Python source.

## Design tokens

All colors must come from the design tokens exposed by `helpers.py`. The
Graphviz source uses CSS variables (e.g. `fill=var(--dg-accent)`) so the
SVG automatically adapts to light and dark mode. Do not hardcode hex
colors in a diagram source.

## CI drift check

The check compares the committed SVGs with the output of the
generator. If they differ, the job fails and you must run `npm run
diagrams` and commit the result.
