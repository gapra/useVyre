<script setup lang="ts">
withDefaults(defineProps<{
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
  class?: string;
}>(), { variant: "rect" });

const px = (v?: string | number) =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v;
</script>

<template>
  <div
    aria-hidden="true"
    :data-variant="variant"
    :class="['vyre-skeleton', $props.class]"
    :style="{ width: px(width), height: px(height) }"
  />
</template>
