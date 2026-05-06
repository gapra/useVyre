<script setup lang="ts">
import { ref, computed } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{ class?: string; ariaLabel?: string }>();
const listRef = ref<HTMLDivElement | null>(null);
const classes = computed(() => cn("vyre-tabs__list", props.class));

function onKeydown(e: KeyboardEvent) {
  const tabs = Array.from(
    listRef.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []
  );
  const idx = tabs.findIndex((t) => t === document.activeElement);
  if (idx < 0) return;

  let next = idx;
  if (e.key === "ArrowRight")     next = (idx + 1) % tabs.length;
  else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
  else if (e.key === "Home")      next = 0;
  else if (e.key === "End")       next = tabs.length - 1;
  else return;

  e.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}
</script>

<template>
  <div
    ref="listRef"
    role="tablist"
    :class="classes"
    :aria-label="ariaLabel"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
