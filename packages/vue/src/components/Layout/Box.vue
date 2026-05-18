<!--
  @usevyre/vue — Box

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Box — spacing-only container + escape hatch          │
  │ Import:     import { Box } from "@usevyre/vue"                     │
  │                                                                   │
  │   padding  paddingX paddingY                                       │
  │   paddingTop paddingRight paddingBottom paddingLeft = token       │
  │   margin   marginX  marginY                                        │
  │   marginTop marginRight marginBottom marginLeft = token           │
  │   (per-side overrides the X/Y/shorthand it belongs to)            │
  │   as = any HTML tag (default: "div")                               │
  │                                                                   │
  │ The native `style` binding is an ANTI-PATTERN escape hatch.       │
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
    padding?: SpaceToken;
    paddingX?: SpaceToken;
    paddingY?: SpaceToken;
    paddingTop?: SpaceToken;
    paddingRight?: SpaceToken;
    paddingBottom?: SpaceToken;
    paddingLeft?: SpaceToken;
    margin?: SpaceToken;
    marginX?: SpaceToken;
    marginY?: SpaceToken;
    marginTop?: SpaceToken;
    marginRight?: SpaceToken;
    marginBottom?: SpaceToken;
    marginLeft?: SpaceToken;
    width?: SizeToken;
    height?: SizeToken;
    class?: string;
  }>(),
  { as: "div" }
);

const classes = computed(() => cn("vyre-box", props.class));
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :data-p="padding"
    :data-px="paddingX"
    :data-py="paddingY"
    :data-pt="paddingTop"
    :data-pr="paddingRight"
    :data-pb="paddingBottom"
    :data-pl="paddingLeft"
    :data-m="margin"
    :data-mx="marginX"
    :data-my="marginY"
    :data-mt="marginTop"
    :data-mr="marginRight"
    :data-mb="marginBottom"
    :data-ml="marginLeft"
    :data-w="width"
    :data-h="height"
  >
    <slot />
  </component>
</template>
