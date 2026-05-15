<script setup lang="ts">
/**
 * @usevyre/vue — ButtonGroup
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  ButtonGroup                                 │
 * │ Import:     import { ButtonGroup } from "@usevyre/vue"  │
 * │                                                         │
 * │ Props:                                                  │
 * │   orientation = "horizontal"(default)|"vertical"        │
 * │   attached    = boolean (default: false)                │
 * │               If true, buttons share borders (no gap)   │
 * │   size        = "sm"|"md"|"lg"|"icon"                   │
 * │               Propagated via data-size attribute        │
 * │                                                         │
 * │ Slots:                                                  │
 * │   default — Button children                             │
 * │                                                         │
 * │ Semantics: role="group" wrapper div                     │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <ButtonGroup>
 *   <Button variant="secondary">Cut</Button>
 *   <Button variant="secondary">Copy</Button>
 *   <Button variant="secondary">Paste</Button>
 * </ButtonGroup>
 *
 * <ButtonGroup attached>
 *   <Button variant="primary">Day</Button>
 *   <Button variant="secondary">Week</Button>
 *   <Button variant="secondary">Month</Button>
 * </ButtonGroup>
 *
 * <ButtonGroup orientation="vertical">
 *   <Button variant="ghost">Option A</Button>
 *   <Button variant="ghost">Option B</Button>
 * </ButtonGroup>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type Size = "sm" | "md" | "lg" | "icon";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
    size?: Size;
    class?: string;
  }>(),
  { orientation: "horizontal", attached: false }
);

const classes = computed(() =>
  cn(
    "vyre-btn-group",
    props.orientation === "vertical" && "vyre-btn-group--vertical",
    props.attached && "vyre-btn-group--attached",
    props.class
  )
);
</script>

<template>
  <div
    role="group"
    :class="classes"
    :data-orientation="orientation"
    :data-size="size"
  >
    <slot />
  </div>
</template>
