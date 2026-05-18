<!--
  @usevyre/vue — GridItem

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  GridItem — child placement inside <Grid>             │
  │ Import:     import { GridItem } from "@usevyre/vue"               │
  │                                                                   │
  │   colSpan rowSpan colStart rowStart = number                      │
  │   as = any HTML tag (default: "div")                               │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    as?: string;
    colSpan?: number;
    rowSpan?: number;
    colStart?: number;
    rowStart?: number;
    class?: string;
  }>(),
  { as: "div" }
);

const classes = computed(() => cn("vyre-grid-item", props.class));
const itemStyle = computed(() => {
  const s: Record<string, string> = {};
  if (props.colSpan !== undefined)
    s["--vyre-grid-item-col-span"] = String(props.colSpan);
  if (props.rowSpan !== undefined)
    s["--vyre-grid-item-row-span"] = String(props.rowSpan);
  if (props.colStart !== undefined)
    s["--vyre-grid-item-col-start"] = String(props.colStart);
  if (props.rowStart !== undefined)
    s["--vyre-grid-item-row-start"] = String(props.rowStart);
  return s;
});
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :data-col-span="colSpan"
    :data-row-span="rowSpan"
    :data-col-start="colStart"
    :data-row-start="rowStart"
    :style="itemStyle"
  >
    <slot />
  </component>
</template>
