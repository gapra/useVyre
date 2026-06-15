---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Select: fix keyboard navigation. Arrow/Enter/Home/End keys did nothing once the dropdown was open because the navigation handler lived on the listbox element, which never receives focus (focus stays on the trigger). The trigger now delegates navigation keys to the list handler while open, so the full keyboard flow (open, move highlight, select, close) works.
