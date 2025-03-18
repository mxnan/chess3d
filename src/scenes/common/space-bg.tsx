// src/scenes/common/SpaceBackground.tsx
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion-3d";

interface SpaceBackgroundProps {
  showPlayerIcons?: boolean;
}

function SpaceBackground({ showPlayerIcons = true }: SpaceBackgroundProps) {
  return (
    <>
      {/* Create dense star field for space background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Player icons */}
      {showPlayerIcons && (
        <>
          <motion.mesh 
            position={[0, 0, -40]}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: 3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <sphereGeometry args={[20, 32, 32]} />
            <meshBasicMaterial
              color="#ff0000"
              transparent
              opacity={0.6}
            />
          </motion.mesh>
          
          <motion.mesh 
            position={[0, 0, 40]}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: 3, 
              ease: [0.4, 0, 0.2, 1],
              delay: 1.5
            }}
          >
            <sphereGeometry args={[20, 32, 32]} />
            <meshBasicMaterial
              color="#0000ff"
              transparent
              opacity={0.6}
            />
          </motion.mesh>
        </>
      )}
    </>
  );
}

export default SpaceBackground;