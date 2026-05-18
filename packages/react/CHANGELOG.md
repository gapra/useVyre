# @usevyre/react

## 1.3.0

### Minor Changes

- Expand and fix the Stack / Grid / Box layout primitives.

  **Bug fix (Grid):** when a `style` prop was passed to `<Grid>`, the user's style object overwrote the internal `--vyre-grid-columns` custom property, so `columns` was silently ignored and the grid collapsed to a single column (rows of stacked cells). Internal CSS-variable styles are now merged with any user `style` instead of being replaced.

  **Stack** now covers the full CSS flexbox surface, still token-locked: `direction` adds `row-reverse`/`column-reverse`; `inline`; per-axis `rowGap`/`columnGap`; `alignContent`; `alignSelf`; `wrap` is now `"nowrap" | "wrap" | "wrap-reverse"` (was a boolean); `grow`, `shrink`, and token `basis`.

  **Grid** gains `rows`, `flow` (grid-auto-flow), `justify` (justify-items), and per-axis `rowGap`/`columnGap`, plus a new **`GridItem`** subcomponent for `colSpan` / `rowSpan` / `colStart` / `rowStart` placement instead of nested inline `grid-column`.

  **Box** padding/margin are now controllable per axis and per side: `paddingX`/`paddingY`/`paddingTop`/`paddingRight`/`paddingBottom`/`paddingLeft` (and the `margin*` equivalents), all token-locked, with per-side overriding the axis/shorthand.

  Non-breaking: `wrap` on `<Stack>` accepts the new string enum `"nowrap" | "wrap" | "wrap-reverse"` but still accepts a boolean — `wrap` / `wrap={true}` resolves to `"wrap"`, `wrap={false}` to `"nowrap"` — so existing usage keeps working.

- Add Stack, Grid and Box layout primitives.

  These replace hand-written inline `display: flex` / `display: grid` containers — the single biggest source of AI-hallucinated frontend code. Every spacing value is a closed design-token enum (`none`/`xs`/`sm`/`md`/`lg`/`xl`/`2xl` → `--vyre-spacing-*`), never a raw px/rem number, and `align`/`justify` use canonical names only (no `flex-end` vs `self-end` ambiguity).

  - `Stack` — one-dimensional flex (`direction`, `gap`, `align`, `justify`, `wrap`, `as`)
  - `Grid` — two-dimensional grid (`columns` 1–12 or `auto-fit`, `gap`, `align`, `as`)
  - `Box` — spacing-only container (`padding`, `margin`, `as`) plus a documented `style` escape hatch flagged as an anti-pattern

  All three render a plain `<div>` (or the `as` element) in the browser, with React and Vue APIs in sync. Props, anti-patterns and examples are added to `@usevyre/ai-context` so agents pick these over raw inline styles.

- Add token-locked `width` / `height` props to Stack, Grid and Box.

  Previously the only way to size a layout primitive was an inline `style={{ width: "100%" }}` — the exact escape hatch useVyre tries to avoid, and a common source of AI magic numbers. Both props now accept:

  - Keywords: `"auto"`, `"full"` (100%), `"fit"` (fit-content), `"screen"` (100vw width / 100vh height)
  - Fixed-rem token sizes: `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 32 · `2xl` 42

  This also fixes a confusing docs preview: a `<Stack justify="between">` with no width only hugs its content (so `justify` looked like it did nothing). The Stack example now uses `width="full"`, making `justify`/`align` behaviour visible. Inline `width`/`height` styles are added as a documented anti-pattern in `@usevyre/ai-context`.

## 1.2.1

### Patch Changes

- Sidebar fixes + customizable SidebarTrigger icon

  - **Fix:** `Sidebar` footer no longer floats mid-height — dropped the brittle `height: 100%` (which needed an explicit-height parent) in favor of flex `align-self: stretch`, so `__content` (flex: 1) reliably pushes `__footer` to the bottom.
  - **Fix:** collapsed `Sidebar` no longer overflows the 56px rail — `__header` / `__footer` now center their content and trim horizontal padding when collapsed.
  - **Fix:** replaced ~57 invalid CSS custom-property references across the component stylesheet (`--vyre-radius-*` → `--vyre-border-radius-*`, `--vyre-color-semantic-text` → `--vyre-color-semantic-text-primary`, `--vyre-color-semantic-surface-hover` → `--vyre-color-semantic-surface-raised`, `--vyre-typography-font-weight-normal` → `--vyre-typography-font-weight-regular`). These resolved to nothing, silently breaking border-radius and some colors on several components.
  - **Feature (additive, non-breaking):** `SidebarTrigger` now accepts a custom icon, with a distinct glyph per state — React: `icon` / `collapsedIcon` props; Vue: `#icon` / `#collapsed-icon` slots. `collapsedIcon` falls back to `icon`, which falls back to the built-in menu icon, so existing usage is unchanged.

