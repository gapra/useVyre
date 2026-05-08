# @usevyre/mcp-server

MCP (Model Context Protocol) server for useVyre — gives Claude Desktop and other MCP clients real-time access to component context, valid props, and anti-patterns.

[![npm](https://img.shields.io/npm/v/@usevyre/mcp-server)](https://www.npmjs.com/package/@usevyre/mcp-server)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Setup — Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "usevyre": {
      "command": "npx",
      "args": ["-y", "@usevyre/mcp-server"]
    }
  }
}
```

Restart Claude Desktop. The useVyre tools will appear in the tools panel.

## Available tools

| Tool | Description |
|------|-------------|
| `get_component_info` | Full context for a component — props, variants, anti-patterns, examples |
| `get_valid_props` | All valid prop names and values for a component |
| `check_valid_prop_value` | Validate a specific prop value before generating code |
| `suggest_component` | Find the right component for a use case |
| `get_token_info` | Look up a design token by name or category |
| `get_full_context` | Entire AI context block (all components + tokens) |
| `get_anti_patterns` | All known hallucination patterns, optionally filtered by component |
| `get_version_info` | Package version and context validity information |

## Example prompts

```
"What are the valid variants for the Button component?"
→ get_valid_props({ component: "Button" })

"Is variant='error' valid on Alert?"
→ check_valid_prop_value({ component: "Alert", prop: "variant", value: "error" })

"What component should I use for a search box?"
→ suggest_component({ useCase: "search box with keyboard navigation" })
```

## Docs

[usevyre.com/docs/ai-tooling/mcp-server](https://usevyre.com/docs/ai-tooling/mcp-server)
