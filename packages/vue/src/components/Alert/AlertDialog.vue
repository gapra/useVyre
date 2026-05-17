<script setup lang="ts">
/**
 * @usevyre/vue — AlertDialog
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  AlertDialog                                 │
 * │ Import:     import { AlertDialog } from "@usevyre/vue"     │
 * │                                                         │
 * │ Props:                                                  │
 * │   modelValue  = boolean (v-model, controlled open)      │
 * │   title       = string                                  │
 * │   description = string (optional)                       │
 * │   variant     = "danger"(default)|"warning"|"info"      │
 * │   confirmLabel = string (default "Confirm")             │
 * │   cancelLabel  = string (default "Cancel")              │
 * │                                                         │
 * │ Events:                                                 │
 * │   @update:modelValue — close handler                    │
 * │   @confirm           — fired on confirm click           │
 * │   @cancel            — fired on cancel/Escape/backdrop  │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <AlertDialog
 *   v-model="open"
 *   title="Delete workspace?"
 *   description="This action cannot be undone."
 *   variant="danger"
 *   confirm-label="Delete"
 *   @confirm="handleDelete"
 * />
 */

import { ref, watch, onBeforeUnmount, Teleport } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    description?: string;
    variant?: "danger" | "warning" | "info";
    confirmLabel?: string;
    cancelLabel?: string;
    class?: string;
  }>(),
  { variant: "danger", confirmLabel: "Confirm", cancelLabel: "Cancel" }
);

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const cancelRef = ref<HTMLButtonElement | null>(null);

function handleCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}

function handleConfirm() {
  emit("confirm");
  emit("update:modelValue", false);
}

const FOCUSABLE = "button:not([disabled]), [tabindex]:not([tabindex='-1'])";

function trapFocus(e: KeyboardEvent) {
  if (e.key !== "Tab") return;
  const dialog = document.querySelector<HTMLElement>(".vyre-alert-dialog");
  if (!dialog) return;
  const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === "Escape") handleCancel();
}

let prevOverflow = "";

watch(() => props.modelValue, (val) => {
  if (val) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", trapFocus);
    document.addEventListener("keydown", handleEsc);
    setTimeout(() => cancelRef.value?.focus(), 0);
  } else {
    document.body.style.overflow = prevOverflow;
    document.removeEventListener("keydown", trapFocus);
    document.removeEventListener("keydown", handleEsc);
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = prevOverflow;
  document.removeEventListener("keydown", trapFocus);
  document.removeEventListener("keydown", handleEsc);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="vyre-alert-dialog-backdrop"
      role="presentation"
      @click.self="handleCancel"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="vyre-ad-title"
        :aria-describedby="description ? 'vyre-ad-desc' : undefined"
        :class="cn('vyre-alert-dialog', `vyre-alert-dialog--${variant}`, props.class)"
        tabindex="-1"
      >
        <div class="vyre-alert-dialog__icon-wrap">
          <span :class="`vyre-alert-dialog__icon vyre-alert-dialog__icon--${variant}`">
            <!-- danger -->
            <svg v-if="variant === 'danger'" width="20" height="20" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/>
              <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <!-- warning -->
            <svg v-else-if="variant === 'warning'" width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
              <path d="M8 6v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <!-- info -->
            <svg v-else width="20" height="20" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/>
              <path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
        </div>
        <div class="vyre-alert-dialog__body">
          <h2 id="vyre-ad-title" class="vyre-alert-dialog__title">{{ title }}</h2>
          <p v-if="description" id="vyre-ad-desc" class="vyre-alert-dialog__description">{{ description }}</p>
        </div>
        <div class="vyre-alert-dialog__footer">
          <button
            ref="cancelRef"
            type="button"
            class="vyre-btn vyre-btn--ghost vyre-btn--sm"
            @click="handleCancel"
          >{{ cancelLabel }}</button>
          <button
            type="button"
            :class="cn(
              'vyre-btn vyre-btn--sm',
              variant === 'danger'  && 'vyre-btn--danger',
              variant === 'warning' && 'vyre-btn--primary',
              variant === 'info'    && 'vyre-btn--accent',
            )"
            @click="handleConfirm"
          >{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
