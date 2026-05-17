<script setup lang="ts">
/**
 * @usevyre/vue — RadioGroup
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  RadioGroup (+ Radio)                                 │
 * │ Import:     import { RadioGroup, Radio } from "@usevyre/vue"     │
 * │                                                                  │
 * │ CONTROLLED via v-model. RadioGroup owns the selected value.      │
 * │                                                                  │
 * │ Props:                                                           │
 * │   modelValue  = string (v-model)                                 │
 * │   name?       = string (auto if omitted)                         │
 * │   disabled?   = boolean (disables the whole group)               │
 * │   size?       = "sm" | "md"(default)                             │
 * │   orientation? = "vertical"(default) | "horizontal"              │
 * │   options?    = { value; label?; description?; disabled? }[]     │
 * │     → data-driven; OR pass <Radio> children for custom layout    │
 * │                                                                  │
 * │ Emits: update:modelValue (string)                                │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <RadioGroup v-model="plan" :options="[
 *   { value: 'free', label: 'Free', description: 'For hobby projects' },
 *   { value: 'pro',  label: 'Pro',  description: 'For teams' },
 * ]" />
 *
 * <RadioGroup v-model="plan">
 *   <Radio value="free" label="Free" />
 *   <Radio value="pro"  label="Pro" />
 * </RadioGroup>
 */

import { computed, provide } from "vue";
import { cn } from "../../utils/cn";
import { radioGroupKey } from "./context";
import Radio from "./Radio.vue";

export interface RadioOption {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

let radioGroupSeq = 0;

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    name?: string;
    disabled?: boolean;
    size?: "sm" | "md";
    orientation?: "vertical" | "horizontal";
    options?: RadioOption[];
    class?: string;
  }>(),
  { disabled: false, size: "md", orientation: "vertical" }
);

const emit = defineEmits<{ "update:modelValue": [v: string] }>();

const groupName = props.name ?? `vyre-radio-${++radioGroupSeq}`;

provide(radioGroupKey, {
  name: groupName,
  value: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
  select: (v: string) => emit("update:modelValue", v),
});

const classes = computed(() =>
  cn(
    "vyre-radio-group",
    `vyre-radio-group--${props.orientation}`,
    props.class
  )
);
</script>

<template>
  <div
    role="radiogroup"
    :aria-orientation="orientation"
    :class="classes"
    :data-disabled="disabled || undefined"
  >
    <template v-if="options">
      <Radio
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :label="opt.label"
        :description="opt.description"
        :disabled="opt.disabled"
      />
    </template>
    <slot v-else />
  </div>
</template>
