/**
 * @usevyre/react — Command
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Command + CommandInput + CommandList +      │
 * │             CommandEmpty + CommandGroup + CommandItem + │
 * │             CommandSeparator + CommandDialog            │
 * │ Import:     import { Command, CommandDialog, ... }      │
 * │             from "@usevyre/react"                          │
 * │                                                         │
 * │ Command props:                                          │
 * │   value       = string (controlled search value)        │
 * │   onValueChange = (v: string) => void                   │
 * │   className   = string                                  │
 * │                                                         │
 * │ CommandDialog props:                                    │
 * │   open        = boolean                                 │
 * │   onOpenChange = (open: boolean) => void                │
 * │   + all Command props                                   │
 * │                                                         │
 * │ CommandItem props:                                      │
 * │   onSelect    = () => void                              │
 * │   disabled    = boolean                                 │
 * │   keywords    = string[] (extra search terms)           │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * // Inline
 * <Command>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandGroup heading="Actions">
 *       <CommandItem onSelect={() => router.push('/settings')}>
 *         Settings
 *       </CommandItem>
 *     </CommandGroup>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *   </CommandList>
 * </Command>
 *
 * // Dialog (⌘K palette)
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Type a command..." />
 *   <CommandList>...</CommandList>
 * </CommandDialog>
 */

import React, {
  createContext, useCallback, useContext, useEffect,
  useMemo, useRef, useState,
} from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";

// ── Context ───────────────────────────────────────────────────

interface CommandCtx {
  search: string;
  setSearch: (v: string) => void;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  items: React.RefObject<Map<string, { el: HTMLElement; disabled: boolean }>>;
  registerItem: (id: string, el: HTMLElement, disabled: boolean) => void;
  unregisterItem: (id: string) => void;
  selectItem: (id: string) => void;
  onSelectRef: React.RefObject<Map<string, () => void>>;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}

const CommandContext = createContext<CommandCtx | null>(null);
const useCommand = () => {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("Command components must be used inside <Command>");
  return ctx;
};

// ── Helpers ───────────────────────────────────────────────────

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function matches(search: string, text: string, keywords: string[] = []) {
  if (!search) return true;
  const q = normalize(search);
  return normalize(text).includes(q) || keywords.some((k) => normalize(k).includes(q));
}

let _idCounter = 0;
function uid() { return `cmd-${++_idCounter}`; }

// ── Command (root) ────────────────────────────────────────────

export interface CommandProps {
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ value, onValueChange, className, children }, ref) => {
    const [internalSearch, setInternalSearch] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);

    const search = value !== undefined ? value : internalSearch;
    const setSearch = useCallback((v: string) => {
      setInternalSearch(v);
      onValueChange?.(v);
      setActiveIndex(0);
    }, [onValueChange]);

    const itemsRef = useRef<Map<string, { el: HTMLElement; disabled: boolean }>>(new Map());
    const onSelectRef = useRef<Map<string, () => void>>(new Map());

    const registerItem = useCallback((id: string, el: HTMLElement, disabled: boolean) => {
      itemsRef.current.set(id, { el, disabled });
    }, []);
    const unregisterItem = useCallback((id: string) => {
      itemsRef.current.delete(id);
      onSelectRef.current.delete(id);
    }, []);
    const selectItem = useCallback((id: string) => {
      onSelectRef.current.get(id)?.();
    }, []);

    const ctx = useMemo<CommandCtx>(() => ({
      search, setSearch, activeIndex, setActiveIndex,
      items: itemsRef, registerItem, unregisterItem,
      selectItem, onSelectRef, visibleCount, setVisibleCount,
    }), [search, setSearch, activeIndex, registerItem, unregisterItem, selectItem, visibleCount]);

    // Keyboard navigation lives on the root so it works no matter which child
    // holds focus (the CommandInput, a sibling of CommandList, is where focus
    // actually is). Attaching to CommandList alone never fires — that div is not
    // focused and the input's keydown does not bubble through a sibling.
    // Scroll the active item within the list container only — never the page.
    // (element.scrollIntoView would scroll the document, like the Select bug.)
    const scrollItemIntoList = (el?: HTMLElement) => {
      const list = el?.closest<HTMLElement>(".vyre-command__list");
      if (!el || !list) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    };

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const visible = Array.from(itemsRef.current.entries())
        .filter(([, v]) => !v.disabled && !v.el.hasAttribute("data-cmd-hidden"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(activeIndex + 1, visible.length - 1);
        setActiveIndex(next);
        scrollItemIntoList(visible[next]?.[1].el);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(activeIndex - 1, 0);
        setActiveIndex(prev);
        scrollItemIntoList(visible[prev]?.[1].el);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const [id] = visible[activeIndex] ?? [];
        if (id) selectItem(id);
      }
    }, [activeIndex, selectItem]);

    return (
      <CommandContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn("vyre-command", className)}
          role="combobox"
          aria-expanded="true"
          aria-haspopup="listbox"
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = "VyreCommand";

// ── CommandInput ──────────────────────────────────────────────

