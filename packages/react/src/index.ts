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
 * - Accordion      — Collapsible sections (+ AccordionItem, AccordionTrigger, AccordionContent)
 * - Avatar         — User avatar with image fallback and status dot
 * - Checkbox       — Checkbox input with indeterminate state
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
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/Accordion/Accordion";
export { Avatar }                                           from "./components/Avatar/Avatar";
export { Checkbox }                                         from "./components/Checkbox/Checkbox";
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
export { Breadcrumb, BreadcrumbItem }                       from "./components/Breadcrumb/Breadcrumb";
export { Pagination }                                       from "./components/Pagination/Pagination";
export {
  Table, TableHead, TableBody, TableRow,
  TableHeader, TableCell, TableCaption,
}                                                           from "./components/Table/Table";
export {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandDialog,
}                                                           from "./components/Command/Command";
export { Calendar, DatePicker }                             from "./components/Calendar/Calendar";
export type {
  CalendarProps, CalendarSingleProps, CalendarRangeProps,
  CalendarMultipleProps, CalendarBaseProps, DatePickerProps, CalendarMode,
}                                                           from "./components/Calendar/Calendar";
export { Text, Heading, Lead, Code, Blockquote }            from "./components/Typography/Typography";
export type {
  TextProps, HeadingProps, LeadProps, CodeProps, BlockquoteProps,
}                                                           from "./components/Typography/Typography";
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
export type { FieldProps, InputProps, TextareaProps }       from "./components/Input/Input";
export type { ModalProps, ModalSectionProps, ModalSize }    from "./components/Modal/Modal";
export type { ToastInput, ToastVariant }                    from "./components/Toast/Toast";
export type { SelectProps, SelectOption, SelectSize }       from "./components/Select/Select";
export type { TabsProps, TabListProps, TabProps, TabPanelsProps, TabPanelProps } from "./components/Tabs/Tabs";
export type { TooltipProps, TooltipPlacement }              from "./components/Tooltip/Tooltip";
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps } from "./components/Accordion/Accordion";
export type { AvatarProps }                                 from "./components/Avatar/Avatar";
export type { CheckboxProps }                               from "./components/Checkbox/Checkbox";
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
export type { BreadcrumbProps, BreadcrumbItemProps }        from "./components/Breadcrumb/Breadcrumb";
export type { PaginationProps }                             from "./components/Pagination/Pagination";
export type {
  TableProps, TableRowProps, TableHeaderProps,
  TableCellProps,
}                                                           from "./components/Table/Table";

// ── Shared types ──────────────────────────────────────────────
export type { Variant, Size, FieldState, BadgeVariant, BaseProps } from "./types";

// ── Utilities ─────────────────────────────────────────────────
export { cn } from "./utils/cn";
