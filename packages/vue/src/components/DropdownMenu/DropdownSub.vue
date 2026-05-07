<script setup lang="ts">
import { ref, Teleport } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    trigger: string;
    placement?: "right" | "left";
    disabled?: boolean;
    class?: string;
  }>(),
  { placement: "right" }
);

const itemRef = ref<HTMLButtonElement | null>(null);
const subRef  = ref<HTMLDivElement | null>(null);
const open    = ref(false);
const position = ref({ top: 0, left: 0 });
const GAP = 2;

function openSub() {
  if (!itemRef.value) return;
  const rect    = itemRef.value.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  position.value = {
    top:  rect.top  + scrollY,
    left: props.placement === "right"
      ? rect.right + scrollX + GAP
      : rect.left  + scrollX - GAP,
  };
  open.value = true;
}

function closeSub() {
  open.value = false;
}

function onItemMouseLeave(e: MouseEvent) {
  const related = e.relatedTarget as Node | null;
  if (subRef.value?.contains(related)) return;
  closeSub();
}

function onSubMouseLeave(e: MouseEvent) {
  const related = e.relatedTarget as Node | null;
  if (itemRef.value?.contains(related)) return;
  closeSub();
}
</script>

<template>
  <button
    ref="itemRef"
    role="menuitem"
    aria-haspopup="menu"
    :aria-expanded="open"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    tabindex="-1"
    :class="cn('vyre-dropdown__item vyre-dropdown__item--sub', props.class)"
    @mouseenter="openSub"
    @mouseleave="onItemMouseLeave"
    @focus="openSub"
  >
    <span class="vyre-dropdown__item-label">{{ trigger }}</span>
    <span class="vyre-dropdown__item-chevron" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          :d="placement === 'right' ? 'M4 2l4 4-4 4' : 'M8 2L4 6l4 4'"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </button>

  <Teleport to="body">
    <div
      v-if="open"
      ref="subRef"
      role="menu"
      :class="cn('vyre-dropdown vyre-dropdown--sub', placement === 'left' && 'vyre-dropdown--sub-left')"
      :style="{
        position: 'absolute',
        top: `${position.top}px`,
        left: placement === 'right' ? `${position.left}px` : undefined,
        transform: placement === 'left' ? `translateX(calc(-100% - ${position.left}px + ${position.left}px))` : undefined,
      }"
      @mouseleave="onSubMouseLeave"
    >
      <slot />
    </div>
  </Teleport>
</template>
