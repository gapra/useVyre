<script setup lang="ts">
/**
 * @vyre/vue — Button
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Button                                      │
 * │ Import:     import { Button } from "@vyre/vue"          │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant  = "primary"|"secondary"|"ghost"|             │
 * │              "accent"|"teal"|"danger"                   │
 * │   size     = "sm"|"md"(default)|"lg"|"icon"             │
 * │   disabled = boolean                                    │
 * │   loading  = boolean (shows spinner, disables click)    │
 * │   as       = string (default: "button")                 │
 * │                                                         │
 * │ Slots:                                                  │
 * │   default    — button label                             │
 * │   left-icon  — icon before label                        │
 * │   right-icon — icon after label                         │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Button variant="accent" size="lg">Get Started</Button>
 * <Button variant="danger" @click="handleDelete">Delete</Button>
 * <Button variant="ghost" size="icon" as="a" href="/docs">
 *   <template #left-icon><SearchIcon /></template>
 *   Docs
 * </Button>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "teal" | "danger";
type Size    = "sm" | "md" | "lg" | "icon";

const props = withDefaults(
  defineProps<{
    variant?:  Variant;
    size?:     Size;
    loading?:  boolean;
    disabled?: boolean;
    as?:       string;
    class?:    string;
  }>(),
  { variant: "secondary", size: "md", loading: false, disabled: false, as: "button" }
);

const isDisabled = computed(() => props.disabled || props.loading);

const classes = computed(() =>
  cn(
    "vyre-btn",
    `vyre-btn--${props.variant}`,
    `vyre-btn--${props.size}`,
    props.loading && "vyre-btn--loading",
    props.class
  )
);
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :disabled="as === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled"
    :data-variant="variant"
    :data-size="size"
  >
    <span v-if="loading" class="vyre-btn__spinner" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="vyre-spinner" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-dasharray="28" stroke-dashoffset="10" />
      </svg>
    </span>
    <span v-if="!loading && $slots['left-icon']" class="vyre-btn__icon vyre-btn__icon--left" aria-hidden="true">
      <slot name="left-icon" />
    </span>
    <span v-if="$slots.default" class="vyre-btn__label">
      <slot />
    </span>
    <span v-if="$slots['right-icon']" class="vyre-btn__icon vyre-btn__icon--right" aria-hidden="true">
      <slot name="right-icon" />
    </span>
  </component>
</template>
