<script setup lang="ts">
/**
 * @vyre/vue — Table
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Table + TableHead + TableBody + TableRow +  │
 * │             TableHeader + TableCell + TableCaption      │
 * │ Import:     import { Table, TableHead, TableBody,       │
 * │             TableRow, TableHeader, TableCell,           │
 * │             TableCaption } from "@vyre/vue"             │
 * │                                                         │
 * │ Table props:                                            │
 * │   striped   = boolean (default: false)                  │
 * │   bordered  = boolean (default: false)                  │
 * │   compact   = boolean (default: false)                  │
 * │   hoverable = boolean (default: true)                   │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Table>
 *   <TableHead>
 *     <TableRow>
 *       <TableHeader>Name</TableHeader>
 *       <TableHeader>Email</TableHeader>
 *     </TableRow>
 *   </TableHead>
 *   <TableBody>
 *     <TableRow v-for="row in rows" :key="row.id">
 *       <TableCell>{{ row.name }}</TableCell>
 *       <TableCell>{{ row.email }}</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */

import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    striped?: boolean;
    bordered?: boolean;
    compact?: boolean;
    hoverable?: boolean;
    class?: string;
  }>(),
  { hoverable: true }
);
</script>

<template>
  <div class="vyre-table-wrapper">
    <table
      :class="cn(
        'vyre-table',
        striped   && 'vyre-table--striped',
        bordered  && 'vyre-table--bordered',
        compact   && 'vyre-table--compact',
        hoverable && 'vyre-table--hoverable',
        props.class
      )"
    >
      <slot />
    </table>
  </div>
</template>
