import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Define piece types and colors
export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
  isSelected?: boolean;
  onSelect?: () => void;
  onMove?: (position: [number, number, number]) => void;
}

// Get piece height based on type for proper positioning
const getPieceHeight = (type: PieceType) => {
  switch (type) {
    case "pawn": return 0.25;
    case "rook": return 0.3;
    case "knight": return 0.35;
    case "bishop": return 0.4;
    case "queen": return 0.45;
    case "king": return 0.5;
  }
};

// Get piece display symbols
const getPieceSymbol = (type: PieceType) => {
  switch (type) {
    case "pawn": return "Pawn";
    case "rook": return "Rook";
    case "knight": return "Knight";
    case "bishop": return "Bishop";
    case "queen": return "Queen";
    case "king": return "King";
  }
};

// Get base geometry for each piece type
const getPieceGeometry = (type: PieceType) => {
  switch (type) {
    case "pawn":
      return <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />;
    case "rook":
      return <boxGeometry args={[0.3, 0.6, 0.3]} />;
    case "knight":
      return <coneGeometry args={[0.25, 0.7, 16]} />;
    case "bishop":
      return <coneGeometry args={[0.25, 0.8, 16]} />;
    case "queen":
      return <cylinderGeometry args={[0.3, 0.1, 0.9, 16]} />;
    case "king":
      return <cylinderGeometry args={[0.3, 0.2, 1, 16]} />;
  }
};

export function ChessPiece({ 
  type, 
  color, 
  position, 
  isSelected = false,
  onSelect,
  onMove 
}: ChessPieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const pieceHeight = getPieceHeight(type);
  const pieceSymbol = getPieceSymbol(type);
  
  // Calculate text position based on piece height
  const textYPosition = pieceHeight + 0.3;
  
  // Adjusted position to center pieces on the board squares
  // This matches the positioning of the position labels in board.tsx
  const adjustedPosition: [number, number, number] = [
    position[0], // X remains the same
    position[1], // Y remains the same
    position[2]  // Z remains the same
  ];
  
  // Selection ring geometry for highlighting
  const selectionRing = (
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={isSelected}>
      <ringGeometry args={[0.4, 0.5, 32]} />
      <meshBasicMaterial color="#00ff00" transparent opacity={0.7} />
    </mesh>
  );

  return (
    <group 
      ref={groupRef} 
      position={adjustedPosition}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Highlight when hovered or selected */}
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={hovered && !isSelected}
      >
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      
      {/* Selection indicator */}
      {selectionRing}
      
      {/* Simple geometric shape for piece */}
      <mesh position={[0, pieceHeight / 2, 0]}>
        {getPieceGeometry(type)}
        <meshStandardMaterial 
          color={color === "white" ? "#EFEFEF" : "#333333"} 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Text label showing piece type */}
      <Text
        position={[0, textYPosition, 0]}
        fontSize={0.2}
        color={color === "white" ? "#FFFFFF" : "#000000"}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.02}
        outlineColor={color === "white" ? "#000000" : "#FFFFFF"}
      >
        {pieceSymbol}
      </Text>
    </group>
  );
}