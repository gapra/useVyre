<script setup lang="ts">
/** @usevyre/vue — FieldSet (semantic <fieldset> with optional legend) */
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{ legend?: string; class?: string }>();
const classes = computed(() => cn("vyre-field-set", props.class));
</script>

<template>
  <fieldset :class="classes">
    <legend v-if="legend" class="vyre-field-set__legend">{{ legend }}</legend>
    <slot />
  </fieldset>
</template>
