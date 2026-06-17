/**
 * @usevyre/react — LineChart
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  LineChart                                            │
 * │ Import:     import { LineChart } from "@usevyre/react"            │
 * │                                                                   │
 * │ Multi-series line chart. Data + config driven (NOT JSX children). │
 * │   data        = ChartDatum[]  (required — array of row objects)   │
 * │   config      = ChartConfig   (required — { key: {label,color} }) │
 * │   xKey        = string        (required — the x-axis field name)  │
 * │   curve       = "linear"(default) | "smooth"                     │
 * │   dots        = boolean (default false — draw a dot per point)    │
 * │   width       = number (default 480)   height = number (240)      │
 * │   showGrid    = boolean (default true)                            │
 * │   showLegend  = boolean (default true — toggleable series)        │
 * │   showTooltip = boolean (default true — hover + arrow keys)       │
 * │                                                                   │
 * │ One <path data-series> per series; colors come ONLY from config.  │
 * │                                                                   │
 * │ ANTI-PATTERNS:                                                    │
 * │   ❌ series={...}                 ✅ data + config                 │
 * │   ❌ color="blue"                 ✅ color token in config         │
 * │   ❌ <XAxis/> / <Tooltip/> kids   ✅ showGrid / showTooltip props  │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <LineChart
 *   data={[{ month: "Jan", revenue: 10 }, { month: "Feb", revenue: 20 }]}
 *   config={{ revenue: { label: "Revenue", color: "var(--vyre-color-semantic-accent)" } }}
 *   xKey="month"
 * />
 */
import React from "react";
import { cn } from "../../utils/cn";
import { scaleLinear, niceTicks, buildLinePath, type Curve } from "../../utils/chart-math";
import type { ChartConfig, ChartDatum } from "../Chart/chart-types";
import {
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  useChartTooltip,
  type ChartTooltipRow,
} from "../Chart/ChartParts";

export interface LineChartProps {
  data: ChartDatum[];
  config: ChartConfig;
  xKey: string;
  curve?: Curve;
  dots?: boolean;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const PAD = { left: 32, right: 8, top: 8, bottom: 24 };

export const LineChart: React.FC<LineChartProps> = ({
  data,
  config,
  xKey,
  curve = "linear",
  dots = false,
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

  // y-domain across all visible series (always include 0)
  const values: number[] = [0];
  for (const row of data) {
    for (const key of visibleKeys) {
      const v = row[key];
      if (typeof v === "number") values.push(v);
    }
  }
  const yMin = Math.min(...values);
  const yMax = Math.max(...values);

  const innerWidth = width - PAD.left - PAD.right;
  const innerHeight = height - PAD.top - PAD.bottom;

  const xScale = scaleLinear([0, Math.max(data.length - 1, 1)], [PAD.left, width - PAD.right]);
  const yScale = scaleLinear([yMin, yMax], [PAD.top + innerHeight, PAD.top]);
  const ticks = niceTicks(yMin, yMax);

  const pointsFor = (key: string) =>
    data.map((row, i) => {
      const v = row[key];
      return [xScale(i), yScale(typeof v === "number" ? v : 0)] as const;
    });

  const seriesLabels = seriesKeys.map((k) => config[k].label).join(", ");
  const xLabels = data.map((row) => String(row[xKey] ?? ""));
  const ariaLabel = `Line chart: ${seriesLabels} across ${data.length} points`;

  const rowsForIndex = (index: number): ChartTooltipRow[] =>
    visibleKeys.map((key) => ({
      label: config[key].label,
      value: data[index]?.[key] ?? "",
      color: config[key].color,
    }));

  const showTooltipAt = (index: number) => {
    if (data.length === 0) return;
    const clamped = Math.max(0, Math.min(data.length - 1, index));
    setActiveIndex(clamped);
    const px = xScale(clamped);
    const py = yScale(yMax);
    tooltip.show(px, py, rowsForIndex(clamped));
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const invert = scaleLinear([PAD.left, width - PAD.right], [0, Math.max(data.length - 1, 1)]);
    showTooltipAt(Math.round(invert(mx)));
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
        {showGrid && (
          <g transform={`translate(${PAD.left}, 0)`}>
            <ChartGrid ticks={ticks} scaleY={yScale} width={innerWidth} />
          </g>
        )}
        {visibleKeys.map((key) => {
          const pts = pointsFor(key);
          return (
            <path
              key={key}
              className="vyre-chart__line"
              data-series={key}
              d={buildLinePath(pts, curve)}
              fill="none"
              stroke={config[key].color}
              strokeWidth={2}
            />
          );
        })}
        {showGrid &&
          xLabels.map((label, i) => (
            <text
              key={`x-${i}`}
              className="vyre-chart__axis-label"
              x={xScale(i)}
              y={height - PAD.bottom + 16}
              textAnchor="middle"
            >
              {label}
            </text>
          ))}
        {dots &&
          visibleKeys.map((key) =>
            pointsFor(key).map(([cx, cy], i) => (
              <circle
                key={`${key}-${i}`}
                className="vyre-chart__dot"
                cx={cx}
                cy={cy}
                r={3}
                fill={config[key].color}
              />
            )),
          )}
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
LineChart.displayName = "VyreLineChart";
