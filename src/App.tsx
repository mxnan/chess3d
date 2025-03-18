import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import GameScene from "./scenes/game-scene";
import StartDialog from "./components/ui/start-dialog";

function App() {
  const [gameState, setGameState] = useState({
    isStarted: false,
    playerName: "",
    roomCode: ""
  });

  const handleGameStart = (name: string, roomCode: string) => {
    setGameState({
      isStarted: true,
      playerName: name,
      roomCode
    });
  };

  return (
    <main className="h-[100vh] w-full select-none relative">
      <Canvas
        shadows
        camera={{
          position: [0, 15, 15],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <GameScene gameState={gameState} />
      </Canvas>

      {/* Overlay dialog */}
      {!gameState.isStarted && (
        <div className="absolute inset-0 pointer-events-none">
          <StartDialog onStart={handleGameStart} />
        </div>
      )}
    </main>
  );
}

export default App;
