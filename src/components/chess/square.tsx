// src/components/chess/square.tsx
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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
  
  useFrame(() => {
    if (meshRef.current && (isSelected || isLegalMove)) {
      const time = Date.now() * 0.001;
      meshRef.current.position.y = position[1] + Math.sin(time * 3) * 0.05;
    }
  });
  
  let squareColor;
  if (isSelected) {
    squareColor = '#00ff00';
  } else if (isLegalMove) {
    squareColor = '#ffff00';
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
    </mesh>
  );
}