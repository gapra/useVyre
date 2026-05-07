/**
 * @usevyre/react — Table
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Table + TableHead + TableBody + TableRow +  │
 * │             TableHeader + TableCell + TableCaption      │
 * │ Import:     import { Table, TableHead, TableBody,       │
 * │             TableRow, TableHeader, TableCell,           │
 * │             TableCaption } from "@usevyre/react"           │
 * │                                                         │
 * │ Table props:                                            │
 * │   striped  = boolean (default: false)                   │
 * │   bordered = boolean (default: false)                   │
 * │   compact  = boolean (default: false)                   │
 * │   hoverable = boolean (default: true)                   │
 * │                                                         │
 * │ TableHeader props (th):                                 │
 * │   sortable    = boolean                                 │
 * │   sortDir     = "asc"|"desc"|null                       │
 * │   onSort      = () => void                              │
 * │   align       = "left"(default)|"center"|"right"        │
 * │                                                         │
 * │ TableCell props (td):                                   │
 * │   align       = "left"(default)|"center"|"right"        │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Table>
 *   <TableHead>
 *     <TableRow>
 *       <TableHeader sortable sortDir="asc" onSort={() => handleSort("name")}>Name</TableHeader>
 *       <TableHeader>Email</TableHeader>
 *       <TableHeader align="right">Status</TableHeader>
 *     </TableRow>
 *   </TableHead>
 *   <TableBody>
 *     {rows.map((row) => (
 *       <TableRow key={row.id}>
 *         <TableCell>{row.name}</TableCell>
 *         <TableCell>{row.email}</TableCell>
 *         <TableCell align="right"><Badge variant="success">{row.status}</Badge></TableCell>
 *       </TableRow>
 *     ))}
 *   </TableBody>
 * </Table>
 */

import React from "react";
import { cn } from "../../utils/cn";

// ── Table ──────────────────────────────────────────────────────

export interface TableProps {
  children: React.ReactNode;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  striped   = false,
  bordered  = false,
  compact   = false,
  hoverable = true,
  className,
}) => (
  <div className="vyre-table-wrapper">
    <table
      className={cn(
        "vyre-table",
        striped   && "vyre-table--striped",
        bordered  && "vyre-table--bordered",
        compact   && "vyre-table--compact",
        hoverable && "vyre-table--hoverable",
        className
      )}
    >
      {children}
    </table>
  </div>
);
Table.displayName = "VyreTable";

// ── TableHead ──────────────────────────────────────────────────

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("vyre-table__head", className)} {...props} />
));
TableHead.displayName = "VyreTableHead";

// ── TableBody ──────────────────────────────────────────────────

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("vyre-table__body", className)} {...props} />
));
TableBody.displayName = "VyreTableBody";

// ── TableRow ───────────────────────────────────────────────────

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("vyre-table__row", selected && "vyre-table__row--selected", className)}
      aria-selected={selected}
      {...props}
    />
  )
);
TableRow.displayName = "VyreTableRow";

// ── TableHeader (th) ───────────────────────────────────────────

export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDir?: "asc" | "desc" | null;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}

const SortIcon: React.FC<{ dir: "asc" | "desc" | null }> = ({ dir }) => (
  <span className="vyre-table__sort-icon" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 2v8M3 5l3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={dir === "desc" ? 0.3 : 1}
      />
      <path
        d="M3 7l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={dir === "asc" ? 0.3 : 1}
      />
    </svg>
  </span>
);

export const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ className, sortable, sortDir = null, onSort, align = "left", children, ...props }, ref) => {
    if (sortable) {
      return (
        <th
          ref={ref}
          className={cn(
            "vyre-table__th vyre-table__th--sortable",
            `vyre-table__th--${align}`,
            sortDir && `vyre-table__th--sort-${sortDir}`,
            className
          )}
          aria-sort={sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"}
          {...props}
        >
          <button className="vyre-table__sort-btn" onClick={onSort} type="button">
            {children}
            <SortIcon dir={sortDir} />
          </button>
        </th>
      );
    }
    return (
      <th
        ref={ref}
        className={cn("vyre-table__th", `vyre-table__th--${align}`, className)}
        {...props}
      >
        {children}
      </th>
    );
  }
);
TableHeader.displayName = "VyreTableHeader";

// ── TableCell (td) ─────────────────────────────────────────────

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = "left", ...props }, ref) => (
    <td
      ref={ref}
      className={cn("vyre-table__td", `vyre-table__td--${align}`, className)}
      {...props}
    />
  )
);
TableCell.displayName = "VyreTableCell";

// ── TableCaption ───────────────────────────────────────────────

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("vyre-table__caption", className)} {...props} />
));
TableCaption.displayName = "VyreTableCaption";
