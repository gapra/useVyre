# PageHeader

A page title row with a breadcrumb and primary actions — the top of most app
pages.

**Use when:** heading any content page (list, detail, settings).
**Components:** Breadcrumb, BreadcrumbItem, Heading, Button, Stack

## React

```tsx
import { Breadcrumb, BreadcrumbItem, Heading, Button, Stack } from "@usevyre/react";

export function PageHeader() {
  return (
    <Stack direction="column" gap="sm">
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Projects</BreadcrumbItem>
      </Breadcrumb>
      <Stack direction="row" align="center" justify="between">
        <Heading size="xl">Projects</Heading>
        <Stack direction="row" gap="sm">
          <Button variant="secondary">Export</Button>
          <Button variant="accent">New project</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, Heading, Button, Stack } from "@usevyre/vue";
</script>

<template>
  <Stack direction="column" gap="sm">
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>Projects</BreadcrumbItem>
    </Breadcrumb>
    <Stack direction="row" align="center" justify="between">
      <Heading size="xl">Projects</Heading>
      <Stack direction="row" gap="sm">
        <Button variant="secondary">Export</Button>
        <Button variant="accent">New project</Button>
      </Stack>
    </Stack>
  </Stack>
</template>
```
