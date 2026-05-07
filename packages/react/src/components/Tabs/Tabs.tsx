/**
 * @usevyre/react — Tabs
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Tabs + TabList + Tab + TabPanels + TabPanel │
 * │ Import:     import { Tabs, TabList, Tab,                │
 * │             TabPanels, TabPanel } from "@usevyre/react"    │
 * │                                                         │
 * │ Tabs props:                                             │
 * │   defaultValue = string (uncontrolled)                  │
 * │   value        = string (controlled)                    │
 * │   onChange     = (value: string) => void                │
 * │                                                         │
 * │ Tab props:                                              │
 * │   value    = string (required, unique)                  │
 * │   disabled = boolean                                    │
 * │                                                         │
 * │ TabPanel props:                                         │
 * │   value = string (required, matches Tab value)          │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <TabList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="tokens">Tokens</Tab>
 *     <Tab value="usage" disabled>Usage</Tab>
 *   </TabList>
 *   <TabPanels>
 *     <TabPanel value="overview"><p>Overview content</p></TabPanel>
 *     <TabPanel value="tokens"><p>Token reference</p></TabPanel>
 *   </TabPanels>
 * </Tabs>
 */

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useId,
  useCallback,
} from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

// ── Context ───────────────────────────────────────────────────

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used inside <Tabs>");
  return ctx;
}

// ── Tabs (root) ───────────────────────────────────────────────

export interface TabsProps extends BaseProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue = "",
      value: controlledValue,
      onChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const activeValue = isControlled ? controlledValue : internalValue;
    const baseId = useId();

    const handleChange = useCallback(
      (v: string) => {
        if (!isControlled) setInternalValue(v);
        onChange?.(v);
      },
      [isControlled, onChange]
    );

    return (
      <TabsContext.Provider value={{ value: activeValue, onChange: handleChange, baseId }}>
        <div ref={ref} className={cn("vyre-tabs", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "VyreTabs";

// ── TabList ───────────────────────────────────────────────────

export interface TabListProps extends BaseProps {
  children?: React.ReactNode;
  "aria-label"?: string;
}

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, "aria-label": ariaLabel, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const tabs = Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]:not([disabled])'
        ) ?? []
      );
      const currentIndex = tabs.findIndex((t) => t === document.activeElement);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
      else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = tabs.length - 1;
      else return;

      e.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    };

    return (
      <div
        ref={(node) => {
          (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="tablist"
        className={cn("vyre-tabs__list", className)}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabList.displayName = "VyreTabList";

// ── Tab ───────────────────────────────────────────────────────

export interface TabProps extends BaseProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const { value: activeValue, onChange, baseId } = useTabsContext();
    const isSelected = value === activeValue;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        id={`${baseId}-tab-${value}`}
        aria-controls={`${baseId}-panel-${value}`}
        aria-selected={isSelected}
        disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        className={cn(
          "vyre-tabs__tab",
          isSelected && "vyre-tabs__tab--active",
          className
        )}
        data-selected={isSelected}
        onClick={() => !disabled && onChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Tab.displayName = "VyreTab";

// ── TabPanels ─────────────────────────────────────────────────

export interface TabPanelsProps extends BaseProps {
  children?: React.ReactNode;
}

export const TabPanels = React.forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("vyre-tabs__panels", className)} {...props}>
      {children}
    </div>
  )
);
TabPanels.displayName = "VyreTabPanels";

// ── TabPanel ──────────────────────────────────────────────────

export interface TabPanelProps extends BaseProps {
  value: string;
  children?: React.ReactNode;
}

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: activeValue, baseId } = useTabsContext();
    const isActive = value === activeValue;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        className={cn("vyre-tabs__panel", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = "VyreTabPanel";
