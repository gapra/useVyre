<script setup lang="ts">
/**
 * @usevyre/vue — Textarea
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Textarea                                    │
 * │ Import:     import { Textarea } from "@usevyre/vue"     │
 * │                                                         │
 * │ Props:                                                  │
 * │   modelValue = string (v-model)                         │
 * │   size   = "sm"|"md"(default)|"lg"                      │
 * │   resize = "none"|"vertical"(default)|"horizontal"|     │
 * │            "both"                                       │
 * │   + all native textarea attributes                      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Textarea v-model="bio" placeholder="Write…" :rows="4" />
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type TextareaSize   = "sm" | "md" | "lg";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    size?:   TextareaSize;
    resize?: TextareaResize;
    class?:  string;
  }>(),
  { size: "md", resize: "vertical" }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const classes = computed(() =>
  cn("vyre-textarea", `vyre-textarea--${props.size}`, props.class)
);

defineOptions({ inheritAttrs: false });
</script>

<template>
  <textarea
    :class="classes"
    :style="{ resize: resize }"
    :value="modelValue"
    v-bind="$attrs"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
