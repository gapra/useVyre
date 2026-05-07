/**
 * @vyre/react — Sheet
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Sheet + SheetHeader + SheetBody + SheetFooter│
 * │ Import:     import { Sheet, SheetHeader, SheetBody,     │
 * │             SheetFooter } from "@vyre/react"            │
 * │                                                         │
 * │ Sheet props:                                            │
 * │   open            = boolean (controlled)                │
 * │   onClose         = () => void                          │
 * │   side            = "right"(default)|"left"|"top"|"bottom"│
 * │   size            = "sm"|"md"(default)|"lg"|"full"      │
 * │   closeOnBackdrop = boolean (default: true)             │
 * │   closeOnEsc      = boolean (default: true)             │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Sheet open={open} onClose={() => setOpen(false)} side="right">
 *   <SheetHeader>
 *     <h2>Settings</h2>
 *   </SheetHeader>
 *   <SheetBody>
 *     <p>Sheet content goes here.</p>
 *   </SheetBody>
 *   <SheetFooter>
 *     <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="accent" onClick={handleSave}>Save</Button>
 *   </SheetFooter>
 * </Sheet>
 */

import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetSize = "sm" | "md" | "lg" | "full";

export interface SheetProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  side?: SheetSide;
  size?: SheetSize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children?: React.ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      onClose,
      side = "right",
      size = "md",
      closeOnBackdrop = true,
      closeOnEsc = true,
      className,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const panelRef   = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const trapFocus = useCallback((e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const el = panelRef.current;
      if (!el) return;
      const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }, []);

    useEffect(() => {
      if (!open) return;
      document.addEventListener("keydown", trapFocus);
      if (closeOnEsc) {
        const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onEsc);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        setTimeout(() => panelRef.current?.focus(), 0);
        return () => {
          document.removeEventListener("keydown", trapFocus);
          document.removeEventListener("keydown", onEsc);
          document.body.style.overflow = prev;
        };
      }
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => panelRef.current?.focus(), 0);
      return () => {
        document.removeEventListener("keydown", trapFocus);
        document.body.style.overflow = prev;
      };
    }, [open, trapFocus, closeOnEsc, onClose]);

    if (!open) return null;

    return ReactDOM.createPortal(
      <div
        ref={backdropRef}
        className="vyre-sheet-backdrop"
        onClick={(e) => { if (closeOnBackdrop && e.target === backdropRef.current) onClose(); }}
        role="presentation"
      >
        <div
          ref={(node) => {
            (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          tabIndex={-1}
          className={cn(
            "vyre-sheet",
            `vyre-sheet--${side}`,
            `vyre-sheet--${size}`,
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
Sheet.displayName = "VyreSheet";

// ── Sub-components ─────────────────────────────────────────────

export interface SheetSectionProps extends BaseProps {
  children?: React.ReactNode;
}

export const SheetHeader = React.forwardRef<HTMLDivElement, SheetSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-sheet__header", className)} {...props}>{children}</div>
  )
);
SheetHeader.displayName = "VyreSheetHeader";

export const SheetBody = React.forwardRef<HTMLDivElement, SheetSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-sheet__body", className)} {...props}>{children}</div>
  )
);
SheetBody.displayName = "VyreSheetBody";

export const SheetFooter = React.forwardRef<HTMLDivElement, SheetSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-sheet__footer", className)} {...props}>{children}</div>
  )
);
SheetFooter.displayName = "VyreSheetFooter";
