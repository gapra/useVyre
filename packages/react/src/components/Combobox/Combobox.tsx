/**
 * @usevyre/react — Combobox
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Combobox                                    │
 * │ Import:     import { Combobox } from "@usevyre/react"   │
 * │                                                         │
 * │ Props:                                                  │
 * │   options     = { value: string; label: string;         │
 * │                   disabled?: boolean }[]                │
 * │   value       = string | null (controlled)              │
 * │   onChange    = (value: string | null) => void          │
 * │   placeholder = string                                  │
 * │   disabled    = boolean                                 │
 * │   size        = "sm"|"md"(default)|"lg"                 │
 * │   emptyText   = string (default: "No results")          │
 * │   disablePortal = boolean (default: false) — render the │
 * │                 dropdown inline instead of portaling     │
 * │                 it to <body>. Portaling (default) keeps  │
 * │                 the dropdown visible inside Modal /       │
 * │                 overflow:hidden containers.              │
 * │                                                         │
 * │ Behavior:                                               │
 * │   Click input → show all options                        │
 * │   Type → filter by case-insensitive contains            │
 * │   Select → close, update value, clear search            │
 * │   Escape → close dropdown                               │
 * │   Click outside → close dropdown                        │
 * │   ArrowUp/Down → keyboard navigation                    │
 * │   Enter → select highlighted option                     │
 * │                                                         │
 * │ Differs from Select: has searchable text input          │
 * │ Differs from Command: single-value pick, not palette    │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * const [lang, setLang] = useState<string | null>(null);
 * <Combobox
 *   options={[
 *     { value: "ts", label: "TypeScript" },
 *     { value: "rs", label: "Rust" },
 *   ]}
 *   value={lang}
 *   onChange={setLang}
 *   placeholder="Search language…"
 * />
 *
 * // Clear selection
 * <Combobox value={val} onChange={(v) => setVal(v)} options={options} />
 * // Pass null to onChange to clear
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

type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    BaseProps {
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: ComboboxSize;
  emptyText?: string;
  /**
   * Render the dropdown inline inside the component instead of teleporting it
   * to <body>. Default false: the dropdown portals to body so it stays visible
   * inside Modal / overflow:hidden containers (issue #18).
   */
  disablePortal?: boolean;
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Search…",
      disabled = false,
      size = "md",
      emptyText = "No results",
      disablePortal = false,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const id = useId();
    const listboxId = `${id}-listbox`;

    // Portaled dropdown placement (below the input, flips above when needed).
    const position = usePortalPosition(inputRef, dropdownRef, open, disablePortal, [search]);

    const selectedOption = options.find((o) => o.value === value) ?? null;

    const filtered = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );

    const closeDropdown = useCallback(() => {
      setOpen(false);
      setHighlightedIndex(-1);
      // Restore display to selected label on close
      setSearch("");
    }, []);

    const selectOption = useCallback(
      (option: ComboboxOption) => {
        if (option.disabled) return;
        onChange(option.value);
        closeDropdown();
        inputRef.current?.blur();
      },
      [onChange, closeDropdown]
    );

    // Close on outside click. The dropdown may be portaled to <body>, so a
    // click inside it is NOT a descendant of the wrapper — check both.
    useEffect(() => {
      if (!open) return;
      const handle = (e: MouseEvent) => {
        const target = e.target as Node;
        if (wrapperRef.current?.contains(target)) return;
        if (dropdownRef.current?.contains(target)) return;
        closeDropdown();
      };
      document.addEventListener("mousedown", handle);
      return () => document.removeEventListener("mousedown", handle);
    }, [open, closeDropdown]);

    // Scroll highlighted option into view WITHIN the dropdown only. We adjust the
    // dropdown's own scrollTop instead of element.scrollIntoView(), because once
    // the dropdown is portaled to <body> scrollIntoView scrolls the whole page.
    useEffect(() => {
      if (!open || highlightedIndex < 0) return;
      const list = dropdownRef.current;
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

    // Reset highlight when filter changes
    useEffect(() => {
      setHighlightedIndex(filtered.length > 0 ? 0 : -1);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleInputFocus() {
      if (disabled) return;
      setOpen(true);
      setSearch("");
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      setSearch(e.target.value);
      if (!open) setOpen(true);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (!open) { setOpen(true); return; }
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (next < filtered.length && filtered[next].disabled) next++;
            return next < filtered.length ? next : prev;
          });
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (!open) { setOpen(true); return; }
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && filtered[next].disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (open && highlightedIndex >= 0 && filtered[highlightedIndex]) {
            selectOption(filtered[highlightedIndex]);
          }
          break;
        }
        case "Escape": {
          closeDropdown();
          inputRef.current?.blur();
          break;
        }
      }
    }

    // Displayed value in the input
    const inputDisplayValue = open ? search : (selectedOption?.label ?? "");

    const dropdown = open ? (
      <ul
        ref={dropdownRef}
        id={listboxId}
        role="listbox"
        className={cn(
          "vyre-combobox__dropdown",
          !disablePortal && "vyre-combobox__dropdown--portal",
          !disablePortal && position.flip && "vyre-combobox__dropdown--flip"
        )}
        aria-label="Options"
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
        {filtered.length > 0 ? (
          filtered.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              data-highlighted={index === highlightedIndex}
              className={cn(
                "vyre-combobox__option",
                index === highlightedIndex && "vyre-combobox__option--highlighted",
                option.value === value && "vyre-combobox__option--selected"
              )}
              onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(option);
              }}
            >
              {option.label}
            </li>
          ))
        ) : (
          <li className="vyre-combobox__empty" role="presentation">
            {emptyText}
          </li>
        )}
      </ul>
    ) : null;

    return (
      <div
        ref={(node) => {
          // Merge refs
          wrapperRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          "vyre-combobox",
          `vyre-combobox--${size}`,
          disabled && "vyre-combobox--disabled",
          className
        )}
        data-open={open}
        {...props}
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-disabled={disabled}
          disabled={disabled}
          className="vyre-combobox__input"
          placeholder={placeholder}
          value={inputDisplayValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <span className="vyre-combobox__chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {disablePortal
          ? dropdown
          : dropdown && createPortal(dropdown, document.body)}
      </div>
    );
  }
);

Combobox.displayName = "VyreCombobox";
