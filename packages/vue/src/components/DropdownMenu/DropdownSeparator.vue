<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>

<template>
  <div role="separator" :class="cn('vyre-dropdown__separator', props.class)" />
</template>
