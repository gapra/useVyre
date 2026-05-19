---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `OTPInput` — a segmented one-time-code input for verification and 2FA.

Controlled: `onChange` emits the combined code **string** (not an event), and `onComplete` fires once every slot is filled. Paste-aware (pasting a full code fills all slots), auto-advance on input, backspace steps to the previous slot, arrow keys navigate. Supports `length` (default 6), `type` (`numeric`/`alphanumeric`), `mask` (dots like a password), `size`, `disabled`, `autoFocus`. Because it emits a string, it drops straight into `FormField`. React uses `value`/`onChange`/`onComplete`; Vue uses `v-model` + `@complete`. Backlog component #9 — "soon" badge removed.
