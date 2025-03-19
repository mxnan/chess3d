// Inside game-scene.tsx
import { useEffect, useRef } from "react";
import { Physics } from "@react-three/rapier";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { useGameStore } from "../store/gamestore";
import SpaceBackground from "./common/space-bg";
import Board from "../components/chess/board";
import ChessClock from "../components/ui/chess-clock";
import EmojiPanel from "../components/ui/emoji-panel";
import { motion } from "framer-motion-3d";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three'; // Add this import for THREE

export default function GameScene() {
  const { 
    isStarted,
    isGameOver,
    winner,
    updateGameTime
  } = useGameStore();
  
  const sceneRef = useRef<THREE.Group>(null);
  const { scene } = useThree();
  
  // Preserve scene across transitions
  useEffect(() => {
    // Make sure the scene is properly initialized
    if (scene) {
      scene.background = new THREE.Color("#000000");
    }
  }, [scene]);
  
  // Smooth animation of board position based on game state
  useFrame(() => {
    if (sceneRef.current) {
      // Keep scene visible at all times
      sceneRef.current.visible = true;
    }
  });
  
  // Update game time every second
  useEffect(() => {
    if (isStarted && !isGameOver) {
      const interval = setInterval(() => {
        updateGameTime();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isStarted, isGameOver, updateGameTime]);

  return (
    <group ref={sceneRef}>
      {/* Environment and Lighting */}
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[15, 20, 15]} intensity={1.5} castShadow />
      <pointLight position={[-10, 15, -10]} intensity={0.5} color="#6e90f5" />
      <Environment preset="night" />

      <Physics debug={false}>
        {/* Space background with stars - always visible */}
        <SpaceBackground />
        <Stars 
          radius={100} 
          depth={50} 
          count={1000} 
          factor={4} 
          saturation={0} 
          speed={1.5}
          fade
        />

        {/* Chess board - always present but animated based on game state */}
        <motion.group
          initial={{ scale: 0.8, y: -10 }}
          animate={{ 
            scale: isStarted ? 1 : 0.8, 
            y: isStarted ? 0 : -10,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <Board visible={isStarted} />
        </motion.group>

        {/* UI Elements - only show when game is started */}
        <motion.group
          initial={{ opacity: 0 }}
          animate={{ opacity: isStarted ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isStarted && (
            <>
              <ChessClock position={[-8, 3, 0]} />
              <EmojiPanel position={[8, 3, 0]} />
            </>
          )}
        </motion.group>

        {/* Game over message */}
        {isGameOver && (
          <motion.group
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            position={[0, 5, 0]}
          >
            <mesh>
              <planeGeometry args={[10, 3]} />
              <meshStandardMaterial 
                color="#1c2e4a" 
                transparent
                opacity={0.8}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
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
    </group>
  );
}