<!--
  @usevyre/vue — Grid

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Grid — two-dimensional CSS grid                       │
  │ Import:     import { Grid, GridItem } from "@usevyre/vue"          │
  │                                                                   │
  │   columns = number (1-12) | "auto-fit" (default: 1)               │
  │   rows    = number | "auto"                                        │
  │   flow    = "row"|"column"|"dense"|"row-dense"|"column-dense"      │
  │   gap rowGap columnGap = token                                     │
  │   align   = align-items   justify = justify-items                 │
  │   as      = any HTML tag (default: "div")                          │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";

type SpaceToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type SizeToken =
  | "auto" | "full" | "fit" | "screen"
  | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const props = withDefaults(
  defineProps<{
    as?: string;
    columns?: number | "auto-fit";
    rows?: number | "auto";
    flow?: "row" | "column" | "dense" | "row-dense" | "column-dense";
    gap?: SpaceToken;
    rowGap?: SpaceToken;
    columnGap?: SpaceToken;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "stretch";
    width?: SizeToken;
    height?: SizeToken;
    class?: string;
  }>(),
  {
    as: "div",
    columns: 1,
    gap: "md",
    align: "stretch",
  }
);

const isAutoFit = computed(() => props.columns === "auto-fit");
const classes = computed(() => cn("vyre-grid", props.class));
const gridStyle = computed(() => {
  const s: Record<string, string> = {};
  if (!isAutoFit.value) s["--vyre-grid-columns"] = String(props.columns);
  if (props.rows !== undefined && props.rows !== "auto")
    s["--vyre-grid-rows"] = String(props.rows);
  return s;
});
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :data-columns="isAutoFit ? 'auto-fit' : undefined"
    :data-rows="rows !== undefined ? '' : undefined"
    :data-flow="flow"
    :data-gap="gap"
    :data-row-gap="rowGap"
    :data-column-gap="columnGap"
    :data-align="align"
    :data-justify="justify"
    :data-w="width"
    :data-h="height"
    :style="gridStyle"
  >
    <slot />
  </component>
</template>
