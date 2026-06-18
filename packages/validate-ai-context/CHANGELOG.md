# @usevyre/validate-ai-context

## 1.0.12

### Patch Changes

- Updated dependencies [8f49bf3]
  - @usevyre/ai-context@1.10.0

## 1.0.11

### Patch Changes

- Updated dependencies [3fa4a4c]
  - @usevyre/ai-context@1.9.1

## 1.0.10

### Patch Changes

- Updated dependencies [258675d]
- Updated dependencies [ea28631]
  - @usevyre/ai-context@1.9.0

## 1.0.9

### Patch Changes

- Updated dependencies [988c22d]
  - @usevyre/ai-context@1.8.0

## 1.0.8

### Patch Changes

- Updated dependencies [564d22b]
  - @usevyre/ai-context@1.7.0

## 1.0.7

### Patch Changes

- Updated dependencies [1602947]
- Updated dependencies [1602947]
  - @usevyre/ai-context@1.6.0

## 1.0.6

### Patch Changes

- Updated dependencies [6bf4ac7]
  - @usevyre/ai-context@1.5.0

## 1.0.5

### Patch Changes

- f5e0107: Fix schema↔code drift in five more props, and close two validator blind spots
  that allowed those (and the prior callback drifts) to slip past `npx
@usevyre/validate-ai-context` in CI.

  **Schema drift fixes (`@usevyre/ai-context`)** — the schema advertised prop
  names and types that the React/Vue components don't actually accept; agents
  following the schema produced code that fails TypeScript or behaves
  incorrectly:

  - `Modal.title` and `Sheet.title`: removed. Use the `<ModalHeader>` and
    `<SheetHeader>` sub-components for the accessible title.
  - `Pagination.total` → `totalPages` (the `examples` were corrected in
    1.4.1; this completes the props key, which was missed).
  - `Tabs.defaultIndex` (number) → `defaultValue` (string); `Tabs.index`
    (number) → `value` (string). `Tab` and `TabPanel` use string `value` keys,
    not auto-indexed integers — examples updated accordingly.

  Schema internal version: 1.16.2.

  **Validator fixes (`@usevyre/validate-ai-context`)**:

  - The antiPattern matcher used `pattern.includes("${prop}=")`, which flagged
    any prop whose name appeared anywhere in any antiPattern string. That
    treated contextual guidance (e.g. `'type="search" for search UI'`,
    `'DropdownItem variant="primary"'`, `'value as tuple for mode="single"'`)
    as proof the prop was hallucinated, producing 12 false positives over
    `apps/docs/src` for valid usage like `<Input type="email">`, `<Calendar
mode="range">`, and `<DropdownMenu>`. Replaced with a strict regex that
    only matches bare `prop="..."` / `prop={...}` declarative antiPatterns.

  - The JSX parser only recognized `prop="literal"`; `prop={expression}` was
    silently dropped. Agents and humans commonly bind props to variables, so
    validator was blind to the most realistic hallucination forms (e.g.
    `<Button color={brand}>`, `<Switch onChange={handler}>`). Parser is now
    brace-aware and quote-aware end-to-end (tag extraction and prop reading),
    so hallucinations are caught in either form.

  73 contract + behavior tests guard these invariants.

- Updated dependencies [f5e0107]
  - @usevyre/ai-context@1.4.2

## 1.0.4

### Patch Changes

- Updated dependencies [a6e02c8]
  - @usevyre/ai-context@1.4.1

## 1.0.3

### Patch Changes

- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
- Updated dependencies [6cfc93b]
  - @usevyre/ai-context@1.4.0

## 1.0.2

### Patch Changes

- Add `no-inline-layout-styles` rule and fix stale schema resolution.

  **New rule `no-inline-layout-styles`** (severity `warn` in the recommended config): flags hand-written `style={{ display: 'flex' }}` / `display: 'grid'` on JSX elements and points to the `Stack` / `Grid` layout primitives, where spacing is a design token instead of a magic number. Static-only (ignores dynamic display values, string `style` attributes, and spreads to keep false positives near zero). `Box`'s documented `style` escape hatch — and all useVyre components — are exempt.

  **Fix:** `@usevyre/eslint-plugin` and `@usevyre/validate-ai-context` depended on `@usevyre/ai-context: ^1.0.0`, which pnpm resolved to a stale published tarball instead of the workspace package. Both rules and the CLI were validating against an outdated component schema (missing newer components). Changed to `workspace:*` so they always use the in-repo source of truth; Changesets rewrites this to the real version on publish.

- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @usevyre/ai-context@1.3.0

## 1.0.0

### Major Changes

- Release v1.0.0 — stable public release of the AI-native design system

### Patch Changes

- Updated dependencies
  - @usevyre/ai-context@1.0.0
