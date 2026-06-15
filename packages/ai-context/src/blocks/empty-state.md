# EmptyStateBlock

A friendly empty state with a primary call to action — for first-run screens or
zero-result lists.

**Use when:** a list/section has no data yet, or a search returns nothing.
**Components:** EmptyState, Button

## React

```tsx
import { EmptyState, Button } from "@usevyre/react";

export function EmptyStateBlock() {
  return (
    <EmptyState
      title="No projects yet"
      description="Create your first project to get started."
    >
      <Button variant="accent">New project</Button>
    </EmptyState>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { EmptyState, Button } from "@usevyre/vue";
</script>

<template>
  <EmptyState
    title="No projects yet"
    description="Create your first project to get started."
  >
    <Button variant="accent">New project</Button>
  </EmptyState>
</template>
```
