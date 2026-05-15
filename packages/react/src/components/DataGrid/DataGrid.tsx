/**
 * @usevyre/react — DataGrid
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  DataGrid                                    │
 * │ Import:     import { DataGrid } from "@usevyre/react"   │
 * │                                                         │
 * │ Props:                                                  │
 * │   columns      = { key: string; label: string;          │
 * │                    sortable?: boolean;                  │
 * │                    width?: string }[]                   │
 * │   rows         = Record<string, unknown>[]              │
 * │   sortKey?     = string (controlled)                    │
 * │   sortDir?     = "asc"|"desc" (controlled)              │
 * │   onSort?      = (key: string, dir: "asc"|"desc") =>    │
 * │                   void                                  │
 * │   loading?     = boolean — shows 5 skeleton rows        │
 * │   emptyText?   = string (default: "No data")            │
 * │   stickyHeader? = boolean (default: false)              │
 * │                                                         │
 * │ Sort icons: ↕ unsorted, ↑ asc, ↓ desc                  │
 * │ Intentionally excludes: filtering, pagination           │
 * │   → Use Pagination component for page navigation        │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * const [sortKey, setSortKey] = useState<string | undefined>();
 * const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
 *
 * <DataGrid
 *   columns={[
 *     { key: "name",   label: "Name",   sortable: true },
 *     { key: "email",  label: "Email",  sortable: true },
 *     { key: "status", label: "Status", width: "120px" },
 *   ]}
 *   rows={users}
 *   sortKey={sortKey}
 *   sortDir={sortDir}
 *   onSort={(key, dir) => { setSortKey(key); setSortDir(dir); }}
 *   stickyHeader
 * />
 *
 * // With Pagination (filtering/pagination intentionally out of scope)
 * <DataGrid columns={columns} rows={pageRows} loading={isLoading} />
 * <Pagination page={page} totalPages={total} onChange={setPage} />
 */

import React from "react";
import { cn } from "../../utils/cn";
import { Skeleton } from "../Skeleton/Skeleton";
import type { BaseProps } from "../../types";

export interface DataGridColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface DataGridProps extends BaseProps {
  columns: DataGridColumn[];
  rows: Record<string, unknown>[];
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string, dir: "asc" | "desc") => void;
  loading?: boolean;
  emptyText?: string;
  stickyHeader?: boolean;
}

function SortIcon({ col, sortKey, sortDir }: {
  col: DataGridColumn;
  sortKey?: string;
  sortDir?: "asc" | "desc";
}) {
  const isActive = sortKey === col.key;
  const dir = isActive ? sortDir : undefined;

  return (
    <span className="vyre-data-grid__sort-icon" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        {/* Up arrow */}
        <path
          d="M6 2v4M3.5 4.5L6 2l2.5 2.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={dir === "desc" ? 0.3 : 1}
        />
        {/* Down arrow */}
        <path
          d="M6 10V6M3.5 7.5L6 10l2.5-2.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={dir === "asc" ? 0.3 : 1}
        />
      </svg>
    </span>
  );
}

const SKELETON_ROWS = 5;

export const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps>(
  (
    {
      columns,
      rows,
      sortKey,
      sortDir,
      onSort,
      loading = false,
      emptyText = "No data",
      stickyHeader = false,
      className,
      style,
      "data-testid": testId,
    },
    ref
  ) => {
    function handleSort(col: DataGridColumn) {
      if (!col.sortable || !onSort) return;
      const newDir: "asc" | "desc" =
        sortKey === col.key && sortDir === "asc" ? "desc" : "asc";
      onSort(col.key, newDir);
    }

    function getAriaSort(col: DataGridColumn): "ascending" | "descending" | "none" {
      if (sortKey !== col.key) return "none";
      return sortDir === "asc" ? "ascending" : "descending";
    }

    return (
      <div
        ref={ref}
        className={cn(
          "vyre-data-grid",
          stickyHeader && "vyre-data-grid--sticky-header",
          className
        )}
        style={style}
        data-testid={testId}
      >
        <table className="vyre-data-grid__table">
          <thead className="vyre-data-grid__thead">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "vyre-data-grid__th",
                    col.sortable && "vyre-data-grid__th--sortable",
                    sortKey === col.key && `vyre-data-grid__th--sort-${sortDir}`
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  aria-sort={col.sortable ? getAriaSort(col) : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="vyre-data-grid__sort-btn"
                      onClick={() => handleSort(col)}
                    >
                      {col.label}
                      <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="vyre-data-grid__tbody">
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
                <tr key={`skel-${rowIdx}`} className="vyre-data-grid__row vyre-data-grid__row--skeleton">
                  {columns.map((col) => (
                    <td key={col.key} className="vyre-data-grid__td">
                      <Skeleton height={16} />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr className="vyre-data-grid__row vyre-data-grid__row--empty">
                <td
                  className="vyre-data-grid__td vyre-data-grid__empty"
                  colSpan={columns.length}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="vyre-data-grid__row">
                  {columns.map((col) => (
                    <td key={col.key} className="vyre-data-grid__td">
                      {row[col.key] != null ? String(row[col.key]) : ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

DataGrid.displayName = "VyreDataGrid";
