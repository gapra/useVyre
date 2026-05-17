/**
 * @usevyre/react — Input + Field
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Field + Input + Textarea                    │
 * │ Import:     import { Field, Input, Textarea } from "@usevyre/react" │
 * │                                                         │
 * │ Field props (props-based, simplest):                    │
 * │   label    = string                                     │
 * │   hint     = string (helper text below input)           │
 * │   state    = "idle"|"error"|"success"|"warning"         │
 * │   required = boolean                                    │
 * │ Field composable parts (richer layouts):                │
 * │   FieldLabel · FieldDescription · FieldError ·          │
 * │   FieldGroup · FieldSet (props-based API still works)    │
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

// ── Field composable parts ────────────────────────────────────
// Backward-compatible: the props-based <Field label hint state /> API
// above still works. These parts let you compose a field explicitly
// for richer layouts (multiple controls, custom error placement).

export interface FieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    BaseProps {
  required?: boolean;
}

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ required = false, className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("vyre-field__label", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="vyre-field__required" aria-label="required">
          *
        </span>
      )}
    </label>
  )
);
FieldLabel.displayName = "VyreFieldLabel";

export interface FieldDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    BaseProps {}

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("vyre-field__description", className)}
    {...props}
  >
    {children}
  </p>
));
FieldDescription.displayName = "VyreFieldDescription";

export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    BaseProps {}

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  FieldErrorProps
>(({ className, children, ...props }, ref) =>
  children ? (
    <p
      ref={ref}
      role="alert"
      className={cn("vyre-field__error", className)}
      {...props}
    >
      {children}
    </p>
  ) : null
);
FieldError.displayName = "VyreFieldError";

export interface FieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  orientation?: "vertical" | "horizontal";
}

export const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ orientation = "vertical", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "vyre-field-group",
        `vyre-field-group--${orientation}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
FieldGroup.displayName = "VyreFieldGroup";

export interface FieldSetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    BaseProps {
  legend?: string;
}

export const FieldSet = React.forwardRef<HTMLFieldSetElement, FieldSetProps>(
  ({ legend, className, children, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={cn("vyre-field-set", className)}
      {...props}
    >
      {legend && (
        <legend className="vyre-field-set__legend">{legend}</legend>
      )}
      {children}
    </fieldset>
  )
);
FieldSet.displayName = "VyreFieldSet";

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
              !!leftElement && "vyre-input--has-left",
              !!rightElement && "vyre-input--has-right",
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
