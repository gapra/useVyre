---
"@usevyre/react": patch
---

Use an SSR-safe layout effect in Tooltip and the shared dropdown positioning
hook (Combobox/Select). They previously called `useLayoutEffect` directly,
which logs a "useLayoutEffect does nothing on the server" warning during SSR
(e.g. in Astro/Next). A new `useIsomorphicLayoutEffect` helper uses
`useLayoutEffect` in the browser and `useEffect` on the server — identical
client behavior, no SSR warning.
