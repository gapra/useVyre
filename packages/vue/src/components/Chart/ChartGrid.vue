<!--
  useVyre — internal Chart sub-component (ChartGrid)
  SVG gridlines + axis labels for each Y tick. Render inside the chart's <svg>.
  NOT exported from the package index.
-->
<script setup lang="ts">
defineProps<{
  ticks: number[];
  scaleY: (v: number) => number;
  width: number;
}>();
</script>

<template>
  <g class="vyre-chart__grid">
    <template v-for="t in ticks" :key="t">
      <line :x1="0" :x2="width" :y1="scaleY(t)" :y2="scaleY(t)" />
      <text class="vyre-chart__axis-label" :x="0" :y="scaleY(t) - 2">
        {{ t }}
      </text>
    </template>
  </g>
</template>
