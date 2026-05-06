<script setup lang="ts">
withDefaults(defineProps<{
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  class?: string;
}>(), { orientation: "horizontal", decorative: true });
</script>

<template>
  <div
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="!decorative ? orientation : undefined"
    :data-orientation="orientation"
    :class="['vyre-separator', $props.class]"
  />
</template>
