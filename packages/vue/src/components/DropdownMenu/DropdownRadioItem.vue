<script setup lang="ts">
import { inject, computed } from "vue";
import { cn } from "../../utils/cn";
import { DROPDOWN_KEY } from "./DropdownMenu.vue";
import { RADIO_KEY } from "./DropdownRadioGroup.vue";

const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
    class?: string;
  }>(),
  {}
);

const ctx   = inject(DROPDOWN_KEY);
const radio = inject(RADIO_KEY);
const checked = computed(() => radio?.value === props.value);

function handleClick() {
  if (props.disabled) return;
  radio?.onValueChange(props.value);
  ctx?.close();
}
</script>

<template>
  <button
    role="menuitemradio"
    :aria-checked="checked"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    tabindex="-1"
    :class="cn('vyre-dropdown__item vyre-dropdown__item--radio', props.class)"
    @click="handleClick"
  >
    <span class="vyre-dropdown__item-indicator" aria-hidden="true">
      <svg v-if="checked" width="8" height="8" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" fill="currentColor"/>
      </svg>
    </span>
    <span class="vyre-dropdown__item-label"><slot /></span>
  </button>
</template>