## 1.2.0

### Minor Changes

- Add `Item`, `DateRangePicker`, `Kanban`, `Conversation`; `Calendar` gains `defaultMonth`

  **`Item`** — composable row primitive for list / settings / notification rows, denser than `Card`. Sub-components: `ItemGroup` (`separated` adds dividers), `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`. Variants: `default` | `outlined` | `muted` | `plain` (`plain` is transparent with no border — for composing `Item` inside another surface such as a `Card` or a `Kanban` card without a double background).

  **`DateRangePicker`** — start/end range picker built on `Calendar` (mode=range) with a friendlier `{ from, to }` object API, a two-month side-by-side view, and preset shortcuts (`presets` — built-in set or custom array). Props: `value`, `onChange`, `placeholder`, `numberOfMonths` (1 | 2), `presets`, `minDate`, `maxDate`, `disabled`, `weekStartsOn`.

  **`Calendar`** — new additive (non-breaking) `defaultMonth?: Date` prop: sets the initially displayed month when `value` is empty. Used internally by `DateRangePicker` for its second month.

  **`DatePicker`** — now a first-class, separately documented component. No API change: in React it moved from `Calendar.tsx` into its own `Calendar/DatePicker` module (same import path `@usevyre/react`); it gained its own schema entry, AI cheat sheet, sidebar entry, and docs page (previously only shown inside the Calendar page). Calendar's schema/docs were tightened to focus on the inline grid and cross-link the trio.

  **`Kanban`** — controlled drag-and-drop board. Cards move between columns or reorder within one via native HTML5 DnD (zero dependencies). Data-driven like `DataGrid`: `value`/`onChange` (React) or `v-model` (Vue) of `KanbanColumn[]`. Optional `renderCard` render prop (React) / `#card` scoped slot (Vue) and `onCardClick` / `@card-click`.

  **`Conversation`** — controlled chat / inbox message thread. Data-driven like `Kanban`: you own `value` (`ConversationMessage[]`) and append in `onSend` / `@send`. Consecutive same-author messages are grouped (avatar + name shown once), day separators inserted on date change, outgoing messages (`authorId === currentUserId`) align right. Optional built-in `composer` (with `allowAttachments` for a 📎 file picker), `typing` indicator, delivery `status`, message `attachments` (image/audio/video/file), and `renderMessage`/`renderComposer` render props (`#message`/`#composer` slots in Vue). Zero dependencies.

  **`RadioGroup` + `Radio`** — controlled single-choice group. Render data-driven via an `options` array or composable with `<Radio>` children. `value`/`onChange` (React) or `v-model` (Vue), `name`, `disabled`, `size`, `orientation`. `role="radiogroup"` with native radio inputs.

  **`Field` composable parts** — `Field` gains `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet` for richer form layouts. **Non-breaking**: the existing props-based `<Field label hint state required />` API is unchanged and still works.

  **`RichTextEditor`** — controlled WYSIWYG editor. `value` is an HTML string; `onChange` (React) / `v-model` (Vue) gives the next HTML. Native `contentEditable` + `execCommand`, **zero dependencies**. Toolbar: bold, italic, underline, strike, h1–h3, ordered/unordered lists, quote, code block, link, clear; configurable via `toolbar`. Also `placeholder`, `disabled`, `readOnly`, `minHeight`. Completes all previously "soon" components.

  **Vue `Input` & `Textarea`** — additive (non-breaking) `v-model` support (`modelValue` + `update:modelValue`); native attr forwarding is unchanged.

  All components ship in `@usevyre/react` and `@usevyre/vue` with an identical API. Schema, AI cheat sheets, and docs pages added.

## 1.1.0

### Minor Changes

- Add six new components for React + Vue, each with AI context schema, anti-patterns, and docs:

  - **ButtonGroup** — groups buttons horizontally/vertically with optional border collapse (attached mode)
  - **TagsInput** — multi-tag input (Enter/comma to add, × to remove, Backspace to delete last); now composes the Tag component internally
  - **Combobox** — searchable single-select with typeahead filtering and full keyboard navigation
  - **DataGrid** — table with built-in column sorting, loading skeletons, empty state, and sticky header
  - **Tag** — standalone display chip with variant, size, removable, and clickable states
  - **TagGroup** — read-only layout container for multiple Tag elements with wrapping and gap control

## 1.0.3

### Patch Changes

- d51d685: Fix exports pointing to dist instead of src, fix CSS @import namespace from @vyre to @usevyre

## 1.0.0

### Major Changes

- Release v1.0.0 — stable public release of the AI-native design system

### Patch Changes

- Updated dependencies
  - @usevyre/tokens@1.0.0

## 0.1.1

### Patch Changes

- Add READMEs and fix homepage URLs
- Updated dependencies
  - @usevyre/tokens@0.1.1
