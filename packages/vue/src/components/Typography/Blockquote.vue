<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template>
  <blockquote :class="cn('vyre-blockquote', props.class)"><slot /></blockquote>
</template>
