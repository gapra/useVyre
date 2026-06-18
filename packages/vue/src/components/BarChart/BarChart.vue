<!--
  @usevyre/vue — BarChart

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  BarChart                                             │
  │ Import:     import { BarChart } from "@usevyre/vue"              │
  │                                                                   │
  │ Multi-series bar chart. Data + config driven (NOT slot children). │
  │   data        = ChartDatum[]  (required — array of row objects)   │
  │   config      = ChartConfig   (required — { key: {label,color} }) │
  │   xKey        = string        (required — the x-axis field name)  │
  │   orientation = "vertical"(default) | "horizontal"               │
  │   stacked     = boolean (default false — accumulate series)       │
  │   width       = number (default 480)   height = number (240)      │
  │   showGrid    = boolean (default true)                            │
  │   showLegend  = boolean (default true — toggleable series)        │
  │   showTooltip = boolean (default true — hover + arrow keys)       │
  │                                                                   │
  │ x-axis is BANDED by data index (one band per datum). Multiple     │
  │ series → grouped side-by-side bars, or stacked when stacked.      │
  │ One <rect data-series> per bar; colors come ONLY from config.     │
  │                                                                   │
  │ ANTI-PATTERNS:                                                    │
  │   ❌ series={...}                 ✅ data + config                 │
  │   ❌ color="blue"                 ✅ color token in config         │
  │   ❌ <XAxis/> / <Tooltip/> kids   ✅ showGrid / showTooltip props  │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, ref } from "vue";
import { cn } from "../../utils/cn";
import { scaleLinear, niceTicks } from "../../utils/chart-math";
import type { ChartConfig, ChartDatum } from "../Chart/chart-types";
import ChartGrid from "../Chart/ChartGrid.vue";
import ChartLegend from "../Chart/ChartLegend.vue";
import ChartTooltip from "../Chart/ChartTooltip.vue";
import { useChartTooltip, type ChartTooltipRow } from "../Chart/useChartTooltip";

const props = withDefaults(
  defineProps<{
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
    class?: string;
  }>(),
  {
    orientation: "vertical",
    stacked: false,
    width: 480,
    height: 240,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  }
);

const PAD = { left: 32, right: 8, top: 8, bottom: 24 };
const BAND_INNER_PAD = 0.2;

const hidden = ref<Record<string, boolean>>({});
const activeIndex = ref<number | null>(null);
const tooltip = useChartTooltip();
const svgRef = ref<SVGSVGElement | null>(null);

const seriesKeys = computed(() => Object.keys(props.config));
const visibleKeys = computed(() => seriesKeys.value.filter((k) => !hidden.value[k]));

const onToggle = (key: string) => {
  hidden.value = { ...hidden.value, [key]: !hidden.value[key] };
};

const num = (v: unknown) => (typeof v === "number" ? v : 0);

const isVertical = computed(() => props.orientation === "vertical");
const innerWidth = computed(() => props.width - PAD.left - PAD.right);
const innerHeight = computed(() => props.height - PAD.top - PAD.bottom);

const domain = computed(() => {
  const values: number[] = [0];
  for (const row of props.data) {
    if (props.stacked) {
      let sum = 0;
      for (const key of visibleKeys.value) sum += num(row[key]);
      values.push(sum);
    } else {
      for (const key of visibleKeys.value) values.push(num(row[key]));
    }
  }
  return { vMin: Math.min(...values), vMax: Math.max(...values) };
});

const valueScale = computed(() =>
  isVertical.value
    ? scaleLinear([domain.value.vMin, domain.value.vMax], [PAD.top + innerHeight.value, PAD.top])
    : scaleLinear([domain.value.vMin, domain.value.vMax], [PAD.left, props.width - PAD.right])
);
const ticks = computed(() => niceTicks(domain.value.vMin, domain.value.vMax));

const n = computed(() => Math.max(props.data.length, 1));
const bandSpan = computed(() => (isVertical.value ? innerWidth.value : innerHeight.value) / n.value);
const bandStart = computed(() => (isVertical.value ? PAD.left : PAD.top));
const innerBand = computed(() => bandSpan.value * (1 - BAND_INNER_PAD));
const bandPadOffset = computed(() => (bandSpan.value - innerBand.value) / 2);
const slotCount = computed(() => (props.stacked ? 1 : Math.max(visibleKeys.value.length, 1)));
const slotSize = computed(() => innerBand.value / slotCount.value);

const bandCenter = (index: number) =>
  bandStart.value + index * bandSpan.value + bandSpan.value / 2;

const bars = computed(() => {
  const out: { key: string; x: number; y: number; w: number; h: number; color: string }[] = [];
  const valueZero = valueScale.value(Math.max(domain.value.vMin, 0));
  props.data.forEach((row, i) => {
    const bandOrigin = bandStart.value + i * bandSpan.value + bandPadOffset.value;
    let stackAcc = 0;
    visibleKeys.value.forEach((key, si) => {
      const value = num(row[key]);
      const color = props.config[key].color;
      if (isVertical.value) {
        const slotX = props.stacked ? bandOrigin : bandOrigin + si * slotSize.value;
        if (props.stacked) {
          const top = valueScale.value(stackAcc + value);
          const base = valueScale.value(stackAcc);
          stackAcc += value;
          out.push({ key, x: slotX, y: top, w: innerBand.value, h: Math.abs(base - top), color });
        } else {
          const top = valueScale.value(value);
          out.push({ key, x: slotX, y: Math.min(top, valueZero), w: slotSize.value, h: Math.abs(valueZero - top), color });
        }
      } else {
        const slotY = props.stacked ? bandOrigin : bandOrigin + si * slotSize.value;
        if (props.stacked) {
          const end = valueScale.value(stackAcc + value);
          const base = valueScale.value(stackAcc);
          stackAcc += value;
          out.push({ key, x: Math.min(base, end), y: slotY, w: Math.abs(end - base), h: innerBand.value, color });
        } else {
          const end = valueScale.value(value);
          out.push({ key, x: Math.min(valueZero, end), y: slotY, w: Math.abs(end - valueZero), h: slotSize.value, color });
        }
      }
    });
  });
  return out;
});

