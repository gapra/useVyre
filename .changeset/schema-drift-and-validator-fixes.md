---
"@usevyre/ai-context": patch
"@usevyre/validate-ai-context": patch
---

Fix schema↔code drift in five more props, and close two validator blind spots
that allowed those (and the prior callback drifts) to slip past `npx
@usevyre/validate-ai-context` in CI.

**Schema drift fixes (`@usevyre/ai-context`)** — the schema advertised prop
names and types that the React/Vue components don't actually accept; agents
following the schema produced code that fails TypeScript or behaves
incorrectly:

- `Modal.title` and `Sheet.title`: removed. Use the `<ModalHeader>` and
  `<SheetHeader>` sub-components for the accessible title.
- `Pagination.total` → `totalPages` (the `examples` were corrected in
  1.4.1; this completes the props key, which was missed).
- `Tabs.defaultIndex` (number) → `defaultValue` (string); `Tabs.index`
  (number) → `value` (string). `Tab` and `TabPanel` use string `value` keys,
  not auto-indexed integers — examples updated accordingly.

Schema internal version: 1.16.2.

**Validator fixes (`@usevyre/validate-ai-context`)**:

- The antiPattern matcher used `pattern.includes("${prop}=")`, which flagged
  any prop whose name appeared anywhere in any antiPattern string. That
  treated contextual guidance (e.g. `'type="search" for search UI'`,
  `'DropdownItem variant="primary"'`, `'value as tuple for mode="single"'`)
  as proof the prop was hallucinated, producing 12 false positives over
  `apps/docs/src` for valid usage like `<Input type="email">`, `<Calendar
  mode="range">`, and `<DropdownMenu>`. Replaced with a strict regex that
  only matches bare `prop="..."` / `prop={...}` declarative antiPatterns.

- The JSX parser only recognized `prop="literal"`; `prop={expression}` was
  silently dropped. Agents and humans commonly bind props to variables, so
  validator was blind to the most realistic hallucination forms (e.g.
  `<Button color={brand}>`, `<Switch onChange={handler}>`). Parser is now
  brace-aware and quote-aware end-to-end (tag extraction and prop reading),
  so hallucinations are caught in either form.

73 contract + behavior tests guard these invariants.
