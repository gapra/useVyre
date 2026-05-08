# useVyre Prompt Templates — Claude

Copy-paste these prompts into Claude (claude.ai, Claude Desktop, or Claude Code).
For best results, first run: `npx @usevyre/ai-context init --claude` to add CLAUDE.md to your project.

---

## Template 1: Build a Dashboard

```
I'm building a React dashboard using the useVyre design system (@usevyre/react).

Rules:
- Only use components that exist in useVyre: Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, Command, DropdownMenu, Input, Label, Modal, Pagination, Popover, Progress, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs, Toast, Tooltip, Typography
- Always use semantic tokens for colors (--vyre-color-semantic-*), never hardcode
- Use variant prop for Button, never color prop
- Add aria-label to any Button with size="icon"

Build me a dashboard with:
- Sidebar with navigation links
- Header with search (use Command component) and user avatar
- Main area with stats cards and a data table

Import all components from @usevyre/react.
```

---

## Template 2: Build a Form

```
I'm using the useVyre design system (@usevyre/react).

Form rules:
- Wrap each Input in a <Field> component for label + validation state
- Field state prop: "idle" | "error" | "success" | "warning"
- Use <Select options={[{ value, label }]}> for dropdowns, never native <select>
- Use <Switch> or <Checkbox> for boolean fields
- Submit button: <Button variant="accent" type="submit" loading={isSubmitting}>

Build me a [describe your form] with validation states.
```

---

## Template 3: Build a Settings Page

```
I'm using the useVyre design system (@usevyre/react).

Build a settings page with:
- Tabs for different sections (use <Tabs>, <TabList>, <Tab>, <TabPanels>, <TabPanel>)
- Toggle switches for boolean settings (use <Switch checked={...} onChange={...}>)
- A save button with loading state (use <Button variant="accent" loading={isSaving}>)
- Use <Card> with variant="outlined" for each settings group
- Show success toast on save: const { toast } = useToast(); toast({ title: 'Saved!', variant: 'success' })

Sections: [describe your settings sections]
```

---

## Template 4: Build a Data Table with Actions

```
I'm using the useVyre design system (@usevyre/react).

Table rules:
- Use <Table>, <TableHead>, <TableBody>, <TableRow>, <TableHeader>, <TableCell>
- Use <Badge> for status columns: variant="success" | "danger" | "warning" | "default"
- Use <DropdownMenu> for row action menus, not custom dropdowns
- Use <Pagination page={currentPage} total={totalPages} onChange={setCurrentPage}> below the table
- Loading skeleton: replace TableCell content with <Skeleton variant="text" width="80%" />

Build a [describe your data] table with sorting and row actions.
```

---

## Template 5: Build a Modal / Dialog

```
I'm using the useVyre design system (@usevyre/react).

Modal rules:
- size prop: "sm" | "md" | "lg" | "full" (no "xl")
- Always provide onClose and open props
- Structure: <Modal> → <ModalBody> → <ModalFooter>
- Footer buttons: Cancel (variant="ghost") + Confirm (variant="primary" or "danger")

Build a confirmation modal for [describe your action].
```

---

## Template 6: Add Notifications / Toasts

```
I'm using the useVyre design system (@usevyre/react).

Toast rules:
- NEVER render <Toast> directly in JSX
- Always use the hook: const { toast } = useToast()
- variant: "default" | "success" | "warning" | "danger" (no "error", no "info")
- Wrap your app root in <ToastProvider>

Add toast notifications for: success on save, error on failure, warning for rate limits.
```

---

## Template 7: Quick Component (one-liner)

```
Using useVyre (@usevyre/react), generate: [describe what you need]

Constraints:
- Button variants: primary, secondary, ghost, accent, teal, danger
- Badge variants: default, accent, teal, success, warning, danger
- Avatar sizes: sm, md, lg, xl
- Never use color prop on Button — use variant
```
