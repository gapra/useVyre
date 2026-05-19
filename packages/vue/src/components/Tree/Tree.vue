<!--
  @usevyre/vue — Tree

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Tree                                                  │
  │ Import:     import { Tree } from "@usevyre/vue"                    │
  │                                                                   │
  │ Hierarchical tree view (file explorer / nested nav). DATA-DRIVEN  │
  │ and CONTROLLED. Pass a nested array; renders recursively.         │
  │                                                                   │
  │   :data = TreeNode[]  ({ id, label, icon?, disabled?, children? })│
  │   v-model:expanded = string[]   (expanded node ids)               │
  │   v-model:selected = string | null                                │
  │   default-expanded-ids / default-selected-id (uncontrolled)       │
  │                                                                   │
  │ Single selection. Folder (has children) toggles on click; leaf    │
  │ selects. Keyboard: ↑/↓ move, →/← expand/collapse, Enter/Space.    │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { cn } from "../../utils/cn";
import TreeNode from "./TreeNode.vue";
import { treeKey, type TreeNode as TNode } from "./context";

const props = withDefaults(
  defineProps<{
    data: TNode[];
    expanded?: string[];
    defaultExpandedIds?: string[];
    selected?: string | null;
    defaultSelectedId?: string | null;
    class?: string;
  }>(),
  { defaultExpandedIds: () => [], defaultSelectedId: null }
);

const emit = defineEmits<{
  "update:expanded": [ids: string[]];
  "update:selected": [id: string];
}>();

const expControlled = computed(() => props.expanded !== undefined);
const selControlled = computed(() => props.selected !== undefined);
const expInternal = ref<string[]>([...props.defaultExpandedIds]);
const selInternal = ref<string | null>(props.defaultSelectedId);

const expanded = computed(
  () => new Set(expControlled.value ? props.expanded : expInternal.value)
);
const selectedId = computed(() =>
  selControlled.value ? props.selected ?? null : selInternal.value
);

function toggle(id: string) {
  const next = new Set(expanded.value);
  next.has(id) ? next.delete(id) : next.add(id);
  const arr = [...next];
  if (!expControlled.value) expInternal.value = arr;
  emit("update:expanded", arr);
}
function select(id: string) {
  if (!selControlled.value) selInternal.value = id;
  emit("update:selected", id);
}

provide(treeKey, { expanded, toggle, selectedId, select });

const classes = computed(() => cn("vyre-tree", props.class));
</script>

<template>
  <ul role="tree" :class="classes">
    <TreeNode
      v-for="node in data"
      :key="node.id"
      :node="node"
      :level="0"
    />
  </ul>
</template>
