// app/admin/page.tsx
//
// Internal dashboard. Reads /api/admin-stats and renders charts.
//
// Auth model: a simple shared secret passed via the `?token=...` URL parameter.
// On first visit without a token, we show a password prompt.
// We persist the token in sessionStorage so a refresh doesn't require re-typing.
//
// Not bulletproof (token visible in URL/network tab), but adequate for an
// internal-only metrics page that has no destructive actions.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ============================================================
// Type — must match AdminStats from /api/admin-stats
// ============================================================
interface AdminStats {
  totals: Record<string, number>;
  breakdowns: {
    aiLevels: Record<string, number>;
    languages: Record<string, number>;
  };
  timeseries: {
    days: string[];
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

// Saffron palette tied to the rest of the product
const SAFFRON = "#e8924a";
const CREAM = "#f5f1eb";
const EMERALD = "#62a87c";
const PURPLE = "#a87cc4";

const LEVEL_COLOURS: Record<string, string> = {
  prodigy: "#62a87c",
  master: "#e8924a",
  candidate: "#a87cc4",
  champion: "#e85a5a",
};

const LANG_COLOURS: Record<string, string> = {
  en: SAFFRON,
  ru: EMERALD,
  kz: PURPLE,
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // On mount, check sessionStorage and URL for a saved token
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("token");
    const fromSession = sessionStorage.getItem("admin_token");
    const t = fromUrl || fromSession;
    if (t) setToken(t);
  }, []);

