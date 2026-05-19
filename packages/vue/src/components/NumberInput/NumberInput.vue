<!--
  @usevyre/vue — NumberInput

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  NumberInput                                           │
  │ Import:     import { NumberInput } from "@usevyre/vue"             │
  │                                                                   │
  │ Controlled numeric input with −/+ stepper. v-model is a NUMBER    │
  │ (or null when empty). Works inside <FormField> via its slot.      │
  │                                                                   │
  │   v-model       = number | null                                   │
  │   min max step  = number   (step default 1)                       │
  │   precision     = number   (decimal places)                       │
  │   size          = "sm" | "md"(default) | "lg"                     │
  │   disabled readonly = boolean                                     │
  │                                                                   │
  │ Clamps to min/max on blur. ArrowUp/Down ±step, Shift ±step×10.    │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    defaultValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    readonly?: boolean;
    class?: string;
  }>(),
  { step: 1, size: "md", disabled: false, readonly: false, defaultValue: null }
);

const emit = defineEmits<{ "update:modelValue": [v: number | null] }>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<number | null>(props.defaultValue ?? null);
const value = computed<number | null>(() =>
  isControlled.value ? props.modelValue ?? null : internal.value
);

const clamp = (n: number) => {
  if (props.min !== undefined && n < props.min) return props.min;
  if (props.max !== undefined && n > props.max) return props.max;
  return n;
};
const round = (n: number) => {
  if (props.precision === undefined) return n;
  const f = 10 ** props.precision;
  return Math.round(n * f) / f;
};

const text = ref<string>(
  value.value === null || value.value === undefined ? "" : String(value.value)
);

watch(value, (v) => {
  const next = v === null || v === undefined ? "" : String(v);
  if (Number(text.value) !== v || text.value === "") text.value = next;
});

function commit(next: number | null) {
  if (!isControlled.value) internal.value = next;
  emit("update:modelValue", next);
}
function setNumber(n: number) {
  const v = round(clamp(n));
  text.value = String(v);
  commit(v);
}
function stepBy(dir: 1 | -1, multiplier = 1) {
  setNumber((value.value ?? 0) + dir * (props.step ?? 1) * multiplier);
}

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  text.value = raw;
  if (raw === "" || raw === "-") {
    commit(null);
    return;
  }
  const n = Number(raw);
  if (!Number.isNaN(n)) commit(round(n));
}
function onBlur() {
  if (value.value !== null && value.value !== undefined) {
    const clamped = round(clamp(value.value));
    if (clamped !== value.value) setNumber(clamped);
    else text.value = String(clamped);
  } else {
    text.value = "";
  }
}
function onKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return;
  if (e.key === "ArrowUp") {
    e.preventDefault();
    stepBy(1, e.shiftKey ? 10 : 1);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    stepBy(-1, e.shiftKey ? 10 : 1);
  }
}

const atMin = computed(
  () => props.min !== undefined && value.value !== null && (value.value ?? 0) <= props.min
);
const atMax = computed(
  () => props.max !== undefined && value.value !== null && (value.value ?? 0) >= props.max
);

const classes = computed(() =>
  cn(
    "vyre-number-input",
    `vyre-number-input--${props.size}`,
    props.disabled && "vyre-number-input--disabled",
    props.class
  )
);
</script>

<template>
  <div :class="classes" :data-disabled="disabled ? '' : undefined">
    <button
      type="button"
      class="vyre-number-input__btn vyre-number-input__btn--dec"
      aria-label="Decrease"
      :tabindex="-1"
      :disabled="disabled || readonly || atMin"
      @click="stepBy(-1)"
    >
      <span aria-hidden="true">−</span>
    </button>
    <input
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :aria-valuenow="value ?? undefined"
      :aria-valuemin="min"
      :aria-valuemax="max"
      class="vyre-number-input__field"
      :value="text"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeydown"
    />
    <button
      type="button"
      class="vyre-number-input__btn vyre-number-input__btn--inc"
      aria-label="Increase"
      :tabindex="-1"
      :disabled="disabled || readonly || atMax"
      @click="stepBy(1)"
    >
      <span aria-hidden="true">+</span>
    </button>
  </div>
</template>
