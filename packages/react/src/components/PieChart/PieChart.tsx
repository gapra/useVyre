/**
 * @usevyre/react — PieChart
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  PieChart                                             │
 * │ Import:     import { PieChart } from "@usevyre/react"            │
 * │                                                                   │
 * │ Single-level pie/donut chart. FLAT data (NOT multi-series).       │
 * │   data        = { name: string; value: number }[]  (required)     │
 * │   config      = ChartConfig (optional — { name: {label,color} })  │
 * │                  unmatched names fall back to a token color cycle │
 * │   donut       = boolean (default false — hollow center ring)      │
 * │   size        = number (default 240 — svg width AND height)       │
 * │   showLegend  = boolean (default true — toggleable segments)      │
 * │   showTooltip = boolean (default true — hover segment)            │
 * │                                                                   │
 * │ One <path data-name> per datum; colors come from config or the    │
 * │ documented token cycle. Hidden segments are excluded + total      │
 * │ recomputed from the visible ones.                                 │
 * │                                                                   │
 * │ ANTI-PATTERNS:                                                   │
 * │   ❌ data={[1, 2, 3]}             ✅ data={[{ name, value }]}      │
 * │   ❌ color="blue"                 ✅ config token or auto cycle    │
 * │   ❌ <Pie>/<Cell> children        ✅ data + donut props           │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <PieChart
 *   data={[
 *     { name: "Chrome", value: 60 },
 *     { name: "Safari", value: 25 },
 *     { name: "Firefox", value: 15 },
 *   ]}
 *   donut
 * />
 */
import React from "react";
import { cn } from "../../utils/cn";
import { arcPath } from "../../utils/chart-math";
import type { ChartConfig } from "../Chart/chart-types";
import {
  ChartLegend,
  ChartTooltip,
  useChartTooltip,
  type ChartTooltipRow,
} from "../Chart/ChartParts";

export interface PieDatum {
  name: string;
  value: number;
}

export interface PieChartProps {
  data: PieDatum[];
  config?: ChartConfig;
  donut?: boolean;
  size?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

/** Token color cycle for segments without an explicit config entry. */
const COLOR_CYCLE = [
  "var(--vyre-color-semantic-accent)",
  "var(--vyre-color-semantic-teal)",
  "var(--vyre-color-semantic-success)",
  "var(--vyre-color-semantic-warning)",
  "var(--vyre-color-semantic-danger)",
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  config,
  donut = false,
  size = 240,
  showLegend = true,
  showTooltip = true,
  className,
}) => {
  const [hidden, setHidden] = React.useState<Record<string, boolean>>({});
  const [activeName, setActiveName] = React.useState<string | null>(null);
  const tooltip = useChartTooltip();
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const onToggle = (name: string) =>
    setHidden((prev) => ({ ...prev, [name]: !prev[name] }));

  const colorFor = (name: string, index: number): string =>
    config?.[name]?.color ?? COLOR_CYCLE[index % COLOR_CYCLE.length];

  // Legend config built from ALL data names (label = name, resolved color).
  const legendConfig: ChartConfig = {};
  data.forEach((d, i) => {
    legendConfig[d.name] = {
      label: config?.[d.name]?.label ?? d.name,
      color: colorFor(d.name, i),
    };
  });

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = donut ? r * 0.55 : 0;

  // Visible segments only; total recomputed from visible values.
  const visible = data.filter((d) => !hidden[d.name]);
  const total = visible.reduce(
    (sum, d) => sum + (typeof d.value === "number" ? d.value : 0),
    0,
  );

  type Slice = { name: string; color: string; d: string };
  const slices: Slice[] = [];
  if (total > 0) {
    let angle = 0;
    visible.forEach((datum) => {
      // index in original data for stable color resolution.
      const originalIndex = data.indexOf(datum);
      const value = typeof datum.value === "number" ? datum.value : 0;
      const sweep = (value / total) * Math.PI * 2;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      slices.push({
        name: datum.name,
        color: colorFor(datum.name, originalIndex),
        d: arcPath(cx, cy, r, start, end, innerR),
      });
    });
  }

  const ariaLabel = `Pie chart: ${data.length} segments`;

  const rowsForName = (name: string): ChartTooltipRow[] => {
    const datum = data.find((d) => d.name === name);
    return [
      {
        label: legendConfig[name]?.label ?? name,
        value: datum?.value ?? "",
        color: legendConfig[name]?.color ?? "",
      },
    ];
  };

  // Track which slice the cursor is over (per-slice enter).
  const handleEnter = (name: string) => {
    if (!showTooltip) return;
    setActiveName(name);
  };

  const handleLeave = () => {
    if (!showTooltip) return;
    setActiveName(null);
    tooltip.hide();
  };

  // A single svg-level mousemove keeps the tooltip glued to the cursor in
  // PIXEL space, using the currently-hovered slice's data.
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || !activeName) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mxPx = e.clientX - rect.left;
    const myPx = e.clientY - rect.top;
    tooltip.show(mxPx + 12, myPx + 12, rowsForName(activeName), activeName);
  };

  return (
    <div className={cn("vyre-chart vyre-chart--pie", className)}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        style={{ maxWidth: size }}
        onMouseMove={showTooltip ? handleMouseMove : undefined}
        onMouseLeave={showTooltip ? handleLeave : undefined}
      >
        {slices.map((slice, i) => (
          <path
            key={`${slice.name}-${i}`}
            className="vyre-chart__slice"
            data-name={slice.name}
            d={slice.d}
            fill={slice.color}
            onMouseEnter={showTooltip ? () => handleEnter(slice.name) : undefined}
          />
        ))}
      </svg>
      {showLegend && (
        <ChartLegend config={legendConfig} hidden={hidden} onToggle={onToggle} />
      )}
      {showTooltip && tooltip.active && tooltip.data && (
        <ChartTooltip x={tooltip.data.x} y={tooltip.data.y} rows={tooltip.data.rows} title={tooltip.data.title} />
      )}
    </div>
  );
};
PieChart.displayName = "VyrePieChart";
