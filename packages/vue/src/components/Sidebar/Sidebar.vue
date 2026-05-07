<script setup lang="ts">
/**
 * @vyre/vue — Sidebar
 * Must be used inside <AppLayout>. Reads collapsed state from AppLayout context.
 *
 * Props:
 *   variant = "default" | "floating"
 */

import { inject, computed } from "vue";
import { cn } from "../../utils/cn";
import { APP_LAYOUT_KEY } from "./AppLayout.vue";

const props = withDefaults(defineProps<{
  variant?: "default" | "floating";
  class?: string;
}>(), { variant: "default" });

const ctx = inject(APP_LAYOUT_KEY, { collapsed: computed(() => false), toggleCollapsed: () => {} });
</script>

<template>
  <aside
    :class="cn(
      'vyre-sidebar',
      ctx.collapsed.value && 'vyre-sidebar--collapsed',
      variant === 'floating' && 'vyre-sidebar--floating',
      props.class,
    )"
    :data-collapsed="ctx.collapsed.value || undefined"
  >
    <slot />
  </aside>
</template>
