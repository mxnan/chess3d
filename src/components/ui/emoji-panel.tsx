// src/components/ui/EmojiPanel.tsx
import { Text } from "@react-three/drei";
import { useState } from "react";
import { motion } from "framer-motion-3d";

interface EmojiPanelProps {
  position: [number, number, number];
}

type Emoji = "👍" | "👎" | "😊" | "😢" | "🎉" | "🤔" | "😎" | "🌟";

function EmojiPanel({ position }: EmojiPanelProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const emojis: Emoji[] = ["👍", "👎", "😊", "😢", "🎉", "🤔", "😎", "🌟"];

  const handleEmojiClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);

    // Reset emoji after a few seconds
    setTimeout(() => {
      setSelectedEmoji(null);
    }, 3000);
  };

  return (
    <group position={position}>
      {/* Main panel - front side (grid) */}
      <motion.group
        position={[0, 0, 0]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Panel background */}
        <mesh scale={[3, 3, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#2c3e50" transparent opacity={0.9} />
        </mesh>

        {/* Grid lines */}
        {/* {[...Array(4)].map((_, i) => (
          <group key={`grid-${i}`}>
           
            <mesh position={[0, -1.5 + i, 0.06]} scale={[3, 0.01, 0.01]}>
              <boxGeometry />
              <meshStandardMaterial color="#3498db" opacity={0.5} transparent />
            </mesh>
          
            <mesh position={[-1.5 + i, 0, 0.06]} scale={[0.01, 3, 0.01]}>
              <boxGeometry />
              <meshStandardMaterial color="#3498db" opacity={0.5} transparent />
            </mesh>
          </group>
        ))} */}

        {/* Emoji grid */}
        <group position={[-1.125, 1.125, 0.1]}>
          {emojis.map((emoji, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            return (
              <motion.group
                key={emoji}
                position={[col * 0.75, -row * 0.75, 0]}
                whileHover={{ scale: 1.2, z: 0.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEmojiClick(emoji)}
              >
                <Text
                  fontSize={0.3}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {emoji}
                </Text>
              </motion.group>
            );
          })}
        </group>

        {/* Panel frame */}
        <mesh position={[0, 0, -0.05]} scale={[3.2, 3.2, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial
            color="#3498db"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </motion.group>

      {/* Back panel - for other players to see selected emoji */}
      <group position={[0, 0, -0.2]}>
        {/* Back panel background */}
        <mesh scale={[3, 3, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#2c3e50" transparent opacity={0.9} />
        </mesh>

        {/* Selected emoji display */}
        {selectedEmoji && (
          <motion.group
            position={[0, 0, 4]}
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <Text
              fontSize={0.8}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {selectedEmoji} + ${"dbnshbd"} 
            </Text>
          </motion.group>
        )}

        {/* Back panel frame */}
        <mesh position={[0, 0, -0.05]} scale={[3.2, 3.2, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial
            color="#3498db"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

export default EmojiPanel;
