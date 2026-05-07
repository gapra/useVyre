<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(defineProps<{
  open: boolean;
  modelValue?: string;
  class?: string;
}>(), { modelValue: undefined });

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "update:modelValue", v: string): void;
}>();

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") emit("update:open", false);
}

watch(() => props.open, (v) => {
  if (v) window.addEventListener("keydown", onKey);
  else window.removeEventListener("keydown", onKey);
}, { immediate: true });

onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="vyre-command-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      @click.self="emit('update:open', false)"
    >
      <slot />
    </div>
  </Teleport>
</template>
