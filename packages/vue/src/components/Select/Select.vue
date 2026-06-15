<script setup lang="ts">
/**
 * @usevyre/vue — Select
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Select                                      │
 * │ Import:     import { Select } from "@usevyre/vue"          │
 * │                                                         │
 * │ Props:                                                  │
 * │   options      = { value: string; label: string;        │
 * │                    disabled?: boolean }[]               │
 * │   modelValue   = string (v-model)                       │
 * │   placeholder  = string                                 │
 * │   disabled     = boolean                                │
 * │   size         = "sm"|"md"(default)|"lg"                │
 * │   disablePortal = boolean (default: false) — render the │
 * │                  dropdown inline instead of teleporting  │
 * │                  it to <body>. Teleport (default) keeps  │
 * │                  the dropdown visible inside Modal /      │
 * │                  overflow:hidden containers.             │
 * │                                                         │
 * │ Emits:                                                  │
 * │   update:modelValue — new selected value                │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Select
 *   v-model="framework"
 *   :options="[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue',   label: 'Vue'   },
 *   ]"
 *   placeholder="Select framework"
 * />
 *
 * <Field label="Framework">
 *   <Select v-model="val" :options="options" />
 * </Field>
 */

import { ref, computed, watch, nextTick, onBeforeUnmount, Teleport } from "vue";
import { cn } from "../../utils/cn";
import type { SelectOption } from "./types";

const GAP = 4;

type SelectSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    options:      SelectOption[];
    modelValue?:  string;
    placeholder?: string;
    disabled?:    boolean;
    size?:        SelectSize;
    disablePortal?: boolean;
    class?:       string;
  }>(),
  {
    placeholder: "Select an option",
    disabled: false,
    size: "md",
    modelValue: "",
    disablePortal: false,
  }
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const open             = ref(false);
const highlightedIndex = ref(-1);
const listboxRef       = ref<HTMLUListElement | null>(null);
const wrapperRef       = ref<HTMLDivElement | null>(null);
const triggerRef       = ref<HTMLButtonElement | null>(null);
const position         = ref({ top: 0, left: 0, width: 0, flip: false });

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
);

function closeDropdown() {
  open.value = false;
  highlightedIndex.value = -1;
}

function selectOption(option: SelectOption) {
  if (option.disabled) return;
  emit("update:modelValue", option.value);
  closeDropdown();
}

function openDropdown() {
  if (props.disabled) return;
  open.value = true;
  const idx = props.options.findIndex((o) => o.value === props.modelValue);
  highlightedIndex.value = idx >= 0 ? idx : 0;
}

// Close on outside click. The dropdown may be teleported to <body>, so a click
// inside it is NOT a descendant of the wrapper — check both.
function onDocClick(e: MouseEvent) {
  const target = e.target as Node;
  if (wrapperRef.value?.contains(target)) return;
  if (listboxRef.value?.contains(target)) return;
  closeDropdown();
}

// Position the teleported dropdown against the trigger rect.
function computePosition() {
  const trigger = triggerRef.value;
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  const dropdownHeight = listboxRef.value?.offsetHeight ?? 0;
  const spaceBelow = window.innerHeight - rect.bottom;
  const flip = dropdownHeight > 0 && spaceBelow < dropdownHeight + GAP;
  position.value = {
    top: flip
      ? rect.top + window.scrollY - GAP - dropdownHeight
      : rect.bottom + window.scrollY + GAP,
    left: rect.left + window.scrollX,
    width: rect.width,
    flip,
  };
}

watch(open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener("mousedown", onDocClick);
    if (!props.disablePortal) {
      await nextTick();
      computePosition();
      // capture:true so scrolling INSIDE a Modal body is caught, not only window.
      window.addEventListener("scroll", computePosition, true);
      window.addEventListener("resize", computePosition);
    }
  } else {
    document.removeEventListener("mousedown", onDocClick);
    window.removeEventListener("scroll", computePosition, true);
    window.removeEventListener("resize", computePosition);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocClick);
  window.removeEventListener("scroll", computePosition, true);
  window.removeEventListener("resize", computePosition);
});

