<script setup lang="ts">
import { inject } from "vue";
import { cn } from "../../utils/cn";
import { APP_LAYOUT_KEY } from "./context";

const props = defineProps<{ class?: string }>();
const ctx = inject(APP_LAYOUT_KEY, { collapsed: { value: false }, toggleCollapsed: () => {} });
</script>

<template>
  <button
    type="button"
    :class="cn('vyre-sidebar-trigger', props.class)"
    :aria-label="ctx.collapsed.value ? 'Expand sidebar' : 'Collapse sidebar'"
    :aria-expanded="!ctx.collapsed.value"
    @click="ctx.toggleCollapsed()"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor"/>
      <rect x="2" y="7.25" width="8" height="1.5" rx="0.75" fill="currentColor"/>
      <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
    </svg>
  </button>
</template>
