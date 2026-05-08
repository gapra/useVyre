# useVyre Prompt Templates — Generic / Any AI

Use these with any AI tool: ChatGPT, Gemini, Mistral, or any local model.
These are self-contained — no project context needed.

---

## Template 1: Build UI with full context (self-contained)

```
You are helping me build a React UI using the useVyre design system.

## Available Components (import all from @usevyre/react)
Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox,
Command, DropdownMenu, Input, Field, Label, Modal, Pagination, Popover, Progress,
Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs,
Toast (via useToast hook), Tooltip, Typography (Text, Heading, Lead, Code)

## Critical Rules
- Button variant: "primary" | "secondary" | "ghost" | "accent" | "teal" | "danger"
- Button size: "sm" | "md" | "lg" | "icon"
- NEVER use color prop on Button — use variant
- ALWAYS add aria-label to Button size="icon"
- Badge variant: "default" | "accent" | "teal" | "success" | "warning" | "danger"
- Alert variant: "info" | "success" | "warning" | "danger" (NOT "error", NOT "primary")
- Avatar size: "sm" | "md" | "lg" | "xl" (NOT "xs", NOT "2xl")
- Modal size: "sm" | "md" | "lg" | "full" (NOT "xl")
- Toast: use const { toast } = useToast(); NEVER render <Toast> directly
- Toast variant: "default" | "success" | "warning" | "danger" (NOT "error", NOT "info")
- Search UI: use Command component, NOT Input type="search"
- Form fields: wrap Input in <Field label="..." state="idle|error|success|warning">

## Semantic Token Rules
- Custom styles: use --vyre-color-semantic-* tokens (NEVER hardcode colors)
- Spacing: use --vyre-spacing-1 (4px) through --vyre-spacing-24 (96px)
- Key tokens: --vyre-color-semantic-accent, --vyre-color-semantic-surface, --vyre-color-semantic-border

## Task
[describe what you need]
```

---

## Template 2: Minimal (quick generation)

```
React component using @usevyre/react.
Button: variant=primary|secondary|ghost|accent|teal|danger, no color prop.
Badge: variant=default|accent|teal|success|warning|danger.
Alert: variant=info|success|warning|danger.
Toast: useToast() hook only.
Build: [describe what you need]
```

---

## Template 3: Validate & fix existing code

```
I have React code using @usevyre/react (useVyre design system).
Fix any invalid props according to these rules:

Invalid → Valid:
- color="..." on Button → variant="accent" (or appropriate variant)
- size="xl" → size="lg"
- variant="error" → variant="danger"
- variant="primary" on Badge/Alert → variant="accent" / variant="info"
- variant="info" on Badge → variant="teal"
- icon={...} on Button → leftIcon={...} or rightIcon={...}
- <Toast> rendered directly → useToast() hook pattern
- Input type="search" for search UI → Command component
- Button size="icon" without aria-label → add aria-label

Code to fix:
[paste your code]
```

---

## Template 4: Component cheat sheet request

```
Give me the exact valid prop values for these useVyre (@usevyre/react) components:
- Button: variants and sizes
- Badge: variants
- Alert: variants
- Avatar: sizes
- Modal: sizes
- Toast: variants and how to trigger

Then generate: [describe your task]
```
