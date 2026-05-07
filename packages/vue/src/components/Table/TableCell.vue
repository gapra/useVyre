<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = withDefaults(
  defineProps<{ align?: "left" | "center" | "right"; class?: string }>(),
  { align: "left" }
);
</script>
<template>
  <td :class="cn('vyre-table__td', `vyre-table__td--${align}`, props.class)"><slot /></td>
</template>
