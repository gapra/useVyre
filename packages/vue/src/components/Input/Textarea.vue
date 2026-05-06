<script setup lang="ts">
/**
 * @vyre/vue — Textarea
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Textarea                                    │
 * │ Import:     import { Textarea } from "@vyre/vue"        │
 * │                                                         │
 * │ Props:                                                  │
 * │   size   = "sm"|"md"(default)|"lg"                      │
 * │   resize = "none"|"vertical"(default)|"horizontal"|     │
 * │            "both"                                       │
 * │   + all native textarea attributes                      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Textarea placeholder="Write your message..." :rows="4" />
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type TextareaSize   = "sm" | "md" | "lg";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";

const props = withDefaults(
  defineProps<{
    size?:   TextareaSize;
    resize?: TextareaResize;
    class?:  string;
  }>(),
  { size: "md", resize: "vertical" }
);

const classes = computed(() =>
  cn("vyre-textarea", `vyre-textarea--${props.size}`, props.class)
);

defineOptions({ inheritAttrs: false });
</script>

<template>
  <textarea
    :class="classes"
    :style="{ resize: resize }"
    v-bind="$attrs"
  />
</template>
