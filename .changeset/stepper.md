---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `Stepper` + `StepperNav` + `Step` + `StepPanel` — a controlled multi-step flow.

For onboarding, checkout, and wizards. Controlled by a 0-based index (`value`/`onChange` in React, `v-model` in Vue; `defaultValue` for uncontrolled). `StepperNav` lays out `Step` indicators that automatically resolve to `completed` / `current` / `upcoming` state; `StepPanel` renders its content only when its `index` matches the active step. Supports `orientation` (horizontal/vertical), `clickable` (jump back to a completed step), per-step `label`/`description`/custom `icon`. Distinct from `Tabs` — Stepper is an ordered linear flow. Backlog component #4 — "soon" badge removed.
