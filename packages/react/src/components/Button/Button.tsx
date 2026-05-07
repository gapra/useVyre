/**
 * @usevyre/react — Button
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Button                                      │
 * │ Import:     import { Button } from "@usevyre/react"        │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant  = "primary"|"secondary"|"ghost"|             │
 * │              "accent"|"teal"|"danger"                   │
 * │   size     = "sm"|"md"(default)|"lg"|"icon"             │
 * │   disabled = boolean                                    │
 * │   loading  = boolean  (shows spinner, disables click)   │
 * │   as       = React.ElementType (default: "button")      │
 * │   leftIcon = React.ReactNode                            │
 * │   rightIcon = React.ReactNode                           │
 * │                                                         │
 * │ All native <button> props are forwarded.                │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Primary CTA
 * <Button variant="accent" size="lg">Get Started</Button>
 *
 * // Destructive action
 * <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *
 * // Icon only
 * <Button variant="ghost" size="icon" aria-label="Close">
 *   <CloseIcon />
 * </Button>
 *
 * // As link
 * <Button as="a" href="/docs" variant="secondary">Read Docs</Button>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { Variant, Size, BaseProps } from "../../types";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {
  /** Visual style variant */
  variant?: Variant;
  /** Size scale */
  size?: Size;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Icon before label */
  leftIcon?: React.ReactNode;
  /** Icon after label */
  rightIcon?: React.ReactNode;
  /** Render as different element (e.g. "a" for link buttons) */
  as?: React.ElementType;
}

const variantClasses: Record<Variant, string> = {
  primary:   "vyre-btn--primary",
  secondary: "vyre-btn--secondary",
  ghost:     "vyre-btn--ghost",
  accent:    "vyre-btn--accent",
  teal:      "vyre-btn--teal",
  danger:    "vyre-btn--danger",
};

const sizeClasses: Record<Size, string> = {
  sm:   "vyre-btn--sm",
  md:   "vyre-btn--md",
  lg:   "vyre-btn--lg",
  icon: "vyre-btn--icon",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      className,
      children,
      as: Component = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Component
        ref={ref}
        className={cn(
          "vyre-btn",
          variantClasses[variant],
          sizeClasses[size],
          loading && "vyre-btn--loading",
          className
        )}
        disabled={Component === "button" ? isDisabled : undefined}
        aria-disabled={isDisabled}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {loading && (
          <span className="vyre-btn__spinner" aria-hidden="true">
            <LoadingSpinner />
          </span>
        )}
        {!loading && leftIcon && (
          <span className="vyre-btn__icon vyre-btn__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children && <span className="vyre-btn__label">{children}</span>}
        {rightIcon && (
          <span className="vyre-btn__icon vyre-btn__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Component>
    );
  }
);

Button.displayName = "VyreButton";

// Internal spinner — no external dependency
function LoadingSpinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="vyre-spinner"
      aria-hidden="true"
    >
      <circle
        cx="7" cy="7" r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="28"
        strokeDashoffset="10"
      />
    </svg>
  );
}
