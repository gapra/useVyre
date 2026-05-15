<script setup lang="ts">
/**
 * @usevyre/vue — Tag
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Tag                                         │
 * │ Import:     import { Tag } from "@usevyre/vue"          │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant   = "default"(default)|"accent"|"danger"     │
 * │   size      = "sm"|"md"(default)|"lg"                   │
 * │   removable = boolean (renders × button, emits remove) │
 * │   clickable = boolean (makes the tag interactive)      │
 * │   disabled  = boolean                                   │
 * │                                                         │
 * │ Emits:                                                  │
 * │   remove — when × button clicked                        │
 * │   click  — when clickable tag activated                 │
 * │                                                         │
 * │ Standalone display tag/chip. NOT an input — for tag     │
 * │ INPUT use TagsInput. Group multiple with TagGroup.      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Tag>Design</Tag>
 * <Tag variant="accent" size="lg">Featured</Tag>
 * <Tag removable @remove="removeFilter('react')">react</Tag>
 * <Tag clickable @click="toggleFilter('vue')">vue</Tag>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type TagVariant = "default" | "accent" | "danger";
type TagSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: TagVariant;
    size?: TagSize;
    removable?: boolean;
    clickable?: boolean;
    disabled?: boolean;
    class?: string;
  }>(),
  { variant: "default", size: "md", removable: false, clickable: false, disabled: false }
);

const emit = defineEmits<{ remove: []; click: [] }>();

const isClickable = computed(() => props.clickable && !props.disabled);

const classes = computed(() =>
  cn(
    "vyre-tag",
    `vyre-tag--${props.variant}`,
    `vyre-tag--${props.size}`,
    isClickable.value && "vyre-tag--clickable",
    props.disabled && "vyre-tag--disabled",
    props.class
  )
);

function onActivate() {
  if (isClickable.value) emit("click");
}

function onKeydown(e: KeyboardEvent) {
  if (isClickable.value && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    emit("click");
  }
}

function onRemove(e: MouseEvent) {
  e.stopPropagation();
  if (!props.disabled) emit("remove");
}
</script>

<template>
  <span
    :class="classes"
    :data-variant="variant"
    :data-size="size"
    :role="isClickable ? 'button' : undefined"
    :tabindex="isClickable ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    @click="onActivate"
    @keydown="onKeydown"
  >
    <span class="vyre-tag__label"><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="vyre-tag__remove"
      aria-label="Remove"
      :disabled="disabled"
      @click="onRemove"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M9 3L3 9M3 3L9 9"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </span>
</template>
