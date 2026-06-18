<!--
  @usevyre/vue — PieChart

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  PieChart                                            │
  │ Import:     import { PieChart } from "@usevyre/vue"             │
  │                                                                   │
  │ Single-level pie/donut chart. FLAT data (NOT multi-series).       │
  │   data        = { name: string; value: number }[]  (required)     │
  │   config      = ChartConfig (optional — { name: {label,color} })  │
  │                  unmatched names fall back to a token color cycle │
  │   donut       = boolean (default false — hollow center ring)      │
  │   size        = number (default 240 — svg width AND height)       │
  │   showLegend  = boolean (default true — toggleable segments)      │
  │   showTooltip = boolean (default true — hover segment)            │
  │                                                                   │
  │ One <path data-name> per datum; colors come from config or the    │
  │ documented token cycle. Hidden segments are excluded + total      │
  │ recomputed from the visible ones.                                 │
  │                                                                   │
  │ ANTI-PATTERNS:                                                   │
  │   ❌ data={[1, 2, 3]}             ✅ data={[{ name, value }]}      │
  │   ❌ color="blue"                 ✅ config token or auto cycle    │
  │   ❌ <Pie>/<Cell> children        ✅ data + donut props           │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, ref } from "vue";
import { cn } from "../../utils/cn";
import { arcPath } from "../../utils/chart-math";
import type { ChartConfig } from "../Chart/chart-types";
import ChartLegend from "../Chart/ChartLegend.vue";
import ChartTooltip from "../Chart/ChartTooltip.vue";
import { useChartTooltip, type ChartTooltipRow } from "../Chart/useChartTooltip";

export interface PieDatum {
  name: string;
  value: number;
}

const props = withDefaults(
  defineProps<{
    data: PieDatum[];
    config?: ChartConfig;
    donut?: boolean;
    size?: number;
    showLegend?: boolean;
    showTooltip?: boolean;
    class?: string;
  }>(),
  {
    donut: false,
    size: 240,
    showLegend: true,
    showTooltip: true,
  }
);

/** Token color cycle for segments without an explicit config entry. */
const COLOR_CYCLE = [
  "var(--vyre-color-semantic-accent)",
  "var(--vyre-color-semantic-teal)",
  "var(--vyre-color-semantic-success)",
  "var(--vyre-color-semantic-warning)",
  "var(--vyre-color-semantic-danger)",
];

const hidden = ref<Record<string, boolean>>({});
const activeName = ref<string | null>(null);
const tooltip = useChartTooltip();
const svgRef = ref<SVGSVGElement | null>(null);

const onToggle = (name: string) => {
  hidden.value = { ...hidden.value, [name]: !hidden.value[name] };
};

const colorFor = (name: string, index: number): string =>
  props.config?.[name]?.color ?? COLOR_CYCLE[index % COLOR_CYCLE.length];

const legendConfig = computed<ChartConfig>(() => {
  const cfg: ChartConfig = {};
  props.data.forEach((d, i) => {
    cfg[d.name] = {
      label: props.config?.[d.name]?.label ?? d.name,
      color: colorFor(d.name, i),
    };
  });
  return cfg;
});

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const r = computed(() => props.size / 2 - 4);
const innerR = computed(() => (props.donut ? r.value * 0.55 : 0));

const slices = computed(() => {
  const out: { name: string; color: string; d: string }[] = [];
  const visible = props.data.filter((d) => !hidden.value[d.name]);
  const total = visible.reduce(
    (sum, d) => sum + (typeof d.value === "number" ? d.value : 0),
    0
  );
  if (total > 0) {
    let angle = 0;
    visible.forEach((datum) => {
      const originalIndex = props.data.indexOf(datum);
      const value = typeof datum.value === "number" ? datum.value : 0;
      const sweep = (value / total) * Math.PI * 2;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      out.push({
        name: datum.name,
        color: colorFor(datum.name, originalIndex),
        d: arcPath(cx.value, cy.value, r.value, start, end, innerR.value),
      });
    });
  }
  return out;
});

const ariaLabel = computed(() => `Pie chart: ${props.data.length} segments`);

const rowsForName = (name: string): ChartTooltipRow[] => {
  const datum = props.data.find((d) => d.name === name);
  return [
    {
      label: legendConfig.value[name]?.label ?? name,
      value: datum?.value ?? "",
      color: legendConfig.value[name]?.color ?? "",
    },
  ];
};

// Track which slice the cursor is over (per-slice enter).
const handleEnter = (name: string) => {
  if (!props.showTooltip) return;
  activeName.value = name;
};

const handleLeave = () => {
  if (!props.showTooltip) return;
  activeName.value = null;
  tooltip.hide();
};

// A single svg-level mousemove keeps the tooltip glued to the cursor in
// PIXEL space, using the currently-hovered slice's data.
const handleMouseMove = (e: MouseEvent) => {
  if (!props.showTooltip || !activeName.value) return;
  const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
  const mxPx = e.clientX - rect.left;
  const myPx = e.clientY - rect.top;
  tooltip.show(mxPx + 12, myPx + 12, rowsForName(activeName.value));
};
</script>

<template>
  <div :class="cn('vyre-chart vyre-chart--pie', props.class)">
    <svg
      ref="svgRef"
      :width="size"
      :height="size"
      :view-box="`0 0 ${size} ${size}`"
      role="img"
      :aria-label="ariaLabel"
      :style="{ maxWidth: `${size}px` }"
      @mousemove="showTooltip ? handleMouseMove($event) : undefined"
      @mouseleave="showTooltip ? handleLeave() : undefined"
    >
      <path
        v-for="(slice, i) in slices"
        :key="`${slice.name}-${i}`"
        class="vyre-chart__slice"
        :data-name="slice.name"
        :d="slice.d"
        :fill="slice.color"
        @mouseenter="showTooltip ? handleEnter(slice.name) : undefined"
      />
    </svg>
    <ChartLegend
      v-if="showLegend"
      :config="legendConfig"
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
