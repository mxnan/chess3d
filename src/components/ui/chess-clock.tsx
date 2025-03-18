// src/components/ui/ChessClock.tsx
import { Text } from "@react-three/drei";
import { useState, useEffect } from "react";
import { motion } from "framer-motion-3d";

interface ChessClockProps {
  position: [number, number, number];
}

function ChessClock({ position }: ChessClockProps) {
  const [gameTime, setGameTime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <group position={position}>
      <motion.mesh
        position={[0, 0, 0]}
        scale={[3, 0.8, 0.2]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <boxGeometry />
        <meshStandardMaterial 
          color="#3498db"
          transparent 
          opacity={0.7} 
        />
      </motion.mesh>
      
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {formatTime(gameTime)}
      </Text>
    </group>
  );
}

export default ChessClock;