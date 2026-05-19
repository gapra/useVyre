<!--
  @usevyre/vue — ToggleItem (use inside <ToggleGroup>)

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │   value    = string (required)                                   │
  │   disabled = boolean                                              │
  │ Reads selection from the parent ToggleGroup via inject.           │
  │ Keyboard: Arrow keys move focus between items.                    │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { toggleGroupKey } from "./context";

const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
    class?: string;
  }>(),
  { disabled: false }
);

const ctx = inject(toggleGroupKey);
if (!ctx) {
  throw new Error("ToggleItem must be used inside a <ToggleGroup>");
}

const selected = computed(() => ctx!.isSelected(props.value));
const isDisabled = computed(() => props.disabled || ctx!.groupDisabled);

function onKeydown(e: KeyboardEvent) {
  const el = e.currentTarget as HTMLElement;
  const items = Array.from(
    el.parentElement?.querySelectorAll<HTMLButtonElement>(
      ".vyre-toggle-item:not(:disabled)"
    ) ?? []
  );
  const i = items.indexOf(el as HTMLButtonElement);
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    items[(i + 1) % items.length]?.focus();
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    items[(i - 1 + items.length) % items.length]?.focus();
  }
}

const classes = computed(() =>
  cn(
    "vyre-toggle-item",
    selected.value && "vyre-toggle-item--selected",
    props.class
  )
);
</script>

<template>
  <button
    type="button"
    :aria-pressed="selected"
    :data-state="selected ? 'on' : 'off'"
    :disabled="isDisabled"
    :class="classes"
    @click="ctx!.toggle(value)"
    @keydown="onKeydown"
  >
    <slot />
  </button>
</template>
