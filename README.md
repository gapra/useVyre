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

**Core**

| Package | Version | Description |
|---------|---------|-------------|
| [`@usevyre/tokens`](./packages/tokens) | [![npm](https://img.shields.io/npm/v/@usevyre/tokens)](https://www.npmjs.com/package/@usevyre/tokens) | DTCG-compliant design tokens → CSS variables, JS/TS, JSON |
| [`@usevyre/react`](./packages/react) | [![npm](https://img.shields.io/npm/v/@usevyre/react)](https://www.npmjs.com/package/@usevyre/react) | React + TypeScript components |
| [`@usevyre/vue`](./packages/vue) | [![npm](https://img.shields.io/npm/v/@usevyre/vue)](https://www.npmjs.com/package/@usevyre/vue) | Vue 3 + TypeScript components |
| [`@usevyre/all`](./packages/all) · [`react-all`](./packages/react-all) · [`vue-all`](./packages/vue-all) | — | Convenience meta-packages (tokens + components in one install) |

**AI tooling**

| Package | Version | Description |
|---------|---------|-------------|
| [`@usevyre/ai-context`](./packages/ai-context) | [![npm](https://img.shields.io/npm/v/@usevyre/ai-context)](https://www.npmjs.com/package/@usevyre/ai-context) | Machine-readable component schema for LLM system prompts |
| [`@usevyre/mcp-server`](./packages/mcp-server) | [![npm](https://img.shields.io/npm/v/@usevyre/mcp-server)](https://www.npmjs.com/package/@usevyre/mcp-server) | MCP server — gives agents live access to the component schema |
| [`@usevyre/eslint-plugin`](./packages/eslint-plugin) | [![npm](https://img.shields.io/npm/v/@usevyre/eslint-plugin)](https://www.npmjs.com/package/@usevyre/eslint-plugin) | Lints for invalid variants, raw colors, hallucinated props |
| [`@usevyre/validate-ai-context`](./packages/validate-ai-context) | [![npm](https://img.shields.io/npm/v/@usevyre/validate-ai-context)](https://www.npmjs.com/package/@usevyre/validate-ai-context) | CI check that the AI context stays in sync with components |
| [`@usevyre/prompt-templates`](./packages/prompt-templates) | [![npm](https://img.shields.io/npm/v/@usevyre/prompt-templates)](https://www.npmjs.com/package/@usevyre/prompt-templates) | Ready-made prompts for generating UI with useVyre |

---

## Components

**40+ production-ready components** for React and Vue — buttons, forms (Input, Field, Radio, Checkbox, Select), overlays (Modal, Sheet, Popover, Tooltip), data (DataGrid, Table, Pagination), layout (Sidebar/AppLayout, Card, Tabs), and richer pieces like **Kanban**, **Conversation** (chat), **DateRangePicker**, and a zero-dependency **RichTextEditor** — plus more on the way.

Every component ships with an inline AI-context block, a machine-readable schema entry, and documented anti-patterns.

Browse the full list with live demos → [usevyre.com/docs/components](https://usevyre.com/docs/components)

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

import { Button, Card, DataGrid } from "@usevyre/react";
```

Full setup guide → [usevyre.com/docs/installation](https://usevyre.com/docs/installation)

---

## Examples

Real, multi-page layouts built entirely from useVyre components:

- **[Dashboard app](https://usevyre.com/examples/dashboard-app/)** — functional 5-page billing dashboard with working sidebar navigation
- **[Sign-in](https://usevyre.com/examples/auth)** — auth form with validation
- [All examples →](https://usevyre.com/examples)

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
│   ├── tokens/                @usevyre/tokens
│   ├── react/                 @usevyre/react
│   ├── vue/                   @usevyre/vue
│   ├── all/ react-all/ vue-all/   convenience meta-packages
│   ├── ai-context/            @usevyre/ai-context
│   ├── mcp-server/            @usevyre/mcp-server
│   ├── eslint-plugin/         @usevyre/eslint-plugin
│   ├── validate-ai-context/   @usevyre/validate-ai-context
│   └── prompt-templates/      @usevyre/prompt-templates
├── apps/
│   └── docs/                  usevyre.com documentation site
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
pnpm --filter @usevyre/docs dev
```

Open `http://localhost:4321` in your browser.

**Shortcut** — tokens build + dev server in one command:

```bash
pnpm dev:docs
```

---

## Contributing

This project is in early development. Feedback, ideas, and bug reports are very welcome — [open an issue](https://github.com/gapra/usevyre/issues) to get started.

---

## License

MIT © [Gapra](https://gapra.dev)
