<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template><caption :class="cn('vyre-table__caption', props.class)"><slot /></caption></template>
