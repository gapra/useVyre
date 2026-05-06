/**
 * @vyre/react — Input + Field
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Field + Input + Textarea                    │
 * │ Import:     import { Field, Input, Textarea } from "@vyre/react" │
 * │                                                         │
 * │ Field props:                                            │
 * │   label    = string                                     │
 * │   hint     = string (helper text below input)           │
 * │   state    = "idle"|"error"|"success"|"warning"         │
 * │   required = boolean                                    │
 * │                                                         │
 * │ Input props:                                            │
 * │   size     = "sm"|"md"(default)|"lg"                    │
 * │   leftElement  = ReactNode (icon inside input, left)    │
 * │   rightElement = ReactNode (icon inside input, right)   │
 * │   + all native <input> props                            │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Basic field with validation
 * <Field label="Email" state="error" hint="Invalid email format">
 *   <Input type="email" placeholder="you@example.com" />
 * </Field>
 *
 * // Input with icon
 * <Field label="Search">
 *   <Input leftElement={<SearchIcon />} placeholder="Search..." />
 * </Field>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { FieldState, Size, BaseProps } from "../../types";

// ── Field wrapper ─────────────────────────────────────────────

export interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  label?: string;
  hint?: string;
  state?: FieldState;
  required?: boolean;
  htmlFor?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      hint,
      state = "idle",
      required = false,
      htmlFor,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("vyre-field", state !== "idle" && `vyre-field--${state}`, className)}
        data-state={state}
        {...props}
      >
        {label && (
          <label className="vyre-field__label" htmlFor={htmlFor}>
            {label}
            {required && (
              <span className="vyre-field__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        {children}
        {hint && (
          <span className="vyre-field__hint" role={state === "error" ? "alert" : undefined}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);
Field.displayName = "VyreField";

// ── Input ─────────────────────────────────────────────────────

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    BaseProps {
  size?: Exclude<Size, "icon">;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      leftElement,
      rightElement,
      className,
      ...props
    },
    ref
  ) => {
    if (leftElement || rightElement) {
      return (
        <div className={cn("vyre-input-wrapper", `vyre-input-wrapper--${size}`)}>
          {leftElement && (
            <span className="vyre-input__element vyre-input__element--left" aria-hidden="true">
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "vyre-input",
              `vyre-input--${size}`,
              leftElement && "vyre-input--has-left",
              rightElement && "vyre-input--has-right",
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="vyre-input__element vyre-input__element--right" aria-hidden="true">
              {rightElement}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn("vyre-input", `vyre-input--${size}`, className)}
        {...props}
      />
    );
  }
);
Input.displayName = "VyreInput";

// ── Textarea ──────────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseProps {
  size?: Exclude<Size, "icon">;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = "md", resize = "vertical", className, style, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn("vyre-textarea", `vyre-textarea--${size}`, className)}
        style={{ resize, ...style }}
        {...props}
      />
    );
  }
);
Textarea.displayName = "VyreTextarea";
