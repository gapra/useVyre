<!--
  @usevyre/vue — Step (one indicator, use inside <StepperNav>)

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │   index       = number (0-based, required)                        │
  │   label       = string                                            │
  │   description  = string                                           │
  │   icon         = (slot) custom indicator content                  │
  │ State (completed | current | upcoming) is derived from the        │
  │ Stepper's active index automatically.                             │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { stepperKey } from "./context";

const props = defineProps<{
  index: number;
  label?: string;
  description?: string;
  class?: string;
}>();

const ctx = inject(stepperKey);
if (!ctx) throw new Error("Step must be used inside <Stepper>");

const state = computed<"completed" | "current" | "upcoming">(() => {
  const a = ctx!.active.value;
  if (props.index < a) return "completed";
  if (props.index === a) return "current";
  return "upcoming";
});
const isClickable = computed(
  () => ctx!.clickable && props.index < ctx!.active.value
);

const classes = computed(() =>
  cn(
    "vyre-step",
    `vyre-step--${state.value}`,
    isClickable.value && "vyre-step--clickable",
    props.class
  )
);
</script>

<template>
  <div
    role="listitem"
    :aria-current="state === 'current' ? 'step' : undefined"
    :data-state="state"
    :class="classes"
  >
    <button
      type="button"
      class="vyre-step__indicator"
      :disabled="!isClickable"
      :tabindex="isClickable ? 0 : -1"
      :aria-label="label ?? `Step ${index + 1}`"
      @click="isClickable && ctx!.setActive(index)"
    >
      <span aria-hidden="true">
        <slot name="icon">
          <template v-if="state === 'completed'">✓</template>
          <template v-else>{{ index + 1 }}</template>
        </slot>
      </span>
    </button>
    <span v-if="label || description" class="vyre-step__text">
      <span v-if="label" class="vyre-step__label">{{ label }}</span>
      <span v-if="description" class="vyre-step__description">{{ description }}</span>
    </span>
    <span class="vyre-step__connector" aria-hidden="true" />
  </div>
</template>
