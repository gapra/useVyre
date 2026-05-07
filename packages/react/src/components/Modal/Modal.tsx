/**
 * @usevyre/react — Modal / Dialog
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Modal + ModalHeader + ModalBody + ModalFooter│
 * │ Import:     import { Modal, ModalHeader, ModalBody,     │
 * │             ModalFooter } from "@usevyre/react"            │
 * │                                                         │
 * │ Modal props:                                            │
 * │   open             = boolean (controlled)               │
 * │   onClose          = () => void                         │
 * │   size             = "sm"|"md"(default)|"lg"|"full"     │
 * │   closeOnBackdrop  = boolean (default: true)            │
 * │   closeOnEsc       = boolean (default: true)            │
 * │   initialFocus     = RefObject<HTMLElement>             │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Confirmation dialog
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} size="sm">
 *   <ModalHeader>
 *     <h2>Confirm deletion</h2>
 *   </ModalHeader>
 *   <ModalBody>
 *     <p>This action cannot be undone.</p>
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *   </ModalFooter>
 * </Modal>
 */

import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  /** Close modal when clicking the backdrop. Default: true */
  closeOnBackdrop?: boolean;
  /** Close modal when pressing Escape. Default: true */
  closeOnEsc?: boolean;
  /** Element to focus on open. Defaults to the modal container. */
  initialFocus?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  /** Accessible label for the dialog (if no visible title) */
  "aria-label"?: string;
  /** ID of the element that labels the dialog */
  "aria-labelledby"?: string;
}

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      size = "md",
      closeOnBackdrop = true,
      closeOnEsc = true,
      initialFocus,
      className,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    forwardedRef
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    const trapFocus = useCallback((e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const el = containerRef.current;
      if (!el) return;
      const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }, []);

    const handleEsc = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEsc) onClose();
      },
      [closeOnEsc, onClose]
    );

    useEffect(() => {
      if (!open) return;

      document.addEventListener("keydown", handleEsc);
      document.addEventListener("keydown", trapFocus);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus();
        } else {
          containerRef.current?.focus();
        }
      }, 0);

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.removeEventListener("keydown", trapFocus);
        document.body.style.overflow = prevOverflow;
        clearTimeout(timer);
      };
    }, [open, handleEsc, trapFocus, initialFocus]);

    if (!open) return null;

    return ReactDOM.createPortal(
      <div
        ref={backdropRef}
        className="vyre-modal-backdrop"
        onClick={(e) => {
          if (closeOnBackdrop && e.target === backdropRef.current) onClose();
        }}
        role="presentation"
      >
        <div
          ref={setRef}
          className={cn("vyre-modal", `vyre-modal--${size}`, className)}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = "VyreModal";

// ── Sub-components ─────────────────────────────────────────────

export interface ModalSectionProps extends BaseProps {
  children?: React.ReactNode;
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-modal__header", className)} {...props}>
      {children}
    </div>
  )
);
ModalHeader.displayName = "VyreModalHeader";

export const ModalBody = React.forwardRef<HTMLDivElement, ModalSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-modal__body", className)} {...props}>
      {children}
    </div>
  )
);
ModalBody.displayName = "VyreModalBody";

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-modal__footer", className)} {...props}>
      {children}
    </div>
  )
);
ModalFooter.displayName = "VyreModalFooter";
