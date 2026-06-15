# StatsRow

A row of KPI stats for the top of a dashboard, inside a full-width Card so the
StatGroup has room to split evenly.

**Use when:** showing headline metrics on a dashboard or overview page.
**Components:** Card, CardBody, StatGroup, Stat

## React

```tsx
import { Card, CardBody, StatGroup, Stat } from "@usevyre/react";

export function StatsRow() {
  return (
    <Card style={{ width: "100%" }}>
      <CardBody>
        <StatGroup>
          <Stat label="Revenue" value="$48,200" delta={12.5} trend="up" deltaLabel="vs last month" />
          <Stat label="Active users" value="2,340" delta={3.1} trend="up" />
          <Stat label="Churn" value="1.8%" delta={-0.4} trend="down" deltaLabel="lower is better" />
        </StatGroup>
      </CardBody>
    </Card>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { Card, CardBody, StatGroup, Stat } from "@usevyre/vue";
</script>

<template>
  <Card :style="{ width: '100%' }">
    <CardBody>
      <StatGroup>
        <Stat label="Revenue" value="$48,200" :delta="12.5" trend="up" delta-label="vs last month" />
        <Stat label="Active users" value="2,340" :delta="3.1" trend="up" />
        <Stat label="Churn" value="1.8%" :delta="-0.4" trend="down" delta-label="lower is better" />
      </StatGroup>
    </CardBody>
  </Card>
</template>
```
