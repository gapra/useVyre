<script setup lang="ts">
/**
 * @usevyre/vue — Command
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Command + CommandInput + CommandList +      │
 * │             CommandEmpty + CommandGroup + CommandItem + │
 * │             CommandSeparator + CommandDialog            │
 * │ Import:     import { Command, CommandDialog, ... }      │
 * │             from "@usevyre/vue"                            │
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
// Items live in a plain (non-reactive) Map; activeTick is bumped whenever the
// active item changes so CommandItem can reactively recompute its own state.
const activeTick = ref(0);
const items = new Map<string, { el: HTMLElement; disabled: boolean; onSelect?: () => void }>();

function setSearch(v: string) { search.value = v; activeIndex.value = 0; activeTick.value++; }
function setActiveIndex(i: number) { activeIndex.value = i; activeTick.value++; }

function getVisible() {
  // Filter out hidden items. CommandItem uses v-show, which toggles inline
  // display:none, so we check that directly instead of offsetParent — the latter
  // needs a layout engine (always null in jsdom/SSR), which breaks testing.
  return Array.from(items.entries()).filter(
    ([, v]) => !v.disabled && v.el.style.display !== "none"
  );
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
  // Scroll the active item within the list only (never the page): adjust the
  // list's own scrollTop instead of element.scrollIntoView().
  const item = visible[next]?.[1].el;
  const list = item?.closest<HTMLElement>(".vyre-command__list");
  if (item && list) {
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }
  // Bump the active-id tick so items recompute their selected state.
  activeTick.value++;
}

// Items can't watch the non-reactive Map, so isItemActive depends on activeTick
// (bumped on every active-item change) and recomputes position against registry.
function isItemActive(id: string) {
  void activeTick.value; // reactive dependency
  const visible = getVisible();
  return visible[activeIndex.value]?.[0] === id;
}

provide(COMMAND_KEY, { search, setSearch, activeIndex, setActiveIndex, registerItem, unregisterItem, selectActive, moveActive, visibleCount, incrementVisible, decrementVisible, isItemActive });
</script>

<template>
  <div :class="cn('vyre-command', props.class)" role="combobox" aria-expanded="true" aria-haspopup="listbox">
    <slot />
  </div>
</template>
