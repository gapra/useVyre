# DataTablePage

A list/CRUD page: heading, a search toolbar, a Table, and Pagination — the most
common internal-app screen.

**Use when:** showing a paginated list of records to browse/manage.
**Components:** Stack, Heading, Input, Button, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Badge, Pagination

## React

```tsx
import { useState } from "react";
import {
  Stack, Heading, Input, Button, Table, TableHead, TableBody, TableRow,
  TableHeader, TableCell, Badge, Pagination,
} from "@usevyre/react";

const rows = [
  { name: "Acme Inc", plan: "Pro", status: "Active" },
  { name: "Globex", plan: "Starter", status: "Trial" },
  { name: "Initech", plan: "Business", status: "Active" },
];

export function DataTablePage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  return (
    <Stack direction="column" gap="md">
      <Stack direction="row" align="center" justify="between">
        <Heading size="lg">Customers</Heading>
        <Stack direction="row" gap="sm">
          <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="accent">Add customer</Button>
        </Stack>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Plan</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.plan}</TableCell>
              <TableCell>
                <Badge variant={r.status === "Active" ? "success" : "warning"}>{r.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={5} onPageChange={setPage} />
    </Stack>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Stack, Heading, Input, Button, Table, TableHead, TableBody, TableRow,
  TableHeader, TableCell, Badge, Pagination,
} from "@usevyre/vue";

const page = ref(1);
const query = ref("");
const rows = [
  { name: "Acme Inc", plan: "Pro", status: "Active" },
  { name: "Globex", plan: "Starter", status: "Trial" },
  { name: "Initech", plan: "Business", status: "Active" },
];
</script>

<template>
  <Stack direction="column" gap="md">
    <Stack direction="row" align="center" justify="between">
      <Heading size="lg">Customers</Heading>
      <Stack direction="row" gap="sm">
        <Input v-model="query" placeholder="Search…" />
        <Button variant="accent">Add customer</Button>
      </Stack>
    </Stack>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Plan</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow v-for="r in rows" :key="r.name">
          <TableCell>{{ r.name }}</TableCell>
          <TableCell>{{ r.plan }}</TableCell>
          <TableCell>
            <Badge :variant="r.status === 'Active' ? 'success' : 'warning'">{{ r.status }}</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination :page="page" :total-pages="5" @page-change="page = $event" />
  </Stack>
</template>
```
