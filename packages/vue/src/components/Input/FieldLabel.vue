<script setup lang="ts">
/** @usevyre/vue — FieldLabel (composable part of Field) */
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{ required?: boolean; for?: string; class?: string }>(),
  { required: false }
);
const classes = computed(() => cn("vyre-field__label", props.class));
</script>

<template>
  <label :class="classes" :for="$props.for">
    <slot />
    <span v-if="required" class="vyre-field__required" aria-label="required">*</span>
  </label>
</template>
