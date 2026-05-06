/**
 * @vyre/react — Tooltip
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Tooltip                                     │
 * │ Import:     import { Tooltip } from "@vyre/react"       │
 * │                                                         │
 * │ Props:                                                  │
 * │   content    = string | ReactNode (tooltip text)        │
 * │   placement  = "top"(default)|"bottom"|"left"|"right"   │
 * │   delay      = number (ms, default 300)                 │
 * │   children   = ReactNode (trigger element — must be     │
 * │               a single focusable element)               │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Simple tooltip
 * <Tooltip content="Copy to clipboard">
 *   <Button variant="ghost" size="icon" aria-label="Copy">
 *     <CopyIcon />
 *   </Button>
 * </Tooltip>
 *
 * // Bottom placement
 * <Tooltip content="Opens in new tab" placement="bottom">
 *   <a href="/docs">Docs</a>
 * </Tooltip>
 */

import React, { useState, useRef, useId, useCallback } from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  /** Delay before showing in ms. Default: 300 */
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  delay = 300,
  children,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const child = React.Children.only(children);

  const trigger = React.cloneElement(child, {
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      child.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      child.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      setVisible(true);
      child.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      child.props.onBlur?.(e);
    },
    "aria-describedby": visible ? tooltipId : undefined,
  });

  return (
    <span className={cn("vyre-tooltip-wrapper", className)}>
      {trigger}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn("vyre-tooltip", `vyre-tooltip--${placement}`)}
          data-placement={placement}
        >
          {content}
          <span className="vyre-tooltip__arrow" aria-hidden="true" />
        </span>
      )}
    </span>
  );
};

Tooltip.displayName = "VyreTooltip";
