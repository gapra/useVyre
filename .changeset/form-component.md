---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `Form` + `FormField` — a controlled, data-driven, zero-dependency form.

`Form` owns the values (controlled via `values`/`onChange`, or uncontrolled via `defaultValues`) and validates on submit, then live on blur/change after the first submit attempt. `FormField` declares a field's `name`, `label`, `hint` and validation `rules`, wires `name`/`value`/`onChange`/`onBlur` into its single control child, and renders it inside a `Field` so errors map to `state="error"` + `hint=message` automatically.

Built-in rules (no zod/yup needed): `required`, `minLength`, `maxLength`, `min`, `max`, `pattern` (RegExp), `email`, and a custom `validate(value, allValues) => string | null` for cross-field checks.

React uses `values`/`onChange`/`onSubmit`/`onInvalid`; Vue uses `v-model` + `@submit`/`@invalid` with a scoped slot exposing `{ value, error, onInput, onBlur }`. First of the post-1.3 backlog components ("soon" badge removed).
