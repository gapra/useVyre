/**
 * @usevyre/react — Item
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  Item + ItemGroup + ItemMedia + ItemContent +         │
 * │             ItemTitle + ItemDescription + ItemActions            │
 * │ Import:     import { Item, ItemContent, ... } from "@usevyre/react" │
 * │                                                                  │
 * │ Item props:                                                      │
 * │   variant  = "default"(default)|"outlined"|"muted"|"plain"       │
 * │     plain → transparent, no border — for composing Item          │
 * │     inside another surface (Card, Kanban card, list)             │
 * │   size     = "sm"|"md"(default)|"lg"                              │
 * │   clickable = boolean (cursor pointer + hover + role=button)     │
 * │   asChild  = false (always renders <div>; no polymorphism)       │
 * │                                                                  │
 * │ ItemGroup props:                                                 │
 * │   separated = boolean (adds dividers between items)              │
 * │                                                                  │
 * │ Slot structure (left → right):                                   │
 * │   <Item>                                                         │
 * │     <ItemMedia>     ← optional: icon / avatar / thumbnail        │
 * │     <ItemContent>   ← required: text column                      │
 * │       <ItemTitle>                                                │
 * │       <ItemDescription>                                          │
 * │     <ItemActions>   ← optional: buttons / menu, pinned right     │
 * │   </Item>                                                        │
 * │                                                                  │
 * │ Use Item for list rows, settings rows, notification rows.        │
 * │ Do NOT use Card for dense list rows — Item is the primitive.     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * // Settings row
 * <Item>
 *   <ItemMedia><BellIcon /></ItemMedia>
 *   <ItemContent>
 *     <ItemTitle>Notifications</ItemTitle>
 *     <ItemDescription>Receive email when someone mentions you.</ItemDescription>
 *   </ItemContent>
 *   <ItemActions>
 *     <Switch defaultChecked />
 *   </ItemActions>
 * </Item>
 *
 * // Grouped list with dividers
 * <ItemGroup separated>
 *   <Item clickable><ItemContent><ItemTitle>Profile</ItemTitle></ItemContent></Item>
 *   <Item clickable><ItemContent><ItemTitle>Billing</ItemTitle></ItemContent></Item>
 * </ItemGroup>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

type ItemVariant = "default" | "outlined" | "muted" | "plain";
type ItemSize = "sm" | "md" | "lg";

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  variant?: ItemVariant;
  size?: ItemSize;
  clickable?: boolean;
}

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      variant = "default",
      size = "md",
      clickable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "vyre-item",
          `vyre-item--${variant}`,
          `vyre-item--${size}`,
          clickable && "vyre-item--clickable",
          className
        )}
        data-variant={variant}
        data-size={size}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Item.displayName = "VyreItem";

export interface ItemGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  separated?: boolean;
}

export const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ separated = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      className={cn(
        "vyre-item-group",
        separated && "vyre-item-group--separated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ItemGroup.displayName = "VyreItemGroup";

export interface ItemSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {}

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("vyre-item__media", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  )
);
ItemMedia.displayName = "VyreItemMedia";

export const ItemContent = React.forwardRef<HTMLDivElement, ItemSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-item__content", className)} {...props}>
      {children}
    </div>
  )
);
ItemContent.displayName = "VyreItemContent";

export const ItemTitle = React.forwardRef<
  HTMLDivElement,
  ItemSectionProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("vyre-item__title", className)} {...props}>
    {children}
  </div>
));
ItemTitle.displayName = "VyreItemTitle";

export const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & BaseProps
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("vyre-item__description", className)} {...props}>
    {children}
  </p>
));
ItemDescription.displayName = "VyreItemDescription";

export const ItemActions = React.forwardRef<HTMLDivElement, ItemSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-item__actions", className)} {...props}>
      {children}
    </div>
  )
);
ItemActions.displayName = "VyreItemActions";
