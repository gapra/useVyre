<!--
  @usevyre/vue — ToggleGroup

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  ToggleGroup (+ ToggleItem)                            │
  │ Import:     import { ToggleGroup, ToggleItem } from "@usevyre/vue" │
  │                                                                   │
  │ Segmented control. CONTROLLED via v-model.                        │
  │   type = "single"(default) | "multiple"                           │
  │     single   → v-model: string | null                             │
  │     multiple → v-model: string[]                                  │
  │   options? = { value; label?; disabled? }[]                       │
  │   size = "sm" | "md"(default) | "lg"   disabled = boolean         │
  │                                                                   │
  │ Use `options` for simple lists, or <ToggleItem value> children.   │
  │ NOT Switch / ButtonGroup / RadioGroup.                            │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, provide } from "vue";
import { cn } from "../../utils/cn";
import ToggleItem from "./ToggleItem.vue";
import { toggleGroupKey, type ToggleOption } from "./context";

const props = withDefaults(
  defineProps<{
    type?: "single" | "multiple";
    modelValue?: string | null | string[];
    options?: ToggleOption[];
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    class?: string;
  }>(),
  { type: "single", size: "md", disabled: false, orientation: "horizontal" }
);

const emit = defineEmits<{
  "update:modelValue": [v: string | null | string[]];
}>();

const isMultiple = computed(() => props.type === "multiple");

function isSelected(value: string): boolean {
  if (isMultiple.value)
    return Array.isArray(props.modelValue) && props.modelValue.includes(value);
  return props.modelValue === value;
}

function toggle(value: string) {
  if (isMultiple.value) {
    const cur = Array.isArray(props.modelValue) ? props.modelValue : [];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    emit("update:modelValue", next);
  } else {
    emit("update:modelValue", props.modelValue === value ? null : value);
  }
}

provide(toggleGroupKey, {
  isSelected,
  toggle,
  size: props.size,
  groupDisabled: props.disabled,
});

const classes = computed(() =>
  cn(
    "vyre-toggle-group",
    `vyre-toggle-group--${props.size}`,
    props.disabled && "vyre-toggle-group--disabled",
    props.class
  )
);
</script>

<template>
  <div
    :role="isMultiple ? 'group' : 'radiogroup'"
    :aria-orientation="orientation"
    :data-orientation="orientation"
    :class="classes"
  >
    <template v-if="options">
      <ToggleItem
        v-for="o in options"
        :key="o.value"
        :value="o.value"
        :disabled="o.disabled"
      >
        {{ o.label ?? o.value }}
      </ToggleItem>
    </template>
    <slot v-else />
  </div>
</template>
