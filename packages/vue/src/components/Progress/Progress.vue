<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "accent" | "teal" | "success" | "danger";
  class?: string;
}>(), { max: 100, size: "md", variant: "default" });

const percentage = computed(() =>
  props.indeterminate
    ? undefined
    : Math.min(100, Math.max(0, ((props.value ?? 0) / props.max!) * 100))
);
</script>

<template>
  <div
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="indeterminate ? undefined : (value ?? 0)"
    :data-size="size"
    :data-variant="variant"
    :data-indeterminate="indeterminate || undefined"
    :class="['vyre-progress', $props.class]"
  >
    <div
      class="vyre-progress__bar"
      :style="percentage !== undefined ? { width: `${percentage}%` } : undefined"
    />
  </div>
</template>
