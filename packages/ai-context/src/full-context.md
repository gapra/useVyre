# useVyre Design System — AI Context
# Version: 0.2.0
# Include this file in your AI agent's system prompt, .cursor/rules, or CLAUDE.md
# Source: https://usevyre.com/ai-context

---

## What is useVyre?

useVyre is an AI-native design system for React and Vue. It uses CSS custom properties
(variables) as its single source of truth, making it inherently AI-friendly — no magic,
no runtime transforms, just semantic token names that describe intent.

---

## Installation

```bash
# Tokens (required by everything)
pnpm add @usevyre/tokens

# React components
pnpm add @usevyre/react

# Vue components
pnpm add @usevyre/vue
```

## CSS Setup

```css
/* In your global CSS entry point */
@import "@usevyre/tokens/css";      /* design tokens */
@import "@usevyre/react/styles";    /* component styles (React) */
/* or */
@import "@usevyre/vue/styles";      /* component styles (Vue) */
```

---

## Token Naming Convention

ALL tokens follow this pattern:
```
--vyre-[category]-[subcategory]-[variant]
```

Examples:
- `--vyre-color-semantic-accent`          ✅ Use this
- `--vyre-color-primitive-amber-400`      ❌ Never use primitives in components
- `--vyre-spacing-4`                      ✅ 16px spacing
- `--vyre-typography-font-size-sm`        ✅ 13px font size

---

## Semantic Color Tokens (use these in ALL component styling)

### Surface layers (background → foreground)
- `--vyre-color-semantic-background`      Page background. Deepest layer.
- `--vyre-color-semantic-surface`         Cards, panels, sidebars.
- `--vyre-color-semantic-surface-raised`  Dropdowns, inputs, elevated cards.
- `--vyre-color-semantic-surface-overlay` Modals, tooltips.

### Borders
- `--vyre-color-semantic-border-subtle`   Dividers, subtle separators.
- `--vyre-color-semantic-border`          Default card/input borders.
- `--vyre-color-semantic-border-strong`   Focus rings, selected states.

### Text hierarchy
- `--vyre-color-semantic-text-primary`    Headings, body text.
- `--vyre-color-semantic-text-secondary`  Subtitles, descriptions.
- `--vyre-color-semantic-text-muted`      Placeholders, helper text.
- `--vyre-color-semantic-text-disabled`   Disabled state text.
- `--vyre-color-semantic-text-inverse`    Text on light/accent backgrounds.

### Brand colors
- `--vyre-color-semantic-accent`          Primary CTA, highlights. (amber)
- `--vyre-color-semantic-accent-hover`    Hover for accent elements.
- `--vyre-color-semantic-accent-subtle`   Low-opacity accent backgrounds.
- `--vyre-color-semantic-teal`            Secondary accent. Code, success. (teal)
- `--vyre-color-semantic-teal-hover`      Hover for teal elements.
- `--vyre-color-semantic-teal-subtle`     Low-opacity teal backgrounds.

### Semantic status colors
- `--vyre-color-semantic-success`         Confirmations, complete states.
- `--vyre-color-semantic-success-subtle`  Success badge backgrounds.
- `--vyre-color-semantic-warning`         Warnings, beta indicators.
- `--vyre-color-semantic-warning-subtle`  Warning badge backgrounds.
- `--vyre-color-semantic-danger`          Errors, destructive actions.
- `--vyre-color-semantic-danger-hover`    Hover for danger elements.
- `--vyre-color-semantic-danger-subtle`   Error badge backgrounds.

---

## Typography Tokens

### Font families
- `--vyre-typography-font-family-display`  Headlines, hero text (serif)
- `--vyre-typography-font-family-body`     UI text, labels, body copy (sans-serif)
- `--vyre-typography-font-family-mono`     Code, tokens, technical text (monospace)

### Font sizes
- `--vyre-typography-font-size-2xs`  10px — tiny labels
- `--vyre-typography-font-size-xs`   11px — badge text, captions
- `--vyre-typography-font-size-sm`   13px — default UI text, buttons
- `--vyre-typography-font-size-md`   15px — body text
- `--vyre-typography-font-size-lg`   18px — large body, small headings
- `--vyre-typography-font-size-xl`   22px — section headings
- `--vyre-typography-font-size-2xl`  28px — page headings
- `--vyre-typography-font-size-3xl`  36px — large headings
- `--vyre-typography-font-size-4xl`  48px — hero headings
- `--vyre-typography-font-size-5xl`  64px — display headings

### Font weights
- `--vyre-typography-font-weight-light`    300
- `--vyre-typography-font-weight-regular`  400
- `--vyre-typography-font-weight-medium`   500
- `--vyre-typography-font-weight-semibold` 600
- `--vyre-typography-font-weight-bold`     700

---

## Spacing Tokens (4px base grid)

- `--vyre-spacing-1`   4px
- `--vyre-spacing-2`   8px
- `--vyre-spacing-3`   12px
- `--vyre-spacing-4`   16px
- `--vyre-spacing-5`   20px
- `--vyre-spacing-6`   24px
- `--vyre-spacing-8`   32px
- `--vyre-spacing-10`  40px
- `--vyre-spacing-12`  48px
- `--vyre-spacing-16`  64px
- `--vyre-spacing-20`  80px
- `--vyre-spacing-24`  96px

---

## Border Radius Tokens

- `--vyre-border-radius-none`  0
- `--vyre-border-radius-sm`    4px   — tight corners
- `--vyre-border-radius-md`    8px   — default components
- `--vyre-border-radius-lg`    12px  — cards, panels
- `--vyre-border-radius-xl`    16px  — large cards
- `--vyre-border-radius-2xl`   24px  — modals, sheets
- `--vyre-border-radius-full`  9999px — badges, pills, avatars

---

## Component API Reference

### Accordion

Vertically stacked collapsible sections. Compose with AccordionItem, AccordionTrigger, AccordionContent.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@usevyre/react"

// Examples:
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>Content goes here.</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Common mistakes:**
- ❌ `Accordion without AccordionItem` → Always compose: Accordion > AccordionItem > AccordionTrigger + AccordionContent

---

### Alert

Inline feedback message for info, success, warning, or danger states.

```tsx
import { Alert } from "@usevyre/react"

// Props:
// variant        = "info" | "success" | "warning" | "danger" (default: info)
// title          = string
// onClose        = function

// Examples:
<Alert variant="warning" title="Heads up" onClose={() => setOpen(false)}>
  This action cannot be undone.
</Alert>
<Alert variant="success" title="Saved!">Your changes have been saved.</Alert>
```

**Common mistakes:**
- ❌ `variant="error"` → Use variant="danger"
- ❌ `variant="primary"` → Use variant="info" | "success" | "warning" | "danger"

---

### AlertDialog

Blocking confirmation modal (focus-trapped). Controlled via open + onOpenChange (React) / v-model (Vue). Use for destructive or irreversible actions that need explicit confirm/cancel. For non-blocking inline feedback use Alert; for general dialogs use Modal.

```tsx
import { AlertDialog } from "@usevyre/react"

// Props:
// open           = boolean
// onOpenChange   = function
// title          = string
// description    = string
// variant        = "danger" | "warning" | "info" (default: info)
// confirmLabel   = string (default: Confirm)
// cancelLabel    = string (default: Cancel)
// onConfirm      = function
// onCancel       = function

// Examples:
const [open, setOpen] = useState(false);
<Button variant="danger" onClick={() => setOpen(true)}>Delete</Button>
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete project?"
  description="This cannot be undone."
  confirmLabel="Delete"
  onConfirm={() => deleteProject()}
/>
```

**Common mistakes:**
- ❌ `AlertDialog without open/onOpenChange (React) or v-model (Vue)` → Drive open from state; close in onOpenChange / via v-model
- ❌ `Using Alert (inline banner) for a confirm/cancel decision` → Use AlertDialog for blocking confirmation; Alert for passive messages
- ❌ `variant="success" or "error"` → Use "danger" for destructive, "warning" to caution, "info" otherwise

---

### Avatar

User profile image with fallback initials or icon.

```tsx
import { Avatar } from "@usevyre/react"

// Props:
// src            = string
// alt            = string (default: "")
// fallback       = string
// size           = "sm" | "md" | "lg" | "xl" (default: md)
// status         = "online" | "offline" | "busy" | "away"

// Examples:
<Avatar src="/user.png" alt="Jane Doe" size="lg" status="online" />
<Avatar fallback="JD" size="md" />
```

**Common mistakes:**
- ❌ `size="xs"` → Use size="sm"
- ❌ `size="2xl"` → Use size="xl"

---

### Badge

Small label for status, category, or count. Use dot prop for live status indicator.

```tsx
import { Badge } from "@usevyre/react"

// Props:
// variant        = "default" | "accent" | "teal" | "success" | "warning" | "danger" (default: default)
// dot            = boolean (default: false)

// Examples:
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning">Beta</Badge>
<Badge variant="danger">Error</Badge>
```

**Common mistakes:**
- ❌ `variant="primary"` → Use variant="accent" for brand color
- ❌ `variant="error"` → Use variant="danger"
- ❌ `variant="info"` → Use variant="teal" for info-like styling

---

### Breadcrumb

Navigation trail showing current page location in hierarchy.

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@usevyre/react"

// Examples:
<Breadcrumb>
  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem aria-current="page">Button</BreadcrumbItem>
</Breadcrumb>
```

**Common mistakes:**
- ❌ `Using plain <a> tags inside Breadcrumb` → Use BreadcrumbItem > BreadcrumbLink for each crumb

---

### Button

Triggers actions and navigation. The most commonly used interactive element.

```tsx
import { Button } from "@usevyre/react"

// Props:
// variant        = "primary" | "secondary" | "ghost" | "accent" | "teal" | "danger" (default: secondary)
// size           = "sm" | "md" | "lg" | "icon" (default: md)
// loading        = boolean (default: false)
// disabled       = boolean (default: false)
// as             = React.ElementType (default: "button")
// leftIcon       = ReactNode
// rightIcon      = ReactNode

// Examples:
<Button variant="primary">Get Started</Button>
<Button variant="accent" size="lg">Launch App</Button>
<Button variant="danger" loading>Deleting...</Button>
<Button as="a" href="/docs" variant="secondary">Read Docs</Button>
<Button variant="ghost" size="icon" aria-label="Close">
  <X size={16} />
