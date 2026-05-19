<!--
  @usevyre/vue — StatGroup

  Evenly-split row of <Stat> with dividers between them.
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("vyre-stat-group", props.class));
</script>

<template>
  <div role="group" :class="classes">
    <slot />
  </div>
</template>
