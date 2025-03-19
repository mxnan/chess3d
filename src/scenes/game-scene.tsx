// src/scenes/game-scene.tsx
import { Suspense, useEffect } from "react";
import { Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { useGameStore } from "../store/gamestore";
import SpaceBackground from "./common/space-bg";
import Board from "../components/chess/board";
import ChessClock from "../components/ui/chess-clock";
import EmojiPanel from "../components/ui/emoji-panel";
import TurnIndicator from "../components/ui/turn-indicator";
import { motion } from "framer-motion-3d";
import { Text } from "@react-three/drei";

interface GameSceneProps {
  gameState: {
    isStarted: boolean;
    playerName: string;
    roomCode: string;
  };
}

export default function GameScene({ gameState }: GameSceneProps) {
  const { 
    createGame, 
    currentTurn, 
    isGameOver,
    winner,
    updateGameTime
  } = useGameStore();
  
  // Initialize the game when started
  useEffect(() => {
    if (gameState.isStarted && gameState.playerName) {
      createGame(gameState.playerName, gameState.roomCode);
    }
  }, [gameState.isStarted, gameState.playerName, gameState.roomCode, createGame]);
  
  // Update game time every second
  useEffect(() => {
    if (gameState.isStarted && !isGameOver) {
      const interval = setInterval(() => {
        updateGameTime();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameState.isStarted, isGameOver, updateGameTime]);

  return (
    <>
      {/* Ambient lighting */}
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
            {/* Only show board and pieces when game is started */}
            {gameState.isStarted && (
              <>
                <Board />
                <TurnIndicator currentTurn={currentTurn} />
              </>
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

          {/* Game over message */}
          {isGameOver && (
            <motion.group
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
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