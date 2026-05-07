# useVyre

> AI-native design system for humans and agents. Built on semantic CSS variables — no runtime magic, no hallucinations.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@usevyre/react)](https://www.npmjs.com/package/@usevyre/react)
[![usevyre.com](https://img.shields.io/badge/site-usevyre.com-7c3aed)](https://usevyre.com)

---

## Why useVyre?

Most design systems were built for humans reading documentation. useVyre is built for **both** — every naming convention, token structure, and component API is designed so that AI coding agents (Claude, Cursor, Copilot, Windsurf) can generate correct, consistent UI without guessing.

| Problem | useVyre solution |
|---------|-----------------|
| AI hallucinates component props | Every component has an inline AI context block |
| AI uses raw color values | Semantic tokens replace all raw colors |
| AI generates inconsistent spacing | 4px grid enforced via spacing tokens |
| AI doesn't know valid variants | `data-variant` API is explicit and enumerated |
| Design system only works in one framework | CSS variables work everywhere |

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@usevyre/tokens`](./packages/tokens) | [![npm](https://img.shields.io/npm/v/@usevyre/tokens)](https://www.npmjs.com/package/@usevyre/tokens) | DTCG-compliant design tokens → CSS variables, JS/TS, JSON |
| [`@usevyre/react`](./packages/react) | [![npm](https://img.shields.io/npm/v/@usevyre/react)](https://www.npmjs.com/package/@usevyre/react) | React + TypeScript components |
| [`@usevyre/vue`](./packages/vue) | [![npm](https://img.shields.io/npm/v/@usevyre/vue)](https://www.npmjs.com/package/@usevyre/vue) | Vue 3 + TypeScript components |
| [`@usevyre/ai-context`](./packages/ai-context) | [![npm](https://img.shields.io/npm/v/@usevyre/ai-context)](https://www.npmjs.com/package/@usevyre/ai-context) | Machine-readable context for LLM system prompts |

---

## Quick Start

```bash
# React
npm install @usevyre/tokens @usevyre/react

# Vue 3
npm install @usevyre/tokens @usevyre/vue
```

```ts
// Import once at your app entry point
import "@usevyre/tokens/css";     // design tokens (required)
import "@usevyre/react/styles";   // component styles

import { Button, Badge, Card } from "@usevyre/react";
```

Full setup guide → [usevyre.com/docs/installation](https://usevyre.com/docs/installation)

---

## Design Principles

1. **Semantic over primitive** — `--vyre-color-semantic-accent` not `--amber-400`
2. **Explicit over implicit** — every valid value is documented inline
3. **Zero runtime** — pure CSS variables, works in any framework
4. **AI-first naming** — token names describe *intent*, not *appearance*
5. **Copy-paste friendly** — no mandatory build setup, just import CSS and go

---

## Monorepo Structure

```
usevyre/
├── packages/
│   ├── tokens/          @usevyre/tokens
│   ├── react/           @usevyre/react
│   ├── vue/             @usevyre/vue
│   └── ai-context/      @usevyre/ai-context
├── apps/
│   └── docs/            usevyre.com documentation site
└── README.md
```

---

## Local Development

Run the docs site locally to browse all component examples and live demos.

**Prerequisites:** Node.js ≥ 18, pnpm ≥ 9

```bash
# 1. Clone and install
git clone https://github.com/gapra/usevyre.git
cd usevyre
pnpm install

# 2. Build design tokens (required — components import CSS variables from here)
pnpm --filter @usevyre/tokens build

# 3. Start the docs dev server
SITE_MODE=live pnpm --filter @usevyre/docs dev
```

Open `http://localhost:4321` in your browser.

> **Why `SITE_MODE=live`?** Without it the landing page shows a coming-soon screen.
> All `/docs/*` pages are accessible either way.

**Shortcut** — tokens build + dev server in one command:

```bash
SITE_MODE=live pnpm dev:docs
```

---

## Contributing

This project is in early development. Feedback, ideas, and bug reports are very welcome — [open an issue](https://github.com/gapra/usevyre/issues) to get started.

---

## License

MIT © [Gapra](https://gapra.dev)
