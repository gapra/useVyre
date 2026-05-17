<script setup lang="ts">
/**
 * @usevyre/vue — Sheet
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Sheet + SheetHeader + SheetBody + SheetFooter│
 * │ Import:     import { Sheet, SheetHeader, SheetBody,     │
 * │             SheetFooter } from "@usevyre/vue"              │
 * │                                                         │
 * │ Props:                                                  │
 * │   modelValue      = boolean (v-model)                   │
 * │   side            = "right"(default)|"left"|"top"|"bottom"│
 * │   size            = "sm"|"md"(default)|"lg"|"full"      │
 * │   closeOnBackdrop = boolean (default: true)             │
 * │   closeOnEsc      = boolean (default: true)             │
 * │                                                         │
 * │ Events:                                                 │
 * │   @update:modelValue — close handler                    │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Sheet v-model="open" side="right">
 *   <SheetHeader><h2>Settings</h2></SheetHeader>
 *   <SheetBody><p>Content here.</p></SheetBody>
 *   <SheetFooter>
 *     <Button variant="ghost" @click="open = false">Cancel</Button>
 *     <Button variant="accent" @click="handleSave">Save</Button>
 *   </SheetFooter>
 * </Sheet>
 */

import { watch, onBeforeUnmount, Teleport } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    side?: "top" | "right" | "bottom" | "left";
    size?: "sm" | "md" | "lg" | "full";
    closeOnBackdrop?: boolean;
    closeOnEsc?: boolean;
    class?: string;
  }>(),
  { side: "right", size: "md", closeOnBackdrop: true, closeOnEsc: true }
);

const emit = defineEmits<{ (e: "update:modelValue", val: boolean): void }>();

function close() { emit("update:modelValue", false); }

function handleEsc(e: KeyboardEvent) { if (e.key === "Escape" && props.closeOnEsc) close(); }

let prevOverflow = "";

watch(() => props.modelValue, (val) => {
  if (val) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (props.closeOnEsc) document.addEventListener("keydown", handleEsc);
  } else {
    document.body.style.overflow = prevOverflow;
    document.removeEventListener("keydown", handleEsc);
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = prevOverflow;
  document.removeEventListener("keydown", handleEsc);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="vyre-sheet-backdrop"
      role="presentation"
      @click.self="closeOnBackdrop && close()"
    >
      <div
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :class="cn('vyre-sheet', `vyre-sheet--${side}`, `vyre-sheet--${size}`, props.class)"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
