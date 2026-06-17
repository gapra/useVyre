import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect that is SSR-safe.
 *
 * React's `useLayoutEffect` logs a warning when it runs during server rendering,
 * because layout effects can't run on the server. On the server there is no DOM
 * to measure anyway, so we fall back to `useEffect` (a no-op until hydration);
 * in the browser we use the real `useLayoutEffect` so DOM measurements happen
 * before paint (no flicker). This is the standard isomorphic pattern.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
