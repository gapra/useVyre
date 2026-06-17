/**
 * @usevyre/react — Main export
 *
 * AI CONTEXT:
 * All useVyre React components are exported from this single entry point.
 * Import pattern: import { Button, Badge, Card, ... } from "@usevyre/react"
 *
 * Available components:
 * - Button         — Interactive actions and CTAs
 * - Badge          — Status labels and indicators
 * - Card           — Content containers (+ CardHeader, CardBody, CardFooter)
 * - Field          — Form field wrapper (props-based) + composable parts (FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet)
 * - Input          — Text input with optional icons
 * - Textarea       — Multi-line text input
 * - Modal          — Dialog overlay with focus trap (+ ModalHeader, ModalBody, ModalFooter)
 * - ToastProvider  — Context provider for toast notifications (wrap app root)
 * - useToast       — Hook: toast({ title, description, variant, duration })
 * - Select         — Accessible dropdown with keyboard navigation
 * - Tabs           — Tab navigation (+ TabList, Tab, TabPanels, TabPanel)
 * - Tooltip        — Hover/focus tooltip with placement options
 * - Accordion      — Collapsible sections (+ AccordionItem, AccordionTrigger, AccordionContent)
 * - Avatar         — User avatar with image fallback and status dot
 * - Checkbox       — Checkbox input with indeterminate state
 * - RadioGroup     — Controlled single-choice group (+ Radio); options array or composable children
 * - RichTextEditor — Controlled WYSIWYG editor (HTML value); toolbar bold/italic/heading/list/link; zero deps
 * - Switch         — Toggle switch (on/off)
 * - Slider         — Range input with custom track
 * - Progress       — Linear progress bar with indeterminate mode
 * - Separator      — Horizontal/vertical divider
 * - Label          — Standalone form label
 * - Skeleton       — Loading placeholder with pulse animation
 * - Popover        — Floating content panel anchored to a trigger
 * - DropdownMenu   — Contextual action menu (+ DropdownItem, DropdownSeparator)
 * - Alert          — Inline status banner (info/success/warning/danger)
 * - AlertDialog    — Blocking confirmation modal
 * - Sheet          — Slide-in panel overlay (+ SheetHeader, SheetBody, SheetFooter)
 * - Breadcrumb     — Navigation trail (+ BreadcrumbItem)
 * - Pagination     — Page navigation control
 * - Table          — Data table (+ TableHead, TableBody, TableRow, TableHeader, TableCell, TableCaption)
 * - ButtonGroup    — Groups buttons horizontally/vertically with optional border collapse (attached mode)
 * - TagsInput      — Multi-tag input: Enter/comma to add, × to remove, Backspace to delete last
 * - Combobox       — Searchable select: type to filter options, keyboard navigation, controlled value
 * - DataGrid       — Table with built-in column sorting (asc/desc), loading skeletons, empty state
 * - Tag            — Standalone display tag/chip: variant, size, onRemove (× button), onClick (interactive)
 * - TagGroup       — Read-only container that lays out multiple Tag elements with wrapping + gap
 * - Item           — Layout primitive for list/settings rows (+ ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions)
 * - Calendar       — Inline date grid; mode single/range/multiple, optional time
 * - DatePicker     — Input trigger + popover Calendar (single/range/multiple)
 * - DateRangePicker — Start/end date range picker with dual-month view and preset shortcuts; built on Calendar
 * - Kanban         — Controlled board with drag-and-drop cards between columns; native HTML5 DnD, zero deps
 * - Conversation   — Controlled chat/inbox thread: grouped bubbles, avatars, day separators, status, optional composer
 * - Stack          — Flex layout primitive (use instead of <div style="display:flex">); token-locked gap/align/justify
 * - Grid           — CSS grid primitive: columns (1-12 or auto-fit), rows, flow, token-locked gap (+ GridItem for colSpan/rowSpan placement)
 * - Box            — Spacing-only container (padding/margin tokens) + controlled style escape hatch
 * - Form           — Controlled, data-driven form: built-in validation rules, errors auto-map to Field (+ FormField)
 * - NumberInput    — Controlled numeric input with −/+ stepper; emits number|null; clamp/keyboard; drops into FormField
 * - ToggleGroup    — Segmented control: single/multiple select, options[] or ToggleItem children; emits value (+ ToggleItem)
 * - Stepper        — Multi-step flow indicator + controller (wizard/checkout); controlled 0-based index (+ StepperNav, Step, StepPanel)
 * - EmptyState     — Placeholder for empty lists/tables/search: icon + title + description + CTA; variant default/search/error
 * - Stat           — Dashboard KPI: label + large value + delta with explicit trend (up/down/neutral) (+ StatGroup)
 * - Timeline       — Vertical activity feed for audit logs/history: items[] or TimelineItem children; status dot + connector (+ TimelineItem)
 * - Tree           — Hierarchical view (file explorer/nested nav): nested data[], controlled expanded/selected, recursive, keyboard
 * - OTPInput       — Segmented one-time-code input (2FA/verification): controlled string, paste-aware, auto-advance, onComplete
 * - Carousel       — Accessible content slider: controlled index, snap scroll, dots, arrows, keyboard, loop/autoPlay (+ CarouselSlide)
 *
 * CSS must be imported separately:
 * import "@usevyre/tokens/css";           ← design tokens (required)
 * import "@usevyre/react/styles";         ← component styles (required)
 */

