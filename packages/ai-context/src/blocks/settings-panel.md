# SettingsPanel

A settings card with text fields and toggle rows — the common "Account / 
Preferences" panel.

**Use when:** building a settings or preferences screen.
**Components:** Card, CardBody, Heading, Field, Input, Switch, Button, Stack, Text

## React

```tsx
import { Card, CardBody, Heading, Field, Input, Switch, Button, Stack, Text } from "@usevyre/react";

export function SettingsPanel() {
  return (
    <Card variant="outlined" style={{ maxWidth: 560 }}>
      <CardBody>
        <Stack direction="column" gap="lg">
          <Heading size="lg">Settings</Heading>

          <Field label="Display name">
            <Input placeholder="Ada Lovelace" />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="ada@example.com" />
          </Field>

          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Email notifications</Text>
            <Switch />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Two-factor authentication</Text>
            <Switch />
          </label>

          <Stack direction="row" gap="sm" justify="end">
            <Button variant="ghost">Cancel</Button>
            <Button variant="accent">Save changes</Button>
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
import { Card, CardBody, Heading, Field, Input, Switch, Button, Stack, Text } from "@usevyre/vue";
</script>

<template>
  <Card variant="outlined" :style="{ maxWidth: '560px' }">
    <CardBody>
      <Stack direction="column" gap="lg">
        <Heading size="lg">Settings</Heading>

        <Field label="Display name">
          <Input placeholder="Ada Lovelace" />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="ada@example.com" />
        </Field>

        <label :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <Text>Email notifications</Text>
          <Switch />
        </label>
        <label :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <Text>Two-factor authentication</Text>
          <Switch />
        </label>

        <Stack direction="row" gap="sm" justify="end">
          <Button variant="ghost">Cancel</Button>
          <Button variant="accent">Save changes</Button>
        </Stack>
      </Stack>
    </CardBody>
  </Card>
</template>
```
