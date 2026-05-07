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
 * - Sheet          — Slide-in panel overlay (+ SheetHeader, SheetBody, SheetFooter)
 * - Breadcrumb     — Navigation trail (+ BreadcrumbItem)
 * - Pagination     — Page navigation control (v-model)
 * - Table          — Data table (+ TableHead, TableBody, TableRow, TableHeader, TableCell, TableCaption)
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
export { default as Sheet }             from "./components/Sheet/Sheet.vue";
export { default as SheetHeader }       from "./components/Sheet/SheetHeader.vue";
export { default as SheetBody }         from "./components/Sheet/SheetBody.vue";
export { default as SheetFooter }       from "./components/Sheet/SheetFooter.vue";
export { default as Breadcrumb }        from "./components/Breadcrumb/Breadcrumb.vue";
export { default as BreadcrumbItem }    from "./components/Breadcrumb/BreadcrumbItem.vue";
export { default as Pagination }        from "./components/Pagination/Pagination.vue";
export { default as Table }             from "./components/Table/Table.vue";
export { default as TableHead }         from "./components/Table/TableHead.vue";
export { default as TableBody }         from "./components/Table/TableBody.vue";
export { default as TableRow }          from "./components/Table/TableRow.vue";
export { default as TableHeader }       from "./components/Table/TableHeader.vue";
export { default as TableCell }         from "./components/Table/TableCell.vue";
export { default as TableCaption }      from "./components/Table/TableCaption.vue";
export { default as Command }           from "./components/Command/Command.vue";
export { default as CommandInput }      from "./components/Command/CommandInput.vue";
export { default as CommandList }       from "./components/Command/CommandList.vue";
export { default as CommandEmpty }      from "./components/Command/CommandEmpty.vue";
export { default as CommandGroup }      from "./components/Command/CommandGroup.vue";
export { default as CommandItem }       from "./components/Command/CommandItem.vue";
export { default as CommandSeparator }  from "./components/Command/CommandSeparator.vue";
export { default as CommandDialog }     from "./components/Command/CommandDialog.vue";

// ── Composables ───────────────────────────────────────────────
export { useToast }                 from "./composables/useToast";

// ── Types ─────────────────────────────────────────────────────
export type { ToastInput, ToastVariant, ToastItem } from "./composables/useToast";
export type { SelectOption }                        from "./components/Select/Select.vue";
