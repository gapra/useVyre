/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Skeleton                        │
 * │ variant = "text"|"circle"|"rect"(default)   │
 * │ width   = string | number                   │
 * │ height  = string | number                   │
 * │ CSS class:  .vyre-skeleton                  │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "rect", width, height, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-variant={variant}
        className={["vyre-skeleton", className].filter(Boolean).join(" ")}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";
