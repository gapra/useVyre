<script setup lang="ts">
/**
 * @vyre/vue — Popover
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Popover                                     │
 * │ Import:     import { Popover } from "@vyre/vue"         │
 * │                                                         │
 * │ Props:                                                  │
 * │   placement      = "bottom"(default)                    │
 * │                    "top"|"top-start"|"top-end"          │
 * │                    "bottom"|"bottom-start"|"bottom-end" │
 * │                    "left"|"left-start"|"left-end"       │
 * │                    "right"|"right-start"|"right-end"    │
 * │   closeOnOutside = boolean (default: true)              │
 * │                                                         │
 * │ Slots:                                                  │
 * │   trigger — the anchor element (required)               │
 * │   default — popover content                             │
 * │                                                         │
 * │ Model:                                                  │
 * │   v-model (boolean) — open state                        │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Popover v-model="open" placement="bottom-start">
 *   <template #trigger>
 *     <Button variant="ghost">Open</Button>
 *   </template>
 *   <p>Popover content here.</p>
 * </Popover>
 */

import { ref, watch, nextTick, onBeforeUnmount, computed, Teleport, Transition } from "vue";
import { cn } from "../../utils/cn";

type PopoverSide      = "top" | "bottom" | "left" | "right";
type PopoverAlign     = "start" | "center" | "end";
type PopoverPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    placement?: PopoverPlacement;
    closeOnOutside?: boolean;
    class?: string;
  }>(),
  { modelValue: false, placement: "bottom", closeOnOutside: true }
);

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);
const position   = ref({ top: 0, left: 0 });
const visible    = ref(props.modelValue);

const GAP = 8;

function parsePlacement(p: PopoverPlacement): { side: PopoverSide; align: PopoverAlign } {
  const [side, align] = p.split("-") as [PopoverSide, PopoverAlign | undefined];
  return { side, align: align ?? "center" };
}

function computePosition() {
  const triggerEl  = triggerRef.value;
  const popoverEl  = popoverRef.value;
  if (!triggerEl || !popoverEl) return;

  const tRect   = triggerEl.getBoundingClientRect();
  const pRect   = popoverEl.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const { side, align } = parsePlacement(props.placement);

  const tw = tRect.width;
  const th = tRect.height;
  const pw = pRect.width;
  const ph = pRect.height;
  const tx = tRect.left + scrollX;
  const ty = tRect.top  + scrollY;

  let top = 0, left = 0;

  switch (side) {
    case "top":    top  = ty - ph - GAP; break;
    case "bottom": top  = ty + th + GAP; break;
    case "left":   left = tx - pw - GAP; break;
    case "right":  left = tx + tw + GAP; break;
  }

  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":  left = tx;                    break;
      case "center": left = tx + tw / 2 - pw / 2; break;
      case "end":    left = tx + tw - pw;           break;
    }
  } else {
    switch (align) {
      case "start":  top = ty;                    break;
      case "center": top = ty + th / 2 - ph / 2; break;
      case "end":    top = ty + th - ph;           break;
    }
  }

  position.value = { top, left };
}

watch(() => props.modelValue, (val) => { visible.value = val; });
watch(visible, async (val) => {
  emit("update:modelValue", val);
  if (val) {
    await nextTick();
    computePosition();
  }
});

function toggle() { visible.value = !visible.value; }

function handleOutside(e: MouseEvent) {
  if (!props.closeOnOutside) return;
  const target = e.target as Node;
  if (popoverRef.value?.contains(target)) return;
  if (triggerRef.value?.contains(target)) return;
  visible.value = false;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") visible.value = false;
}

watch(visible, (val) => {
  if (val) {
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown",   handleKeydown);
  } else {
    document.removeEventListener("mousedown", handleOutside);
    document.removeEventListener("keydown",   handleKeydown);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutside);
  document.removeEventListener("keydown",   handleKeydown);
});

const side = computed(() => parsePlacement(props.placement).side);
const popoverClasses = computed(() =>
  cn("vyre-popover", `vyre-popover--${side.value}`, props.class)
);
</script>

<template>
  <span style="display: contents">
    <span ref="triggerRef" style="display: contents" @click="toggle">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <Transition name="vyre-popover-fade">
        <div
          v-if="visible"
          ref="popoverRef"
          role="dialog"
          aria-modal="false"
          :class="popoverClasses"
          :style="{ position: 'absolute', top: `${position.top}px`, left: `${position.left}px` }"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.vyre-popover-fade-enter-active,
.vyre-popover-fade-leave-active {
  transition: opacity var(--vyre-transition-duration-fast, 120ms) ease,
              transform var(--vyre-transition-duration-fast, 120ms) ease;
}
.vyre-popover-fade-enter-from,
.vyre-popover-fade-leave-to  { opacity: 0; transform: scale(0.95); }
.vyre-popover-fade-enter-to,
.vyre-popover-fade-leave-from { opacity: 1; transform: scale(1); }
</style>
