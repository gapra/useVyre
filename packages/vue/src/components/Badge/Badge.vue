<script setup lang="ts">
/**
 * @usevyre/vue — Badge
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Badge                                       │
 * │ Import:     import { Badge } from "@usevyre/vue"           │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant = "default"|"accent"|"teal"|                  │
 * │             "success"|"warning"|"danger"                │
 * │   dot     = boolean (show colored dot before label)     │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Badge variant="success">Live</Badge>
 * <Badge variant="warning" :dot="true">Beta</Badge>
 * <Badge variant="danger">Deprecated</Badge>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type BadgeVariant = "default" | "accent" | "teal" | "success" | "warning" | "danger";

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant;
    dot?:     boolean;
    class?:   string;
  }>(),
  { variant: "default", dot: false }
);

const classes = computed(() =>
  cn("vyre-badge", `vyre-badge--${props.variant}`, props.class)
);
</script>

<template>
  <span :class="classes" :data-variant="variant">
    <span v-if="dot" class="vyre-badge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>
