/**
 * @usevyre/react — NumberInput
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  NumberInput                                           │
 * │ Import:     import { NumberInput } from "@usevyre/react"           │
 * │                                                                   │
 * │ Controlled numeric input with −/+ stepper buttons. onChange emits │
 * │ a NUMBER (or null when empty) — not an event. Drops straight into │
 * │ <FormField> (Form handles the non-event value automatically).     │
 * │                                                                   │
 * │   value     = number | null   (controlled)                        │
 * │   onChange  = (value: number | null) => void                      │
 * │   min max step = number   (step default 1)                        │
 * │   precision = number   (decimal places to round to)               │
 * │   size      = "sm" | "md"(default) | "lg"                         │
 * │   disabled readOnly = boolean                                     │
 * │                                                                   │
 * │ Clamps to min/max on blur. Keyboard: ArrowUp/Down ±step,          │
 * │ Shift+Arrow ±step×10. Empty input → null.                         │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [qty, setQty] = useState<number | null>(1);
 * <NumberInput value={qty} onChange={setQty} min={1} max={99} />
 *
 * @example
 * <FormField name="age" label="Age" rules={{ required: true, min: 18 }}>
 *   <NumberInput min={0} max={120} />
 * </FormField>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { Size, BaseProps } from "../../types";

export interface NumberInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "value" | "onChange" | "defaultValue" | "type"
    >,
    BaseProps {
  /** Controlled value. null = empty. */
  value?: number | null;
  /** Uncontrolled initial value */
  defaultValue?: number | null;
  /** Called with the parsed number, or null when the field is empty */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Increment/decrement amount (default 1) */
  step?: number;
  /** Decimal places to round to */
  precision?: number;
  size?: Exclude<Size, "icon">;
  disabled?: boolean;
  readOnly?: boolean;
}

const clamp = (n: number, min?: number, max?: number) => {
  if (min !== undefined && n < min) return min;
  if (max !== undefined && n > max) return max;
  return n;
};

const round = (n: number, precision?: number) => {
  if (precision === undefined) return n;
  const f = 10 ** precision;
  return Math.round(n * f) / f;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = null,
      onChange,
      min,
      max,
      step = 1,
      precision,
      size = "md",
      disabled = false,
      readOnly = false,
      className,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = React.useState<number | null>(defaultValue);
    const value = isControlled ? controlledValue! : internal;

    // Raw text lets the user type "-", "1." etc. before it parses.
    const [text, setText] = React.useState<string>(
      value === null || value === undefined ? "" : String(value)
    );

    // Keep text in sync when the value prop changes externally.
    React.useEffect(() => {
      const next = value === null || value === undefined ? "" : String(value);
      setText((prev) => (Number(prev) === value && prev !== "" ? prev : next));
    }, [value]);

    const commit = (next: number | null) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const setNumber = (n: number) => {
      const v = round(clamp(n, min, max), precision);
      setText(String(v));
      commit(v);
    };

    const stepBy = (dir: 1 | -1, multiplier = 1) => {
      const base = value ?? 0;
      setNumber(base + dir * step * multiplier);
    };

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setText(raw);
      if (raw === "" || raw === "-") {
        commit(null);
        return;
      }
      const n = Number(raw);
      if (!Number.isNaN(n)) commit(round(n, precision));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (value !== null && value !== undefined) {
        const clamped = round(clamp(value, min, max), precision);
        if (clamped !== value) setNumber(clamped);
        else setText(String(clamped));
      } else {
        setText("");
      }
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!disabled && !readOnly) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          stepBy(1, e.shiftKey ? 10 : 1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          stepBy(-1, e.shiftKey ? 10 : 1);
        }
      }
      onKeyDown?.(e);
    };

    const atMin = min !== undefined && value !== null && (value ?? 0) <= min;
    const atMax = max !== undefined && value !== null && (value ?? 0) >= max;

    return (
      <div
        className={cn(
          "vyre-number-input",
          `vyre-number-input--${size}`,
          disabled && "vyre-number-input--disabled",
          className
        )}
        data-disabled={disabled ? "" : undefined}
      >
        <button
          type="button"
          className="vyre-number-input__btn vyre-number-input__btn--dec"
          aria-label="Decrease"
          tabIndex={-1}
          disabled={disabled || readOnly || atMin}
          onClick={() => stepBy(-1)}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={value ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          className="vyre-number-input__field"
          value={text}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleText}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        <button
          type="button"
          className="vyre-number-input__btn vyre-number-input__btn--inc"
          aria-label="Increase"
          tabIndex={-1}
          disabled={disabled || readOnly || atMax}
          onClick={() => stepBy(1)}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    );
  }
);
NumberInput.displayName = "VyreNumberInput";
