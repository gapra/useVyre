---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Tooltip: now portals to `<body>` by default so it stays fully visible inside `Modal` and other `overflow: hidden` containers (same overlay-clip class as the Combobox #18 / Select fixes). It is positioned against the trigger via JS and repositions on scroll/resize; the arrow and animation are unchanged.

New `disablePortal` prop (boolean, default `false`) restores the previous inline rendering.
