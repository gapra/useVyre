<script setup lang="ts">
/**
 * @vyre/vue — DatePicker
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Component:  DatePicker                                      │
 * │ = all Calendar props +                                      │
 * │ placeholder = string                                        │
 * │ inputClass  = string                                        │
 * │                                                             │
 * │ Events: @update:modelValue                                  │
 * └─────────────────────────────────────────────────────────────┘
 *
 * @example
 * <DatePicker v-model="date" placeholder="Pick a date" />
 * <DatePicker mode="range" v-model="range" />
 */

import { computed, onMounted, onUnmounted, ref } from "vue";
import { cn } from "../../utils/cn";
import Calendar from "./Calendar.vue";

type CalendarMode = "single" | "range" | "multiple";

const props = withDefaults(defineProps<{
  mode?: CalendarMode;
  modelValue?: Date | null | [Date | null, Date | null] | Date[];
  showTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  placeholder?: string;
  inputClass?: string;
  class?: string;
}>(), {
  mode: "single",
  showTime: false,
  weekStartsOn: 1,
  placeholder: "Pick a date",
});

const emit = defineEmits<{
  (e: "update:modelValue", v: Date | null | [Date | null, Date | null] | Date[]): void;
}>();

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const popoverPos = ref({ top: 0, left: 0 });

function updatePos() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  popoverPos.value = {
    top: rect.bottom + window.scrollY + 6,
    left: rect.left + window.scrollX,
  };
}

function handleToggle() {
  updatePos();
  open.value = !open.value;
}

function onPointerDown(e: PointerEvent) {
  if (!popoverRef.value?.contains(e.target as Node) && !triggerRef.value?.contains(e.target as Node)) {
    open.value = false;
  }
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") open.value = false;
}

onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKey);
});
onUnmounted(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("keydown", onKey);
});

// ── Display value ─────────────────────────────────────────────

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(d);
}
function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const displayValue = computed(() => {
  if (props.mode === "range") {
    const [s, e] = (props.modelValue as [Date|null,Date|null]) ?? [null, null];
    if (!s) return "";
    if (!e) return formatDate(s);
    return `${formatDate(s)} – ${formatDate(e)}`;
  }
  if (props.mode === "multiple") {
    const dates = (props.modelValue as Date[]) ?? [];
    if (dates.length === 0) return "";
    if (dates.length === 1) return formatDate(dates[0]);
    return `${dates.length} dates selected`;
  }
  const v = props.modelValue as Date | null;
  if (!v) return "";
  return props.showTime ? `${formatDate(v)} ${formatTime(v)}` : formatDate(v);
});

function handleChange(v: Date | null | [Date | null, Date | null] | Date[]) {
  emit("update:modelValue", v);
  // Auto-close for single (no time) and range when both dates selected
  if (props.mode === "single" && !props.showTime) {
    open.value = false;
  } else if (props.mode === "range") {
    const [, e] = v as [Date|null,Date|null];
    if (e) open.value = false;
  }
}

function handleClear(e: MouseEvent) {
  e.stopPropagation();
  if (props.mode === "range") emit("update:modelValue", [null, null]);
  else if (props.mode === "multiple") emit("update:modelValue", []);
  else emit("update:modelValue", null);
}
</script>

<template>
  <div :class="cn('vyre-datepicker', props.class)">
    <button
      ref="triggerRef"
      type="button"
      :class="cn('vyre-datepicker__trigger', !displayValue && 'vyre-datepicker__trigger--placeholder', props.inputClass)"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="handleToggle"
    >
      <svg class="vyre-datepicker__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M1.5 6h11M4.5 1v3M9.5 1v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <span>{{ displayValue || placeholder }}</span>
      <button
        v-if="displayValue"
        class="vyre-datepicker__clear"
        type="button"
        aria-label="Clear"
        @click="handleClear"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </button>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="popoverRef"
        class="vyre-datepicker__popover"
        role="dialog"
        aria-label="Date picker"
        :style="{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }"
      >
        <Calendar
          :mode="mode"
          :model-value="modelValue"
          :show-time="showTime"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :week-starts-on="weekStartsOn"
          @update:model-value="handleChange"
        />
      </div>
    </Teleport>
  </div>
</template>
