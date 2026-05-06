<script setup lang="ts">
/**
 * @vyre/vue — Input
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Input                                       │
 * │ Import:     import { Input } from "@vyre/vue"           │
 * │                                                         │
 * │ Props:                                                  │
 * │   size         = "sm"|"md"(default)|"lg"                │
 * │   + all native input attributes (type, placeholder...)  │
 * │                                                         │
 * │ Slots:                                                  │
 * │   left-element  — icon/element inside input, left       │
 * │   right-element — icon/element inside input, right      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Input type="text" placeholder="Search..." size="md" />
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
    size?:  InputSize;
    class?: string;
  }>(),
  { size: "md" }
);

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
    <input :class="inputClasses" v-bind="$attrs" />
    <span v-if="hasRight" class="vyre-input__element vyre-input__element--right" aria-hidden="true">
      <slot name="right-element" />
    </span>
  </div>
  <input v-else :class="inputClasses" v-bind="$attrs" />
</template>
