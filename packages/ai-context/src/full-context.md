# useVyre Design System — AI Context
# Version: 0.1.0
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

### Button

```tsx
import { Button } from "@usevyre/react"

// Props:
// variant  = "primary" | "secondary" | "ghost" | "accent" | "teal" | "danger"
// size     = "sm" | "md" | "lg" | "icon"
// loading  = boolean
// disabled = boolean
// as       = React.ElementType (default: "button")
// leftIcon = ReactNode
// rightIcon = ReactNode

// Examples:
<Button variant="accent" size="lg">Get Started</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="danger" loading>Deleting...</Button>
<Button as="a" href="/docs" variant="secondary">Read Docs</Button>
```

### Badge

```tsx
import { Badge } from "@usevyre/react"

// Props:
// variant = "default" | "accent" | "teal" | "success" | "warning" | "danger"
// dot     = boolean (live status indicator dot)

// Examples:
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning">Beta</Badge>
<Badge variant="danger">Error</Badge>
```

### Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from "@usevyre/react"

// Card props:
// variant   = "default" | "elevated" | "outlined" | "ghost" | "accent"
// hoverable = boolean
// clickable = boolean

// Examples:
<Card variant="elevated">
  <CardHeader>
    <Badge variant="teal">New</Badge>
  </CardHeader>
  <CardBody>
    <h3>Card Title</h3>
    <p>Description text.</p>
  </CardBody>
  <CardFooter>
    <Button variant="ghost" size="sm">Learn more</Button>
  </CardFooter>
</Card>
```

### Field + Input + Textarea

```tsx
import { Field, Input, Textarea } from "@usevyre/react"

// Field props:
// label    = string
// hint     = string
// state    = "idle" | "error" | "success" | "warning"
// required = boolean

// Input props:
// size         = "sm" | "md" | "lg"
// leftElement  = ReactNode
// rightElement = ReactNode
// + all native input props

// Examples:
<Field label="Email" state="error" hint="Invalid format">
  <Input type="email" placeholder="you@example.com" />
</Field>

<Field label="Search">
  <Input leftElement={<SearchIcon />} placeholder="Search..." />
</Field>

<Field label="Bio">
  <Textarea rows={4} placeholder="Tell us about yourself..." />
</Field>
```

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
