<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  modelValue?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  class?: string;
}>(), { defaultValue: 0, min: 0, max: 100, step: 1, size: "md" });

const emit = defineEmits<{ "update:modelValue": [v: number] }>();

const internal = ref(props.defaultValue);
const value = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internal.value
);
const percentage = computed(() =>
  ((value.value - props.min!) / (props.max! - props.min!)) * 100
);

function onChange(e: Event) {
  const next = Number((e.target as HTMLInputElement).value);
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}
</script>

<template>
  <div
    :class="['vyre-slider', `vyre-slider--${size}`, $props.class]"
    :data-disabled="disabled || undefined"
    :style="{ '--vyre-slider-pct': `${percentage}%` }"
  >
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :disabled="disabled"
      class="vyre-slider__input"
      @input="onChange"
    />
    <div class="vyre-slider__track">
      <div class="vyre-slider__fill" :style="{ width: `${percentage}%` }" />
      <div class="vyre-slider__thumb" :style="{ left: `${percentage}%` }" />
    </div>
  </div>
</template>
