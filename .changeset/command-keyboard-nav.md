---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Command: fix keyboard navigation feedback.

- React: Arrow/Enter did nothing because the key handler was attached only to `CommandList` (a div that never receives focus); it now lives on the `Command` root so keystrokes from the focused `CommandInput` are handled.
- React & Vue: the active item now sets `aria-selected`, so it is visibly highlighted (the CSS for it already existed but was never triggered) and announced to assistive tech.
- React & Vue: navigating no longer risks scrolling the page — the active item is scrolled within the list container instead of via `element.scrollIntoView()`.
