---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `Stat` + `StatGroup` — a presentational dashboard KPI.

`label` + a large `value`, with an optional `delta`, `deltaLabel`, and leading `icon` (Vue: `#icon` slot). The arrow **direction** follows the sign of `delta` (the real change: `-0.4%` → down arrow); the **color** is set separately by `trend` (`up`=success, `down`=danger, `neutral`=muted). So a "lower is better" metric (churn, bounce) that decreases shows a green *down* arrow — direction stays honest, color stays semantic. `size` (`sm`/`md`/`lg`) scales the value; `StatGroup` lays several Stats out as an evenly-split row with dividers. Zero state, token-styled. Backlog component #6 — "soon" badge removed.
