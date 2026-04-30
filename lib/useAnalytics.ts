// lib/useAnalytics.ts
//
// Lightweight analytics hook. Components call `track(eventName, { value? })`
// and the event is fired-and-forgotten via the /api/track endpoint.
// Errors are silently swallowed — analytics must NEVER break the UX.

"use client";

import { useCallback } from "react";

export interface TrackOptions {
  // Optional breakdown value, e.g. { value: "prodigy" } when tracking ai_level_chosen
  value?: string;
}

export function useAnalytics() {
  const track = useCallback(async (eventName: string, options?: TrackOptions) => {
    try {
      // Fire-and-forget. We don't await the response in the UI thread.
      // keepalive: true ensures the request completes even if the user navigates away.
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventName,
          value: options?.value,
        }),
        keepalive: true,
      });
    } catch {
      // Swallow errors — analytics failure must not affect the user
    }
  }, []);

  return { track };
}