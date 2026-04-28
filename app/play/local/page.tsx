// app/play/local/page.tsx
//
// Two-players-on-one-screen mode. Uses the shared game hook
// and the shared ChessBoard component (which we'll update next).

"use client";

import Link from "next/link";
import { useChessGame } from "@/lib/useChessGame";
import ChessBoard from "@/components/ChessBoard";

export default function LocalMatchPage() {
  const game = useChessGame();

  return (
    <main className="min-h-screen bg-ink text-cream">
      {/* Header with mode switcher */}
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>

        {/* Mode switcher pill — current mode highlighted */}
        <nav className="flex gap-1 p-1 bg-ink-2 border border-border rounded-full">
          <span className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] bg-saffron text-ink rounded-full">
            Local match
          </span>
          <Link
            href="/play/ai"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-muted hover:text-cream transition rounded-full"
          >
            Vs AI
          </Link>
          <Link
            href="/play"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-dim hover:text-cream transition rounded-full"
          >
            Lobby
          </Link>
        </nav>

        <Link
          href="/"
          className="text-xs text-cream-muted hover:text-cream transition"
        >
          ← Home
        </Link>
      </header>

      {/* Board */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <ChessBoard
          fen={game.fen}
          turn={game.turn}
          history={game.history}
          statusText={game.statusText}
          lastMove={game.lastMove}
          selectedSquare={game.selectedSquare}
          legalTargets={game.legalTargets}
          onPieceDrop={(from, to) =>
            game.makeMove({ from, to, promotion: "q" })
          }
          onSquareClick={(square) => game.selectSquare(square)}
          onUndo={game.undo}
          onReset={game.reset}
          // No AI in local mode — these are just defaults
          aiThinking={false}
        />
      </div>
    </main>
  );
}