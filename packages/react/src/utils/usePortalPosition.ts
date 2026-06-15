import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Position a portaled dropdown panel against an anchor element.
 *
 * Shared by Combobox and Select: the panel opens directly below the anchor and
 * flips above it when there isn't room. Coordinates are document-space
 * (`position: absolute` + scroll offset) so the panel can live in `<body>` and
 * escape `overflow: hidden` clipping. Recomputes on scroll (capture, to catch
 * scrolling inside a Modal body) and resize while open.
 *
 * Not used by Tooltip (4-way placement) or DropdownMenu (start/end variants) —
 * those have genuinely different placement rules and keep their own logic.
 */

const GAP = 4;

export interface PortalPosition {
  top: number;
  left: number;
  width: number;
  /** true when the panel was flipped above the anchor (no room below). */
  flip: boolean;
}

export function usePortalPosition(
  anchorRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
  disablePortal: boolean,
  // Extra reactive values that should trigger a recompute (e.g. search text,
  // highlighted index) — the panel size can change as content changes.
  deps: ReadonlyArray<unknown> = [],
): PortalPosition {
  const [position, setPosition] = useState<PortalPosition>({
    top: 0,
    left: 0,
    width: 0,
    flip: false,
  });

  useLayoutEffect(() => {
    if (!open || disablePortal) return;
    const compute = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const panelHeight = panelRef.current?.offsetHeight ?? 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const flip = panelHeight > 0 && spaceBelow < panelHeight + GAP;
      setPosition({
        top: flip
          ? rect.top + window.scrollY - GAP - panelHeight
          : rect.bottom + window.scrollY + GAP,
        left: rect.left + window.scrollX,
        width: rect.width,
        flip,
      });
    };
    compute();
    // capture:true so scrolling INSIDE a Modal body is caught, not only window.
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, disablePortal, ...deps]);

  return position;
}
