---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

Add `Tree` — a data-driven, controlled hierarchical tree view.

For file explorers and nested navigation. Pass a nested `data` array (`{ id, label, icon?, disabled?, children? }`) and the Tree renders recursively. Single selection, fully controlled: `selectedId`/`onSelect` and `expandedIds`/`onExpandedChange` (plus `defaultSelectedId`/`defaultExpandedIds` for uncontrolled). A node with `children` is a folder (click toggles); leaves fire `onSelect`. Full keyboard nav (Arrow up/down move, Arrow right/left expand/collapse, Enter/Space select) and ARIA tree roles. React uses `selectedId`/`onSelect`; Vue uses `v-model:selected` / `v-model:expanded`. Backlog component #8 — "soon" badge removed.
