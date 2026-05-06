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
 * - Accordion      — Collapsible sections (+ AccordionItem, AccordionTrigger, AccordionContent)
 * - Avatar         — User avatar with fallback initials and status indicator
 * - Checkbox       — Checkbox input with indeterminate state support
 * - Switch         — Toggle switch (role="switch")
 * - Progress       — Progress bar with indeterminate mode
 * - Slider         — Range slider with custom visual track
 * - Separator      — Horizontal or vertical divider
 * - Label          — Form label with required indicator
 * - Skeleton       — Loading placeholder (rect, circle, text variants)
 * - Popover        — Floating content panel anchored to a trigger (v-model)
 * - DropdownMenu   — Contextual action menu (+ DropdownItem, DropdownSeparator)
 * - Alert          — Inline status banner (info/success/warning/danger)
 * - AlertDialog    — Blocking confirmation modal (v-model)
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
export { default as Tooltip }           from "./components/Tooltip/Tooltip.vue";
export { default as Accordion }         from "./components/Accordion/Accordion.vue";
export { default as AccordionItem }     from "./components/Accordion/AccordionItem.vue";
export { default as AccordionTrigger }  from "./components/Accordion/AccordionTrigger.vue";
export { default as AccordionContent }  from "./components/Accordion/AccordionContent.vue";
export { default as Avatar }            from "./components/Avatar/Avatar.vue";
export { default as Checkbox }          from "./components/Checkbox/Checkbox.vue";
export { default as Switch }            from "./components/Switch/Switch.vue";
export { default as Progress }          from "./components/Progress/Progress.vue";
export { default as Slider }            from "./components/Slider/Slider.vue";
export { default as Separator }         from "./components/Separator/Separator.vue";
export { default as Label }             from "./components/Label/Label.vue";
export { default as Skeleton }          from "./components/Skeleton/Skeleton.vue";
export { default as Popover }           from "./components/Popover/Popover.vue";
export { default as DropdownMenu }           from "./components/DropdownMenu/DropdownMenu.vue";
export { default as DropdownItem }           from "./components/DropdownMenu/DropdownItem.vue";
export { default as DropdownLabel }          from "./components/DropdownMenu/DropdownLabel.vue";
export { default as DropdownSeparator }      from "./components/DropdownMenu/DropdownSeparator.vue";
export { default as DropdownCheckboxItem }   from "./components/DropdownMenu/DropdownCheckboxItem.vue";
export { default as DropdownRadioGroup }     from "./components/DropdownMenu/DropdownRadioGroup.vue";
export { default as DropdownRadioItem }      from "./components/DropdownMenu/DropdownRadioItem.vue";
export { default as DropdownSub }            from "./components/DropdownMenu/DropdownSub.vue";
export { default as Alert }             from "./components/Alert/Alert.vue";
export { default as AlertDialog }       from "./components/Alert/AlertDialog.vue";

// ── Composables ───────────────────────────────────────────────
export { useToast }                 from "./composables/useToast";

// ── Types ─────────────────────────────────────────────────────
export type { ToastInput, ToastVariant, ToastItem } from "./composables/useToast";
export type { SelectOption }                        from "./components/Select/Select.vue";
