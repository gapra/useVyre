<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
</script>
<template><tbody :class="cn('vyre-table__body', props.class)"><slot /></tbody></template>
