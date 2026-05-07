/**
 * @usevyre/react — DropdownMenu
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components:                                             │
 * │   DropdownMenu          — root wrapper + portal         │
 * │   DropdownItem          — action item                   │
 * │   DropdownCheckboxItem  — toggle item with checkmark    │
 * │   DropdownRadioGroup    — exclusive radio group         │
 * │   DropdownRadioItem     — radio option inside group     │
 * │   DropdownSub           — nested submenu                │
 * │   DropdownSubItem       — submenu trigger item          │
 * │   DropdownLabel         — non-interactive section label │
 * │   DropdownSeparator     — visual divider                │
 * │                                                         │
 * │ Import:                                                 │
 * │   import { DropdownMenu, DropdownItem,                  │
 * │     DropdownCheckboxItem, DropdownRadioGroup,           │
 * │     DropdownRadioItem, DropdownSub, DropdownSubItem,    │
 * │     DropdownLabel, DropdownSeparator } from "@usevyre/react"│
 * │                                                         │
 * │ DropdownMenu props:                                     │
 * │   trigger    = ReactElement (the anchor element)        │
 * │   placement  = "bottom-start"(default)|"bottom-end"     │
 * │               |"top-start"|"top-end"                    │
 * │                                                         │
 * │ DropdownItem props:                                     │
 * │   onSelect   = () => void                               │
 * │   disabled   = boolean                                  │
 * │   variant    = "default"(default)|"danger"              │
 * │   icon       = ReactNode                                │
 * │   shortcut   = string (e.g. "⌘K")                      │
 * │                                                         │
 * │ DropdownCheckboxItem props:                             │
 * │   checked    = boolean                                  │
 * │   onCheckedChange = (checked: boolean) => void          │
 * │   disabled   = boolean                                  │
 * │                                                         │
 * │ DropdownRadioGroup props:                               │
 * │   value      = string                                   │
 * │   onValueChange = (value: string) => void               │
 * │                                                         │
 * │ DropdownRadioItem props:                                │
 * │   value      = string                                   │
 * │   disabled   = boolean                                  │
 * │                                                         │
 * │ DropdownSub props:                                      │
 * │   trigger    = ReactNode (the submenu trigger label)    │
 * │   placement  = "right"(default)|"left"                  │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <DropdownMenu trigger={<Button variant="ghost">Actions</Button>}>
 *   <DropdownLabel>My Account</DropdownLabel>
 *   <DropdownSeparator />
 *   <DropdownItem icon={<EditIcon />} shortcut="⌘E" onSelect={handleEdit}>Edit</DropdownItem>
 *   <DropdownSub trigger="Share">
 *     <DropdownItem onSelect={handleEmail}>Email</DropdownItem>
 *     <DropdownItem onSelect={handleLink}>Copy link</DropdownItem>
 *   </DropdownSub>
 *   <DropdownSeparator />
 *   <DropdownItem variant="danger" icon={<TrashIcon />} onSelect={handleDelete}>Delete</DropdownItem>
 * </DropdownMenu>
 */

import React, {
  useState, useRef, useEffect, useId, useCallback,
  createContext, useContext,
} from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";

// ── Context ────────────────────────────────────────────────────

interface DropdownCtx {
  close: () => void;
}
const DropdownContext = createContext<DropdownCtx | null>(null);

// Radio group context
interface RadioCtx {
  value: string;
  onValueChange: (v: string) => void;
}
const RadioContext = createContext<RadioCtx | null>(null);

// ── Types ──────────────────────────────────────────────────────

export type DropdownPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  placement?: DropdownPlacement;
  className?: string;
}

export interface DropdownItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
  shortcut?: string;
  className?: string;
}

export interface DropdownCheckboxItemProps {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  shortcut?: string;
  className?: string;
}

export interface DropdownRadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export interface DropdownRadioItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export interface DropdownSubProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  placement?: "right" | "left";
  disabled?: boolean;
  className?: string;
}

// ── DropdownMenu ───────────────────────────────────────────────

