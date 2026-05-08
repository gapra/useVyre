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

---

### Calendar

Date picker calendar widget for selecting single dates or ranges.

```tsx
import { Calendar } from "@usevyre/react"

// Props:
// value          = Date | null
// onChange       = function
// disabled       = boolean (default: false)

// Examples:
const [date, setDate] = useState(null);
<Calendar value={date} onChange={setDate} />
```

**Common mistakes:**
- ❌ `Using Calendar for time selection` → Combine with a separate time Input if time selection is needed

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

---

### Checkbox

Binary toggle for boolean form values.

```tsx
import { Checkbox } from "@usevyre/react"

// Props:
// size           = "sm" | "md" (default: md)
// checked        = boolean
// onChange       = function
// disabled       = boolean (default: false)
// indeterminate  = boolean (default: false)

// Examples:
<label style={{ display: 'flex', alignItems: 'center', gap: 'var(--vyre-spacing-2)' }}>
  <Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} />
  I agree to the terms
</label>
```

**Common mistakes:**
- ❌ `size="lg"` → Use size="md"

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

Form field wrapper providing label, hint text, and validation state for Input or Textarea.

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
```

**Common mistakes:**
- ❌ `Applying state prop directly to Input` → Wrap Input in <Field state="error"> to apply validation styling

---

### Input

Text input field. Wrap in Field for labels and validation. Use leftElement/rightElement for icons.

```tsx
import { Input } from "@usevyre/react"

// Props:
// size           = "sm" | "md" | "lg" (default: md)
// leftElement    = ReactNode
// rightElement   = ReactNode

// Examples:
<Input type="password" rightElement={<EyeIcon />} placeholder="Password" />
```

**Common mistakes:**
- ❌ `size="icon"` → Use size="sm" | "md" | "lg"
- ❌ `type="search" for search UI` → Import Command from @usevyre/react for search palettes

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
// title          = string

// Examples:
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm Delete" size="sm">
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
// total          = number
// onChange       = function

// Examples:
<Pagination page={currentPage} total={totalPages} onChange={setCurrentPage} />
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
// title          = string

// Examples:
<Sheet open={isOpen} onClose={() => setIsOpen(false)} title="Settings" side="right">
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
```

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
// onChange       = function
// min            = number (default: 0)
// max            = number (default: 100)
// step           = number (default: 1)
// size           = "sm" | "md" (default: md)
// disabled       = boolean (default: false)

// Examples:
<Slider value={volume} onChange={setVolume} min={0} max={100} step={5} />
```

---

### Switch

Toggle switch for boolean on/off settings.

```tsx
import { Switch } from "@usevyre/react"

// Props:
// checked        = boolean
// onChange       = function
// size           = "sm" | "md" (default: md)
// disabled       = boolean (default: false)

// Examples:
<label style={{ display: 'flex', alignItems: 'center', gap: 'var(--vyre-spacing-2)' }}>
  <Switch checked={notifications} onChange={setNotifications} />
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
// defaultIndex   = number (default: 0)
// index          = number
// onChange       = function

// Examples:
<Tabs defaultIndex={0}>
  <TabList>
    <Tab>Overview</Tab>
    <Tab>Settings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Overview content</TabPanel>
    <TabPanel>Settings content</TabPanel>
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

## Hallucination Guard — Common AI Mistakes

The following prop values and patterns do NOT exist in useVyre.
If you generate these, you are hallucinating.

- ❌ `<Accordion Accordion without AccordionItem>` → Always compose: Accordion > AccordionItem > AccordionTrigger + AccordionContent
- ❌ `<Alert variant="error">` → Use variant="danger"
- ❌ `<Alert variant="primary">` → Use variant="info" | "success" | "warning" | "danger"
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
- ❌ `<Calendar Using Calendar for time selection>` → Combine with a separate time Input if time selection is needed
- ❌ `<Card variant="primary">` → Use variant="elevated" | "outlined" | "ghost" | "accent"
- ❌ `<Checkbox size="lg">` → Use size="md"
- ❌ `<Command Using Input type="search" for search UI>` → Use Command + CommandInput + CommandList + CommandItem
- ❌ `<DropdownMenu DropdownItem variant="primary">` → Use variant="danger" for destructive items only
- ❌ `<Field Applying state prop directly to Input>` → Wrap Input in <Field state="error"> to apply validation styling
- ❌ `<Input size="icon">` → Use size="sm" | "md" | "lg"
- ❌ `<Input type="search" for search UI>` → Import Command from @usevyre/react for search palettes
- ❌ `<Modal size="xl">` → Use size="lg" or size="full"
- ❌ `<Popover placement="top-center">` → Use placement="top" for centered placement
- ❌ `<Progress value > 100>` → Normalize your value to 0–100 range before passing
- ❌ `<Select Passing strings directly as children>` → Pass options={[{ value: 'a', label: 'Option A' }]}
- ❌ `<Toast Rendering <Toast> directly in JSX>` → Use: const { toast } = useToast(); then toast({ title, variant })
- ❌ `<Toast variant="error">` → Use variant="danger"
- ❌ `<Toast variant="info">` → Use variant="default"
- ❌ `<Tooltip Using Tooltip for rich content (forms, buttons, etc.)>` → Use Popover for rich interactive content
- ❌ `<Typography Using raw <h1>, <p> tags instead of Typography components>` → Use <Heading>, <Text>, <Lead> from @usevyre/react

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
