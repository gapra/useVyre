import { ref, onBeforeUnmount, type Ref } from "vue";

/**
 * Position a portaled dropdown panel against an anchor element.
 *
 * Shared by Combobox and Select: the panel opens directly below the anchor and
 * flips above it when there isn't room. Coordinates are document-space
 * (`position: absolute` + scroll offset) so the panel can live in `<body>` and
 * escape `overflow: hidden` clipping.
 *
 * The composable owns the position state + scroll/resize listeners. The caller
 * triggers `start()` after the panel renders (nextTick) and `stop()` on close,
 * inside its own open watcher — keeping outside-click and other concerns
 * separate.
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
  anchorRef: Ref<HTMLElement | null>,
  panelRef: Ref<HTMLElement | null>,
) {
  const position = ref<PortalPosition>({ top: 0, left: 0, width: 0, flip: false });

  function compute() {
    const anchor = anchorRef.value;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const panelHeight = panelRef.value?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flip = panelHeight > 0 && spaceBelow < panelHeight + GAP;
    position.value = {
      top: flip
        ? rect.top + window.scrollY - GAP - panelHeight
        : rect.bottom + window.scrollY + GAP,
      left: rect.left + window.scrollX,
      width: rect.width,
      flip,
    };
  }

  function start() {
    compute();
    // capture:true so scrolling INSIDE a Modal body is caught, not only window.
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
  }

  function stop() {
    window.removeEventListener("scroll", compute, true);
    window.removeEventListener("resize", compute);
  }

  onBeforeUnmount(stop);

  return { position, start, stop };
}
