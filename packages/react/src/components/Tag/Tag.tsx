/**
 * @usevyre/react — Tag
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Tag                                         │
 * │ Import:     import { Tag } from "@usevyre/react"        │
 * │                                                         │
 * │ Props:                                                  │
 * │   variant  = "default"(default)|"accent"|"danger"      │
 * │   size     = "sm"|"md"(default)|"lg"                    │
 * │   onRemove = () => void  (renders × remove button)      │
 * │   onClick  = () => void  (makes the tag interactive)    │
 * │                                                         │
 * │ Standalone display tag/chip. NOT an input — for tag     │
 * │ INPUT use TagsInput. Group multiple with TagGroup.      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Tag>Design</Tag>
 * <Tag variant="accent" size="lg">Featured</Tag>
 * <Tag onRemove={() => removeFilter("react")}>react</Tag>
 * <Tag onClick={() => toggleFilter("vue")}>vue</Tag>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export type TagVariant = "default" | "accent" | "danger";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick">,
    BaseProps {
  /** Visual style */
  variant?: TagVariant;
  /** Size scale */
  size?: TagSize;
  /** When provided, renders a × button that calls this on click */
  onRemove?: () => void;
  /** When provided, makes the whole tag interactive (button-like) */
  onClick?: () => void;
  /** Disable interaction (only relevant with onClick or onRemove) */
  disabled?: boolean;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = "default",
      size = "md",
      onRemove,
      onClick,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isClickable = !!onClick && !disabled;

    return (
      <span
        ref={ref}
        className={cn(
          "vyre-tag",
          `vyre-tag--${variant}`,
          `vyre-tag--${size}`,
          isClickable && "vyre-tag--clickable",
          disabled && "vyre-tag--disabled",
          className
        )}
        data-variant={variant}
        data-size={size}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-disabled={disabled || undefined}
        onClick={isClickable ? onClick : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        {...props}
      >
        <span className="vyre-tag__label">{children}</span>
        {onRemove && (
          <button
            type="button"
            className="vyre-tag__remove"
            aria-label="Remove"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = "VyreTag";
