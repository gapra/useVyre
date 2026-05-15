<script setup lang="ts">
/**
 * @usevyre/vue — Combobox
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Combobox                                    │
 * │ Import:     import { Combobox } from "@usevyre/vue"     │
 * │                                                         │
 * │ Props:                                                  │
 * │   options      = { value: string; label: string;        │
 * │                    disabled?: boolean }[]               │
 * │   modelValue   = string | null (v-model)                │
 * │   placeholder  = string                                 │
 * │   disabled     = boolean                                │
 * │   size         = "sm"|"md"(default)|"lg"                │
 * │   emptyText    = string (default: "No results")         │
 * │                                                         │
 * │ Emits:                                                  │
 * │   update:modelValue — selected string or null           │
 * │                                                         │
 * │ Behavior:                                               │
 * │   Click/focus input → open dropdown                     │
 * │   Type → filter by case-insensitive contains            │
 * │   Select → close, emit value                            │
 * │   Escape → close                                        │
 * │   Click outside → close                                 │
 * │   ArrowUp/Down → navigate, Enter → select               │
 * │                                                         │
 * │ Differs from Select: searchable text input              │
 * │ Differs from Command: single-value pick, not palette    │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Combobox
 *   v-model="lang"
 *   :options="[
 *     { value: 'ts', label: 'TypeScript' },
 *     { value: 'rs', label: 'Rust' },
 *   ]"
 *   placeholder="Search language…"
 * />
 */

import { ref, computed, watch, nextTick } from "vue";
import { cn } from "../../utils/cn";

type ComboboxSize = "sm" | "md" | "lg";

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    options: ComboboxOption[];
    modelValue: string | null;
    placeholder?: string;
    disabled?: boolean;
    size?: ComboboxSize;
    emptyText?: string;
    class?: string;
  }>(),
  { placeholder: "Search…", disabled: false, size: "md", emptyText: "No results" }
);

const emit = defineEmits<{ "update:modelValue": [value: string | null] }>();

const open             = ref(false);
const search           = ref("");
const highlightedIndex = ref(-1);
const wrapperRef       = ref<HTMLDivElement | null>(null);
const dropdownRef      = ref<HTMLUListElement | null>(null);
const inputRef         = ref<HTMLInputElement | null>(null);

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue) ?? null
);

const filtered = computed(() =>
  props.options.filter((o) =>
    o.label.toLowerCase().includes(search.value.toLowerCase())
  )
);

const inputDisplayValue = computed(() =>
  open.value ? search.value : (selectedOption.value?.label ?? "")
);

function closeDropdown() {
  open.value = false;
  highlightedIndex.value = -1;
  search.value = "";
}

function selectOption(option: ComboboxOption) {
  if (option.disabled) return;
  emit("update:modelValue", option.value);
  closeDropdown();
  inputRef.value?.blur();
}

function onFocus() {
  if (props.disabled) return;
  search.value = "";
  open.value = true;
  highlightedIndex.value = filtered.value.length > 0 ? 0 : -1;
}

function onInput(e: Event) {
  search.value = (e.target as HTMLInputElement).value;
  if (!open.value) open.value = true;
}

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      if (!open.value) { open.value = true; return; }
      let next = highlightedIndex.value + 1;
      while (next < filtered.value.length && filtered.value[next].disabled) next++;
      if (next < filtered.value.length) highlightedIndex.value = next;
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      if (!open.value) { open.value = true; return; }
      let prev = highlightedIndex.value - 1;
      while (prev >= 0 && filtered.value[prev].disabled) prev--;
      if (prev >= 0) highlightedIndex.value = prev;
      break;
    }
    case "Enter": {
      e.preventDefault();
      if (open.value && highlightedIndex.value >= 0 && filtered.value[highlightedIndex.value]) {
        selectOption(filtered.value[highlightedIndex.value]);
      }
      break;
    }
    case "Escape": {
      closeDropdown();
      inputRef.value?.blur();
      break;
    }
  }
}

// Close on outside click
function onDocClick(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener("mousedown", onDocClick);
  else        document.removeEventListener("mousedown", onDocClick);
});

// Reset highlight when filtered list changes
watch(filtered, () => {
  highlightedIndex.value = filtered.value.length > 0 ? 0 : -1;
});

// Scroll highlighted item into view
watch(highlightedIndex, async (idx) => {
  if (!open.value || idx < 0) return;
  await nextTick();
  const item = dropdownRef.value?.children[idx] as HTMLElement | undefined;
  item?.scrollIntoView({ block: "nearest" });
});

const wrapperClasses = computed(() =>
  cn(
    "vyre-combobox",
    `vyre-combobox--${props.size}`,
    props.disabled && "vyre-combobox--disabled",
    props.class
  )
);
</script>

<template>
  <div
    ref="wrapperRef"
    :class="wrapperClasses"
    :data-open="open"
  >
    <input
      ref="inputRef"
      type="text"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-autocomplete="'list'"
      :aria-disabled="disabled"
      :disabled="disabled"
      class="vyre-combobox__input"
      :placeholder="placeholder"
      :value="inputDisplayValue"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeyDown"
    />
    <span class="vyre-combobox__chevron" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 5L7 9L11 5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <ul
      v-if="open"
      ref="dropdownRef"
      role="listbox"
      class="vyre-combobox__dropdown"
      aria-label="Options"
    >
      <template v-if="filtered.length > 0">
        <li
          v-for="(option, index) in filtered"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
          :data-highlighted="index === highlightedIndex"
          :class="[
            'vyre-combobox__option',
            index === highlightedIndex && 'vyre-combobox__option--highlighted',
            option.value === modelValue && 'vyre-combobox__option--selected',
          ]"
          @mouseenter="!option.disabled && (highlightedIndex = index)"
          @mousedown.prevent="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </template>
      <li v-else class="vyre-combobox__empty" role="presentation">
        {{ emptyText }}
      </li>
    </ul>
  </div>
</template>
