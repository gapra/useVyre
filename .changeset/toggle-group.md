---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `ToggleGroup` + `ToggleItem` — a controlled segmented control.

Supports single-select (`type="single"`, value `string | null`) and multi-select (`type="multiple"`, value `string[]`); `onChange` emits the value, never an event. Compose with an `options` array for simple lists or `<ToggleItem>` children for custom content (icons, mixed markup). Includes arrow-key roving focus, `size`, `orientation`, and `disabled`. React uses `value`/`onChange`; Vue uses `v-model` (shape adapts to `type`). Distinct from `Switch` (boolean), `ButtonGroup` (layout only) and `RadioGroup` (form radios). Backlog component #3 — "soon" badge removed.
