<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template><thead :class="cn('vyre-table__head', props.class)"><slot /></thead></template>
