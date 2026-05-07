# @usevyre/ai-context

> Inject useVyre design system context into your AI agent — eliminates UI hallucinations in Cursor, Claude, Windsurf, and Copilot.

[![npm](https://img.shields.io/npm/v/@usevyre/ai-context)](https://www.npmjs.com/package/@usevyre/ai-context)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Installation

```bash
npm install @usevyre/ai-context
# or
pnpm add @usevyre/ai-context
```

## Usage

### Cursor — `.cursor/rules/usevyre.mdc`

```bash
node -e "
const { cursorRules } = require('@usevyre/ai-context');
require('fs').writeFileSync('.cursor/rules/usevyre.mdc', cursorRules);
"
```

### Claude — `CLAUDE.md`

```bash
node -e "
const { claudeContext } = require('@usevyre/ai-context');
require('fs').appendFileSync('CLAUDE.md', '\n\n' + claudeContext);
"
```

### Windsurf — `.windsurf/rules/usevyre.md`

```bash
node -e "
const { windsurfRules } = require('@usevyre/ai-context');
require('fs').writeFileSync('.windsurf/rules/usevyre.md', windsurfRules);
"
```

### GitHub Copilot — `.github/copilot-instructions.md`

```bash
node -e "
const { copilotInstructions } = require('@usevyre/ai-context');
require('fs').writeFileSync('.github/copilot-instructions.md', copilotInstructions);
"
```

### JavaScript / TypeScript — inject into system prompt

```ts
import { fullContext } from "@usevyre/ai-context";

const response = await anthropic.messages.create({
  model: "claude-opus-4-7",
  system: fullContext,
  messages: [{ role: "user", content: "Build a login form" }],
});
```

## Exports

| Export | Path | Description |
|--------|------|-------------|
| `fullContext` | `@usevyre/ai-context` | Full context string for system prompts |
| Cursor rules file | `@usevyre/ai-context/cursor` | `.cursor/rules` formatted markdown |
| Claude context file | `@usevyre/ai-context/claude` | `CLAUDE.md` formatted markdown |
| Windsurf rules file | `@usevyre/ai-context/windsurf` | `.windsurf/rules` formatted markdown |
| Copilot instructions file | `@usevyre/ai-context/copilot` | `.github/copilot-instructions.md` formatted markdown |
| Full context file | `@usevyre/ai-context/full` | Raw markdown file |

Full setup guide → [usevyre.com/docs/ai-context](https://usevyre.com/docs/ai-context)

## License

MIT © [Gapra](https://gapra.dev)
