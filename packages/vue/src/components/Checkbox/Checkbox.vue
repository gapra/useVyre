<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  id?: string;
  class?: string;
}>(), { size: "md" });

const emit = defineEmits<{ "update:modelValue": [v: boolean] }>();

const inputRef = ref<HTMLInputElement | null>(null);

watch(() => props.indeterminate, (val) => {
  if (inputRef.value) inputRef.value.indeterminate = !!val;
}, { immediate: true });
</script>

<template>
  <span
    :class="['vyre-checkbox', `vyre-checkbox--${size}`, $props.class]"
    :data-disabled="disabled || undefined"
    :data-checked="modelValue || undefined"
    :data-indeterminate="indeterminate || undefined"
  >
    <input
      ref="inputRef"
      type="checkbox"
      :id="id"
      :checked="modelValue"
      :defaultChecked="defaultChecked"
      :disabled="disabled"
      class="vyre-checkbox__input"
      @change="(e) => emit('update:modelValue', (e.target as HTMLInputElement).checked)"
    />
    <span class="vyre-checkbox__box" aria-hidden="true">
      <svg v-if="indeterminate" width="10" height="2" viewBox="0 0 10 2" fill="none">
        <path d="M1 1h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg v-else width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l3 3 5-6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </span>
</template>
