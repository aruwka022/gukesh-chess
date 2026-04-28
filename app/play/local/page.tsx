"use client";

import Link from "next/link";
import { useChessGame } from "@/lib/useChessGame";
import { useTranslation } from "@/lib/LanguageContext";
import ChessBoard from "@/components/ChessBoard";
import GameAnalysis from "@/components/GameAnalysis";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LocalMatchPage() {
  const game = useChessGame();
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          Gukesh<span className="text-saffron">.</span>Mode
        </Link>

        <nav className="hidden md:flex gap-1 p-1 bg-ink-2 border border-border rounded-full">
          <span className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] bg-saffron text-ink rounded-full">
            {t("modeSwitch.local")}
          </span>
          <Link
            href="/play/ai"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-muted hover:text-cream transition rounded-full"
          >
            {t("modeSwitch.ai")}
          </Link>
          <Link
            href="/play"
            className="px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-cream-dim hover:text-cream transition rounded-full"
          >
            {t("modeSwitch.lobby")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/"
            className="text-xs text-cream-muted hover:text-cream transition whitespace-nowrap"
          >
            {t("lobby.header.home")}
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14 space-y-8">
        <ChessBoard
          fen={game.fen}
          turn={game.turn}
          history={game.history}
          statusKey={game.statusKey}
          lastMove={game.lastMove}
          selectedSquare={game.selectedSquare}
          legalTargets={game.legalTargets}
          onPieceDrop={(from, to) =>
            game.makeMove({ from, to, promotion: "q" })
          }
          onSquareClick={(square) => game.selectSquare(square)}
          onUndo={game.undo}
          onReset={game.reset}
          aiThinking={false}
        />

        {/* AI Coach panel — analyses both players' moves in local match */}
        <div className="max-w-[640px]">
          <GameAnalysis history={game.history} playerColor="both" />
        </div>
      </div>
    </main>
  );
}