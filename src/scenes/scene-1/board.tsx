import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

function ChessBoard() {
  // Create chessboard material with 8x8 squares
  const chessboardMaterial = useMemo(() => {
    const size = 8;
    const boardSize = 1024; // Power of 2 for better texture performance
    const squareSize = boardSize / size;
    const data = new Uint8Array(boardSize * boardSize * 4);

    const lightColor = [255, 255, 255, 128]; // Light square color (transparent white)
    const darkColor = [0, 0, 0, 128]; // Dark square color (transparent black)

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const squareX = Math.floor(i / squareSize);
        const squareY = Math.floor(j / squareSize);

        // Determine if this is a light or dark square
        const isLight = (squareX + squareY) % 2 === 0;
        const color = isLight ? lightColor : darkColor;

        // Set color for this pixel
        const idx = (i * boardSize + j) * 4;
        data[idx] = color[0]; // R
        data[idx + 1] = color[1]; // G
        data[idx + 2] = color[2]; // B
        data[idx + 3] = color[3]; // A
      }
    }

    const texture = new THREE.DataTexture(
      data,
      boardSize,
      boardSize,
      THREE.RGBAFormat
    );
    texture.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.5,
      metalness: 0.1,
    });
  }, []);

  // Generate position labels for the chessboard
  const positionLabels = useMemo(() => {
    const labels = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const position = `${files[file]}${ranks[rank]}`;
        // Calculate position in 3D space
        // Convert from chess coordinates to 3D coordinates
        // Start from bottom left, -3.5 to +3.5 for 8 squares
        const x = file - 3.5 + 0.5; // +0.5 to center in square
        const z = rank - 3.5 + 0.5; // +0.5 to center in square

        labels.push(
          <Text
            key={position}
            position={[x - 0.5, 0.01, z - 0.5]} // Just above the board
            rotation={[-Math.PI / 2, 0, 0]} // Flat on the board
            fontSize={0.15}
            color="#555555"
            anchorX="center"
            anchorY="middle"
          >
            {position}
          </Text>
        );
      }
    }

    return labels;
  }, []);

  return (
    <RigidBody type="fixed" position={[0, 0, 0]} friction={2}>
      {/* Chessboard */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <primitive object={chessboardMaterial} />
      </mesh>

      {/* Position labels */}
      {positionLabels}
    </RigidBody>
  );
}

export default ChessBoard;
