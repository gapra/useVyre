<!--
  @usevyre/vue — Stepper

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Stepper (+ StepperNav, Step, StepPanel)              │
  │ Import: import { Stepper, StepperNav, Step, StepPanel }           │
  │         from "@usevyre/vue"                                       │
  │                                                                   │
  │ Multi-step flow indicator + controller. CONTROLLED by a 0-based  │
  │ index via v-model.                                                │
  │                                                                   │
  │   v-model       = number  (active step index)                     │
  │   default-value = number  (uncontrolled, default 0)               │
  │   orientation   = "horizontal"(default) | "vertical"              │
  │   clickable     = boolean  (click a completed Step to go back)    │
  │                                                                   │
  │   <StepperNav><Step :index="0" label="…" /></StepperNav>          │
  │   <StepPanel :index="0">…</StepPanel>                             │
  │                                                                   │
  │ Step/StepPanel take an explicit :index (0-based).                 │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { cn } from "../../utils/cn";
import { stepperKey } from "./context";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    defaultValue?: number;
    orientation?: "horizontal" | "vertical";
    clickable?: boolean;
    class?: string;
  }>(),
  { defaultValue: 0, orientation: "horizontal", clickable: false }
);

const emit = defineEmits<{ "update:modelValue": [i: number] }>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref(props.defaultValue);
const active = computed(() =>
  isControlled.value ? (props.modelValue as number) : internal.value
);

function setActive(i: number) {
  if (!isControlled.value) internal.value = i;
  emit("update:modelValue", i);
}

provide(stepperKey, {
  active,
  setActive,
  orientation: props.orientation,
  clickable: props.clickable,
});

const classes = computed(() =>
  cn("vyre-stepper", `vyre-stepper--${props.orientation}`, props.class)
);
</script>

<template>
  <div :class="classes" :data-orientation="orientation">
    <slot />
  </div>
</template>