</Button>
```

**Common mistakes:**
- ❌ `variant="blue"` → Use variant="accent" for brand amber, or variant="teal" for teal
- ❌ `size="xl"` → Use size="lg"
- ❌ `color="..."` → Use variant prop instead
- ❌ `icon={...}` → Use leftIcon={...} or rightIcon={...}
- ❌ `size="icon" without aria-label` → Add aria-label describing the action
- ❌ `padding / margin / marginTop (any spacing prop) on a useVyre component` → Space BETWEEN components with <Stack gap> / <Grid gap>; space AROUND a block with <Box padding/margin> wrapping it

---

### Calendar

Inline date-grid widget (always visible, no input). mode: single | range | multiple, optional time picker. For an input + popover use DatePicker; for start/end ranges with presets use DateRangePicker.

```tsx
import { Calendar } from "@usevyre/react"

// Props:
// value          = Date | null
// onChange       = function
// disabled       = boolean (default: false)
// defaultMonth   = Date

// Examples:
const [date, setDate] = useState(null);
<Calendar value={date} onChange={setDate} />
```

**Common mistakes:**
- ❌ `Calendar for an input field that opens a popover` → Use <DatePicker /> (single date) or <DateRangePicker /> (range)
- ❌ `value as tuple for mode="single"` → Pass value matching mode; use mode="range" for [start,end]

---

### DatePicker

Input trigger that opens a Calendar in a popover. Same modes as Calendar (single | range | multiple) plus a placeholder. Use this for a compact date field; use Calendar for an always-visible grid, or DateRangePicker for start/end ranges with presets.

```tsx
import { DatePicker } from "@usevyre/react"

// Props:
// value          = Date | [Date, Date] | Date[] | null
// onChange       = function
// mode           = "single" | "range" | "multiple" (default: single)
// placeholder    = string (default: Pick a date)
// showTime       = boolean (default: false)
// minDate        = Date
// maxDate        = Date
// disabled       = function
// weekStartsOn   = "0" | "1" (default: 1)
// inputClassName = string

// Examples:
const [date, setDate] = useState(null);
<DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
<DatePicker value={date} onChange={setDate} showTime />
```

**Common mistakes:**
- ❌ `DatePicker mode="range" for { from, to } object` → Use <DateRangePicker /> for the { from, to } object API + presets + dual month
- ❌ `DatePicker without value/onChange` → Provide value and onChange (e.g. from useState)

---

### Card

Content container with optional header, body, and footer sections.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from "@usevyre/react"

// Props:
// variant        = "default" | "elevated" | "outlined" | "ghost" | "accent" (default: default)
// hoverable      = boolean (default: false)
// clickable      = boolean (default: false)

// Examples:
<Card variant="elevated">
  <CardHeader><Badge variant="teal">New</Badge></CardHeader>
  <CardBody>
    <h3>Card Title</h3>
    <p>Description text.</p>
  </CardBody>
  <CardFooter>
    <Button variant="ghost" size="sm">Learn more</Button>
  </CardFooter>
</Card>
```

**Common mistakes:**
- ❌ `variant="primary"` → Use variant="elevated" | "outlined" | "ghost" | "accent"
- ❌ `padding / margin / marginTop (any spacing prop) on a useVyre component` → Space BETWEEN components with <Stack gap> / <Grid gap>; space AROUND a block with <Box padding/margin> wrapping it

---

### Checkbox

Binary toggle for boolean form values.

```tsx
import { Checkbox } from "@usevyre/react"

// Props:
// size           = "sm" | "md" (default: md)
// checked        = boolean
// onCheckedChange = function
// disabled       = boolean (default: false)
// indeterminate  = boolean (default: false)

// Examples:
<label style={{ display: 'flex', alignItems: 'center', gap: 'var(--vyre-spacing-2)' }}>
  <Checkbox checked={agreed} onCheckedChange={setAgreed} />
  I agree to the terms
</label>
```

**Common mistakes:**
- ❌ `size="lg"` → Use size="md"

---

### RadioGroup

Controlled single-choice group. RadioGroup owns the selected value; render it data-driven via the options array OR with composable <Radio> children for custom content. role=radiogroup with proper labelling. For multi-select use Checkbox; for a compact dropdown use Select.

```tsx
import { RadioGroup, Radio } from "@usevyre/react"

// Props:
// value          = string
// defaultValue   = string
// onChange       = function
// name           = string
// disabled       = boolean (default: false)
// size           = "sm" | "md" (default: md)
// orientation    = "vertical" | "horizontal" (default: vertical)
// options        = { value: string; label?: string; description?: string; disabled?: boolean }[]

// Examples:
<RadioGroup
  value={plan}
  onChange={setPlan}
  options={[
    { value: "free", label: "Free", description: "For hobby projects" },
    { value: "pro",  label: "Pro",  description: "For teams" },
  ]}
/>
<RadioGroup value={plan} onChange={setPlan} orientation="horizontal">
  <Radio value="free" label="Free" />
  <Radio value="pro"  label="Pro" />
</RadioGroup>
```

**Common mistakes:**
- ❌ `<Radio> used outside a <RadioGroup>` → Always wrap <Radio> in <RadioGroup>
- ❌ `RadioGroup without value/onChange (React) or v-model (Vue)` → Bind value + onChange (React) or v-model (Vue); or defaultValue for uncontrolled in React
- ❌ `Using Checkbox for mutually-exclusive choices` → Use RadioGroup + Radio (or options) for one-of-many

---

### RichTextEditor

Controlled WYSIWYG editor. value is an HTML string; you own it in state and set it in onChange (React) / v-model (Vue). Native contentEditable + execCommand — zero dependencies. Toolbar: bold, italic, underline, strike, h1-h3, ordered/unordered lists, quote, code block, link, clear formatting.

```tsx
import { RichTextEditor } from "@usevyre/react"

// Props:
// value          = string
// onChange       = function
// placeholder    = string (default: Write something…)
// disabled       = boolean (default: false)
// readOnly       = boolean (default: false)
// toolbar        = RichTextTool[]
// minHeight      = string (default: 10rem)

// Examples:
const [html, setHtml] = useState("<p>Hello <strong>world</strong></p>");
<RichTextEditor value={html} onChange={setHtml} placeholder="Write…" />
<RichTextEditor
  value={html}
  onChange={setHtml}
  toolbar={["bold", "italic", "link"]}
/>
```

**Common mistakes:**
- ❌ `RichTextEditor without value/onChange (React) or v-model (Vue)` → Keep the HTML string in state and update it in onChange / v-model
- ❌ `Rendering value as text or with dangerouslySetInnerHTML elsewhere without sanitising` → Sanitise (e.g. DOMPurify) before re-rendering untrusted RTE output
- ❌ `toolbar="bold" (string)` → Pass an array, e.g. toolbar={["bold","italic","link"]}

---

### Command

Command palette / search dialog. Use for search-first navigation or quick actions.

```tsx
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandDialog } from "@usevyre/react"

// Examples:
<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => handleSelect('dashboard')}>Dashboard</CommandItem>
      <CommandItem onSelect={() => handleSelect('settings')}>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Common mistakes:**
- ❌ `Using Input type="search" for search UI` → Use Command + CommandInput + CommandList + CommandItem

---

### DropdownMenu

Contextual menu triggered by a button. Supports items, separators, checkbox items, radio groups, and sub-menus.

```tsx
import { DropdownMenu, DropdownItem, DropdownSeparator, DropdownCheckboxItem, DropdownRadioGroup, DropdownRadioItem, DropdownSub } from "@usevyre/react"

// Props:
// trigger        = ReactElement

// Examples:
<DropdownMenu trigger={<Button variant="secondary">Options</Button>}>
  <DropdownItem onSelect={() => handleEdit()}>Edit</DropdownItem>
  <DropdownItem onSelect={() => handleDuplicate()}>Duplicate</DropdownItem>
  <DropdownSeparator />
  <DropdownItem variant="danger" onSelect={() => handleDelete()}>Delete</DropdownItem>
</DropdownMenu>
```

**Common mistakes:**
- ❌ `DropdownItem variant="primary"` → Use variant="danger" for destructive items only

---

### Field

Form field wrapper. Two ways to use it (both supported): (1) props-based — pass label/hint/state/required for the common case; (2) composable — use the parts FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet for richer layouts (multiple controls, custom error placement). The props-based API is unchanged and still works.

```tsx
import { Field, Input, Textarea } from "@usevyre/react"

// Props:
// label          = string
// hint           = string
// state          = "idle" | "error" | "success" | "warning" (default: idle)
// required       = boolean (default: false)

// Examples:
<Field label="Email" state="error" hint="Invalid email format">
  <Input type="email" placeholder="you@example.com" />
</Field>
<Field label="Search">
  <Input leftElement={<SearchIcon />} placeholder="Search..." />
</Field>
<Field>
  <FieldLabel required htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
  <FieldDescription>We\u2019ll never share it.</FieldDescription>
  <FieldError>{errors.email}</FieldError>
</Field>

// Two controls side by side
<FieldGroup orientation="horizontal">
  <Field label="First name"><Input /></Field>
  <Field label="Last name"><Input /></Field>
</FieldGroup>
```

**Common mistakes:**
- ❌ `Applying state prop directly to Input` → Wrap Input in <Field state="error"> to apply validation styling
- ❌ `Mixing props label/hint AND FieldLabel/FieldError for the same field` → Pick one: either props-based (label/hint/state) OR composable parts

---

### Input

Text input field. Wrap in Field for labels and validation. Use leftElement/rightElement for icons.

```tsx
import { Input } from "@usevyre/react"

// Props:
// modelValue     = string | number
// size           = "sm" | "md" | "lg" (default: md)
// leftElement    = ReactNode
// rightElement   = ReactNode

// Examples:
<Input type="password" rightElement={<EyeIcon />} placeholder="Password" />
```

**Common mistakes:**
- ❌ `size="icon"` → Use size="sm" | "md" | "lg"
- ❌ `type="search" for search UI` → Import Command from @usevyre/react for search palettes
- ❌ `Vue: binding Input/Textarea value without v-model` → Use v-model on <Input>/<Textarea> in Vue; in React use value + onChange
- ❌ `padding / margin / marginTop (any spacing prop) on a useVyre component` → Space BETWEEN components with <Stack gap> / <Grid gap>; space AROUND a block with <Box padding/margin> wrapping it

---

### Label

Accessible form label. Associate with input via htmlFor.

```tsx
import { Label } from "@usevyre/react"

// Props:
// htmlFor        = string
// required       = boolean (default: false)

