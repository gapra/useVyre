# ConfirmDialog

A destructive-action confirmation modal (delete/remove). Controlled via open
state.

**Use when:** confirming an irreversible action.
**Components:** Modal, ModalHeader, ModalBody, ModalFooter, Button

## React

```tsx
import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@usevyre/react";

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
      <Modal open={open} onClose={() => setOpen(false)} size="sm">
        <ModalHeader>Delete project?</ModalHeader>
        <ModalBody>This permanently removes the project and all its data. This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@usevyre/vue";

const open = ref(false);
</script>

<template>
  <Button variant="danger" @click="open = true">Delete project</Button>
  <Modal :open="open" size="sm" @close="open = false">
    <ModalHeader>Delete project?</ModalHeader>
    <ModalBody>This permanently removes the project and all its data. This action cannot be undone.</ModalBody>
    <ModalFooter>
      <Button variant="ghost" @click="open = false">Cancel</Button>
      <Button variant="danger" @click="open = false">Delete</Button>
    </ModalFooter>
  </Modal>
</template>
```
