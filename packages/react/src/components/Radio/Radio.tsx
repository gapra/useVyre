/**
 * @usevyre/react — Radio
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  RadioGroup + Radio                                   │
 * │ Import:     import { RadioGroup, Radio } from "@usevyre/react"   │
 * │                                                                  │
 * │ CONTROLLED. RadioGroup owns the selected value.                  │
 * │                                                                  │
 * │ RadioGroup props:                                                │
 * │   value      = string (controlled selected value)                │
 * │   defaultValue = string (uncontrolled)                           │
 * │   onChange   = (value: string) => void                           │
 * │   name?      = string (radio group name; auto if omitted)        │
 * │   disabled?  = boolean (disables the whole group)                │
 * │   size?      = "sm" | "md"(default)                              │
 * │   orientation? = "vertical"(default) | "horizontal"              │
 * │   options?   = { value; label; description?; disabled? }[]       │
 * │     → data-driven; OR pass <Radio> children for custom layout    │
 * │                                                                  │
 * │ Radio props (inside RadioGroup):                                 │
 * │   value     = string (required)                                  │
 * │   label?    = string                                             │
 * │   description? = string                                          │
 * │   disabled? = boolean                                            │
 * │                                                                  │
 * │ Use options for simple lists; use <Radio> children when you      │
 * │ need custom content. role="radiogroup" + arrow-key roving focus. │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * // Data-driven
 * <RadioGroup
 *   value={plan}
 *   onChange={setPlan}
 *   options={[
 *     { value: "free", label: "Free", description: "For hobby projects" },
 *     { value: "pro",  label: "Pro",  description: "For teams" },
 *   ]}
 * />
 *
 * // Composable
 * <RadioGroup value={plan} onChange={setPlan}>
 *   <Radio value="free" label="Free" />
 *   <Radio value="pro"  label="Pro" />
 * </RadioGroup>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export interface RadioOption {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

type RadioSize = "sm" | "md";

interface RadioContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  groupDisabled?: boolean;
  size: RadioSize;
}

const RadioContext = React.createContext<RadioContextValue | null>(null);

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    BaseProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: RadioSize;
  orientation?: "vertical" | "horizontal";
  /** Data-driven options. Omit to pass <Radio> children instead. */
  options?: RadioOption[];
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      name,
      disabled = false,
      size = "md",
      orientation = "vertical",
      options,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolled;

    // useId is SSR-stable (same value on server and client), unlike a module
    // counter which drifts when the server renders several groups but the client
    // hydrates one — that caused a "Prop id did not match" hydration warning.
    const generatedName = React.useId();
    const autoName = name ?? `vyre-radio-${generatedName}`;

    const handleChange = React.useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolled(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    const ctx: RadioContextValue = {
      name: autoName,
      value,
      onChange: handleChange,
      groupDisabled: disabled,
      size,
    };

    return (
      <RadioContext.Provider value={ctx}>
        <div
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          className={cn(
            "vyre-radio-group",
            `vyre-radio-group--${orientation}`,
            className
          )}
          data-disabled={disabled || undefined}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <Radio
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  description={opt.description}
                  disabled={opt.disabled}
                />
              ))
            : children}
        </div>
      </RadioContext.Provider>
    );
  }
);
RadioGroup.displayName = "VyreRadioGroup";

export interface RadioProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "onChange" | "size" | "value" | "type"
    >,
    BaseProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, description, disabled, className, id, ...props }, ref) => {
    const ctx = React.useContext(RadioContext);
    if (!ctx) {
      throw new Error("Radio must be used inside a <RadioGroup>.");
    }

    const checked = ctx.value === value;
    const isDisabled = disabled || ctx.groupDisabled;
    const inputId =
      id ?? `${ctx.name}-${value}`.replace(/\s+/g, "-");

    return (
      <label
        className={cn(
          "vyre-radio",
          `vyre-radio--${ctx.size}`,
          isDisabled && "vyre-radio--disabled",
          className
        )}
        data-checked={checked || undefined}
        data-disabled={isDisabled || undefined}
        htmlFor={inputId}
      >
        <input
          ref={ref}
          type="radio"
          id={inputId}
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={isDisabled}
          className="vyre-radio__input"
          onChange={() => ctx.onChange?.(value)}
          {...props}
        />
        <span className="vyre-radio__control" aria-hidden="true">
          <span className="vyre-radio__dot" />
        </span>
        {(label || description) && (
          <span className="vyre-radio__content">
            {label && <span className="vyre-radio__label">{label}</span>}
            {description && (
              <span className="vyre-radio__description">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);
Radio.displayName = "VyreRadio";
