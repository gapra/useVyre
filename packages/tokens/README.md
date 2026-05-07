# @usevyre/tokens

> DTCG-compliant design tokens for the useVyre design system — CSS variables, JS/TS exports, and AI context.

[![npm](https://img.shields.io/npm/v/@usevyre/tokens)](https://www.npmjs.com/package/@usevyre/tokens)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Installation

```bash
npm install @usevyre/tokens
# or
pnpm add @usevyre/tokens
```

## Usage

### CSS variables (recommended)

```css
/* Import once in your global CSS or app entry */
@import "@usevyre/tokens/css";
```

This injects all design tokens as CSS custom properties under `:root` with automatic dark mode support via `[data-theme="dark"]`.

### JavaScript / TypeScript

```ts
import { tokens } from "@usevyre/tokens/js";

tokens.color.semantic.accent // → "var(--vyre-color-semantic-accent)"
```

### JSON

```ts
import tokens from "@usevyre/tokens/json";
```

### AI context

```ts
import { fullContext } from "@usevyre/ai-context";
// Use in your LLM system prompt
```

## Token naming convention

All tokens follow the pattern `--vyre-[category]-[subcategory]-[variant]`:

```css
--vyre-color-semantic-accent        /* ✅ use semantic tokens */
--vyre-color-primitive-amber-400    /* ❌ never use primitives directly */
--vyre-spacing-4                    /* 16px */
--vyre-typography-font-size-sm      /* 13px */
--vyre-border-radius-md             /* 8px */
```

## Categories

| Category | Example token |
|----------|--------------|
| Color (semantic) | `--vyre-color-semantic-accent` |
| Color (surface) | `--vyre-color-semantic-surface` |
| Color (text) | `--vyre-color-semantic-text-primary` |
| Spacing | `--vyre-spacing-4` (16px) |
| Typography | `--vyre-typography-font-size-md` |
| Border radius | `--vyre-border-radius-lg` |
| Shadow | `--vyre-shadow-md` |
| Transition | `--vyre-transition-duration-fast` |

Full token reference → [usevyre.com/docs/tokens](https://usevyre.com/docs/tokens)

## License

MIT © [Gapra](https://gapra.dev)
