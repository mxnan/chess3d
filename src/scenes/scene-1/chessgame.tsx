import { useState, useCallback } from "react";
import { ChessPiece, PieceType, PieceColor } from "./piece";

// Define a piece with its position on the board
interface PieceState {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
}

function ChessGame() {
  // Track currently selected piece
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  
  // Initial setup of all chess pieces
  const [pieces, setPieces] = useState<PieceState[]>(() => {
    const initialPieces: PieceState[] = [];
    
    // Helper to add a piece to the array with correct positioning
    const addPiece = (
      type: PieceType, 
      color: PieceColor, 
      fileIndex: number, 
      rankIndex: number
    ) => {
      // Convert chess coordinates to 3D coordinates
      // Each square is exactly 1 unit in size, centered at its coordinates
      const x = fileIndex - 3.5;
      const z = rankIndex - 3.5;
      
      // Calculate y based on piece type
      let y = 0;
      switch (type) {
        case "pawn": y = 0.25; break;
        case "rook": y = 0.3; break;
        case "knight": y = 0.35; break;
        case "bishop": y = 0.4; break;
        case "queen": y = 0.45; break;
        case "king": y = 0.5; break;
      }
      
      initialPieces.push({
        id: `${color}-${type}-${fileIndex}-${rankIndex}`,
        type,
        color,
        position: [x, y, z]
      });
    };
    
    // Add pawns
    for (let file = 0; file < 8; file++) {
      // White pawns on rank 1
      addPiece("pawn", "white", file, 1);
      // Black pawns on rank 6
      addPiece("pawn", "black", file, 6);
    }
    
    // Add rooks
    addPiece("rook", "white", 0, 0);
    addPiece("rook", "white", 7, 0);
    addPiece("rook", "black", 0, 7);
    addPiece("rook", "black", 7, 7);
    
    // Add knights
    addPiece("knight", "white", 1, 0);
    addPiece("knight", "white", 6, 0);
    addPiece("knight", "black", 1, 7);
    addPiece("knight", "black", 6, 7);
    
    // Add bishops
    addPiece("bishop", "white", 2, 0);
    addPiece("bishop", "white", 5, 0);
    addPiece("bishop", "black", 2, 7);
    addPiece("bishop", "black", 5, 7);
    
    // Add queens
    addPiece("queen", "white", 3, 0);
    addPiece("queen", "black", 3, 7);
    
    // Add kings
    addPiece("king", "white", 4, 0);
    addPiece("king", "black", 4, 7);
    
    return initialPieces;
  });
  
  // Handle piece selection
  const handlePieceSelect = useCallback((id: string) => {
    setSelectedPieceId(prevId => prevId === id ? null : id);
    console.log(`Selected piece: ${id}`);
  }, []);
  
  // Handle piece movement (will be updated with chess.js rules later)
  const handlePieceMove = useCallback((id: string, newPosition: [number, number, number]) => {
    // For now, just update position - we'll add rules later
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id === id) {
          return { ...piece, position: newPosition };
        }
        return piece;
      });
    });
    
    // Clear selection after move
    setSelectedPieceId(null);
  }, []);

  return (
    <group>
      {pieces.map(piece => (
        <ChessPiece
          key={piece.id}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isSelected={selectedPieceId === piece.id}
          onSelect={() => handlePieceSelect(piece.id)}
          onMove={(newPosition) => handlePieceMove(piece.id, newPosition)}
        />
      ))}
    </group>
  );
}

export default ChessGame;