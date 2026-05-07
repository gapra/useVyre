<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template>
  <div :class="cn('vyre-sheet__footer', props.class)"><slot /></div>
</template>
