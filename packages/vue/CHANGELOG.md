# @usevyre/vue

## 1.1.0

### Minor Changes

- Add six new components for React + Vue, each with AI context schema, anti-patterns, and docs:

  - **ButtonGroup** — groups buttons horizontally/vertically with optional border collapse (attached mode)
  - **TagsInput** — multi-tag input (Enter/comma to add, × to remove, Backspace to delete last); now composes the Tag component internally
  - **Combobox** — searchable single-select with typeahead filtering and full keyboard navigation
  - **DataGrid** — table with built-in column sorting, loading skeletons, empty state, and sticky header
  - **Tag** — standalone display chip with variant, size, removable, and clickable states
  - **TagGroup** — read-only layout container for multiple Tag elements with wrapping and gap control

## 1.0.2

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
