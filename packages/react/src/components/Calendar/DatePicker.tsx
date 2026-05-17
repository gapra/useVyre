/**
 * @usevyre/react — DatePicker
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Component:  DatePicker (input trigger + popover Calendar)   │
 * │ Import:     import { DatePicker } from "@usevyre/react"     │
 * │                                                             │
 * │ = all Calendar props +                                       │
 * │   placeholder    = string (default "Pick a date")           │
 * │   inputClassName = string                                    │
 * │                                                             │
 * │ mode = "single"(default) | "range" | "multiple"             │
 * │ value = Date | [Date,Date] | Date[] (matches mode)          │
 * │                                                             │
 * │ Renders a button that opens a Calendar in a portal popover. │
 * │ For an always-visible inline grid, use Calendar.            │
 * │ For start/end ranges with presets + dual month, use         │
 * │ DateRangePicker.                                            │
 * └─────────────────────────────────────────────────────────────┘
 *
 * @example
 * // Single date
 * <DatePicker mode="single" value={date} onChange={setDate} placeholder="Pick a date" />
 *
 * // Date + time
 * <DatePicker value={date} onChange={setDate} showTime />
 */

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";
import {
  Calendar,
  formatDate,
  formatTime,
  type CalendarProps,
  type CalendarSingleProps,
  type CalendarRangeProps,
  type CalendarMultipleProps,
  type CalendarBaseProps,
  type DatePickerProps,
} from "./Calendar";

export type { DatePickerProps };

function formatPickerValue(props: CalendarProps): string {
  if (props.mode === "range") {
    const [s, e] = props.value ?? [null, null];
    if (!s) return "";
    if (!e) return formatDate(s);
    return `${formatDate(s)} – ${formatDate(e)}`;
  }
  if (props.mode === "multiple") {
    const dates = props.value ?? [];
    if (dates.length === 0) return "";
    if (dates.length === 1) return formatDate(dates[0]);
    return `${dates.length} dates selected`;
  }
  const v = (props as CalendarSingleProps).value;
  const showTime = (props as CalendarBaseProps).showTime;
  if (!v) return "";
  return showTime ? `${formatDate(v)} ${formatTime(v)}` : formatDate(v);
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ placeholder = "Pick a date", inputClassName, ...calendarProps }, ref) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const displayValue = formatPickerValue(calendarProps);

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

    const autoClose = calendarProps.mode !== "range" && calendarProps.mode !== "multiple" && !calendarProps.showTime;

    const wrappedProps: CalendarProps = useMemo(() => {
      if (calendarProps.mode === "range") {
        return {
          ...calendarProps,
          onChange: (v: [Date | null, Date | null]) => {
            (calendarProps as CalendarRangeProps).onChange?.(v);
            if (v[0] && v[1]) setOpen(false);
          },
        };
      }
      if (calendarProps.mode === "multiple") return calendarProps;
      return {
        ...calendarProps,
        onChange: (v) => {
          (calendarProps as CalendarSingleProps).onChange?.(v);
          if (autoClose) setOpen(false);
        },
      };
    }, [calendarProps, autoClose]);

    return (
      <div ref={ref} className="vyre-datepicker">
        <button
          ref={triggerRef}
          type="button"
          className={cn("vyre-datepicker__trigger", !displayValue && "vyre-datepicker__trigger--placeholder", inputClassName)}
          onClick={() => { updatePos(); setOpen((o) => !o); }}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <svg className="vyre-datepicker__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1.5 6h11M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>{displayValue || placeholder}</span>
          {displayValue && (
            <button
              className="vyre-datepicker__clear"
              type="button"
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation();
                if (calendarProps.mode === "range") (calendarProps as CalendarRangeProps).onChange?.([null, null]);
                else if (calendarProps.mode === "multiple") (calendarProps as CalendarMultipleProps).onChange?.([]);
                else (calendarProps as CalendarSingleProps).onChange?.(null);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </button>

        {open && ReactDOM.createPortal(
          <div
            ref={popoverRef}
            className="vyre-datepicker__popover"
            role="dialog"
            aria-label="Date picker"
            style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
          >
            <Calendar {...wrappedProps} />
          </div>,
          document.body
        )}
      </div>
    );
  }
);
DatePicker.displayName = "VyreDatePicker";
