# useVyre Charts — Design Spec

**Date:** 2026-06-17
**Status:** Approved (brainstorming), pending implementation plan

## Goal

Add a set of data-visualization components to useVyre (React + Vue) that follow
the project's core principles: **zero runtime dependency, token-locked, data-driven,
AI-friendly (minimal prop surface, AI-context block + schema + anti-patterns)**.

Visual style and config patterns are inspired by shadcn charts (gradient area
fills, subtle gridlines, hover tooltip, legend) — but **implemented with our own
inline SVG**, NOT Recharts. Rationale: a complex chart library API is itself a
source of AI hallucination (the opposite of useVyre's mission) and would break
the zero-dependency guarantee.

## Scope — Set #1

Five chart components, React + Vue in sync (same effort, CSS byte-identical):

1. **LineChart** — time-series trends; multi-series; `curve: linear|smooth`, `dots`.
2. **AreaChart** — Line + filled area; `gradient` (default true), `stacked`.
3. **BarChart** — category comparison; `orientation: vertical|horizontal`, `stacked`, grouped multi-series.
4. **PieChart** — flat `[{name, value}]`; `donut` boolean.
5. **Sparkline** — minimal inline mini-chart (no axis/legend/tooltip); `variant: line|area|bar`. Pairs with Stat cards / table cells.

Explicitly OUT of scope for set #1 (YAGNI): zoom/pan/brush, candlestick/sankey/treemap/radar/radial, animated transitions, smart auto-axis beyond niceTicks.

## Architecture

### Shared `chart-math` util (framework-agnostic, plain TS)
Pure functions, unit-tested independently of any DOM:
- `scaleLinear(domain, range)` — data value → pixel coordinate.
- `niceTicks(min, max, count)` — human-friendly axis ticks (5/10/25…).
- `buildLinePath(points)` / `buildAreaPath(points)` — SVG path `d` strings (linear + smooth/Catmull-Rom).
- `arcPath(cx, cy, r, startAngle, endAngle, innerR?)` — pie/donut slices.

Both React and Vue import the same math → no logic drift; only rendering differs
per framework. This is the key isolation boundary.

### Token-locked colors via ChartConfig (shadcn-style)
```ts
type ChartConfig = Record<string, { label: string; color: string }>
// e.g. { revenue: { label: "Revenue", color: "var(--vyre-color-semantic-accent)" } }
```
One object maps every series → label + color. AI only needs to learn one pattern
for all chart types. All colors reference `--vyre-color-*` tokens.

### Shared internal sub-components
`ChartGrid`, `ChartLegend`, `ChartTooltip` — used across Line/Area/Bar/Pie for
consistency. Sparkline uses none of them.

## API

Shared props (all except Sparkline): `data`, `config`, `width?`, `height?`
(responsive default), `xKey` (x-axis field), `showGrid?`, `showLegend?`,
`showTooltip?` (all interactivity defaults true).

```tsx
<LineChart data={data} config={config} xKey="month" curve="smooth" dots />
<AreaChart data={data} config={config} xKey="month" gradient stacked />
<BarChart  data={data} config={config} xKey="region" orientation="vertical" stacked />
<PieChart  data={[{name, value}]} config={config} donut />
<Sparkline data={[1,5,3,8]} variant="area" />
```

## Interactivity (full, shadcn-like)

- **Tooltip:** mouse-move over SVG → nearest data point via binary search on
  x-scale → absolutely-positioned `ChartTooltip` showing all series values at
  that point. Reuse the positioning approach from the existing `usePortalPosition`.
- **Legend:** click toggles series visibility (local `hiddenSeries` state).
- **Grid + Axis:** horizontal gridlines from `niceTicks`, x/y labels, token-locked.

### Accessibility
- Each chart: `role="img"` + concise `aria-label` (e.g. "Line chart: Revenue over 12 months").
- Keyboard: arrow keys move the active tooltip point (often missing in chart libs).

## AI-context (core mission)

Each component ships an AI CONTEXT block + schema entry + anti-patterns:
- ❌ `<LineChart series={…}>` → ✅ `data` + `config`
- ❌ `color="blue"` → ✅ `color: "var(--vyre-color-semantic-accent)"`
- ❌ Recharts-style `<XAxis/><Tooltip/>` children → ✅ `showGrid` / `showTooltip` props
ai-context schema grows from 66 → 71 components (schema version is internal,
independent of package semver — established repo pattern).

## Testing (closes the "no test" gap)

- `chart-math`: pure unit tests (scaleLinear, niceTicks, path strings) — deterministic, no jsdom.
- Components: render-guard (jsdom) — assert count of `<path>`/`<rect>`, `aria-label`
  presence, legend item count. (Pixel layout is NOT assertable in jsdom — same
  limitation as the existing blocks-render tests; visual correctness verified in browser.)

## React ⇆ Vue consistency

- `chart-math` shared (identical logic).
- `chart.css` byte-identical in both packages/react and packages/vue (established pattern).
- Docs demos have React & Vue tabs.

## Execution order (verify at each step)

1. `chart-math` util + unit tests.
2. Shared sub-components (Grid/Legend/Tooltip) + `chart.css`.
3. 5 chart components — React.
4. 5 chart components — Vue (mirror; CSS byte-identical).
5. ai-context schema + anti-patterns (5 components).
6. Docs: 5 component pages + demos (React & Vue tabs) + nav entries.
7. Build + full test + browser-verify (0 console errors — the standard held this session).
8. Changeset (react/vue/ai-context **minor** — new feature) → publish via the
   established flow: `pnpm run version` → commit → `pnpm run release` → `git push --follow-tags`.

## Risks / notes
- shadcn charts are built on Recharts; we replicate the *look* + the *ChartConfig
  pattern*, not the dependency.
- Follow the 9-step docs/schema sync checklist when adding components (see the
  docs-schema-sync memory) — ai-context schema is a hand-maintained copy.
- Keep per-component prop surface minimal; every extra prop is hallucination surface.
