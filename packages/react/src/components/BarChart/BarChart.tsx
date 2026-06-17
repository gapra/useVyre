/**
 * @usevyre/react — BarChart
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  BarChart                                             │
 * │ Import:     import { BarChart } from "@usevyre/react"             │
 * │                                                                   │
 * │ Multi-series bar chart. Data + config driven (NOT JSX children).  │
 * │   data        = ChartDatum[]  (required — array of row objects)   │
 * │   config      = ChartConfig   (required — { key: {label,color} }) │
 * │   xKey        = string        (required — the x-axis field name)  │
 * │   orientation = "vertical"(default) | "horizontal"               │
 * │   stacked     = boolean (default false — accumulate series)       │
 * │   width       = number (default 480)   height = number (240)      │
 * │   showGrid    = boolean (default true)                            │
 * │   showLegend  = boolean (default true — toggleable series)        │
 * │   showTooltip = boolean (default true — hover + arrow keys)       │
 * │                                                                   │
 * │ x-axis is BANDED by data index (one band per datum). Multiple     │
 * │ series → grouped side-by-side bars, or stacked when stacked.      │
 * │ One <rect data-series> per bar; colors come ONLY from config.     │
 * │                                                                   │
 * │ ANTI-PATTERNS:                                                    │
 * │   ❌ series={...}                 ✅ data + config                 │
 * │   ❌ color="blue"                 ✅ color token in config         │
 * │   ❌ <XAxis/> / <Tooltip/> kids   ✅ showGrid / showTooltip props  │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <BarChart
 *   data={[{ region: "NA", sales: 30 }, { region: "EU", sales: 25 }]}
 *   config={{ sales: { label: "Sales", color: "var(--vyre-color-semantic-accent)" } }}
 *   xKey="region"
 * />
 */
import React from "react";
import { cn } from "../../utils/cn";
import { scaleLinear, niceTicks } from "../../utils/chart-math";
import type { ChartConfig, ChartDatum } from "../Chart/chart-types";
import {
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  useChartTooltip,
  type ChartTooltipRow,
} from "../Chart/ChartParts";

