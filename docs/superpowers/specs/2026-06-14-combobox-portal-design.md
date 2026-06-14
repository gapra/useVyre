# Combobox dropdown portal — design (#18)

**Date:** 2026-06-14
**Issue:** [#18 — Combobox dropdown is clipped when used inside Modal](https://github.com/gapra/useVyre/issues/18)
**Packages:** `@usevyre/react`, `@usevyre/vue` (kept in parity)

## Problem

`Combobox` renders its `<ul>` dropdown inline inside the component wrapper with
`position: absolute`. When the wrapper lives inside `Modal` (which sets
`overflow: hidden` on its container), the dropdown is clipped — options below the
modal edge are invisible and unreachable.

Reported against `@usevyre/vue` (Vue 3.5.x); the React component shares the same
inline-dropdown architecture, so it has the same bug.

### Note on the report

The reporter referenced a Modal prop `isDisablePortal` as precedent. That prop
does **not** exist in this repo's `Modal` (Modal always uses `<Teleport to="body">`).
So the new Combobox prop sets a fresh precedent and is named after the dominant
boolean convention in this codebase (`closeOnEsc`, `closeOnBackdrop`,
`allowAttachments`) — not after a non-existent prop.

## Approach

Adopt the existing in-repo `DropdownMenu` pattern: teleport the dropdown to
`<body>` and position it against the input's `getBoundingClientRect()`.

- **Portaled by default.** Matches the reporter's "just works" expectation and
  useVyre's minimize-hallucination goal — the common case needs no prop.
- **Opt-out prop** `disablePortal` (boolean, default `false`) restores the
  current inline rendering for users who need the dropdown inside the component's
  own DOM subtree.
- **Both frameworks** change identically to preserve parity.

## API surface

New prop on `Combobox` (React + Vue):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disablePortal` | `boolean` | `false` | Render the dropdown inline inside the component instead of teleporting it to `<body>`. Use when the combobox is not inside an `overflow: hidden` container and you want the dropdown to stay in the local DOM subtree. |

- Vue: `<Combobox disable-portal />`
- React: `<Combobox disablePortal />`

No other props change. `options`, `value`/`v-model`, `placeholder`, `disabled`,
`size`, `emptyText` are untouched.

## Positioning (portaled mode)

Mirror `DropdownMenu.computePosition()`:

- On open (after the dropdown renders — `nextTick` in Vue, layout effect in React):
  read the input's rect and set the dropdown style:
  - `position: absolute`
  - `top = rect.bottom + scrollY + GAP` (GAP = 4)
  - `left = rect.left + scrollX`
  - `width = rect.width` (so the dropdown matches the input width)
- **Reposition while open** on `scroll` (with `{ capture: true }` so scrolling
  *inside* the Modal body is caught, not just window scroll) and on `resize`.
  Recompute and update the reactive position. Listeners are added on open and
  removed on close/unmount.
- **Flip above** when there is not enough room below
  (`rect.bottom + estimatedHeight > viewport.height`): anchor to
  `rect.top + scrollY - GAP` and translate the dropdown up by its own height
  (or set `bottom`-anchored placement). Estimated height can use the dropdown's
  measured `offsetHeight` after first render, falling back to the CSS
  `max-height` (16rem) before measurement.

In `disablePortal` mode: no teleport, no JS positioning — the existing CSS rule
(`.vyre-combobox__dropdown { position: absolute; top: calc(100% + ...); left/right: 0 }`)
drives placement exactly as today. Behavior is byte-for-byte unchanged for opt-out users.

## Outside-click across the portal boundary

When the dropdown is in `<body>`, it is no longer a descendant of `wrapperRef`,
so the current check `!wrapperRef.contains(target)` would treat a click on a
dropdown option as an outside click and close before selection.

Fix: treat a click as "inside" when the target is within the wrapper **or** the
portaled dropdown element. Both frameworks already hold a `dropdownRef`. The
outside-click handler becomes:

```
if (!wrapper.contains(t) && !dropdown.contains(t)) closeDropdown();
```

This mirrors `DropdownMenu.handleOutside`, which already checks trigger + menu
separately. (In `disablePortal` mode the dropdown is inside the wrapper, so the
extra `dropdown.contains` check is harmless.)

## CSS

- `.vyre-combobox__dropdown` keeps all visual styling (border, shadow, padding,
  animation, `max-height`, scroll).
- In portaled mode `top` / `left` / `width` come from inline style (JS-computed);
  the CSS `top/left/right` offsets apply only in inline (`disablePortal`) mode.
- Flip-up case: ensure the open animation / `transform-origin` reads correctly
  when anchored above the input (animate from bottom instead of top). Minimal
  addition — a modifier class or data attribute on the dropdown when flipped.

## Schema / docs / tests

- **AI-context schema** (`packages/ai-context/src/schema/components.json`): add
  `disablePortal` to the Combobox `props`. Then regenerate / manually update the
  hardcoded copies: `packages/ai-context/src/full-context.md` and
  `apps/docs/src/data/vyre-schema.js` (these are known hardcoded duplicates that
  must be kept in sync).
- **Component AI-CONTEXT header comments** in both `Combobox.vue` and
  `Combobox.tsx`: add `disablePortal` to the documented prop list.
- **Docs page** for Combobox: add a short note that the dropdown portals to body
  by default (works inside Modal/overflow containers) and document `disablePortal`.
- **Tests** (Combobox currently has none). Add focused tests, written first (TDD):
  1. Default → dropdown is rendered in `document.body`, not inside the wrapper.
  2. `disablePortal` → dropdown is rendered inline inside the wrapper.
  3. Clicking an option in the portaled dropdown still selects it (regression
     guard for the outside-click boundary fix).
  Add for both React and Vue.

## Out of scope (YAGNI)

- No `@floating-ui/dom` dependency — the lean hand-rolled positioning (matching
  DropdownMenu) is sufficient and keeps the bundle dependency-free.
- No configurable placement prop (`bottom-start` etc.) for Combobox in this
  change — the dropdown always opens below (flipping above only when space is
  constrained). Can be added later if requested.
- No change to Select/Command, even though they may share the pattern — this
  issue is scoped to Combobox. Track separately if needed.

## Verification

- `pnpm test` (new Combobox tests pass, existing suite green).
- `pnpm --filter @usevyre/react build && pnpm --filter @usevyre/vue build` clean.
- Manual: docs page — open a Combobox inside a Modal near the bottom edge; all
  options visible and selectable; scroll the modal while open and the dropdown
  tracks the input.
