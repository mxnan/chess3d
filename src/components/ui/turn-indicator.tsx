// src/components/ui/turn-indicator.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TurnIndicatorProps {
  currentTurn: 'white' | 'black';
  position?: [number, number, number];
}

export default function TurnIndicator({ 
  currentTurn, 
  position = [0, 0.5, -8]
}: TurnIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[5, 1.5, 0.2]} />
        <meshStandardMaterial 
          color={currentTurn === 'white' ? '#ffffff' : '#333333'} 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.5}
        color={currentTurn === 'white' ? '#333333' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {`${currentTurn.toUpperCase()}'S TURN`}
      </Text>
    </group>
  );
}