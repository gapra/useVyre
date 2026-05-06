<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { ACCORDION_KEY } from "./keys";

// ── Accordion ─────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  modelValue?: string | string[];
  class?: string;
}>(), { type: "single" });

const emit = defineEmits<{ "update:modelValue": [value: string | string[]] }>();

const toArr = (v?: string | string[]) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

const internal = ref<string[]>(toArr(props.defaultValue));
const value = computed(() =>
  props.modelValue !== undefined ? toArr(props.modelValue) : internal.value
);

function toggle(itemValue: string) {
  let next: string[];
  if (props.type === "single") {
    next = value.value.includes(itemValue) ? [] : [itemValue];
  } else {
    next = value.value.includes(itemValue)
      ? value.value.filter((v) => v !== itemValue)
      : [...value.value, itemValue];
  }
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", props.type === "single" ? (next[0] ?? "") : next);
}

provide(ACCORDION_KEY, {
  isOpen: (v: string) => value.value.includes(v),
  toggle,
});
</script>

<template>
  <div :class="['vyre-accordion', $props.class]">
    <slot />
  </div>
</template>
