/**
 * @usevyre/react — Tree
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  Tree                                                  │
 * │ Import:     import { Tree } from "@usevyre/react"                  │
 * │                                                                   │
 * │ Hierarchical tree view (file explorer / nested nav). DATA-DRIVEN  │
 * │ and CONTROLLED. Pass a nested array; the Tree renders recursively.│
 * │                                                                   │
 * │   data = TreeNode[]  where TreeNode = {                            │
 * │     id: string; label: ReactNode;                                 │
 * │     icon?: ReactNode; disabled?: boolean;                          │
 * │     children?: TreeNode[]                                          │
 * │   }                                                               │
 * │   expandedIds?        = string[]  (controlled)                    │
 * │   defaultExpandedIds  = string[]  (uncontrolled)                  │
 * │   onExpandedChange?   = (ids: string[]) => void                   │
 * │   selectedId?         = string | null  (controlled)               │
 * │   defaultSelectedId   = string | null  (uncontrolled)             │
 * │   onSelect?           = (id: string) => void                      │
 * │                                                                   │
 * │ Single selection. A node with `children` is a folder (toggles     │
 * │ expand on click); a leaf fires onSelect. Keyboard: ↑/↓ move,      │
 * │ →/← expand/collapse, Enter/Space select.                          │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [sel, setSel] = useState<string | null>("a/b.ts");
 * <Tree
 *   data={[
 *     { id: "src", label: "src", children: [
 *       { id: "a.ts", label: "a.ts" },
 *       { id: "b", label: "b", children: [{ id: "b/c.ts", label: "c.ts" }] },
 *     ]},
 *     { id: "readme", label: "README.md" },
 *   ]}
 *   selectedId={sel}
 *   onSelect={setSel}
 *   defaultExpandedIds={["src"]}
 * />
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className="vyre-tree__chevron"
    data-open={open ? "" : undefined}
  >
    <path
      d="M4.5 3l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface TreeContextValue {
  expanded: Set<string>;
  toggle: (id: string) => void;
  selectedId: string | null;
  select: (id: string) => void;
}

const TreeCtx = React.createContext<TreeContextValue | null>(null);

export interface TreeProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect">,
    BaseProps {
  data: TreeNode[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelect?: (id: string) => void;
}

export const Tree = React.forwardRef<HTMLUListElement, TreeProps>(
  (
    {
      data,
      expandedIds,
      defaultExpandedIds = [],
      onExpandedChange,
      selectedId,
      defaultSelectedId = null,
      onSelect,
      className,
      ...props
    },
    ref
  ) => {
    const expControlled = expandedIds !== undefined;
    const selControlled = selectedId !== undefined;
    const [expInternal, setExpInternal] = React.useState<string[]>(
      defaultExpandedIds
    );
    const [selInternal, setSelInternal] = React.useState<string | null>(
      defaultSelectedId
    );

    const expanded = React.useMemo(
      () => new Set(expControlled ? expandedIds : expInternal),
      [expControlled, expandedIds, expInternal]
    );
    const curSelected = selControlled ? selectedId! : selInternal;

    const toggle = React.useCallback(
      (id: string) => {
        const next = new Set(expanded);
        next.has(id) ? next.delete(id) : next.add(id);
        const arr = [...next];
        if (!expControlled) setExpInternal(arr);
        onExpandedChange?.(arr);
      },
      [expanded, expControlled, onExpandedChange]
    );

    const select = React.useCallback(
      (id: string) => {
        if (!selControlled) setSelInternal(id);
        onSelect?.(id);
      },
      [selControlled, onSelect]
    );

    return (
      <TreeCtx.Provider
        value={{ expanded, toggle, selectedId: curSelected, select }}
      >
        <ul
          ref={ref}
          role="tree"
          className={cn("vyre-tree", className)}
          {...props}
        >
          {data.map((node) => (
            <TreeNodeView key={node.id} node={node} level={0} />
          ))}
        </ul>
      </TreeCtx.Provider>
    );
  }
);
Tree.displayName = "VyreTree";

function moveFocus(current: HTMLElement, dir: 1 | -1) {
  const root = current.closest(".vyre-tree");
  if (!root) return;
  const rows = Array.from(
    root.querySelectorAll<HTMLElement>(
      '.vyre-tree__row:not([aria-disabled="true"])'
    )
  ).filter((el) => el.offsetParent !== null); // visible only
  const i = rows.indexOf(current);
  rows[i + dir]?.focus();
}

const TreeNodeView: React.FC<{ node: TreeNode; level: number }> = ({
  node,
  level,
}) => {
  const ctx = React.useContext(TreeCtx)!;
  const hasChildren = !!node.children && node.children.length > 0;
  const isOpen = ctx.expanded.has(node.id);
  const isSelected = ctx.selectedId === node.id;

  const activate = () => {
    if (node.disabled) return;
    if (hasChildren) ctx.toggle(node.id);
    ctx.select(node.id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveFocus(e.currentTarget, 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(e.currentTarget, -1);
        break;
      case "ArrowRight":
        if (hasChildren && !isOpen) {
          e.preventDefault();
          ctx.toggle(node.id);
        }
        break;
      case "ArrowLeft":
        if (hasChildren && isOpen) {
          e.preventDefault();
          ctx.toggle(node.id);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        activate();
        break;
    }
  };

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-selected={isSelected}
      className="vyre-tree__item"
    >
      <div
        role="button"
        tabIndex={node.disabled ? -1 : 0}
        aria-disabled={node.disabled || undefined}
        data-selected={isSelected ? "" : undefined}
        className="vyre-tree__row"
        style={{ paddingLeft: `calc(${level} * var(--vyre-spacing-5))` }}
        onClick={activate}
        onKeyDown={onKeyDown}
      >
        <span className="vyre-tree__chevron-slot">
          {hasChildren ? <Chevron open={isOpen} /> : null}
        </span>
        {node.icon && (
          <span className="vyre-tree__icon" aria-hidden="true">
            {node.icon}
          </span>
        )}
        <span className="vyre-tree__label">{node.label}</span>
      </div>
      {hasChildren && isOpen && (
        <ul role="group" className="vyre-tree__group">
          {node.children!.map((child) => (
            <TreeNodeView key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};
