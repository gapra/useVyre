<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { TABS_KEY } from "./tabs-key";

const props = withDefaults(
  defineProps<{ value: string; disabled?: boolean; class?: string }>(),
  { disabled: false }
);

const ctx        = inject(TABS_KEY);
const isSelected = computed(() => ctx?.activeValue.value === props.value);

const classes = computed(() =>
  cn("vyre-tabs__tab", isSelected.value && "vyre-tabs__tab--active", props.class)
);

function onClick() {
  if (!props.disabled) ctx?.onChange(props.value);
}
</script>

<template>
  <button
    type="button"
    role="tab"
    :class="classes"
    :aria-selected="isSelected"
    :data-selected="isSelected"
    :disabled="disabled"
    :tabindex="isSelected ? 0 : -1"
    @click="onClick"
  >
    <slot />
  </button>
</template>
