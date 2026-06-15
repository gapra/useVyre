/**
 * @usevyre/react — Tooltip
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Tooltip                                     │
 * │ Import:     import { Tooltip } from "@usevyre/react"       │
 * │                                                         │
 * │ Props:                                                  │
 * │   content    = string | ReactNode (tooltip text)        │
 * │   placement  = "top"(default)|"bottom"|"left"|"right"   │
 * │   delay      = number (ms, default 300)                 │
 * │   disablePortal = boolean (default: false) — render the │
 * │               tooltip inline instead of portaling it to │
 * │               <body>. Portaling (default) keeps it       │
 * │               visible inside Modal / overflow:hidden.    │
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

import React, {
  useState, useRef, useId, useCallback, useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  /** Delay before showing in ms. Default: 300 */
  delay?: number;
  /**
   * Render the tooltip inline instead of teleporting it to <body>. Default
   * false: the tooltip portals to body so it stays visible inside Modal /
   * overflow:hidden containers.
   */
  disablePortal?: boolean;
  children: React.ReactElement;
  className?: string;
}

const ANIM_OUT_MS = 120;
const GAP = 8; // matches the old CSS calc(100% + spacing-2)

/** Final document-space position of the tooltip box for a given placement. */
function computeTooltipPosition(
  trigger: HTMLElement,
  tip: HTMLElement,
  placement: TooltipPlacement,
): { top: number; left: number } {
  const r = trigger.getBoundingClientRect();
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  const cx = r.left + r.width / 2 + window.scrollX;
  const cy = r.top + r.height / 2 + window.scrollY;
  switch (placement) {
    case "bottom":
      return { top: r.bottom + window.scrollY + GAP, left: cx - tw / 2 };
    case "left":
      return { top: cy - th / 2, left: r.left + window.scrollX - GAP - tw };
    case "right":
      return { top: cy - th / 2, left: r.right + window.scrollX + GAP };
    case "top":
    default:
      return { top: r.top + window.scrollY - GAP - th, left: cx - tw / 2 };
  }
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  delay = 300,
  disablePortal = false,
  children,
  className,
}) => {
  const [state, setState] = useState<"hidden" | "visible" | "leaving">("hidden");
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const showTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tipRef     = useRef<HTMLSpanElement | null>(null);
  const tooltipId  = useId();

  // Position the portaled tooltip against the trigger, and keep it in sync while
  // visible (scroll inside a Modal, window resize).
  useLayoutEffect(() => {
    if (disablePortal || state === "hidden") return;
    const compute = () => {
      const trigger = triggerRef.current;
      const tip = tipRef.current;
      if (!trigger || !tip) return;
      setPosition(computeTooltipPosition(trigger, tip, placement));
    };
    compute();
    // capture:true so scrolling INSIDE a Modal body is caught, not only window.
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [disablePortal, state, placement, content]);

  const show = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    showTimer.current = setTimeout(() => setState("visible"), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
    setState("leaving");
    leaveTimer.current = setTimeout(() => setState("hidden"), ANIM_OUT_MS);
  }, []);

  const child = React.Children.only(children);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childRef = (child as any).ref as React.Ref<HTMLElement> | undefined;

  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
    if (typeof childRef === "function") childRef(node);
    else if (childRef) (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }, [childRef]);

  const trigger = React.cloneElement(child, {
    ref: setTriggerRef,
    onMouseEnter: (e: React.MouseEvent) => { show(); child.props.onMouseEnter?.(e); },
    onMouseLeave: (e: React.MouseEvent) => { hide(); child.props.onMouseLeave?.(e); },
    onFocus:      (e: React.FocusEvent) => { setState("visible"); child.props.onFocus?.(e); },
    onBlur:       (e: React.FocusEvent) => { hide(); child.props.onBlur?.(e); },
    "aria-describedby": state !== "hidden" ? tooltipId : undefined,
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> });

  const tooltip = state !== "hidden" ? (
    <span
      ref={tipRef}
      id={tooltipId}
      role="tooltip"
      className={cn(
        "vyre-tooltip",
        `vyre-tooltip--${placement}`,
        !disablePortal && "vyre-tooltip--portal",
        state === "leaving" && "vyre-tooltip--leaving",
      )}
      data-placement={placement}
      style={disablePortal ? undefined : { position: "absolute", top: position.top, left: position.left }}
    >
      {content}
      <span className="vyre-tooltip__arrow" aria-hidden="true" />
    </span>
  ) : null;

  return (
    <span className={cn("vyre-tooltip-wrapper", className)}>
      {trigger}
      {disablePortal ? tooltip : tooltip && createPortal(tooltip, document.body)}
    </span>
  );
};

Tooltip.displayName = "VyreTooltip";
