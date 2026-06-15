---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Combobox & Select: opening the dropdown no longer scrolls the whole page. The "scroll highlighted option into view" logic used `element.scrollIntoView()`, which — now that the dropdown is portaled to `<body>` — scrolled the document instead of the dropdown. It now adjusts the dropdown's own `scrollTop`, keeping the highlighted option visible without moving the page.
