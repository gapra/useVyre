<!--
  @usevyre/vue — Stack

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Stack — full one-dimensional flex layout              │
  │ Import:     import { Stack } from "@usevyre/vue"                   │
  │                                                                   │
  │ USE THIS INSTEAD OF <div :style="{ display: 'flex' }">.           │
  │                                                                   │
  │   direction    = "row"(default)|"column"|"row-reverse"            │
  │                  |"column-reverse"                                 │
  │   inline       = boolean (inline-flex)                             │
  │   gap rowGap columnGap = token                                     │
  │   align        = start|center|end|stretch|baseline                │
  │   justify       = start|center|end|between|around|evenly          │
  │   alignContent = start|center|end|stretch|between|around|evenly   │
  │   alignSelf    = auto|start|center|end|stretch|baseline           │
  │   wrap         = "nowrap"(default)|"wrap"|"wrap-reverse"           │
  │   grow shrink  = number   basis = token|"auto"|"content"|"0"      │
  │   as           = any HTML tag (default: "div")                     │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";

type SpaceToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type Basis = SpaceToken | "auto" | "content" | "0";
type SizeToken =
  | "auto" | "full" | "fit" | "screen"
  | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const props = withDefaults(
  defineProps<{
    as?: string;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    inline?: boolean;
    gap?: SpaceToken;
    rowGap?: SpaceToken;
    columnGap?: SpaceToken;
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    alignContent?:
      | "start"
      | "center"
      | "end"
      | "stretch"
      | "between"
      | "around"
      | "evenly";
    alignSelf?: "auto" | "start" | "center" | "end" | "stretch" | "baseline";
    wrap?: "nowrap" | "wrap" | "wrap-reverse" | boolean;
    grow?: number;
    shrink?: number;
    basis?: Basis;
    width?: SizeToken;
    height?: SizeToken;
    class?: string;
  }>(),
  {
    as: "div",
    direction: "row",
    inline: false,
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
  }
);

const SP_VAR: Record<SpaceToken, string> = {
  none: "var(--vyre-spacing-0)",
  xs: "var(--vyre-spacing-2)",
  sm: "var(--vyre-spacing-3)",
  md: "var(--vyre-spacing-4)",
  lg: "var(--vyre-spacing-6)",
  xl: "var(--vyre-spacing-8)",
  "2xl": "var(--vyre-spacing-12)",
};

const wrapAttr = computed(() =>
  props.wrap === true ? "wrap" : props.wrap === false ? "nowrap" : props.wrap
);
const classes = computed(() => cn("vyre-stack", props.class));
const flexStyle = computed(() => {
  const s: Record<string, string | number> = {};
  if (props.grow !== undefined) s.flexGrow = props.grow;
  if (props.shrink !== undefined) s.flexShrink = props.shrink;
  if (props.basis !== undefined) {
    const b = props.basis;
    s["--vyre-stack-basis"] =
      b === "auto" || b === "content" ? b : b === "0" ? "0" : SP_VAR[b];
  }
  return s;
});
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :data-inline="inline ? '' : undefined"
    :data-direction="direction"
    :data-gap="gap"
    :data-row-gap="rowGap"
    :data-column-gap="columnGap"
    :data-align="align"
    :data-justify="justify"
    :data-align-content="alignContent"
    :data-align-self="alignSelf"
    :data-wrap="wrapAttr"
    :data-w="width"
    :data-h="height"
    :style="flexStyle"
  >
    <slot />
  </component>
</template>
