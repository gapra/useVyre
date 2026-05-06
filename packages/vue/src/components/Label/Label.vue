<script setup lang="ts">
withDefaults(defineProps<{
  for?: string;
  required?: boolean;
  disabled?: boolean;
  class?: string;
}>(), {});
</script>

<template>
  <label
    :for="$props.for"
    :data-required="required || undefined"
    :data-disabled="disabled || undefined"
    :class="['vyre-label', $props.class]"
  >
    <slot />
    <span v-if="required" class="vyre-label__required" aria-hidden="true">*</span>
  </label>
</template>