// ── Components ────────────────────────────────────────────────
export { Button }                                           from "./components/Button/Button";
export { Badge }                                            from "./components/Badge/Badge";
export { Card, CardHeader, CardBody, CardFooter }           from "./components/Card/Card";
export {
  Field, FieldLabel, FieldDescription, FieldError,
  FieldGroup, FieldSet, Input, Textarea,
}                                                           from "./components/Input/Input";
export { Modal, ModalHeader, ModalBody, ModalFooter }       from "./components/Modal/Modal";
export { ToastProvider, useToast }                          from "./components/Toast/Toast";
export { Select }                                           from "./components/Select/Select";
export { Tabs, TabList, Tab, TabPanels, TabPanel }          from "./components/Tabs/Tabs";
export { Tooltip }                                          from "./components/Tooltip/Tooltip";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/Accordion/Accordion";
export { Avatar }                                           from "./components/Avatar/Avatar";
export { Checkbox }                                         from "./components/Checkbox/Checkbox";
export { RadioGroup, Radio }                                from "./components/Radio/Radio";
export { RichTextEditor }                                   from "./components/RichTextEditor/RichTextEditor";
export { Switch }                                           from "./components/Switch/Switch";
export { Slider }                                           from "./components/Slider/Slider";
export { Progress }                                         from "./components/Progress/Progress";
export { Separator }                                        from "./components/Separator/Separator";
export { Label }                                            from "./components/Label/Label";
export { Skeleton }                                         from "./components/Skeleton/Skeleton";
export { Popover }                                          from "./components/Popover/Popover";
export {
  DropdownMenu, DropdownItem, DropdownSeparator,
  DropdownLabel, DropdownCheckboxItem,
  DropdownRadioGroup, DropdownRadioItem,
  DropdownSub,
}                                                           from "./components/DropdownMenu/DropdownMenu";
export { Alert, AlertDialog }                               from "./components/Alert/Alert";
export { Sheet, SheetHeader, SheetBody, SheetFooter }       from "./components/Sheet/Sheet";
export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "./components/Breadcrumb/Breadcrumb";
export { Pagination }                                       from "./components/Pagination/Pagination";
export {
  Table, TableHead, TableBody, TableRow,
  TableHeader, TableCell, TableCaption,
}                                                           from "./components/Table/Table";
export {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandDialog,
}                                                           from "./components/Command/Command";
export { ButtonGroup }                                      from "./components/ButtonGroup/ButtonGroup";
export { TagsInput }                                        from "./components/TagsInput/TagsInput";
export { Combobox }                                         from "./components/Combobox/Combobox";
export { DataGrid }                                         from "./components/DataGrid/DataGrid";
export { Tag }                                              from "./components/Tag/Tag";
export { TagGroup }                                         from "./components/Tag/TagGroup";
export { Calendar }                                         from "./components/Calendar/Calendar";
export { DatePicker }                                       from "./components/Calendar/DatePicker";
export { DateRangePicker }                                  from "./components/DateRangePicker/DateRangePicker";
export {
  Item, ItemGroup, ItemMedia, ItemContent,
  ItemTitle, ItemDescription, ItemActions,
}                                                           from "./components/Item/Item";
export { Kanban }                                           from "./components/Kanban/Kanban";
export { Conversation }                                     from "./components/Conversation/Conversation";
export type {
  CalendarProps, CalendarSingleProps, CalendarRangeProps,
  CalendarMultipleProps, CalendarBaseProps, DatePickerProps, CalendarMode,
}                                                           from "./components/Calendar/Calendar";
export { Text, Heading, Lead, Code, Blockquote }            from "./components/Typography/Typography";
export type {
  TextProps, HeadingProps, LeadProps, CodeProps, BlockquoteProps,
}                                                           from "./components/Typography/Typography";
export { Stack, Grid, GridItem, Box }                       from "./components/Layout/Layout";
export type {
  StackProps, GridProps, GridItemProps, BoxProps, SpaceToken,
  StackDirection, StackWrap, StackAlign, StackJustify,
  StackAlignContent, StackAlignSelf, StackBasis,
  GridAlign, GridFlow, GridColumns,
}                                                           from "./components/Layout/Layout";
export { Form, FormField }                                  from "./components/Form/Form";
export type { FormProps, FormFieldProps, FormRules }        from "./components/Form/Form";
export { NumberInput }                                      from "./components/NumberInput/NumberInput";
export type { NumberInputProps }                            from "./components/NumberInput/NumberInput";
export { ToggleGroup, ToggleItem }                          from "./components/ToggleGroup/ToggleGroup";
export type { ToggleGroupProps, ToggleItemProps, ToggleOption } from "./components/ToggleGroup/ToggleGroup";
export { Stepper, StepperNav, Step, StepPanel }             from "./components/Stepper/Stepper";
export type { StepperProps, StepperNavProps, StepProps, StepPanelProps } from "./components/Stepper/Stepper";
export { EmptyState }                                       from "./components/EmptyState/EmptyState";
export type { EmptyStateProps, EmptyStateVariant }          from "./components/EmptyState/EmptyState";
export { Stat, StatGroup }                                  from "./components/Stat/Stat";
export type { StatProps, StatGroupProps, StatTrend }        from "./components/Stat/Stat";
export { Sparkline }                                        from "./components/Sparkline/Sparkline";
export type { SparklineProps }                              from "./components/Sparkline/Sparkline";
export { Timeline, TimelineItem }                           from "./components/Timeline/Timeline";
export type { TimelineProps, TimelineItemProps, TimelineItemData, TimelineStatus } from "./components/Timeline/Timeline";
export { Tree }                                             from "./components/Tree/Tree";
export type { TreeProps, TreeNode }                         from "./components/Tree/Tree";
export { OTPInput }                                         from "./components/OTPInput/OTPInput";
export type { OTPInputProps }                               from "./components/OTPInput/OTPInput";
export { Carousel, CarouselSlide }                          from "./components/Carousel/Carousel";
export type { CarouselProps, CarouselSlideProps }           from "./components/Carousel/Carousel";
export {
  AppLayout, AppShell, AppBar, PageContent, SidebarTrigger,
  Sidebar, SidebarHeader, SidebarContent,
  SidebarSection, SidebarItem, SidebarFooter,
  useAppLayout,
}                                                           from "./components/Sidebar/Sidebar";
export type {
  AppLayoutProps, AppShellProps, AppBarProps,
  PageContentProps, SidebarTriggerProps,
  SidebarProps, SidebarHeaderProps, SidebarContentProps,
  SidebarSectionProps, SidebarItemProps, SidebarFooterProps,
}                                                           from "./components/Sidebar/Sidebar";

