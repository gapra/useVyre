<!--
  @usevyre/vue — TreeNode (internal, recursive). Not exported directly;
  used by <Tree>. Renders one node and recurses into children.
-->
<script setup lang="ts">
import { computed, inject } from "vue";
import { treeKey, type TreeNode } from "./context";

const props = defineProps<{ node: TreeNode; level: number }>();

const ctx = inject(treeKey)!;
const hasChildren = computed(
  () => !!props.node.children && props.node.children.length > 0
);
const isOpen = computed(() => ctx.expanded.value.has(props.node.id));
const isSelected = computed(() => ctx.selectedId.value === props.node.id);

function activate() {
  if (props.node.disabled) return;
  if (hasChildren.value) ctx.toggle(props.node.id);
  ctx.select(props.node.id);
}

function moveFocus(current: HTMLElement, dir: 1 | -1) {
  const root = current.closest(".vyre-tree");
  if (!root) return;
  const rows = Array.from(
    root.querySelectorAll<HTMLElement>(
      '.vyre-tree__row:not([aria-disabled="true"])'
    )
  ).filter((el) => el.offsetParent !== null);
  const i = rows.indexOf(current);
  rows[i + dir]?.focus();
}

function onKeydown(e: KeyboardEvent) {
  const el = e.currentTarget as HTMLElement;
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      moveFocus(el, 1);
      break;
    case "ArrowUp":
      e.preventDefault();
      moveFocus(el, -1);
      break;
    case "ArrowRight":
      if (hasChildren.value && !isOpen.value) {
        e.preventDefault();
        ctx.toggle(props.node.id);
      }
      break;
    case "ArrowLeft":
      if (hasChildren.value && isOpen.value) {
        e.preventDefault();
        ctx.toggle(props.node.id);
      }
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      activate();
      break;
  }
}
</script>

<template>
  <li
    role="treeitem"
    :aria-expanded="hasChildren ? isOpen : undefined"
    :aria-selected="isSelected"
    class="vyre-tree__item"
  >
    <div
      role="button"
      :tabindex="node.disabled ? -1 : 0"
      :aria-disabled="node.disabled || undefined"
      :data-selected="isSelected ? '' : undefined"
      class="vyre-tree__row"
      :style="{ paddingLeft: `calc(${level} * var(--vyre-spacing-5))` }"
      @click="activate"
      @keydown="onKeydown"
    >
      <span class="vyre-tree__chevron-slot">
        <svg
          v-if="hasChildren"
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          aria-hidden="true"
          class="vyre-tree__chevron"
          :data-open="isOpen ? '' : undefined"
        >
          <path
            d="M4.5 3l3 3-3 3"
            stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
          />
        </svg>
      </span>
      <span v-if="node.icon" class="vyre-tree__icon" aria-hidden="true">
        {{ node.icon }}
      </span>
      <span class="vyre-tree__label">{{ node.label }}</span>
    </div>
    <ul v-if="hasChildren && isOpen" role="group" class="vyre-tree__group">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
      />
    </ul>
  </li>
</template>
