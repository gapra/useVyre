---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Button: add `flex-shrink: 0` so a Button in a flex row (toolbar, modal footer, button group) is never shrunk below its label. Previously, with `white-space: nowrap`, a constrained row could squeeze the button and spill its text past the padding; flexible siblings (e.g. a search input) now absorb the space instead.
