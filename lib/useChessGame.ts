// lib/useChessGame.ts
//
// React hook that owns the chess game state.
// Encapsulates: position, history, status, last move, selection.
// Used by both /play/local and /play/ai pages.

import { useState, useCallback, useMemo } from "react";
import { Chess, type Square } from "chess.js";

export type GameStatus = "" | "check" | "checkmate" | "draw";

export interface UseChessGameReturn {
  // Current position as a chess.js object (read-only — call methods to inspect)
  game: Chess;
  // FEN string for the board component
  fen: string;
  // List of moves in SAN notation ("e4", "Nf3", "O-O", etc.)
  history: string[];
  // Human-readable status banner ("", "Check.", "Checkmate. White wins.", ...)
  statusText: string;
  // Whose turn it is right now
  turn: "w" | "b";
  // Last move (for square highlighting)
  lastMove: { from: string; to: string } | null;
  // Click-to-move state
  selectedSquare: Square | null;
  legalTargets: Square[];

  // Actions
  makeMove: (move: {
    from: string;
    to: string;
    promotion?: string;
  }) => boolean;
  selectSquare: (square: Square) => void;
  reset: () => void;
  undo: () => void;
}

export function useChessGame(): UseChessGameReturn {
  const [game, setGame] = useState(() => new Chess());
  const [history, setHistory] = useState<string[]>([]);
  const [statusText, setStatusText] = useState<string>("");
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);

  /**
   * Centralised status calculation — called after every successful move.
   * Returns the new status text based on the resulting position.
   */
  function computeStatus(position: Chess): string {
    if (position.isCheckmate()) {
      return `Checkmate. ${position.turn() === "w" ? "Black" : "White"} wins.`;
    }
    if (position.isStalemate()) return "Stalemate. The game is drawn.";
    if (position.isThreefoldRepetition())
      return "Draw by threefold repetition.";
    if (position.isInsufficientMaterial())
      return "Draw — insufficient material.";
    if (position.isDraw()) return "Draw.";
    if (position.isCheck()) return "Check.";
    return "";
  }

  /**
   * Try to play a move. Returns true if it was legal.
   * Used by drag-and-drop, click-to-move, AND by the AI.
   */
  const makeMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      const next = new Chess(game.fen());
      let result;
      try {
        result = next.move(move);
      } catch {
        return false;
      }
      if (!result) return false;

      setGame(next);
      setHistory((h) => [...h, result.san]);
      setLastMove({ from: result.from, to: result.to });
      setSelectedSquare(null);
      setLegalTargets([]);
      setStatusText(computeStatus(next));
      return true;
    },
    [game]
  );

  /**
   * Click-to-move: select a piece, or move the selected piece, or switch piece.
   */
  const selectSquare = useCallback(
    (square: Square) => {
      // If a piece is already selected, treat this as the destination
      if (selectedSquare) {
        // Clicking the same square again — deselect
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setLegalTargets([]);
          return;
        }

        const moved = makeMove({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });
        if (moved) return;

        // Illegal — but maybe they're switching to another of their pieces
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          const moves = game.moves({ square, verbose: true });
          setSelectedSquare(square);
          setLegalTargets(moves.map((m) => m.to as Square));
        } else {
          setSelectedSquare(null);
          setLegalTargets([]);
        }
        return;
      }

      // Nothing selected — select if it's the current player's piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        const moves = game.moves({ square, verbose: true });
        setSelectedSquare(square);
        setLegalTargets(moves.map((m) => m.to as Square));
      }
    },
    [game, selectedSquare, makeMove]
  );

  const reset = useCallback(() => {
    setGame(new Chess());
    setHistory([]);
    setStatusText("");
    setLastMove(null);
    setSelectedSquare(null);
    setLegalTargets([]);
  }, []);

  const undo = useCallback(() => {
    setGame((current) => {
      const next = new Chess(current.fen());
      const undone = next.undo();
      if (!undone) return current;
      return next;
    });
    setHistory((h) => h.slice(0, -1));
    setStatusText("");
    setSelectedSquare(null);
    setLegalTargets([]);
    setLastMove(null);
  }, []);

  // Memoize derived values so consumers don't re-render unnecessarily
  const fen = useMemo(() => game.fen(), [game]);
  const turn = useMemo(() => game.turn(), [game]);

  return {
    game,
    fen,
    history,
    statusText,
    turn,
    lastMove,
    selectedSquare,
    legalTargets,
    makeMove,
    selectSquare,
    reset,
    undo,
  };
}