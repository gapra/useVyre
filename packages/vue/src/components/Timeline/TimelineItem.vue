<!--
  @usevyre/vue — TimelineItem (use inside <Timeline>)

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │   title   = string (required)                                    │
  │   time    = string  (timestamp, right-aligned)                   │
  │   status  = "default"|"success"|"warning"|"danger"|"info"        │
  │             (colors the dot)                                       │
  │   #icon slot   = custom marker (overrides the dot)               │
  │   default slot = rich content under the title                    │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, useSlots } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    title: string;
    time?: string;
    status?: "default" | "success" | "warning" | "danger" | "info";
    class?: string;
  }>(),
  { status: "default" }
);

const slots = useSlots();
const classes = computed(() => cn("vyre-timeline-item", props.class));
</script>

<template>
  <li :class="classes" :data-status="status">
    <span class="vyre-timeline-item__marker" aria-hidden="true">
      <span v-if="slots.icon" class="vyre-timeline-item__icon">
        <slot name="icon" />
      </span>
      <span v-else class="vyre-timeline-item__dot" />
      <span class="vyre-timeline-item__connector" />
    </span>
    <div class="vyre-timeline-item__body">
      <div class="vyre-timeline-item__head">
        <span class="vyre-timeline-item__title">{{ title }}</span>
        <span v-if="time !== undefined" class="vyre-timeline-item__time">
          {{ time }}
        </span>
      </div>
      <div v-if="slots.default" class="vyre-timeline-item__content">
        <slot />
      </div>
    </div>
  </li>
</template>
