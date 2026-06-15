<script setup lang="ts">
/**
 * @usevyre/vue — Tooltip
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Tooltip                                     │
 * │ Import:     import { Tooltip } from "@usevyre/vue"         │
 * │                                                         │
 * │ Props:                                                  │
 * │   content    = string (tooltip text)                    │
 * │   placement  = "top"(default)|"bottom"|"left"|"right"   │
 * │   delay      = number ms (default 300)                  │
 * │   disablePortal = boolean (default: false) — render the │
 * │               tooltip inline instead of teleporting it  │
 * │               to <body>. Teleport (default) keeps it     │
 * │               visible inside Modal / overflow:hidden.    │
 * │                                                         │
 * │ Slot:                                                   │
 * │   default — the trigger element (must be focusable)     │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Tooltip content="Copy to clipboard">
 *   <Button variant="ghost" size="icon" aria-label="Copy">
 *     <CopyIcon />
 *   </Button>
 * </Tooltip>
 *
 * <Tooltip content="Opens in new tab" placement="bottom">
 *   <a href="/docs">Docs</a>
 * </Tooltip>
 */

import { ref, computed, watch, nextTick, onBeforeUnmount, Teleport } from "vue";
import { cn } from "../../utils/cn";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

const GAP = 8; // matches the old CSS calc(100% + spacing-2)

const props = withDefaults(
  defineProps<{
    content:    string;
    placement?: TooltipPlacement;
    delay?:     number;
    disablePortal?: boolean;
    class?:     string;
  }>(),
  { placement: "top", delay: 300, disablePortal: false }
);

const visible    = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
const tipRef     = ref<HTMLElement | null>(null);
const position   = ref({ top: 0, left: 0 });
const tooltipId  = `vyre-tip-${Math.random().toString(36).slice(2, 7)}`;
let showTimer: ReturnType<typeof setTimeout> | null = null;

function show() {
  if (showTimer) clearTimeout(showTimer);
  showTimer = setTimeout(() => { visible.value = true; }, props.delay);
}
function hide() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null; }
  visible.value = false;
}

// Position the teleported tooltip against the trigger (the wrapper wraps it).
function computePosition() {
  const trigger = wrapperRef.value;
  const tip = tipRef.value;
  if (!trigger || !tip) return;
  const r = trigger.getBoundingClientRect();
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  const cx = r.left + r.width / 2 + window.scrollX;
  const cy = r.top + r.height / 2 + window.scrollY;
  switch (props.placement) {
    case "bottom":
      position.value = { top: r.bottom + window.scrollY + GAP, left: cx - tw / 2 };
      break;
    case "left":
      position.value = { top: cy - th / 2, left: r.left + window.scrollX - GAP - tw };
      break;
    case "right":
      position.value = { top: cy - th / 2, left: r.right + window.scrollX + GAP };
      break;
    default: // top
      position.value = { top: r.top + window.scrollY - GAP - th, left: cx - tw / 2 };
  }
}

watch(visible, async (isVisible) => {
  if (isVisible && !props.disablePortal) {
    await nextTick();
    computePosition();
    // capture:true so scrolling INSIDE a Modal body is caught, not only window.
    window.addEventListener("scroll", computePosition, true);
    window.addEventListener("resize", computePosition);
  } else {
    window.removeEventListener("scroll", computePosition, true);
    window.removeEventListener("resize", computePosition);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", computePosition, true);
  window.removeEventListener("resize", computePosition);
});

const wrapperClasses  = computed(() => cn("vyre-tooltip-wrapper", props.class));
const tooltipClasses  = computed(() =>
  cn(
    "vyre-tooltip",
    `vyre-tooltip--${props.placement}`,
    !props.disablePortal && "vyre-tooltip--portal",
  )
);
const tooltipStyle = computed(() =>
  props.disablePortal
    ? undefined
    : { position: "absolute" as const, top: `${position.value.top}px`, left: `${position.value.left}px` }
);
</script>

<template>
  <span
    ref="wrapperRef"
    :class="wrapperClasses"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="visible = true"
    @focusout="hide"
  >
    <slot />
    <Teleport to="body" :disabled="disablePortal">
      <Transition name="vyre-tooltip-fade">
        <span
          v-if="visible"
          ref="tipRef"
          :id="tooltipId"
          role="tooltip"
          :class="tooltipClasses"
          :data-placement="placement"
          :style="tooltipStyle"
        >
          {{ content }}
          <span class="vyre-tooltip__arrow" aria-hidden="true" />
        </span>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.vyre-tooltip-fade-enter-active,
.vyre-tooltip-fade-leave-active {
  transition: opacity var(--vyre-transition-duration-fast, 120ms) ease,
              transform var(--vyre-transition-duration-fast, 120ms) ease;
}
.vyre-tooltip-fade-enter-from,
.vyre-tooltip-fade-leave-to {
  opacity: 0;
  transform: var(--_tt) scale(0.92);
}
.vyre-tooltip-fade-enter-to,
.vyre-tooltip-fade-leave-from {
  opacity: 1;
  transform: var(--_tt) scale(1);
}
</style>
