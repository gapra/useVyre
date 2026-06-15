---
"@usevyre/vue": patch
---

Command: determine visible items by inline `display` instead of `offsetParent`, so the active-item highlight works without a layout engine (server-side rendering / test environments). No change in the browser.
