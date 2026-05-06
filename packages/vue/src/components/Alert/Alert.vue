<script setup lang="ts">
/**
 * @vyre/vue — Alert
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Alert                                       │
 * │ Import:     import { Alert } from "@vyre/vue"           │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant = "info"(default)|"success"|"warning"|"danger"│
 * │   title   = string (optional)                           │
 * │                                                         │
 * │ Slots:                                                  │
 * │   icon    — override default icon                       │
 * │   default — alert body text/content                     │
 * │                                                         │
 * │ Events:                                                 │
 * │   @close  — emitted when dismiss button clicked         │
 * │             (button only appears when listener exists)  │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Alert variant="warning" title="Heads up">
 *   This action may affect other users.
 * </Alert>
 *
 * <Alert variant="success" title="Saved!" @close="visible = false">
 *   Your changes were saved.
 * </Alert>
 */

import { computed, useAttrs } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    variant?: "info" | "success" | "warning" | "danger";
    title?: string;
    class?: string;
  }>(),
  { variant: "info" }
);

const emit = defineEmits<{ (e: "close"): void }>();
const attrs = useAttrs();
const hasCloseListener = computed(() => "onClose" in attrs);
</script>

<template>
  <div
    role="alert"
    :class="cn('vyre-alert', `vyre-alert--${variant}`, props.class)"
  >
    <span class="vyre-alert__icon" aria-hidden="true">
      <slot name="icon">
        <!-- info -->
        <svg v-if="variant === 'info'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/>
          <path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <!-- success -->
        <svg v-else-if="variant === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/>
          <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- warning -->
        <svg v-else-if="variant === 'warning'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M8 6v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <!-- danger -->
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/>
          <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </slot>
    </span>
    <div class="vyre-alert__body">
      <p v-if="title" class="vyre-alert__title">{{ title }}</p>
      <div v-if="$slots.default" class="vyre-alert__description">
        <slot />
      </div>
    </div>
    <button
      v-if="hasCloseListener"
      type="button"
      class="vyre-alert__close"
      aria-label="Dismiss"
      @click="emit('close')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>
