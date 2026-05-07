<script setup lang="ts">
/**
 * @vyre/vue — Command
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Command + CommandInput + CommandList +      │
 * │             CommandEmpty + CommandGroup + CommandItem + │
 * │             CommandSeparator + CommandDialog            │
 * │ Import:     import { Command, CommandDialog, ... }      │
 * │             from "@vyre/vue"                            │
 * │                                                         │
 * │ Command props:                                          │
 * │   modelValue  = string (v-model search value)           │
 * │                                                         │
 * │ Events:                                                 │
 * │   @update:modelValue — (v: string) => void              │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Command>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandGroup heading="Actions">
 *       <CommandItem @select="goToSettings">Settings</CommandItem>
 *     </CommandGroup>
 *     <CommandEmpty>No results.</CommandEmpty>
 *   </CommandList>
 * </Command>
 */

import { provide, ref, computed } from "vue";
import { cn } from "../../utils/cn";
import { COMMAND_KEY } from "./command-key";

const visibleCount = ref(0);
function incrementVisible() { visibleCount.value++; }
function decrementVisible() { visibleCount.value--; }

const props = withDefaults(defineProps<{
  modelValue?: string;
  class?: string;
}>(), { modelValue: undefined });

const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const internalSearch = ref("");
const search = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalSearch.value,
  set: (v) => { internalSearch.value = v; emit("update:modelValue", v); },
});

const activeIndex = ref(0);
const items = new Map<string, { el: HTMLElement; disabled: boolean; onSelect?: () => void }>();

function setSearch(v: string) { search.value = v; activeIndex.value = 0; }
function setActiveIndex(i: number) { activeIndex.value = i; }

function getVisible() {
  return Array.from(items.entries()).filter(([, v]) => !v.disabled && v.el.offsetParent !== null);
}

function registerItem(id: string, el: HTMLElement, disabled: boolean, onSelect?: () => void) {
  items.set(id, { el, disabled, onSelect });
}
function unregisterItem(id: string) { items.delete(id); }

function selectActive() {
  const visible = getVisible();
  visible[activeIndex.value]?.[1].onSelect?.();
}
function moveActive(dir: 1 | -1) {
  const visible = getVisible();
  const next = Math.max(0, Math.min(activeIndex.value + dir, visible.length - 1));
  activeIndex.value = next;
  visible[next]?.[1].el.scrollIntoView({ block: "nearest" });
}

provide(COMMAND_KEY, { search, setSearch, activeIndex, setActiveIndex, registerItem, unregisterItem, selectActive, moveActive, visibleCount, incrementVisible, decrementVisible });
</script>

<template>
  <div :class="cn('vyre-command', props.class)" role="combobox" aria-expanded="true" aria-haspopup="listbox">
    <slot />
  </div>
</template>
