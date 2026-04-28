// lib/useGameAnalysis.ts
//
// Game analysis hook — feeds each position to Stockfish,
// compares the move played vs the engine's recommendation,
// and classifies each move from "brilliant" to "blunder".

"use client";

import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { useStockfish, type PositionEvaluation } from "./useStockfish";

// ============================================================
// Move classification
// ============================================================

export type MoveQuality =
  | "brilliant" // Best engine move (or near-best)
  | "good" // Solid, slight inaccuracy
  | "inaccuracy" // 50–150cp loss
  | "mistake" // 150–300cp loss
  | "blunder"; // 300+cp loss

export interface AnalysedMove {
  // Move number from the game (1, 2, 3, ...)
  moveNumber: number;
  // SAN notation, e.g. "Nf3" or "O-O"
  san: string;
  // UCI of the move played (e.g. "e2e4")
  uciPlayed: string;
  // UCI of the engine's preferred move
  uciBest: string | null;
  // Side that played: "w" or "b"
  color: "w" | "b";
  // Eval before the move was played, in cp from white's perspective
  evalBefore: number | null;
  // Eval after the move was played
  evalAfter: number | null;
  // How many cp the player lost (positive = lost cp, 0 = optimal)
  cpLost: number;
  // The classification
  quality: MoveQuality;
}

// ============================================================
// Classification thresholds (centipawns lost)
// ============================================================
function classifyMove(cpLost: number): MoveQuality {
  if (cpLost < 20) return "brilliant";
  if (cpLost < 50) return "good";
  if (cpLost < 150) return "inaccuracy";
  if (cpLost < 300) return "mistake";
  return "blunder";
}

// ============================================================
// Convert mate scores to a comparable centipawn value.
// "Mate in 3" is much better than "+900cp", so we treat it as a
// very large advantage but capped to avoid skewing the loss math.
// ============================================================
function evalToCp(eval_: PositionEvaluation, sideToMove: "w" | "b"): number {
  // We want the score from the perspective of WHITE always.
  // Stockfish returns scores from the side-to-move perspective,
  // so flip when it's black's turn.
  const sign = sideToMove === "w" ? 1 : -1;

  if (eval_.mateIn !== null) {
    // Larger mate distance = "worse" mate, so we use 10000 - distance to keep order.
    // Sign is flipped because mate-in-N for the side to move is good for them.
    const value = eval_.mateIn > 0 ? 10000 - eval_.mateIn : -10000 - eval_.mateIn;
    return value * sign;
  }
  if (eval_.centipawns !== null) {
    return eval_.centipawns * sign;
  }
  return 0;
}

// ============================================================
// Hook
// ============================================================

export interface UseGameAnalysisReturn {
  // null = no analysis yet, [] = analysing, populated = done
  analysis: AnalysedMove[] | null;
  // Progress 0..1
  progress: number;
  // True while analysing
  isAnalysing: boolean;
  // Run analysis on a sequence of SAN moves (the game's history)
  analyseGame: (sanHistory: string[]) => Promise<void>;
  // Clear results (call when starting a new game)
  reset: () => void;
}

export function useGameAnalysis(): UseGameAnalysisReturn {
  const { evaluatePosition, isReady } = useStockfish();
  const [analysis, setAnalysis] = useState<AnalysedMove[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const analyseGame = useCallback(
    async (sanHistory: string[]) => {
      if (!isReady) {
        console.warn("Engine not ready yet");
        return;
      }
      if (sanHistory.length === 0) return;

      setIsAnalysing(true);
      setAnalysis([]);
      setProgress(0);

      // Reconstruct the game move-by-move so we can record FEN before/after each move.
      // We need: position BEFORE the move, the move played, position AFTER the move.
      const game = new Chess();
      const positions: Array<{
        fenBefore: string;
        san: string;
        uciPlayed: string;
        color: "w" | "b";
      }> = [];

      for (const san of sanHistory) {
        const fenBefore = game.fen();
        const sideToMove = game.turn();
        let move;
        try {
          move = game.move(san);
        } catch {
          break;
        }
        if (!move) break;
        positions.push({
          fenBefore,
          san: move.san,
          uciPlayed: move.from + move.to + (move.promotion ?? ""),
          color: sideToMove,
        });
      }

      const results: AnalysedMove[] = [];

      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        // Eval the position BEFORE the move — to know the engine's best
        // and the score baseline.
        const evalBefore = await evaluatePosition(pos.fenBefore, 12);

        // Apply the move played to get the resulting position
        const game2 = new Chess(pos.fenBefore);
        game2.move(pos.san);
        const fenAfter = game2.fen();

        // Eval AFTER the move
        const evalAfter = await evaluatePosition(fenAfter, 12);

        // Convert both to white-perspective cp
        const cpBefore = evalToCp(evalBefore, pos.color);
        // After the move, the side to move has flipped — but we want
        // both numbers from white's perspective for direct comparison.
        const opposite = pos.color === "w" ? "b" : "w";
        const cpAfter = evalToCp(evalAfter, opposite);

        // Loss = how much the player worsened their position
        // From the player's perspective: cpBefore - cpAfter (if white)
        //                                cpAfter - cpBefore (if black, since negative is good for black)
        const losssFromPlayerPerspective =
          pos.color === "w" ? cpBefore - cpAfter : cpAfter - cpBefore;
        const cpLost = Math.max(0, losssFromPlayerPerspective);
        const quality = classifyMove(cpLost);

        const analysedMove: AnalysedMove = {
          moveNumber: Math.floor(i / 2) + 1,
          san: pos.san,
          uciPlayed: pos.uciPlayed,
          uciBest: evalBefore.bestMove,
          color: pos.color,
          evalBefore: cpBefore,
          evalAfter: cpAfter,
          cpLost: Math.round(cpLost),
          quality,
        };

        results.push(analysedMove);
        // Incremental update so UI shows progress as it goes
        setAnalysis([...results]);
        setProgress((i + 1) / positions.length);
      }

      setIsAnalysing(false);
    },
    [evaluatePosition, isReady]
  );

  const reset = useCallback(() => {
    setAnalysis(null);
    setProgress(0);
    setIsAnalysing(false);
  }, []);

  return { analysis, progress, isAnalysing, analyseGame, reset };
}