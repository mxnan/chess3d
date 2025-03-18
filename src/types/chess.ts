// src/types/chess.ts
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Square = string; // e.g., 'e4', 'a1'

export interface ChessPieceState {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
  square: Square;
}

export interface GameState {
  isStarted: boolean;
  roomCode: string;
  players: Player[];
  currentTurn: PieceColor;
  selectedSquare: Square | null;
  legalMoves: Square[];
  moveHistory: Move[];
  isGameOver: boolean;
  winner: string | null;
  gameTime: number;
}

export interface Player {
  id: string;
  name: string;
  color: PieceColor;
}