// src/store/gameStore.ts
import { create } from 'zustand';
import { Chess, Move, Square } from 'chess.js';
import { PieceColor } from '../types/chess';

interface Player {
  id: string;
  name: string;
  color: PieceColor;
}

interface GameState {
  isStarted: boolean;
  roomCode: string;
  players: Player[];
  chess: Chess;
  currentTurn: PieceColor;
  selectedSquare: Square | null;
  legalMoves: Square[];
  moveHistory: Move[];
  isGameOver: boolean;
  winner: string | null;
  gameTime: number;
  // We'll remove isEntering because we'll handle transitions differently
}

interface GameStore extends GameState {
  // Game setup actions
  createGame: (playerName: string, roomCode: string) => void;
  joinGame: (playerName: string, roomCode: string) => void;
  resetGame: () => void;
  
  // Game board actions
  selectSquare: (square: Square | null) => void;
  makeMove: (from: Square, to: Square) => boolean;
  undoLastMove: () => void;
  
  // Game state updates
  updateGameTime: () => void;
  setWinner: (winner: string | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  // Create a chess instance
  const chess = new Chess();
  
  return {
    // Initial state
    isStarted: false,
    roomCode: '',
    players: [],
    chess: chess,
    currentTurn: 'white',
    selectedSquare: null,
    legalMoves: [],
    moveHistory: [],
    isGameOver: false,
    winner: null,
    gameTime: 0,

    // Game setup actions
    createGame: (playerName: string, roomCode: string) => {
      // Reset the chess instance
      const chess = get().chess;
      chess.reset();
      
      // Batch all state updates together to minimize re-renders
      set({
        isStarted: true,
        roomCode,
        players: [
          {
            id: 'player1',
            name: playerName,
            color: 'white'
          },
          {
            id: 'player2',
            name: 'Player 2',
            color: 'black'
          }
        ],
        moveHistory: [],
        currentTurn: 'white',
        selectedSquare: null,
        legalMoves: [],
        isGameOver: false,
        winner: null,
        gameTime: 0
      });
    },
    joinGame: (playerName: string, roomCode: string) => {
      set(state => ({
        players: [
          ...state.players,
          {
            id: 'player2',
            name: playerName,
            color: 'black'
          }
        ]
      }));
    },

    resetGame: () => {
      const chess = get().chess;
      chess.reset();
      
      set({
        isStarted: false,
        moveHistory: [],
        currentTurn: 'white',
        selectedSquare: null,
        legalMoves: [],
        isGameOver: false,
        winner: null,
        gameTime: 0
      });
    },

    // Game board actions
    selectSquare: (square) => {
      const { chess, currentTurn, isGameOver } = get();
      
      // Don't allow selection if game is over
      if (isGameOver) return;
      
      if (!square) {
        set({ selectedSquare: null, legalMoves: [] });
        return;
      }
      
      // Get the piece at the square
      const piece = chess.get(square);
      
      // Can only select a square with your piece during your turn
      if (piece && (piece.color === 'w' && currentTurn === 'white' || 
                    piece.color === 'b' && currentTurn === 'black')) {
        const moves = chess.moves({ square, verbose: true });
        set({
          selectedSquare: square,
          legalMoves: moves.map(move => move.to)
        });
      } else if (get().selectedSquare) {
        // If we already have a square selected, try to move there
        get().makeMove(get().selectedSquare, square);
      }
    },

    makeMove: (from, to) => {
      const chess = get().chess;
      try {
        const move = chess.move({
          from,
          to,
          promotion: 'q' // Always promote to queen for now
        });

        if (move) {
          set(state => ({
            moveHistory: [...state.moveHistory, move],
            currentTurn: chess.turn() === 'w' ? 'white' : 'black',
            selectedSquare: null,
            legalMoves: [],
            isGameOver: chess.isGameOver(),
            winner: chess.isCheckmate() 
              ? chess.turn() === 'w' ? 'black' : 'white'
              : chess.isDraw() ? 'draw' : null
          }));
          return true;
        }
      } catch (e) {
        console.error('Invalid move:', e);
      }
      return false;
    },

    undoLastMove: () => {
      const chess = get().chess;
      chess.undo();
      set(state => ({
        moveHistory: state.moveHistory.slice(0, -1),
        currentTurn: chess.turn() === 'w' ? 'white' : 'black',
        selectedSquare: null,
        legalMoves: [],
        isGameOver: false,
        winner: null
      }));
    },

    // Game state updates
    updateGameTime: () => {
      set(state => ({ gameTime: state.gameTime + 1 }));
    },

    setWinner: (winner: string | null) => {
      set({ winner, isGameOver: true });
    }
  };
});