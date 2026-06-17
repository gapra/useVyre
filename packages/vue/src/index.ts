/**
 * @usevyre/vue — Main export
 *
 * AI CONTEXT:
 * All useVyre Vue 3 components are exported from this single entry point.
 * Import pattern: import { Button, Badge, ... } from "@usevyre/vue"
 *
 * Available components:
 * - Button         — Interactive actions and CTAs
 * - Badge          — Status labels and indicators
 * - Card           — Content containers (+ CardHeader, CardBody, CardFooter)
 * - Field          — Form field wrapper (props-based) + composable parts (FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet)
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
 * - RadioGroup     — Controlled single-choice group (+ Radio); options array or composable children
 * - RichTextEditor — Controlled WYSIWYG editor (HTML v-model); toolbar bold/italic/heading/list/link; zero deps
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
 * - ButtonGroup    — Groups buttons horizontally/vertically with optional border collapse (attached mode)
 * - TagsInput      — Multi-tag input (v-model): Enter/comma to add, × to remove, Backspace to delete last
 * - Combobox       — Searchable select (v-model): type to filter options, keyboard navigation
 * - DataGrid       — Table with built-in column sorting, loading skeletons, empty state (v-model:sort-key/sort-dir)
 * - Tag            — Standalone display tag/chip: variant, size, removable (@remove), clickable (@click)
 * - TagGroup       — Read-only container that lays out multiple Tag elements with wrapping + gap
 * - Item           — Layout primitive for list/settings rows (+ ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions)
 * - Calendar       — Inline date grid; mode single/range/multiple, optional time
 * - DatePicker     — Input trigger + popover Calendar (single/range/multiple)
 * - DateRangePicker — Start/end date range picker with dual-month view and preset shortcuts; built on Calendar
 * - Kanban         — Controlled board with drag-and-drop cards between columns; native HTML5 DnD, zero deps
 * - Conversation   — Controlled chat/inbox thread: grouped bubbles, avatars, day separators, status, optional composer
 * - Stack          — Flex layout primitive (use instead of <div :style="{display:'flex'}">); token-locked gap/align/justify
 * - Grid           — CSS grid primitive: columns (1-12 or auto-fit), rows, flow, token-locked gap (+ GridItem for colSpan/rowSpan placement)
 * - Box            — Spacing-only container (padding/margin tokens) + controlled style escape hatch
 * - Form           — Controlled, data-driven form: built-in validation rules, errors auto-map to Field (+ FormField)
 * - NumberInput    — Controlled numeric input with −/+ stepper; v-model number|null; clamp/keyboard; works in FormField
 * - ToggleGroup    — Segmented control: single/multiple, v-model adaptive, options[] or ToggleItem children (+ ToggleItem)
 * - Stepper        — Multi-step flow indicator + controller; v-model 0-based index (+ StepperNav, Step, StepPanel)
 * - EmptyState     — Placeholder for empty lists/tables/search: icon + title + description + CTA slot; variant default/search/error
 * - Stat           — Dashboard KPI: label + large value + delta with explicit trend (up/down/neutral) (+ StatGroup)
 * - Timeline       — Vertical activity feed for audit logs/history: items[] or TimelineItem children; status dot + connector (+ TimelineItem)
 * - Tree           — Hierarchical view (file explorer/nested nav): nested :data[], v-model expanded/selected, recursive, keyboard
 * - OTPInput       — Segmented one-time-code input (2FA/verification): v-model string, paste-aware, auto-advance, @complete
 * - Carousel       — Accessible content slider: v-model index, snap scroll, dots, arrows, keyboard, loop/autoPlay (+ CarouselSlide)
 *
 * CSS must be imported separately:
 * import "@usevyre/tokens/css";           ← design tokens (required)
 * import "@usevyre/vue/styles";           ← component styles (required)
 */

