/**
 * @usevyre/react — Sparkline
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  Sparkline                                             │
 * │ Import:     import { Sparkline } from "@usevyre/react"            │
 * │                                                                   │
 * │ Tiny inline chart — no axis, legend, or tooltip. For Stat cards   │
 * │ and table cells.                                                  │
 * │   data    = number[]            (required)                        │
 * │   variant = "line"(default) | "area" | "bar"                     │
 * │   color?  = string  (token, default --vyre-color-semantic-accent) │
 * │   width?  = number (default 80)   height? = number (default 24)   │
 * └──────────────────────────────────────────────────────────────────┘
 */
import React from "react";
import { cn } from "../../utils/cn";
import { scaleLinear, buildLinePath, buildAreaPath } from "../../utils/chart-math";

export interface SparklineProps {
  data: number[];
  variant?: "line" | "area" | "bar";
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data, variant = "line", color = "var(--vyre-color-semantic-accent)",
  width = 80, height = 24, className,
}) => {
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const x = scaleLinear([0, Math.max(data.length - 1, 1)], [1, width - 1]);
  const y = scaleLinear([min, max], [height - 1, 1]);
  const pts = data.map((v, i) => [x(i), y(v)] as const);
  const label = `Sparkline, ${data.length} points`;
  return (
    <span className={cn("vyre-sparkline", className)}>
      <svg width={width} height={height} role="img" aria-label={label}>
        {variant === "bar"
          ? data.map((v, i) => {
              const bw = (width / data.length) * 0.7;
              const bx = (width / data.length) * i + (width / data.length - bw) / 2;
              const by = y(v);
              return <rect key={i} x={bx} y={by} width={bw} height={height - by} fill={color} />;
            })
          : variant === "area"
          ? <path d={buildAreaPath(pts, height, "linear")} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1.5} />
          : <path d={buildLinePath(pts, "linear")} fill="none" stroke={color} strokeWidth={1.5} />}
      </svg>
    </span>
  );
};
Sparkline.displayName = "VyreSparkline";
