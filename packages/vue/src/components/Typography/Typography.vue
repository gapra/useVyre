<script setup lang="ts">
/**
 * @usevyre/vue — Typography (Text)
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Text                            │
 * │ as       = "p"|"span"|"div"|"label"|"li"   │
 * │ size     = "xs"|"sm"|"md"|"lg"|"xl"        │
 * │ weight   = "normal"|"medium"|"semibold"|    │
 * │            "bold"                           │
 * │ color    = "default"|"muted"|"accent"|      │
 * │            "danger"|"success"|"warning"     │
 * │ truncate = boolean                          │
 * │ mono     = boolean                          │
 * └─────────────────────────────────────────────┘
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(defineProps<{
  as?: "p" | "span" | "div" | "label" | "li" | "dt" | "dd";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "accent" | "danger" | "success" | "warning";
  truncate?: boolean;
  mono?: boolean;
  class?: string;
}>(), { as: "p", size: "md", color: "default" });

const classes = computed(() => cn(
  "vyre-text",
  props.size !== "md" && `vyre-text--${props.size}`,
  props.weight && `vyre-text--${props.weight}`,
  props.color !== "default" && `vyre-text--${props.color}`,
  props.truncate && "vyre-text--truncate",
  props.mono && "vyre-text--mono",
  props.class,
));
</script>

<template>
  <component :is="as" :class="classes"><slot /></component>
</template>
