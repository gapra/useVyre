# RichTextEditor security hardening — design

**Date:** 2026-06-15
**Packages:** `@usevyre/react`, `@usevyre/vue` (parity)
**Type:** Security (XSS) + docs correction.

## Problem

RichTextEditor renders its `value`/`modelValue` (an HTML string) via
`innerHTML` (React: `RichTextEditor.tsx:113`) / `innerHTML`/`v-html`
(Vue: `RichTextEditor.vue:116,124`) with **no sanitization**. If an app stores
one user's editor output and renders it back to other users (the normal use of a
rich-text editor), a payload like `<img src=x onerror=…>` executes → **stored
XSS**.

Secondary vector: the `link` tool uses `execCommand("createLink")`, which accepts
`javascript:` / `data:` / `vbscript:` URLs, injecting a script link even if the
stored `value` is later sanitized.

The AI-CONTEXT comment claims *"Output is sanitised-friendly semantic HTML"*,
which is misleading — nothing sanitizes.

## Principle

Keep RichTextEditor **zero-dependency** (its stated design). Provide security via
a **clear contract + a small built-in guard + an opt-in hook**, rather than
bundling a sanitizer. The heavy sanitizer (e.g. DOMPurify) stays the consumer's
choice, consistent with useVyre's lean philosophy.

## Changes

### 1. New prop `sanitize?: (html: string) => string`

- Optional, default `undefined`. React + Vue.
- Applied at **two points**:
  - **render-in:** before writing `value` to `innerHTML`.
  - **emit-out:** on the editor's current HTML before `onChange`/`update:modelValue`,
    so the value an app stores is also sanitized.
- When `undefined`: behavior is exactly as today (no-op) — backward compatible,
  still zero-dep. Consumers plug their own: `sanitize={(h) => DOMPurify.sanitize(h)}`.
- Internal helper `applySanitize(html) = sanitize ? sanitize(html) : html`.

### 2. Built-in link guard (always on, no dep)

- When the `link` tool runs, reject URLs whose scheme is dangerous:
  `/^\s*(javascript|data|vbscript):/i` (tested after trimming). A dangerous URL
  results in **no link created** (silent no-op).
- Internal helper `isUnsafeUrl(url): boolean` (written in each package; no
  cross-package util).
- This protects even when the consumer forgets to pass `sanitize`.

### 3. Documentation correction

- Replace the misleading "Output is sanitised-friendly" line in the AI-CONTEXT
  header (React + Vue) with an explicit security note:
  > `value` is rendered as raw HTML. Sanitize untrusted HTML before passing it
  > in (e.g. `sanitize={DOMPurify.sanitize}`). The `link` tool blocks
  > `javascript:`/`data:`/`vbscript:` URLs.
- Add a schema anti-pattern: ❌ passing untrusted HTML to `value` without
  `sanitize`.

## Architecture

Small, isolated additions inside the existing component (no new files):
- `isUnsafeUrl(url)` — pure predicate; used by the link tool.
- `applySanitize(html)` — wraps the optional `sanitize` prop; used at render-in
  and emit-out.

Both are tiny and independently understandable. No change to other toolbar
commands or to the controlled value/onChange contract.

## Schema / docs / tests

- **Schema** (`components.json`): add `RichTextEditor.sanitize` + the anti-pattern;
  bump 1.19.0 → 1.20.0 + changelog; rebuild ai-context (regenerates
  `full-context.md`); regenerate `apps/docs/.../vyre-schema.js`.
- **AI-CONTEXT header comments** (both RTE files): replace the misleading line.
- **Docs page** RTE PropsTable: add `sanitize`; add a short security note.
- **Tests (TDD, React harness)** — written first:
  1. Without `sanitize`: `value` renders as-is (backward compat).
  2. With `sanitize`: the function is called and its output is what renders
     (e.g. strips `<script>`).
  3. `onChange` emits HTML that passed through `sanitize`.
  4. Link guard: creating a link with `javascript:alert(1)` produces no
     `<a href="javascript:…">`.
  - Vue verified via build + typecheck (no Vue harness yet — tracked separately).

## Out of scope (YAGNI)

- Bundling DOMPurify or any sanitizer dependency.
- Writing a full HTML sanitizer in-house (error-prone, false security).
- Changing the toolbar set or other `execCommand` calls.
- Paste sanitization (separate concern; the `sanitize` hook on emit-out already
  cleans pasted content before it reaches `onChange`).

## Honest limitation

Default behavior still treats the consumer as responsible for sanitizing
untrusted `value`. The `sanitize` hook + the always-on link guard reduce risk and
make the contract explicit, but do not make the component XSS-proof by default
without a consumer-provided sanitizer.

## Verification

- `pnpm test` green (new RTE tests + existing suite).
- `pnpm --filter @usevyre/react build && pnpm --filter @usevyre/vue build` clean;
  Vue `vue-tsc --noEmit` clean.
- Manual: passing `<script>`/`<img onerror>` to `value` with a real sanitizer
  strips it; the link tool refuses a `javascript:` URL.