const xLabels = computed(() => props.data.map((row) => String(row[props.xKey] ?? "")));

const ariaLabel = computed(() => {
  const seriesLabels = seriesKeys.value.map((k) => props.config[k].label).join(", ");
  return `Bar chart: ${seriesLabels} across ${props.data.length} categories`;
});

const rowsForIndex = (index: number): ChartTooltipRow[] =>
  visibleKeys.value.map((key) => ({
    label: props.config[key].label,
    value: props.data[index]?.[key] ?? "",
    color: props.config[key].color,
  }));

// Convert a data index to PIXEL coords inside the rendered svg (= the
// .vyre-chart container box, since the svg is width:100% of it).
const pixelForIndex = (index: number): { x: number; y: number } | null => {
  const rect = svgRef.value?.getBoundingClientRect();
  if (!rect || rect.width === 0) return null;
  const center = bandCenter(index);
  const xView = isVertical.value ? center : valueScale.value(domain.value.vMax);
  const yView = isVertical.value ? valueScale.value(domain.value.vMax) : center;
  return {
    x: (xView / props.width) * rect.width,
    y: (yView / props.height) * rect.height,
  };
};

// Place the tooltip at the data point (keyboard nav).
const showTooltipAt = (index: number) => {
  if (props.data.length === 0) return;
  const clamped = Math.max(0, Math.min(props.data.length - 1, index));
  activeIndex.value = clamped;
  const px = pixelForIndex(clamped);
  if (px) tooltip.show(px.x + 12, px.y + 12, rowsForIndex(clamped));
};

const handleMouseMove = (e: MouseEvent) => {
  if (!props.showTooltip || props.data.length === 0) return;
  const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
  const mxPx = e.clientX - rect.left;
  const myPx = e.clientY - rect.top;
  // band detection happens in viewBox space along the category axis.
  const posPx = isVertical.value ? mxPx : myPx;
  const renderedSpan = isVertical.value ? rect.width : rect.height;
  const viewSpan = isVertical.value ? props.width : props.height;
  const posView = renderedSpan === 0 ? posPx : (posPx / renderedSpan) * viewSpan;
  const index = Math.floor((posView - bandStart.value) / bandSpan.value);
  const clamped = Math.max(0, Math.min(props.data.length - 1, index));
  activeIndex.value = clamped;
  tooltip.show(mxPx + 12, myPx + 12, rowsForIndex(clamped));
};

const handleMouseLeave = () => {
  if (!props.showTooltip) return;
  activeIndex.value = null;
  tooltip.hide();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.showTooltip || props.data.length === 0) return;
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showTooltipAt((activeIndex.value ?? 0) - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    showTooltipAt((activeIndex.value ?? -1) + 1);
  }
};
</script>

<template>
  <div :class="cn('vyre-chart', props.class)">
    <svg
      ref="svgRef"
      :width="width"
      :height="height"
      :view-box="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="ariaLabel"
      :tabindex="showTooltip ? 0 : undefined"
      @mousemove="showTooltip ? handleMouseMove($event) : undefined"
      @mouseleave="showTooltip ? handleMouseLeave() : undefined"
      @keydown="showTooltip ? handleKeyDown($event) : undefined"
    >
      <g v-if="showGrid && isVertical" :transform="`translate(${PAD.left}, 0)`">
        <ChartGrid :ticks="ticks" :scale-y="valueScale" :width="innerWidth" />
      </g>
      <rect
        v-for="(bar, i) in bars"
        :key="`${bar.key}-${i}`"
        class="vyre-chart__bar"
        :data-series="bar.key"
        :x="bar.x"
        :y="bar.y"
        :width="bar.w"
        :height="bar.h"
        :fill="bar.color"
      />
      <template v-if="showGrid">
        <text
          v-for="(label, i) in xLabels"
          :key="`x-${i}`"
          class="vyre-chart__axis-label"
          :x="isVertical ? bandCenter(i) : PAD.left"
          :y="isVertical ? height - PAD.bottom + 16 : bandCenter(i)"
          :text-anchor="isVertical ? 'middle' : 'end'"
        >
          {{ label }}
        </text>
      </template>
    </svg>
    <ChartLegend
      v-if="showLegend"
      :config="config"
      :hidden="hidden"
      @toggle="onToggle"
    />
    <ChartTooltip
      v-if="showTooltip && tooltip.active.value && tooltip.data.value"
      :x="tooltip.data.value.x"
      :y="tooltip.data.value.y"
      :rows="tooltip.data.value.rows"
    />
  </div>
</template>
