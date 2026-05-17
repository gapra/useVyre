<script setup lang="ts">
/**
 * @usevyre/vue — DateRangePicker
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  DateRangePicker                                       │
 * │ Import:     import { DateRangePicker } from "@usevyre/vue"        │
 * │                                                                  │
 * │ Built on Calendar (mode="range"). Friendlier API: a              │
 * │ { from, to } object via v-model, TWO months side-by-side,        │
 * │ and a preset shortcut column.                                    │
 * │                                                                  │
 * │ Props:                                                           │
 * │   modelValue  = { from: Date|null; to: Date|null } | null        │
 * │   placeholder = string (default "Pick a date range")             │
 * │   numberOfMonths = 1 | 2 (default 2)                              │
 * │   presets     = boolean | DateRangePreset[]                      │
 * │   minDate / maxDate = Date                                        │
 * │   disabled    = (date: Date) => boolean                           │
 * │   weekStartsOn = 0 (Sun) | 1 (Mon, default)                      │
 * │                                                                  │
 * │ Events: @update:modelValue (emits { from, to })                  │
 * │                                                                  │
 * │ For a single date use DatePicker. Pass an object via v-model,    │
 * │ NOT a tuple.                                                      │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <DateRangePicker v-model="range" presets />
 */

import { computed, onMounted, onUnmounted, ref } from "vue";
import { cn } from "../../utils/cn";
import Calendar from "../Calendar/Calendar.vue";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}
export interface DateRangePreset {
  label: string;
  range: () => DateRange;
}

const props = withDefaults(defineProps<{
  modelValue?: DateRange | null;
  placeholder?: string;
  numberOfMonths?: 1 | 2;
  presets?: boolean | DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  class?: string;
  inputClass?: string;
}>(), {
  placeholder: "Pick a date range",
  numberOfMonths: 2,
  presets: false,
  weekStartsOn: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", v: DateRange): void;
}>();

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const popoverPos = ref({ top: 0, left: 0 });

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return startOfDay(x);
}
function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

const BUILT_IN_PRESETS: DateRangePreset[] = [
  { label: "Today", range: () => { const t = startOfDay(new Date()); return { from: t, to: t }; } },
  { label: "Yesterday", range: () => { const y = addDays(new Date(), -1); return { from: y, to: y }; } },
  { label: "Last 7 days", range: () => ({ from: addDays(new Date(), -6), to: startOfDay(new Date()) }) },
  { label: "Last 30 days", range: () => ({ from: addDays(new Date(), -29), to: startOfDay(new Date()) }) },
  {
    label: "This month",
    range: () => {
      const n = new Date();
      return { from: startOfDay(new Date(n.getFullYear(), n.getMonth(), 1)), to: startOfDay(new Date(n.getFullYear(), n.getMonth() + 1, 0)) };
    },
  },
  {
    label: "Last month",
    range: () => {
      const n = new Date();
      return { from: startOfDay(new Date(n.getFullYear(), n.getMonth() - 1, 1)), to: startOfDay(new Date(n.getFullYear(), n.getMonth(), 0)) };
    },
  },
];

const presetList = computed<DateRangePreset[]>(() =>
  props.presets === true ? BUILT_IN_PRESETS : Array.isArray(props.presets) ? props.presets : []
);

const fromDate = computed(() => props.modelValue?.from ?? null);
const toDate = computed(() => props.modelValue?.to ?? null);

const displayValue = computed(() => {
  const f = fromDate.value;
  const t = toDate.value;
  if (!f) return "";
  if (!t) return formatDate(f);
  return `${formatDate(f)} – ${formatDate(t)}`;
});

const calendarTuple = computed<[Date | null, Date | null]>(() => [fromDate.value, toDate.value]);

const secondMonthAnchor = computed(() => {
  const base = fromDate.value ?? startOfDay(new Date());
  return new Date(base.getFullYear(), base.getMonth() + 1, 1);
});

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

function handleCalendarChange(v: Date | null | [Date | null, Date | null] | Date[]) {
  const tuple = v as [Date | null, Date | null];
  const next: DateRange = { from: tuple[0], to: tuple[1] };
  emit("update:modelValue", next);
  if (next.from && next.to) open.value = false;
}

function applyPreset(p: DateRangePreset) {
  emit("update:modelValue", p.range());
  open.value = false;
}

function handleClear(e: MouseEvent) {
  e.stopPropagation();
  emit("update:modelValue", { from: null, to: null });
}
</script>

<template>
  <div :class="cn('vyre-date-range-picker', props.class)">
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
        class="vyre-date-range-picker__popover"
        role="dialog"
        aria-label="Date range picker"
        :style="{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }"
      >
        <div v-if="presetList.length" class="vyre-date-range-picker__presets">
          <button
            v-for="p in presetList"
            :key="p.label"
            type="button"
            class="vyre-date-range-picker__preset"
            @click="applyPreset(p)"
          >
            {{ p.label }}
          </button>
        </div>
        <div class="vyre-date-range-picker__calendars">
          <Calendar
            mode="range"
            :model-value="calendarTuple"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :week-starts-on="weekStartsOn"
            @update:model-value="handleCalendarChange"
          />
          <Calendar
            v-if="numberOfMonths === 2"
            :key="secondMonthAnchor.toISOString()"
            mode="range"
            :model-value="calendarTuple"
            :default-month="secondMonthAnchor"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :week-starts-on="weekStartsOn"
            @update:model-value="handleCalendarChange"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
