<!--
  @usevyre/vue — OTPInput

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  OTPInput                                              │
  │ Import:     import { OTPInput } from "@usevyre/vue"                │
  │                                                                   │
  │ Segmented one-time-code input (verification / 2FA). CONTROLLED.   │
  │ v-model is the STRING value. Paste-aware, auto-advance/backspace. │
  │                                                                   │
  │   v-model    = string                                             │
  │   @complete  = (value) emitted when all slots filled              │
  │   length     = number (default 6)                                 │
  │   type       = "numeric"(default) | "alphanumeric"                │
  │   mask       = boolean   size = "sm"|"md"(default)|"lg"           │
  │   disabled autofocus = boolean                                    │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { ref, computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    defaultValue?: string;
    length?: number;
    type?: "numeric" | "alphanumeric";
    mask?: boolean;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    autofocus?: boolean;
    class?: string;
  }>(),
  {
    defaultValue: "",
    length: 6,
    type: "numeric",
    mask: false,
    size: "md",
    disabled: false,
    autofocus: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [v: string];
  complete: [v: string];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref(props.defaultValue);
const value = computed(() =>
  (isControlled.value ? props.modelValue ?? "" : internal.value).slice(
    0,
    props.length
  )
);

const inputs = ref<(HTMLInputElement | null)[]>([]);
let prevComplete = false;

function sanitize(raw: string) {
  return props.type === "numeric"
    ? raw.replace(/[^0-9]/g, "")
    : raw.replace(/[^0-9a-zA-Z]/g, "");
}

function commit(next: string) {
  const clean = sanitize(next).slice(0, props.length);
  if (!isControlled.value) internal.value = clean;
  emit("update:modelValue", clean);
  const complete = clean.length === props.length;
  if (complete && !prevComplete) emit("complete", clean);
  prevComplete = complete;
}

function focusAt(i: number) {
  const el = inputs.value[Math.max(0, Math.min(i, props.length - 1))];
  el?.focus();
  el?.select();
}

function onInput(i: number, e: Event) {
  const ch = sanitize((e.target as HTMLInputElement).value);
  if (!ch) return;
  const chars = value.value.split("");
  chars[i] = ch[ch.length - 1];
  commit(chars.join("").slice(0, props.length));
  focusAt(i + 1);
}

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === "Backspace") {
    e.preventDefault();
    const chars = value.value.split("");
    if (chars[i]) {
      chars[i] = "";
      commit(chars.join(""));
    } else if (i > 0) {
      chars[i - 1] = "";
      commit(chars.join(""));
      focusAt(i - 1);
    }
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    focusAt(i - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    focusAt(i + 1);
  }
}

function onPaste(i: number, e: ClipboardEvent) {
  e.preventDefault();
  const pasted = sanitize(e.clipboardData?.getData("text") ?? "");
  if (!pasted) return;
  const chars = value.value.split("");
  for (let k = 0; k < pasted.length && i + k < props.length; k++) {
    chars[i + k] = pasted[k];
  }
  commit(chars.join("").slice(0, props.length));
  focusAt(Math.min(i + pasted.length, props.length - 1));
}

const classes = computed(() =>
  cn(
    "vyre-otp",
    `vyre-otp--${props.size}`,
    props.disabled && "vyre-otp--disabled",
    props.class
  )
);
</script>

<template>
  <div :class="classes" role="group" aria-label="One-time code">
    <input
      v-for="(_, i) in length"
      :key="i"
      :ref="(el) => (inputs[i] = el as HTMLInputElement)"
      class="vyre-otp__slot"
      :type="mask ? 'password' : 'text'"
      :inputmode="type === 'numeric' ? 'numeric' : 'text'"
      :autocomplete="i === 0 ? 'one-time-code' : 'off'"
      :maxlength="1"
      :disabled="disabled"
      :autofocus="autofocus && i === 0"
      :aria-label="`Digit ${i + 1}`"
      :value="value[i] ?? ''"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @paste="onPaste(i, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>
