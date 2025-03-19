import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useGameStore } from "../../store/gamestore";
import * as THREE from "three";

interface ChessClockProps {
  position?: [number, number, number];
}

export default function ChessClock({ position = [0, 0, 0] }: ChessClockProps) {
  const gameTime = useGameStore(state => state.gameTime);
  const currentTurn = useGameStore(state => state.currentTurn);
  const groupRef = useRef<THREE.Group>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Subtle floating animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <motion.group 
      ref={groupRef} 
      position={position}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Clock frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[4, 1.5, 0.2]} />
        <meshStandardMaterial 
          color="#303030" 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Clock display panel */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[3.8, 1.3, 0.05]} />
        <meshStandardMaterial 
          color="#12151a"
          emissive="#072d54"
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>
      
      {/* Game time display */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.8}
        color="#19b0ff"
        // font="/fonts/digital-7.ttf" // You'll need to add this font to your public folder
        anchorX="center"
        anchorY="middle"
      >
        {formatTime(gameTime)}
      </Text>
      
      {/* Turn indicator */}
      <motion.mesh
        position={[0, -0.9, 0.15]}
        animate={{ 
          x: currentTurn === 'white' ? -1.5 : 1.5 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={currentTurn === 'white' ? '#ffffff' : '#222222'} 
          emissive={currentTurn === 'white' ? '#cccccc' : '#111111'}
          emissiveIntensity={0.5}
        />
      </motion.mesh>
      
      {/* White label */}
      <Text
        position={[-1.5, -0.9, 0.2]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        WHITE
      </Text>
      
      {/* Black label */}
      <Text
        position={[1.5, -0.9, 0.2]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        BLACK
      </Text>
    </motion.group>
  );
}