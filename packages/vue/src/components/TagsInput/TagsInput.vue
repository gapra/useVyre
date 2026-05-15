<script setup lang="ts">
/**
 * @usevyre/vue — TagsInput
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  TagsInput                                   │
 * │ Import:     import { TagsInput } from "@usevyre/vue"    │
 * │                                                         │
 * │ Props:                                                  │
 * │   modelValue  = string[] (v-model)                      │
 * │   placeholder = string                                  │
 * │   disabled    = boolean                                 │
 * │   max         = number — max tag count                  │
 * │   size        = "sm"|"md"(default)|"lg"                 │
 * │                                                         │
 * │ Emits:                                                  │
 * │   update:modelValue — new string[] on every change      │
 * │                                                         │
 * │ Behavior:                                               │
 * │   Enter / comma → add tag (trim, dedupe, skip empty)    │
 * │   Backspace on empty input → remove last tag            │
 * │   × button on tag → remove that tag                     │
 * │   When max reached, input is disabled                   │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <TagsInput v-model="tags" placeholder="Add tag…" :max="5" />
 *
 * <Field label="Skills">
 *   <TagsInput v-model="skills" />
 * </Field>
 */

import { ref, computed } from "vue";
import { cn } from "../../utils/cn";
import Tag from "../Tag/Tag.vue";

type TagsInputSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    placeholder?: string;
    disabled?: boolean;
    max?: number;
    size?: TagsInputSize;
    class?: string;
  }>(),
  { placeholder: "Add tag…", disabled: false, size: "md" }
);

const emit = defineEmits<{ "update:modelValue": [tags: string[]] }>();

const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const isMaxReached = computed(
  () => props.max !== undefined && props.modelValue.length >= props.max
);
const isInputDisabled = computed(() => props.disabled || isMaxReached.value);

function addTag(raw: string) {
  const tag = raw.trim();
  if (!tag || props.modelValue.includes(tag) || isMaxReached.value) {
    inputValue.value = "";
    return;
  }
  emit("update:modelValue", [...props.modelValue, tag]);
  inputValue.value = "";
}

function removeTag(index: number) {
  if (props.disabled) return;
  emit("update:modelValue", props.modelValue.filter((_, i) => i !== index));
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    addTag(inputValue.value);
    return;
  }
  if (e.key === "Backspace" && inputValue.value === "" && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1);
  }
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  if (val.includes(",")) {
    const parts = val.split(",");
    parts.slice(0, -1).forEach((p) => addTag(p));
    inputValue.value = parts[parts.length - 1];
  } else {
    inputValue.value = val;
  }
}

function focusInput() {
  inputRef.value?.focus();
}

const wrapperClasses = computed(() =>
  cn(
    "vyre-tags-input",
    `vyre-tags-input--${props.size}`,
    props.disabled && "vyre-tags-input--disabled",
    props.class
  )
);
</script>

<template>
  <div :class="wrapperClasses" @click="focusInput">
    <Tag
      v-for="(tag, index) in modelValue"
      :key="`${tag}-${index}`"
      :size="size"
      :disabled="disabled"
      :removable="!disabled"
      @remove="removeTag(index)"
    >
      {{ tag }}
    </Tag>
    <input
      ref="inputRef"
      type="text"
      class="vyre-tags-input__field"
      :value="inputValue"
      :placeholder="isMaxReached ? '' : placeholder"
      :disabled="isInputDisabled"
      aria-label="Add tag"
      @input="onInput"
      @keydown="onKeyDown"
    />
  </div>
</template>
