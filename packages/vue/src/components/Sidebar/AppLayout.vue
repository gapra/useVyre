<script setup lang="ts">
/**
 * @vyre/vue — AppLayout
 * Root layout provider. Manages collapsed state for the whole app shell.
 *
 * Props:
 *   defaultCollapsed = boolean
 *   collapsed = boolean (v-model:collapsed for controlled mode)
 *
 * Provides: { collapsed, toggleCollapsed } via APP_LAYOUT_KEY
 */

import { provide, ref, computed } from "vue";
import { cn } from "../../utils/cn";
import { APP_LAYOUT_KEY } from "./context";

const props = withDefaults(defineProps<{
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  class?: string;
}>(), { defaultCollapsed: false });

const emit = defineEmits<{ (e: "update:collapsed", v: boolean): void }>();

const internalCollapsed = ref(props.defaultCollapsed);
const isCollapsed = computed(() =>
  props.collapsed !== undefined ? props.collapsed : internalCollapsed.value
);

function toggleCollapsed() {
  const next = !isCollapsed.value;
  internalCollapsed.value = next;
  emit("update:collapsed", next);
}

provide(APP_LAYOUT_KEY, { collapsed: isCollapsed, toggleCollapsed });
</script>

<template>
  <div :class="cn('vyre-app-layout', props.class)">
    <slot />
  </div>
</template>
