// src/components/chess/board.tsx
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useChessGame } from "../../hooks/use-chessgame";
import Square from "./square";
import Piece from "./piece";
import { useGameStore } from "../../store/gamestore";

interface BoardProps {
  visible?: boolean;
}

export default function Board({ visible = true }: BoardProps) {
  const { pieces, selectedSquare, legalMoves, handleSquareSelect } =
    useChessGame();

  const isStarted = useGameStore((state) => state.isStarted);
  const boardRef = useRef<THREE.Group>(null);

  // Board animation
  useFrame(() => {
    if (boardRef.current) {
      // Adjust visibility based on game state but don't unmount
      boardRef.current.visible = visible;

      // Subtle rotation to give life to the board
      boardRef.current.rotation.y = THREE.MathUtils.lerp(
        boardRef.current.rotation.y,
        0,
        0.05
      );
    }
  });

  // Create the chess board (8x8)
  const renderSquares = () => {
    const squares = [];

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const squareName = String.fromCharCode(97 + file) + (8 - rank);
        const position: [number, number, number] = [file - 3.5, 0, rank - 3.5];
        const isLight = (file + rank) % 2 === 0;
        const isSelected = squareName === selectedSquare;
        const isLegalMove = legalMoves.includes(squareName);

        squares.push(
          <Square
            key={squareName}
            position={position}
            color={isLight ? "light" : "dark"}
            isSelected={isSelected}
            isLegalMove={isLegalMove}
            onClick={() => handleSquareSelect(squareName)}
          />
        );
      }
    }

    return squares;
  };

  // Render pieces based on current game state
  const renderPieces = () => {
    if (!isStarted) return null;

    return pieces.map((piece) => {
      const file = piece.square.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
      const rank = 8 - parseInt(piece.square[1]);
      const position: [number, number, number] = [file - 3.5, 0, rank - 3.5];

      return (
        <Piece
          key={piece.id}
          type={piece.type}
          color={piece.color}
          position={position}
          square={piece.square}
          isSelected={piece.square === selectedSquare}
          onClick={() => handleSquareSelect(piece.square)}
        />
      );
    });
  };

  return (
    <group ref={boardRef} visible={true}>
      {" "}
      {/* Always keep visible */}
      {/* Board frame */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Board squares */}
      {renderSquares()}
      {/* Chess pieces - only when game is started */}
      {renderPieces()}
    </group>
  );
}
