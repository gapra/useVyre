<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ selected?: boolean; class?: string }>();
</script>
<template>
  <tr
    :class="cn('vyre-table__row', props.selected && 'vyre-table__row--selected', props.class)"
    :aria-selected="selected || undefined"
  ><slot /></tr>
</template>
