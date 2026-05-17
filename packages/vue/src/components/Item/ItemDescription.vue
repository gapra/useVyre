<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";
const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("vyre-item__description", props.class));
</script>
<template>
  <p :class="classes"><slot /></p>
</template>
