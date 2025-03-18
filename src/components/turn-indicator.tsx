// src/components/game/TurnIndicator.tsx
import { Text } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { PieceColor } from "../../types/chess";

interface TurnIndicatorProps {
  currentTurn: PieceColor;
  position: [number, number, number];
}

function TurnIndicator({ currentTurn, position }: TurnIndicatorProps) {
  return (
    <motion.group
      position={position}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <mesh scale={[4, 1, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial 
          color={currentTurn === 'white' ? '#ffffff' : '#000000'} 
          opacity={0.7}
          transparent
        />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.4}
        color={currentTurn === 'white' ? '#000000' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {`${currentTurn.toUpperCase()}'S TURN`}
      </Text>
    </motion.group>
  );
}

export default TurnIndicator;