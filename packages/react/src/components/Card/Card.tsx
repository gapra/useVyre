/**
 * @vyre/react — Card
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Card + CardHeader + CardBody + CardFooter   │
 * │ Import:     import { Card, CardBody, ... } from "@vyre/react" │
 * │                                                         │
 * │ Card props:                                             │
 * │   variant = "default"|"elevated"|"outlined"|            │
 * │             "ghost"|"accent"                            │
 * │   hoverable = boolean (adds hover transition)           │
 * │   clickable = boolean (cursor pointer + hover)          │
 * │                                                         │
 * │ Slot structure:                                         │
 * │   <Card>                                                │
 * │     <CardHeader>  ← optional                           │
 * │     <CardBody>    ← main content                       │
 * │     <CardFooter>  ← optional, actions                  │
 * │   </Card>                                               │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Card variant="elevated">
 *   <CardHeader>
 *     <Badge variant="teal">Component</Badge>
 *   </CardHeader>
 *   <CardBody>
 *     <h3>Card Title</h3>
 *     <p>Card description text.</p>
 *   </CardBody>
 *   <CardFooter>
 *     <Button variant="ghost" size="sm">View docs</Button>
 *   </CardFooter>
 * </Card>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

type CardVariant = "default" | "elevated" | "outlined" | "ghost" | "accent";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  variant?: CardVariant;
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      hoverable = false,
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
          "vyre-card",
          `vyre-card--${variant}`,
          hoverable && "vyre-card--hoverable",
          clickable && "vyre-card--clickable",
          className
        )}
        data-variant={variant}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "VyreCard";

export interface CardSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-card__header", className)} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = "VyreCardHeader";

export const CardBody = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-card__body", className)} {...props}>
      {children}
    </div>
  )
);
CardBody.displayName = "VyreCardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-card__footer", className)} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = "VyreCardFooter";