// Examples:
<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" />
```

---

### Modal

Dialog overlay for confirmations, forms, or focused content.

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@usevyre/react"

// Props:
// open           = boolean
// onClose        = function
// size           = "sm" | "md" | "lg" | "full" (default: md)

// Examples:
<Modal open={isOpen} onClose={() => setIsOpen(false)} size="sm">
  <ModalHeader>Confirm Delete</ModalHeader>
  <ModalBody>Are you sure you want to delete this item?</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </ModalFooter>
</Modal>
```

**Common mistakes:**
- ❌ `size="xl"` → Use size="lg" or size="full"

---

### Pagination

Page navigation for paginated lists or tables.

```tsx
import { Pagination } from "@usevyre/react"

// Props:
// page           = number
// totalPages     = number
// onPageChange   = function

// Examples:
<Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
```

---

### Popover

Floating content panel anchored to a trigger element. For simple labels use Tooltip instead.

```tsx
import { Popover } from "@usevyre/react"

// Props:
// trigger        = ReactElement
// placement      = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end" (default: bottom)
// open           = boolean
// onOpenChange   = function
// closeOnOutside = boolean (default: true)

// Examples:
<Popover trigger={<Button variant="secondary">More info</Button>} placement="bottom-start">
  <div style={{ padding: 'var(--vyre-spacing-4)' }}>
    <p>Detailed information here.</p>
  </div>
</Popover>
```

**Common mistakes:**
- ❌ `placement="top-center"` → Use placement="top" for centered placement

---

### Progress

Visual progress indicator for tasks, uploads, or completion status.

```tsx
import { Progress } from "@usevyre/react"

// Props:
// value          = number
// size           = "sm" | "md" | "lg" (default: md)
// variant        = "default" | "accent" | "teal" | "success" | "danger" (default: default)

// Examples:
<Progress value={uploadPercent} variant="accent" size="sm" />
```

**Common mistakes:**
- ❌ `value > 100` → Normalize your value to 0–100 range before passing

---

### Select

Dropdown for selecting one option from a list.

```tsx
import { Select } from "@usevyre/react"

// Props:
// options        = SelectOption[]
// value          = string
// onChange       = function
// size           = "sm" | "md" | "lg" (default: md)
// placeholder    = string
// disabled       = boolean (default: false)

// Examples:
<Select
  options={[{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }]}
  value={framework}
  onChange={setFramework}
  placeholder="Choose framework"
/>
```

**Common mistakes:**
- ❌ `Passing strings directly as children` → Pass options={[{ value: 'a', label: 'Option A' }]}

---

### Separator

Horizontal or vertical divider line.

```tsx
import { Separator } from "@usevyre/react"

// Props:
// orientation    = "horizontal" | "vertical" (default: horizontal)

// Examples:
<Separator />
<Separator orientation="vertical" />
```

---

### Sheet

Side panel (drawer) that slides in from the edge. For forms, detail views, or settings.

```tsx
import { Sheet, SheetHeader, SheetBody, SheetFooter } from "@usevyre/react"

// Props:
// open           = boolean
// onClose        = function
// size           = "sm" | "md" | "lg" | "full" (default: md)
// side           = "left" | "right" (default: right)

// Examples:
<Sheet open={isOpen} onClose={() => setIsOpen(false)} side="right">
  <SheetHeader>Settings</SheetHeader>
  <SheetBody>Settings content here.</SheetBody>
  <SheetFooter>
    <Button variant="accent">Save</Button>
  </SheetFooter>
</Sheet>
```

---

### Sidebar

App navigation sidebar. Use AppLayout as the root layout wrapper.

```tsx
import { AppLayout, Sidebar, SidebarHeader, SidebarContent, SidebarSection, SidebarItem, SidebarFooter } from "@usevyre/react"

// Props:
// variant        = "default" | "floating" (default: default)
// SidebarTrigger.icon = ReactNode
// SidebarTrigger.collapsedIcon = ReactNode

// Examples:
<AppLayout>
  <Sidebar>
    <SidebarHeader>Logo</SidebarHeader>
    <SidebarContent>
      <SidebarSection heading="Main">
        <SidebarItem href="/" active>Dashboard</SidebarItem>
        <SidebarItem href="/settings">Settings</SidebarItem>
      </SidebarSection>
    </SidebarContent>
    <SidebarFooter><Avatar fallback="JD" size="sm" /></SidebarFooter>
  </Sidebar>
  <main>Page content</main>
</AppLayout>
<SidebarTrigger icon={<PanelLeftClose />} collapsedIcon={<PanelLeftOpen />} />

// Vue:
// <SidebarTrigger>
//   <template #icon><PanelLeftClose /></template>
//   <template #collapsed-icon><PanelLeftOpen /></template>
// </SidebarTrigger>
```

**Common mistakes:**
- ❌ `Vue: passing icon/collapsedIcon as props on SidebarTrigger` → Use <template #icon> and <template #collapsed-icon>; React uses icon / collapsedIcon props

---

### Skeleton

Loading placeholder that mimics the shape of content while data loads.

```tsx
import { Skeleton } from "@usevyre/react"

// Props:
// variant        = "rect" | "circle" | "text" (default: rect)
// width          = string | number
// height         = string | number

// Examples:
<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="text" width="100%" />
<Skeleton variant="text" width="60%" />
```

---

### Slider

Range input for selecting a numeric value within a range.

```tsx
import { Slider } from "@usevyre/react"

// Props:
// value          = number
// onValueChange  = function
// min            = number (default: 0)
// max            = number (default: 100)
// step           = number (default: 1)
// size           = "sm" | "md" (default: md)
// disabled       = boolean (default: false)

// Examples:
<Slider value={volume} onValueChange={setVolume} min={0} max={100} step={5} />
```

---

### Switch

Toggle switch for boolean on/off settings.

```tsx
import { Switch } from "@usevyre/react"

// Props:
// checked        = boolean
// onCheckedChange = function
// size           = "sm" | "md" (default: md)
// disabled       = boolean (default: false)

// Examples:
<label style={{ display: 'flex', alignItems: 'center', gap: 'var(--vyre-spacing-2)' }}>
  <Switch checked={notifications} onCheckedChange={setNotifications} />
  Enable notifications
</label>
```

---

### Table

Data table with optional sorting. Compose with TableHeader, TableRow, TableCell.

```tsx
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@usevyre/react"

// Examples:
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
      <TableHeader>Status</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Alice</TableCell>
      <TableCell><Badge variant="success">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Tabs

Tabbed navigation for switching between content panels.

```tsx
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@usevyre/react"

// Props:
// defaultValue   = string
// value          = string
// onChange       = function

// Examples:
<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="overview">Overview content</TabPanel>
    <TabPanel value="settings">Settings content</TabPanel>
  </TabPanels>
</Tabs>
```

---

### Toast

Transient notification. Use the useToast hook to trigger toasts imperatively. React: wrap app in <ToastProvider>. Vue: place <ToastViewport /> once in app root.

```tsx
import { useToast, ToastProvider } from "@usevyre/react" // Vue: import { useToast, ToastViewport } from "@usevyre/vue"

// Props:
// variant        = "default" | "success" | "warning" | "danger" (default: default)
// title          = string
// description    = string
// duration       = number (default: 4000)

// Examples:
const { toast } = useToast();

<Button onClick={() => toast({ title: 'Saved!', variant: 'success', duration: 3000 })}>
  Save
</Button>
<ToastProvider>
  <App />
</ToastProvider>
```

**Common mistakes:**
- ❌ `Rendering <Toast> directly in JSX` → Use: const { toast } = useToast(); then toast({ title, variant })
- ❌ `variant="error"` → Use variant="danger"
- ❌ `variant="info"` → Use variant="default"

---

### Tooltip

Short label that appears on hover/focus. For rich content use Popover instead.

```tsx
import { Tooltip } from "@usevyre/react"

// Props:
// content        = string | ReactNode
// placement      = "top" | "bottom" | "left" | "right" (default: top)
// delay          = number (default: 300)

// Examples:
<Tooltip content="Close dialog" placement="bottom">
  <Button variant="ghost" size="icon" aria-label="Close">
    <X size={16} />
  </Button>
</Tooltip>
```

**Common mistakes:**
- ❌ `Using Tooltip for rich content (forms, buttons, etc.)` → Use Popover for rich interactive content

---

### Typography

Text rendering components with semantic scale. Includes Text, Heading, Lead, Code, Blockquote.

```tsx
import { Text, Heading, Lead, Code, Blockquote } from "@usevyre/react"

// Examples:
<Heading size="2xl" as="h1">Dashboard</Heading>
<Lead>Welcome back. Here's what's happening today.</Lead>
<Text size="sm" style={{ color: 'var(--vyre-color-semantic-text-muted)' }}>Last updated 5 minutes ago.</Text>
```

**Common mistakes:**
- ❌ `Using raw <h1>, <p> tags instead of Typography components` → Use <Heading>, <Text>, <Lead> from @usevyre/react

---

### ButtonGroup

Groups multiple Button components into one visual unit (toolbar, segmented control). Pure layout — no internal state.

```tsx
import { ButtonGroup, Button } from "@usevyre/react"

// Props:
// orientation    = "horizontal" | "vertical" (default: horizontal)
// attached       = boolean (default: false)
// size           = "sm" | "md" | "lg" | "icon"

// Examples:
<ButtonGroup attached>
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>
<ButtonGroup orientation="vertical" attached>
  <Button variant="secondary">Top</Button>
  <Button variant="secondary">Bottom</Button>
</ButtonGroup>
```

**Common mistakes:**
- ❌ `ButtonGroup variant="..."` → Set variant on each <Button> inside the group
- ❌ `ButtonGroup without Button children` → Place <Button> elements as direct children

---

### TagsInput

Multi-tag input. Type and press Enter or comma to add a tag, click x to remove, Backspace on empty input removes the last tag. Controlled.

```tsx
import { TagsInput } from "@usevyre/react"

// Props:
// value          = string[]
// onChange       = (tags: string[]) => void
// placeholder    = string
// disabled       = boolean (default: false)
// max            = number
// size           = "sm" | "md" | "lg" (default: md)

// Examples:
const [tags, setTags] = useState<string[]>([]);
<TagsInput value={tags} onChange={setTags} placeholder="Add a tag…" />
<TagsInput value={tags} onChange={setTags} max={5} />
```

**Common mistakes:**
- ❌ `TagsInput value={string}` → Pass an array: value={['react','vue']}
- ❌ `TagsInput without onChange` → Provide value and onChange (React) or v-model (Vue)

---

### Combobox

Searchable single-select dropdown with typeahead filtering and keyboard navigation. Use when the list is long enough to need search. Differs from Select (no search) and Command (palette).

```tsx
import { Combobox } from "@usevyre/react"

