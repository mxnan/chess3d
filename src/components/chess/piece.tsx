import { useRef, useState } from "react";
import { motion } from "framer-motion-3d";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PieceProps {
  type: "p" | "n" | "b" | "r" | "q" | "k";
  color: "white" | "black";
  position: [number, number, number];
  square: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function Piece({
  type,
  color,
  position,
  isSelected,
  onClick,
}: PieceProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovering, setHovering] = useState(false);

  // Get piece symbol for display
  const getPieceSymbol = () => {
    switch (type) {
      case "p":
        return "P";
      case "r":
        return "R";
      case "n":
        return "N";
      case "b":
        return "B";
      case "q":
        return "Q";
      case "k":
        return "K";
      default:
        return "?";
    }
  };

  // Get piece geometry based on type
  const getPieceGeometry = () => {
    switch (type) {
      case "p":
        return <cylinderGeometry args={[0.3, 0.3, 0.7, 16]} />;
      case "r":
        return <boxGeometry args={[0.5, 0.7, 0.5]} />;
      case "n":
        return <coneGeometry args={[0.3, 0.7, 16]} />;
      case "b":
        return <sphereGeometry args={[0.4, 16, 16]} />;
      case "q":
        return <dodecahedronGeometry args={[0.4, 0]} />;
      case "k":
        return <cylinderGeometry args={[0.3, 0.3, 0.9, 8]} />;
      default:
        return <boxGeometry args={[0.4, 0.6, 0.4]} />;
    }
  };

  return (
    <motion.group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
      // Add a subtle hover effect without movement
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Piece base */}
      <mesh castShadow receiveShadow>
        {getPieceGeometry()}
        <meshStandardMaterial
          color={color === "white" ? "#f0f0f0" : "#202020"}
          metalness={0.3}
          roughness={0.4}
          // Highlight effect when selected
          emissive={isSelected ? new THREE.Color(0x003300) : undefined}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Piece identifier text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color={color === "white" ? "#202020" : "#f0f0f0"}
        anchorX="center"
        anchorY="middle"
      >
        {getPieceSymbol()}
      </Text>

      {/* Highlight ring for selected piece */}
      {isSelected && (
        <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="#00ff00" side={THREE.DoubleSide} />
        </mesh>
      )}
    </motion.group>
  );
}