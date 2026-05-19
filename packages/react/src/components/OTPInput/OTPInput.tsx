/**
 * @usevyre/react — OTPInput
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  OTPInput                                              │
 * │ Import:     import { OTPInput } from "@usevyre/react"              │
 * │                                                                   │
 * │ Segmented one-time-code input (verification / 2FA). CONTROLLED.   │
 * │ onChange emits the STRING value (not an event) — drops into       │
 * │ <FormField>. Paste-aware, auto-advance/backspace, arrow keys.     │
 * │                                                                   │
 * │   value      = string   (controlled, length ≤ `length`)           │
 * │   onChange   = (value: string) => void                            │
 * │   onComplete?= (value: string) => void  (all slots filled)        │
 * │   length     = number   (default 6)                               │
 * │   type       = "numeric"(default) | "alphanumeric"                │
 * │   mask       = boolean  (dots instead of chars, like a password)  │
 * │   size       = "sm" | "md"(default) | "lg"                        │
 * │   disabled   = boolean   autoFocus = boolean                      │
 * │                                                                   │
 * │ Pasting a full code fills every slot. Backspace on an empty slot  │
 * │ moves to the previous one.                                         │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [code, setCode] = useState("");
 * <OTPInput value={code} onChange={setCode} onComplete={verify} />
 *
 * @example
 * <FormField name="otp" label="Verification code"
 *            rules={{ required: true, minLength: 6 }}>
 *   <OTPInput length={6} />
 * </FormField>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export interface OTPInputProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fired once when every slot is filled */
  onComplete?: (value: string) => void;
  length?: number;
  type?: "numeric" | "alphanumeric";
  /** Render dots instead of characters */
  mask?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  autoFocus?: boolean;
  /** Forwarded to FormField wiring (used as the field name) */
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const sanitize = (raw: string, type: "numeric" | "alphanumeric") =>
  type === "numeric"
    ? raw.replace(/[^0-9]/g, "")
    : raw.replace(/[^0-9a-zA-Z]/g, "");

export const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onComplete,
      length = 6,
      type = "numeric",
      mask = false,
      size = "md",
      disabled = false,
      autoFocus = false,
      name,
      onBlur,
      className,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const value = (isControlled ? controlledValue! : internal).slice(0, length);

    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
    const prevComplete = React.useRef(false);

    const commit = (next: string) => {
      const clean = sanitize(next, type).slice(0, length);
      if (!isControlled) setInternal(clean);
      onChange?.(clean);
      const complete = clean.length === length;
      if (complete && !prevComplete.current) onComplete?.(clean);
      prevComplete.current = complete;
    };

    const focusAt = (i: number) => {
      const el = inputsRef.current[Math.max(0, Math.min(i, length - 1))];
      el?.focus();
      el?.select();
    };

    const handleChange = (i: number, raw: string) => {
      const ch = sanitize(raw, type);
      if (!ch) return;
      const chars = value.split("");
      // Typing in slot i: take the last char entered, advance.
      chars[i] = ch[ch.length - 1];
      const next = chars.join("").slice(0, length);
      commit(next);
      focusAt(i + 1);
    };

    const handleKeyDown = (
      i: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const chars = value.split("");
        if (chars[i]) {
          chars[i] = "";
          commit(chars.join(""));
        } else if (i > 0) {
          chars[i - 1] = "";
          commit(chars.join(""));
          focusAt(i - 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusAt(i - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusAt(i + 1);
      }
    };

    const handlePaste = (
      i: number,
      e: React.ClipboardEvent<HTMLInputElement>
    ) => {
      e.preventDefault();
      const pasted = sanitize(e.clipboardData.getData("text"), type);
      if (!pasted) return;
      const chars = value.split("");
      for (let k = 0; k < pasted.length && i + k < length; k++) {
        chars[i + k] = pasted[k];
      }
      const next = chars.join("").slice(0, length);
      commit(next);
      focusAt(Math.min(i + pasted.length, length - 1));
    };

    return (
      <div
        ref={ref}
        className={cn(
          "vyre-otp",
          `vyre-otp--${size}`,
          disabled && "vyre-otp--disabled",
          className
        )}
        role="group"
        aria-label="One-time code"
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            className="vyre-otp__slot"
            type={mask ? "password" : "text"}
            inputMode={type === "numeric" ? "numeric" : "text"}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            name={i === 0 ? name : undefined}
            aria-label={`Digit ${i + 1}`}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.target.select()}
            onBlur={onBlur}
          />
        ))}
      </div>
    );
  }
);
OTPInput.displayName = "VyreOTPInput";