  // Whenever token changes, fetch stats
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin-stats?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (r.status === 401) {
          throw new Error("Wrong token");
        }
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        return r.json() as Promise<AdminStats>;
      })
      .then((data) => {
        setStats(data);
        sessionStorage.setItem("admin_token", token);
      })
      .catch((e: Error) => {
        setError(e.message);
        setToken(null);
        sessionStorage.removeItem("admin_token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // ============================================================
  // PASSWORD PROMPT
  // ============================================================
  if (!token) {
    return (
      <main className="min-h-screen bg-ink text-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-4">
            ◆ Admin only
          </div>
          <h1 className="font-display text-3xl mb-3">Enter dashboard token</h1>
          <p className="text-cream-muted text-sm mb-6 leading-relaxed">
            This page is private. Paste the admin token to continue.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tokenInput.trim()) {
                setToken(tokenInput.trim());
              }
            }}
            placeholder="••••••••••••••••"
            className="w-full px-4 py-3 bg-ink-2 border border-border rounded-lg text-cream placeholder:text-cream-dim focus:border-saffron focus:outline-none mono text-sm mb-4"
            autoFocus
          />
          <button
            onClick={() => tokenInput.trim() && setToken(tokenInput.trim())}
            className="w-full px-5 py-3 bg-saffron text-ink rounded-full text-sm font-medium hover:bg-cream transition-colors"
          >
            Unlock dashboard →
          </button>
          {error && (
            <p className="mt-4 text-red-400 text-sm mono">⚠ {error}</p>
          )}
          <Link
            href="/"
            className="block mt-8 text-center text-xs text-cream-dim hover:text-cream transition"
          >
            ← Back to site
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading || !stats) {
    return (
      <main className="min-h-screen bg-ink text-cream flex items-center justify-center">
        <div className="mono text-sm text-cream-muted">
          ◆ Loading analytics...
        </div>
      </main>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  // Compute total visits across the full timeseries window for hero metric
  const totalVisits = stats.timeseries.pageViews.reduce((a, b) => a + b, 0);
  const totalAiMatches = stats.timeseries.aiMatches.reduce((a, b) => a + b, 0);
  const totalCoachRuns = stats.timeseries.aiCoachStarts.reduce(
    (a, b) => a + b,
    0
  );

  // Reformat days "2026-04-29" → "Apr 29" for nicer x-axis
  const tsData = stats.timeseries.days.map((day, i) => {
    const d = new Date(day);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      day: label,
      "Page views": stats.timeseries.pageViews[i],
      "AI matches": stats.timeseries.aiMatches[i],
      "Coach runs": stats.timeseries.aiCoachStarts[i],
    };
  });

  // AI-level pie data
  const aiLevelData = Object.entries(stats.breakdowns.aiLevels).map(
    ([name, value]) => ({ name, value })
  );
  const totalLevelChoices = aiLevelData.reduce((a, b) => a + b.value, 0);

  // Languages bar data
  const langData = Object.entries(stats.breakdowns.languages).map(
    ([name, value]) => ({ name: name.toUpperCase(), value })
  );

  // Sort all events by count for the table
  const sortedEvents = Object.entries(stats.totals).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron">
          ◆ Internal dashboard
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin_token");
            setToken(null);
            setStats(null);
          }}
          className="text-xs text-cream-muted hover:text-cream transition"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14 space-y-10">
        {/* HERO METRICS */}
        <section>
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-3">
            ◆ Last 14 days
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Page views" value={totalVisits} accent />
            <MetricCard label="AI matches" value={totalAiMatches} />
            <MetricCard label="Coach reviews" value={totalCoachRuns} />
            <MetricCard
              label="Level picks"
              value={totalLevelChoices}
              hint={
                aiLevelData.length > 0
                  ? `Top: ${
                      aiLevelData.sort((a, b) => b.value - a.value)[0]?.name ??
                      "—"
                    }`
                  : ""
              }
            />
          </div>
        </section>

        {/* TIMESERIES */}
        <section className="p-6 bg-ink-2 border border-border rounded-2xl">
          <h2 className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-1">
            ◆ Engagement over time
          </h2>
          <p className="text-cream-muted text-sm mb-6">
            Daily page views, AI matches started, and Coach reviews ran.
          </p>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2520" />
                <XAxis
                  dataKey="day"
                  stroke="#8a7f74"
                  tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                />
                <YAxis
                  stroke="#8a7f74"
                  tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#14110f",
                    border: "1px solid #3a352f",
                    borderRadius: 8,
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 11,
                    paddingTop: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Page views"
                  stroke={SAFFRON}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="AI matches"
                  stroke={EMERALD}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Coach runs"
                  stroke={PURPLE}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* BREAKDOWNS — side by side */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* AI level pie */}
          <div className="p-6 bg-ink-2 border border-border rounded-2xl">
            <h2 className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-1">
              ◆ AI level distribution
            </h2>
            <p className="text-cream-muted text-sm mb-6">
              Which difficulty players choose.
            </p>
            {totalLevelChoices === 0 ? (
              <p className="text-cream-dim text-sm italic py-12 text-center">
                No level choices recorded yet.
              </p>
            ) : (
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiLevelData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 11,
                      }}
                    >
                      {aiLevelData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={LEVEL_COLOURS[entry.name] ?? CREAM}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#14110f",
                        border: "1px solid #3a352f",
                        borderRadius: 8,
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Languages bar */}
          <div className="p-6 bg-ink-2 border border-border rounded-2xl">
            <h2 className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-1">
              ◆ Language usage
            </h2>
            <p className="text-cream-muted text-sm mb-6">
              Which languages users switch to.
            </p>
            {langData.every((d) => d.value === 0) ? (
              <p className="text-cream-dim text-sm italic py-12 text-center">
                No language switches recorded yet.
              </p>
            ) : (
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={langData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2520" />
                    <XAxis
                      dataKey="name"
                      stroke="#8a7f74"
                      tick={{
                        fontSize: 11,
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    />
                    <YAxis
                      stroke="#8a7f74"
                      tick={{
                        fontSize: 11,
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#14110f",
                        border: "1px solid #3a352f",
                        borderRadius: 8,
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {langData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={LANG_COLOURS[entry.name.toLowerCase()] ?? CREAM}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* RAW EVENTS TABLE */}
        <section className="p-6 bg-ink-2 border border-border rounded-2xl">
          <h2 className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-1">
            ◆ All events
          </h2>
          <p className="text-cream-muted text-sm mb-6">
            Total counters since launch, sorted by activity.
          </p>
          {sortedEvents.length === 0 ? (
            <p className="text-cream-dim text-sm italic py-6 text-center">
              No events recorded yet. Trigger some actions on the site to
              populate.
            </p>
          ) : (
            <div className="space-y-2">
              {sortedEvents.map(([event, count]) => (
                <div
                  key={event}
                  className="flex items-center justify-between px-4 py-3 bg-ink rounded-lg border border-border"
                >
                  <span className="mono text-sm text-cream">{event}</span>
                  <span className="font-display text-2xl text-saffron">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="mono text-[10px] uppercase tracking-[0.2em] text-cream-dim text-center pb-6">
          ◆ Generated at {new Date(stats.meta.generatedAt).toLocaleString()}
        </p>
      </div>
    </main>
  );
}

// ============================================================
// SUB-COMPONENT
// ============================================================
function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border ${
        accent
          ? "bg-gradient-to-br from-ink-2 to-ink border-saffron-dim"
          : "bg-ink-2 border-border"
      }`}
    >
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-cream-muted mb-2">
        {label}
      </div>
      <div className="font-display text-3xl md:text-4xl text-cream">
        {value.toLocaleString()}
      </div>
      {hint && (
        <div className="mono text-[10px] text-cream-dim mt-2">{hint}</div>
      )}
    </div>
  );
}