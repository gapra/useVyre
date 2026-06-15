# @usevyre/vue

> Vue 3 + TypeScript components for the useVyre design system — AI-native, accessible, zero runtime styling.

[![npm](https://img.shields.io/npm/v/@usevyre/vue)](https://www.npmjs.com/package/@usevyre/vue)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Installation

```bash
npm install @usevyre/tokens @usevyre/vue
# or
pnpm add @usevyre/tokens @usevyre/vue
```

## Setup

Import once at your app entry point:

```ts
// main.ts
import "@usevyre/vue/styles";   // tokens + component styles (one import)

import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

Place `ToastViewport` once in your root layout:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ToastViewport } from "@usevyre/vue";
</script>

<template>
  <RouterView />
  <ToastViewport />
</template>
```

## Usage

```vue
<script setup lang="ts">
import { Button, Badge, Card, CardHeader, CardBody, CardFooter } from "@usevyre/vue";
import { useToast } from "@usevyre/vue";

const { toast } = useToast();
</script>

<template>
  <Card variant="elevated">
    <CardHeader>
      <Badge variant="success" dot>Active</Badge>
    </CardHeader>
    <CardBody>
      <p>Ready to ship.</p>
    </CardBody>
    <CardFooter>
      <Button variant="accent" @click="toast({ title: 'Saved!', variant: 'success' })">
        Save changes
      </Button>
    </CardFooter>
  </Card>
</template>
```

## Components

| Component | Description |
|-----------|-------------|
| `Button` | `primary · secondary · ghost · accent · teal · danger` |
| `Badge` | `default · accent · teal · success · warning · danger` |
| `Card` | `default · elevated · outlined · ghost · accent` |
| `Input` / `Textarea` / `Field` | Form inputs with label, hint, and validation states |
| `Modal` | Dialog overlay with focus trap |
| `Select` | Accessible dropdown with keyboard navigation |
| `Tabs` | WAI-ARIA tab navigation |
| `Toast` / `useToast` / `ToastViewport` | Toast notifications via composable |
| `Tooltip` | Hover/focus tooltip with placement options |
| `Accordion` | Collapsible sections |
| `Avatar` | User avatar with image fallback and status dot |
| `Checkbox` / `Switch` / `Slider` | Form controls |
| `Popover` / `DropdownMenu` | Floating UI panels |
| `Alert` / `AlertDialog` | Inline and blocking alerts |
| `Sheet` | Slide-in panel overlay |
| `Sidebar` / `AppLayout` | Full app shell layout |
| `Command` | Command palette with search |
| `Table` | Data table |
| `Breadcrumb` / `Pagination` | Navigation |
| `Skeleton` / `Progress` / `Separator` | Utility components |
| `Text` / `Heading` / `Lead` / `Code` | Typography |

Full component docs → [usevyre.com/docs/getting-started](https://usevyre.com/docs/getting-started)

## Peer dependencies

```json
{
  "vue": ">=3.3.0"
}
```

## License

MIT © [Gapra](https://gapra.dev)
