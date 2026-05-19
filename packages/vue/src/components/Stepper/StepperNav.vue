<!--
  @usevyre/vue — StepperNav (indicator row/column, use inside <Stepper>)
-->
<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { stepperKey } from "./context";

const props = defineProps<{ class?: string }>();

const ctx = inject(stepperKey);
if (!ctx) throw new Error("StepperNav must be used inside <Stepper>");

const classes = computed(() => cn("vyre-stepper__nav", props.class));
</script>

<template>
  <div role="list" :aria-orientation="ctx!.orientation" :class="classes">
    <slot />
  </div>
</template>
