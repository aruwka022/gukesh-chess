// components/ChessBoard.tsx
//
// "Dumb" presentational component. Receives the game state via props
// and emits events back to the parent (which owns the state through
// useChessGame).
//
// Used by:
//   - app/play/local/page.tsx (two players)
//   - app/play/ai/page.tsx    (vs Stockfish)

"use client";

import { useMemo } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";

interface ChessBoardProps {
  fen: string;
  turn: "w" | "b";
  history: string[];
  statusText: string;
  lastMove: { from: string; to: string } | null;
  selectedSquare: Square | null;
  legalTargets: Square[];

  onPieceDrop: (from: string, to: string) => boolean;
  onSquareClick: (square: Square) => void;
  onUndo: () => void;
  onReset: () => void;

  // AI mode extras (optional — defaults are fine for local mode)
  aiThinking?: boolean;
  opponentLabel?: string;
}

export default function ChessBoard({
  fen,
  turn,
  history,
  statusText,
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
  // We construct a temporary Chess instance from the FEN purely so we can
  // ask "what's on this square?" when rendering capture indicators.
  // It's cheap — chess.js is just parsing a string.
  const positionForLookup = useMemo(() => new Chess(fen), [fen]);

  // Pair moves into rows: 1. e4 e5  2. Nf3 Nc6
  const movePairs = useMemo(() => {
    const pairs: Array<[string, string?]> = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push([history[i], history[i + 1]]);
    }
    return pairs;
  }, [history]);

  // Highlight styles for: last move, selected piece, legal targets
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Last move — soft saffron glow
    if (lastMove) {
      styles[lastMove.from] = { background: "rgba(232, 146, 74, 0.35)" };
      styles[lastMove.to] = { background: "rgba(232, 146, 74, 0.5)" };
    }

    // Selected piece — stronger saffron with inset ring
    if (selectedSquare) {
      styles[selectedSquare] = {
        background: "rgba(232, 146, 74, 0.55)",
        boxShadow: "inset 0 0 0 3px rgba(232, 146, 74, 0.9)",
      };
    }

    // Legal target squares
    for (const target of legalTargets) {
      const piece = positionForLookup.get(target);
      if (piece) {
        // Capture: green ring around the target piece
        styles[target] = {
          background:
            "radial-gradient(circle, transparent 0%, transparent 65%, rgba(91, 139, 122, 0.55) 65%, rgba(91, 139, 122, 0.55) 80%, transparent 80%)",
        };
      } else {
        // Empty square: small green dot
        styles[target] = {
          background:
            "radial-gradient(circle, rgba(91, 139, 122, 0.55) 18%, transparent 22%)",
        };
      }
    }

    return styles;
  }, [lastMove, selectedSquare, legalTargets, positionForLookup]);

  // Status line above the board
  const turnLabel = (() => {
    if (statusText) return statusText;
    if (aiThinking) return "Engine is thinking...";
    if (opponentLabel) {
      return turn === "w" ? "Your move" : `${opponentLabel} to move`;
    }
    return turn === "w" ? "White to move" : "Black to move";
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
            Move {Math.floor(history.length / 2) + 1}
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

          {/* "Thinking" overlay during AI calculation — subtle, doesn't block */}
          {aiThinking && (
            <div className="absolute top-5 right-5 px-3 py-1.5 bg-ink/85 border border-saffron/40 rounded-full backdrop-blur-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-saffron">
                Thinking
              </span>
            </div>
          )}
        </div>

        <p className="mt-3 mono text-[10px] uppercase tracking-[0.2em] text-cream-dim">
          ◆ Drag pieces, or tap to select then tap destination
        </p>

        {/* Status banner — only on terminal states (mate, draw) */}
        {statusText && (
          <div className="mt-6 px-5 py-4 bg-ink-2 border border-saffron/40 rounded-xl max-w-[640px]">
            <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-1">
              ◆ Status
            </div>
            <div className="font-display text-xl leading-tight">
              {statusText}
            </div>
          </div>
        )}
      </div>

      {/* ============== SIDE PANEL ============== */}
      <aside className="space-y-6">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-3">
            ◆ Move history
          </div>
          <div className="bg-ink-2 border border-border rounded-xl p-5 max-h-[420px] overflow-y-auto scrollbar-thin">
            {movePairs.length === 0 ? (
              <p className="text-cream-muted text-sm italic">
                No moves yet. White to begin.
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
            Undo
          </button>
          <button
            onClick={onReset}
            className="px-5 py-3 border border-border rounded-full text-sm hover:bg-ink-2 transition"
          >
            Reset
          </button>
        </div>

        {/* Show a different teaser depending on mode */}
        <div className="p-5 bg-gradient-to-br from-ink-2 to-ink rounded-xl border border-border-strong">
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-3">
            ◆ {opponentLabel ? "Engine notes" : "Coming next"}
          </div>
          {opponentLabel ? (
            <p className="text-sm text-cream-muted leading-relaxed">
              You're facing the engine at{" "}
              <span className="text-cream">{opponentLabel}</span> level. Take
              your time. Calculate fully. The engine doesn't reward speed —
              it rewards precision.
            </p>
          ) : (
            <ul className="text-sm text-cream-muted space-y-2">
              <li>· Multiplayer by link</li>
              <li>· AI Coach post-game review</li>
              <li>· Calculation Trainer</li>
              <li>· Player profiles</li>
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}