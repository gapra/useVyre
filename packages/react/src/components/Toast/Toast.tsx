/**
 * @usevyre/react — Toast / Notification
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: ToastProvider + useToast hook               │
 * │ Import:     import { ToastProvider, useToast }          │
 * │             from "@usevyre/react"                          │
 * │                                                         │
 * │ Setup: wrap app root with <ToastProvider>               │
 * │                                                         │
 * │ useToast() returns:                                     │
 * │   toast({ title?, description?, variant?, duration? })  │
 * │   dismiss(id)                                           │
 * │                                                         │
 * │ toast() options:                                        │
 * │   title       = string                                  │
 * │   description = string                                  │
 * │   variant     = "default"|"success"|"warning"|"danger"  │
 * │   duration    = number (ms, default 4000)               │
 * │                Infinity = stays until dismissed         │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // 1. Wrap your app
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // 2. Use inside any component
 * const { toast } = useToast();
 *
 * toast({ title: "Saved", variant: "success" });
 * toast({ title: "Error", description: "Something went wrong", variant: "danger" });
 * toast({ title: "Processing...", duration: Infinity });
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";

// ── Types ─────────────────────────────────────────────────────

export type ToastVariant = "default" | "success" | "warning" | "danger";

export interface ToastInput {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Duration in ms. Use Infinity to keep until manually dismissed. Default: 4000 */
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: string;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

// ── Context ───────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

type Action =
  | { type: "ADD"; payload: ToastItem }
  | { type: "REMOVE"; id: string };

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  switch (action.type) {
    case "ADD":    return [...state, action.payload];
    case "REMOVE": return state.filter((t) => t.id !== action.id);
    default:       return state;
  }
}

let _counter = 0;
const genId = () => `vyre-t-${++_counter}`;

// ── Provider ──────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  // The viewport is portalled into document.body, which does not exist on the
  // server. Gating on `typeof document` alone makes the FIRST client render
  // disagree with the server HTML → hydration mismatch (and a null parentNode
  // crash). Mounting after the first effect keeps both passes identical.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toast = useCallback((input: ToastInput): string => {
    const id = genId();
    dispatch({ type: "ADD", payload: { ...input, id } });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        ReactDOM.createPortal(
          <div
            className="vyre-toast-viewport"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Notifications"
          >
            {toasts.map((t) => (
              <ToastCard key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Toast card (internal) ─────────────────────────────────────

interface ToastCardProps extends ToastItem {
  onDismiss: () => void;
}

function ToastCard({
  title,
  description,
  variant = "default",
  duration = 4000,
  onDismiss,
}: ToastCardProps) {
  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={cn("vyre-toast", `vyre-toast--${variant}`)}
      role="alert"
      data-variant={variant}
    >
      <div className="vyre-toast__content">
        {title && <p className="vyre-toast__title">{title}</p>}
        {description && <p className="vyre-toast__description">{description}</p>}
      </div>
      <button
        className="vyre-toast__close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        type="button"
      >
        <ToastCloseIcon />
      </button>
    </div>
  );
}

function ToastCloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