// Props:
// options        = { value: string; label: string; disabled?: boolean }[]
// value          = string | null
// onChange       = (value: string | null) => void
// placeholder    = string (default: "Search…")
// disabled       = boolean (default: false)
// size           = "sm" | "md" | "lg" (default: md)
// emptyText      = string (default: "No results")

// Examples:
const [lang, setLang] = useState<string | null>(null);
<Combobox
  options={[{ value: "ts", label: "TypeScript" }, { value: "go", label: "Go" }]}
  value={lang}
  onChange={setLang}
  placeholder="Search language…"
/>
```

**Common mistakes:**
- ❌ `Combobox value=""` → Use value={null} for no selection
- ❌ `Combobox options={string[]}` → Use [{ value: 'ts', label: 'TypeScript' }]
- ❌ `Using Combobox for command palette` → Use Command for command palettes

---

### DataGrid

Table with built-in column sorting, loading skeletons, and empty state. Filtering and pagination are out of scope — compose with the Pagination component.

```tsx
import { DataGrid } from "@usevyre/react"

// Props:
// columns        = { key: string; label: string; sortable?: boolean; width?: string }[]
// rows           = Record<string, unknown>[]
// sortKey        = string
// sortDir        = "asc" | "desc"
// onSort         = (key: string, dir: 'asc' | 'desc') => void
// loading        = boolean (default: false)
// emptyText      = string (default: "No data")
// stickyHeader   = boolean (default: false)

// Examples:
const cols = [{ key: "name", label: "Name", sortable: true }];
<DataGrid
  columns={cols}
  rows={people}
  sortKey={sortKey}
  sortDir={sortDir}
  onSort={(k, d) => { setSortKey(k); setSortDir(d); }}
/>
<DataGrid columns={cols} rows={[]} loading />
```

**Common mistakes:**
- ❌ `DataGrid expecting built-in pagination` → Slice rows yourself and use the Pagination component
- ❌ `DataGrid expecting built-in filtering` → Filter the rows array before passing it in
- ❌ `sortable without onSort` → Handle onSort and sort the rows array in your state

---

### Tag

Standalone display tag/chip for categories, labels, or filter chips. NOT an input — for tag input use TagsInput. Group multiple with TagGroup.

```tsx
import { Tag } from "@usevyre/react"

// Props:
// variant        = "default" | "accent" | "danger" (default: default)
// size           = "sm" | "md" | "lg" (default: md)
// onRemove       = () => void
// onClick        = () => void
// disabled       = boolean (default: false)

// Examples:
<TagGroup>
  <Tag>Design</Tag>
  <Tag variant="accent">Featured</Tag>
  <Tag>Engineering</Tag>
</TagGroup>
<Tag onRemove={() => removeFilter("react")}>react</Tag>
<Tag onClick={() => toggleFilter("vue")}>vue</Tag>
```

**Common mistakes:**
- ❌ `Tag variant="success"` → Use Badge for success/warning/teal status colors; Tag is for categories/filters
- ❌ `Using Tag for tag input` → Use TagsInput for adding/removing tags via keyboard
- ❌ `Tag size="xl"` → Use size="lg"

---

### TagGroup

Read-only container that lays out multiple Tag elements with automatic wrapping and consistent spacing. For tag input use TagsInput.

```tsx
import { TagGroup, Tag } from "@usevyre/react"

// Props:
// gap            = "sm" | "md" | "lg" (default: md)
// wrap           = boolean (default: true)

// Examples:
<TagGroup gap="sm">
  <Tag>React</Tag>
  <Tag>Vue</Tag>
  <Tag variant="accent">TypeScript</Tag>
</TagGroup>
```

**Common mistakes:**
- ❌ `TagGroup without Tag children` → Place <Tag> elements as direct children
- ❌ `Using TagGroup for tag input` → Use TagsInput for an editable tag field

---

### Item

Layout primitive for list rows, settings rows, and notification rows. Denser than Card — use Item (not Card) for repeated list rows.

```tsx
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup } from "@usevyre/react"

// Props:
// variant        = "default" | "outlined" | "muted" | "plain" (default: default)
// size           = "sm" | "md" | "lg" (default: md)
// clickable      = boolean (default: false)

// Examples:
<Item>
  <ItemMedia><BellIcon /></ItemMedia>
  <ItemContent>
    <ItemTitle>Notifications</ItemTitle>
    <ItemDescription>Receive an email when someone mentions you.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Switch defaultChecked />
  </ItemActions>
</Item>
<ItemGroup separated>
  <Item clickable>
    <ItemContent><ItemTitle>Profile</ItemTitle></ItemContent>
  </Item>
  <Item clickable>
    <ItemContent><ItemTitle>Billing</ItemTitle></ItemContent>
  </Item>
</ItemGroup>
```

**Common mistakes:**
- ❌ `Card used for repeated list rows` → Use <Item> (optionally inside <ItemGroup separated>) for list/settings rows
- ❌ `Item variant="primary"` → Use variant="default" | "outlined" | "muted"
- ❌ `raw text directly inside Item` → Wrap text in <ItemContent><ItemTitle>…</ItemTitle></ItemContent>

---

### Kanban

Drag-and-drop board: cards move between columns (or reorder within a column). CONTROLLED & data-driven like DataGrid. While dragging, a placeholder shows the exact drop position. Each card is wrapped in a Card (variant="outlined"); renderCard (React) / #card slot (Vue) can render ANY content incl. complex components (Avatar/Badge/Progress). Columns and cards accept an optional semantic color tint. Native HTML5 DnD, zero deps.

```tsx
import { Kanban } from "@usevyre/react"

// Props:
// value          = KanbanColumn[]
// onChange       = function
// renderCard     = function
// onCardClick    = function

// Examples:
const [columns, setColumns] = useState([
  { id: "todo",  title: "To Do",       cards: [{ id: "1", title: "Spec API" }] },
  { id: "doing", title: "In Progress", cards: [] },
  { id: "done",  title: "Done",        cards: [{ id: "2", title: "Kickoff" }] },
]);
<Kanban value={columns} onChange={setColumns} />
<Kanban
  value={columns}
  onChange={setColumns}
  onCardClick={(card) => openDetail(card.id)}
  renderCard={(card) => (
    <><strong>{card.title}</strong><Badge>{card.id}</Badge></>
  )}
/>
const [cols, setCols] = useState([
  { id: "doing", title: "In Progress", color: "teal", cards: [
    { id: "t1", title: "OAuth", assignee: "AK", progress: 60, color: "warning" },
  ]},
]);
<Kanban
  value={cols}
  onChange={setCols}
  renderCard={(card) => (
    <><strong>{card.title}</strong><Progress value={card.progress} /></>
  )}
/>
```

**Common mistakes:**
- ❌ `Kanban without onChange (or ignoring it)` → Store columns in state and setColumns in onChange (v-model in Vue)
- ❌ `Duplicate card ids across columns` → Use globally-unique card ids across the entire board
- ❌ `Mutating value in place then calling onChange` → Pass the new array Kanban gives you straight to setState / v-model
- ❌ `color="blue" (or any non-semantic value)` → Use one of: "default" | "accent" | "teal" | "success" | "warning" | "danger"

---

### Conversation

Chat / inbox message thread. CONTROLLED & data-driven like Kanban — you own `value` (messages array) and append in your own send handler; Conversation holds no message state. Consecutive messages from the same author are grouped (avatar + name shown once), day separators are inserted on date change, and outgoing messages (authorId === currentUserId) align right.

```tsx
import { Conversation } from "@usevyre/react"

// Props:
// value          = ConversationMessage[]
// currentUserId  = string
// composer       = boolean (default: false)
// onSend         = function
// placeholder    = string (default: Write a message…)
// typing         = boolean | string (default: false)
// allowAttachments = boolean (default: false)
// accept         = string
// renderMessage  = function
// renderComposer = function

// Examples:
const [messages, setMessages] = useState([
  { id: "1", authorId: "sam", authorName: "Sam", text: "Hey!" },
  { id: "2", authorId: "me", text: "Hi \ud83d\udc4b", status: "read" },
]);
<Conversation
  value={messages}
  currentUserId="me"
  composer
  onSend={(t) => setMessages((m) => [...m, { id: crypto.randomUUID(), authorId: "me", text: t }])}
/>
<Conversation
  value={messages}
  currentUserId="me"
  typing="Sam is typing"
  renderMessage={(m) => <strong>{m.text}</strong>}
/>
const messages = [
  { id: "1", authorId: "sam", authorName: "Sam", text: "Moodboard \ud83d\udc47",
    attachments: [{ kind: "image", url: "/board.png", name: "board.png" }] },
  { id: "2", authorId: "me", text: "Specs:", status: "read",
    attachments: [{ kind: "file", url: "/spec.pdf", name: "spec.pdf", size: "2.4 MB" }] },
];
<Conversation value={messages} currentUserId="me" />
```

**Common mistakes:**
- ❌ `Conversation without currentUserId` → Always pass currentUserId matching one of the message authorId values
- ❌ `Expecting Conversation to store/append messages` → Append to your own state in onSend (or @send) and pass it back via value
- ❌ `composer without onSend (React) / @send (Vue)` → Provide onSend / @send to append the message to value
- ❌ `Treating onSend as (text) only when using allowAttachments` → Handle onSend(text, files) — map files to message attachments and append

---

### Stack

Full one-dimensional flex layout primitive. USE INSTEAD OF <div style={{display:'flex'}}>. Covers the whole CSS flexbox surface (direction incl. reverse, wrap, align/justify/alignContent/alignSelf, grow/shrink/basis, per-axis gap) with token-locked spacing. Renders a plain <div> (or `as`).

```tsx
import { Stack } from "@usevyre/react"

// Props:
// direction      = "row" | "column" | "row-reverse" | "column-reverse" (default: row)
// inline         = boolean (default: false)
// gap            = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" (default: md)
// rowGap         = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// columnGap      = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// align          = "start" | "center" | "end" | "stretch" | "baseline" (default: stretch)
// justify        = "start" | "center" | "end" | "between" | "around" | "evenly" (default: start)
// alignContent   = "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly"
// alignSelf      = "auto" | "start" | "center" | "end" | "stretch" | "baseline"
// wrap           = "nowrap" | "wrap" | "wrap-reverse" (default: nowrap)
// grow           = number
// shrink         = number
// basis          = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "auto" | "content" | "0"
// width          = "auto" | "full" | "fit" | "screen" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// height         = "auto" | "full" | "fit" | "screen" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// as             = string (default: div)

