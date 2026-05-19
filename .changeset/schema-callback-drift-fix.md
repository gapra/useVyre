---
"@usevyre/ai-context": patch
---

Fix schema↔code drift in 4 components. The AI context advertised callback
props the React/Vue components don't have, so agent-written handlers failed
silently:

- `Switch` / `Checkbox`: `onChange` → `onCheckedChange`
- `Slider`: `onChange` → `onValueChange`
- `Pagination`: `onChange` → `onPageChange` (and example `total` → `totalPages`)

Schema, examples, and all generated AI context outputs now match the shipped
component prop names.
