---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Select: the dropdown now portals to `<body>` by default so it stays fully visible inside `Modal` and other `overflow: hidden` containers (same class of bug as the Combobox fix in #18). It is positioned against the trigger and repositions on scroll/resize, flipping above when there is no room below.

New `disablePortal` prop (boolean, default `false`) restores the previous inline rendering.
