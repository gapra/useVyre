<script setup lang="ts">
/**
 * @vyre/vue — Card
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Card + CardHeader + CardBody + CardFooter   │
 * │ Import:     import { Card, CardHeader, CardBody,        │
 * │             CardFooter } from "@vyre/vue"               │
 * │                                                         │
 * │ Card props:                                             │
 * │   variant   = "default"|"elevated"|"outlined"|          │
 * │               "ghost"|"accent"                          │
 * │   hoverable = boolean (hover effect without onClick)    │
 * │   clickable = boolean (cursor pointer + focus ring)     │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Card variant="elevated">
 *   <CardHeader><h3>Title</h3></CardHeader>
 *   <CardBody><p>Content</p></CardBody>
 *   <CardFooter>
 *     <Button variant="accent">Action</Button>
 *   </CardFooter>
 * </Card>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type CardVariant = "default" | "elevated" | "outlined" | "ghost" | "accent";

const props = withDefaults(
  defineProps<{
    variant?:   CardVariant;
    hoverable?: boolean;
    clickable?: boolean;
    class?:     string;
  }>(),
  { variant: "default", hoverable: false, clickable: false }
);

const classes = computed(() =>
  cn(
    "vyre-card",
    `vyre-card--${props.variant}`,
    props.hoverable && "vyre-card--hoverable",
    props.clickable && "vyre-card--clickable",
    props.class
  )
);
</script>

<template>
  <div :class="classes" :data-variant="variant" :tabindex="clickable ? 0 : undefined">
    <slot />
  </div>
</template>
