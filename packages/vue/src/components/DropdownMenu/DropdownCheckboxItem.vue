<script setup lang="ts">
import { inject } from "vue";
import { cn } from "../../utils/cn";
import { DROPDOWN_KEY } from "./context";

const props = withDefaults(
  defineProps<{
    checked: boolean;
    disabled?: boolean;
    shortcut?: string;
    class?: string;
  }>(),
  {}
);

const emit = defineEmits<{ (e: "update:checked", val: boolean): void }>();
const ctx  = inject(DROPDOWN_KEY);

function handleClick() {
  if (props.disabled) return;
  emit("update:checked", !props.checked);
  ctx?.close();
}
</script>

<template>
  <button
    role="menuitemcheckbox"
    :aria-checked="checked"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    tabindex="-1"
    :class="cn('vyre-dropdown__item vyre-dropdown__item--checkbox', props.class)"
    @click="handleClick"
  >
    <span class="vyre-dropdown__item-indicator" aria-hidden="true">
      <svg v-if="checked" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="vyre-dropdown__item-label"><slot /></span>
    <kbd v-if="shortcut" class="vyre-dropdown__item-shortcut">{{ shortcut }}</kbd>
  </button>
</template>