// ── Types ─────────────────────────────────────────────────────
export type { ButtonProps }                                 from "./components/Button/Button";
export type { BadgeProps }                                  from "./components/Badge/Badge";
export type { CardProps, CardSectionProps }                 from "./components/Card/Card";
export type {
  FieldProps, FieldLabelProps, FieldDescriptionProps, FieldErrorProps,
  FieldGroupProps, FieldSetProps, InputProps, TextareaProps,
}                                                           from "./components/Input/Input";
export type { ModalProps, ModalSectionProps, ModalSize }    from "./components/Modal/Modal";
export type { ToastInput, ToastVariant }                    from "./components/Toast/Toast";
export type { SelectProps, SelectOption, SelectSize }       from "./components/Select/Select";
export type { TabsProps, TabListProps, TabProps, TabPanelsProps, TabPanelProps } from "./components/Tabs/Tabs";
export type { TooltipProps, TooltipPlacement }              from "./components/Tooltip/Tooltip";
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps } from "./components/Accordion/Accordion";
export type { AvatarProps }                                 from "./components/Avatar/Avatar";
export type { CheckboxProps }                               from "./components/Checkbox/Checkbox";
export type {
  RadioGroupProps, RadioProps, RadioOption,
}                                                           from "./components/Radio/Radio";
export type {
  RichTextEditorProps, RichTextTool,
}                                                           from "./components/RichTextEditor/RichTextEditor";
export type { SwitchProps }                                 from "./components/Switch/Switch";
export type { SliderProps }                                 from "./components/Slider/Slider";
export type { ProgressProps }                               from "./components/Progress/Progress";
export type { SeparatorProps }                              from "./components/Separator/Separator";
export type { LabelProps }                                  from "./components/Label/Label";
export type { SkeletonProps }                               from "./components/Skeleton/Skeleton";
export type { PopoverProps, PopoverPlacement, PopoverSide, PopoverAlign } from "./components/Popover/Popover";
export type {
  DropdownMenuProps, DropdownItemProps, DropdownPlacement,
  DropdownCheckboxItemProps, DropdownRadioGroupProps,
  DropdownRadioItemProps, DropdownSubProps,
}                                                           from "./components/DropdownMenu/DropdownMenu";
export type { AlertProps, AlertDialogProps, AlertVariant }  from "./components/Alert/Alert";
export type { SheetProps, SheetSectionProps, SheetSide, SheetSize } from "./components/Sheet/Sheet";
export type { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbLinkProps } from "./components/Breadcrumb/Breadcrumb";
export type { PaginationProps }                             from "./components/Pagination/Pagination";
export type {
  TableProps, TableRowProps, TableHeaderProps,
  TableCellProps,
}                                                           from "./components/Table/Table";

