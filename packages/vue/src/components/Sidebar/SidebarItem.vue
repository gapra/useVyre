<script setup lang="ts">
import { inject, computed } from "vue";
import { cn } from "../../utils/cn";
import { APP_LAYOUT_KEY } from "./AppLayout.vue";

const props = withDefaults(defineProps<{
  active?: boolean;
  badge?: string | number;
  href?: string;
  class?: string;
}>(), { active: false });

const emit = defineEmits<{ (e: "click"): void }>();

const ctx = inject(APP_LAYOUT_KEY, { collapsed: computed(() => false), toggleCollapsed: () => {} });
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="cn('vyre-sidebar__item', active && 'vyre-sidebar__item--active', props.class)"
    :aria-current="active ? 'page' : undefined"
    :title="ctx.collapsed.value ? $slots.default?.()[0]?.children?.toString() : undefined"
  >
    <span v-if="$slots.icon" class="vyre-sidebar__item-icon"><slot name="icon" /></span>
    <span class="vyre-sidebar__item-label"><slot /></span>
    <span v-if="badge !== undefined" class="vyre-sidebar__item-badge">{{ badge }}</span>
  </a>
  <button
    v-else
    type="button"
    :class="cn('vyre-sidebar__item', active && 'vyre-sidebar__item--active', props.class)"
    :aria-pressed="active"
    :title="ctx.collapsed.value ? $slots.default?.()[0]?.children?.toString() : undefined"
    @click="emit('click')"
  >
    <span v-if="$slots.icon" class="vyre-sidebar__item-icon"><slot name="icon" /></span>
    <span class="vyre-sidebar__item-label"><slot /></span>
    <span v-if="badge !== undefined" class="vyre-sidebar__item-badge">{{ badge }}</span>
  </button>
</template>
