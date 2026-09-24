"use client";

import { useCallback, useSyncExternalStore } from "react";

/* The server has no viewport, so every query starts out false and corrects
   itself on hydration. That keeps markup identical between server and client. */
const serverSnapshot = () => false;

/**
 * Subscribes to a CSS media query the way React wants external state read —
 * no state-in-effect, no hydration mismatch, and it stays live if the user
 * changes their OS motion setting mid-visit.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}

/** True only on a real mouse, and only if motion is welcome. */
export function usePointerFine(): boolean {
  const fine = useMediaQuery("(pointer: fine)");
  const calm = useMediaQuery("(prefers-reduced-motion: reduce)");
  return fine && !calm;
}

/**
 * Hydration-safe reduced-motion check.
 *
 * Motion's own `useReducedMotion()` reads matchMedia during the first client
 * render, so a visitor with reduced motion enabled gets client markup that
 * disagrees with the server's — React reports a hydration mismatch and throws
 * the tree away. Going through `useSyncExternalStore` means the hydrating
 * render matches the server (false), then corrects itself immediately after.
 */
export function useCalmMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
