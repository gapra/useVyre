/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Progress                        │
 * │ value       = number (0-100)                │
 * │ max         = number (default: 100)         │
 * │ indeterminate = boolean                     │
 * │ size        = "sm"|"md"(default)|"lg"       │
 * │ variant     = "default"|"accent"|"teal"|"success"|"danger" │
 * │ CSS class:  .vyre-progress                  │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "accent" | "teal" | "success" | "danger";
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      indeterminate = false,
      size = "md",
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const percentage = indeterminate
      ? undefined
      : Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : (value ?? 0)}
        data-size={size}
        data-variant={variant}
        data-indeterminate={indeterminate || undefined}
        className={["vyre-progress", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div
          className="vyre-progress__bar"
          style={percentage !== undefined ? { width: `${percentage}%` } : undefined}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
