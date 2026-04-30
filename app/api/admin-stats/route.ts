// app/api/admin-stats/route.ts
//
// GET /api/admin-stats?token=...
//
// Returns aggregated analytics for the admin dashboard:
// - totals per event
// - breakdowns (e.g. AI level distribution)
// - 14-day time series for time-based events
//
// Protected by a simple shared secret in the ADMIN_TOKEN env variable.
// Not bulletproof auth, but enough to prevent casual leaks.

import { NextResponse } from "next/server";
import {
  redis,
  eventCounterKey,
  eventBreakdownKey,
  eventDailyKey,
  ALL_EVENTS_KEY,
  ALL_DAYS_KEY,
} from "@/lib/redis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================
// Response shape — kept here as the contract between API + UI
// ============================================================
export interface AdminStats {
  totals: Record<string, number>;
  breakdowns: {
    aiLevels: Record<string, number>;
    languages: Record<string, number>;
  };
  timeseries: {
    days: string[]; // YYYY-MM-DD, sorted ascending
    pageViews: number[];
    aiMatches: number[];
    aiCoachStarts: number[];
  };
  meta: {
    knownEvents: string[];
    knownDays: string[];
    generatedAt: string;
  };
}

export async function GET(request: Request) {
  // ----- 1. Auth check -----
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_TOKEN not configured" },
      { status: 500 }
    );
  }
  if (token !== expected) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ----- 2. Enumerate known events + days -----
    const [eventNames, dayList] = await Promise.all([
      redis.smembers(ALL_EVENTS_KEY) as Promise<string[]>,
      redis.smembers(ALL_DAYS_KEY) as Promise<string[]>,
    ]);

    // ----- 3. Fetch totals for every known event in one pipeline -----
    const totals: Record<string, number> = {};
    if (eventNames.length > 0) {
      const totalsPipeline = redis.pipeline();
      eventNames.forEach((event) => {
        totalsPipeline.get(eventCounterKey(event));
      });
      const totalsResults = (await totalsPipeline.exec()) as (
        | string
        | number
        | null
      )[];
      eventNames.forEach((event, i) => {
        totals[event] = Number(totalsResults[i] ?? 0);
      });
    }

    // ----- 4. AI level breakdown -----
    // We only know the levels we've explicitly trained the app to send.
    const aiLevelKeys = ["prodigy", "master", "candidate", "champion"];
    const aiLevels: Record<string, number> = {};
    {
      const pipe = redis.pipeline();
      aiLevelKeys.forEach((lvl) =>
        pipe.get(eventBreakdownKey("ai_level_chosen", lvl))
      );
      const res = (await pipe.exec()) as (string | number | null)[];
      aiLevelKeys.forEach((lvl, i) => {
        aiLevels[lvl] = Number(res[i] ?? 0);
      });
    }

    // ----- 5. Language breakdown -----
    const langKeys = ["en", "ru", "kz"];
    const languages: Record<string, number> = {};
    {
      const pipe = redis.pipeline();
      langKeys.forEach((lng) =>
        pipe.get(eventBreakdownKey("language_switched", lng))
      );
      const res = (await pipe.exec()) as (string | number | null)[];
      langKeys.forEach((lng, i) => {
        languages[lng] = Number(res[i] ?? 0);
      });
    }

    // ----- 6. Time series — last 14 days -----
    // Build an array of the last 14 days (UTC), regardless of whether
    // each day has data. Missing days = 0, so the chart line is continuous.
    const days: string[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(now.getUTCDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    // Pull counts for 3 events × 14 days = 42 keys in one pipeline
    const tsPipeline = redis.pipeline();
    days.forEach((d) => tsPipeline.get(eventDailyKey("page_view", d)));
    days.forEach((d) => tsPipeline.get(eventDailyKey("ai_match_started", d)));
    days.forEach((d) => tsPipeline.get(eventDailyKey("ai_coach_started", d)));
    const tsResults = (await tsPipeline.exec()) as (string | number | null)[];

    const pageViews = days.map((_, i) => Number(tsResults[i] ?? 0));
    const aiMatches = days.map((_, i) => Number(tsResults[14 + i] ?? 0));
    const aiCoachStarts = days.map((_, i) => Number(tsResults[28 + i] ?? 0));

    // ----- 7. Assemble response -----
    const response: AdminStats = {
      totals,
      breakdowns: {
        aiLevels,
        languages,
      },
      timeseries: {
        days,
        pageViews,
        aiMatches,
        aiCoachStarts,
      },
      meta: {
        knownEvents: eventNames.sort(),
        knownDays: dayList.sort(),
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("admin-stats error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}