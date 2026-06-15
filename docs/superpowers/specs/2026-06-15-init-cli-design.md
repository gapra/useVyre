# @usevyre/init CLI — design

**Date:** 2026-06-15
**Type:** New package (`packages/init`), published as `@usevyre/init`.
**Goal:** Remove first-run friction — turn "install + remember 3 setup steps"
into one command, `npx @usevyre/init`, run inside an existing React/Vue project.

## Scope

**Add-to-existing only.** Does NOT scaffold a new project (no template to
maintain, no overlap with create-vite). It detects the framework in the current
project, installs the right `@usevyre` package, safely inserts one styles import,
and guides the remaining (riskier) steps. Lean, low-surprise, zero runtime deps
(Node built-ins only) — consistent with the existing `@usevyre/ai-context` CLI.

## Package

- `packages/init/` → published `@usevyre/init`, bin `usevyre-init`.
- Pure Node ESM, no dependencies. Mirrors the `ai-context` init CLI style
  (process.argv, `✓`/`ℹ` output, idempotent).

## Flow: `npx @usevyre/init`

1. **Detect framework.** Read the consumer's `package.json`. `react`/`react-dom`
   present → React; `vue` present → Vue. Both or neither → require `--react` /
   `--vue` (error with guidance if ambiguous and no flag).
2. **Install dependency.** Detect the package manager from the lockfile
   (`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm;
   default npm). Run `<pm> add @usevyre/<framework>`. Tokens are NOT needed —
   `@usevyre/<fw>/styles` is self-contained.
3. **Insert the styles import (the one file edit — kept minimal & safe).**
   Detect the entry file in order: `src/main.tsx`, `src/main.ts`, `src/index.tsx`,
   `src/index.ts`, `src/main.js`, `src/index.js`. If found and the import is not
   already present, prepend `import "@usevyre/<fw>/styles";` as the first line.
   Idempotent (skip if present). No JSX parsing, no AST — just a single import
   line. If no entry is found, skip and print a manual instruction.
4. **Guide ToastProvider (no JSX edit).** Print copy-paste instructions to wrap
   the app with `<ToastProvider>` (React) / add `<ToastViewport />` (Vue).
   Auto-editing JSX is riskier than its value, so this stays manual.
5. **Offer AI context.** Print a suggestion to run
   `npx @usevyre/ai-context init --claude`. If `--ai <target>` is passed, run it
   directly.
6. **Summary.** Print what was done (✓) and the remaining manual steps (ℹ).

## Flags

- `--react` / `--vue` — override framework detection.
- `--ai <claude|cursor|windsurf|copilot>` — also set up AI context.
- `--dry-run` — print the plan without installing or editing anything.
- `--help` — usage.

## Safety / edge cases

- **No entry file detected** → skip the import insert; print the manual line.
  Never guess or create an entry file.
- **Import already present** → skip (idempotent; safe to re-run).
- **Install fails** (offline / unsupported PM) → print the manual install
  command and continue to the guidance steps; never leave a half-done state
  silently. Exit non-zero only on truly unrecoverable input (e.g. ambiguous
  framework with no flag).
- **`--dry-run`** for cautious users to preview every action.

## Architecture (small, testable units)

Keep pure logic separate from side effects so it's unit-testable without
actually installing or touching real files:

- `detectFramework(pkgJson, flags)` → `"react" | "vue"` | throws on ambiguous.
- `detectPackageManager(cwd)` → `"pnpm" | "yarn" | "npm"` (lockfile lookup).
- `findEntryFile(cwd)` → path | null (ordered candidates).
- `ensureStylesImport(content, fw)` → `{ content, changed }` (pure string op,
  idempotent).
- A thin `run()` orchestrator that wires these to fs / child_process and prints.

## Tests (TDD, `contract` node project)

Unit-test the pure functions against fixtures in a tmp dir — no real install:
1. `detectFramework`: react-only pkg → "react"; vue-only → "vue"; both + no flag
   → throws; flag overrides.
2. `detectPackageManager`: each lockfile → correct PM; none → "npm".
3. `findEntryFile`: returns first existing candidate; null when none.
4. `ensureStylesImport`: inserts when absent; no-op when present (idempotent);
   keeps existing file content intact below the import.

## Out of scope (YAGNI)

- Scaffolding a new project / templates.
- Auto-wrapping JSX with ToastProvider (no AST/parser dependency).
- Configuring Tailwind/Vite/bundlers.
- A fancy interactive TUI — flags + minimal prompts suffice.

## Honest note

This removes ~80% of first-run friction (install + styles handled). The
ToastProvider step stays manual on purpose — auto-editing user JSX is riskier
than the convenience is worth.

## Verification

- `pnpm test` green (new init unit tests + existing suite).
- Manual: run `npx @usevyre/init --dry-run` in a sample React app and a Vue app;
  confirm correct detection + planned actions; run for real in a tmp app and
  confirm the styles import is inserted once and re-running is a no-op.
