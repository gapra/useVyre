export interface ChartSeriesConfig {
  /** Human label shown in legend/tooltip. */
  label: string;
  /** CSS color — MUST be a --vyre-* token reference, e.g. "var(--vyre-color-semantic-accent)". */
  color: string;
}

/** Maps each data series key → its label + token color. */
export type ChartConfig = Record<string, ChartSeriesConfig>;

/** A single row of chart data: x field + one numeric field per series key. */
export type ChartDatum = Record<string, string | number>;
