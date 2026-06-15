# useVyre Blocks — composition patterns (AI-aware) — design

**Date:** 2026-06-15
**Goal:** Make it easy to build whole pages/sections (not just atoms) with
useVyre — especially for vibecoders/AI who ask "build a login page / pricing
section / dashboard" and want a correct result first try.

## Approach (shadcn-style, lean, AI-native)

A **block** is a ready-made composition of existing useVyre components,
delivered as **copy-paste source** — NOT a published component. Users copy and
edit freely ("a starting point, not a cage"). No new package, no new API surface.

The differentiator is that blocks also feed **AI context**, so an agent in any
tool (Claude/Cursor/Copilot/Windsurf) generates correct page-level composition.

## First set: 5 core blocks (React + Vue parity)

`AuthCard` (login), `StatsRow` (dashboard KPIs), `PricingSection`,
`SettingsPanel` (settings form), `EmptyState` block. The most-requested page
patterns. Start with ONE end-to-end to prove the pipeline, then the rest.

## Single source of truth: `packages/ai-context/src/blocks/`

Each block is one markdown file: `<block>.md` with a fixed structure:

```
# <BlockName>

<one-line description>

**Use when:** <when to reach for it>
**Components:** Card, Field, Input, Button, ...

## React
```tsx
<react source>
```

## Vue
```vue
<vue source>
```
```

This single source feeds BOTH the docs page and the AI context — avoiding the
drift class of bug seen with the hardcoded `vyre-schema.js` copy.

## AI-context integration

`packages/ai-context/scripts/build.js` reads `src/blocks/*.md` and injects a
"## Composition Blocks" section into the generated outputs (`full-context.md`,
`cursor-rules.md`, `claude-context.md`, `windsurf-rules.md`,
`copilot-instructions.md`) and writes `dist/blocks.md`. So every AI target gets
the composition patterns alongside the per-component reference.

## Docs page

A `/docs/blocks` page lists each block with a **live preview** (real rendered
components via the existing `ComponentPreview` demo pattern) and **copy-paste
code** (React/Vue tabs via the existing `Code` component). Demos live in
`apps/docs/src/components/demos/` like the others.

## Architecture (anti-drift, testable)

- **Source:** `ai-context/src/blocks/*.md` (description + React + Vue code).
- **Build:** `build.js` parses blocks → injects the "Composition Blocks" section
  into the generated AI outputs + emits `dist/blocks.md`.
- **Docs:** preview uses real demo components; the displayed code is the block
  source (kept in sync by living in the same repo, ideally read from the demo).

Keep each piece small: a `loadBlocks()` helper in build.js (read + parse the
markdown files), separate from the existing component-section generation.

## Tests

1. **Structure contract** (node): each `blocks/*.md` has the required sections —
   title, "Use when", "Components", a React code fence, a Vue code fence.
2. **Build injection** (node): after `build.js`, `full-context.md` and
   `dist/blocks.md` contain the "Composition Blocks" section and each block name.
3. **Block validity (critical)** (jsdom): smoke-render each block's React demo
   component (in `apps/docs/.../demos` or a test fixture) so blocks are proven to
   compile and render — a broken block is worse than no block. Reuse the existing
   React component harness.

## Out of scope (YAGNI)

- A published `@usevyre/blocks` component package.
- A `add block` CLI (shadcn has one; later if wanted).
- More than 5 blocks in this pass.
- Full multi-page app templates.

## Honest note

The biggest value is the AI-context integration (the useVyre differentiator);
the docs page serves humans. The main risk is blocks going stale/broken — so the
smoke-render guard is mandatory, not optional. Blocks use ONLY existing useVyre
components (no new components), so they ride along with normal component fixes.

## Verification

- `pnpm test` green (structure + injection + render guards).
- `pnpm --filter @usevyre/ai-context build` shows the blocks section in
  `dist/full-context.md` and `dist/blocks.md`.
- Manual: docs `/docs/blocks` renders previews; copy-paste code compiles in a
  scratch app.
