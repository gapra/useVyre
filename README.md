# useVyre

> AI-native design system for humans and agents. Built on semantic CSS variables — no runtime magic, no hallucinations.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![usevyre.com](https://img.shields.io/badge/docs-usevyre.com-amber)](https://usevyre.com)

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

| Package | Description |
|---------|-------------|
| [`@vyre/tokens`](./packages/tokens) | DTCG-compliant design tokens → CSS variables, JS/TS, JSON |
| [`@vyre/react`](./packages/react) | React + TypeScript components |
| [`@vyre/vue`](./packages/vue) | Vue 3 + TypeScript components |
| [`@vyre/ai-context`](./packages/ai-context) | Machine-readable context for LLM system prompts |

---

## Quick Start

```bash
pnpm add @vyre/tokens @vyre/react
```

```css
/* global.css */
@import "@vyre/tokens/css";
@import "@vyre/react/styles";
```

```tsx
import { Button, Badge, Card, CardBody, Field, Input } from "@vyre/react"

export function Example() {
  return (
    <Card variant="elevated">
      <CardBody>
        <Badge variant="teal" dot>Stable</Badge>
        <Field label="Email" hint="We'll never share it.">
          <Input type="email" placeholder="you@example.com" />
        </Field>
        <Button variant="accent">Get Started</Button>
      </CardBody>
    </Card>
  )
}
```

---

## AI Agent Setup

Add useVyre context to your AI agent:

**Cursor** — create `.cursor/rules/vyre.md`:
```bash
npx @vyre/ai-context init --cursor
```

**Claude Code** — add to `CLAUDE.md`:
```bash
npx @vyre/ai-context init --claude
```

**Windsurf** — create `.windsurf/rules/vyre.md`:
```bash
npx @vyre/ai-context init --windsurf
```

Or manually: copy `node_modules/@vyre/ai-context/dist/full-context.md` into your agent rules.

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
│   ├── tokens/          @vyre/tokens
│   ├── react/           @vyre/react
│   ├── vue/             @vyre/vue
│   └── ai-context/      @vyre/ai-context
├── apps/
│   └── docs/            usevyre.com documentation site
└── README.md
```

---

## License

MIT © [Galih Pranowo](https://github.com/gapra)
