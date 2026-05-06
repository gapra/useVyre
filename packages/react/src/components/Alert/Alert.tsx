/**
 * @vyre/react — Alert + AlertDialog
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Alert + AlertDialog                         │
 * │ Import:     import { Alert, AlertDialog } from "@vyre/react"│
 * │                                                         │
 * │ Alert props (inline banner):                            │
 * │   variant  = "info"(default)|"success"|"warning"|"danger"│
 * │   title    = string (optional)                          │
 * │   icon     = ReactNode (optional, overrides default)    │
 * │   onClose  = () => void (shows close button)            │
 * │   children = ReactNode (alert body text)                │
 * │                                                         │
 * │ AlertDialog props (blocking confirmation modal):        │
 * │   open          = boolean (controlled)                  │
 * │   onOpenChange  = (open: boolean) => void               │
 * │   title         = string                                │
 * │   description   = string                                │
 * │   confirmLabel  = string (default "Confirm")            │
 * │   cancelLabel   = string (default "Cancel")             │
 * │   variant       = "danger"(default)|"warning"|"info"    │
 * │   onConfirm     = () => void                            │
 * │   onCancel      = () => void                            │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Inline alert
 * <Alert variant="warning" title="Heads up">
 *   This action may affect other users in your workspace.
 * </Alert>
 *
 * // Dismissible alert
 * <Alert variant="success" title="Saved!" onClose={() => setVisible(false)}>
 *   Your changes were saved successfully.
 * </Alert>
 *
 * // Confirmation dialog (blocking)
 * <AlertDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete workspace?"
 *   description="This will permanently delete the workspace and all its data. This action cannot be undone."
 *   variant="danger"
 *   confirmLabel="Delete workspace"
 *   onConfirm={handleDelete}
 * />
 */

import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";

// ── Shared icons ───────────────────────────────────────────────

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M8 6v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DangerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ICONS = { info: InfoIcon, success: SuccessIcon, warning: WarningIcon, danger: DangerIcon };

// ── Alert (inline) ─────────────────────────────────────────────

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  icon,
  onClose,
  children,
  className,
}) => {
  const Icon = ICONS[variant];

  return (
    <div
      role="alert"
      className={cn("vyre-alert", `vyre-alert--${variant}`, className)}
    >
      <span className="vyre-alert__icon" aria-hidden="true">
        {icon ?? <Icon />}
      </span>
      <div className="vyre-alert__body">
        {title && <p className="vyre-alert__title">{title}</p>}
        {children && <div className="vyre-alert__description">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="vyre-alert__close"
          aria-label="Dismiss"
          onClick={onClose}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = "VyreAlert";

// ── AlertDialog (blocking modal) ───────────────────────────────

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "danger" | "warning" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}

const FOCUSABLE = [
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  className,
}) => {
  const dialogRef  = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cancelRef  = useRef<HTMLButtonElement>(null);

  const handleCancel = useCallback(() => {
    onCancel?.();
    onOpenChange(false);
  }, [onCancel, onOpenChange]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    onOpenChange(false);
  }, [onConfirm, onOpenChange]);

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const el = dialogRef.current;
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") handleCancel(); };
    document.addEventListener("keydown", onEsc);
    setTimeout(() => cancelRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, trapFocus, handleCancel]);

  if (!open) return null;

  const Icon = ICONS[variant];

  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className="vyre-alert-dialog-backdrop"
      onClick={(e) => { if (e.target === backdropRef.current) handleCancel(); }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="vyre-ad-title"
        aria-describedby={description ? "vyre-ad-desc" : undefined}
        className={cn("vyre-alert-dialog", `vyre-alert-dialog--${variant}`, className)}
        tabIndex={-1}
      >
        <div className="vyre-alert-dialog__icon-wrap">
          <span className={cn("vyre-alert-dialog__icon", `vyre-alert-dialog__icon--${variant}`)}>
            <Icon />
          </span>
        </div>
        <div className="vyre-alert-dialog__body">
          <h2 id="vyre-ad-title" className="vyre-alert-dialog__title">{title}</h2>
          {description && (
            <p id="vyre-ad-desc" className="vyre-alert-dialog__description">{description}</p>
          )}
        </div>
        <div className="vyre-alert-dialog__footer">
          <button
            ref={cancelRef}
            type="button"
            className="vyre-btn vyre-btn--ghost vyre-btn--sm"
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cn(
              "vyre-btn vyre-btn--sm",
              variant === "danger"  && "vyre-btn--danger",
              variant === "warning" && "vyre-btn--primary",
              variant === "info"    && "vyre-btn--accent",
            )}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

AlertDialog.displayName = "VyreAlertDialog";
