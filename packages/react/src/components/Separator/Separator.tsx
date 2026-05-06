/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Separator                       │
 * │ orientation = "horizontal"(default)|"vertical" │
 * │ decorative  = boolean (default: true)       │
 * │ CSS class:  .vyre-separator                 │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  className?: string;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", decorative = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={!decorative ? orientation : undefined}
        data-orientation={orientation}
        className={["vyre-separator", className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";
