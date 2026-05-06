<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  class?: string;
}>(), { defaultChecked: false, size: "md" });

const emit = defineEmits<{ "update:modelValue": [v: boolean] }>();

const internal = ref(props.defaultChecked);
const isChecked = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internal.value
);

function toggle() {
  if (props.disabled) return;
  const next = !isChecked.value;
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :disabled="disabled"
    :data-checked="isChecked || undefined"
    :data-size="size"
    :class="['vyre-switch', $props.class]"
    @click="toggle"
  >
    <span class="vyre-switch__thumb" />
  </button>
</template>
