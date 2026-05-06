/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Slider                          │
 * │ value        = number                       │
 * │ defaultValue = number (default: 0)          │
 * │ min          = number (default: 0)          │
 * │ max          = number (default: 100)        │
 * │ step         = number (default: 1)          │
 * │ onValueChange = (value: number) => void     │
 * │ disabled     = boolean                      │
 * │ size         = "sm"|"md"(default)           │
 * │ CSS class:  .vyre-slider                    │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue" | "size"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  size?: "sm" | "md";
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      disabled,
      size = "md",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div
        className={["vyre-slider", `vyre-slider--${size}`, className].filter(Boolean).join(" ")}
        data-disabled={disabled || undefined}
        style={{ "--vyre-slider-pct": `${percentage}%`, ...style } as React.CSSProperties}
      >
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          className="vyre-slider__input"
          onChange={(e) => {
            const next = Number(e.target.value);
            if (controlledValue === undefined) setInternalValue(next);
            onValueChange?.(next);
          }}
          {...props}
        />
        <div className="vyre-slider__track">
          <div className="vyre-slider__fill" style={{ width: `${percentage}%` }} />
          <div className="vyre-slider__thumb" style={{ left: `${percentage}%` }} />
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";
