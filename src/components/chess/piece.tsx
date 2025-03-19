// src/components/chess/piece.tsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface PieceProps {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'white' | 'black';
  position: [number, number, number];
  square: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function Piece({ 
  type, 
  color, 
  position, 
  square, 
  isSelected, 
  onClick 
}: PieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovering, setHovering] = useState(false);

  // This would normally load 3D models, but for simplicity we'll use primitives
  const getPieceGeometry = () => {
    switch (type) {
      case 'p': return <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />;
      case 'r': return <boxGeometry args={[0.3, 0.3, 0.5]} />;
      case 'n': return <coneGeometry args={[0.25, 0.6, 16]} />;
      case 'b': return <sphereGeometry args={[0.3, 16, 16]} />;
      case 'q': return <dodecahedronGeometry args={[0.3, 0]} />;
      case 'k': return <cylinderGeometry args={[0.2, 0.2, 0.7, 4]} />;
      default: return <boxGeometry args={[0.3, 0.3, 0.3]} />;
    }
  };

  // Hover effect
  useFrame(() => {
    if (groupRef.current) {
      const targetY = position[1] + (isSelected ? 0.5 : hovering ? 0.4 : 0.3);
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.1
      );

      if (isSelected) {
        groupRef.current.rotation.y += 0.03;
      }
    }
  });

  return (
    <motion.group 
      ref={groupRef} 
      position={[position[0], position[1] + 0.3, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
      animate={{
        x: position[0],
        y: position[1] + (isSelected ? 0.5 : 0.3),
        z: position[2],
        rotateY: isSelected ? 0.03 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
    >
      <mesh castShadow receiveShadow>
        {getPieceGeometry()}
        <meshStandardMaterial 
          color={color === 'white' ? '#f0f0f0' : '#202020'} 
          metalness={0.3} 
          roughness={0.4}
        />
      </mesh>
    </motion.group>
  );
}