// Examples:
<Stack direction="row" gap="md" align="center" justify="between">
  <Avatar src={user.avatar} />
  <Text>{user.name}</Text>
  <Button>Edit</Button>
</Stack>
<Stack wrap="wrap" rowGap="lg" columnGap="md">
  {tags.map((t) => <Tag key={t}>{t}</Tag>)}
</Stack>
```

**Common mistakes:**
- ❌ `<div style={{ display: 'flex', gap: 12 }}>` → Use <Stack gap="md"> — gap is a token
- ❌ `gap={12} or gap="12px"` → Use gap="none|xs|sm|md|lg|xl|2xl"
- ❌ `direction="vertical" / "horizontal"` → Use direction="row" or "column" (also row-reverse / column-reverse)
- ❌ `style={{ width: "100%" }} / style={{ height: 320 }}` → Use the width / height prop: width="full", width="md", height="screen", etc.

---

### Grid

Two-dimensional CSS grid primitive. Explicit column/row counts (or auto-fit), auto-flow control, token gap. Pair with GridItem for cell spanning/placement. Renders a plain <div> (or `as`).

```tsx
import { Grid, GridItem } from "@usevyre/react"

// Props:
// columns        = number | "auto-fit" (default: 1)
// rows           = number | "auto"
// flow           = "row" | "column" | "dense" | "row-dense" | "column-dense"
// gap            = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" (default: md)
// rowGap         = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// columnGap      = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// align          = "start" | "center" | "end" | "stretch" (default: stretch)
// justify        = "start" | "center" | "end" | "stretch"
// width          = "auto" | "full" | "fit" | "screen" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// height         = "auto" | "full" | "fit" | "screen" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// as             = string (default: div)

// Examples:
<Grid columns={3} gap="lg">
  <GridItem colSpan={2}><Card>Wide</Card></GridItem>
  <Card>Two</Card>
  <Card>Three</Card>
</Grid>
<Grid columns="auto-fit" gap="md">
  {items.map((i) => <Card key={i.id}>{i.title}</Card>)}
</Grid>
```

**Common mistakes:**
- ❌ `<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr' }}>` → Use <Grid columns={3} gap="md">
- ❌ `columns="3" (string)` → Use columns={3} or columns="auto-fit"
- ❌ `Nested div with inline grid-column for spanning` → Wrap the cell in <GridItem colSpan={2}>
- ❌ `style={{ width: "100%" }} / style={{ height: 320 }}` → Use the width / height prop: width="full", width="md", height="screen", etc.

---

### GridItem

Child placement inside <Grid>. Sets column/row span and start lines. Renders a plain <div> (or `as`).

```tsx
import { GridItem } from "@usevyre/react"

// Props:
// colSpan        = number
// rowSpan        = number
// colStart       = number
// rowStart       = number
// as             = string (default: div)

// Examples:
<Grid columns={4} gap="md">
  <GridItem colSpan={2}>Featured</GridItem>
  <div>a</div>
  <div>b</div>
</Grid>
```

**Common mistakes:**
- ❌ `GridItem outside a Grid` → Place <GridItem> directly inside <Grid>

---

### Box

Spacing-only container plus a controlled escape hatch. Token padding/margin with shorthand, per-axis (X/Y) and per-side (Top/Right/Bottom/Left) overrides. The `style` prop is an explicit anti-pattern escape hatch. Renders a plain <div> (or `as`).

```tsx
import { Box } from "@usevyre/react"

// Props:
// padding        = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// paddingX       = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// paddingY       = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// paddingTop     = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// paddingRight   = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// paddingBottom  = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// paddingLeft    = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// margin         = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// marginX        = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// marginY        = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// marginTop      = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// marginRight    = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// marginBottom   = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// marginLeft     = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// width          = "auto" | "full" | "fit" | "screen" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// height         = "auto" | "full" | "fit" | "screen" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
// as             = string (default: div)
// style          = React.CSSProperties

// Examples:
<Box as="section" paddingX="lg" paddingY="md">
  <Heading>Settings</Heading>
</Box>
<Box marginTop="xl"><Separator /></Box>
```

**Common mistakes:**
- ❌ `<Box style={{ padding: 16 }}>` → Use <Box padding="md"> (or paddingX/paddingTop/...)
- ❌ `Using Box for flex/grid layout` → Use <Stack> or <Grid>
- ❌ `style={{ width: "100%" }} / style={{ height: 320 }}` → Use the width / height prop: width="full", width="md", height="screen", etc.

---

### Form

Controlled, data-driven form. Zero dependencies. Validation runs on submit and (after the first submit) on blur. Errors map into the wrapped Field automatically (state=error + hint=message). Compose with FormField, which wires name/value/onChange/onBlur into a single control child.

```tsx
import { Form, FormField } from "@usevyre/react"

// Props:
// values         = Record<string, any>
// defaultValues  = Record<string, any>
// onChange       = function
// onSubmit       = function
// onInvalid      = function

// Examples:
const [values, setValues] = useState({ email: "", password: "" });

<Form values={values} onChange={setValues} onSubmit={(v) => signIn(v)}>
  <FormField name="email" label="Email" rules={{ required: true, email: true }}>
    <Input type="email" />
  </FormField>
  <FormField name="password" label="Password" rules={{ required: true, minLength: 8 }}>
    <Input type="password" />
  </FormField>
  <Button type="submit" variant="primary">Sign in</Button>
</Form>
<FormField
  name="confirm"
  label="Confirm password"
  rules={{
    required: true,
    validate: (v, all) => v === all.password ? null : "Passwords do not match",
  }}
>
  <Input type="password" />
</FormField>
```

**Common mistakes:**
- ❌ `Manually tracking each field's error state with useState` → Wrap controls in <FormField name rules> and let Form manage errors
- ❌ `Adding a validation library (zod/yup) just for basic rules` → Use rules={{ required, minLength, pattern, email, validate }}
- ❌ `<FormField> with multiple control children` → Use one control per FormField (Input/Textarea/Select/etc.)
- ❌ `<FormField> outside a <Form>` → Always nest FormField inside <Form>

---

### FormField

A single labelled, validated field inside <Form>. Injects name/value/onChange/onBlur into its one control child and wraps it in <Field> (label + error state + hint).

```tsx
import { FormField } from "@usevyre/react"

// Props:
// name           = string
// label          = string
// hint           = string
// rules          = object

// Examples:
<FormField name="bio" label="Bio" hint="Max 200 characters" rules={{ maxLength: 200 }}>
  <Textarea />
</FormField>
```

**Common mistakes:**
- ❌ `Putting onChange/value manually on the control inside FormField` → Let FormField wire the control; only pass static props (type, placeholder)

---

### NumberInput

Controlled numeric input with −/+ stepper buttons. onChange emits a NUMBER (or null when empty) — NOT an event. Drops straight into <FormField> (Form handles the non-event value). Clamps to min/max on blur; keyboard ArrowUp/Down ±step, Shift+Arrow ±step×10.

```tsx
import { NumberInput } from "@usevyre/react"

// Props:
// value          = number | null
// defaultValue   = number | null (default: null)
// onChange       = function
// min            = number
// max            = number
// step           = number (default: 1)
// precision      = number
// size           = "sm" | "md" | "lg" (default: md)
// disabled       = boolean (default: false)
// readOnly       = boolean (default: false)

// Examples:
const [qty, setQty] = useState<number | null>(1);

<NumberInput value={qty} onChange={setQty} min={1} max={99} />
<FormField name="age" label="Age" rules={{ required: true, min: 18 }}>
  <NumberInput min={0} max={120} />
</FormField>
```

**Common mistakes:**
- ❌ `onChange={(e) => set(e.target.value)}` → onChange={(value) => set(value)} — value is number | null
- ❌ `Using <Input type="number"> for numeric fields` → Use <NumberInput value onChange min max step />
- ❌ `Parsing the value with Number() in form state` → Store the value directly; it is already number | null

---

### ToggleGroup

Segmented control. CONTROLLED — the group owns the value. onChange emits the VALUE (not an event). type=single → value:string|null; type=multiple → value:string[]. Provide options[] for simple lists or <ToggleItem value> children for custom content. Distinct from Switch (boolean), ButtonGroup (layout only), RadioGroup (form radios, single only).

```tsx
import { ToggleGroup, ToggleItem } from "@usevyre/react"

// Props:
// type           = "single" | "multiple" (default: single)
// value          = string | null | string[]
// onChange       = function
// options        = array
// size           = "sm" | "md" | "lg" (default: md)
// orientation    = "horizontal" | "vertical" (default: horizontal)
// disabled       = boolean (default: false)

// Examples:
const [view, setView] = useState<string | null>("grid");

<ToggleGroup
  value={view}
  onChange={setView}
  options={[
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
  ]}
/>
const [fmt, setFmt] = useState<string[]>(["bold"]);

<ToggleGroup type="multiple" value={fmt} onChange={setFmt}>
  <ToggleItem value="bold">B</ToggleItem>
  <ToggleItem value="italic">I</ToggleItem>
  <ToggleItem value="underline">U</ToggleItem>
</ToggleGroup>
```

**Common mistakes:**
- ❌ `onChange={(e) => set(e.target.value)}` → onChange={(value) => set(value)} — string|null (single) or string[] (multiple)
- ❌ `Using ToggleGroup for a single on/off setting` → Use <Switch> for on/off; ToggleGroup is for choosing among options
- ❌ `type="multiple" with a string value` → value={['a','b']} and onChange receives string[]
- ❌ `<ToggleItem> outside <ToggleGroup>` → Always nest ToggleItem inside ToggleGroup (or use options)

---

### ToggleItem

A single toggle button inside <ToggleGroup>. Reads selection state from the group via context.

```tsx
import { ToggleItem } from "@usevyre/react"

// Props:
// value          = string
// icon           = ReactNode
// disabled       = boolean (default: false)

// Examples:
<ToggleGroup value={v} onChange={setV}>
  <ToggleItem value="left">Left</ToggleItem>
  <ToggleItem value="center">Center</ToggleItem>
</ToggleGroup>
```

**Common mistakes:**
- ❌ `Tracking selected state on ToggleItem yourself` → Only set value; the group controls selected state

---

### Stepper

Multi-step flow indicator + controller (onboarding/checkout/wizard). CONTROLLED by a 0-based index. Compose StepperNav (with Step indicators) and StepPanel (content shown when its index == active). Step/StepPanel take an explicit 0-based `index`. Not Tabs — Stepper is an ORDERED linear flow with completed/current/upcoming states.