export interface CommandInputProps {
  placeholder?: string;
  className?: string;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ placeholder = "Search...", className }, ref) => {
    const { search, setSearch } = useCommand();
    return (
      <div className="vyre-command__input-wrapper">
        <svg className="vyre-command__search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          ref={ref}
          className={cn("vyre-command__input", className)}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-controls="vyre-command-list"
        />
        {search && (
          <button
            className="vyre-command__clear"
            type="button"
            aria-label="Clear search"
            onClick={() => setSearch("")}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    );
  }
);
CommandInput.displayName = "VyreCommandInput";

// ── CommandList ───────────────────────────────────────────────

export interface CommandListProps {
  className?: string;
  children?: React.ReactNode;
}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, children }, ref) => {
    // Keyboard navigation is handled at the Command root (see Command), so it
    // fires regardless of which child has focus. The list is just the scroll
    // container + listbox region here.
    return (
      <div
        ref={ref}
        id="vyre-command-list"
        role="listbox"
        className={cn("vyre-command__list", className)}
      >
        {children}
      </div>
    );
  }
);
CommandList.displayName = "VyreCommandList";

// ── CommandEmpty ──────────────────────────────────────────────

export interface CommandEmptyProps {
  className?: string;
  children?: React.ReactNode;
}

export const CommandEmpty: React.FC<CommandEmptyProps> = ({ className, children }) => {
  const { search, visibleCount } = useCommand();
  if (!search || visibleCount > 0) return null;
  return (
    <div className={cn("vyre-command__empty", className)} role="presentation">
      {children ?? "No results found."}
    </div>
  );
};
CommandEmpty.displayName = "VyreCommandEmpty";

// ── CommandGroup ──────────────────────────────────────────────

export interface CommandGroupProps {
  heading?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CommandGroup: React.FC<CommandGroupProps> = ({ heading, className, children }) => {
  return (
    <div className={cn("vyre-command__group", className)} role="presentation">
      {heading && (
        <div className="vyre-command__group-heading" aria-hidden="true">
          {heading}
        </div>
      )}
      <div role="group" aria-label={heading}>
        {children}
      </div>
    </div>
  );
};
CommandGroup.displayName = "VyreCommandGroup";

// ── CommandItem ───────────────────────────────────────────────

export interface CommandItemProps {
  onSelect?: () => void;
  disabled?: boolean;
  keywords?: string[];
  className?: string;
  children?: React.ReactNode;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Optional trailing shortcut hint */
  shortcut?: string;
}

export const CommandItem: React.FC<CommandItemProps> = ({
  onSelect, disabled = false, keywords, className, children, icon, shortcut,
}) => {
  const { search, activeIndex, setActiveIndex, items, registerItem, unregisterItem, onSelectRef, setVisibleCount } = useCommand();
  const id = useMemo(() => uid(), []);
  const ref = useRef<HTMLDivElement>(null);

  const textContent = typeof children === "string" ? children : "";
  const visible = matches(search, textContent, keywords);

  // This item is active when its position among the enabled+visible registered
  // items (the same list keyboard nav walks) equals activeIndex. Reflecting it
  // via aria-selected drives the highlight CSS and assistive tech.
  const navList = Array.from(items.current?.entries() ?? [])
    .filter(([, v]) => !v.disabled && !v.el.hasAttribute("data-cmd-hidden"));
  const isActive = !disabled && navList[activeIndex]?.[0] === id;

  useEffect(() => {
    setVisibleCount((c) => c + (visible ? 1 : 0));
    return () => { setVisibleCount((c) => c - (visible ? 1 : 0)); };
  }, [visible, setVisibleCount]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !visible) return;
    registerItem(id, el, disabled);
    return () => unregisterItem(id);
  }, [id, disabled, visible, registerItem, unregisterItem]);

  useEffect(() => {
    if (onSelect) onSelectRef.current?.set(id, onSelect);
    return () => { onSelectRef.current?.delete(id); };
  }, [id, onSelect, onSelectRef]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      data-cmd-item
      role="option"
      aria-selected={isActive || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "vyre-command__item",
        disabled && "vyre-command__item--disabled",
        className,
      )}
      onClick={() => { if (!disabled) { onSelect?.(); } }}
      onMouseEnter={() => { if (!disabled && ref.current) setActiveIndex(-1); }}
    >
      {icon && <span className="vyre-command__item-icon" aria-hidden="true">{icon}</span>}
      <span className="vyre-command__item-label">{children}</span>
      {shortcut && <kbd className="vyre-command__item-shortcut">{shortcut}</kbd>}
    </div>
  );
};
CommandItem.displayName = "VyreCommandItem";

// ── CommandSeparator ──────────────────────────────────────────

export const CommandSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("vyre-command__separator", className)} role="separator" aria-hidden="true" />
);
CommandSeparator.displayName = "VyreCommandSeparator";

// ── CommandDialog ─────────────────────────────────────────────

export interface CommandDialogProps extends CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandDialog: React.FC<CommandDialogProps> = ({
  open, onOpenChange, value, onValueChange, className, children,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const input = backdropRef.current?.querySelector<HTMLInputElement>(".vyre-command__input");
    input?.focus();
    return () => { prev?.focus({ preventScroll: true }); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="vyre-command-backdrop"
      ref={backdropRef}
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <Command
        value={value}
        onValueChange={onValueChange}
        className={cn("vyre-command--dialog", className)}
      >
        {children}
      </Command>
    </div>,
    document.body
  );
};
CommandDialog.displayName = "VyreCommandDialog";
