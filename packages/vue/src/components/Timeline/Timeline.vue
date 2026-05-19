<!--
  @usevyre/vue — Timeline

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Timeline (+ TimelineItem)                             │
  │ Import:     import { Timeline, TimelineItem } from "@usevyre/vue"  │
  │                                                                   │
  │ Vertical activity feed for audit logs / history. Presentational.  │
  │                                                                   │
  │   <Timeline :items="[{ title, time?, description?, status?,       │
  │                        icon? }]" />                                │
  │   — OR —                                                          │
  │   <Timeline>                                                      │
  │     <TimelineItem title="…" time="…" status="success">            │
  │       rich content                                                 │
  │     </TimelineItem>                                               │
  │   </Timeline>                                                     │
  │                                                                   │
  │   status colors the dot; #icon slot overrides it.                 │
  │ Timeline does not reorder — pass items in display order.          │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";
import TimelineItem from "./TimelineItem.vue";

interface TimelineItemData {
  title: string;
  time?: string;
  description?: string;
  status?: "default" | "success" | "warning" | "danger" | "info";
}

const props = defineProps<{
  items?: TimelineItemData[];
  class?: string;
}>();

const classes = computed(() => cn("vyre-timeline", props.class));
</script>

<template>
  <ol :class="classes">
    <template v-if="items">
      <TimelineItem
        v-for="(it, i) in items"
        :key="i"
        :title="it.title"
        :time="it.time"
        :status="it.status"
      >
        <template v-if="it.description">{{ it.description }}</template>
      </TimelineItem>
    </template>
    <slot v-else />
  </ol>
</template>