// ── Components ────────────────────────────────────────────────
export { default as Button }        from "./components/Button/Button.vue";
export { default as Badge }         from "./components/Badge/Badge.vue";
export { default as Card }          from "./components/Card/Card.vue";
export { default as CardHeader }    from "./components/Card/CardHeader.vue";
export { default as CardBody }      from "./components/Card/CardBody.vue";
export { default as CardFooter }    from "./components/Card/CardFooter.vue";
export { default as Field }            from "./components/Input/Field.vue";
export { default as FieldLabel }       from "./components/Input/FieldLabel.vue";
export { default as FieldDescription } from "./components/Input/FieldDescription.vue";
export { default as FieldError }       from "./components/Input/FieldError.vue";
export { default as FieldGroup }       from "./components/Input/FieldGroup.vue";
export { default as FieldSet }         from "./components/Input/FieldSet.vue";
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
export { default as RadioGroup }        from "./components/Radio/RadioGroup.vue";
export { default as Radio }             from "./components/Radio/Radio.vue";
export { default as RichTextEditor }    from "./components/RichTextEditor/RichTextEditor.vue";
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
export { default as Calendar }          from "./components/Calendar/Calendar.vue";
export { default as DatePicker }        from "./components/Calendar/DatePicker.vue";
export { default as DateRangePicker }   from "./components/DateRangePicker/DateRangePicker.vue";
export { default as Text }              from "./components/Typography/Typography.vue";
export { default as Heading }           from "./components/Typography/Heading.vue";
export { default as Lead }              from "./components/Typography/Lead.vue";
export { default as Code }              from "./components/Typography/Code.vue";
export { default as Blockquote }        from "./components/Typography/Blockquote.vue";
export { default as AppLayout }         from "./components/Sidebar/AppLayout.vue";
export { default as AppShell }          from "./components/Sidebar/AppShell.vue";
export { default as AppBar }            from "./components/Sidebar/AppBar.vue";
export { default as SidebarTrigger }    from "./components/Sidebar/SidebarTrigger.vue";
export { default as PageContent }       from "./components/Sidebar/PageContent.vue";
export { default as Sidebar }           from "./components/Sidebar/Sidebar.vue";
export { default as SidebarHeader }     from "./components/Sidebar/SidebarHeader.vue";
export { default as SidebarContent }    from "./components/Sidebar/SidebarContent.vue";
export { default as SidebarSection }    from "./components/Sidebar/SidebarSection.vue";
export { default as SidebarItem }       from "./components/Sidebar/SidebarItem.vue";
export { default as SidebarFooter }     from "./components/Sidebar/SidebarFooter.vue";

export { default as ButtonGroup }   from "./components/ButtonGroup/ButtonGroup.vue";
export { default as TagsInput }     from "./components/TagsInput/TagsInput.vue";
export { default as Combobox }      from "./components/Combobox/Combobox.vue";
export { default as DataGrid }      from "./components/DataGrid/DataGrid.vue";
export { default as Tag }           from "./components/Tag/Tag.vue";
export { default as TagGroup }      from "./components/Tag/TagGroup.vue";
export { default as Item }            from "./components/Item/Item.vue";
export { default as ItemGroup }       from "./components/Item/ItemGroup.vue";
export { default as ItemMedia }       from "./components/Item/ItemMedia.vue";
export { default as ItemContent }     from "./components/Item/ItemContent.vue";
export { default as ItemTitle }       from "./components/Item/ItemTitle.vue";
export { default as ItemDescription } from "./components/Item/ItemDescription.vue";
export { default as ItemActions }     from "./components/Item/ItemActions.vue";
export { default as Kanban }          from "./components/Kanban/Kanban.vue";
export { default as Conversation }    from "./components/Conversation/Conversation.vue";

export { default as Stack }           from "./components/Layout/Stack.vue";
export { default as Grid }            from "./components/Layout/Grid.vue";
export { default as GridItem }        from "./components/Layout/GridItem.vue";
export { default as Box }             from "./components/Layout/Box.vue";

export { default as Form }            from "./components/Form/Form.vue";
export { default as FormField }       from "./components/Form/FormField.vue";
export type { FormRules }             from "./components/Form/form-context";
export { default as NumberInput }     from "./components/NumberInput/NumberInput.vue";
export { default as ToggleGroup }     from "./components/ToggleGroup/ToggleGroup.vue";
export { default as ToggleItem }      from "./components/ToggleGroup/ToggleItem.vue";
export { default as Stepper }         from "./components/Stepper/Stepper.vue";
export { default as StepperNav }      from "./components/Stepper/StepperNav.vue";
export { default as Step }            from "./components/Stepper/Step.vue";
export { default as StepPanel }       from "./components/Stepper/StepPanel.vue";
export { default as EmptyState }      from "./components/EmptyState/EmptyState.vue";
export { default as Stat }            from "./components/Stat/Stat.vue";
export { default as StatGroup }       from "./components/Stat/StatGroup.vue";
export { default as Timeline }        from "./components/Timeline/Timeline.vue";
export { default as TimelineItem }    from "./components/Timeline/TimelineItem.vue";
export { default as Tree }            from "./components/Tree/Tree.vue";
export { default as OTPInput }        from "./components/OTPInput/OTPInput.vue";
export { default as Carousel }        from "./components/Carousel/Carousel.vue";
export { default as CarouselSlide }   from "./components/Carousel/CarouselSlide.vue";
export { default as Sparkline }       from "./components/Sparkline/Sparkline.vue";
export { default as LineChart }       from "./components/LineChart/LineChart.vue";
export { default as AreaChart }       from "./components/AreaChart/AreaChart.vue";

// ── Composables ───────────────────────────────────────────────
export { useToast }                 from "./composables/useToast";

// ── Types ─────────────────────────────────────────────────────
export type { ToastInput, ToastVariant, ToastItem } from "./composables/useToast";
export type { SelectOption }                        from "./components/Select/types";
