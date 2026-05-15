/**
 * @usevyre/react — ButtonGroup
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  ButtonGroup                                 │
 * │ Import:     import { ButtonGroup } from "@usevyre/react"│
 * │                                                         │
 * │ Props:                                                  │
 * │   orientation = "horizontal"(default)|"vertical"        │
 * │   attached    = boolean (default: false)                │
 * │               If true, buttons share borders (no gap)   │
 * │   size        = "sm"|"md"|"lg"|"icon"                   │
 * │               Propagated to children via data-size attr  │
 * │                                                         │
 * │ Semantics: role="group" wrapper div                     │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Horizontal toolbar
 * <ButtonGroup>
 *   <Button variant="secondary">Cut</Button>
 *   <Button variant="secondary">Copy</Button>
 *   <Button variant="secondary">Paste</Button>
 * </ButtonGroup>
 *
 * // Attached segmented control
 * <ButtonGroup attached>
 *   <Button variant="primary">Day</Button>
 *   <Button variant="secondary">Week</Button>
 *   <Button variant="secondary">Month</Button>
 * </ButtonGroup>
 *
 * // Vertical stack
 * <ButtonGroup orientation="vertical">
 *   <Button variant="ghost">Option A</Button>
 *   <Button variant="ghost">Option B</Button>
 * </ButtonGroup>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { Size, BaseProps } from "../../types";

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  /** Layout direction of grouped buttons */
  orientation?: "horizontal" | "vertical";
  /** Remove gap — buttons share collapsed borders */
  attached?: boolean;
  /** Size forwarded to child buttons via data-group-size attribute */
  size?: Size;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = "horizontal",
      attached = false,
      size,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "vyre-btn-group",
          orientation === "vertical" && "vyre-btn-group--vertical",
          attached && "vyre-btn-group--attached",
          className
        )}
        data-orientation={orientation}
        data-size={size}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "VyreButtonGroup";
