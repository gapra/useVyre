/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Accordion                       │
 * │ type  = "single"(default)|"multiple"        │
 * │ defaultValue = string | string[]            │
 * │ value        = string | string[]            │
 * │ onValueChange = (value) => void             │
 * │                                             │
 * │ AccordionItem: value* = string              │
 * │ AccordionTrigger: children (label text)     │
 * │ AccordionContent: children (panel content)  │
 * │                                             │
 * │ CSS classes:                                │
 * │   .vyre-accordion                           │
 * │   .vyre-accordion__item                     │
 * │   .vyre-accordion__trigger                  │
 * │   .vyre-accordion__content                  │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

// ── Context ──────────────────────────────────────────────────
interface AccordionContextValue {
  type: "single" | "multiple";
  value: string[];
  toggle: (itemValue: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");
  return ctx;
}

// ── Accordion ────────────────────────────────────────────────
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      defaultValue,
      value: controlledValue,
      onValueChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const toArray = (v?: string | string[]) =>
      v === undefined ? [] : Array.isArray(v) ? v : [v];

    const [internalValue, setInternalValue] = React.useState<string[]>(
      toArray(defaultValue)
    );
    const value = controlledValue !== undefined ? toArray(controlledValue) : internalValue;

    const toggle = React.useCallback(
      (itemValue: string) => {
        let next: string[];
        if (type === "single") {
          next = value.includes(itemValue) ? [] : [itemValue];
        } else {
          next = value.includes(itemValue)
            ? value.filter((v) => v !== itemValue)
            : [...value, itemValue];
        }
        if (controlledValue === undefined) setInternalValue(next);
        onValueChange?.(type === "single" ? (next[0] ?? "") : next);
      },
      [type, value, controlledValue, onValueChange]
    );

    return (
      <AccordionContext.Provider value={{ type, value, toggle }}>
        <div
          ref={ref}
          className={["vyre-accordion", className].filter(Boolean).join(" ")}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

// ── AccordionItem ────────────────────────────────────────────
interface ItemContextValue { itemValue: string; isOpen: boolean }
const ItemContext = React.createContext<ItemContextValue | null>(null);

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value: itemValue, className, children, ...props }, ref) => {
    const { value } = useAccordion();
    const isOpen = value.includes(itemValue);

    return (
      <ItemContext.Provider value={{ itemValue, isOpen }}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={["vyre-accordion__item", className].filter(Boolean).join(" ")}
          {...props}
        >
          {children}
        </div>
      </ItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// ── AccordionTrigger ─────────────────────────────────────────
export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { toggle } = useAccordion();
    const ctx = React.useContext(ItemContext);
    if (!ctx) throw new Error("AccordionTrigger must be used within AccordionItem");
    const { itemValue, isOpen } = ctx;

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={["vyre-accordion__trigger", className].filter(Boolean).join(" ")}
        onClick={() => toggle(itemValue)}
        {...props}
      >
        <span className="vyre-accordion__trigger-text">{children}</span>
        <svg
          className="vyre-accordion__chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// ── AccordionContent ─────────────────────────────────────────
export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(ItemContext);
    if (!ctx) throw new Error("AccordionContent must be used within AccordionItem");
    const { isOpen } = ctx;

    return (
      <div
        ref={ref}
        hidden={!isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={["vyre-accordion__content", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="vyre-accordion__content-inner">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
