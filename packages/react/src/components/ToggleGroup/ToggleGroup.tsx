/**
 * @usevyre/react — ToggleGroup + ToggleItem
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  ToggleGroup (+ ToggleItem)                            │
 * │ Import:     import { ToggleGroup, ToggleItem } from "@usevyre/react"│
 * │                                                                   │
 * │ Segmented control. CONTROLLED — the group owns the value.         │
 * │ onChange emits the VALUE (string|null or string[]), not an event. │
 * │                                                                   │
 * │   type     = "single"(default) | "multiple"                       │
 * │     single   → value: string | null, onChange(string | null)      │
 * │     multiple → value: string[],      onChange(string[])           │
 * │   options? = { value; label?; icon?; disabled? }[]                │
 * │   size     = "sm" | "md"(default) | "lg"                          │
 * │   disabled = boolean (disables the whole group)                   │
 * │                                                                   │
 * │ Use `options` for simple lists, or <ToggleItem value> children    │
 * │ for custom content. Keyboard: arrows move, Space/Enter toggles.   │
 * │                                                                   │
 * │ NOT Switch (boolean), NOT ButtonGroup (layout only),              │
 * │ NOT RadioGroup (form radios, single only).                        │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [view, setView] = useState<string | null>("grid");
 * <ToggleGroup
 *   value={view}
 *   onChange={setView}
 *   options={[
 *     { value: "grid", label: "Grid" },
 *     { value: "list", label: "List" },
 *   ]}
 * />
 *
 * @example  // multiple, composable
 * const [fmt, setFmt] = useState<string[]>(["bold"]);
 * <ToggleGroup type="multiple" value={fmt} onChange={setFmt}>
 *   <ToggleItem value="bold">B</ToggleItem>
 *   <ToggleItem value="italic">I</ToggleItem>
 * </ToggleGroup>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export interface ToggleOption {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

type ToggleSize = "sm" | "md" | "lg";

interface ToggleContextValue {
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  size: ToggleSize;
  groupDisabled: boolean;
}

const ToggleContext = React.createContext<ToggleContextValue | null>(null);

type SingleProps = {
  type?: "single";
  value?: string | null;
  onChange?: (value: string | null) => void;
};
type MultipleProps = {
  type: "multiple";
  value?: string[];
  onChange?: (value: string[]) => void;
};

export type ToggleGroupProps = (SingleProps | MultipleProps) &
  BaseProps & {
    options?: ToggleOption[];
    size?: ToggleSize;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    /** Accessible label for the group */
    "aria-label"?: string;
    children?: React.ReactNode;
  };

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const {
      options,
      size = "md",
      disabled = false,
      orientation = "horizontal",
      className,
      children,
      ...rest
    } = props;
    const isMultiple = props.type === "multiple";

    const isSelected = (value: string): boolean => {
      if (isMultiple)
        return Array.isArray(props.value) && props.value.includes(value);
      return props.value === value;
    };

    const toggle = (value: string) => {
      if (isMultiple) {
        const cur = Array.isArray(props.value) ? props.value : [];
        const next = cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value];
        (props.onChange as MultipleProps["onChange"])?.(next);
      } else {
        const next = props.value === value ? null : value;
        (props.onChange as SingleProps["onChange"])?.(next);
      }
    };

    const ctx: ToggleContextValue = {
      isSelected,
      toggle,
      size,
      groupDisabled: disabled,
    };

    return (
      <ToggleContext.Provider value={ctx}>
        <div
          ref={ref}
          role={isMultiple ? "group" : "radiogroup"}
          aria-orientation={orientation}
          data-orientation={orientation}
          className={cn(
            "vyre-toggle-group",
            `vyre-toggle-group--${size}`,
            disabled && "vyre-toggle-group--disabled",
            className
          )}
          {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        >
          {options
            ? options.map((o) => (
                <ToggleItem
                  key={o.value}
                  value={o.value}
                  disabled={o.disabled}
                  icon={o.icon}
                >
                  {o.label ?? o.value}
                </ToggleItem>
              ))
            : children}
        </div>
      </ToggleContext.Provider>
    );
  }
);
ToggleGroup.displayName = "VyreToggleGroup";

export interface ToggleItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const ToggleItem = React.forwardRef<HTMLButtonElement, ToggleItemProps>(
  ({ value, icon, disabled = false, className, children, onClick, ...rest }, ref) => {
    const ctx = React.useContext(ToggleContext);
    if (!ctx) {
      throw new Error("ToggleItem must be used inside a <ToggleGroup>");
    }
    const selected = ctx.isSelected(value);
    const isDisabled = disabled || ctx.groupDisabled;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const items = Array.from(
        (e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
          ".vyre-toggle-item:not(:disabled)"
        ) ?? [])
      );
      const i = items.indexOf(e.currentTarget);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        items[(i + 1) % items.length]?.focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length]?.focus();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        data-state={selected ? "on" : "off"}
        disabled={isDisabled}
        className={cn(
          "vyre-toggle-item",
          selected && "vyre-toggle-item--selected",
          className
        )}
        onClick={(e) => {
          ctx.toggle(value);
          onClick?.(e);
        }}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {icon && <span className="vyre-toggle-item__icon" aria-hidden="true">{icon}</span>}
        {children}
      </button>
    );
  }
);
ToggleItem.displayName = "VyreToggleItem";
