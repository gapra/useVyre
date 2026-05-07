<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template>
  <header :class="cn('vyre-app-bar', props.class)"><slot /></header>
</template>
