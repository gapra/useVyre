/**
 * @usevyre/react — Kanban
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  Kanban (board with drag-and-drop between columns)    │
 * │ Import:     import { Kanban } from "@usevyre/react"              │
 * │                                                                  │
 * │ CONTROLLED & data-driven (like DataGrid). No internal data       │
 * │ state — you own `value`, update it in `onChange`.                │
 * │                                                                  │
 * │ Props:                                                           │
 * │   value      = KanbanColumn[]  (required, controlled)            │
 * │   onChange   = (next: KanbanColumn[]) => void  (required)        │
 * │   renderCard?= (card, column) => ReactNode  (custom card body)   │
 * │   onCardClick? = (card, column) => void                          │
 * │   className? = string                                            │
 * │                                                                  │
 * │ KanbanColumn = { id; title; cards: KanbanCard[];                 │
 * │                  color?: KanbanColor }                            │
 * │ KanbanCard   = { id; title; description?;                        │
 * │                  color?: KanbanColor }                            │
 * │ KanbanColor  = "default" | "accent" | "teal" |                   │
 * │                "success" | "warning" | "danger"                  │
 * │   → tints the column/card background (token-based).              │
 * │                                                                  │
 * │ Drag a card to another column (or reorder within a column);      │
 * │ Kanban calls onChange with the next columns array. While         │
 * │ dragging, a placeholder shows the exact drop position. Card      │
 * │ ids must be unique across the whole board.                        │
 * │                                                                  │
 * │ Each card is wrapped in a <Card> (variant="outlined"); the       │
 * │ default body is title + description, but renderCard can return   │
 * │ ANY content — including complex components (avatars, badges,     │
 * │ progress) — placed inside the Card's body.                       │
 * │                                                                  │
 * │ Native HTML5 drag-and-drop — zero dependencies.                  │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [columns, setColumns] = useState<KanbanColumn[]>([
 *   { id: "todo",  title: "To Do",       cards: [{ id: "1", title: "Spec API" }] },
 *   { id: "doing", title: "In Progress", cards: [] },
 *   { id: "done",  title: "Done",        cards: [{ id: "2", title: "Kickoff" }] },
 * ]);
 * <Kanban value={columns} onChange={setColumns} />
 */

import React, { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Card, CardBody } from "../Card/Card";
import type { BaseProps } from "../../types";

/** Semantic tint applied to a column or card background. */
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

export interface KanbanProps extends BaseProps {
  /** Controlled board data. */
  value: KanbanColumn[];
  /** Called with the next columns array after any drag move. */
  onChange: (next: KanbanColumn[]) => void;
  /** Custom card body renderer. Defaults to title + optional description. */
  renderCard?: (card: KanbanCard, column: KanbanColumn) => React.ReactNode;
  /** Called when a card is clicked (not fired while dragging). */
  onCardClick?: (card: KanbanCard, column: KanbanColumn) => void;
}

interface DragState {
  cardId: string;
  fromColumnId: string;
}

