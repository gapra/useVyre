/**
 * @vyre/react — Badge
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Badge                                       │
 * │ Import:     import { Badge } from "@vyre/react"         │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant = "default"|"accent"|"teal"|                  │
 * │             "success"|"warning"|"danger"                │
 * │   dot     = boolean  (live status dot indicator)        │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Badge variant="success" dot>Online</Badge>
 * <Badge variant="warning">Beta</Badge>
 * <Badge variant="danger">Error</Badge>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BadgeVariant, BaseProps } from "../../types";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    BaseProps {
  variant?: BadgeVariant;
  /** Show a live status dot indicator */
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", dot = false, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("vyre-badge", `vyre-badge--${variant}`, className)}
        data-variant={variant}
        {...props}
      >
        {dot && <span className="vyre-badge__dot" aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "VyreBadge";
