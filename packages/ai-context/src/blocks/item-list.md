# ItemList

A list of rows with media, title/description and a trailing action — settings
toggles, notification feeds, member lists.

**Use when:** showing a vertical list of records with an action per row.
**Components:** Card, CardBody, ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, Avatar, Button

## React

```tsx
import {
  Card, CardBody, ItemGroup, Item, ItemMedia, ItemContent, ItemTitle,
  ItemDescription, ItemActions, Avatar, Button,
} from "@usevyre/react";

const members = [
  { name: "Ada Lovelace", email: "ada@example.com", initials: "AL" },
  { name: "Alan Turing", email: "alan@example.com", initials: "AT" },
  { name: "Grace Hopper", email: "grace@example.com", initials: "GH" },
];

export function ItemList() {
  return (
    <Card style={{ width: "100%" }}>
      <CardBody>
        <ItemGroup>
          {members.map((m) => (
            <Item key={m.email}>
              <ItemMedia><Avatar fallback={m.initials} size="sm" /></ItemMedia>
              <ItemContent>
                <ItemTitle>{m.name}</ItemTitle>
                <ItemDescription>{m.email}</ItemDescription>
              </ItemContent>
              <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardBody>
    </Card>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import {
  Card, CardBody, ItemGroup, Item, ItemMedia, ItemContent, ItemTitle,
  ItemDescription, ItemActions, Avatar, Button,
} from "@usevyre/vue";

const members = [
  { name: "Ada Lovelace", email: "ada@example.com", initials: "AL" },
  { name: "Alan Turing", email: "alan@example.com", initials: "AT" },
  { name: "Grace Hopper", email: "grace@example.com", initials: "GH" },
];
</script>

<template>
  <Card :style="{ width: '100%' }">
    <CardBody>
      <ItemGroup>
        <Item v-for="m in members" :key="m.email">
          <ItemMedia><Avatar :fallback="m.initials" size="sm" /></ItemMedia>
          <ItemContent>
            <ItemTitle>{{ m.name }}</ItemTitle>
            <ItemDescription>{{ m.email }}</ItemDescription>
          </ItemContent>
          <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
        </Item>
      </ItemGroup>
    </CardBody>
  </Card>
</template>
```
