/**
 * @usevyre/react — Popover
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Popover                                     │
 * │ Import:     import { Popover } from "@usevyre/react"       │
 * │                                                         │
 * │ Props:                                                  │
 * │   open           = boolean (controlled)                 │
 * │   onOpenChange   = (open: boolean) => void              │
 * │   placement      = "bottom"(default)                    │
 * │                    side: "top"|"bottom"|"left"|"right"  │
 * │                    align: "-start"?|""?|"-end"?         │
 * │                    e.g. "top-start", "bottom-end",      │
 * │                         "left", "right-start"           │
 * │   trigger        = ReactElement (the anchor element)    │
 * │   children       = ReactNode (popover content)          │
 * │   closeOnOutside = boolean (default: true)              │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Controlled
 * <Popover open={open} onOpenChange={setOpen} trigger={<Button>Open</Button>}>
 *   <p>Content here.</p>
 * </Popover>
 *
 * // Uncontrolled
 * <Popover placement="bottom-start" trigger={<Button>Open</Button>}>
 *   <p>Content here.</p>
 * </Popover>
 */

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";

export type PopoverSide      = "top" | "bottom" | "left" | "right";
export type PopoverAlign     = "start" | "center" | "end";
export type PopoverPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

export interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;
  closeOnOutside?: boolean;
  className?: string;
}

const GAP = 8;
const ANIM_OUT_MS = 120;

function parsePlacement(placement: PopoverPlacement): { side: PopoverSide; align: PopoverAlign } {
  const [side, align] = placement.split("-") as [PopoverSide, PopoverAlign | undefined];
  return { side, align: align ?? "center" };
}

/**
 * Compute `top` and `left` for the popover such that it sits on the correct
 * side of the trigger with the correct alignment.
 * All values are in page coordinates (rect + scroll).
 */
function computePosition(
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  side: PopoverSide,
  align: PopoverAlign,
  scrollX: number,
  scrollY: number,
): { top: number; left: number } {
  const tw = triggerRect.width;
  const th = triggerRect.height;
  const pw = popoverRect.width;
  const ph = popoverRect.height;
  const tx = triggerRect.left + scrollX;
  const ty = triggerRect.top  + scrollY;

  let top = 0, left = 0;

  // ── side ──────────────────────────────────────────────────
  switch (side) {
    case "top":    top = ty - ph - GAP;           break;
    case "bottom": top = ty + th + GAP;           break;
    case "left":   left = tx - pw - GAP;          break;
    case "right":  left = tx + tw + GAP;          break;
  }

  // ── alignment on the cross axis ───────────────────────────
  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":  left = tx;                   break;
      case "center": left = tx + tw / 2 - pw / 2; break;
      case "end":    left = tx + tw - pw;          break;
    }
  } else {
    // left | right
    switch (align) {
      case "start":  top = ty;                    break;
      case "center": top = ty + th / 2 - ph / 2; break;
      case "end":    top = ty + th - ph;          break;
    }
  }

  return { top, left };
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  placement = "bottom",
  closeOnOutside = true,
  className,
}) => {
  const isControlled   = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const [leaving,      setLeaving]      = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [position,     setPosition]     = useState({ top: 0, left: 0 });

  const open        = isControlled ? controlledOpen : internalOpen;
  const triggerRef  = useRef<HTMLElement>(null);
  const popoverRef  = useRef<HTMLDivElement>(null);
  const leaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverId   = useId();

  const { side, align } = parsePlacement(placement);

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const close = useCallback(() => {
    setLeaving(true);
    leaveTimer.current = setTimeout(() => {
      setLeaving(false);
      setMounted(false);
      setOpen(false);
    }, ANIM_OUT_MS);
  }, [setOpen]);

  // open → mount
  useEffect(() => {
    if (open) {
      if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
      setLeaving(false);
      setMounted(true);
    } else if (mounted && !leaving) {
      close();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // position after mount — needs popover dimensions so we read them after render
  useEffect(() => {
    if (!mounted || !triggerRef.current || !popoverRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const pRect = popoverRef.current.getBoundingClientRect();
    const pos   = computePosition(tRect, pRect, side, align, window.scrollX, window.scrollY);
    setPosition(pos);
  }, [mounted, side, align]);

  // close on outside click
  useEffect(() => {
    if (!mounted || !closeOnOutside) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mounted, closeOnOutside, close]);

  // close on Escape
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mounted, close]);

  const triggerEl = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => { toggle(); trigger.props.onClick?.(e); },
    "aria-expanded": open,
    "aria-controls": popoverId,
    "aria-haspopup": "dialog" as const,
  });

  return (
    <>
      {triggerEl}
      {mounted &&
        ReactDOM.createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            aria-modal="false"
            className={cn(
              "vyre-popover",
              `vyre-popover--${side}`,
              leaving && "vyre-popover--leaving",
              className
            )}
            style={{ top: position.top, left: position.left }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

Popover.displayName = "VyrePopover";
