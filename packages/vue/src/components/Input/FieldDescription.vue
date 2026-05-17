<script setup lang="ts">
/** @usevyre/vue — FieldDescription (composable part of Field) */
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("vyre-field__description", props.class));
</script>

<template>
  <p :class="classes"><slot /></p>
</template>
