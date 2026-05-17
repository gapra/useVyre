<script setup lang="ts">
/**
 * @usevyre/vue — ToastViewport
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  ToastViewport                               │
 * │ Import:     import { ToastViewport } from "@usevyre/vue"   │
 * │                                                         │
 * │ Place once in your app root (App.vue or layout).        │
 * │ Renders the toast stack via Teleport to <body>.         │
 * │ No props — works automatically with useToast().         │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <!-- App.vue -->
 * <template>
 *   <RouterView />
 *   <ToastViewport />
 * </template>
 */

import { onUnmounted } from "vue";
import { useToast } from "../../composables/useToast";
import type { ToastItem } from "../../composables/useToast";

const { toasts, dismiss } = useToast();

// Auto-dismiss timer management
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleToast(t: ToastItem) {
  if (t.duration === Infinity || timers.has(t.id)) return;
  timers.set(
    t.id,
    setTimeout(() => dismiss(t.id), t.duration ?? 4000)
  );
}

function cancelTimer(id: string) {
  const timer = timers.get(id);
  if (timer) { clearTimeout(timer); timers.delete(id); }
}

onUnmounted(() => timers.forEach((t) => clearTimeout(t)));
</script>

<template>
  <Teleport to="body">
    <div
      class="vyre-toast-viewport"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notifications"
    >
      <TransitionGroup name="vyre-toast-transition" tag="div" style="display: contents;">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['vyre-toast', `vyre-toast--${t.variant ?? 'default'}`]"
          role="alert"
          :data-variant="t.variant"
          @vue:mounted="() => scheduleToast(t)"
          @vue:unmounted="() => cancelTimer(t.id)"
        >
          <div class="vyre-toast__content">
            <p v-if="t.title" class="vyre-toast__title">{{ t.title }}</p>
            <p v-if="t.description" class="vyre-toast__description">{{ t.description }}</p>
          </div>
          <button
            class="vyre-toast__close"
            type="button"
            aria-label="Dismiss notification"
            @click="dismiss(t.id)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.vyre-toast-transition-enter-active {
  animation: vyre-toast-in var(--vyre-transition-duration-normal, 220ms) var(--vyre-transition-easing-spring, cubic-bezier(0.34,1.56,0.64,1));
}
.vyre-toast-transition-leave-active {
  transition: opacity var(--vyre-transition-duration-fast, 120ms) ease,
              transform var(--vyre-transition-duration-fast, 120ms) ease;
}
.vyre-toast-transition-leave-to {
  opacity: 0;
  transform: translateX(110%);
}
</style>
