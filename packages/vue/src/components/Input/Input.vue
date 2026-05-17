<script setup lang="ts">
/**
 * @usevyre/vue — Input
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Input                                       │
 * │ Import:     import { Input } from "@usevyre/vue"        │
 * │                                                         │
 * │ Props:                                                  │
 * │   modelValue   = string (v-model)                       │
 * │   size         = "sm"|"md"(default)|"lg"                │
 * │   + all native input attributes (type, placeholder...)  │
 * │                                                         │
 * │ Slots:                                                  │
 * │   left-element  — icon/element inside input, left       │
 * │   right-element — icon/element inside input, right      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Input v-model="email" type="email" placeholder="you@..." />
 *
 * <Input placeholder="Search...">
 *   <template #left-element><SearchIcon /></template>
 * </Input>
 */

import { computed, useSlots } from "vue";
import { cn } from "../../utils/cn";

type InputSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    size?:  InputSize;
    class?: string;
  }>(),
  { size: "md" }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const slots = useSlots();
const hasLeft  = computed(() => !!slots["left-element"]);
const hasRight = computed(() => !!slots["right-element"]);
const hasSlots = computed(() => hasLeft.value || hasRight.value);

const inputClasses = computed(() =>
  cn(
    "vyre-input",
    `vyre-input--${props.size}`,
    hasLeft.value  && "vyre-input--has-left",
    hasRight.value && "vyre-input--has-right",
    !hasSlots.value && props.class
  )
);

const wrapperClasses = computed(() =>
  cn("vyre-input-wrapper", `vyre-input-wrapper--${props.size}`, props.class)
);

// Forward all attrs to the input element
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div v-if="hasSlots" :class="wrapperClasses">
    <span v-if="hasLeft" class="vyre-input__element vyre-input__element--left" aria-hidden="true">
      <slot name="left-element" />
    </span>
    <input
      :class="inputClasses"
      :value="modelValue"
      v-bind="$attrs"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="hasRight" class="vyre-input__element vyre-input__element--right" aria-hidden="true">
      <slot name="right-element" />
    </span>
  </div>
  <input
    v-else
    :class="inputClasses"
    :value="modelValue"
    v-bind="$attrs"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
