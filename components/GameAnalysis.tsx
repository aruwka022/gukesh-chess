"use client";

import { useState, useEffect } from "react";
import {
  useGameAnalysis,
  type AnalysedMove,
  type MoveQuality,
} from "@/lib/useGameAnalysis";
import { useTranslation } from "@/lib/LanguageContext";
import { useAnalytics } from "@/lib/useAnalytics";

interface GameAnalysisProps {
  history: string[];
  playerColor?: "w" | "b" | "both";
}

const QUALITY_STYLES: Record<MoveQuality, { dot: string; label: string }> = {
  brilliant: { dot: "bg-emerald", label: "text-emerald" },
  good: { dot: "bg-cream-muted", label: "text-cream" },
  inaccuracy: { dot: "bg-yellow-500", label: "text-yellow-500" },
  mistake: { dot: "bg-orange-500", label: "text-orange-400" },
  blunder: { dot: "bg-red-600", label: "text-red-500" },
};

export default function GameAnalysis({
  history,
  playerColor = "both",
}: GameAnalysisProps) {
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const { analysis, progress, isAnalysing, analyseGame, reset } =
    useGameAnalysis();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (analysis !== null) reset();
    setHasStarted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length === 0]);

  const handleAnalyse = () => {
    setHasStarted(true);
    track("ai_coach_started");
    analyseGame(history);
  };

  // EMPTY STATE
  if (history.length === 0) {
    return (
      <div className="p-5 bg-ink-2 border border-border rounded-xl">
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
          {t("coach.label")}
        </div>
        <p className="text-sm text-cream-muted leading-relaxed">
          {t("coach.emptyState")}
        </p>
      </div>
    );
  }

  // BUTTON STATE
  if (!hasStarted) {
    return (
      <div className="p-5 bg-gradient-to-br from-ink-2 to-ink rounded-xl border border-border-strong">
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
          {t("coach.label")}
        </div>
        <p className="text-sm text-cream-muted leading-relaxed mb-4">
          {t("coach.cta")}
        </p>
        <button
          onClick={handleAnalyse}
          className="w-full px-5 py-3 bg-saffron text-ink rounded-full text-sm font-medium hover:bg-cream transition-colors"
        >
          {t("coach.analyse")}
        </button>
      </div>
    );
  }

  // ANALYSING STATE
  if (isAnalysing && (!analysis || analysis.length < history.length)) {
    return (
      <div className="p-5 bg-ink-2 border border-saffron/40 rounded-xl">
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
          {t("coach.analysing")}
        </div>
        <div className="w-full h-1.5 bg-ink-3 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-saffron transition-all duration-300"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mono text-[10px] uppercase tracking-[0.2em] text-cream-dim">
          {Math.round(progress * 100)}% · {analysis?.length ?? 0} /{" "}
          {history.length}
        </p>
      </div>
    );
  }

  // RESULTS
  if (!analysis || analysis.length === 0) return null;

  const filtered =
    playerColor === "both"
      ? analysis
      : analysis.filter((m) => m.color === playerColor);

  const counts: Record<MoveQuality, number> = {
    brilliant: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
  };
  for (const m of filtered) counts[m.quality]++;

  return (
    <div className="p-5 bg-ink-2 border border-border rounded-xl space-y-5">
      <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron">
        {t("coach.results")}
      </div>

      <div className="grid grid-cols-5 gap-2">
        <StatBlock count={counts.brilliant} label={t("coach.quality.brilliant")} colorClass="text-emerald" />
        <StatBlock count={counts.good} label={t("coach.quality.good")} colorClass="text-cream" />
        <StatBlock count={counts.inaccuracy} label={t("coach.quality.inaccuracy")} colorClass="text-yellow-500" />
        <StatBlock count={counts.mistake} label={t("coach.quality.mistake")} colorClass="text-orange-400" />
        <StatBlock count={counts.blunder} label={t("coach.quality.blunder")} colorClass="text-red-500" />
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-2">
          {t("coach.notableMoves")}
        </div>
        {filtered
          .filter(
            (m) =>
              m.quality === "inaccuracy" ||
              m.quality === "mistake" ||
              m.quality === "blunder"
          )
          .map((move, i) => (
            <MoveRow key={i} move={move} t={t} />
          ))}
        {filtered.every(
          (m) => m.quality === "brilliant" || m.quality === "good"
        ) && (
          <p className="text-xs text-cream-muted italic px-2 py-3">
            {t("coach.cleanGame")}
          </p>
        )}
      </div>
    </div>
  );
}

function StatBlock({
  count,
  label,
  colorClass,
}: {
  count: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="text-center p-2 bg-ink rounded-lg border border-border">
      <div className={`font-display text-2xl ${colorClass}`}>{count}</div>
      <div className="mono text-[9px] uppercase tracking-[0.15em] text-cream-dim mt-1">
        {label}
      </div>
    </div>
  );
}

function MoveRow({
  move,
  t,
}: {
  move: AnalysedMove;
  t: (key: string) => string;
}) {
  const style = QUALITY_STYLES[move.quality];
  const moveLabel = `${move.moveNumber}${move.color === "w" ? "." : "..."}`;
  const bestReadable = move.uciBest
    ? `${move.uciBest.slice(0, 2)} → ${move.uciBest.slice(2, 4)}`
    : null;

  return (
    <div className="px-3 py-2.5 bg-ink rounded-lg border border-border flex items-start gap-3">
      <span className={`w-2 h-2 rounded-full ${style.dot} flex-shrink-0 mt-1.5`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mono text-sm">
          <span className="text-cream-dim">{moveLabel}</span>
          <span className="text-cream">{move.san}</span>
          <span className={`text-[10px] uppercase tracking-[0.15em] ${style.label}`}>
            {t(`coach.quality.${move.quality}`)}
          </span>
        </div>
        {bestReadable &&
          move.quality !== "brilliant" &&
          move.quality !== "good" && (
            <div className="mt-1 mono text-[11px] text-cream-muted">
              {t("coach.bestWas")}:{" "}
              <span className="text-emerald">{bestReadable}</span>
            </div>
          )}
      </div>
      <span className="mono text-[10px] text-cream-dim flex-shrink-0 mt-1.5">
        −{move.cpLost}cp
      </span>
    </div>
  );
}