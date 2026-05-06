/**
 * @vyre/react — Main export
 *
 * AI CONTEXT:
 * All useVyre React components are exported from this single entry point.
 * Import pattern: import { Button, Badge, Card, ... } from "@vyre/react"
 *
 * Available components:
 * - Button         — Interactive actions and CTAs
 * - Badge          — Status labels and indicators
 * - Card           — Content containers (+ CardHeader, CardBody, CardFooter)
 * - Field          — Form field wrapper with label and hint
 * - Input          — Text input with optional icons
 * - Textarea       — Multi-line text input
 * - Modal          — Dialog overlay with focus trap (+ ModalHeader, ModalBody, ModalFooter)
 * - ToastProvider  — Context provider for toast notifications (wrap app root)
 * - useToast       — Hook: toast({ title, description, variant, duration })
 * - Select         — Accessible dropdown with keyboard navigation
 * - Tabs           — Tab navigation (+ TabList, Tab, TabPanels, TabPanel)
 * - Tooltip        — Hover/focus tooltip with placement options
 *
 * CSS must be imported separately:
 * import "@vyre/tokens/css";           ← design tokens (required)
 * import "@vyre/react/styles";         ← component styles (required)
 */

// ── Components ────────────────────────────────────────────────
export { Button }                                           from "./components/Button/Button";
export { Badge }                                            from "./components/Badge/Badge";
export { Card, CardHeader, CardBody, CardFooter }           from "./components/Card/Card";
export { Field, Input, Textarea }                           from "./components/Input/Input";
export { Modal, ModalHeader, ModalBody, ModalFooter }       from "./components/Modal/Modal";
export { ToastProvider, useToast }                          from "./components/Toast/Toast";
export { Select }                                           from "./components/Select/Select";
export { Tabs, TabList, Tab, TabPanels, TabPanel }          from "./components/Tabs/Tabs";
export { Tooltip }                                          from "./components/Tooltip/Tooltip";

// ── Types ─────────────────────────────────────────────────────
export type { ButtonProps }                                 from "./components/Button/Button";
export type { BadgeProps }                                  from "./components/Badge/Badge";
export type { CardProps, CardSectionProps }                 from "./components/Card/Card";
export type { FieldProps, InputProps, TextareaProps }       from "./components/Input/Input";
export type { ModalProps, ModalSectionProps, ModalSize }    from "./components/Modal/Modal";
export type { ToastInput, ToastVariant }                    from "./components/Toast/Toast";
export type { SelectProps, SelectOption, SelectSize }       from "./components/Select/Select";
export type { TabsProps, TabListProps, TabProps, TabPanelsProps, TabPanelProps } from "./components/Tabs/Tabs";
export type { TooltipProps, TooltipPlacement }              from "./components/Tooltip/Tooltip";

// ── Shared types ──────────────────────────────────────────────
export type { Variant, Size, FieldState, BadgeVariant, BaseProps } from "./types";

// ── Utilities ─────────────────────────────────────────────────
export { cn } from "./utils/cn";
