<script setup lang="ts">
/**
 * @usevyre/vue — Radio
 *
 * Must be used inside a <RadioGroup>. The group owns the selected
 * value (v-model) and shares it via provide/inject.
 *
 * Props: value (required), label?, description?, disabled?
 */

import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { radioGroupKey } from "./context";

const props = withDefaults(
  defineProps<{
    value: string;
    label?: string;
    description?: string;
    disabled?: boolean;
    class?: string;
  }>(),
  { disabled: false }
);

const ctx = inject(radioGroupKey, null);
if (!ctx) {
  throw new Error("Radio must be used inside a <RadioGroup>.");
}

const checked = computed(() => ctx!.value.value === props.value);
const isDisabled = computed(() => props.disabled || ctx!.disabled.value);
const inputId = computed(() =>
  `${ctx!.name}-${props.value}`.replace(/\s+/g, "-")
);

const classes = computed(() =>
  cn(
    "vyre-radio",
    `vyre-radio--${ctx!.size.value}`,
    isDisabled.value && "vyre-radio--disabled",
    props.class
  )
);
</script>

<template>
  <label
    :class="classes"
    :for="inputId"
    :data-checked="checked || undefined"
    :data-disabled="isDisabled || undefined"
  >
    <input
      type="radio"
      :id="inputId"
      :name="ctx!.name"
      :value="value"
      :checked="checked"
      :disabled="isDisabled"
      class="vyre-radio__input"
      @change="ctx!.select(value)"
    />
    <span class="vyre-radio__control" aria-hidden="true">
      <span class="vyre-radio__dot" />
    </span>
    <span v-if="label || description" class="vyre-radio__content">
      <span v-if="label" class="vyre-radio__label">{{ label }}</span>
      <span v-if="description" class="vyre-radio__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>