```tsx
import { Stepper, StepperNav, Step, StepPanel } from "@usevyre/react"

// Props:
// value          = number
// defaultValue   = number (default: 0)
// onChange       = function
// orientation    = "horizontal" | "vertical" (default: horizontal)
// clickable      = boolean (default: false)

// Examples:
const [step, setStep] = useState(0);

<Stepper value={step} onChange={setStep}>
  <StepperNav>
    <Step index={0} label="Account" />
    <Step index={1} label="Profile" />
    <Step index={2} label="Done" />
  </StepperNav>
  <StepPanel index={0}><AccountForm /></StepPanel>
  <StepPanel index={1}><ProfileForm /></StepPanel>
  <StepPanel index={2}><Summary /></StepPanel>
  <Stack direction="row" gap="sm" justify="between">
    <Button onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Back</Button>
    <Button variant="primary" onClick={() => setStep((s) => s + 1)}>Next</Button>
  </Stack>
</Stepper>
<Stepper orientation="vertical" defaultValue={1}>
  <StepperNav>
    <Step index={0} label="Cart" description="2 items" />
    <Step index={1} label="Shipping" description="Enter address" />
    <Step index={2} label="Payment" />
  </StepperNav>
</Stepper>
```

**Common mistakes:**
- ❌ `Using Tabs for a wizard / checkout flow` → Use <Stepper> with StepperNav + Step + StepPanel
- ❌ `onChange={(e) => set(e.target.value)}` → onChange={(index) => setStep(index)}
- ❌ `Manually toggling which panel is visible` → Give each StepPanel an index; Stepper shows the active one
- ❌ `<Step> or <StepPanel> outside <Stepper>` → Nest Step inside StepperNav, StepPanel inside Stepper

---

### StepperNav

Container for Step indicators inside <Stepper>. Lays them out per the Stepper's orientation.

```tsx
import { Stepper, StepperNav, Step, StepPanel } from "@usevyre/react"

```

---

### Step

One step indicator inside <StepperNav>. State (completed/current/upcoming) derives from the Stepper's active index automatically.

```tsx
import { Stepper, StepperNav, Step, StepPanel } from "@usevyre/react"

// Props:
// index          = number
// label          = ReactNode
// description    = ReactNode
// icon           = ReactNode

```

---

### StepPanel

Content for one step. Renders its children only when its index equals the Stepper's active step.

```tsx
import { Stepper, StepperNav, Step, StepPanel } from "@usevyre/react"

// Props:
// index          = number

```

---

### EmptyState

