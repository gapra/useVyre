<script setup lang="ts">
import { provide } from "vue";
import type { InjectionKey } from "vue";

export interface RadioCtx { value: string; onValueChange: (v: string) => void; }
export const RADIO_KEY: InjectionKey<RadioCtx> = Symbol("vyre-dropdown-radio");

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
