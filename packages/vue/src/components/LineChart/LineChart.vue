<!--
  @usevyre/vue — LineChart

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  LineChart                                            │
  │ Import:     import { LineChart } from "@usevyre/vue"             │
  │                                                                   │
  │ Multi-series line chart. Data + config driven (NOT slot children).│
  │   data        = ChartDatum[]  (required — array of row objects)   │
  │   config      = ChartConfig   (required — { key: {label,color} }) │
  │   xKey        = string        (required — the x-axis field name)  │
  │   curve       = "linear"(default) | "smooth"                     │
  │   dots        = boolean (default false — draw a dot per point)    │
  │   width       = number (default 480)   height = number (240)      │
  │   showGrid    = boolean (default true)                            │
  │   showLegend  = boolean (default true — toggleable series)        │
  │   showTooltip = boolean (default true — hover + arrow keys)       │
  │                                                                   │
  │ One <path data-series> per series; colors come ONLY from config.  │
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
import { scaleLinear, niceTicks, buildLinePath, type Curve, type Point } from "../../utils/chart-math";
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
    curve?: Curve;
    dots?: boolean;
    width?: number;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    class?: string;
  }>(),
  {
    curve: "linear",
    dots: false,
    width: 480,
    height: 240,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  }
);

const PAD = { left: 32, right: 8, top: 8, bottom: 24 };

const hidden = ref<Record<string, boolean>>({});
const activeIndex = ref<number | null>(null);
const tooltip = useChartTooltip();
const svgRef = ref<SVGSVGElement | null>(null);

const seriesKeys = computed(() => Object.keys(props.config));
const visibleKeys = computed(() => seriesKeys.value.filter((k) => !hidden.value[k]));

const onToggle = (key: string) => {
  hidden.value = { ...hidden.value, [key]: !hidden.value[key] };
};

const domain = computed(() => {
  const values: number[] = [0];
  for (const row of props.data) {
    for (const key of visibleKeys.value) {
      const v = row[key];
      if (typeof v === "number") values.push(v);
    }
  }
  return { yMin: Math.min(...values), yMax: Math.max(...values) };
});

const innerWidth = computed(() => props.width - PAD.left - PAD.right);
const innerHeight = computed(() => props.height - PAD.top - PAD.bottom);

const xScale = computed(() =>
  scaleLinear([0, Math.max(props.data.length - 1, 1)], [PAD.left, props.width - PAD.right])
);
const yScale = computed(() =>
  scaleLinear([domain.value.yMin, domain.value.yMax], [PAD.top + innerHeight.value, PAD.top])
);
const ticks = computed(() => niceTicks(domain.value.yMin, domain.value.yMax));

const pointsFor = (key: string): Point[] =>
  props.data.map((row, i) => {
    const v = row[key];
    return [xScale.value(i), yScale.value(typeof v === "number" ? v : 0)] as const;
  });

const linePaths = computed(() =>
  visibleKeys.value.map((key) => ({
    key,
    d: buildLinePath(pointsFor(key), props.curve),
    color: props.config[key].color,
  }))
);

const dotsByKey = computed(() => {
  if (!props.dots) return [];
  return visibleKeys.value.map((key) => ({
    key,
    color: props.config[key].color,
    points: pointsFor(key).map(([cx, cy]) => ({ cx, cy })),
  }));
});

const xLabels = computed(() => props.data.map((row) => String(row[props.xKey] ?? "")));

const ariaLabel = computed(() => {
  const seriesLabels = seriesKeys.value.map((k) => props.config[k].label).join(", ");
  return `Line chart: ${seriesLabels} across ${props.data.length} points`;
});

const rowsForIndex = (index: number): ChartTooltipRow[] =>
  visibleKeys.value.map((key) => ({
    label: props.config[key].label,
    value: props.data[index]?.[key] ?? "",
    color: props.config[key].color,
  }));

// Convert a data index to PIXEL coords inside the rendered svg (= the
// .vyre-chart container box, since the svg is width:100% of it). Uses the
// first visible series' value for the y position.
const pixelForIndex = (index: number): { x: number; y: number } | null => {
  const rect = svgRef.value?.getBoundingClientRect();
  if (!rect || rect.width === 0) return null;
  const firstKey = visibleKeys.value[0];
  const v = firstKey ? props.data[index]?.[firstKey] : undefined;
  const yVal = typeof v === "number" ? v : domain.value.yMax;
  return {
    x: (xScale.value(index) / props.width) * rect.width,
    y: (yScale.value(yVal) / props.height) * rect.height,
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
  // invert in viewBox space: convert pixel x back to viewBox x first.
  const mxView = rect.width === 0 ? mxPx : (mxPx / rect.width) * props.width;
  const invert = scaleLinear([PAD.left, props.width - PAD.right], [0, Math.max(props.data.length - 1, 1)]);
  const clamped = Math.max(0, Math.min(props.data.length - 1, Math.round(invert(mxView))));
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
      <g v-if="showGrid" :transform="`translate(${PAD.left}, 0)`">
        <ChartGrid :ticks="ticks" :scale-y="yScale" :width="innerWidth" />
      </g>
      <path
        v-for="line in linePaths"
        :key="line.key"
        class="vyre-chart__line"
        :data-series="line.key"
        :d="line.d"
        fill="none"
        :stroke="line.color"
        :stroke-width="2"
      />
      <template v-if="showGrid">
        <text
          v-for="(label, i) in xLabels"
          :key="`x-${i}`"
          class="vyre-chart__axis-label"
          :x="xScale(i)"
          :y="height - PAD.bottom + 16"
          text-anchor="middle"
        >
          {{ label }}
        </text>
      </template>
      <template v-if="dots">
        <template v-for="series in dotsByKey" :key="series.key">
          <circle
            v-for="(pt, i) in series.points"
            :key="`${series.key}-${i}`"
            class="vyre-chart__dot"
            :cx="pt.cx"
            :cy="pt.cy"
            :r="3"
            :fill="series.color"
          />
        </template>
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
