<script setup lang="ts">
import { inject } from "vue";
import { cn } from "../../utils/cn";
import { DROPDOWN_KEY } from "./DropdownMenu.vue";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    variant?: "default" | "danger";
    shortcut?: string;
    class?: string;
  }>(),
  { variant: "default" }
);

const emit = defineEmits<{ (e: "select"): void }>();
const ctx  = inject(DROPDOWN_KEY);

function handleClick() {
  if (props.disabled) return;
  emit("select");
  ctx?.close();
}
</script>

<template>
  <button
    role="menuitem"
    :class="cn('vyre-dropdown__item', variant === 'danger' && 'vyre-dropdown__item--danger', props.class)"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    tabindex="-1"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="vyre-dropdown__item-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="vyre-dropdown__item-label"><slot /></span>
    <kbd v-if="shortcut" class="vyre-dropdown__item-shortcut">{{ shortcut }}</kbd>
  </button>
</template>
