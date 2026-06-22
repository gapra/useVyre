---
"@usevyre/docs": patch
---

Make the docs site mobile-friendly. Below 768px the sidebar had no replacement, leaving no way to navigate between docs/component pages, and the TopNav links overflowed off-screen.

- Add a hamburger button (mobile-only) that opens a slide-in drawer containing the primary nav links plus the full docs sidebar; closes on overlay click, ✕, ESC, link tap, or resize past the breakpoint, with body scroll-lock while open.
- Hide the primary TopNav links on mobile (they live in the drawer).
- Props tables switch to `table-layout: auto` + a min-width on mobile so they scroll horizontally instead of cramming four columns into a phone width.
- 44px tap targets for drawer nav links.
