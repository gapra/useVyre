# StatsRow

A row of KPI stats for the top of a dashboard. Uses StatGroup so the cards size
and align consistently.

**Use when:** showing headline metrics on a dashboard or overview page.
**Components:** StatGroup, Stat

## React

```tsx
import { StatGroup, Stat } from "@usevyre/react";

export function StatsRow() {
  return (
    <StatGroup>
      <Stat label="Revenue" value="$48,200" delta={12.5} trend="up" deltaLabel="vs last month" />
      <Stat label="Active users" value="2,340" delta={3.1} trend="up" />
      <Stat label="Churn" value="1.8%" delta={-0.4} trend="down" deltaLabel="lower is better" />
      <Stat label="Open tickets" value="17" delta={0} trend="neutral" />
    </StatGroup>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { StatGroup, Stat } from "@usevyre/vue";
</script>

<template>
  <StatGroup>
    <Stat label="Revenue" value="$48,200" :delta="12.5" trend="up" delta-label="vs last month" />
    <Stat label="Active users" value="2,340" :delta="3.1" trend="up" />
    <Stat label="Churn" value="1.8%" :delta="-0.4" trend="down" delta-label="lower is better" />
    <Stat label="Open tickets" value="17" :delta="0" trend="neutral" />
  </StatGroup>
</template>
```
