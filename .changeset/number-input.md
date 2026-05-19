---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `NumberInput` — a controlled numeric input with −/+ stepper buttons.

`onChange` emits a real `number` (or `null` when empty), not an event or a string, so it drops directly into `FormField` and into form state without any parsing. Supports `min`/`max` (clamped on blur), `step`, `precision` (decimal rounding), `size`, `disabled`/`readOnly`, and keyboard stepping (`ArrowUp`/`ArrowDown` ±step, `Shift`+Arrow ±step×10). React uses `value`/`onChange`; Vue uses `v-model` (number|null). Backlog component #2 — "soon" badge removed.