function moveCard(
  columns: KanbanColumn[],
  drag: DragState,
  toColumnId: string,
  toIndex: number
): KanbanColumn[] {
  const fromCol = columns.find((c) => c.id === drag.fromColumnId);
  if (!fromCol) return columns;
  const card = fromCol.cards.find((c) => c.id === drag.cardId);
  if (!card) return columns;

  return columns.map((col) => {
    if (col.id === drag.fromColumnId && col.id === toColumnId) {
      // Reorder within the same column.
      const without = col.cards.filter((c) => c.id !== drag.cardId);
      const insertAt = Math.max(0, Math.min(toIndex, without.length));
      const next = [...without];
      next.splice(insertAt, 0, card);
      return { ...col, cards: next };
    }
    if (col.id === drag.fromColumnId) {
      return { ...col, cards: col.cards.filter((c) => c.id !== drag.cardId) };
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

export const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({ value, onChange, renderCard, onCardClick, className, ...props }, ref) => {
    const dragRef = useRef<DragState | null>(null);
    const movedRef = useRef(false);
    const [dragCardId, setDragCardId] = useState<string | null>(null);
    const [overColumnId, setOverColumnId] = useState<string | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const setDropTarget = (columnId: string, index: number) => {
      setOverColumnId((id) => (id === columnId ? id : columnId));
      setOverIndex((i) => (i === index ? i : index));
    };

    const handleDragStart =
      (columnId: string, cardId: string) =>
      (e: React.DragEvent) => {
        dragRef.current = { cardId, fromColumnId: columnId };
        movedRef.current = false;
        setDragCardId(cardId);
        e.dataTransfer.effectAllowed = "move";
        // Firefox requires data to be set for DnD to initiate.
        e.dataTransfer.setData("text/plain", cardId);
      };

    const handleDragEnd = () => {
      dragRef.current = null;
      setDragCardId(null);
      setOverColumnId(null);
      setOverIndex(null);
    };

    const commitMove = (toColumnId: string, toIndex: number) => {
      const drag = dragRef.current;
      if (!drag) return;
      const next = moveCard(value, drag, toColumnId, toIndex);
      if (next !== value) {
        movedRef.current = true;
        onChange(next);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("vyre-kanban", className)}
        role="list"
        aria-label="Kanban board"
        {...props}
      >
        {value.map((column) => {
          const isOver = overColumnId === column.id;
          const colColor = column.color && column.color !== "default"
            ? column.color
            : undefined;
          const placeholderAt =
            isOver && dragRef.current && overIndex !== null
              ? overIndex
              : null;

          const Placeholder = (
            <div
              className="vyre-kanban__placeholder"
              aria-hidden="true"
            />
          );

          return (
            <div
              key={column.id}
              role="listitem"
              data-color={colColor}
              className={cn(
                "vyre-kanban__column",
                isOver && "vyre-kanban__column--over"
              )}
              onDragOver={(e) => {
                if (!dragRef.current) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                // Hovering the column shell (below the cards) → append.
                setDropTarget(column.id, column.cards.length);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setOverColumnId((id) => (id === column.id ? null : id));
                  setOverIndex(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                commitMove(
                  column.id,
                  overIndex ?? column.cards.length
                );
                handleDragEnd();
              }}
            >
              <div className="vyre-kanban__column-header">
                <span className="vyre-kanban__column-title">{column.title}</span>
                <span className="vyre-kanban__column-count">
                  {column.cards.length}
                </span>
              </div>

              <div className="vyre-kanban__cards">
                {column.cards.map((card, index) => {
                  const cardColor =
                    card.color && card.color !== "default"
                      ? card.color
                      : undefined;
                  return (
                    <React.Fragment key={card.id}>
                      {placeholderAt === index && Placeholder}
                      <Card
                        variant="outlined"
                        data-color={cardColor}
                        className={cn(
                          "vyre-kanban__card",
                          dragCardId === card.id &&
                            "vyre-kanban__card--dragging",
                          onCardClick && "vyre-kanban__card--clickable"
                        )}
                        draggable
                        role={onCardClick ? "button" : undefined}
                        tabIndex={onCardClick ? 0 : undefined}
                        onDragStart={handleDragStart(column.id, card.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => {
                          if (!dragRef.current) return;
                          e.preventDefault();
                          e.stopPropagation();
                          // Insert before this card if hovering its top
                          // half, otherwise after it.
                          const rect =
                            e.currentTarget.getBoundingClientRect();
                          const after =
                            e.clientY - rect.top > rect.height / 2;
                          setDropTarget(
                            column.id,
                            after ? index + 1 : index
                          );
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          commitMove(
                            column.id,
                            overIndex ?? index
                          );
                          handleDragEnd();
                        }}
                        onClick={() => {
                          if (movedRef.current) return;
                          onCardClick?.(card, column);
                        }}
                        onKeyDown={(e) => {
                          if (
                            onCardClick &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            onCardClick(card, column);
                          }
                        }}
                      >
                        <CardBody>
                          {renderCard ? (
                            renderCard(card, column)
                          ) : (
                            <>
                              <div className="vyre-kanban__card-title">
                                {card.title}
                              </div>
                              {card.description && (
                                <div className="vyre-kanban__card-desc">
                                  {card.description}
                                </div>
                              )}
                            </>
                          )}
                        </CardBody>
                      </Card>
                    </React.Fragment>
                  );
                })}

                {placeholderAt === column.cards.length && Placeholder}

                {column.cards.length === 0 && placeholderAt === null && (
                  <div className="vyre-kanban__empty">Drop cards here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Kanban.displayName = "VyreKanban";
