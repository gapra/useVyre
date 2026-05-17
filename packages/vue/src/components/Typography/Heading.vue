<script setup lang="ts">
/**
 * @usevyre/vue — Heading
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Heading                         │
 * │ as    = "h1"|"h2"(default)|"h3"|...|"h6"   │
 * │ size  = "xs"|"sm"|"md"|"lg"|"xl"|"2xl"|    │
 * │         "3xl"                               │
 * │ weight = "normal"|"medium"|"semibold"|      │
 * │          "bold"(default)                    │
 * │ color = "default"|"muted"|"accent"|...      │
 * │ truncate = boolean                          │
 * └─────────────────────────────────────────────┘
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(defineProps<{
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "accent" | "danger" | "success" | "warning";
  truncate?: boolean;
  class?: string;
}>(), { as: "h2", size: "md", weight: "bold", color: "default" });

const classes = computed(() => cn(
  "vyre-heading",
  `vyre-heading--${props.size}`,
  props.weight !== "bold" && `vyre-heading--${props.weight}`,
  props.color !== "default" && `vyre-text--${props.color}`,
  props.truncate && "vyre-text--truncate",
  props.class,
));
</script>

<template>
  <component :is="as" :class="classes"><slot /></component>
</template>
