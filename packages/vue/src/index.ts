/**
 * @vyre/vue — Main export
 *
 * AI CONTEXT:
 * All useVyre Vue 3 components are exported from this single entry point.
 * Import pattern: import { Button, Badge, ... } from "@vyre/vue"
 *
 * Available components:
 * - Button         — Interactive actions and CTAs
 * - Badge          — Status labels and indicators
 * - Card           — Content containers (+ CardHeader, CardBody, CardFooter)
 * - Field          — Form field wrapper with label and hint
 * - Input          — Text input with optional icons (left/right slot)
 * - Textarea       — Multi-line text input
 * - Modal          — Dialog overlay with focus trap (+ ModalHeader, ModalBody, ModalFooter)
 * - ToastViewport  — Place once in app root — renders toast stack
 * - useToast       — Composable: toast({ title, description, variant, duration })
 * - Select         — Accessible dropdown with keyboard nav (v-model)
 * - Tabs           — Tab navigation with v-model (+ TabList, Tab, TabPanels, TabPanel)
 * - Tooltip        — Hover/focus tooltip with placement options
 *
 * CSS must be imported separately:
 * import "@vyre/tokens/css";           ← design tokens (required)
 * import "@vyre/vue/styles";           ← component styles (required)
 */

// ── Components ────────────────────────────────────────────────
export { default as Button }        from "./components/Button/Button.vue";
export { default as Badge }         from "./components/Badge/Badge.vue";
export { default as Card }          from "./components/Card/Card.vue";
export { default as CardHeader }    from "./components/Card/CardHeader.vue";
export { default as CardBody }      from "./components/Card/CardBody.vue";
export { default as CardFooter }    from "./components/Card/CardFooter.vue";
export { default as Field }         from "./components/Input/Field.vue";
export { default as Input }         from "./components/Input/Input.vue";
export { default as Textarea }      from "./components/Input/Textarea.vue";
export { default as Modal }         from "./components/Modal/Modal.vue";
export { default as ModalHeader }   from "./components/Modal/ModalHeader.vue";
export { default as ModalBody }     from "./components/Modal/ModalBody.vue";
export { default as ModalFooter }   from "./components/Modal/ModalFooter.vue";
export { default as ToastViewport } from "./components/Toast/ToastViewport.vue";
export { default as Select }        from "./components/Select/Select.vue";
export { default as Tabs }          from "./components/Tabs/Tabs.vue";
export { default as TabList }       from "./components/Tabs/TabList.vue";
export { default as Tab }           from "./components/Tabs/Tab.vue";
export { default as TabPanels }     from "./components/Tabs/TabPanels.vue";
export { default as TabPanel }      from "./components/Tabs/TabPanel.vue";
export { default as Tooltip }       from "./components/Tooltip/Tooltip.vue";

// ── Composables ───────────────────────────────────────────────
export { useToast }                 from "./composables/useToast";

// ── Types ─────────────────────────────────────────────────────
export type { ToastInput, ToastVariant, ToastItem } from "./composables/useToast";
export type { SelectOption }                        from "./components/Select/Select.vue";
