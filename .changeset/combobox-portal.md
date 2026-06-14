---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Combobox: the dropdown now portals to `<body>` by default so it stays fully visible inside `Modal` and other `overflow: hidden` containers (issue #18). It is positioned against the input and repositions on scroll/resize, flipping above the input when there is no room below.

New `disablePortal` prop (boolean, default `false`) restores the previous inline rendering for cases where the dropdown should stay inside the component's own DOM subtree.
