// src/scenes/GameScene.tsx
import { Physics } from "@react-three/rapier";
import { Suspense, useState, useCallback } from "react";
import { OrbitControls } from "@react-three/drei";
import SpaceBackground from "./common/space-bg";
import ChessGame from "./scene-1/chessgame";
import Board from "./scene-1/board";
import ChessClock from "../components/ui/chess-clock";
import EmojiPanel from "../components/ui/emoji-panel";
import { motion } from "framer-motion-3d";

import { useChessGame } from "../hooks/use-chessgame";
import { Text } from "@react-three/drei";

interface GameSceneProps {
  gameState: {
    isStarted: boolean;
    playerName: string;
    roomCode: string;
  };
}

function GameScene({ gameState }: GameSceneProps) {
  const { currentTurn, isGameOver, winner, handleMove } = useChessGame();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Handle square selection
  const handleSquareSelect = useCallback(
    (square: string) => {
      if (selectedSquare === square) {
        setSelectedSquare(null);
      } else if (selectedSquare) {
        // Attempt to make a move
        if (handleMove(selectedSquare, square)) {
          setSelectedSquare(null);
        } else {
          // If move failed, select the new square instead
          setSelectedSquare(square);
        }
      } else {
        setSelectedSquare(square);
      }
    },
    [selectedSquare, handleMove]
  );

  return (
    <>
      {/* Space background with player blobs */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[15, 20, 15]} intensity={1.5} castShadow />
      <pointLight position={[-10, 15, -10]} intensity={0.5} color="#6e90f5" />

      <Suspense fallback={null}>
        <Physics debug={false}>
          {/* Always show the space background */}
          <SpaceBackground />

          {/* Chess board and pieces with animation */}
          <motion.group
            initial={{ y: -50, scale: 0.5 }}
            animate={{
              y: gameState.isStarted ? 0 : -50,
              scale: gameState.isStarted ? 1 : 0.5,
            }}
            transition={{
              duration: 1.5,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Board />
            {gameState.isStarted && (
              <ChessGame
                onSquareSelect={handleSquareSelect}
                selectedSquare={selectedSquare}
                currentTurn={currentTurn}
              />
            )}
          </motion.group>

          {/* UI Elements with animation */}
          {gameState.isStarted && (
            <>
              <motion.group
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <ChessClock position={[-10, 0, 0]} />
              </motion.group>

              <motion.group
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <EmojiPanel position={[10, 0, 0]} />
              </motion.group>
            </>
          )}

          {isGameOver && (
            <motion.group
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              {/* Game over overlay */}
              <Text
                position={[0, 2, 0]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {winner === "draw" ? "Draw!" : `${winner} wins!`}
              </Text>
            </motion.group>
          )}
        </Physics>

        <OrbitControls
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={25}
        />
      </Suspense>
    </>
  );
}

export default GameScene;
