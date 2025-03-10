import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { 
   
  OrbitControls, 
  Stars,
} from "@react-three/drei";
import ChessBoard from "./scene-1/board";

function SpaceBackground() {
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
      
      {/* add meshes for player icons  */}
      <mesh position={[0, 0, -40]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#ff7f50" transparent opacity={0.4} /> {/* Coral color */}
      </mesh>
{/* add meshes for player icons  */}
      <mesh position={[0, 0, 40]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#4682b4" transparent opacity={0.4} /> {/* Steel Blue color */}
      </mesh>
    </>
  );
}

function SceneOne() {
  return (
    <>
      {/* Ambient light for basic visibility */}
      <ambientLight intensity={0.3} />
      
      {/* Directional light like sun */}
      <directionalLight 
        position={[15, 20, 15]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10} 
      />
      
      {/* Additional light from another angle */}
      <pointLight position={[-10, 15, -10]} intensity={0.5} color="#6e90f5" />
      
      <Suspense fallback={null}>
        <Physics debug={false}>
          <ChessBoard />
        </Physics>
        
        {/* Space background */}
        <SpaceBackground />
        
        <OrbitControls 
          maxPolarAngle={Math.PI / 2.1} // Prevent camera from going below ground
          minDistance={5}
          maxDistance={25}
        />
      </Suspense>
    </>
  );
}

export default SceneOne;
