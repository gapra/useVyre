/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Label                           │
 * │ htmlFor    = string (links to input id)     │
 * │ required   = boolean                        │
 * │ disabled   = boolean                        │
 * │ CSS class:  .vyre-label                     │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, disabled, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-required={required || undefined}
        data-disabled={disabled || undefined}
        className={["vyre-label", className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
        {required && <span className="vyre-label__required" aria-hidden="true">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";
