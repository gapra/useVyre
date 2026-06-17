/**
 * @usevyre/react — DateRangePicker
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  DateRangePicker                                       │
 * │ Import:     import { DateRangePicker } from "@usevyre/react"      │
 * │                                                                  │
 * │ Built on top of Calendar (mode="range"). Friendlier API:         │
 * │ uses a { from, to } object instead of a [Date,Date] tuple,       │
 * │ shows TWO months side-by-side, and a preset shortcut column.     │
 * │                                                                  │
 * │ Props:                                                           │
 * │   value       = { from: Date | null; to: Date | null } | null    │
 * │   onChange    = (range: DateRange) => void                       │
 * │   placeholder = string (default "Pick a date range")             │
 * │   numberOfMonths = 1 | 2 (default 2)                              │
 * │   presets     = boolean | DateRangePreset[]                      │
 * │                 true → built-in presets (Today, Last 7 days, …)  │
 * │   minDate / maxDate = Date                                        │
 * │   disabled    = (date: Date) => boolean                          │
 * │   weekStartsOn = 0 (Sun) | 1 (Mon, default)                      │
 * │                                                                  │
 * │ DateRange = { from: Date | null; to: Date | null }               │
 * │ DateRangePreset = { label: string; range: () => DateRange }      │
 * │                                                                  │
 * │ Use this for "select a start AND end date" (reports, filters).   │
 * │ For a single date use DatePicker. Do NOT pass a tuple — pass     │
 * │ an object: value={{ from, to }}.                                 │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [range, setRange] = useState<DateRange>({ from: null, to: null });
 * <DateRangePicker value={range} onChange={setRange} presets />
 */

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";
import { Calendar } from "../Calendar/Calendar";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePreset {
  label: string;
  range: () => DateRange;
}

export interface DateRangePickerProps {
  value?: DateRange | null;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  numberOfMonths?: 1 | 2;
  presets?: boolean | DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  className?: string;
  inputClassName?: string;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return startOfDay(x);
}
function formatDate(d: Date | null | undefined): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("default", {
    year: "numeric", month: "short", day: "numeric",
  }).format(d);
}

const BUILT_IN_PRESETS: DateRangePreset[] = [
  { label: "Today", range: () => { const t = startOfDay(new Date()); return { from: t, to: t }; } },
  { label: "Yesterday", range: () => { const y = addDays(new Date(), -1); return { from: y, to: y }; } },
  { label: "Last 7 days", range: () => ({ from: addDays(new Date(), -6), to: startOfDay(new Date()) }) },
  { label: "Last 30 days", range: () => ({ from: addDays(new Date(), -29), to: startOfDay(new Date()) }) },
  {
    label: "This month",
    range: () => {
      const n = new Date();
      return { from: startOfDay(new Date(n.getFullYear(), n.getMonth(), 1)), to: startOfDay(new Date(n.getFullYear(), n.getMonth() + 1, 0)) };
    },
  },
  {
    label: "Last month",
    range: () => {
      const n = new Date();
      return { from: startOfDay(new Date(n.getFullYear(), n.getMonth() - 1, 1)), to: startOfDay(new Date(n.getFullYear(), n.getMonth(), 0)) };
    },
  },
];

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Pick a date range",
      numberOfMonths = 2,
      presets = false,
      minDate,
      maxDate,
      disabled,
      weekStartsOn = 1,
      className,
      inputClassName,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const from = value?.from ?? null;
    const to = value?.to ?? null;

    const presetList = useMemo<DateRangePreset[]>(
      () => (presets === true ? BUILT_IN_PRESETS : Array.isArray(presets) ? presets : []),
      [presets]
    );

    const displayValue = useMemo(() => {
      if (!from) return "";
      if (!to) return formatDate(from);
      return `${formatDate(from)} – ${formatDate(to)}`;
    }, [from, to]);

    const updatePos = useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }, []);

    useEffect(() => {
      if (!open) return;
      updatePos();
      const onScroll = () => updatePos();
      const onResize = () => updatePos();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onResize);
      };
    }, [open, updatePos]);

    useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        if (
          !popoverRef.current?.contains(e.target as Node) &&
          !triggerRef.current?.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    const handleCalendarChange = useCallback(
      (tuple: [Date | null, Date | null]) => {
        const next: DateRange = { from: tuple[0], to: tuple[1] };
        onChange?.(next);
        if (next.from && next.to) setOpen(false);
      },
      [onChange]
    );

    const applyPreset = useCallback(
      (preset: DateRangePreset) => {
        onChange?.(preset.range());
        setOpen(false);
      },
      [onChange]
    );

    const clear = useCallback(() => {
      onChange?.({ from: null, to: null });
    }, [onChange]);

    // Second calendar shows the following month.
    const secondMonthAnchor = useMemo(() => {
      const base = from ?? startOfDay(new Date());
      return new Date(base.getFullYear(), base.getMonth() + 1, 1);
    }, [from]);

    const calendarTuple: [Date | null, Date | null] = [from, to];

    return (
      <div ref={ref} className={cn("vyre-date-range-picker", className)}>
        {/* role="button" div (not <button>) so the optional clear <button> can
            nest without invalid <button>-in-<button> DOM. Keyboard support via
            onKeyDown keeps it operable. */}
        <div
          ref={triggerRef}
          role="button"
          tabIndex={0}
          className={cn(
            "vyre-datepicker__trigger",
            !displayValue && "vyre-datepicker__trigger--placeholder",
            inputClassName
          )}
          onClick={() => { updatePos(); setOpen((o) => !o); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              updatePos();
              setOpen((o) => !o);
            }
          }}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <svg className="vyre-datepicker__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1.5 6h11M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span>{displayValue || placeholder}</span>
          {displayValue && (
            <button
              className="vyre-datepicker__clear"
              type="button"
              aria-label="Clear"
              onClick={(e) => { e.stopPropagation(); clear(); }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {open && ReactDOM.createPortal(
          <div
            ref={popoverRef}
            className="vyre-date-range-picker__popover"
            role="dialog"
            aria-label="Date range picker"
            style={{ top: pos.top, left: pos.left }}
          >
            {presetList.length > 0 && (
              <div className="vyre-date-range-picker__presets">
                {presetList.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="vyre-date-range-picker__preset"
                    onClick={() => applyPreset(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
            <div className="vyre-date-range-picker__calendars">
              <Calendar
                mode="range"
                value={calendarTuple}
                onChange={handleCalendarChange}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                weekStartsOn={weekStartsOn}
              />
              {numberOfMonths === 2 && (
                <Calendar
                  key={secondMonthAnchor.toISOString()}
                  mode="range"
                  value={calendarTuple}
                  defaultMonth={secondMonthAnchor}
                  onChange={handleCalendarChange}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabled={disabled}
                  weekStartsOn={weekStartsOn}
                />
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = "VyreDateRangePicker";
