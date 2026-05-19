---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `Timeline` + `TimelineItem` — a vertical activity feed for audit logs and history.

Each entry has a status-colored marker dot (`default`/`success`/`warning`/`danger`/`info`, overridable with a custom `icon`), an optional right-aligned `time`, a `title`, and optional rich content. Pass an `items` array for plain logs or compose `TimelineItem` children (React children / Vue slot) for badges, links, and custom markup. Connector line drawn between items; Timeline does not reorder — items render in given order. Distinct from `Stepper` (an ordered flow with current/upcoming state). Backlog component #7 — "soon" badge removed.
