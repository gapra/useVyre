<script setup lang="ts">
/**
 * @vyre/vue — Pagination
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Pagination                                  │
 * │ Import:     import { Pagination } from "@vyre/vue"      │
 * │                                                         │
 * │ Props:                                                  │
 * │   modelValue = number (current page, 1-indexed, v-model)│
 * │   totalPages = number                                   │
 * │   siblings   = number (pages each side, default 1)      │
 * │   showEdges  = boolean (first/last buttons, default true)│
 * │   showInfo   = boolean (show "Showing x–y of z" label)  │
 * │   totalItems = number (total records)                   │
 * │   pageSize   = number (records per page)                │
 * │                                                         │
 * │ Events:                                                 │
 * │   @update:modelValue — (page: number) => void           │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Pagination v-model="currentPage" :total-pages="20" />
 * <Pagination v-model="page" :total-pages="10" show-info :total-items="98" :page-size="10" />
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    totalPages: number;
    siblings?: number;
    showEdges?: boolean;
    showInfo?: boolean;
    totalItems?: number;
    pageSize?: number;
    class?: string;
  }>(),
  { siblings: 1, showEdges: true, showInfo: false }
);

const emit = defineEmits<{ (e: "update:modelValue", val: number): void }>();

function go(page: number) { emit("update:modelValue", page); }

const canPrev = computed(() => props.modelValue > 1);
const canNext = computed(() => props.modelValue < props.totalPages);

const infoLabel = computed(() => {
  if (!props.showInfo) return null;
  if (props.totalItems != null && props.pageSize != null) {
    const from = (props.modelValue - 1) * props.pageSize + 1;
    const to   = Math.min(props.modelValue * props.pageSize, props.totalItems);
    return `Showing ${from}–${to} of ${props.totalItems}`;
  }
  return `Page ${props.modelValue} of ${props.totalPages}`;
});

function getRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const pages = computed<(number | "...")[]>(() => {
  const { modelValue: page, totalPages: total, siblings } = props;
  const totalShown = siblings * 2 + 5;
  if (total <= totalShown) return getRange(1, total);
  const leftSib  = Math.max(page - siblings, 2);
  const rightSib = Math.min(page + siblings, total - 1);
  const result: (number | "...")[] = [1];
  if (leftSib  > 2)         result.push("...");
  result.push(...getRange(leftSib, rightSib));
  if (rightSib < total - 1) result.push("...");
  result.push(total);
  return result;
});
</script>

<template>
  <div v-if="showInfo" :class="cn('vyre-pagination-row', props.class)">
    <span class="vyre-pagination__info">{{ infoLabel }}</span>
    <nav aria-label="Pagination" class="vyre-pagination">
      <template v-if="showEdges">
        <button class="vyre-pagination__nav" :disabled="!canPrev" aria-label="First page" @click="go(1)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2L2 7l5 5M12 2L7 7l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </template>
      <button class="vyre-pagination__nav" :disabled="!canPrev" aria-label="Previous page" @click="go(modelValue - 1)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <ol class="vyre-pagination__list">
        <template v-for="(p, i) in pages" :key="i">
          <li v-if="p === '...'" aria-hidden="true"><span class="vyre-pagination__dots">···</span></li>
          <li v-else>
            <button :class="cn('vyre-pagination__btn', p === modelValue && 'vyre-pagination__btn--active')" :aria-label="`Page ${p}`" :aria-current="p === modelValue ? 'page' : undefined" @click="go(p as number)">{{ p }}</button>
          </li>
        </template>
      </ol>
      <button class="vyre-pagination__nav" :disabled="!canNext" aria-label="Next page" @click="go(modelValue + 1)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <template v-if="showEdges">
        <button class="vyre-pagination__nav" :disabled="!canNext" aria-label="Last page" @click="go(totalPages)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l5 5-5 5M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </template>
    </nav>
  </div>

  <nav v-else aria-label="Pagination" :class="cn('vyre-pagination', props.class)">
    <button v-if="showEdges" class="vyre-pagination__nav" :disabled="!canPrev" aria-label="First page" @click="go(1)">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 2L2 7l5 5M12 2L7 7l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="vyre-pagination__nav" :disabled="!canPrev" aria-label="Previous page" @click="go(modelValue - 1)">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <ol class="vyre-pagination__list">
      <template v-for="(p, i) in pages" :key="i">
        <li v-if="p === '...'" aria-hidden="true"><span class="vyre-pagination__dots">···</span></li>
        <li v-else>
          <button :class="cn('vyre-pagination__btn', p === modelValue && 'vyre-pagination__btn--active')" :aria-label="`Page ${p}`" :aria-current="p === modelValue ? 'page' : undefined" @click="go(p as number)">{{ p }}</button>
        </li>
      </template>
    </ol>
    <button class="vyre-pagination__nav" :disabled="!canNext" aria-label="Next page" @click="go(modelValue + 1)">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button v-if="showEdges" class="vyre-pagination__nav" :disabled="!canNext" aria-label="Last page" @click="go(totalPages)">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 2l5 5-5 5M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </nav>
</template>
