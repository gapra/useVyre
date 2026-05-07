<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = withDefaults(
  defineProps<{
    sortable?: boolean;
    sortDir?: "asc" | "desc" | null;
    align?: "left" | "center" | "right";
    class?: string;
  }>(),
  { align: "left", sortDir: null }
);
const emit = defineEmits<{ (e: "sort"): void }>();
</script>

<template>
  <th
    v-if="!sortable"
    :class="cn('vyre-table__th', `vyre-table__th--${align}`, props.class)"
  ><slot /></th>
  <th
    v-else
    :class="cn('vyre-table__th vyre-table__th--sortable', `vyre-table__th--${align}`, sortDir && `vyre-table__th--sort-${sortDir}`, props.class)"
    :aria-sort="sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'"
  >
    <button class="vyre-table__sort-btn" type="button" @click="emit('sort')">
      <slot />
      <span class="vyre-table__sort-icon" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" :opacity="sortDir === 'desc' ? 0.3 : 1"/>
          <path d="M3 7l3 3 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" :opacity="sortDir === 'asc' ? 0.3 : 1"/>
        </svg>
      </span>
    </button>
  </th>
</template>
