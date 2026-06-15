# Tooltip portal — design

**Date:** 2026-06-15
**Related:** Combobox #18 portal fix; Select/Command follow-ups (same overlay-clip class).
**Packages:** `@usevyre/react`, `@usevyre/vue` (parity).

## Problem

`Tooltip` renders inline with `position: absolute` relative to its wrapper, so a
`Modal` (or any `overflow: hidden` / clipping container) clips it. Same class of
bug as Combobox #18, but the mechanism differs: Tooltip uses **pure-CSS
positioning** (placement classes with `top/bottom/left/right: calc(100% + …)` +
`translateX/Y(-50%)` centering + a per-placement arrow), with **no JS
positioning at all**. Portaling therefore requires writing JS positioning from
scratch.

## Approach

Teleport the tooltip to `<body>` by default; position it with JS computed from
the trigger rect + placement. Add a `disablePortal` opt-out for parity with
Combobox/Select/Command.

Alignment with useVyre principles:
- **Minimize AI hallucination / consistency:** `disablePortal` is named and
  behaves exactly like the other overlay components, so an agent that knows the
  pattern is automatically correct here.
- **Minimal API:** one boolean prop, default `false`. No new placement options,
  no positioning knobs.
- **Lean / no deps:** hand-rolled positioning (no floating-ui), consistent with
  Combobox/Select/Command.
- **Low surprise:** position math lives entirely in JS (one place); CSS in portal
  mode only disables transform-based positioning and keeps the scale animation.

## API surface

New prop on `Tooltip` (React + Vue):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disablePortal` | `boolean` | `false` | Render the tooltip inline instead of teleporting it to `<body>`. By default it portals so it stays visible inside Modal / overflow:hidden containers. |

- React: `<Tooltip disablePortal>`
- Vue: `<Tooltip disable-portal>`

No other props change (`content`, `placement`, `delay`, `children`/slot, hover/
focus behavior all unchanged).

## Positioning (portaled mode)

When visible and portaled, compute the tooltip's **final** top/left in document
coordinates from the trigger rect and the tooltip's own measured size
(`offsetWidth`/`offsetHeight`), then set them inline (`position: absolute`,
document coords = rect + `scrollX/Y`). GAP = current spacing-2 (8px) to match the
old `calc(100% + spacing-2)`.

For trigger rect `r`, tooltip size `tw`×`th`, with `cx = r.left + r.width/2 + scrollX`,
`cy = r.top + r.height/2 + scrollY`:

- **top:**    `left = cx - tw/2`,           `top = r.top + scrollY - GAP - th`
- **bottom:** `left = cx - tw/2`,           `top = r.bottom + scrollY + GAP`
- **left:**   `left = r.left + scrollX - GAP - tw`, `top = cy - th/2`
- **right:**  `left = r.right + scrollX + GAP`,     `top = cy - th/2`

Because the final position already accounts for tooltip size and centering, the
CSS `--_tt` transform (used for centering in inline mode) is set to `none` in
portal mode, leaving only the scale animation. The arrow keeps working via the
unchanged `vyre-tooltip--{placement}` class.

Measuring requires the tooltip to be in the DOM first: render it (still
`position: absolute`, offscreen-safe), then compute on layout effect
(`useLayoutEffect` in React; `nextTick` in Vue) before paint, so there is no
visible jump.

No auto-flip (out of scope) — matches the old CSS behavior, which also did not
flip. Tooltips are small and rarely hit a viewport edge.

## Reposition on scroll/resize

While visible and portaled, add `scroll` (capture: true, to catch scrolling
inside a Modal body) + `resize` window listeners that recompute. Remove on
hide/unmount. Same pattern as Combobox/Select/Command.

In `disablePortal` mode: no teleport, no JS positioning — the existing CSS
placement rules drive everything exactly as today (byte-for-byte unchanged for
opt-out users).

## CSS

- Keep all placement rules, arrow rules, animations.
- Add `.vyre-tooltip--portal { --_tt: none; }` and zero out the CSS offset
  properties (`top/right/bottom/left: auto`) so inline JS coords fully control
  placement and the scale animation has no leftover translate.
- Arrow rules (`--{placement} .vyre-tooltip__arrow`) unchanged — still position
  the arrow correctly relative to the tooltip box.

## Schema / docs / tests

- **Schema** (`packages/ai-context/src/schema/components.json`): add
  `Tooltip.disablePortal`; bump version 1.18.0 → 1.19.0 + changelog; rebuild
  ai-context (regenerates `full-context.md`); regenerate `apps/docs/.../vyre-schema.js`.
- **Component AI-CONTEXT header comments** in both Tooltip files: add the prop.
- **Docs page** Tooltip PropsTable: add `disablePortal`.
- **Tests (TDD, React harness)** — written first:
  1. Default → tooltip is rendered in `document.body`, not inside the wrapper.
  2. `disablePortal` → tooltip is rendered inline inside the wrapper.
  3. Arrow (`.vyre-tooltip__arrow`) is still present when portaled.
  Vue verified via build + typecheck (no Vue test harness yet — tracked
  separately).

## Out of scope (YAGNI)

- Auto-flip / collision avoidance.
- `@floating-ui/dom` or any runtime dependency.
- Changes to hover/focus/delay behavior or the `placement` prop set.
- Tooltip-in-Tooltip or interactive tooltips.

## Verification

- `pnpm test` green (new Tooltip tests + existing suite).
- `pnpm --filter @usevyre/react build && pnpm --filter @usevyre/vue build` clean;
  Vue `vue-tsc --noEmit` clean.
- Manual (Playwright): tooltip inside a Modal/overflow container is fully visible;
  all four placements render with correct arrow; scrolling a container while the
  tooltip is open keeps it anchored to the trigger.
