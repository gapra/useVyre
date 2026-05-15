<script setup lang="ts">
/**
 * @usevyre/vue — DataGrid
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  DataGrid                                    │
 * │ Import:     import { DataGrid } from "@usevyre/vue"     │
 * │                                                         │
 * │ Props:                                                  │
 * │   columns       = { key: string; label: string;         │
 * │                     sortable?: boolean;                 │
 * │                     width?: string }[]                  │
 * │   rows          = Record<string, unknown>[]             │
 * │   sortKey?      = string (controlled)                   │
 * │   sortDir?      = "asc"|"desc" (controlled)             │
 * │   loading?      = boolean — shows 5 skeleton rows       │
 * │   emptyText?    = string (default: "No data")           │
 * │   stickyHeader? = boolean (default: false)              │
 * │                                                         │
 * │ Emits:                                                  │
 * │   update:sortKey  — new sort column key                 │
 * │   update:sortDir  — new sort direction                  │
 * │   sort            — { key, dir } on header click        │
 * │                                                         │
 * │ Sort icons: ↕ unsorted, ↑ asc, ↓ desc                  │
 * │ Intentionally excludes: filtering, pagination           │
 * │   → Use Pagination component for page navigation        │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <DataGrid
 *   :columns="[
 *     { key: 'name',  label: 'Name',  sortable: true },
 *     { key: 'email', label: 'Email', sortable: true },
 *   ]"
 *   :rows="users"
 *   v-model:sort-key="sortKey"
 *   v-model:sort-dir="sortDir"
 *   sticky-header
 *   :loading="isLoading"
 * />
 *
 * // With Pagination
 * <DataGrid :columns="cols" :rows="pageRows" />
 * <Pagination v-model:page="page" :total-pages="totalPages" />
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";
import Skeleton from "../Skeleton/Skeleton.vue";

interface DataGridColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

const SKELETON_ROWS = 5;

const props = withDefaults(
  defineProps<{
    columns: DataGridColumn[];
    rows: Record<string, unknown>[];
    sortKey?: string;
    sortDir?: "asc" | "desc";
    loading?: boolean;
    emptyText?: string;
    stickyHeader?: boolean;
    class?: string;
  }>(),
  { loading: false, emptyText: "No data", stickyHeader: false }
);

const emit = defineEmits<{
  "update:sortKey": [key: string];
  "update:sortDir": [dir: "asc" | "desc"];
  sort: [payload: { key: string; dir: "asc" | "desc" }];
}>();

function handleSort(col: DataGridColumn) {
  if (!col.sortable) return;
  const newDir: "asc" | "desc" =
    props.sortKey === col.key && props.sortDir === "asc" ? "desc" : "asc";
  emit("update:sortKey", col.key);
  emit("update:sortDir", newDir);
  emit("sort", { key: col.key, dir: newDir });
}

function getAriaSort(col: DataGridColumn): "ascending" | "descending" | "none" {
  if (props.sortKey !== col.key) return "none";
  return props.sortDir === "asc" ? "ascending" : "descending";
}

const skeletonRows = computed(() => Array.from({ length: SKELETON_ROWS }, (_, i) => i));

const wrapperClasses = computed(() =>
  cn(
    "vyre-data-grid",
    props.stickyHeader && "vyre-data-grid--sticky-header",
    props.class
  )
);
</script>

<template>
  <div :class="wrapperClasses">
    <table class="vyre-data-grid__table">
      <thead class="vyre-data-grid__thead">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              'vyre-data-grid__th',
              col.sortable && 'vyre-data-grid__th--sortable',
              sortKey === col.key && `vyre-data-grid__th--sort-${sortDir}`,
            ]"
            :style="col.width ? { width: col.width } : undefined"
            :aria-sort="col.sortable ? getAriaSort(col) : undefined"
          >
            <button
              v-if="col.sortable"
              type="button"
              class="vyre-data-grid__sort-btn"
              @click="handleSort(col)"
            >
              {{ col.label }}
              <span class="vyre-data-grid__sort-icon" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 2v4M3.5 4.5L6 2l2.5 2.5"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :opacity="sortKey === col.key && sortDir === 'desc' ? 0.3 : 1"
                  />
                  <path
                    d="M6 10V6M3.5 7.5L6 10l2.5-2.5"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :opacity="sortKey === col.key && sortDir === 'asc' ? 0.3 : 1"
                  />
                </svg>
              </span>
            </button>
            <template v-else>{{ col.label }}</template>
          </th>
        </tr>
      </thead>
      <tbody class="vyre-data-grid__tbody">
        <!-- Loading skeleton rows -->
        <tr
          v-if="loading"
          v-for="i in skeletonRows"
          :key="`skel-${i}`"
          class="vyre-data-grid__row vyre-data-grid__row--skeleton"
        >
          <td v-for="col in columns" :key="col.key" class="vyre-data-grid__td">
            <Skeleton :height="16" />
          </td>
        </tr>

        <!-- Empty state -->
        <tr
          v-else-if="rows.length === 0"
          class="vyre-data-grid__row vyre-data-grid__row--empty"
        >
          <td
            class="vyre-data-grid__td vyre-data-grid__empty"
            :colspan="columns.length"
          >
            {{ emptyText }}
          </td>
        </tr>

        <!-- Data rows -->
        <tr
          v-else
          v-for="(row, rowIdx) in rows"
          :key="rowIdx"
          class="vyre-data-grid__row"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="vyre-data-grid__td"
          >
            {{ row[col.key] != null ? String(row[col.key]) : "" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