const ANIM_OUT_MS = 120;

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  placement = "bottom-start",
  className,
}) => {
  const [open, setOpen]         = useState(false);
  const [leaving, setLeaving]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [focusedIdx, setFocusedIdx] = useState(-1);

  const triggerRef  = useRef<HTMLElement>(null);
  const menuRef     = useRef<HTMLDivElement>(null);
  const leaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId      = useId();

  const getItems = useCallback(() =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        "[role=menuitem]:not([aria-disabled=true]):not([disabled])," +
        "[role=menuitemcheckbox]:not([aria-disabled=true]):not([disabled])," +
        "[role=menuitemradio]:not([aria-disabled=true]):not([disabled])"
      ) ?? []
    ),
  []);

  const closeMenu = useCallback(() => {
    setLeaving(true);
    leaveTimer.current = setTimeout(() => {
      setLeaving(false);
      setMounted(false);
      setOpen(false);
      setFocusedIdx(-1);
      triggerRef.current?.focus({ preventScroll: true });
    }, ANIM_OUT_MS);
  }, []);

  const openMenu = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    setLeaving(false);
    setOpen(true);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    if (open) closeMenu(); else openMenu();
  }, [open, openMenu, closeMenu]);

  // compute position after mount
  useEffect(() => {
    if (!mounted || !triggerRef.current) return;
    const rect   = triggerRef.current.getBoundingClientRect();
    const GAP    = 4;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    let top = 0, left = 0;
    if (placement.startsWith("bottom")) {
      top  = rect.bottom + scrollY + GAP;
      left = placement === "bottom-start" ? rect.left + scrollX : rect.right + scrollX;
    } else {
      top  = rect.top + scrollY - GAP;
      left = placement === "top-start" ? rect.left + scrollX : rect.right + scrollX;
    }
    setPosition({ top, left });
    // focus first item — preventScroll stops the page from jumping
    requestAnimationFrame(() => {
      const items = getItems();
      items[0]?.focus({ preventScroll: true });
      setFocusedIdx(0);
    });
  }, [mounted, placement, getItems]);

  // outside click + keyboard nav
  useEffect(() => {
    if (!mounted) return;
    const onMousedown = (e: MouseEvent) => {
      if (
        menuRef.current    && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) closeMenu();
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = getItems();
        if (!items.length) return;
        const dir  = e.key === "ArrowDown" ? 1 : -1;
        const next = (focusedIdx + dir + items.length) % items.length;
        items[next]?.focus({ preventScroll: true });
        setFocusedIdx(next);
      }
      if (e.key === "Home") {
        const items = getItems(); items[0]?.focus({ preventScroll: true }); setFocusedIdx(0);
      }
      if (e.key === "End") {
        const items = getItems(); items[items.length - 1]?.focus({ preventScroll: true }); setFocusedIdx(items.length - 1);
      }
    };
    document.addEventListener("mousedown", onMousedown);
    document.addEventListener("keydown",   onKeydown);
    return () => {
      document.removeEventListener("mousedown", onMousedown);
      document.removeEventListener("keydown",   onKeydown);
    };
  }, [mounted, focusedIdx, closeMenu, getItems]);

  const triggerEl = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => { toggle(); trigger.props.onClick?.(e); },
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
    "aria-controls": menuId,
  });

  const isEnd = placement.endsWith("-end");
  const isTop = placement.startsWith("top");

  return (
    <DropdownContext.Provider value={{ close: closeMenu }}>
      {triggerEl}
      {mounted &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            className={cn(
              "vyre-dropdown",
              isEnd && "vyre-dropdown--end",
              isTop && "vyre-dropdown--top",
              leaving && "vyre-dropdown--leaving",
              className
            )}
            style={{
              top:  position.top,
              left: position.left,
              transform: isEnd ? "translateX(-100%)" : undefined,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </DropdownContext.Provider>
  );
};

DropdownMenu.displayName = "VyreDropdownMenu";

// ── DropdownLabel ──────────────────────────────────────────────

export const DropdownLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className,
}) => (
  <div className={cn("vyre-dropdown__label", className)}>{children}</div>
);
DropdownLabel.displayName = "VyreDropdownLabel";

// ── DropdownItem ───────────────────────────────────────────────

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children, onSelect, disabled = false, variant = "default", icon, shortcut, className,
}) => {
  const ctx = useContext(DropdownContext);
  return (
    <button
      role="menuitem"
      className={cn(
        "vyre-dropdown__item",
        variant === "danger" && "vyre-dropdown__item--danger",
        className
      )}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        ctx?.close();
      }}
    >
      {icon && <span className="vyre-dropdown__item-icon" aria-hidden="true">{icon}</span>}
      <span className="vyre-dropdown__item-label">{children}</span>
      {shortcut && <kbd className="vyre-dropdown__item-shortcut">{shortcut}</kbd>}
    </button>
  );
};
DropdownItem.displayName = "VyreDropdownItem";

// ── DropdownCheckboxItem ───────────────────────────────────────

