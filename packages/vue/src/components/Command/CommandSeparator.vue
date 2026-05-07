<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template>
  <div :class="cn('vyre-command__separator', props.class)" role="separator" aria-hidden="true" />
</template>
