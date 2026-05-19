<!--
  @usevyre/vue — Stat

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Stat (+ StatGroup)                                    │
  │ Import:     import { Stat, StatGroup } from "@usevyre/vue"         │
  │                                                                   │
  │ Presentational dashboard KPI. No state.                           │
  │   label       = string (required)                                 │
  │   value       = string | number (required, large)                 │
  │   delta        = string | number                                  │
  │   trend        = "up" | "down" | "neutral" (CONTROLS color:       │
  │                  up=success, down=danger, neutral=muted)           │
  │   deltaLabel   = string ("vs last month")                         │
  │   size         = "sm" | "md"(default) | "lg"                      │
  │   #icon slot   = optional leading icon                            │
  │ Wrap several in <StatGroup> for an evenly-split row w/ dividers.  │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, useSlots } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    delta?: string | number;
    trend?: "up" | "down" | "neutral";
    deltaLabel?: string;
    size?: "sm" | "md" | "lg";
    class?: string;
  }>(),
  { trend: "neutral", size: "md" }
);

const slots = useSlots();
const classes = computed(() =>
  cn("vyre-stat", `vyre-stat--${props.size}`, props.class)
);
const hasDelta = computed(() => props.delta !== undefined);

// Arrow direction follows the SIGN of delta (the actual change),
// not `trend`. Color still comes from `trend`.
const direction = computed<"up" | "down" | "flat">(() => {
  const d = props.delta;
  if (d === undefined || d === null) return "flat";
  if (typeof d === "number") return d > 0 ? "up" : d < 0 ? "down" : "flat";
  const s = String(d).trim();
  if (s.startsWith("-") || s.startsWith("−")) return "down";
  if (s.startsWith("+")) return "up";
  const n = parseFloat(s.replace(/[^0-9.\-]/g, ""));
  if (!Number.isNaN(n)) return n > 0 ? "up" : n < 0 ? "down" : "flat";
  return "flat";
});
</script>

<template>
  <div :class="classes">
    <span v-if="slots.icon" class="vyre-stat__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <div class="vyre-stat__body">
      <span class="vyre-stat__label">{{ label }}</span>
      <span class="vyre-stat__value">{{ value }}</span>
      <span v-if="hasDelta" class="vyre-stat__delta" :data-trend="trend">
        <svg
          v-if="direction === 'flat'"
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
        >
          <path d="M2 6h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <svg
          v-else
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
        >
          <path
            :d="direction === 'up' ? 'M6 2.5L10 7H2L6 2.5Z' : 'M6 9.5L2 5h8L6 9.5Z'"
            fill="currentColor"
          />
        </svg>
        <span class="vyre-stat__delta-value">{{ delta }}</span>
        <span v-if="deltaLabel" class="vyre-stat__delta-label">{{ deltaLabel }}</span>
      </span>
    </div>
  </div>
</template>
