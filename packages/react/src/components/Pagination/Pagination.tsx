/**
 * @vyre/react — Pagination
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  Pagination                                  │
 * │ Import:     import { Pagination } from "@vyre/react"    │
 * │                                                         │
 * │ Props:                                                  │
 * │   page         = number (current page, 1-indexed)       │
 * │   totalPages   = number                                 │
 * │   onPageChange = (page: number) => void                 │
 * │   siblings     = number (pages shown each side, default 1)│
 * │   showEdges    = boolean (show first/last, default true) │
 * │   totalItems   = number (total records, enables info)   │
 * │   pageSize     = number (records per page, enables info)│
 * │   showInfo     = boolean (show "Showing x–y of z")      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Pagination
 *   page={currentPage}
 *   totalPages={20}
 *   onPageChange={setCurrentPage}
 * />
 *
 * // With info label
 * <Pagination
 *   page={2} totalPages={10} onPageChange={setPage}
 *   showInfo totalItems={98} pageSize={10}
 * />
 */

import React from "react";
import { cn } from "../../utils/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  showEdges?: boolean;
  showInfo?: boolean;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

function getRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(page: number, total: number, siblings: number): (number | "...")[] {
  const totalShown = siblings * 2 + 5; // siblings + current + 2 edges + 2 dots max

  if (total <= totalShown) return getRange(1, total);

  const leftSib  = Math.max(page - siblings, 2);
  const rightSib = Math.min(page + siblings, total - 1);
  const showLeft  = leftSib  > 2;
  const showRight = rightSib < total - 1;

  const pages: (number | "...")[] = [1];
  if (showLeft) pages.push("...");
  pages.push(...getRange(leftSib, rightSib));
  if (showRight) pages.push("...");
  pages.push(total);

  return pages;
}

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronsLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 2L2 7l5 5M12 2L7 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronsRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 2l5 5-5 5M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  showEdges = true,
  showInfo = false,
  totalItems,
  pageSize,
  className,
}) => {
  const pages = buildPages(page, totalPages, siblings);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const infoLabel = React.useMemo(() => {
    if (!showInfo) return null;
    if (totalItems != null && pageSize != null) {
      const from = (page - 1) * pageSize + 1;
      const to   = Math.min(page * pageSize, totalItems);
      return `Showing ${from}–${to} of ${totalItems}`;
    }
    return `Page ${page} of ${totalPages}`;
  }, [showInfo, page, totalPages, totalItems, pageSize]);

  const controls = (
    <>
      {showEdges && (
        <button
          className="vyre-pagination__nav"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          aria-label="First page"
        >
          <ChevronsLeft />
        </button>
      )}
      <button
        className="vyre-pagination__nav"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      <ol className="vyre-pagination__list">
        {pages.map((p, i) =>
          p === "..." ? (
            <li key={`dots-${i}`}>
              <span className="vyre-pagination__dots" aria-hidden="true">···</span>
            </li>
          ) : (
            <li key={p}>
              <button
                className={cn(
                  "vyre-pagination__btn",
                  p === page && "vyre-pagination__btn--active"
                )}
                onClick={() => onPageChange(p as number)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ol>

      <button
        className="vyre-pagination__nav"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
      {showEdges && (
        <button
          className="vyre-pagination__nav"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          aria-label="Last page"
        >
          <ChevronsRight />
        </button>
      )}
    </>
  );

  if (showInfo) {
    return (
      <div className={cn("vyre-pagination-row", className)}>
        <span className="vyre-pagination__info">{infoLabel}</span>
        <nav aria-label="Pagination" className="vyre-pagination">{controls}</nav>
      </div>
    );
  }

  return (
    <nav aria-label="Pagination" className={cn("vyre-pagination", className)}>
      {controls}
    </nav>
  );
};
Pagination.displayName = "VyrePagination";
