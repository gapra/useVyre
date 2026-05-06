<script setup lang="ts">
/**
 * @vyre/vue — Modal / Dialog
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Modal + ModalHeader + ModalBody + ModalFooter│
 * │ Import:     import { Modal, ModalHeader, ModalBody,     │
 * │             ModalFooter } from "@vyre/vue"              │
 * │                                                         │
 * │ Props:                                                  │
 * │   open             = boolean (required, v-model:open)   │
 * │   size             = "sm"|"md"(default)|"lg"|"full"     │
 * │   closeOnBackdrop  = boolean (default: true)            │
 * │   closeOnEsc       = boolean (default: true)            │
 * │                                                         │
 * │ Emits:                                                  │
 * │   close — when user dismisses the modal                 │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Modal :open="isOpen" @close="isOpen = false" size="md">
 *   <ModalHeader><h2>Confirm deletion</h2></ModalHeader>
 *   <ModalBody><p>This action cannot be undone.</p></ModalBody>
 *   <ModalFooter>
 *     <Button variant="ghost" @click="isOpen = false">Cancel</Button>
 *     <Button variant="danger" @click="handleDelete">Delete</Button>
 *   </ModalFooter>
 * </Modal>
 */

import { watch, onUnmounted, nextTick } from "vue";
import { cn } from "../../utils/cn";

type ModalSize = "sm" | "md" | "lg" | "full";

const props = withDefaults(
  defineProps<{
    open:              boolean;
    size?:             ModalSize;
    closeOnBackdrop?:  boolean;
    closeOnEsc?:       boolean;
    class?:            string;
    ariaLabel?:        string;
    ariaLabelledby?:   string;
  }>(),
  { size: "md", closeOnBackdrop: true, closeOnEsc: true }
);

const emit = defineEmits<{ close: [] }>();

const FOCUSABLE = [
  "a[href]", "button:not([disabled])", "textarea:not([disabled])",
  "input:not([disabled])", "select:not([disabled])", '[tabindex]:not([tabindex="-1"])',
].join(",");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let containerEl: any = null;
let prevOverflow = "";

function handleEsc(e: KeyboardEvent) {
  if (e.key === "Escape" && props.closeOnEsc) emit("close");
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== "Tab" || !containerEl) return;
  const el = containerEl as HTMLElement;
  const focusable: HTMLElement[] = Array.from(el.querySelectorAll(FOCUSABLE));
  if (!focusable.length) return;
  const first = focusable[0] as HTMLElement;
  const last  = focusable[focusable.length - 1] as HTMLElement;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);
    document.addEventListener("keydown", trapFocus);
    await nextTick();
    containerEl?.focus();
  } else {
    document.body.style.overflow = prevOverflow;
    document.removeEventListener("keydown", handleEsc);
    document.removeEventListener("keydown", trapFocus);
  }
}, { immediate: true });

onUnmounted(() => {
  document.body.style.overflow = prevOverflow;
  document.removeEventListener("keydown", handleEsc);
  document.removeEventListener("keydown", trapFocus);
});

function onBackdropClick(e: MouseEvent) {
  if (props.closeOnBackdrop && e.target === e.currentTarget) emit("close");
}

const modalClasses = (extra?: string) =>
  cn("vyre-modal", `vyre-modal--${props.size}`, extra, props.class);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="vyre-modal-backdrop" role="presentation" @click="onBackdropClick">
      <div
        :ref="(el) => { containerEl = el }"
        :class="modalClasses()"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        tabindex="-1"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
