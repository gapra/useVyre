---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Emit `dist/styles/components.css` during dev (`vite build --watch`), not only in the full build script. The CSS copy now runs as a Vite `writeBundle` plugin, so `@usevyre/{react,vue}/styles` resolves correctly when a consumer's dev server starts against a freshly-built `dist`.
