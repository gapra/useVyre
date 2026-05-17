<script setup lang="ts">
/**
 * @usevyre/vue — Field
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Field                                       │
 * │ Import:     import { Field } from "@usevyre/vue"           │
 * │                                                         │
 * │ Props:                                                  │
 * │   label    = string                                     │
 * │   hint     = string (helper text below input)           │
 * │   state    = "idle"|"error"|"success"|"warning"         │
 * │   required = boolean                                    │
 * │   for      = string (links label to input id)           │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Field label="Email" state="error" hint="Invalid email format" for="email-input">
 *   <Input id="email-input" type="email" placeholder="you@example.com" />
 * </Field>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type FieldState = "idle" | "error" | "success" | "warning";

const props = withDefaults(
  defineProps<{
    label?:    string;
    hint?:     string;
    state?:    FieldState;
    required?: boolean;
    for?:      string;
    class?:    string;
  }>(),
  { state: "idle", required: false }
);

const classes = computed(() =>
  cn(
    "vyre-field",
    props.state !== "idle" && `vyre-field--${props.state}`,
    props.class
  )
);
</script>

<template>
  <div :class="classes" :data-state="state">
    <label v-if="label" class="vyre-field__label" :for="$props.for">
      {{ label }}
      <span v-if="required" class="vyre-field__required" aria-label="required">*</span>
    </label>
    <slot />
    <span
      v-if="hint"
      class="vyre-field__hint"
      :role="state === 'error' ? 'alert' : undefined"
    >
      {{ hint }}
    </span>
  </div>
</template>
