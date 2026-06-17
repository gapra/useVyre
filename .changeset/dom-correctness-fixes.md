---
"@usevyre/react": patch
---

Fix two DOM-correctness issues caught by React in dev:

- **DatePicker / DateRangePicker**: the trigger was a `<button>` containing the
  clear `<button>`, which is invalid HTML (`<button>` cannot nest in `<button>`)
  and triggered a `validateDOMNesting` warning. The trigger is now a
  `<div role="button" tabIndex={0}>` with Enter/Space keyboard handling, so the
  clear button nests legally and the control stays keyboard-accessible.
- **RadioGroup**: auto-generated group names used a module-level counter, which
  drifts between server and client render (SSR renders many, the client hydrates
  one) and caused a "Prop `id` did not match" hydration warning. Now uses
  `useId()`, which is stable across server and client.
