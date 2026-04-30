// lib/redis.ts
//
// Single Redis client used across all API routes.
// Reads credentials from Vercel KV / Upstash env vars (auto-injected
// when the database is connected to the project).

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ============================================================
// Event helpers — keep all key naming centralised here so the
// schema is easy to evolve.
// ============================================================

// Counter for a single event name (e.g. "page_view", "game_started")
export const eventCounterKey = (event: string) => `events:total:${event}`;

// Counter for an event broken down by parameter (e.g. AI level: prodigy/master/...)
export const eventBreakdownKey = (event: string, value: string) =>
  `events:breakdown:${event}:${value}`;

// Counter per-day for time-series charts (YYYY-MM-DD)
export const eventDailyKey = (event: string, day: string) =>
  `events:daily:${event}:${day}`;

// Set of all unique event names we've ever seen — used to enumerate them later
export const ALL_EVENTS_KEY = "events:names";

// Set of all unique days we've ever recorded — for time-series enumeration
export const ALL_DAYS_KEY = "events:days";

// ============================================================
// Helper: today as YYYY-MM-DD in UTC
// ============================================================
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}