# @usevyre/all

Install every useVyre package in one command.

```bash
npm i @usevyre/all
```

That's it. You get:

| Package | What it does |
|---|---|
| `@usevyre/react` | React components |
| `@usevyre/vue` | Vue components |
| `@usevyre/tokens` | CSS variables + DTCG design tokens |
| `@usevyre/ai-context` | Inline AI context blocks for agents |
| `@usevyre/mcp-server` | MCP server for Claude Desktop, Cursor, Copilot |
| `@usevyre/eslint-plugin` | Lint rule that catches hallucinated props |
| `@usevyre/validate-ai-context` | CLI scanner for invalid prop usage |
| `@usevyre/prompt-templates` | Drop-in system prompts for 5 agents |

## Usage

Import from the specific sub-packages for tree-shaking:

```ts
// React
import { Button, Badge } from "@usevyre/react";
import "@usevyre/react/styles";

// Vue
import { Button, Badge } from "@usevyre/vue";
import "@usevyre/vue/styles";

// Tokens (always needed)
import "@usevyre/tokens/css";
```

## Docs

[usevyre.com/docs/getting-started](https://usevyre.com/docs/getting-started)
