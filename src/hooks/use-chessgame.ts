// src/hooks/useChessGame.ts
import { useCallback } from 'react';
import { useGameStore } from '../store/gamestore';
import { Square } from '../types/chess';

export function useChessGame() {
  const {
    currentTurn,
    selectedSquare,
    legalMoves,
    pieces,
    isGameOver,
    winner,
    selectSquare,
    makeMove
  } = useGameStore();

  const handleSquareSelect = useCallback((square: Square) => {
    if (selectedSquare === square) {
      selectSquare(null);
    } else if (selectedSquare) {
      if (makeMove(selectedSquare, square)) {
        selectSquare(null);
      } else {
        selectSquare(square);
      }
    } else {
      selectSquare(square);
    }
  }, [selectedSquare, selectSquare, makeMove]);

  const canSelectPiece = useCallback((square: Square) => {
    const piece = pieces.find(p => p.square === square);
    return piece?.color === currentTurn;
  }, [pieces, currentTurn]);

  return {
    currentTurn,
    selectedSquare,
    legalMoves,
    pieces,
    isGameOver,
    winner,
    handleSquareSelect,
    canSelectPiece
  };
}