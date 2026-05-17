<script setup lang="ts">
/**
 * @usevyre/vue — Kanban
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  Kanban (board with drag-and-drop between columns)    │
 * │ Import:     import { Kanban } from "@usevyre/vue"               │
 * │                                                                  │
 * │ CONTROLLED & data-driven (like DataGrid). No internal data       │
 * │ state — bind with v-model.                                       │
 * │                                                                  │
 * │ Props:                                                           │
 * │   modelValue = KanbanColumn[]  (required, v-model)               │
 * │                                                                  │
 * │ Emits:                                                           │
 * │   update:modelValue — next columns array after a drag move       │
 * │   card-click        — { card, column } when a card is clicked    │
 * │                                                                  │
 * │ Slots:                                                           │
 * │   #card="{ card, column }" — custom card body (optional)         │
 * │                                                                  │
 * │ KanbanColumn = { id; title; cards: KanbanCard[];                 │
 * │                  color?: KanbanColor }                            │
 * │ KanbanCard   = { id; title; description?;                        │
 * │                  color?: KanbanColor }                            │
 * │ KanbanColor  = "default" | "accent" | "teal" |                   │
 * │                "success" | "warning" | "danger"                  │
 * │   → tints the column/card background (token-based).              │
 * │                                                                  │
 * │ Card ids must be unique across the whole board. While            │
 * │ dragging, a placeholder shows the exact drop position.           │
 * │ Each card is wrapped in a <Card> (variant="outlined"); the       │
 * │ #card slot can render ANY content (incl. complex components       │
 * │ like avatars/badges/progress) inside the Card body.              │
 * │ Native HTML5 drag-and-drop — zero dependencies.                  │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <Kanban v-model="columns" @card-click="onCardClick" />
 */

import { ref } from "vue";
import { cn } from "../../utils/cn";
import Card from "../Card/Card.vue";
import CardBody from "../Card/CardBody.vue";

export type KanbanColor =
  | "default"
  | "accent"
  | "teal"
  | "success"
  | "warning"
  | "danger";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  /** Tints the card background (token-based). Default: "default". */
  color?: KanbanColor;
}
export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  /** Tints the column background (token-based). Default: "default". */
  color?: KanbanColor;
}

const props = withDefaults(
  defineProps<{
    modelValue: KanbanColumn[];
    class?: string;
  }>(),
  {}
);

const emit = defineEmits<{
  "update:modelValue": [next: KanbanColumn[]];
  "card-click": [payload: { card: KanbanCard; column: KanbanColumn }];
}>();

interface DragState {
  cardId: string;
  fromColumnId: string;
}

const drag = ref<DragState | null>(null);
const moved = ref(false);
const dragCardId = ref<string | null>(null);
const overColumnId = ref<string | null>(null);
const overIndex = ref<number | null>(null);

function setDropTarget(columnId: string, index: number) {
  if (overColumnId.value !== columnId) overColumnId.value = columnId;
  if (overIndex.value !== index) overIndex.value = index;
}

function moveCard(
  columns: KanbanColumn[],
  d: DragState,
  toColumnId: string,
  toIndex: number
): KanbanColumn[] {
  const fromCol = columns.find((c) => c.id === d.fromColumnId);
  if (!fromCol) return columns;
  const card = fromCol.cards.find((c) => c.id === d.cardId);
  if (!card) return columns;

  return columns.map((col) => {
    if (col.id === d.fromColumnId && col.id === toColumnId) {
      const without = col.cards.filter((c) => c.id !== d.cardId);
      const insertAt = Math.max(0, Math.min(toIndex, without.length));
      const next = [...without];
      next.splice(insertAt, 0, card);
      return { ...col, cards: next };
    }
    if (col.id === d.fromColumnId) {
      return { ...col, cards: col.cards.filter((c) => c.id !== d.cardId) };
    }
    if (col.id === toColumnId) {
      const insertAt = Math.max(0, Math.min(toIndex, col.cards.length));
      const next = [...col.cards];
      next.splice(insertAt, 0, card);
      return { ...col, cards: next };
    }
    return col;
  });
}

function handleDragStart(columnId: string, cardId: string, e: DragEvent) {
  drag.value = { cardId, fromColumnId: columnId };
  moved.value = false;
  dragCardId.value = cardId;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
  }
}