Presentational placeholder for empty lists, tables, and search results. No state. title/description/variant/size are props; the optional call-to-action goes in children (React) or the default slot (Vue). variant picks a preset icon (default=box, search=magnifier, error=warning); pass `icon` (or #icon slot) to override.

```tsx
import { EmptyState } from "@usevyre/react"

// Props:
// title          = string
// description    = string
// variant        = "default" | "search" | "error" (default: default)
// icon           = ReactNode
// size           = "sm" | "md" | "lg" (default: md)
// children       = ReactNode

// Examples:
<EmptyState
  variant="search"
  title="No results"
  description="Try a different search term."
>
  <Button variant="secondary" onClick={reset}>Clear filters</Button>
</EmptyState>
<EmptyState
  size="lg"
  title="No projects yet"
  description="Create your first project to get started."
>
  <Button variant="primary">New project</Button>
</EmptyState>
```

**Common mistakes:**
- ❌ `Building an empty placeholder with a bare <div> + centered text` → Use <EmptyState title description variant>
- ❌ `action / cta prop` → Put the Button as children of EmptyState
- ❌ `Using EmptyState for a loading state` → Use <Skeleton> while loading; EmptyState when the result set is empty

---

### Stat

Presentational dashboard KPI. No state. The arrow DIRECTION follows the sign of `delta` (the actual change: -0.4% → down arrow). The arrow/delta COLOR is set explicitly by `trend` (up=success, down=danger, neutral=muted) — so 'churn -0.4%, trend=up' shows a green DOWN arrow. Wrap several in StatGroup for an evenly-split row with dividers.

```tsx
import { Stat, StatGroup } from "@usevyre/react"

// Props:
// label          = string
// value          = string | number
// delta          = string | number
// trend          = "up" | "down" | "neutral" (default: neutral)
// deltaLabel     = string
// icon           = ReactNode
// size           = "sm" | "md" | "lg" (default: md)

// Examples:
<StatGroup>
  <Stat label="Revenue" value="$48.2k" delta="+12%" trend="up" deltaLabel="vs last month" />
  <Stat label="Churn" value="2.1%" delta="-0.4%" trend="up" deltaLabel="lower is better" />
  <Stat label="Orders" value="1,204" delta="0%" trend="neutral" />
</StatGroup>
<Stat label="Active users" value="12,840" delta="+3.2%" trend="up"
      icon={<UsersIcon />} size="lg" />
```

**Common mistakes:**
- ❌ `Assuming trend flips the arrow direction` → delta="-0.4%" always shows a down arrow; trend="up" just colors it green
- ❌ `Building a KPI card with Card + manual layout` → Use <Stat label value delta trend />
- ❌ `Laying out a KPI row with custom flex + dividers` → Wrap the Stats in <StatGroup>

---

### StatGroup

Evenly-split row of <Stat> with subtle dividers between items. Each Stat flexes to equal width.

```tsx
import { Stat, StatGroup } from "@usevyre/react"

// Examples:
<StatGroup>
  <Stat label="MRR" value="$9.6k" delta="+5%" trend="up" />
  <Stat label="Refunds" value="32" delta="+8" trend="down" />
</StatGroup>
```

**Common mistakes:**
- ❌ `Putting non-Stat children in StatGroup` → Only place <Stat> elements inside StatGroup

---

### Timeline

Vertical activity feed for audit logs and history. Presentational — a status dot per item plus a connector line. Pass `items` for plain logs, or TimelineItem children for rich per-item content. Timeline does NOT reorder; pass items in the order you want shown.

```tsx
import { Timeline, TimelineItem } from "@usevyre/react"

// Props:
// items          = array
// children       = ReactNode

// Examples:
<Timeline
  items={[
    { title: "Deployed v2.1", time: "2m ago", status: "success" },
    { title: "Build started", time: "5m ago", status: "info" },
    { title: "Push to main", time: "6m ago" },
  ]}
/>
<Timeline>
  <TimelineItem title="Invoice paid" time="Apr 2" status="success">
    <Text size="sm">$1,200 — <a href="#">view receipt</a></Text>
  </TimelineItem>
  <TimelineItem title="Invoice sent" time="Mar 28" status="info" />
</Timeline>
```

**Common mistakes:**
- ❌ `Building an activity log with a <ul> + manual dots/lines` → Use <Timeline items={[...]} /> or TimelineItem children
- ❌ `Using Stepper for a history/audit feed` → Use <Timeline> for logs/history; Stepper for wizards
- ❌ `Expecting Timeline to sort by time` → Sort the array yourself (newest- or oldest-first)

---

### TimelineItem

One entry in a <Timeline>. Renders a status-colored dot (or a custom icon), a title, an optional time, and optional rich content.

```tsx
import { Timeline, TimelineItem } from "@usevyre/react"

// Props:
// title          = ReactNode
// time           = ReactNode
// status         = "default" | "success" | "warning" | "danger" | "info" (default: default)
// icon           = ReactNode
// children       = ReactNode

// Examples:
<TimelineItem title="Comment added" time="1h ago" status="default">
  <Text size="sm">“Looks good to me 👍”</Text>
</TimelineItem>
```

**Common mistakes:**
- ❌ `<TimelineItem> outside <Timeline>` → Always nest TimelineItem inside Timeline

---

### Tree

Hierarchical tree view for file explorers and nested navigation. DATA-DRIVEN and CONTROLLED — pass a nested `data` array; the Tree renders recursively. Single selection. A node WITH children is a folder (click toggles expand); a leaf fires onSelect. Keyboard: ArrowUp/Down move, ArrowRight/Left expand/collapse, Enter/Space select.

```tsx
import { Tree } from "@usevyre/react"

// Props:
// data           = TreeNode[]
// expandedIds    = string[]
// defaultExpandedIds = string[] (default: [])
// onExpandedChange = function
// selectedId     = string | null
// defaultSelectedId = string | null (default: null)
// onSelect       = function

// Examples:
const [sel, setSel] = useState<string | null>("src/a.ts");

<Tree
  data={[
    { id: "src", label: "src", children: [
      { id: "src/a.ts", label: "a.ts" },
      { id: "src/b", label: "b", children: [
        { id: "src/b/c.ts", label: "c.ts" },
      ]},
    ]},
    { id: "README.md", label: "README.md" },
  ]}
  selectedId={sel}
  onSelect={setSel}
  defaultExpandedIds={["src"]}
/>
const [open, setOpen] = useState<string[]>(["root"]);

<Tree data={tree} expandedIds={open} onExpandedChange={setOpen} />
```

**Common mistakes:**
- ❌ `Rendering a nested <ul> tree by hand with manual expand state` → Pass a nested `data` array to <Tree> and control expandedIds/selectedId
- ❌ `onSelect={(e) => ...}` → onSelect={(id) => setSelected(id)}
- ❌ `Mutating the data array to expand/collapse` → Track expandedIds in state (or use defaultExpandedIds)
- ❌ `Using DropdownMenu submenus for a file tree` → Use <Tree> for file explorers / nested nav

---

### OTPInput

Segmented one-time-code input for verification / 2FA. CONTROLLED. onChange emits the STRING value (not an event), and onComplete fires once when every slot is filled. Paste-aware (pasting a full code fills all slots), auto-advance on input, backspace moves to the previous slot, arrow keys navigate. Drops straight into <FormField>.

```tsx
import { OTPInput } from "@usevyre/react"

// Props:
// value          = string
// defaultValue   = string (default: "")
// onChange       = function
// onComplete     = function
// length         = number (default: 6)
// type           = "numeric" | "alphanumeric" (default: numeric)
// mask           = boolean (default: false)
// size           = "sm" | "md" | "lg" (default: md)
// disabled       = boolean (default: false)
// autoFocus      = boolean (default: false)

// Examples:
const [code, setCode] = useState("");

<OTPInput
  value={code}
  onChange={setCode}
  onComplete={(c) => verify(c)}
  autoFocus
/>
<FormField name="otp" label="Verification code"
           rules={{ required: true, minLength: 6 }}>
  <OTPInput length={6} />
</FormField>
```

**Common mistakes:**
- ❌ `onChange={(e) => set(e.target.value)}` → onChange={(value) => setCode(value)}
- ❌ `Six separate <Input> boxes wired by hand` → Use <OTPInput length={6} value onChange />
- ❌ `Reading completion by comparing length yourself` → Use onComplete={(code) => verify(code)}
- ❌ `type="password" to hide digits` → Use mask (type stays numeric/alphanumeric)

---

### Carousel

Accessible content slider for galleries, onboarding, and testimonials. CONTROLLED by a 0-based slide index. Compose CarouselSlide children (slide order = index). Snap scrolling, clickable dot indicators, prev/next arrows, ArrowLeft/Right keyboard, optional loop and autoPlay (autoplay pauses on hover/focus). onChange emits the index (not an event).

```tsx
import { Carousel, CarouselSlide } from "@usevyre/react"

// Props:
// value          = number
// defaultValue   = number (default: 0)
// onChange       = function
// loop           = boolean (default: false)
// autoPlay       = boolean (default: false)
// interval       = number (default: 5000)
// showArrows     = boolean (default: true)
// showIndicators = boolean (default: true)

// Examples:
const [i, setI] = useState(0);

<Carousel value={i} onChange={setI} loop>
  <CarouselSlide><img src="/a.jpg" alt="A" /></CarouselSlide>
  <CarouselSlide><img src="/b.jpg" alt="B" /></CarouselSlide>
  <CarouselSlide><img src="/c.jpg" alt="C" /></CarouselSlide>
</Carousel>
<Carousel autoPlay interval={4000} showArrows={false}>
  <CarouselSlide><Welcome /></CarouselSlide>
  <CarouselSlide><Features /></CarouselSlide>
  <CarouselSlide><GetStarted /></CarouselSlide>
</Carousel>
```

**Common mistakes:**
- ❌ `onChange={(e) => set(e.target.value)}` → onChange={(index) => setIndex(index)}
- ❌ `Putting raw elements directly in Carousel` → Wrap each slide in <CarouselSlide>
- ❌ `Building a slider with manual scroll + dot state` → Use <Carousel> with CarouselSlide children
- ❌ `autoPlay without considering reduced motion / pausing` → Carousel already pauses on hover/focus; keep interval reasonable or omit autoPlay

---

### CarouselSlide

One slide inside <Carousel>. Holds arbitrary content (image, Card, testimonial). Slide order determines its index.

```tsx
import { Carousel, CarouselSlide } from "@usevyre/react"

// Examples:
<CarouselSlide>
  <Card><CardBody>“Best tool ever.” — Ada</CardBody></Card>
</CarouselSlide>
```

**Common mistakes:**
- ❌ `<CarouselSlide> outside <Carousel>` → Always nest CarouselSlide inside Carousel

---

### DateRangePicker

Start/end date range picker. Built on Calendar (mode=range) with a friendlier { from, to } object API, a two-month side-by-side view, and preset shortcuts. Use this for report/filter date ranges; use DatePicker for a single date.

```tsx
import { DateRangePicker } from "@usevyre/react"

// Props:
// value          = { from: Date | null; to: Date | null } | null
// onChange       = function
// placeholder    = string (default: Pick a date range)
// numberOfMonths = "1" | "2" (default: 2)
// presets        = boolean | DateRangePreset[] (default: false)
// minDate        = Date
// maxDate        = Date
// disabled       = function
// weekStartsOn   = "0" | "1" (default: 1)

// Examples:
const [range, setRange] = useState({ from: null, to: null });
<DateRangePicker value={range} onChange={setRange} presets />
<DateRangePicker value={range} onChange={setRange} numberOfMonths={1} />
```

**Common mistakes:**
- ❌ `value={[from, to]}` → Use value={{ from, to }} and read range.from / range.to
- ❌ `DateRangePicker for a single date` → Use <DatePicker /> for a single date
- ❌ `presets="true" (string)` → Use the bare prop: presets  (or presets={true})

---

## Hallucination Guard — Common AI Mistakes

The following prop values and patterns do NOT exist in useVyre.
If you generate these, you are hallucinating.

- ❌ `<Accordion Accordion without AccordionItem>` → Always compose: Accordion > AccordionItem > AccordionTrigger + AccordionContent
- ❌ `<Alert variant="error">` → Use variant="danger"
- ❌ `<Alert variant="primary">` → Use variant="info" | "success" | "warning" | "danger"
- ❌ `<AlertDialog AlertDialog without open/onOpenChange (React) or v-model (Vue)>` → Drive open from state; close in onOpenChange / via v-model
- ❌ `<AlertDialog Using Alert (inline banner) for a confirm/cancel decision>` → Use AlertDialog for blocking confirmation; Alert for passive messages
- ❌ `<AlertDialog variant="success" or "error">` → Use "danger" for destructive, "warning" to caution, "info" otherwise
- ❌ `<Avatar size="xs">` → Use size="sm"
- ❌ `<Avatar size="2xl">` → Use size="xl"
- ❌ `<Badge variant="primary">` → Use variant="accent" for brand color
- ❌ `<Badge variant="error">` → Use variant="danger"
- ❌ `<Badge variant="info">` → Use variant="teal" for info-like styling
- ❌ `<Breadcrumb Using plain <a> tags inside Breadcrumb>` → Use BreadcrumbItem > BreadcrumbLink for each crumb
- ❌ `<Button variant="blue">` → Use variant="accent" for brand amber, or variant="teal" for teal
- ❌ `<Button size="xl">` → Use size="lg"
- ❌ `<Button color="...">` → Use variant prop instead
- ❌ `<Button icon={...}>` → Use leftIcon={...} or rightIcon={...}
- ❌ `<Button size="icon" without aria-label>` → Add aria-label describing the action
- ❌ `<Button padding / margin / marginTop (any spacing prop) on a useVyre component>` → Space BETWEEN components with <Stack gap> / <Grid gap>; space AROUND a block with <Box padding/margin> wrapping it
- ❌ `<Calendar Calendar for an input field that opens a popover>` → Use <DatePicker /> (single date) or <DateRangePicker /> (range)
- ❌ `<Calendar value as tuple for mode="single">` → Pass value matching mode; use mode="range" for [start,end]
- ❌ `<DatePicker DatePicker mode="range" for { from, to } object>` → Use <DateRangePicker /> for the { from, to } object API + presets + dual month
- ❌ `<DatePicker DatePicker without value/onChange>` → Provide value and onChange (e.g. from useState)
- ❌ `<Card variant="primary">` → Use variant="elevated" | "outlined" | "ghost" | "accent"
- ❌ `<Card padding / margin / marginTop (any spacing prop) on a useVyre component>` → Space BETWEEN components with <Stack gap> / <Grid gap>; space AROUND a block with <Box padding/margin> wrapping it
- ❌ `<Checkbox size="lg">` → Use size="md"
- ❌ `<RadioGroup <Radio> used outside a <RadioGroup>>` → Always wrap <Radio> in <RadioGroup>
- ❌ `<RadioGroup RadioGroup without value/onChange (React) or v-model (Vue)>` → Bind value + onChange (React) or v-model (Vue); or defaultValue for uncontrolled in React
- ❌ `<RadioGroup Using Checkbox for mutually-exclusive choices>` → Use RadioGroup + Radio (or options) for one-of-many
- ❌ `<RichTextEditor RichTextEditor without value/onChange (React) or v-model (Vue)>` → Keep the HTML string in state and update it in onChange / v-model
- ❌ `<RichTextEditor Rendering value as text or with dangerouslySetInnerHTML elsewhere without sanitising>` → Sanitise (e.g. DOMPurify) before re-rendering untrusted RTE output
- ❌ `<RichTextEditor toolbar="bold" (string)>` → Pass an array, e.g. toolbar={["bold","italic","link"]}
- ❌ `<Command Using Input type="search" for search UI>` → Use Command + CommandInput + CommandList + CommandItem
- ❌ `<DropdownMenu DropdownItem variant="primary">` → Use variant="danger" for destructive items only
- ❌ `<Field Applying state prop directly to Input>` → Wrap Input in <Field state="error"> to apply validation styling
- ❌ `<Field Mixing props label/hint AND FieldLabel/FieldError for the same field>` → Pick one: either props-based (label/hint/state) OR composable parts
- ❌ `<Input size="icon">` → Use size="sm" | "md" | "lg"
- ❌ `<Input type="search" for search UI>` → Import Command from @usevyre/react for search palettes
- ❌ `<Input Vue: binding Input/Textarea value without v-model>` → Use v-model on <Input>/<Textarea> in Vue; in React use value + onChange
- ❌ `<Input padding / margin / marginTop (any spacing prop) on a useVyre component>` → Space BETWEEN components with <Stack gap> / <Grid gap>; space AROUND a block with <Box padding/margin> wrapping it
- ❌ `<Modal size="xl">` → Use size="lg" or size="full"
- ❌ `<Popover placement="top-center">` → Use placement="top" for centered placement
- ❌ `<Progress value > 100>` → Normalize your value to 0–100 range before passing
- ❌ `<Select Passing strings directly as children>` → Pass options={[{ value: 'a', label: 'Option A' }]}
- ❌ `<Sidebar Vue: passing icon/collapsedIcon as props on SidebarTrigger>` → Use <template #icon> and <template #collapsed-icon>; React uses icon / collapsedIcon props
- ❌ `<Toast Rendering <Toast> directly in JSX>` → Use: const { toast } = useToast(); then toast({ title, variant })
- ❌ `<Toast variant="error">` → Use variant="danger"
- ❌ `<Toast variant="info">` → Use variant="default"
- ❌ `<Tooltip Using Tooltip for rich content (forms, buttons, etc.)>` → Use Popover for rich interactive content
- ❌ `<Typography Using raw <h1>, <p> tags instead of Typography components>` → Use <Heading>, <Text>, <Lead> from @usevyre/react
- ❌ `<ButtonGroup ButtonGroup variant="...">` → Set variant on each <Button> inside the group
- ❌ `<ButtonGroup ButtonGroup without Button children>` → Place <Button> elements as direct children
- ❌ `<TagsInput TagsInput value={string}>` → Pass an array: value={['react','vue']}
- ❌ `<TagsInput TagsInput without onChange>` → Provide value and onChange (React) or v-model (Vue)
- ❌ `<Combobox Combobox value="">` → Use value={null} for no selection
- ❌ `<Combobox Combobox options={string[]}>` → Use [{ value: 'ts', label: 'TypeScript' }]
- ❌ `<Combobox Using Combobox for command palette>` → Use Command for command palettes
- ❌ `<DataGrid DataGrid expecting built-in pagination>` → Slice rows yourself and use the Pagination component
- ❌ `<DataGrid DataGrid expecting built-in filtering>` → Filter the rows array before passing it in
- ❌ `<DataGrid sortable without onSort>` → Handle onSort and sort the rows array in your state
- ❌ `<Tag Tag variant="success">` → Use Badge for success/warning/teal status colors; Tag is for categories/filters
- ❌ `<Tag Using Tag for tag input>` → Use TagsInput for adding/removing tags via keyboard
- ❌ `<Tag Tag size="xl">` → Use size="lg"
- ❌ `<TagGroup TagGroup without Tag children>` → Place <Tag> elements as direct children
- ❌ `<TagGroup Using TagGroup for tag input>` → Use TagsInput for an editable tag field
- ❌ `<Item Card used for repeated list rows>` → Use <Item> (optionally inside <ItemGroup separated>) for list/settings rows
- ❌ `<Item Item variant="primary">` → Use variant="default" | "outlined" | "muted"
- ❌ `<Item raw text directly inside Item>` → Wrap text in <ItemContent><ItemTitle>…</ItemTitle></ItemContent>
- ❌ `<Kanban Kanban without onChange (or ignoring it)>` → Store columns in state and setColumns in onChange (v-model in Vue)
- ❌ `<Kanban Duplicate card ids across columns>` → Use globally-unique card ids across the entire board
- ❌ `<Kanban Mutating value in place then calling onChange>` → Pass the new array Kanban gives you straight to setState / v-model
- ❌ `<Kanban color="blue" (or any non-semantic value)>` → Use one of: "default" | "accent" | "teal" | "success" | "warning" | "danger"
- ❌ `<Conversation Conversation without currentUserId>` → Always pass currentUserId matching one of the message authorId values
- ❌ `<Conversation Expecting Conversation to store/append messages>` → Append to your own state in onSend (or @send) and pass it back via value
- ❌ `<Conversation composer without onSend (React) / @send (Vue)>` → Provide onSend / @send to append the message to value
- ❌ `<Conversation Treating onSend as (text) only when using allowAttachments>` → Handle onSend(text, files) — map files to message attachments and append
- ❌ `<Stack <div style={{ display: 'flex', gap: 12 }}>>` → Use <Stack gap="md"> — gap is a token
- ❌ `<Stack gap={12} or gap="12px">` → Use gap="none|xs|sm|md|lg|xl|2xl"
- ❌ `<Stack direction="vertical" / "horizontal">` → Use direction="row" or "column" (also row-reverse / column-reverse)
- ❌ `<Stack style={{ width: "100%" }} / style={{ height: 320 }}>` → Use the width / height prop: width="full", width="md", height="screen", etc.
- ❌ `<Grid <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr' }}>>` → Use <Grid columns={3} gap="md">
- ❌ `<Grid columns="3" (string)>` → Use columns={3} or columns="auto-fit"
- ❌ `<Grid Nested div with inline grid-column for spanning>` → Wrap the cell in <GridItem colSpan={2}>
- ❌ `<Grid style={{ width: "100%" }} / style={{ height: 320 }}>` → Use the width / height prop: width="full", width="md", height="screen", etc.
- ❌ `<GridItem GridItem outside a Grid>` → Place <GridItem> directly inside <Grid>
- ❌ `<Box <Box style={{ padding: 16 }}>>` → Use <Box padding="md"> (or paddingX/paddingTop/...)
- ❌ `<Box Using Box for flex/grid layout>` → Use <Stack> or <Grid>
- ❌ `<Box style={{ width: "100%" }} / style={{ height: 320 }}>` → Use the width / height prop: width="full", width="md", height="screen", etc.
- ❌ `<Form Manually tracking each field's error state with useState>` → Wrap controls in <FormField name rules> and let Form manage errors
- ❌ `<Form Adding a validation library (zod/yup) just for basic rules>` → Use rules={{ required, minLength, pattern, email, validate }}
- ❌ `<Form <FormField> with multiple control children>` → Use one control per FormField (Input/Textarea/Select/etc.)
- ❌ `<Form <FormField> outside a <Form>>` → Always nest FormField inside <Form>
- ❌ `<FormField Putting onChange/value manually on the control inside FormField>` → Let FormField wire the control; only pass static props (type, placeholder)
- ❌ `<NumberInput onChange={(e) => set(e.target.value)}>` → onChange={(value) => set(value)} — value is number | null
- ❌ `<NumberInput Using <Input type="number"> for numeric fields>` → Use <NumberInput value onChange min max step />
- ❌ `<NumberInput Parsing the value with Number() in form state>` → Store the value directly; it is already number | null
- ❌ `<ToggleGroup onChange={(e) => set(e.target.value)}>` → onChange={(value) => set(value)} — string|null (single) or string[] (multiple)
- ❌ `<ToggleGroup Using ToggleGroup for a single on/off setting>` → Use <Switch> for on/off; ToggleGroup is for choosing among options
- ❌ `<ToggleGroup type="multiple" with a string value>` → value={['a','b']} and onChange receives string[]
- ❌ `<ToggleGroup <ToggleItem> outside <ToggleGroup>>` → Always nest ToggleItem inside ToggleGroup (or use options)
- ❌ `<ToggleItem Tracking selected state on ToggleItem yourself>` → Only set value; the group controls selected state
- ❌ `<Stepper Using Tabs for a wizard / checkout flow>` → Use <Stepper> with StepperNav + Step + StepPanel
- ❌ `<Stepper onChange={(e) => set(e.target.value)}>` → onChange={(index) => setStep(index)}
- ❌ `<Stepper Manually toggling which panel is visible>` → Give each StepPanel an index; Stepper shows the active one
- ❌ `<Stepper <Step> or <StepPanel> outside <Stepper>>` → Nest Step inside StepperNav, StepPanel inside Stepper
- ❌ `<EmptyState Building an empty placeholder with a bare <div> + centered text>` → Use <EmptyState title description variant>
- ❌ `<EmptyState action / cta prop>` → Put the Button as children of EmptyState
- ❌ `<EmptyState Using EmptyState for a loading state>` → Use <Skeleton> while loading; EmptyState when the result set is empty
- ❌ `<Stat Assuming trend flips the arrow direction>` → delta="-0.4%" always shows a down arrow; trend="up" just colors it green
- ❌ `<Stat Building a KPI card with Card + manual layout>` → Use <Stat label value delta trend />
- ❌ `<Stat Laying out a KPI row with custom flex + dividers>` → Wrap the Stats in <StatGroup>
- ❌ `<StatGroup Putting non-Stat children in StatGroup>` → Only place <Stat> elements inside StatGroup
- ❌ `<Timeline Building an activity log with a <ul> + manual dots/lines>` → Use <Timeline items={[...]} /> or TimelineItem children
- ❌ `<Timeline Using Stepper for a history/audit feed>` → Use <Timeline> for logs/history; Stepper for wizards
- ❌ `<Timeline Expecting Timeline to sort by time>` → Sort the array yourself (newest- or oldest-first)
- ❌ `<TimelineItem <TimelineItem> outside <Timeline>>` → Always nest TimelineItem inside Timeline
- ❌ `<Tree Rendering a nested <ul> tree by hand with manual expand state>` → Pass a nested `data` array to <Tree> and control expandedIds/selectedId
- ❌ `<Tree onSelect={(e) => ...}>` → onSelect={(id) => setSelected(id)}
- ❌ `<Tree Mutating the data array to expand/collapse>` → Track expandedIds in state (or use defaultExpandedIds)
- ❌ `<Tree Using DropdownMenu submenus for a file tree>` → Use <Tree> for file explorers / nested nav
- ❌ `<OTPInput onChange={(e) => set(e.target.value)}>` → onChange={(value) => setCode(value)}
- ❌ `<OTPInput Six separate <Input> boxes wired by hand>` → Use <OTPInput length={6} value onChange />
- ❌ `<OTPInput Reading completion by comparing length yourself>` → Use onComplete={(code) => verify(code)}
- ❌ `<OTPInput type="password" to hide digits>` → Use mask (type stays numeric/alphanumeric)
- ❌ `<Carousel onChange={(e) => set(e.target.value)}>` → onChange={(index) => setIndex(index)}
- ❌ `<Carousel Putting raw elements directly in Carousel>` → Wrap each slide in <CarouselSlide>
- ❌ `<Carousel Building a slider with manual scroll + dot state>` → Use <Carousel> with CarouselSlide children
- ❌ `<Carousel autoPlay without considering reduced motion / pausing>` → Carousel already pauses on hover/focus; keep interval reasonable or omit autoPlay
- ❌ `<CarouselSlide <CarouselSlide> outside <Carousel>>` → Always nest CarouselSlide inside Carousel
- ❌ `<DateRangePicker value={[from, to]}>` → Use value={{ from, to }} and read range.from / range.to
- ❌ `<DateRangePicker DateRangePicker for a single date>` → Use <DatePicker /> for a single date
- ❌ `<DateRangePicker presets="true" (string)>` → Use the bare prop: presets  (or presets={true})

---

## Styling Rules for AI Agents

1. ALWAYS use semantic tokens (`--vyre-color-semantic-*`), never primitive tokens
2. NEVER hardcode colors — every color decision has a semantic token
3. Text hierarchy: `text-primary` → `text-secondary` → `text-muted` → `text-disabled`
4. Interactive hover states: add `-hover` suffix to base token
5. Low-opacity backgrounds: use `-subtle` suffix tokens
6. Spacing: always use `--vyre-spacing-*` — never raw px values in component code
7. Transitions: use `--vyre-transition-duration-*` and `--vyre-transition-easing-*`

---

## Common Patterns

### Page layout with sidebar
```tsx
<div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
  <aside style={{ background: "var(--vyre-color-semantic-surface)", borderRight: "1px solid var(--vyre-color-semantic-border-subtle)" }}>
    {/* sidebar content */}
  </aside>
  <main style={{ padding: "var(--vyre-spacing-12)" }}>
    {/* main content */}
  </main>
</div>
```

### Form with validation
```tsx
<form>
  <Field label="Email" state={errors.email ? "error" : "idle"} hint={errors.email}>
    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
  </Field>
  <Button variant="accent" type="submit" loading={isSubmitting}>
    Submit
  </Button>
</form>
```

### Status badge with live indicator
```tsx
<Badge variant="success" dot>Live</Badge>
<Badge variant="danger" dot>Offline</Badge>
<Badge variant="warning">Beta</Badge>
```
