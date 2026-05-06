/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Switch                          │
 * │ checked      = boolean                      │
 * │ defaultChecked = boolean                    │
 * │ onCheckedChange = (checked: boolean) => void│
 * │ disabled     = boolean                      │
 * │ size         = "sm"|"md"(default)           │
 * │ CSS class:  .vyre-switch                    │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !isChecked;
      if (controlledChecked === undefined) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        data-checked={isChecked || undefined}
        data-size={size}
        className={["vyre-switch", className].filter(Boolean).join(" ")}
        onClick={toggle}
        {...props}
      >
        <span className="vyre-switch__thumb" />
      </button>
    );
  }
);
Switch.displayName = "Switch";
