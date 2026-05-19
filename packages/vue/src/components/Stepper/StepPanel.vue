<!--
  @usevyre/vue — StepPanel (use inside <Stepper>)

  Renders its slot only when :index === the Stepper's active step.
-->
<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { stepperKey } from "./context";

const props = defineProps<{ index: number; class?: string }>();

const ctx = inject(stepperKey);
if (!ctx) throw new Error("StepPanel must be used inside <Stepper>");

const visible = computed(() => props.index === ctx!.active.value);
const classes = computed(() => cn("vyre-step-panel", props.class));
</script>

<template>
  <div v-if="visible" role="tabpanel" :class="classes">
    <slot />
  </div>
</template>
