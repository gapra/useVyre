---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Fix three bugs that consumers were patching downstream with app-level overrides.

- **ToastProvider hydration mismatch (React, SSR).** The toast viewport is portalled into `document.body`, gated only on `typeof document !== "undefined"`. The server rendered no viewport but the client's first render did, so hydration mismatched and apps hit `Cannot read properties of null (reading 'parentNode')`. The portal now mounts after the first effect, so the server pass and the first client pass are identical. Consumers no longer need to wrap `<ToastProvider>` in a `mounted` gate. (Vue's `ToastViewport` uses `<Teleport>` and was never affected.)
- **NumberInput overflowed its container.** The root was `inline-flex` with no width, so it shrink-to-fit the native input's ~170px preferred width plus both steppers and spilled out of narrow grid columns and mobile layouts. The root is now `display: flex; width: 100%` (matching `Input`), and `__field` gets `min-width: 0` so it can actually shrink.
- **`size="icon"` buttons rendered the glyph off-centre.** Children go into `.vyre-btn__label { flex: 1 }`, which stretches, and SVG baseline alignment nudged the icon down — visible on FABs and close buttons. The icon-button label now shrink-wraps and centres, and `.vyre-btn--icon svg` is `display: block`.
