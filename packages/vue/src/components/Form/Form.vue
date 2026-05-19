<!--
  @usevyre/vue — Form

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Form                                                  │
  │ Import:     import { Form, FormField } from "@usevyre/vue"         │
  │                                                                   │
  │ Controlled, data-driven form. Zero deps. Validates on submit and  │
  │ (after first submit) on blur. Errors map into Field automatically.│
  │                                                                   │
  │   v-model        = values object (controlled)                     │
  │   default-values = initial values when uncontrolled               │
  │   @submit        = (values) => void   (emitted only when valid)   │
  │   @invalid       = (errors) => void   (emitted when invalid)      │
  │                                                                   │
  │ <Form v-model="values" @submit="onSubmit">                        │
  │   <FormField name="email" label="Email" :rules="{ required:true,  │
  │               email:true }" v-slot="{ value, onInput, onBlur }">  │
  │     <Input :model-value="value" @update:model-value="onInput"     │
  │            @blur="onBlur" type="email" />                          │
  │   </FormField>                                                    │
  │ </Form>                                                           │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { cn } from "../../utils/cn";
import { FORM_KEY, runRules, type FormRules, type FormContext } from "./form-context";

type Values = Record<string, unknown>;
type Errors = Record<string, string>;

const props = withDefaults(
  defineProps<{
    modelValue?: Values;
    defaultValues?: Values;
    class?: string;
  }>(),
  {}
);

const emit = defineEmits<{
  "update:modelValue": [values: Values];
  submit: [values: Values];
  invalid: [errors: Errors];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<Values>({ ...(props.defaultValues ?? {}) });
const values = computed<Values>(() =>
  isControlled.value ? props.modelValue ?? {} : internal.value
);

const rules = new Map<string, FormRules | undefined>();
const errors = ref<Errors>({});
const submitted = ref(false);

function setValue(name: string, value: unknown) {
  const next = { ...values.value, [name]: value };
  if (!isControlled.value) internal.value = next;
  emit("update:modelValue", next);
}

function validateAll(): Errors {
  const next: Errors = {};
  rules.forEach((r, name) => {
    const msg = runRules(values.value[name], r, values.value);
    if (msg) next[name] = msg;
  });
  return next;
}

const ctx: FormContext = {
  getValue: (name) => values.value[name],
  setValue,
  registerField: (name, r) => rules.set(name, r),
  unregisterField: (name) => rules.delete(name),
  getError: (name) => errors.value[name],
  validateField: (name) => {
    if (!submitted.value) return;
    const msg = runRules(values.value[name], rules.get(name), values.value);
    const n = { ...errors.value };
    if (msg) n[name] = msg;
    else delete n[name];
    errors.value = n;
  },
};
provide(FORM_KEY, ctx);

function handleSubmit() {
  submitted.value = true;
  const next = validateAll();
  errors.value = next;
  if (Object.keys(next).length > 0) {
    emit("invalid", next);
    return;
  }
  emit("submit", values.value);
}

const classes = computed(() => cn("vyre-form", props.class));
</script>

<template>
  <form :class="classes" novalidate @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>
