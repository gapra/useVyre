/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Checkbox                        │
 * │ checked      = boolean                      │
 * │ defaultChecked = boolean                    │
 * │ indeterminate  = boolean                    │
 * │ onCheckedChange = (checked: boolean) => void│
 * │ disabled     = boolean                      │
 * │ size         = "sm"|"md"(default)           │
 * │ CSS class:  .vyre-checkbox                  │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked,
      indeterminate = false,
      onCheckedChange,
      disabled,
      size = "md",
      className,
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <span
        className={["vyre-checkbox", `vyre-checkbox--${size}`, className].filter(Boolean).join(" ")}
        data-disabled={disabled || undefined}
        data-checked={controlledChecked || undefined}
        data-indeterminate={indeterminate || undefined}
      >
        <input
          ref={resolvedRef}
          type="checkbox"
          id={id}
          checked={controlledChecked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="vyre-checkbox__input"
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <span className="vyre-checkbox__box" aria-hidden="true">
          {indeterminate ? (
            <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
              <path d="M1 1h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";
