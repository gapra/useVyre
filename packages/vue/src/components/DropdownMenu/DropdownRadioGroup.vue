<script setup lang="ts">
import { provide } from "vue";
import { RADIO_KEY } from "./radio-context";

const props = defineProps<{ modelValue: string }>();
const emit  = defineEmits<{ (e: "update:modelValue", val: string): void }>();

provide(RADIO_KEY, {
  get value() { return props.modelValue; },
  onValueChange: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <div role="group"><slot /></div>
</template>
