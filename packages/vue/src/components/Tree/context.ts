import type { ComputedRef, InjectionKey } from "vue";

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeContext {
  expanded: ComputedRef<Set<string>>;
  toggle: (id: string) => void;
  selectedId: ComputedRef<string | null>;
  select: (id: string) => void;
}

export const treeKey: InjectionKey<TreeContext> = Symbol("vyre-tree");
