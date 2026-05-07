/**
 * @usevyre/vue — useToast composable
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Composable: useToast                                    │
 * │ Import:     import { useToast } from "@usevyre/vue"        │
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
export type ToastVariant = "default" | "success" | "warning" | "danger";
export interface ToastInput {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    /** Duration in ms. Infinity = manual dismiss only. Default: 4000 */
    duration?: number;
}
export interface ToastItem extends ToastInput {
    id: string;
}
export declare function useToast(): {
    toast: (input: ToastInput) => string;
    dismiss: (id: string) => void;
    toasts: import("vue").Reactive<ToastItem[]>;
};
