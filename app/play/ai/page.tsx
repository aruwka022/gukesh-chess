// app/play/ai/page.tsx
//
// Play against the Stockfish chess engine.
// Difficulty levels are named after Gukesh's career milestones.
//
// Flow:
//   1. User picks a level (Prodigy / Master / Candidate / Champion)
//   2. Game starts, user plays White
//   3. After every white move, the engine is asked for the best move
//      and we play it automatically as black.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChessGame } from "@/lib/useChessGame";
import {
  useStockfish,
  DIFFICULTY_CONFIGS,
  type DifficultyLevel,
} from "@/lib/useStockfish";
import ChessBoard from "@/components/ChessBoard";

export default function VsAiPage() {
  const game = useChessGame();
  const { isReady, isThinking, getBestMove } = useStockfish();

  // null = level not chosen yet, show the picker
  const [level, setLevel] = useState<DifficultyLevel | null>(null);

  // Whenever it's Black's turn, ask the engine for a move.
  // (User plays White; engine plays Black.)
  useEffect(() => {
    if (!level) return;
    if (game.turn !== "b") return;
    // Don't ask if game already over
    if (
      game.statusText.startsWith("Checkmate") ||
      game.statusText.startsWith("Draw") ||
      game.statusText === "Stalemate. The game is drawn."
    ) {
      return;
    }
    if (!isReady) return;

    let cancelled = false;
    (async () => {
      const best = await getBestMove(game.fen, level);
      if (cancelled || !best) return;
      // UCI move format: "e2e4" or "e7e8q" (with promotion piece)
      const from = best.slice(0, 2);
      const to = best.slice(2, 4);
      const promotion = best.length > 4 ? best.slice(4, 5) : "q";
      game.makeMove({ from, to, promotion });
    })();

    return () => {
      cancelled = true;
    };
    // We intentionally only react to turn / fen / level / readiness changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.turn, game.fen, level, isReady]);

  // ===========================================================
  // LEVEL PICKER — shown before the game starts
  // ===========================================================
  if (!level) {
    return (
      <main className="min-h-screen bg-ink text-cream">
        <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-tight">
            Gukesh<span className="text-saffron">.</span>Mode
          </Link>
          <div className="mono text-[11px] uppercase tracking-[0.25em] text-cream-muted">
            ◆ Choose your opponent
          </div>
          <Link
            href="/play"
            className="text-xs text-cream-muted hover:text-cream transition"
          >
            ← Lobby
          </Link>
        </header>

        <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
          <p className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-6">
            ◆ Four strengths · One journey
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
            Pick the <span className="italic text-saffron">level</span> you
            want to face today.
          </h1>
          <p className="mt-6 text-cream-muted max-w-xl mx-auto text-sm md:text-base">
            Each level is a milestone from a champion's career. Start where
            you are. Climb when you're ready.
          </p>
          {!isReady && (
            <p className="mt-6 mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
              ◆ Loading engine...
            </p>
          )}
        </section>

        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map(
              (key, i) => {
                const config = DIFFICULTY_CONFIGS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setLevel(key)}
                    disabled={!isReady}
                    className="group p-7 bg-ink-2 border border-border rounded-2xl hover:border-saffron-dim transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="mono text-[11px] uppercase tracking-[0.25em] text-saffron mb-5">
                      ◆ Level 0{i + 1}
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl mb-3 leading-tight">
                      {config.label}
                    </h2>
                    <p className="text-cream-muted text-sm leading-relaxed mb-5">
                      {config.description}
                    </p>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-cream-dim group-hover:text-saffron transition-colors">
                      Begin →
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </section>
      </main>
    );
  }

  // ===========================================================
  // GAME — once a level is chosen, show the board
  // ===========================================================
  const currentConfig = DIFFICULTY_CONFIGS[level];

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>

        <nav className="flex gap-1 p-1 bg-ink-2 border border-border rounded-full">
          <Link
            href="/play/local"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-muted hover:text-cream transition rounded-full"
          >
            Local match
          </Link>
          <span className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] bg-saffron text-ink rounded-full">
            Vs AI · {currentConfig.label}
          </span>
          <Link
            href="/play"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-dim hover:text-cream transition rounded-full"
          >
            Lobby
          </Link>
        </nav>

        <button
          onClick={() => {
            setLevel(null);
            game.reset();
          }}
          className="text-xs text-cream-muted hover:text-cream transition"
        >
          Change level
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <ChessBoard
          fen={game.fen}
          turn={game.turn}
          history={game.history}
          statusText={game.statusText}
          lastMove={game.lastMove}
          selectedSquare={game.selectedSquare}
          legalTargets={game.legalTargets}
          onPieceDrop={(from, to) => {
            // Block the user from moving black pieces — those are AI's
            if (game.turn !== "w") return false;
            return game.makeMove({ from, to, promotion: "q" });
          }}
          onSquareClick={(square) => {
            // Same rule — only act on white's turn
            if (game.turn !== "w") return;
            game.selectSquare(square);
          }}
          onUndo={() => {
            // Undo twice — once for AI's reply, once for user's move
            game.undo();
            game.undo();
          }}
          onReset={game.reset}
          aiThinking={isThinking}
          opponentLabel={currentConfig.label}
        />
      </div>
    </main>
  );
}