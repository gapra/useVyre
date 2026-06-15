# AuthCard

A centered sign-in card: email + password fields, a primary submit, and OAuth
options. A starting point — copy it and adjust.

**Use when:** building a login or sign-in screen.
**Components:** Card, CardBody, Field, Input, Button, Checkbox, Heading, Text, Stack

## React

```tsx
import {
  Card, CardBody, Field, Input, Button, Checkbox, Heading, Text, Stack,
} from "@usevyre/react";

export function AuthCard() {
  return (
    <Card variant="elevated" style={{ maxWidth: 420, margin: "0 auto" }}>
      <CardBody>
        <Stack direction="column" gap="md">
          <div>
            <Heading size="lg">Sign in</Heading>
            <Text variant="muted">Welcome back. Enter your details.</Text>
          </div>

          <Field label="Email">
            <Input type="email" placeholder="you@example.com" />
          </Field>

          <Field label="Password">
            <Input type="password" placeholder="••••••••" />
          </Field>

          <label style={{ display: "flex", alignItems: "center", gap: "var(--vyre-spacing-2)" }}>
            <Checkbox /> Remember me
          </label>

          <Button variant="accent" style={{ width: "100%" }}>Sign in</Button>

          <Stack direction="row" gap="sm">
            <Button variant="secondary" style={{ flex: 1 }}>GitHub</Button>
            <Button variant="secondary" style={{ flex: 1 }}>Google</Button>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import {
  Card, CardBody, Field, Input, Button, Checkbox, Heading, Text, Stack,
} from "@usevyre/vue";
</script>

<template>
  <Card variant="elevated" :style="{ maxWidth: '420px', margin: '0 auto' }">
    <CardBody>
      <Stack direction="column" gap="md">
        <div>
          <Heading size="lg">Sign in</Heading>
          <Text variant="muted">Welcome back. Enter your details.</Text>
        </div>

        <Field label="Email">
          <Input type="email" placeholder="you@example.com" />
        </Field>

        <Field label="Password">
          <Input type="password" placeholder="••••••••" />
        </Field>

        <label :style="{ display: 'flex', alignItems: 'center', gap: 'var(--vyre-spacing-2)' }">
          <Checkbox /> Remember me
        </label>

        <Button variant="accent" :style="{ width: '100%' }">Sign in</Button>

        <Stack direction="row" gap="sm">
          <Button variant="secondary" :style="{ flex: 1 }">GitHub</Button>
          <Button variant="secondary" :style="{ flex: 1 }">Google</Button>
        </Stack>
      </Stack>
    </CardBody>
  </Card>
</template>
```
