<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("vyre-item__title", props.class));
</script>
<template>
  <div :class="classes"><slot /></div>
</template>
