<!--
  useVyre — internal Chart sub-component (ChartLegend)
  Toggleable HTML legend; each item's aria-pressed reflects series visibility.
  NOT exported from the package index.
-->
<script setup lang="ts">
import type { ChartConfig } from "./chart-types";

defineProps<{
  config: ChartConfig;
  hidden: Record<string, boolean>;
}>();

const emit = defineEmits<{ (e: "toggle", key: string): void }>();
</script>

<template>
  <div class="vyre-chart__legend">
    <button
      v-for="key in Object.keys(config)"
      :key="key"
      type="button"
      class="vyre-chart__legend-item"
      :aria-pressed="!hidden[key]"
      @click="emit('toggle', key)"
    >
      <span
        class="vyre-chart__legend-swatch"
        :style="{ background: config[key].color }"
      />
      {{ config[key].label }}
    </button>
  </div>
</template>
