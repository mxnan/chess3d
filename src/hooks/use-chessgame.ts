// src/hooks/use-chessgame.ts
import { useCallback } from 'react';
import { useGameStore } from '../store/gamestore';
import { Square } from 'chess.js';

export function useChessGame() {
  const {
    chess,
    currentTurn,
    selectedSquare,
    legalMoves,
    isGameOver,
    winner,
    selectSquare,
    makeMove
  } = useGameStore();

  // Get pieces from the current board position
  const getPieces = useCallback(() => {
    const pieces = [];
    const board = chess.board();
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const square = String.fromCharCode(97 + j) + (8 - i);
          pieces.push({
            id: `${piece.type}-${piece.color}-${square}`,
            type: piece.type as 'p' | 'n' | 'b' | 'r' | 'q' | 'k',
            color: piece.color === 'w' ? 'white' : 'black',
            square
          });
        }
      }
    }
    
    return pieces;
  }, [chess]);

  // Handle square selection
  const handleSquareSelect = useCallback((square: Square) => {
    selectSquare(square);
  }, [selectSquare]);

  // Make a move (can be used directly in components)
  const handleMove = useCallback((from: Square, to: Square) => {
    return makeMove(from, to);
  }, [makeMove]);

  // Check if a move is legal
  const isLegalMove = useCallback((to: Square) => {
    return legalMoves.includes(to);
  }, [legalMoves]);

  // Get the FEN notation of the current position
  const getFen = useCallback(() => {
    return chess.fen();
  }, [chess]);

  return {
    currentTurn,
    selectedSquare,
    legalMoves,
    pieces: getPieces(),
    isGameOver,
    winner,
    handleSquareSelect,
    handleMove,
    isLegalMove,
    getFen
  };
}