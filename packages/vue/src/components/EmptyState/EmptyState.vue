<!--
  @usevyre/vue — EmptyState

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  EmptyState                                            │
  │ Import:     import { EmptyState } from "@usevyre/vue"              │
  │                                                                   │
  │ Presentational placeholder for empty lists/tables/search. No      │
  │ state. The optional call-to-action goes in the default slot.      │
  │                                                                   │
  │   title       = string (required)                                 │
  │   description  = string                                           │
  │   variant      = "default"(box) | "search" | "error"              │
  │   size         = "sm" | "md"(default) | "lg"                      │
  │   #icon slot   = custom icon (overrides the variant preset)       │
  │   default slot = the CTA                                          │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    variant?: "default" | "search" | "error";
    size?: "sm" | "md" | "lg";
    class?: string;
  }>(),
  { variant: "default", size: "md" }
);

const classes = computed(() =>
  cn("vyre-empty-state", `vyre-empty-state--${props.size}`, props.class)
);
</script>

<template>
  <div role="status" :data-variant="variant" :class="classes">
    <span class="vyre-empty-state__icon" aria-hidden="true">
      <slot name="icon">
        <svg
          v-if="variant === 'default'"
          width="40" height="40" viewBox="0 0 40 40" fill="none"
        >
          <path
            d="M6 13l14-7 14 7v14l-14 7-14-7V13Z"
            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
          />
          <path
            d="M6 13l14 7 14-7M20 20v14"
            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="variant === 'search'"
          width="40" height="40" viewBox="0 0 40 40" fill="none"
        >
          <circle cx="18" cy="18" r="11" stroke="currentColor" stroke-width="2" />
          <path d="M26 26l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <svg
          v-else
          width="40" height="40" viewBox="0 0 40 40" fill="none"
        >
          <path
            d="M20 5L37 34H3L20 5Z"
            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
          />
          <path
            d="M20 16v9M20 29v.5"
            stroke="currentColor" stroke-width="2.4" stroke-linecap="round"
          />
        </svg>
      </slot>
    </span>
    <span class="vyre-empty-state__title">{{ title }}</span>
    <span v-if="description" class="vyre-empty-state__description">
      {{ description }}
    </span>
    <div v-if="$slots.default" class="vyre-empty-state__action">
      <slot />
    </div>
  </div>
</template>
