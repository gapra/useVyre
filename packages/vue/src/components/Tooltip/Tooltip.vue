<script setup lang="ts">
/**
 * @vyre/vue — Tooltip
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Tooltip                                     │
 * │ Import:     import { Tooltip } from "@vyre/vue"         │
 * │                                                         │
 * │ Props:                                                  │
 * │   content    = string (tooltip text)                    │
 * │   placement  = "top"(default)|"bottom"|"left"|"right"   │
 * │   delay      = number ms (default 300)                  │
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

import { ref, computed } from "vue";
import { cn } from "../../utils/cn";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

const props = withDefaults(
  defineProps<{
    content:    string;
    placement?: TooltipPlacement;
    delay?:     number;
    class?:     string;
  }>(),
  { placement: "top", delay: 300 }
);

const visible   = ref(false);
const tooltipId = `vyre-tip-${Math.random().toString(36).slice(2, 7)}`;
let showTimer: ReturnType<typeof setTimeout> | null = null;

function show() {
  if (showTimer) clearTimeout(showTimer);
  showTimer = setTimeout(() => { visible.value = true; }, props.delay);
}
function hide() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null; }
  visible.value = false;
}

const wrapperClasses  = computed(() => cn("vyre-tooltip-wrapper", props.class));
const tooltipClasses  = computed(() => cn("vyre-tooltip", `vyre-tooltip--${props.placement}`));
</script>

<template>
  <span
    :class="wrapperClasses"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="visible = true"
    @focusout="hide"
  >
    <slot />
    <Transition name="vyre-tooltip-fade">
      <span
        v-if="visible"
        :id="tooltipId"
        role="tooltip"
        :class="tooltipClasses"
        :data-placement="placement"
      >
        {{ content }}
        <span class="vyre-tooltip__arrow" aria-hidden="true" />
      </span>
    </Transition>
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
