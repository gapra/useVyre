<script setup lang="ts">
/** @usevyre/vue — FieldError (composable part of Field; renders nothing when empty) */
import { computed, useSlots } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{ class?: string }>();
const slots = useSlots();
const hasContent = computed(() => !!slots.default);
const classes = computed(() => cn("vyre-field__error", props.class));
</script>

<template>
  <p v-if="hasContent" role="alert" :class="classes"><slot /></p>
</template>