// Scroll highlighted item into view WITHIN the listbox only. We adjust the
// listbox's own scrollTop instead of element.scrollIntoView(), because once the
// dropdown is teleported to <body> scrollIntoView scrolls the whole page.
watch(highlightedIndex, async (idx) => {
  if (!open.value || idx < 0) return;
  await nextTick();
  const list = listboxRef.value;
  const item = list?.children[idx] as HTMLElement | undefined;
  if (!list || !item) return;
  const itemTop = item.offsetTop;
  const itemBottom = itemTop + item.offsetHeight;
  if (itemTop < list.scrollTop) {
    list.scrollTop = itemTop;
  } else if (itemBottom > list.scrollTop + list.clientHeight) {
    list.scrollTop = itemBottom - list.clientHeight;
  }
});

function onTriggerKeydown(e: KeyboardEvent) {
  // When open, the trigger keeps DOM focus (the listbox is teleported and not
  // focused), so navigation keys must be handled here, delegating to the shared
  // list handler. When closed, these keys open the dropdown.
  if (open.value) {
    onListKeydown(e);
    return;
  }
  switch (e.key) {
    case "Enter": case " ": case "ArrowDown":
      e.preventDefault(); openDropdown(); break;
    case "ArrowUp":
      e.preventDefault();
      open.value = true;
      highlightedIndex.value = props.options.length - 1;
      break;
    case "Escape":
      closeDropdown(); break;
  }
}

function onListKeydown(e: KeyboardEvent) {
  const opts = props.options;
  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      let next = highlightedIndex.value + 1;
      while (next < opts.length && opts[next].disabled) next++;
      if (next < opts.length) highlightedIndex.value = next;
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      let prev = highlightedIndex.value - 1;
      while (prev >= 0 && opts[prev].disabled) prev--;
      if (prev >= 0) highlightedIndex.value = prev;
      break;
    }
    case "Enter": case " ":
      e.preventDefault();
      if (highlightedIndex.value >= 0) selectOption(opts[highlightedIndex.value]);
      break;
    case "Escape": case "Tab":
      closeDropdown(); break;
    case "Home": {
      e.preventDefault();
      const first = opts.findIndex((o) => !o.disabled);
      if (first >= 0) highlightedIndex.value = first;
      break;
    }
    case "End": {
      e.preventDefault();
      const last = [...opts].reverse().findIndex((o) => !o.disabled);
      if (last >= 0) highlightedIndex.value = opts.length - 1 - last;
      break;
    }
  }
}

const wrapperClasses = computed(() =>
  cn("vyre-select", `vyre-select--${props.size}`, props.class)
);
</script>

<template>
  <div ref="wrapperRef" :class="wrapperClasses" :data-open="open">
    <button
      ref="triggerRef"
      type="button"
      class="vyre-select__trigger"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      :disabled="disabled"
      :aria-disabled="disabled"
      @click="open ? closeDropdown() : openDropdown()"
      @keydown="onTriggerKeydown"
    >
      <span v-if="selectedOption" class="vyre-select__value">
        {{ selectedOption.label }}
      </span>
      <span v-else class="vyre-select__placeholder">{{ placeholder }}</span>
      <!-- Chevron icon -->
      <svg
        class="vyre-select__chevron"
        :style="{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }"
        width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
      >
        <path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <Teleport to="body" :disabled="disablePortal">
      <ul
        v-if="open"
        ref="listboxRef"
        role="listbox"
        :class="[
          'vyre-select__dropdown',
          !disablePortal && 'vyre-select__dropdown--portal',
          !disablePortal && position.flip && 'vyre-select__dropdown--flip',
        ]"
        :style="
          disablePortal
            ? undefined
            : {
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
              }
        "
        aria-label="Options"
        tabindex="-1"
        @keydown="onListKeydown"
      >
        <li
          v-for="(option, index) in options"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
          :data-highlighted="index === highlightedIndex"
          class="vyre-select__option"
          @mouseenter="!option.disabled && (highlightedIndex = index)"
          @mousedown.prevent="selectOption(option)"
        >
          {{ option.label }}
          <!-- Check icon for selected -->
          <svg
            v-if="option.value === modelValue"
            class="vyre-select__check"
            width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          >
            <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
        <li v-if="options.every(o => o.disabled)" class="vyre-select__empty" role="presentation">
          No options available
        </li>
      </ul>
    </Teleport>
  </div>
</template>
