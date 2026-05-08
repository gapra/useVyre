# useVyre Prompt Templates — Windsurf

Use these in Windsurf's Cascade chat or inline AI commands.
For persistent rules, add `@usevyre/ai-context/windsurf` contents to `.windsurfrules`.

---

## Template 1: Build a component (Cascade chat)

```
I'm using the useVyre design system (@usevyre/react) in this project.

Component rules:
- Button variants: primary | secondary | ghost | accent | teal | danger
- Never use color prop on Button — use variant
- Button size="icon" always needs aria-label
- Badge variants: default | accent | teal | success | warning | danger
- Alert variants: info | success | warning | danger (NOT "error")
- Toast: only via useToast() hook, never render <Toast> in JSX

Build: [describe what you need]
```

---

## Template 2: Full page generation

```
This project uses @usevyre/react (useVyre design system).

Available components:
Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox,
Command, DropdownMenu, Input, Label, Modal, Pagination, Popover, Progress,
Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs,
Toast, Tooltip, Typography

Key rules:
1. All imports from @usevyre/react
2. Semantic tokens for custom styles: --vyre-color-semantic-*, --vyre-spacing-*
3. Search UI → use Command, not Input type="search"
4. Form fields → wrap Input in Field for label/validation
5. Side panels → use Sheet (not custom drawer)

Generate: [describe your page]
```

---

## Template 3: Inline command

```
// @usevyre/react — Button: variant=primary|secondary|ghost|accent|teal|danger, no color prop
```

```
// @usevyre/react — Field + Input pattern for forms with validation states
```

```
// @usevyre/react — Toast via useToast() hook, variant=default|success|warning|danger
```

---

## Template 4: Refactor existing code to useVyre

```
Refactor to use @usevyre/react. Rules:
- Replace <button> → <Button variant="secondary">
- Replace <input> → <Input> wrapped in <Field label="...">
- Replace status strings/pills → <Badge variant="success|warning|danger">
- Replace alerts/banners → <Alert variant="info|success|warning|danger">
- Replace custom modals → <Modal open={...} onClose={...} size="sm|md|lg|full">
- Replace loading states → loading prop on Button, or <Skeleton> for content

[paste component to refactor]
```
