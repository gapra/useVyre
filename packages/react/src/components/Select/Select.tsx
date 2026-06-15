/**
 * @usevyre/react — Select / Dropdown
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Select                                      │
 * │ Import:     import { Select } from "@usevyre/react"        │
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
 * │   disablePortal = boolean (default: false) — render the │
 * │                 dropdown inline instead of portaling     │
 * │                 it to <body>. Portaling (default) keeps  │
 * │                 the dropdown visible inside Modal /       │
 * │                 overflow:hidden containers.              │
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
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { usePortalPosition } from "../../utils/usePortalPosition";
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
  /**
   * Render the dropdown inline inside the component instead of teleporting it
   * to <body>. Default false: the dropdown portals to body so it stays visible
   * inside Modal / overflow:hidden containers.
   */
  disablePortal?: boolean;
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
      disablePortal = false,
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

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const id = useId();
    const listboxId = `${id}-listbox`;

    // Portaled dropdown placement (below the trigger, flips above when needed).
    const position = usePortalPosition(triggerRef, listboxRef, open, disablePortal, [highlightedIndex]);

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

    // Close on outside click. The dropdown may be portaled to <body>, so a
    // click inside it is NOT a descendant of the wrapper — check both.
    useEffect(() => {
      if (!open) return;
      const handle = (e: MouseEvent) => {
        const target = e.target as Node;
        if (wrapperRef.current?.contains(target)) return;
        if (listboxRef.current?.contains(target)) return;
        closeDropdown();
      };
      document.addEventListener("mousedown", handle);
      return () => document.removeEventListener("mousedown", handle);
    }, [open, closeDropdown]);

    // Scroll highlighted option into view WITHIN the listbox only. We adjust the
    // listbox's own scrollTop instead of element.scrollIntoView(), because once
    // the dropdown is portaled to <body> scrollIntoView scrolls the whole page.
    useEffect(() => {
      if (!open || highlightedIndex < 0) return;
      const list = listboxRef.current;
      const item = list?.children[highlightedIndex] as HTMLElement | undefined;
      if (!list || !item) return;
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      if (itemTop < list.scrollTop) {
        list.scrollTop = itemTop;
      } else if (itemBottom > list.scrollTop + list.clientHeight) {
        list.scrollTop = itemBottom - list.clientHeight;
      }
    }, [highlightedIndex, open]);

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      // When open, the trigger keeps DOM focus (the listbox is portaled and not
      // focused), so all navigation keys must be handled here, delegating to the
      // shared list handler. When closed, these keys open the dropdown.
      if (open) {
        handleListKeyDown(e);
        return;
      }
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown": {
          e.preventDefault();
          setOpen(true);
          const currentIdx = options.findIndex((o) => o.value === activeValue);
          setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setOpen(true);
          setHighlightedIndex(options.length - 1);
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

    const dropdown = open ? (
      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        className={cn(
          "vyre-select__dropdown",
          !disablePortal && "vyre-select__dropdown--portal",
          !disablePortal && position.flip && "vyre-select__dropdown--flip"
        )}
        aria-label="Options"
        tabIndex={-1}
        onKeyDown={handleListKeyDown}
        style={
          disablePortal
            ? undefined
            : {
                position: "absolute",
                top: position.top,
                left: position.left,
                width: position.width,
              }
        }
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
    ) : null;

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
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

        {disablePortal
          ? dropdown
          : dropdown && createPortal(dropdown, document.body)}
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
