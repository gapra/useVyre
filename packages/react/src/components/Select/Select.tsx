/**
 * @vyre/react — Select / Dropdown
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Select                                      │
 * │ Import:     import { Select } from "@vyre/react"        │
 * │                                                         │
 * │ Props:                                                  │
 * │   options     = { value: string; label: string;         │
 * │                   disabled?: boolean }[]                │
 * │   value       = string (controlled)                     │
 * │   defaultValue = string (uncontrolled)                  │
 * │   onChange    = (value: string) => void                 │
 * │   placeholder = string                                  │
 * │   disabled    = boolean                                 │
 * │   size        = "sm"|"md"(default)|"lg"                 │
 * │   + all native <div> props                              │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Controlled
 * <Select
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue",   label: "Vue" },
 *   ]}
 *   value={framework}
 *   onChange={setFramework}
 *   placeholder="Select framework"
 * />
 *
 * // Inside a Field
 * <Field label="Framework" state="error" hint="Required">
 *   <Select options={options} value={val} onChange={setVal} />
 * </Field>
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    BaseProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectSize;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Select an option",
      disabled = false,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const activeValue = isControlled ? controlledValue : internalValue;

    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const id = useId();
    const listboxId = `${id}-listbox`;

    const selectedOption = options.find((o) => o.value === activeValue);
    const enabledOptions = options.filter((o) => !o.disabled);

    const closeDropdown = useCallback(() => {
      setOpen(false);
      setHighlightedIndex(-1);
    }, []);

    const selectOption = useCallback(
      (option: SelectOption) => {
        if (option.disabled) return;
        if (!isControlled) setInternalValue(option.value);
        onChange?.(option.value);
        closeDropdown();
        triggerRef.current?.focus();
      },
      [isControlled, onChange, closeDropdown]
    );

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handle = (e: MouseEvent) => {
        const el = (ref as React.RefObject<HTMLDivElement>)?.current;
        if (el && !el.contains(e.target as Node)) closeDropdown();
      };
      document.addEventListener("mousedown", handle);
      return () => document.removeEventListener("mousedown", handle);
    }, [open, ref, closeDropdown]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (!open || highlightedIndex < 0) return;
      const item = listboxRef.current?.children[highlightedIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex, open]);

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown": {
          e.preventDefault();
          if (!open) {
            setOpen(true);
            const currentIdx = options.findIndex((o) => o.value === activeValue);
            setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(options.length - 1);
          }
          break;
        }
        case "Escape": {
          closeDropdown();
          break;
        }
      }
    };

    const handleListKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next].disabled) next++;
            return next < options.length ? next : prev;
          });
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next].disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (highlightedIndex >= 0) selectOption(options[highlightedIndex]);
          break;
        }
        case "Escape":
        case "Tab": {
          closeDropdown();
          triggerRef.current?.focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          const first = options.findIndex((o) => !o.disabled);
          if (first >= 0) setHighlightedIndex(first);
          break;
        }
        case "End": {
          e.preventDefault();
          const last = [...options].reverse().findIndex((o) => !o.disabled);
          if (last >= 0) setHighlightedIndex(options.length - 1 - last);
          break;
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn("vyre-select", `vyre-select--${size}`, className)}
        data-open={open}
        {...props}
      >
        <button
          ref={triggerRef}
          type="button"
          className="vyre-select__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((prev) => {
              if (!prev) {
                const idx = options.findIndex((o) => o.value === activeValue);
                setHighlightedIndex(idx >= 0 ? idx : 0);
              }
              return !prev;
            });
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          {selectedOption ? (
            <span className="vyre-select__value">{selectedOption.label}</span>
          ) : (
            <span className="vyre-select__placeholder">{placeholder}</span>
          )}
          <ChevronIcon />
        </button>

        {open && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            className="vyre-select__dropdown"
            aria-label="Options"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === activeValue}
                aria-disabled={option.disabled}
                data-highlighted={index === highlightedIndex}
                className="vyre-select__option"
                onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(option);
                }}
              >
                {option.label}
                {option.value === activeValue && <CheckIcon />}
              </li>
            ))}
            {enabledOptions.length === 0 && (
              <li className="vyre-select__empty" role="presentation">
                No options available
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

Select.displayName = "VyreSelect";

// ── Internal icons ─────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      className="vyre-select__chevron"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5L7 9L11 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="vyre-select__check"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
