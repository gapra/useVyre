<!--
  @usevyre/vue — FormField

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  FormField (use inside <Form>)                          │
  │                                                                   │
  │   name   = string  (key into the form values)                     │
  │   label  = string                                                 │
  │   hint   = string  (helper text when no error)                    │
  │   rules  = { required?, minLength?, maxLength?, min?, max?,        │
  │              pattern?: RegExp, email?: boolean,                    │
  │              validate?: (value, allValues) => string | null }     │
  │                                                                   │
  │ Scoped slot exposes { value, error, onInput, onBlur }. Bind them  │
  │ to the control:                                                   │
  │   v-slot="{ value, onInput, onBlur }"                             │
  │   <Input :model-value="value" @update:model-value="onInput"       │
  │          @blur="onBlur" />                                         │
  │ Wraps the control in <Field> (label + error state + hint).        │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, watchEffect } from "vue";
import { cn } from "../../utils/cn";
import Field from "../Input/Field.vue";
import { FORM_KEY, type FormRules } from "./form-context";

const props = defineProps<{
  name: string;
  label?: string;
  hint?: string;
  rules?: FormRules;
  class?: string;
}>();

const ctx = inject(FORM_KEY);
if (!ctx) {
  throw new Error("FormField must be used inside a <Form>");
}

// Keep the registered rules in sync with the prop.
watchEffect(() => ctx.registerField(props.name, props.rules));
onMounted(() => ctx.registerField(props.name, props.rules));
onUnmounted(() => ctx.unregisterField(props.name));

const value = computed(() => ctx.getValue(props.name) ?? "");
const error = computed(() => ctx.getError(props.name));

function onInput(v: unknown) {
  const next =
    v && typeof v === "object" && "target" in v
      ? (v as { target: { value: unknown } }).target.value
      : v;
  ctx!.setValue(props.name, next);
  // Live re-validate after the first submit.
  queueMicrotask(() => ctx!.validateField(props.name));
}

function onBlur() {
  ctx!.validateField(props.name);
}

const classes = computed(() => cn("vyre-form-field", props.class));
</script>

<template>
  <Field
    :label="label"
    :hint="error ?? hint"
    :state="error ? 'error' : 'idle'"
    :class="classes"
  >
    <slot :value="value" :error="error" :onInput="onInput" :onBlur="onBlur" />
  </Field>
</template>
