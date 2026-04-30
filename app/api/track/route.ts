// app/api/track/route.ts
//
// POST /api/track
// Body: { event: string, value?: string }
//
// Records an analytics event into multiple Redis counters at once:
// - global counter for this event
// - daily counter for time-series charts
// - breakdown counter when `value` is provided (e.g. ai level)
// - membership in two sets so we can later enumerate all events / days

import { NextResponse } from "next/server";
import {
  redis,
  eventCounterKey,
  eventBreakdownKey,
  eventDailyKey,
  ALL_EVENTS_KEY,
  ALL_DAYS_KEY,
  todayUtc,
} from "@/lib/redis";

// Don't pre-render at build time — this is a dynamic POST endpoint
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface TrackBody {
  event?: string;
  value?: string;
}

// ============================================================
// Whitelist of events we accept. Prevents spam from random
// scripts hitting the endpoint with garbage event names.
// ============================================================
const ALLOWED_EVENTS = new Set([
  "page_view",
  "play_cta_clicked",
  "lobby_visited",
  "local_match_started",
  "ai_match_started",
  "ai_level_chosen",
  "ai_coach_started",
  "pricing_visited",
  "upgrade_clicked",
  "language_switched",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackBody;
    const event = body.event?.trim();
    const value = body.value?.trim();

    if (!event || !ALLOWED_EVENTS.has(event)) {
      return NextResponse.json(
        { ok: false, error: "Unknown event" },
        { status: 400 }
      );
    }

    const day = todayUtc();

    // Use a Redis pipeline so all writes go in one round-trip.
    // This keeps tracking under ~50ms even from cold starts.
    const pipeline = redis.pipeline();

    // Total counter for this event
    pipeline.incr(eventCounterKey(event));

    // Per-day counter for time-series
    pipeline.incr(eventDailyKey(event, day));

    // Breakdown counter (e.g. ai_level_chosen → which level)
    if (value) {
      // Sanitise — values become part of Redis key, no whitespace allowed
      const safeValue = value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
      pipeline.incr(eventBreakdownKey(event, safeValue));
    }

    // Track which event names + days we've ever seen, for enumeration later
    pipeline.sadd(ALL_EVENTS_KEY, event);
    pipeline.sadd(ALL_DAYS_KEY, day);

    await pipeline.exec();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("track error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}