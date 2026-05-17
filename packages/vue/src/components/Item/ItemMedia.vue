<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("vyre-item__media", props.class));
</script>
<template>
  <div :class="classes" aria-hidden="true"><slot /></div>
</template>
