<script setup lang="ts">
/**
 * @vyre/vue — Calendar
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Component:  Calendar                                        │
 * │ mode      = "single"(default) | "range" | "multiple"        │
 * │ modelValue = Date | [Date|null,Date|null] | Date[]          │
 * │ showTime  = boolean                                         │
 * │ minDate / maxDate = Date                                    │
 * │ disabled  = (date: Date) => boolean                         │
 * │ weekStartsOn = 0 (Sun) | 1 (Mon, default)                  │
 * │                                                             │
 * │ Events: @update:modelValue                                  │
 * └─────────────────────────────────────────────────────────────┘
 */

import { computed, ref } from "vue";
import { cn } from "../../utils/cn";

type CalendarMode = "single" | "range" | "multiple";

const props = withDefaults(defineProps<{
  mode?: CalendarMode;
  modelValue?: Date | null | [Date | null, Date | null] | Date[];
  showTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  class?: string;
  weekStartsOn?: 0 | 1;
}>(), {
  mode: "single",
  showTime: false,
  weekStartsOn: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", v: Date | null | [Date | null, Date | null] | Date[]): void;
}>();

// ── Helpers ────────────────────────────────────────────────────

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBefore(a: Date, b: Date) { return startOfDay(a) < startOfDay(b); }
function isAfter(a: Date, b: Date) { return startOfDay(a) > startOfDay(b); }
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOffset(y: number, m: number, weekStartsOn: 0 | 1) {
  return (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat("default", { month: "long" }).format(new Date(2000, i, 1))
);
const YEARS_RANGE = 12;

// ── State ──────────────────────────────────────────────────────

const today = startOfDay(new Date());

function getInitialDate(): Date {
  if (!props.modelValue) return today;
  if (props.mode === "range") return (props.modelValue as [Date|null,Date|null])[0] ?? today;
  if (props.mode === "multiple") return (props.modelValue as Date[])[0] ?? today;
  return (props.modelValue as Date) ?? today;
}

const viewYear = ref(getInitialDate().getFullYear());
const viewMonth = ref(getInitialDate().getMonth());
const pickerMode = ref<"days" | "months" | "years">("days");
const rangeHover = ref<Date | null>(null);
const timeHours = ref(0);
const timeMinutes = ref(0);

// ── Computed ───────────────────────────────────────────────────

const weekLabels = computed(() =>
  props.weekStartsOn === 1
    ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
);

const daysInMonth = computed(() => getDaysInMonth(viewYear.value, viewMonth.value));
const firstDayOffset = computed(() => getFirstDayOffset(viewYear.value, viewMonth.value, props.weekStartsOn));
const yearStart = computed(() => Math.floor(viewYear.value / YEARS_RANGE) * YEARS_RANGE);

function isSelected(d: Date): boolean {
  if (props.mode === "single") {
    const v = props.modelValue as Date | null;
    return !!v && isSameDay(d, v);
  }
  if (props.mode === "range") {
    const [s, e] = (props.modelValue as [Date|null,Date|null]) ?? [null, null];
    return (!!s && isSameDay(d, s)) || (!!e && isSameDay(d, e));
  }
  if (props.mode === "multiple") {
    return ((props.modelValue as Date[]) ?? []).some((v) => isSameDay(v, d));
  }
  return false;
}

function isInRange(d: Date): boolean {
  if (props.mode !== "range") return false;
  const [s, e] = (props.modelValue as [Date|null,Date|null]) ?? [null, null];
  const end = e ?? rangeHover.value;
  if (!s || !end) return false;
  const lo = isBefore(s, end) ? s : end;
  const hi = isBefore(s, end) ? end : s;
  return isAfter(d, lo) && isBefore(d, hi);
}

function isRangeStart(d: Date): boolean {
  if (props.mode !== "range") return false;
  const [s] = (props.modelValue as [Date|null,Date|null]) ?? [null, null];
  return !!s && isSameDay(d, s);
}

function isRangeEnd(d: Date): boolean {
  if (props.mode !== "range") return false;
  const [, e] = (props.modelValue as [Date|null,Date|null]) ?? [null, null];
  return !!e && isSameDay(d, e);
}

function isOutOfBounds(d: Date): boolean {
  if (props.minDate && isBefore(d, props.minDate)) return true;
  if (props.maxDate && isAfter(d, props.maxDate)) return true;
  if (props.disabled?.(d)) return true;
  return false;
}

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

// ── Actions ────────────────────────────────────────────────────

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value--; }
  else viewMonth.value--;
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++; }
  else viewMonth.value++;
}

function handleDayClick(day: number) {
  const clicked = new Date(viewYear.value, viewMonth.value, day, timeHours.value, timeMinutes.value);
  if (isOutOfBounds(startOfDay(clicked))) return;

  if (props.mode === "single" || !props.mode) {
    emit("update:modelValue", clicked);
  } else if (props.mode === "range") {
    const [s, e] = (props.modelValue as [Date|null,Date|null]) ?? [null, null];
    if (!s || (s && e)) {
      emit("update:modelValue", [clicked, null]);
    } else {
      emit("update:modelValue", isBefore(clicked, s) ? [clicked, s] : [s, clicked]);
    }
  } else if (props.mode === "multiple") {
    const current = (props.modelValue as Date[]) ?? [];
    const idx = current.findIndex((v) => isSameDay(v, clicked));
    emit("update:modelValue", idx >= 0 ? current.filter((_, i) => i !== idx) : [...current, clicked]);
  }
}

