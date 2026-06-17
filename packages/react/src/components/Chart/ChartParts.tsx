/**
 * useVyre — shared Chart sub-components
 * Internal helpers (Grid, Legend, Tooltip + tooltip hook) used by
 * LineChart/AreaChart/BarChart/PieChart. Not exported from the package index.
 */
import * as React from "react";
import type { ChartConfig } from "./chart-types";

/** A single row rendered in the chart tooltip. */
export interface ChartTooltipRow {
  label: string;
  value: string | number;
  color: string;
}

/** SVG gridlines + axis labels for each Y tick. Render inside the chart's <svg>. */
export function ChartGrid({
  ticks,
  scaleY,
  width,
}: {
  ticks: number[];
  scaleY: (v: number) => number;
  width: number;
}) {
  return (
    <g className="vyre-chart__grid">
      {ticks.map((t) => (
        <React.Fragment key={t}>
          <line x1={0} x2={width} y1={scaleY(t)} y2={scaleY(t)} />
          <text className="vyre-chart__axis-label" x={0} y={scaleY(t) - 2}>
            {t}
          </text>
        </React.Fragment>
      ))}
    </g>
  );
}

/** Toggleable HTML legend; each item's aria-pressed reflects series visibility. */
export function ChartLegend({
  config,
  hidden,
  onToggle,
}: {
  config: ChartConfig;
  hidden: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="vyre-chart__legend">
      {Object.keys(config).map((key) => (
        <button
          key={key}
          type="button"
          className="vyre-chart__legend-item"
          aria-pressed={!hidden[key]}
          onClick={() => onToggle(key)}
        >
          <span
            className="vyre-chart__legend-swatch"
            style={{ background: config[key].color }}
          />
          {config[key].label}
        </button>
      ))}
    </div>
  );
}

/** Absolutely-positioned hover tooltip; left/top are relative to the .vyre-chart container. */
export function ChartTooltip({
  x,
  y,
  rows,
}: {
  x: number;
  y: number;
  rows: ChartTooltipRow[];
}) {
  return (
    <div className="vyre-chart__tooltip" style={{ left: x, top: y }}>
      {rows.map((row, i) => (
        <div key={i}>
          <span
            className="vyre-chart__legend-swatch"
            style={{ background: row.color }}
          />
          {row.label}: {row.value}
        </div>
      ))}
    </div>
  );
}

interface ChartTooltipData {
  x: number;
  y: number;
  rows: ChartTooltipRow[];
}

/** State hook driving ChartTooltip visibility/content. */
export function useChartTooltip() {
  const [data, setData] = React.useState<ChartTooltipData | null>(null);

  const show = React.useCallback(
    (x: number, y: number, rows: ChartTooltipRow[]) => {
      setData({ x, y, rows });
    },
    [],
  );

  const hide = React.useCallback(() => {
    setData(null);
  }, []);

  return { active: data !== null, data, show, hide };
}
