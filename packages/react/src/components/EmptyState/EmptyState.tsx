/**
 * @usevyre/react — EmptyState
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  EmptyState                                            │
 * │ Import:     import { EmptyState } from "@usevyre/react"            │
 * │                                                                   │
 * │ Presentational placeholder for empty lists, tables, and search    │
 * │ results. No state. The optional call-to-action goes in children.  │
 * │                                                                   │
 * │   title        = string (required)                                │
 * │   description?  = string                                          │
 * │   variant       = "default"(box) | "search"(magnifier)            │
 * │                  | "error"(warning) — picks a preset icon         │
 * │   icon?         = ReactNode (overrides the preset)                 │
 * │   size          = "sm" | "md"(default) | "lg"                     │
 * │   children?     = the CTA (Button, or two buttons in a Stack)     │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <EmptyState
 *   variant="search"
 *   title="No results"
 *   description="Try a different search term."
 * >
 *   <Button variant="secondary" onClick={reset}>Clear filters</Button>
 * </EmptyState>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

const BoxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path
      d="M6 13l14-7 14 7v14l-14 7-14-7V13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M6 13l14 7 14-7M20 20v14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="2" />
    <path d="M26 26l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path
      d="M20 5L37 34H3L20 5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M20 16v9M20 29v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const PRESET_ICONS = {
  default: BoxIcon,
  search: SearchIcon,
  error: ErrorIcon,
} as const;

export type EmptyStateVariant = keyof typeof PRESET_ICONS;

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    BaseProps {
  /** Headline (required) */
  title: string;
  /** Supporting text under the title */
  description?: string;
  /** Picks a preset icon */
  variant?: EmptyStateVariant;
  /** Custom icon, overrides the variant preset */
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title,
      description,
      variant = "default",
      icon,
      size = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const PresetIcon = PRESET_ICONS[variant];
    return (
      <div
        ref={ref}
        role="status"
        data-variant={variant}
        className={cn(
          "vyre-empty-state",
          `vyre-empty-state--${size}`,
          className
        )}
        {...props}
      >
        <span className="vyre-empty-state__icon" aria-hidden="true">
          {icon ?? <PresetIcon />}
        </span>
        <span className="vyre-empty-state__title">{title}</span>
        {description && (
          <span className="vyre-empty-state__description">{description}</span>
        )}
        {children && (
          <div className="vyre-empty-state__action">{children}</div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "VyreEmptyState";
