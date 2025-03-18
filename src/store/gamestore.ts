// src/store/gameStore.ts
import { create } from 'zustand';
import { Chess, Move } from 'chess.js';

interface Player {
  id: string;
  name: string;
  color: 'white' | 'black';
}

interface GameState {
  isStarted: boolean;
  roomCode: string;
  players: Player[];
  currentTurn: 'white' | 'black';
  moveHistory: Move[];
  isGameOver: boolean;
  winner: string | null;
  gameTime: number;
}

interface GameStore extends GameState {
  // Game setup actions
  createGame: (playerName: string, roomCode: string) => void;
  joinGame: (playerName: string, roomCode: string) => void;
  resetGame: () => void;
  
  // Game actions
  makeMove: (from: string, to: string) => boolean;
  undoLastMove: () => void;
  
  // Game state updates
  updateGameTime: () => void;
  setWinner: (winner: string | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  isStarted: false,
  roomCode: '',
  players: [],
  currentTurn: 'white',
  moveHistory: [],
  isGameOver: false,
  winner: null,
  gameTime: 0,
  
  // Chess.js instance (not part of the state)
  chess: new Chess(),

  // Game setup actions
  createGame: (playerName: string, roomCode: string) => {
    set({
      isStarted: true,
      roomCode,
      players: [
        {
          id: 'player1', // Will be replaced with real ID in multiplayer
          name: playerName,
          color: 'white'
        }
      ]
    });
  },

  joinGame: (playerName: string, roomCode: string) => {
    set(state => ({
      players: [
        ...state.players,
        {
          id: 'player2', // Will be replaced with real ID in multiplayer
          name: playerName,
          color: 'black'
        }
      ]
    }));
  },

  resetGame: () => {
    get().chess.reset();
    set({
      isStarted: false,
      moveHistory: [],
      currentTurn: 'white',
      isGameOver: false,
      winner: null,
      gameTime: 0
    });
  },

  // Game actions
  makeMove: (from: string, to: string) => {
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
}));