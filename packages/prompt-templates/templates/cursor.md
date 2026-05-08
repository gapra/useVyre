# useVyre Prompt Templates — Cursor IDE

Use these in Cursor chat (`Cmd+L`) or inline (`Cmd+K`).
For persistent rules across all files, add contents of `@usevyre/ai-context/cursor` to `.cursor/rules`.

---

## Template 1: Generate a component (Cmd+K inline)

```
Using @usevyre/react, build: [describe component]
- Button variants: primary | secondary | ghost | accent | teal | danger
- No color prop on Button, use variant
- Semantic tokens only for custom styles
```

---

## Template 2: Chat — Build a full page (Cmd+L)

```
I'm working with the useVyre design system. @usevyre/react is installed.

Available components: Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, Command, DropdownMenu, Input, Label, Modal, Pagination, Popover, Progress, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs, Toast, Tooltip, Typography

Critical rules:
- Button: variant = primary | secondary | ghost | accent | teal | danger, size = sm | md | lg | icon
- Badge: variant = default | accent | teal | success | warning | danger
- Alert: variant = info | success | warning | danger (no "error")
- Toast: use useToast() hook, never render <Toast> directly
- Input type="search" → use Command component instead

Build: [describe what you need]
```

---

## Template 3: Fix AI-generated useVyre code

```
This code uses @usevyre/react but has hallucinated props. Fix it:

[paste your code]

Rules to fix by:
- Replace any color= with variant=
- Replace size="xl" with size="lg"
- Replace variant="error" with variant="danger"
- Replace variant="info" on Badge with variant="teal"
- Add aria-label to any Button size="icon" that's missing it
- Wrap <Toast> renders in useToast() hook pattern
```

---

## Template 4: Refactor to useVyre

```
Refactor this component to use @usevyre/react design system. Import all UI components from there.

[paste your component]

Map these:
- <button> → <Button variant="secondary">
- <input> → <Input> (wrap in <Field> if it has a label)
- <select> → <Select options={[{value, label}]}>
- <div class="card"> → <Card variant="outlined">
- Status text → <Badge variant="success|warning|danger">
- Alerts/messages → <Alert variant="info|success|warning|danger">
```

---

## Template 5: Generate a form (Cmd+L)

```
Using @usevyre/react, build a form for: [describe form]

Form pattern to follow:
<Field label="..." state="idle|error|success" hint="...">
  <Input ... />
</Field>

Use:
- <Switch> for boolean toggles
- <Select options={[{value, label}]}> for dropdowns
- <Checkbox> for multi-select options
- <Button variant="accent" type="submit" loading={isSubmitting}> for submit
- Show errors via Field state="error" hint={errorMessage}
```
