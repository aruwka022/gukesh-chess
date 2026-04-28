// components/ChessBoard.tsx
//
// Presentational chess board component.
// Receives game state via props from the page.
// Translates ALL UI text using useTranslation().

"use client";

import { useMemo } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useTranslation } from "@/lib/LanguageContext";

interface ChessBoardProps {
  fen: string;
  turn: "w" | "b";
  history: string[];
  // Translation key (e.g. "board.statuses.checkmateWhite") or "" for no status
  statusKey: string;
  lastMove: { from: string; to: string } | null;
  selectedSquare: Square | null;
  legalTargets: Square[];

  onPieceDrop: (from: string, to: string) => boolean;
  onSquareClick: (square: Square) => void;
  onUndo: () => void;
  onReset: () => void;

  // AI mode extras
  aiThinking?: boolean;
  // Translated opponent label (e.g. "Champion" / "Чемпион" / "Чемпион")
  // Already localised by the parent — we just display it.
  opponentLabel?: string;
}

export default function ChessBoard({
  fen,
  turn,
  history,
  statusKey,
  lastMove,
  selectedSquare,
  legalTargets,
  onPieceDrop,
  onSquareClick,
  onUndo,
  onReset,
  aiThinking = false,
  opponentLabel,
}: ChessBoardProps) {
  const { t } = useTranslation();

  const positionForLookup = useMemo(() => new Chess(fen), [fen]);

  const movePairs = useMemo(() => {
    const pairs: Array<[string, string?]> = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push([history[i], history[i + 1]]);
    }
    return pairs;
  }, [history]);

  // Square highlight styles
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (lastMove) {
      styles[lastMove.from] = { background: "rgba(232, 146, 74, 0.35)" };
      styles[lastMove.to] = { background: "rgba(232, 146, 74, 0.5)" };
    }

    if (selectedSquare) {
      styles[selectedSquare] = {
        background: "rgba(232, 146, 74, 0.55)",
        boxShadow: "inset 0 0 0 3px rgba(232, 146, 74, 0.9)",
      };
    }

    for (const target of legalTargets) {
      const piece = positionForLookup.get(target);
      if (piece) {
        styles[target] = {
          background:
            "radial-gradient(circle, transparent 0%, transparent 65%, rgba(91, 139, 122, 0.55) 65%, rgba(91, 139, 122, 0.55) 80%, transparent 80%)",
        };
      } else {
        styles[target] = {
          background:
            "radial-gradient(circle, rgba(91, 139, 122, 0.55) 18%, transparent 22%)",
        };
      }
    }

    return styles;
  }, [lastMove, selectedSquare, legalTargets, positionForLookup]);

  // Resolve the localised status text from its key
  const localisedStatus = statusKey ? t(statusKey) : "";

  // Top-of-board label
  const turnLabel = (() => {
    if (localisedStatus) return localisedStatus;
    if (aiThinking) return t("board.engineThinking");
    if (opponentLabel) {
      return turn === "w"
        ? t("board.yourMove")
        : `${opponentLabel} ${t("board.toMoveSuffix")}`;
    }
    return turn === "w" ? t("board.whiteToMove") : t("board.blackToMove");
  })();

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">
      {/* ============== BOARD COLUMN ============== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
            ◆ {turnLabel}
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
            {t("board.moveLabel")} {Math.floor(history.length / 2) + 1}
          </div>
        </div>

        <div className="bg-ink-2 p-3 rounded-2xl border border-border max-w-[640px] relative">
          <Chessboard
            position={fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customBoardStyle={{
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            customDarkSquareStyle={{ backgroundColor: "var(--square-dark)" }}
            customLightSquareStyle={{ backgroundColor: "var(--square-light)" }}
            customSquareStyles={customSquareStyles}
            animationDuration={200}
          />

          {aiThinking && (
            <div className="absolute top-5 right-5 px-3 py-1.5 bg-ink/85 border border-saffron/40 rounded-full backdrop-blur-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-saffron">
                {t("board.thinking")}
              </span>
            </div>
          )}
        </div>

        <p className="mt-3 mono text-[10px] uppercase tracking-[0.2em] text-cream-dim">
          {t("board.hint")}
        </p>

        {localisedStatus && (
          <div className="mt-6 px-5 py-4 bg-ink-2 border border-saffron/40 rounded-xl max-w-[640px]">
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-1">
              {t("board.statusLabel")}
            </div>
            <div className="font-display text-xl leading-tight">
              {localisedStatus}
            </div>
          </div>
        )}
      </div>

      {/* ============== SIDE PANEL ============== */}
      <aside className="space-y-6">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-3">
            {t("board.history.label")}
          </div>
          <div className="bg-ink-2 border border-border rounded-xl p-5 max-h-[420px] overflow-y-auto scrollbar-thin">
            {movePairs.length === 0 ? (
              <p className="text-cream-muted text-sm italic">
                {t("board.history.empty")}
              </p>
            ) : (
              <div className="space-y-1.5">
                {movePairs.map((pair, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[2.5rem_1fr_1fr] gap-3 mono text-sm"
                  >
                    <span className="text-cream-dim">{i + 1}.</span>
                    <span className="text-cream">{pair[0]}</span>
                    <span className="text-cream">{pair[1] ?? ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onUndo}
            disabled={history.length === 0 || aiThinking}
            className="px-5 py-3 border border-border rounded-full text-sm hover:bg-ink-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("board.actions.undo")}
          </button>
          <button
            onClick={onReset}
            className="px-5 py-3 border border-border rounded-full text-sm hover:bg-ink-2 transition"
          >
            {t("board.actions.reset")}
          </button>
        </div>

        <div className="p-5 bg-gradient-to-br from-ink-2 to-ink rounded-xl border border-border-strong">
          {opponentLabel ? (
            <>
              <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
                {t("ai.engineNotes.label")}
              </div>
              <p className="text-sm text-cream-muted leading-relaxed">
                {t("ai.engineNotes.bodyPrefix")}{" "}
                <span className="text-cream">{opponentLabel}</span>
                {t("ai.engineNotes.bodySuffix")}
              </p>
            </>
          ) : (
            <>
              <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
                {t("board.comingNext.label")}
              </div>
              <ul className="text-sm text-cream-muted space-y-2">
                <li>{t("board.comingNext.multiplayer")}</li>
                <li>{t("board.comingNext.coach")}</li>
                <li>{t("board.comingNext.trainer")}</li>
                <li>{t("board.comingNext.profiles")}</li>
              </ul>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}