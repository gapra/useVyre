# @usevyre/validate-ai-context

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
