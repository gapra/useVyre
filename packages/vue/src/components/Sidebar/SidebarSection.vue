<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ label?: string; class?: string }>();
</script>
<template>
  <div :class="cn('vyre-sidebar__section', props.class)">
    <div v-if="label" class="vyre-sidebar__section-label">{{ label }}</div>
    <slot />
  </div>
</template>
