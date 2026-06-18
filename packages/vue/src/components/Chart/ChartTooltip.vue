<!--
  useVyre — internal Chart sub-component (ChartTooltip)
  Absolutely-positioned hover tooltip; left/top are relative to the
  .vyre-chart container. Edge-aware: after render it measures itself + the
  container and flips/clamps so it never overflows. NOT exported from the
  package index.
-->
<script setup lang="ts">
import { ref, reactive, watchEffect, nextTick } from "vue";
import type { ChartTooltipRow } from "./useChartTooltip";

const props = defineProps<{
  x: number;
  y: number;
  rows: ChartTooltipRow[];
  title?: string;
}>();

const el = ref<HTMLElement | null>(null);
const pos = reactive({ left: props.x, top: props.y });

watchEffect(() => {
  // Touch reactive deps so the effect re-runs when content/position changes.
  void props.x;
  void props.y;
  void props.rows;
  void props.title;
  if (typeof window === "undefined") {
    pos.left = props.x;
    pos.top = props.y;
    return;
  }
  void nextTick(() => {
    const node = el.value;
    const parent = node?.offsetParent as HTMLElement | null;
    if (!node || !parent) {
      pos.left = props.x;
      pos.top = props.y;
      return;
    }
    const w = node.offsetWidth;
    const h = node.offsetHeight;
    const cw = parent.clientWidth;
    const ch = parent.clientHeight;
    // Flip to the other side of the cursor when the +12-offset position would
    // overflow; the incoming x/y already include that +12 offset, so flipping
    // subtracts the width/height plus a matching 24px gap. Clamp to >= 0.
    let left = props.x;
    let top = props.y;
    if (props.x + w > cw) left = Math.max(0, props.x - w - 24);
    if (props.y + h > ch) top = Math.max(0, props.y - h - 24);
    pos.left = left;
    pos.top = top;
  });
});
</script>

<template>
  <div
    ref="el"
    class="vyre-chart__tooltip"
    :style="{ left: `${pos.left}px`, top: `${pos.top}px` }"
  >
    <div v-if="title" class="vyre-chart__tooltip-title">{{ title }}</div>
    <div v-for="(row, i) in rows" :key="i">
      <span
        class="vyre-chart__legend-swatch"
        :style="{ background: row.color }"
      />
      {{ row.label }}: {{ row.value }}
    </div>
  </div>
</template>
