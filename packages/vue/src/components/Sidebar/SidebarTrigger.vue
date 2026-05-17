<script setup lang="ts">
/**
 * @usevyre/vue — SidebarTrigger
 *
 * Collapse toggle button. Icon is customizable per state via slots
 * (mirrors React's icon / collapsedIcon props):
 *   - #icon           — shown when expanded (default: built-in menu icon)
 *   - #collapsed-icon  — shown when collapsed (falls back to #icon)
 */
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { APP_LAYOUT_KEY } from "./context";

const props = defineProps<{ class?: string }>();

const ctx = inject(APP_LAYOUT_KEY, {
  collapsed: { value: false },
  toggleCollapsed: () => {},
});

const isCollapsed = computed(() => ctx.collapsed.value);
</script>

<template>
  <button
    type="button"
    :class="cn('vyre-sidebar-trigger', props.class)"
    :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    :aria-expanded="!isCollapsed"
    @click="ctx.toggleCollapsed()"
  >
    <!-- Collapsed: #collapsed-icon → #icon → built-in -->
    <template v-if="isCollapsed">
      <slot name="collapsed-icon">
        <slot name="icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="7.25" width="8" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </slot>
      </slot>
    </template>
    <!-- Expanded: #icon → built-in -->
    <template v-else>
      <slot name="icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="7.25" width="8" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      </slot>
    </template>
  </button>
</template>
