// src/components/game/ChessGame.tsx
import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import { ChessPiece, PieceType, PieceColor } from "./piece";

// Define a piece with its position on the board
interface PieceState {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
  square: string;
}

interface ChessGameProps {
  onTurnChange?: (turn: "white" | "black") => void;
}

// Convert chess.js square to 3D coordinates
const squareToPosition = (square: string): [number, number, number] => {
  const file = square.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
  const rank = parseInt(square[1]) - 1; // '1' -> 0, '2' -> 1, etc.
  
  const x = file - 3.5;
  const z = rank - 3.5;
  
  return [x, 0, z];
};

function ChessGame({ onTurnChange }: ChessGameProps) {
  // Initialize chess.js
  const [chess] = useState<Chess>(new Chess());
  
  // Track currently selected piece
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<any[]>([]);
  
  // Initialize pieces based on the starting position
  const [pieces, setPieces] = useState<PieceState[]>(() => {
    return createPiecesFromFEN(chess.fen());
  });
  
  // Update legal moves when a piece is selected
  useEffect(() => {
    if (selectedSquare) {
      const moves = chess.moves({
        square: selectedSquare,
        verbose: true
      });
      setLegalMoves(moves);
    } else {
      setLegalMoves([]);
    }
  }, [selectedSquare, chess]);
  
  // Notify parent of turn changes
  useEffect(() => {
    if (onTurnChange) {
      onTurnChange(chess.turn() === 'w' ? 'white' : 'black');
    }
  }, [chess, onTurnChange]);
  
  // Create pieces from FEN string
  function createPiecesFromFEN(fen: string): PieceState[] {
    const newPieces: PieceState[] = [];
    const fenBoard = fen.split(' ')[0];
    const rows = fenBoard.split('/');
    
    // FEN notation starts from the 8th rank (top)
    for (let rank = 7; rank >= 0; rank--) {
      let file = 0;
      const row = rows[7 - rank]; // FEN starts from 8th rank
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char >= '1' && char <= '8') {
          // Skip empty squares
          file += parseInt(char);
        } else {
          // It's a piece
          const color: PieceColor = char === char.toUpperCase() ? "white" : "black";
          const pieceChar = char.toLowerCase();
          let type: PieceType = "pawn";
          
          switch (pieceChar) {
            case 'p': type = "pawn"; break;
            case 'r': type = "rook"; break;
            case 'n': type = "knight"; break;
            case 'b': type = "bishop"; break;
            case 'q': type = "queen"; break;
            case 'k': type = "king"; break;
          }
          
          // Calculate square notation (e.g., "e4")
          const squareNotation = `${String.fromCharCode(97 + file)}${rank + 1}`;
          
          // Calculate 3D position
          const [x, y, z] = squareToPosition(squareNotation);
          
          // Calculate y based on piece type for height adjustment
          let pieceY = 0;
          switch (type) {
            case "pawn": pieceY = 0.25; break;
            case "rook": pieceY = 0.3; break;
            case "knight": pieceY = 0.35; break;
            case "bishop": pieceY = 0.4; break;
            case "queen": pieceY = 0.45; break;
            case "king": pieceY = 0.5; break;
          }
          
          newPieces.push({
            id: `${color}-${type}-${file}-${rank}`,
            type,
            color,
            position: [x, pieceY, z],
            square: squareNotation
          });
          
          file++;
        }
      }
    }
    
    return newPieces;
  }
  
  // Handle piece selection
  const handlePieceSelect = useCallback((id: string, square: string) => {
    // Check if it's this player's turn
    const piece = pieces.find(p => p.id === id);
    if (!piece) return;
    
    const isCurrentPlayerPiece = 
      (piece.color === "white" && chess.turn() === 'w') || 
      (piece.color === "black" && chess.turn() === 'b');
    
    if (!isCurrentPlayerPiece) return;
    
    setSelectedPieceId(prevId => prevId === id ? null : id);
    setSelectedSquare(prevSquare => prevSquare === square ? null : square);
  }, [pieces, chess]);
  
  // Handle piece movement
  const handlePieceMove = useCallback((id: string, toSquare: string) => {
    const piece = pieces.find(p => p.id === id);
    if (!piece || !selectedSquare) return;
    
    try {
      // Check if the move is legal
      const move = chess.move({
        from: selectedSquare,
        to: toSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });
      
      if (move) {
        // Update pieces based on new board state
        setPieces(createPiecesFromFEN(chess.fen()));
        
        // Clear selection
        setSelectedPieceId(null);
        setSelectedSquare(null);
        
        console.log(`Moved ${piece.color} ${piece.type} from ${selectedSquare} to ${toSquare}`);
        
        // Check for game over conditions
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            console.log(`Checkmate! ${chess.turn() === 'w' ? 'Black' : 'White'} wins!`);
          } else if (chess.isDraw()) {
            console.log("Game is a draw!");
          }
        }
      }
    } catch (e) {
      console.error('Invalid move:', e);
    }
  }, [selectedSquare, pieces, chess]);

  return (
    <group>
      {pieces.map(piece => (
        <ChessPiece
          key={piece.id}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isSelected={selectedPieceId === piece.id}
          onSelect={() => handlePieceSelect(piece.id, piece.square)}
          onMove={(newPosition) => {
            // Convert position back to chess notation
            const fileIdx = Math.round(newPosition[0] + 3.5);
            const rankIdx = Math.round(newPosition[2] + 3.5);
            const toSquare = `${String.fromCharCode(97 + fileIdx)}${rankIdx + 1}`;
            handlePieceMove(piece.id, toSquare);
          }}
        />
      ))}
      
      {/* Highlight legal move squares */}
      {legalMoves.map(move => {
        const [x, _, z] = squareToPosition(move.to);
        return (
          <mesh
            key={move.to}
            position={[x, 0.01, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.4, 32]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

export default ChessGame;