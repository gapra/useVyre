/**
 * useVyre — internal Chart tooltip composable.
 * Reactive state driving ChartTooltip visibility/content. Mirrors the React
 * useChartTooltip hook. NOT exported from the package index.
 */
import { ref, computed } from "vue";

/** A single row rendered in the chart tooltip. */
export interface ChartTooltipRow {
  label: string;
  value: string | number;
  color: string;
}

interface ChartTooltipData {
  x: number;
  y: number;
  rows: ChartTooltipRow[];
  title?: string;
}

export function useChartTooltip() {
  const data = ref<ChartTooltipData | null>(null);

  const show = (
    x: number,
    y: number,
    rows: ChartTooltipRow[],
    title?: string,
  ) => {
    data.value = { x, y, rows, title };
  };

  const hide = () => {
    data.value = null;
  };

  const active = computed(() => data.value !== null);

  return { active, data, show, hide };
}
