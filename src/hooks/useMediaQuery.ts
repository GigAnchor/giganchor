"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently
 * matches, updating on change.
 *
 * `useSyncExternalStore` is used instead of "read once in an effect" so the
 * value is always consistent with the current browser state: the server
 * snapshot stays `false`, and React re-reads the real match after hydration
 * without a state update from inside an effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
