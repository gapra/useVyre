<script setup lang="ts">
/** @usevyre/vue — FieldGroup (lays out multiple fields/controls) */
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{ orientation?: "vertical" | "horizontal"; class?: string }>(),
  { orientation: "vertical" }
);
const classes = computed(() =>
  cn("vyre-field-group", `vyre-field-group--${props.orientation}`, props.class)
);
</script>

<template>
  <div :class="classes"><slot /></div>
</template>
