import { useState, useCallback, useMemo } from "react";
import { Chess, type Square } from "chess.js";

export interface UseChessGameReturn {
  game: Chess;
  fen: string;
  history: string[];
  statusKey: string;
  turn: "w" | "b";
  lastMove: { from: string; to: string } | null;
  selectedSquare: Square | null;
  legalTargets: Square[];

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
  const [statusKey, setStatusKey] = useState<string>("");
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);

  function computeStatusKey(position: Chess): string {
    if (position.isCheckmate()) {
      return position.turn() === "w"
        ? "board.statuses.checkmateBlack"
        : "board.statuses.checkmateWhite";
    }
    if (position.isStalemate()) return "board.statuses.stalemate";
    if (position.isThreefoldRepetition()) return "board.statuses.threefold";
    if (position.isInsufficientMaterial())
      return "board.statuses.insufficient";
    if (position.isDraw()) return "board.statuses.draw";
    if (position.isCheck()) return "board.statuses.check";
    return "";
  }

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
      setStatusKey(computeStatusKey(next));
      return true;
    },
    [game]
  );

  const selectSquare = useCallback(
    (square: Square) => {
      if (selectedSquare) {
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
    setStatusKey("");
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
    setStatusKey("");
    setSelectedSquare(null);
    setLegalTargets([]);
    setLastMove(null);
  }, []);

  const fen = useMemo(() => game.fen(), [game]);
  const turn = useMemo(() => game.turn(), [game]);

  return {
    game,
    fen,
    history,
    statusKey,
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