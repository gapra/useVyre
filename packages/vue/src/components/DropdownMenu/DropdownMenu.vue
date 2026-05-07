<script setup lang="ts">
/**
 * @vyre/vue — DropdownMenu
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: DropdownMenu + DropdownItem +               │
 * │   DropdownCheckboxItem + DropdownRadioGroup +           │
 * │   DropdownRadioItem + DropdownSub + DropdownLabel +     │
 * │   DropdownSeparator                                     │
 * │                                                         │
 * │ Import:     import { DropdownMenu, DropdownItem, ... }  │
 * │             from "@vyre/vue"                            │
 * │                                                         │
 * │ DropdownMenu props:                                     │
 * │   placement = "bottom-start"(default)|"bottom-end"      │
 * │               |"top-start"|"top-end"                    │
 * │                                                         │
 * │ Slots:                                                  │
 * │   trigger — the anchor element                          │
 * │   default — DropdownItem / DropdownCheckboxItem /       │
 * │             DropdownRadioGroup / DropdownSub /          │
 * │             DropdownLabel / DropdownSeparator            │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <DropdownMenu>
 *   <template #trigger>
 *     <Button variant="ghost">Actions</Button>
 *   </template>
 *   <DropdownLabel>My Account</DropdownLabel>
 *   <DropdownSeparator />
 *   <DropdownItem shortcut="⌘E" @select="handleEdit">Edit</DropdownItem>
 *   <DropdownSub trigger="Share">
 *     <DropdownItem @select="handleEmail">Email</DropdownItem>
 *   </DropdownSub>
 *   <DropdownSeparator />
 *   <DropdownItem variant="danger" @select="handleDelete">Delete</DropdownItem>
 * </DropdownMenu>
 */

import { ref, watch, nextTick, onBeforeUnmount, computed, provide, Teleport, Transition } from "vue";
import { cn } from "../../utils/cn";
import { DROPDOWN_KEY } from "./context";

type DropdownPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

const props = withDefaults(
  defineProps<{
    placement?: DropdownPlacement;
    class?: string;
  }>(),
  { placement: "bottom-start" }
);

const triggerRef = ref<HTMLElement | null>(null);
const menuRef    = ref<HTMLDivElement | null>(null);
const open       = ref(false);
const position   = ref({ top: 0, left: 0 });
const focusedIdx = ref(-1);
const GAP = 4;

function getItems(): HTMLElement[] {
  return Array.from(
    menuRef.value?.querySelectorAll<HTMLElement>(
      "[role=menuitem]:not([disabled])," +
      "[role=menuitemcheckbox]:not([disabled])," +
      "[role=menuitemradio]:not([disabled])"
    ) ?? []
  );
}

function computePosition() {
  const el = triggerRef.value;
  if (!el) return;
  const rect    = el.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const isEnd   = props.placement.endsWith("-end");
  const isTop   = props.placement.startsWith("top");
  if (isTop) {
    position.value = {
      top:  rect.top + scrollY - GAP,
      left: isEnd ? rect.right + scrollX : rect.left + scrollX,
    };
  } else {
    position.value = {
      top:  rect.bottom + scrollY + GAP,
      left: isEnd ? rect.right + scrollX : rect.left + scrollX,
    };
  }
}

async function openMenu() {
  open.value = true;
  await nextTick();
  computePosition();
  const items = getItems();
  // preventScroll stops page from jumping to the portaled element
  items[0]?.focus({ preventScroll: true });
  focusedIdx.value = 0;
}

function closeMenu() {
  open.value = false;
  focusedIdx.value = -1;
  triggerRef.value?.focus({ preventScroll: true });
}

provide(DROPDOWN_KEY, { close: closeMenu });

function toggle() {
  if (open.value) closeMenu(); else openMenu();
}

function handleOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (menuRef.value?.contains(target)) return;
  if (triggerRef.value?.contains(target)) return;
  closeMenu();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") { closeMenu(); return; }
  const items = getItems();
  if (!items.length) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const dir  = e.key === "ArrowDown" ? 1 : -1;
    const next = (focusedIdx.value + dir + items.length) % items.length;
    items[next]?.focus({ preventScroll: true });
    focusedIdx.value = next;
  }
  if (e.key === "Home") { items[0]?.focus({ preventScroll: true }); focusedIdx.value = 0; }
  if (e.key === "End")  { items[items.length - 1]?.focus({ preventScroll: true }); focusedIdx.value = items.length - 1; }
}

watch(open, (val) => {
  if (val) {
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown",   handleKeydown);
  } else {
    document.removeEventListener("mousedown", handleOutside);
    document.removeEventListener("keydown",   handleKeydown);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutside);
  document.removeEventListener("keydown",   handleKeydown);
});

const isEnd = computed(() => props.placement.endsWith("-end"));
const isTop = computed(() => props.placement.startsWith("top"));

const menuClasses = computed(() =>
  cn(
    "vyre-dropdown",
    isEnd.value && "vyre-dropdown--end",
    isTop.value && "vyre-dropdown--top",
    props.class
  )
);
</script>

<template>
  <span style="display: contents">
    <span ref="triggerRef" style="display: contents" @click="toggle">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <Transition name="vyre-dropdown-fade">
        <div
          v-if="open"
          ref="menuRef"
          role="menu"
          aria-orientation="vertical"
          :class="menuClasses"
          :style="{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: isEnd ? 'translateX(-100%)' : undefined,
          }"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.vyre-dropdown-fade-enter-active,
.vyre-dropdown-fade-leave-active {
  transition: opacity var(--vyre-transition-duration-fast, 120ms) ease,
              transform var(--vyre-transition-duration-fast, 120ms) ease;
}
.vyre-dropdown-fade-enter-from,
.vyre-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
.vyre-dropdown-fade-enter-to,
.vyre-dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