function handleTimeChange(h: number, m: number) {
  timeHours.value = h;
  timeMinutes.value = m;
  if (props.mode === "single" && props.modelValue) {
    const updated = new Date(props.modelValue as Date);
    updated.setHours(h, m);
    emit("update:modelValue", updated);
  }
}
</script>

<template>
  <div :class="cn('vyre-calendar', props.class)">
    <!-- Header -->
    <div class="vyre-calendar__header">
      <button
        v-if="pickerMode === 'days'"
        class="vyre-calendar__nav"
        aria-label="Previous month"
        @click="prevMonth"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        v-if="pickerMode === 'years'"
        class="vyre-calendar__nav"
        aria-label="Previous years"
        @click="viewYear -= YEARS_RANGE"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="vyre-calendar__header-center">
        <button
          class="vyre-calendar__header-btn"
          @click="pickerMode = pickerMode === 'months' ? 'days' : 'months'"
        >
          {{ MONTHS[viewMonth] }}
        </button>
        <button
          class="vyre-calendar__header-btn"
          @click="pickerMode = pickerMode === 'years' ? 'days' : 'years'"
        >
          {{ viewYear }}
        </button>
      </div>

      <button
        v-if="pickerMode === 'days'"
        class="vyre-calendar__nav"
        aria-label="Next month"
        @click="nextMonth"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        v-if="pickerMode === 'years'"
        class="vyre-calendar__nav"
        aria-label="Next years"
        @click="viewYear += YEARS_RANGE"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Month picker -->
    <div v-if="pickerMode === 'months'" class="vyre-calendar__month-grid">
      <button
        v-for="(name, i) in MONTHS"
        :key="name"
        :class="cn('vyre-calendar__month-cell', i === viewMonth && 'vyre-calendar__month-cell--active')"
        @click="viewMonth = i; pickerMode = 'days'"
      >
        {{ name.slice(0, 3) }}
      </button>
    </div>

    <!-- Year picker -->
    <div v-if="pickerMode === 'years'" class="vyre-calendar__year-grid">
      <button
        v-for="y in Array.from({ length: YEARS_RANGE }, (_, i) => yearStart + i)"
        :key="y"
        :class="cn('vyre-calendar__year-cell', y === viewYear && 'vyre-calendar__year-cell--active')"
        @click="viewYear = y; pickerMode = 'days'"
      >
        {{ y }}
      </button>
    </div>

    <!-- Day grid -->
    <div v-if="pickerMode === 'days'" class="vyre-calendar__grid">
      <div v-for="label in weekLabels" :key="label" class="vyre-calendar__weekday">{{ label }}</div>
      <div v-for="i in firstDayOffset" :key="`e-${i}`" />
      <button
        v-for="day in daysInMonth"
        :key="day"
        :class="cn(
          'vyre-calendar__day',
          isSameDay(new Date(viewYear, viewMonth, day), today) && 'vyre-calendar__day--today',
          isSelected(new Date(viewYear, viewMonth, day)) && 'vyre-calendar__day--selected',
          isInRange(new Date(viewYear, viewMonth, day)) && 'vyre-calendar__day--in-range',
          isRangeStart(new Date(viewYear, viewMonth, day)) && 'vyre-calendar__day--range-start',
          isRangeEnd(new Date(viewYear, viewMonth, day)) && 'vyre-calendar__day--range-end',
          isOutOfBounds(new Date(viewYear, viewMonth, day)) && 'vyre-calendar__day--disabled',
        )"
        :disabled="isOutOfBounds(new Date(viewYear, viewMonth, day))"
        :aria-selected="isSelected(new Date(viewYear, viewMonth, day))"
        :aria-label="formatDate(new Date(viewYear, viewMonth, day))"
        @click="handleDayClick(day)"
        @mouseenter="mode === 'range' && (rangeHover = new Date(viewYear, viewMonth, day))"
        @mouseleave="rangeHover = null"
      >
        {{ day }}
      </button>
    </div>

    <!-- Time picker -->
    <div v-if="showTime && pickerMode === 'days'" class="vyre-calendar__time">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M7 4v3.5l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <input
        type="number"
        class="vyre-calendar__time-input"
        :min="0" :max="23"
        :value="timeHours"
        aria-label="Hours"
        @change="handleTimeChange(Number(($event.target as HTMLInputElement).value), timeMinutes)"
      />
      <span class="vyre-calendar__time-sep">:</span>
      <input
        type="number"
        class="vyre-calendar__time-input"
        :min="0" :max="59"
        :value="timeMinutes"
        aria-label="Minutes"
        @change="handleTimeChange(timeHours, Number(($event.target as HTMLInputElement).value))"
      />
    </div>
  </div>
</template>