export type { ButtonGroupProps }                             from "./components/ButtonGroup/ButtonGroup";
export type { TagsInputProps }                               from "./components/TagsInput/TagsInput";
export type { ComboboxProps, ComboboxOption }                from "./components/Combobox/Combobox";
export type { DataGridProps, DataGridColumn }                from "./components/DataGrid/DataGrid";
export type { TagProps, TagVariant, TagSize }                from "./components/Tag/Tag";
export type { TagGroupProps, TagGroupGap }                   from "./components/Tag/TagGroup";
export type {
  ItemProps, ItemGroupProps, ItemSectionProps,
}                                                            from "./components/Item/Item";
export type {
  KanbanProps, KanbanColumn, KanbanCard,
}                                                            from "./components/Kanban/Kanban";
export type {
  ConversationProps, ConversationMessage, ConversationStatus,
  ConversationMessageMeta, ConversationComposerApi,
  ConversationAttachment, ConversationAttachmentKind,
}                                                            from "./components/Conversation/Conversation";
export type {
  DateRangePickerProps, DateRange, DateRangePreset,
}                                                            from "./components/DateRangePicker/DateRangePicker";

// ── Shared types ──────────────────────────────────────────────
export type { Variant, Size, FieldState, BadgeVariant, BaseProps } from "./types";

// ── Utilities ─────────────────────────────────────────────────
export { cn } from "./utils/cn";
