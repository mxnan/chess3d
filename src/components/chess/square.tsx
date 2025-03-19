// src/components/chess/square.tsx
import { useRef } from 'react';
import * as THREE from 'three';

interface SquareProps {
  position: [number, number, number];
  color: 'light' | 'dark';
  isSelected: boolean;
  isLegalMove: boolean;
  onClick: () => void;
}

export default function Square({ 
  position, 
  color, 
  isSelected, 
  isLegalMove, 
  onClick 
}: SquareProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Determine the square color based on state
  let squareColor;
  if (isSelected) {
    squareColor = '#5a9e5a'; // Darker green for selected square
  } else if (isLegalMove) {
    squareColor = '#5a5abe'; // Blue for legal moves
  } else {
    squareColor = color === 'light' ? '#E6D0AB' : '#A97A65';
  }
  
  return (
    <mesh 
      ref={meshRef}
      position={position} 
      rotation={[Math.PI / 2, 0, 0]} 
      onClick={onClick}
      receiveShadow
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial 
        color={squareColor} 
        metalness={0.1} 
        roughness={0.8}
      />
      
      {/* Add a subtle indicator for legal moves */}
      {isLegalMove && (
        <mesh position={[0, 0, 0.06]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.6} />
        </mesh>
      )}
    </mesh>
  );
}