export interface BarChartProps {
  data: ChartDatum[];
  config: ChartConfig;
  xKey: string;
  orientation?: "vertical" | "horizontal";
  stacked?: boolean;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const PAD = { left: 32, right: 8, top: 8, bottom: 24 };
const BAND_INNER_PAD = 0.2;

export const BarChart: React.FC<BarChartProps> = ({
  data,
  config,
  xKey,
  orientation = "vertical",
  stacked = false,
  width = 480,
  height = 240,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
}) => {
  const seriesKeys = Object.keys(config);
  const [hidden, setHidden] = React.useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const tooltip = useChartTooltip();

  const onToggle = (key: string) =>
    setHidden((prev) => ({ ...prev, [key]: !prev[key] }));

  const visibleKeys = seriesKeys.filter((k) => !hidden[k]);

  const num = (v: unknown) => (typeof v === "number" ? v : 0);

  // value-domain across all visible series (always include 0).
  // When stacked, the domain top is the per-row sum of visible series.
  const values: number[] = [0];
  for (const row of data) {
    if (stacked) {
      let sum = 0;
      for (const key of visibleKeys) sum += num(row[key]);
      values.push(sum);
    } else {
      for (const key of visibleKeys) values.push(num(row[key]));
    }
  }
  const vMin = Math.min(...values);
  const vMax = Math.max(...values);

  const innerWidth = width - PAD.left - PAD.right;
  const innerHeight = height - PAD.top - PAD.bottom;

  const isVertical = orientation === "vertical";

  // value scale maps the data value onto the value axis.
  // vertical → y (top is vMax), horizontal → x (right is vMax).
  const valueScale = isVertical
    ? scaleLinear([vMin, vMax], [PAD.top + innerHeight, PAD.top])
    : scaleLinear([vMin, vMax], [PAD.left, width - PAD.right]);
  const ticks = niceTicks(vMin, vMax);

  // banded category axis: one band per datum along the cross axis.
  const n = Math.max(data.length, 1);
  const bandSpan = (isVertical ? innerWidth : innerHeight) / n;
  const bandStart = isVertical ? PAD.left : PAD.top;
  const innerBand = bandSpan * (1 - BAND_INNER_PAD);
  const bandPadOffset = (bandSpan - innerBand) / 2;
  const slotCount = stacked ? 1 : Math.max(visibleKeys.length, 1);
  const slotSize = innerBand / slotCount;

  // zero position on the value axis (where bars originate from).
  const valueZero = valueScale(Math.max(vMin, 0));

  type Bar = { key: string; x: number; y: number; w: number; h: number };
  const bars: Bar[] = [];
  data.forEach((row, i) => {
    const bandOrigin = bandStart + i * bandSpan + bandPadOffset;
    let stackAcc = 0;
    visibleKeys.forEach((key, si) => {
      const value = num(row[key]);
      if (isVertical) {
        const slotX = stacked ? bandOrigin : bandOrigin + si * slotSize;
        if (stacked) {
          const top = valueScale(stackAcc + value);
          const base = valueScale(stackAcc);
          stackAcc += value;
          bars.push({ key, x: slotX, y: top, w: innerBand, h: Math.abs(base - top) });
        } else {
          const top = valueScale(value);
          bars.push({ key, x: slotX, y: Math.min(top, valueZero), w: slotSize, h: Math.abs(valueZero - top) });
        }
      } else {
        const slotY = stacked ? bandOrigin : bandOrigin + si * slotSize;
        if (stacked) {
          const end = valueScale(stackAcc + value);
          const base = valueScale(stackAcc);
          stackAcc += value;
          bars.push({ key, x: Math.min(base, end), y: slotY, w: Math.abs(end - base), h: innerBand });
        } else {
          const end = valueScale(value);
          bars.push({ key, x: Math.min(valueZero, end), y: slotY, w: Math.abs(end - valueZero), h: slotSize });
        }
      }
    });
  });

  const seriesLabels = seriesKeys.map((k) => config[k].label).join(", ");
  const xLabels = data.map((row) => String(row[xKey] ?? ""));
  const ariaLabel = `Bar chart: ${seriesLabels} across ${data.length} categories`;

  const rowsForIndex = (index: number): ChartTooltipRow[] =>
    visibleKeys.map((key) => ({
      label: config[key].label,
      value: data[index]?.[key] ?? "",
      color: config[key].color,
    }));

  const bandCenter = (index: number) =>
    bandStart + index * bandSpan + bandSpan / 2;

  const showTooltipAt = (index: number) => {
    if (data.length === 0) return;
    const clamped = Math.max(0, Math.min(data.length - 1, index));
    setActiveIndex(clamped);
    const center = bandCenter(clamped);
    const px = isVertical ? center : valueScale(vMax);
    const py = isVertical ? valueScale(vMax) : center;
    tooltip.show(px, py, rowsForIndex(clamped));
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = isVertical ? e.clientX - rect.left : e.clientY - rect.top;
    const index = Math.floor((pos - bandStart) / bandSpan);
    showTooltipAt(index);
  };

  const handleMouseLeave = () => {
    if (!showTooltip) return;
    setActiveIndex(null);
    tooltip.hide();
  };

  const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!showTooltip || data.length === 0) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showTooltipAt((activeIndex ?? 0) - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      showTooltipAt((activeIndex ?? -1) + 1);
    }
  };

  return (
    <div className={cn("vyre-chart", className)}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
        tabIndex={showTooltip ? 0 : undefined}
        onMouseMove={showTooltip ? handleMouseMove : undefined}
        onMouseLeave={showTooltip ? handleMouseLeave : undefined}
        onKeyDown={showTooltip ? handleKeyDown : undefined}
      >
        {showGrid && isVertical && (
          <g transform={`translate(${PAD.left}, 0)`}>
            <ChartGrid ticks={ticks} scaleY={valueScale} width={innerWidth} />
          </g>
        )}
        {bars.map((bar, i) => (
          <rect
            key={`${bar.key}-${i}`}
            className="vyre-chart__bar"
            data-series={bar.key}
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            fill={config[bar.key].color}
          />
        ))}
        {showGrid &&
          xLabels.map((label, i) => (
            <text
              key={`x-${i}`}
              className="vyre-chart__axis-label"
              x={isVertical ? bandCenter(i) : PAD.left}
              y={isVertical ? height - PAD.bottom + 16 : bandCenter(i)}
              textAnchor={isVertical ? "middle" : "end"}
            >
              {label}
            </text>
          ))}
      </svg>
      {showLegend && (
        <ChartLegend config={config} hidden={hidden} onToggle={onToggle} />
      )}
      {showTooltip && tooltip.active && tooltip.data && (
        <ChartTooltip x={tooltip.data.x} y={tooltip.data.y} rows={tooltip.data.rows} />
      )}
    </div>
  );
};
BarChart.displayName = "VyreBarChart";