export const DropdownCheckboxItem: React.FC<DropdownCheckboxItemProps> = ({
  children, checked, onCheckedChange, disabled = false, shortcut, className,
}) => {
  const ctx = useContext(DropdownContext);
  return (
    <button
      role="menuitemcheckbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={-1}
      className={cn("vyre-dropdown__item vyre-dropdown__item--checkbox", className)}
      onClick={() => {
        if (disabled) return;
        onCheckedChange(!checked);
        ctx?.close();
      }}
    >
      <span className="vyre-dropdown__item-indicator" aria-hidden="true">
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="vyre-dropdown__item-label">{children}</span>
      {shortcut && <kbd className="vyre-dropdown__item-shortcut">{shortcut}</kbd>}
    </button>
  );
};
DropdownCheckboxItem.displayName = "VyreDropdownCheckboxItem";

// ── DropdownRadioGroup ─────────────────────────────────────────

export const DropdownRadioGroup: React.FC<DropdownRadioGroupProps> = ({
  value, onValueChange, children,
}) => (
  <RadioContext.Provider value={{ value, onValueChange }}>
    <div role="group">{children}</div>
  </RadioContext.Provider>
);
DropdownRadioGroup.displayName = "VyreDropdownRadioGroup";

// ── DropdownRadioItem ──────────────────────────────────────────

export const DropdownRadioItem: React.FC<DropdownRadioItemProps> = ({
  children, value, disabled = false, className,
}) => {
  const ctx   = useContext(DropdownContext);
  const radio = useContext(RadioContext);
  const checked = radio?.value === value;
  return (
    <button
      role="menuitemradio"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={-1}
      className={cn("vyre-dropdown__item vyre-dropdown__item--radio", className)}
      onClick={() => {
        if (disabled) return;
        radio?.onValueChange(value);
        ctx?.close();
      }}
    >
      <span className="vyre-dropdown__item-indicator" aria-hidden="true">
        {checked && (
          <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" fill="currentColor"/>
          </svg>
        )}
      </span>
      <span className="vyre-dropdown__item-label">{children}</span>
    </button>
  );
};
DropdownRadioItem.displayName = "VyreDropdownRadioItem";

// ── DropdownSub ────────────────────────────────────────────────

export const DropdownSub: React.FC<DropdownSubProps> = ({
  trigger, children, icon, placement = "right", disabled = false, className,
}) => {
  const [open, setOpen]         = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const itemRef = useRef<HTMLButtonElement>(null);
  const subRef  = useRef<HTMLDivElement>(null);

  const openSub = useCallback(() => {
    if (!itemRef.current) return;
    const rect   = itemRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const GAP = 2;
    setPosition({
      top:  rect.top  + scrollY,
      left: placement === "right"
        ? rect.right + scrollX + GAP
        : rect.left  + scrollX - GAP,
    });
    setOpen(true);
  }, [placement]);

  const closeSub = useCallback(() => setOpen(false), []);

  // close sub when pointer leaves both trigger and submenu
  const handleMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as Node | null;
    if (subRef.current?.contains(related)) return;
    closeSub();
  };

  return (
    <>
      <button
        ref={itemRef}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={-1}
        className={cn("vyre-dropdown__item vyre-dropdown__item--sub", className)}
        onMouseEnter={openSub}
        onMouseLeave={handleMouseLeave}
        onFocus={openSub}
      >
        {icon && <span className="vyre-dropdown__item-icon" aria-hidden="true">{icon}</span>}
        <span className="vyre-dropdown__item-label">{trigger}</span>
        <span className="vyre-dropdown__item-chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d={placement === "right" ? "M4 2l4 4-4 4" : "M8 2L4 6l4 4"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && ReactDOM.createPortal(
        <div
          ref={subRef}
          role="menu"
          className={cn(
            "vyre-dropdown vyre-dropdown--sub",
            placement === "left" && "vyre-dropdown--sub-left",
          )}
          style={{
            position: "absolute",
            top:  position.top,
            left: placement === "right" ? position.left : undefined,
            right: placement === "left" ? `calc(100vw - ${position.left}px)` : undefined,
            transform: placement === "left" ? "translateX(-100%)" : undefined,
          }}
          onMouseLeave={(e) => {
            const related = e.relatedTarget as Node | null;
            if (itemRef.current?.contains(related)) return;
            closeSub();
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
};
DropdownSub.displayName = "VyreDropdownSub";

// ── DropdownSeparator ──────────────────────────────────────────

export const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div role="separator" className={cn("vyre-dropdown__separator", className)} />
);
DropdownSeparator.displayName = "VyreDropdownSeparator";