function handleDragEnd() {
  drag.value = null;
  dragCardId.value = null;
  overColumnId.value = null;
  overIndex.value = null;
}

function commitMove(toColumnId: string, toIndex: number) {
  const d = drag.value;
  if (!d) return;
  const next = moveCard(props.modelValue, d, toColumnId, toIndex);
  if (next !== props.modelValue) {
    moved.value = true;
    emit("update:modelValue", next);
  }
}

function onColumnDragOver(column: KanbanColumn, e: DragEvent) {
  if (!drag.value) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  setDropTarget(column.id, column.cards.length);
}

function onColumnDragLeave(columnId: string, e: DragEvent) {
  const ct = e.currentTarget as Node;
  if (!ct.contains(e.relatedTarget as Node)) {
    if (overColumnId.value === columnId) overColumnId.value = null;
    overIndex.value = null;
  }
}

function onColumnDrop(column: KanbanColumn, e: DragEvent) {
  e.preventDefault();
  commitMove(column.id, overIndex.value ?? column.cards.length);
  handleDragEnd();
}

function onCardDragOver(columnId: string, index: number, e: DragEvent) {
  if (!drag.value) return;
  e.preventDefault();
  e.stopPropagation();
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const after = e.clientY - rect.top > rect.height / 2;
  setDropTarget(columnId, after ? index + 1 : index);
}

function onCardDrop(columnId: string, index: number, e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  commitMove(columnId, overIndex.value ?? index);
  handleDragEnd();
}

function colColor(column: KanbanColumn): KanbanColor | undefined {
  return column.color && column.color !== "default" ? column.color : undefined;
}
function cardColor(card: KanbanCard): KanbanColor | undefined {
  return card.color && card.color !== "default" ? card.color : undefined;
}

function onCardClick(card: KanbanCard, column: KanbanColumn) {
  if (moved.value) return;
  emit("card-click", { card, column });
}
</script>

<template>
  <div
    :class="cn('vyre-kanban', props.class)"
    role="list"
    aria-label="Kanban board"
  >
    <div
      v-for="column in modelValue"
      :key="column.id"
      role="listitem"
      :data-color="colColor(column)"
      :class="cn('vyre-kanban__column', overColumnId === column.id && 'vyre-kanban__column--over')"
      @dragover="onColumnDragOver(column, $event)"
      @dragleave="onColumnDragLeave(column.id, $event)"
      @drop="onColumnDrop(column, $event)"
    >
      <div class="vyre-kanban__column-header">
        <span class="vyre-kanban__column-title">{{ column.title }}</span>
        <span class="vyre-kanban__column-count">{{ column.cards.length }}</span>
      </div>

      <div class="vyre-kanban__cards">
        <template v-for="(card, index) in column.cards" :key="card.id">
          <div
            v-if="drag && overColumnId === column.id && overIndex === index"
            class="vyre-kanban__placeholder"
            aria-hidden="true"
          />
          <Card
            variant="outlined"
            clickable
            :data-color="cardColor(card)"
            :class="cn(
              'vyre-kanban__card',
              dragCardId === card.id && 'vyre-kanban__card--dragging',
              'vyre-kanban__card--clickable',
            )"
            draggable="true"
            role="button"
            @dragstart="handleDragStart(column.id, card.id, $event)"
            @dragend="handleDragEnd"
            @dragover="onCardDragOver(column.id, index, $event)"
            @drop="onCardDrop(column.id, index, $event)"
            @click="onCardClick(card, column)"
            @keydown.enter.prevent="onCardClick(card, column)"
            @keydown.space.prevent="onCardClick(card, column)"
          >
            <CardBody>
              <slot name="card" :card="card" :column="column">
                <div class="vyre-kanban__card-title">{{ card.title }}</div>
                <div v-if="card.description" class="vyre-kanban__card-desc">
                  {{ card.description }}
                </div>
              </slot>
            </CardBody>
          </Card>
        </template>

        <div
          v-if="drag && overColumnId === column.id && overIndex === column.cards.length"
          class="vyre-kanban__placeholder"
          aria-hidden="true"
        />

        <div
          v-if="column.cards.length === 0 && !(drag && overColumnId === column.id && overIndex !== null)"
          class="vyre-kanban__empty"
        >
          Drop cards here
        </div>
      </div>
    </div>
  </div>
</template>
