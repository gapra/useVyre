/**
 * @usevyre/react — Stat + StatGroup
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  Stat (+ StatGroup)                                    │
 * │ Import:     import { Stat, StatGroup } from "@usevyre/react"       │
 * │                                                                   │
 * │ Presentational dashboard KPI. No state.                           │
 * │                                                                   │
 * │   label        = string (required)                                │
 * │   value        = string | number (required, large)                │
 * │   delta?       = string | number  (the change amount)             │
 * │   trend?       = "up" | "down" | "neutral"  (CONTROLS the color   │
 * │                   — up=success, down=danger, neutral=muted)        │
 * │   deltaLabel?  = string  (e.g. "vs last month")                   │
 * │   icon?        = ReactNode                                         │
 * │   size         = "sm" | "md"(default) | "lg"                      │
 * │                                                                   │
 * │ trend is EXPLICIT so "churn down = good" can stay green.          │
 * │ Wrap several in <StatGroup> for an evenly-split row with dividers.│
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <StatGroup>
 *   <Stat label="Revenue" value="$48.2k" delta="+12%" trend="up"
 *         deltaLabel="vs last month" />
 *   <Stat label="Churn" value="2.1%" delta="-0.4%" trend="up"
 *         deltaLabel="lower is better" />
 *   <Stat label="Orders" value="1,204" delta="0%" trend="neutral" />
 * </StatGroup>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

/**
 * Direction of the arrow follows the SIGN of the delta value (the actual
 * change), not the trend. Color comes from `trend`. So churn falling
 * (delta "-0.4%", trend "up") shows a DOWN arrow that is green.
 */
type Direction = "up" | "down" | "flat";

const deltaDirection = (delta: string | number | undefined): Direction => {
  if (delta === undefined || delta === null) return "flat";
  if (typeof delta === "number")
    return delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const s = delta.trim();
  if (s.startsWith("-") || s.startsWith("−")) return "down"; // - or −
  if (s.startsWith("+")) return "up";
  // Numeric string without explicit sign
  const n = parseFloat(s.replace(/[^0-9.\-]/g, ""));
  if (!Number.isNaN(n)) return n > 0 ? "up" : n < 0 ? "down" : "flat";
  return "flat";
};

const TrendArrow = ({ direction }: { direction: Direction }) => {
  if (direction === "flat")
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  const up = direction === "up";
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d={up ? "M6 2.5L10 7H2L6 2.5Z" : "M6 9.5L2 5h8L6 9.5Z"}
        fill="currentColor"
      />
    </svg>
  );
};

export type StatTrend = "up" | "down" | "neutral";

export interface StatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    BaseProps {
  /** Metric name (required) */
  label: string;
  /** The headline figure (required) */
  value: string | number;
  /** The change amount, e.g. "+12%" or 24 */
  delta?: string | number;
  /** Explicitly sets the delta color — up=success, down=danger, neutral=muted */
  trend?: StatTrend;
  /** Context for the delta, e.g. "vs last month" */
  deltaLabel?: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  (
    {
      label,
      value,
      delta,
      trend = "neutral",
      deltaLabel,
      icon,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("vyre-stat", `vyre-stat--${size}`, className)}
        {...props}
      >
        {icon && (
          <span className="vyre-stat__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="vyre-stat__body">
          <span className="vyre-stat__label">{label}</span>
          <span className="vyre-stat__value">{value}</span>
          {delta !== undefined && (
            <span
              className="vyre-stat__delta"
              data-trend={trend}
            >
              <TrendArrow direction={deltaDirection(delta)} />
              <span className="vyre-stat__delta-value">{delta}</span>
              {deltaLabel && (
                <span className="vyre-stat__delta-label">{deltaLabel}</span>
              )}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Stat.displayName = "VyreStat";

// ── StatGroup ─────────────────────────────────────────────────

export interface StatGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  children?: React.ReactNode;
}

export const StatGroup = React.forwardRef<HTMLDivElement, StatGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn("vyre-stat-group", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StatGroup.displayName = "VyreStatGroup";
