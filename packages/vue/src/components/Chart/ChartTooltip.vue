<!--
  useVyre — internal Chart sub-component (ChartTooltip)
  Absolutely-positioned hover tooltip; left/top are relative to the
  .vyre-chart container. NOT exported from the package index.
-->
<script setup lang="ts">
import type { ChartTooltipRow } from "./useChartTooltip";

defineProps<{
  x: number;
  y: number;
  rows: ChartTooltipRow[];
}>();
</script>

<template>
  <div class="vyre-chart__tooltip" :style="{ left: `${x}px`, top: `${y}px` }">
    <div v-for="(row, i) in rows" :key="i">
      <span
        class="vyre-chart__legend-swatch"
        :style="{ background: row.color }"
      />
      {{ row.label }}: {{ row.value }}
    </div>
  </div>
</template>
