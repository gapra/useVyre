# PricingSection

A three-tier pricing section. Each plan is a Card; the recommended one is
highlighted with a Badge. Edit the plans array to taste.

**Use when:** building a pricing or upgrade page.
**Components:** Grid, Card, CardBody, Badge, Heading, Text, Button, Stack

## React

```tsx
import { Grid, Card, CardBody, Badge, Heading, Text, Button, Stack } from "@usevyre/react";

const plans = [
  { name: "Starter", price: "$0", features: ["1 project", "Community support"], featured: false },
  { name: "Pro", price: "$19", features: ["Unlimited projects", "Email support", "Analytics"], featured: true },
  { name: "Team", price: "$49", features: ["Everything in Pro", "SSO", "Audit log"], featured: false },
];

export function PricingSection() {
  return (
    <Grid columns={3} gap="lg">
      {plans.map((plan) => (
        <Card key={plan.name} variant={plan.featured ? "elevated" : "outlined"}>
          <CardBody>
            <Stack gap="md">
              <Stack direction="row" gap="sm" align="center">
                <Heading size="md">{plan.name}</Heading>
                {plan.featured && <Badge variant="success">Popular</Badge>}
              </Stack>
              <Heading size="xl">{plan.price}<Text as="span" variant="muted"> /mo</Text></Heading>
              <Stack gap="xs">
                {plan.features.map((f) => <Text key={f}>{f}</Text>)}
              </Stack>
              <Button variant={plan.featured ? "accent" : "secondary"} style={{ width: "100%" }}>
                Choose {plan.name}
              </Button>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { Grid, Card, CardBody, Badge, Heading, Text, Button, Stack } from "@usevyre/vue";

const plans = [
  { name: "Starter", price: "$0", features: ["1 project", "Community support"], featured: false },
  { name: "Pro", price: "$19", features: ["Unlimited projects", "Email support", "Analytics"], featured: true },
  { name: "Team", price: "$49", features: ["Everything in Pro", "SSO", "Audit log"], featured: false },
];
</script>

<template>
  <Grid :columns="3" gap="lg">
    <Card v-for="plan in plans" :key="plan.name" :variant="plan.featured ? 'elevated' : 'outlined'">
      <CardBody>
        <Stack gap="md">
          <Stack direction="row" gap="sm" align="center">
            <Heading size="md">{{ plan.name }}</Heading>
            <Badge v-if="plan.featured" variant="success">Popular</Badge>
          </Stack>
          <Heading size="xl">{{ plan.price }}<Text as="span" variant="muted"> /mo</Text></Heading>
          <Stack gap="xs">
            <Text v-for="f in plan.features" :key="f">{{ f }}</Text>
          </Stack>
          <Button :variant="plan.featured ? 'accent' : 'secondary'" :style="{ width: '100%' }">
            Choose {{ plan.name }}
          </Button>
        </Stack>
      </CardBody>
    </Card>
  </Grid>
</template>
```
