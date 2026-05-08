# useVyre Prompt Templates — GitHub Copilot

Use these as inline comments to guide Copilot completions,
or paste into Copilot Chat.

For persistent context, add `@usevyre/ai-context/copilot` contents to `.github/copilot-instructions.md`.

---

## Inline comment triggers (in your .tsx file)

### Generate a Button

```tsx
// useVyre Button: variant=primary|secondary|ghost|accent|teal|danger, size=sm|md|lg|icon
// No color prop. Add aria-label for size="icon".
<Button
```

### Generate a Badge

```tsx
// useVyre Badge: variant=default|accent|teal|success|warning|danger, dot=boolean
<Badge
```

### Generate a Card

```tsx
// useVyre Card: variant=default|elevated|outlined|ghost|accent, hoverable, clickable
// Compose with CardHeader, CardBody, CardFooter
<Card
```

### Generate a form field

```tsx
// useVyre Field: state=idle|error|success|warning, label=string, hint=string, required=boolean
// Wrap Input inside Field for validation styling
<Field
```

### Generate an Alert

```tsx
// useVyre Alert: variant=info|success|warning|danger (NOT "error", NOT "primary")
<Alert
```

### Generate a Modal

```tsx
// useVyre Modal: size=sm|md|lg|full (NOT "xl"), needs open+onClose props
// Compose with ModalBody, ModalFooter
<Modal
```

### Generate a Toast

```tsx
// useVyre Toast: use useToast() hook ONLY, never render <Toast> directly
// variant=default|success|warning|danger (NOT "error", NOT "info")
const { toast } = useToast();
// toast({ title: '...', variant: 'success', duration: 3000 })
```

### Generate a Table

```tsx
// useVyre Table: compose with TableHead, TableBody, TableRow, TableHeader, TableCell
// Use Badge for status cells, DropdownMenu for row actions
<Table>
```

---

## Copilot Chat templates

### Build a component from scratch

```
Using @usevyre/react (already installed), create a [component name].

Valid props reference:
- Button: variant = primary | secondary | ghost | accent | teal | danger
- Badge: variant = default | accent | teal | success | warning | danger
- Alert: variant = info | success | warning | danger
- Avatar: size = sm | md | lg | xl

Do not use color prop on Button. Do not use variant="error" anywhere.
```

### Fix hallucinated props

```
Fix useVyre prop errors in this code:
[paste code]

Common fixes:
- color="blue" → variant="accent"
- size="xl" → size="lg"
- variant="error" → variant="danger"
- variant="info" (on Badge) → variant="teal"
- icon={...} on Button → leftIcon={...}
```
