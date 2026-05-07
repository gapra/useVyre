<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template>
  <p :class="cn('vyre-lead', props.class)"><slot /></p>
</template>
