import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload all models
useGLTF.preload('/models/pawn.gltf');
useGLTF.preload('/models/rook.gltf');
useGLTF.preload('/models/knight.gltf');
useGLTF.preload('/models/bishop.gltf');
useGLTF.preload('/models/queen.gltf');
useGLTF.preload('/models/king.gltf');

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
  isSelected, 
  onClick 
}: PieceProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovering, setHovering] = useState(false);

  // Map piece type to model path
  const getModelPath = () => {
    switch (type) {
      case 'p': return '/models/pawn.gltf';
      case 'r': return '/models/rook.gltf';
      case 'n': return '/models/knight.gltf';
      case 'b': return '/models/bishop.gltf';
      case 'q': return '/models/queen.gltf';
      case 'k': return '/models/king.gltf';
      default: return '/models/pawn.gltf';
    }
  };

  // Load the 3D model
  const { scene } = useGLTF(getModelPath());
  
  // Apply color to the model on mount
  useEffect(() => {
    if (scene) {
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          // Create a new material with the proper color
          node.material = new THREE.MeshStandardMaterial({
            color: color === 'white' ? '#f0f0f0' : '#202020',
            metalness: 0.3,
            roughness: 0.4
          });
        }
      });
    }
  }, [scene, color]);

  // Animation for selection
  useFrame(() => {
    if (groupRef.current) {
      // Only animate when selected
      if (isSelected) {
        // Just raise the piece when selected, no rotation
        const targetY = position[1] + 0.3;
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          targetY,
          0.1
        );
      } else {
        // Return to normal position
        const targetY = position[1];
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          targetY,
          0.1
        );
      }
    }
  });

  return (
    <motion.group 
      ref={groupRef}  
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
      animate={{
        // Only animate y position for selection
        y: isSelected ? position[1] + 0.3 : position[1]
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      // Scale the model to fit the board squares
      scale={0.15}
    >
      {/* Clone the model scene to ensure each piece has its own material */}
      <primitive object={scene.clone()} />
    </motion.group>
  );
}