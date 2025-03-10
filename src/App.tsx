import { Canvas } from "@react-three/fiber";
import SceneOne from "./scenes/scene-1";

function App() {
  return (
    <main className="h-[100vh] w-full select-none">
      <Canvas
        shadows
        camera={{
          position: [0, 100, 0], // Position camera exactly at top of origin
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <SceneOne />
      </Canvas>
    </main>
  );
}

export default App;
