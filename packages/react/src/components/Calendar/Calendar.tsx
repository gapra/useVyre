/**
 * @usevyre/react — Calendar
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Component:  Calendar (inline grid; no input/popover)        │
 * │ Import:     import { Calendar } from "@usevyre/react"       │
 * │                                                             │
 * │ Calendar props:                                             │
 * │   mode      = "single"(default) | "range" | "multiple"     │
 * │   value     = Date | [Date,Date] | Date[]                   │
 * │   onChange  = (v) => void                                   │
 * │   showTime  = boolean (adds HH:MM time picker)              │
 * │   minDate / maxDate = Date                                  │
 * │   disabled  = (date: Date) => boolean                       │
 * │   defaultMonth = Date (initial month when value empty)      │
 * │                                                             │
 * │ For an input + popover, use DatePicker.                      │
 * │ For start/end ranges with presets, use DateRangePicker.     │
 * └─────────────────────────────────────────────────────────────┘
 *
 * @example
 * // Single date
 * <Calendar mode="single" value={date} onChange={setDate} />
 *
 * // Date range
 * <Calendar mode="range" value={[start, end]} onChange={setRange} />
 */

import React, {
  useCallback, useMemo, useState,
} from "react";
import { cn } from "../../utils/cn";

// ── Types ─────────────────────────────────────────────────────

export type CalendarMode = "single" | "range" | "multiple";

export interface CalendarSingleProps {
  mode?: "single";
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}
export interface CalendarRangeProps {
  mode: "range";
  value?: [Date | null, Date | null];
  onChange?: (range: [Date | null, Date | null]) => void;
}
export interface CalendarMultipleProps {
  mode: "multiple";
  value?: Date[];
  onChange?: (dates: Date[]) => void;
}

export type CalendarBaseProps = {
  showTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  className?: string;
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
  /** Month to display initially when value is empty (uncontrolled view). */
  defaultMonth?: Date;
};

export type CalendarProps =
  | (CalendarSingleProps & CalendarBaseProps)
  | (CalendarRangeProps & CalendarBaseProps)
  | (CalendarMultipleProps & CalendarBaseProps);

export type DatePickerProps = CalendarProps & {
  placeholder?: string;
  inputClassName?: string;
};

// ── Date helpers ──────────────────────────────────────────────

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
function isBefore(a: Date, b: Date) { return startOfDay(a) < startOfDay(b); }
function isAfter(a: Date, b: Date) { return startOfDay(a) > startOfDay(b); }

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number, weekStartsOn: 0 | 1) {
  const day = new Date(year, month, 1).getDay();
  return (day - weekStartsOn + 7) % 7;
}

/** @internal — shared with DatePicker. */
export function formatDate(d: Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("default", opts ?? { year: "numeric", month: "short", day: "numeric" }).format(d);
}
/** @internal — shared with DatePicker. */
export function formatTime(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat("default", { month: "long" }).format(new Date(2000, i, 1))
);
const YEARS_RANGE = 12;

