---
"@usevyre/react": patch
"@usevyre/vue": patch
---

`@usevyre/react/styles` and `@usevyre/vue/styles` are now self-contained — they include the design tokens (CSS variables) plus the component styles in one file. A single `import "@usevyre/react/styles"` (or `/vue/styles`) fully styles the components; you no longer need a separate `import "@usevyre/tokens/css"`, removing a common "components render unstyled" footgun. Existing two-import setups keep working (the tokens just load twice, harmlessly).
