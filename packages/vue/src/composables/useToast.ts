/**
 * @vyre/vue — useToast composable
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Composable: useToast                                    │
 * │ Import:     import { useToast } from "@vyre/vue"        │
 * │                                                         │
 * │ Setup: add <ToastViewport /> anywhere in your app root  │
 * │        (once, renders the toast stack via Teleport)     │
 * │                                                         │
 * │ Returns:                                                │
 * │   toast({ title?, description?, variant?, duration? })  │
 * │   → returns id: string                                  │
 * │   dismiss(id: string)                                   │
 * │                                                         │
 * │ toast() options:                                        │
 * │   title       = string                                  │
 * │   description = string                                  │
 * │   variant     = "default"|"success"|"warning"|"danger"  │
 * │   duration    = number ms (default 4000)                │
 * │                Infinity = stays until dismissed         │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // main.ts or App.vue — add viewport once
 * <ToastViewport />
 *
 * // any component
 * const { toast } = useToast()
 * toast({ title: 'Saved!', variant: 'success' })
 * toast({ title: 'Processing…', duration: Infinity })
 */

import { reactive } from "vue";

export type ToastVariant = "default" | "success" | "warning" | "danger";

export interface ToastInput {
  title?:       string;
  description?: string;
  variant?:     ToastVariant;
  /** Duration in ms. Infinity = manual dismiss only. Default: 4000 */
  duration?:    number;
}

export interface ToastItem extends ToastInput {
  id: string;
}

// Module-level reactive state — shared across all composable calls
const _toasts = reactive<ToastItem[]>([]);
let _counter  = 0;

export function useToast() {
  function toast(input: ToastInput): string {
    const id = `vyre-t-${++_counter}`;
    _toasts.push({ duration: 4000, variant: "default", ...input, id });
    return id;
  }

  function dismiss(id: string) {
    const idx = _toasts.findIndex((t) => t.id === id);
    if (idx >= 0) _toasts.splice(idx, 1);
  }

  return { toast, dismiss, toasts: _toasts };
}