// ── Calendar ──────────────────────────────────────────────────

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (props, ref) => {
    const {
      showTime = false,
      minDate,
      maxDate,
      disabled: isDisabledFn,
      className,
      weekStartsOn = 1,
      defaultMonth,
    } = props;

    const today = startOfDay(new Date());
    const getInitialDate = () => {
      if (props.mode === "range") return props.value?.[0] ?? defaultMonth ?? today;
      if (props.mode === "multiple") return props.value?.[0] ?? defaultMonth ?? today;
      return (props as CalendarSingleProps).value ?? defaultMonth ?? today;
    };

    const [viewYear, setViewYear] = useState(() => (getInitialDate() ?? today).getFullYear());
    const [viewMonth, setViewMonth] = useState(() => (getInitialDate() ?? today).getMonth());
    const [pickerMode, setPickerMode] = useState<"days" | "months" | "years">("days");
    const [rangeHover, setRangeHover] = useState<Date | null>(null);
    const [timeHours, setTimeHours] = useState(() => {
      const d = props.mode === "single" ? (props as CalendarSingleProps).value : null;
      return d ? d.getHours() : 0;
    });
    const [timeMinutes, setTimeMinutes] = useState(() => {
      const d = props.mode === "single" ? (props as CalendarSingleProps).value : null;
      return d ? d.getMinutes() : 0;
    });

    const days = useMemo(() => {
      const count = getDaysInMonth(viewYear, viewMonth);
      const offset = getFirstDayOfMonth(viewYear, viewMonth, weekStartsOn);
      return { count, offset };
    }, [viewYear, viewMonth, weekStartsOn]);

    const weekLabels = useMemo(() => {
      const base = weekStartsOn === 1
        ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      return base;
    }, [weekStartsOn]);

    const isSelected = useCallback((d: Date): boolean => {
      if (props.mode === "single") {
        return !!props.value && isSameDay(d, props.value);
      }
      if (props.mode === "range") {
        const [s, e] = props.value ?? [null, null];
        return (!!s && isSameDay(d, s)) || (!!e && isSameDay(d, e));
      }
      if (props.mode === "multiple") {
        return (props.value ?? []).some((v) => isSameDay(d, v));
      }
      return false;
    }, [props]);

    const isInRange = useCallback((d: Date): boolean => {
      if (props.mode !== "range") return false;
      const [s, e] = props.value ?? [null, null];
      const end = e ?? rangeHover;
      if (!s || !end) return false;
      const lo = isBefore(s, end) ? s : end;
      const hi = isBefore(s, end) ? end : s;
      return isAfter(d, lo) && isBefore(d, hi);
    }, [props, rangeHover]);

    const isRangeStart = useCallback((d: Date): boolean => {
      if (props.mode !== "range") return false;
      const [s] = props.value ?? [null, null];
      return !!s && isSameDay(d, s);
    }, [props]);

    const isRangeEnd = useCallback((d: Date): boolean => {
      if (props.mode !== "range") return false;
      const [, e] = props.value ?? [null, null];
      return !!e && isSameDay(d, e);
    }, [props]);

    const isOutOfBounds = useCallback((d: Date): boolean => {
      if (minDate && isBefore(d, minDate)) return true;
      if (maxDate && isAfter(d, maxDate)) return true;
      if (isDisabledFn?.(d)) return true;
      return false;
    }, [minDate, maxDate, isDisabledFn]);

    const handleDayClick = useCallback((day: number) => {
      const clicked = new Date(viewYear, viewMonth, day, timeHours, timeMinutes);
      if (isOutOfBounds(startOfDay(clicked))) return;

      if (props.mode === "single" || !props.mode) {
        (props as CalendarSingleProps).onChange?.(clicked);
      } else if (props.mode === "range") {
        const [s, e] = props.value ?? [null, null];
        if (!s || (s && e)) {
          props.onChange?.([clicked, null]);
        } else {
          if (isBefore(clicked, s)) props.onChange?.([clicked, s]);
          else props.onChange?.([s, clicked]);
        }
      } else if (props.mode === "multiple") {
        const current = props.value ?? [];
        const existing = current.findIndex((v) => isSameDay(v, clicked));
        if (existing >= 0) {
          props.onChange?.(current.filter((_, i) => i !== existing));
        } else {
          props.onChange?.([...current, clicked]);
        }
      }
    }, [viewYear, viewMonth, timeHours, timeMinutes, props, isOutOfBounds]);

    const prevMonth = () => {
      if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
      else setViewMonth((m) => m - 1);
    };
    const nextMonth = () => {
      if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
      else setViewMonth((m) => m + 1);
    };

    const handleTimeChange = (h: number, m: number) => {
      setTimeHours(h);
      setTimeMinutes(m);
      if (props.mode === "single" && props.value) {
        const updated = new Date(props.value);
        updated.setHours(h, m);
        (props as CalendarSingleProps).onChange?.(updated);
      }
    };

    const yearStart = Math.floor(viewYear / YEARS_RANGE) * YEARS_RANGE;

    return (
      <div ref={ref} className={cn("vyre-calendar", className)}>
        {/* Header */}
        <div className="vyre-calendar__header">
          {pickerMode === "days" && (
            <button className="vyre-calendar__nav" onClick={prevMonth} aria-label="Previous month">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {pickerMode === "years" && (
            <button className="vyre-calendar__nav" onClick={() => setViewYear((y) => y - YEARS_RANGE)} aria-label="Previous years">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <div className="vyre-calendar__header-center">
            <button
              className="vyre-calendar__header-btn"
              onClick={() => setPickerMode(pickerMode === "months" ? "days" : "months")}
            >
              {MONTHS[viewMonth]}
            </button>
            <button
              className="vyre-calendar__header-btn"
              onClick={() => setPickerMode(pickerMode === "years" ? "days" : "years")}
            >
              {viewYear}
            </button>
          </div>

          {pickerMode === "days" && (
            <button className="vyre-calendar__nav" onClick={nextMonth} aria-label="Next month">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {pickerMode === "years" && (
            <button className="vyre-calendar__nav" onClick={() => setViewYear((y) => y + YEARS_RANGE)} aria-label="Next years">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Month picker */}
        {pickerMode === "months" && (
          <div className="vyre-calendar__month-grid">
            {MONTHS.map((name, i) => (
              <button
                key={name}
                className={cn("vyre-calendar__month-cell", i === viewMonth && "vyre-calendar__month-cell--active")}
                onClick={() => { setViewMonth(i); setPickerMode("days"); }}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Year picker */}
        {pickerMode === "years" && (
          <div className="vyre-calendar__year-grid">
            {Array.from({ length: YEARS_RANGE }, (_, i) => yearStart + i).map((y) => (
              <button
                key={y}
                className={cn("vyre-calendar__year-cell", y === viewYear && "vyre-calendar__year-cell--active")}
                onClick={() => { setViewYear(y); setPickerMode("days"); }}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Day grid */}
        {pickerMode === "days" && (
          <div className="vyre-calendar__grid">
            {weekLabels.map((l) => (
              <div key={l} className="vyre-calendar__weekday">{l}</div>
            ))}
            {Array.from({ length: days.offset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: days.count }, (_, i) => i + 1).map((day) => {
              const date = new Date(viewYear, viewMonth, day);
              const sel = isSelected(date);
              const inRange = isInRange(date);
              const rangeStart = isRangeStart(date);
              const rangeEnd = isRangeEnd(date);
              const oob = isOutOfBounds(date);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={day}
                  className={cn(
                    "vyre-calendar__day",
                    isToday && "vyre-calendar__day--today",
                    sel && "vyre-calendar__day--selected",
                    inRange && "vyre-calendar__day--in-range",
                    rangeStart && "vyre-calendar__day--range-start",
                    rangeEnd && "vyre-calendar__day--range-end",
                    oob && "vyre-calendar__day--disabled",
                  )}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => {
                    if (props.mode === "range") {
                      const [s, e] = props.value ?? [null, null];
                      if (s && !e) setRangeHover(date);
                    }
                  }}
                  onMouseLeave={() => setRangeHover(null)}
                  disabled={oob}
                  aria-selected={sel}
                  aria-label={formatDate(date)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}

        {/* Time picker */}
        {showTime && pickerMode === "days" && (
          <div className="vyre-calendar__time">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="number"
              className="vyre-calendar__time-input"
              min={0} max={23}
              value={timeHours}
              onChange={(e) => handleTimeChange(Number(e.target.value), timeMinutes)}
              aria-label="Hours"
            />
            <span className="vyre-calendar__time-sep">:</span>
            <input
              type="number"
              className="vyre-calendar__time-input"
              min={0} max={59}
              value={timeMinutes}
              onChange={(e) => handleTimeChange(timeHours, Number(e.target.value))}
              aria-label="Minutes"
            />
          </div>
        )}
      </div>
    );
  }
);
Calendar.displayName = "VyreCalendar";
