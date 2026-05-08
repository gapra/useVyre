# @usevyre/validate-ai-context

Scan your codebase for hallucinated useVyre props — invalid variants, non-existent prop names, missing providers — before they reach CI.

[![npm](https://img.shields.io/npm/v/@usevyre/validate-ai-context)](https://www.npmjs.com/package/@usevyre/validate-ai-context)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Usage

```bash
npx @usevyre/validate-ai-context src/
```

```
❌ dashboard.tsx:8
   <Button> has no "color" prop
   → Use variant prop instead

❌ dashboard.tsx:12
   <Button size="xl"> — "xl" is not a valid value
   → Valid: "sm" | "md" | "lg" | "icon"

Scanned 4 files · 2 errors
```

## Options

| Flag | Description |
|------|-------------|
| `--json` | Output results as JSON (for CI / programmatic use) |
| `--quiet` | Only show errors, suppress summary |
| `--ext` | Comma-separated file extensions to scan (default: `tsx,ts,vue,jsx,js`) |

## GitHub Actions

```yaml
- name: Validate useVyre props
  run: npx @usevyre/validate-ai-context src/ --json
```

See the [full workflow example](https://github.com/gapra/usevyre/blob/main/.github/workflows/validate-ai.yml).

## What it catches

Validates against 31 known anti-patterns across all 30 useVyre components:

- Non-existent prop names (`color`, `type` on components that don't have them)
- Invalid enum values (`size="xl"`, `variant="error"`, `variant="blue"`)
- Missing required composition (`Accordion` without `AccordionItem`)
- Missing providers (`Toast` without `ToastProvider` / `ToastViewport`)

## Docs

[usevyre.com/docs/ai-tooling/validate](https://usevyre.com/docs/ai-tooling/validate)
