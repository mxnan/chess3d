// src/components/game/ChessGame.tsx
import { useChessGame } from "../hooks/use-chessgame";
import ChessPiece from "./ChessPiece";

function ChessGame() {
  const { pieces, handleSquareSelect, canSelectPiece } = useChessGame();

  return (
    <group>
      {pieces.map(piece => (
        <ChessPiece
          key={piece.id}
          {...piece}
          onSelect={() => {
            if (canSelectPiece(piece.square)) {
              handleSquareSelect(piece.square);
            }
          }}
        />
      ))}
    </group>
  );
}

export default ChessGame;