<!--
  @usevyre/vue — Sparkline

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Sparkline                                             │
  │ Import:     import { Sparkline } from "@usevyre/vue"              │
  │                                                                   │
  │ Tiny inline chart — no axis, legend, or tooltip. For Stat cards   │
  │ and table cells.                                                  │
  │   data    = number[]            (required)                        │
  │   variant = "line"(default) | "area" | "bar"                     │
  │   color?  = string  (token, default --vyre-color-semantic-accent) │
  │   width?  = number (default 80)   height? = number (default 24)   │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";
import { scaleLinear, buildLinePath, buildAreaPath, type Point } from "../../utils/chart-math";

const props = withDefaults(
  defineProps<{
    data: number[];
    variant?: "line" | "area" | "bar";
    color?: string;
    width?: number;
    height?: number;
    class?: string;
  }>(),
  {
    variant: "line",
    color: "var(--vyre-color-semantic-accent)",
    width: 80,
    height: 24,
  }
);

const classes = computed(() => cn("vyre-sparkline", props.class));
const isEmpty = computed(() => props.data.length === 0);

const label = computed(() =>
  isEmpty.value ? "Sparkline, no data" : `Sparkline, ${props.data.length} points`
);

const geom = computed(() => {
  if (isEmpty.value) return null;
  const data = props.data;
  const { width, height } = props;
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const x = scaleLinear([0, Math.max(data.length - 1, 1)], [1, width - 1]);
  const y = scaleLinear([min, max], [height - 1, 1]);
  const pts = data.map((v, i) => [x(i), y(v)] as const) as Point[];
  return { y, pts };
});

const linePath = computed(() =>
  geom.value ? buildLinePath(geom.value.pts, "linear") : ""
);
const areaPath = computed(() =>
  geom.value ? buildAreaPath(geom.value.pts, props.height, "linear") : ""
);

const bars = computed(() => {
  if (isEmpty.value || !geom.value) return [];
  const data = props.data;
  const { width, height } = props;
  const y = geom.value.y;
  return data.map((v, i) => {
    const bw = (width / data.length) * 0.7;
    const bx = (width / data.length) * i + (width / data.length - bw) / 2;
    const by = y(v);
    return { x: bx, y: by, width: bw, height: height - by };
  });
});
</script>

<template>
  <span :class="classes">
    <svg
      v-if="isEmpty"
      :width="width"
      :height="height"
      role="img"
      :aria-label="label"
    />
    <svg
      v-else
      :width="width"
      :height="height"
      role="img"
      :aria-label="label"
    >
      <template v-if="variant === 'bar'">
        <rect
          v-for="(bar, i) in bars"
          :key="i"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :fill="color"
        />
      </template>
      <path
        v-else-if="variant === 'area'"
        :d="areaPath"
        :fill="color"
        :fill-opacity="0.2"
        :stroke="color"
        :stroke-width="1.5"
      />
      <path
        v-else
        :d="linePath"
        fill="none"
        :stroke="color"
        :stroke-width="1.5"
      />
    </svg>
  </span>
</template>
