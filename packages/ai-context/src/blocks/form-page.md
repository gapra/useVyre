# FormPage

A create/edit entity form in a Card: validated fields with a footer of
submit/cancel actions.

**Use when:** building a "new" or "edit" record screen.
**Components:** Card, CardBody, Heading, Form, FormField, Input, Button, Stack

## React

```tsx
import { useState } from "react";
import { Card, CardBody, Heading, Form, FormField, Input, Button, Stack } from "@usevyre/react";

export function FormPage() {
  const [values, setValues] = useState({ name: "", email: "", role: "" });
  return (
    <Card style={{ width: "100%", maxWidth: 480 }}>
      <CardBody>
        <Stack direction="column" gap="lg">
          <Heading size="lg">New member</Heading>
          <Form values={values} onChange={(v) => setValues(v as typeof values)} onSubmit={() => {}}>
            <FormField name="name" label="Full name" rules={{ required: true }}>
              <Input placeholder="Ada Lovelace" />
            </FormField>
            <FormField name="email" label="Email" rules={{ required: true, email: true }}>
              <Input type="email" placeholder="ada@example.com" />
            </FormField>
            <FormField name="role" label="Role">
              <Input placeholder="Engineer" />
            </FormField>
            <Stack direction="row" gap="sm" justify="end">
              <Button variant="ghost" type="button">Cancel</Button>
              <Button variant="accent" type="submit">Create</Button>
            </Stack>
          </Form>
        </Stack>
      </CardBody>
    </Card>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Card, CardBody, Heading, Form, FormField, Input, Button, Stack } from "@usevyre/vue";

const values = reactive({ name: "", email: "", role: "" });
</script>

<template>
  <Card :style="{ width: '100%', maxWidth: '480px' }">
    <CardBody>
      <Stack direction="column" gap="lg">
        <Heading size="lg">New member</Heading>
        <Form :values="values" @submit="() => {}">
          <FormField name="name" label="Full name" :rules="{ required: true }">
            <Input placeholder="Ada Lovelace" />
          </FormField>
          <FormField name="email" label="Email" :rules="{ required: true, email: true }">
            <Input type="email" placeholder="ada@example.com" />
          </FormField>
          <FormField name="role" label="Role">
            <Input placeholder="Engineer" />
          </FormField>
          <Stack direction="row" gap="sm" justify="end">
            <Button variant="ghost" type="button">Cancel</Button>
            <Button variant="accent" type="submit">Create</Button>
          </Stack>
        </Form>
      </Stack>
    </CardBody>
  </Card>
</template>
```
