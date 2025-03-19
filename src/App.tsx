import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { useGameStore } from "./store/gamestore";
import GameScene from "./scenes/game-scene";
import StartDialog from "./components/ui/start-dialog";

function App() {
  const isStarted = useGameStore(state => state.isStarted);
  const createGame = useGameStore(state => state.createGame);
  
  // Keep track of dialog visibility separately from game state
  const [showDialog, setShowDialog] = useState(!isStarted);
  
  // When the game starts, animate out the dialog
  useEffect(() => {
    if (isStarted) {
      // Delay hiding the dialog to allow for transition
      const timer = setTimeout(() => {
        setShowDialog(false);
      }, 300); // Match this with your animation duration
      return () => clearTimeout(timer);
    } else {
      setShowDialog(true);
    }
  }, [isStarted]);

  const handleGameStart = (name: string, roomCode: string) => {
    // Set the game state but don't immediately hide the dialog
    createGame(name, roomCode);
  };

  return (
    <main className="h-[100vh] w-full select-none relative">
      {/* Canvas is always rendered and never remounted */}
      <Canvas
        shadows
        camera={{
          position: [0, 15, 15],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        // Add fade in to prevent initial flash
        style={{ 
          background: 'black', // Ensure consistent background color
          opacity: 1,          // No transparency
          transition: 'opacity 0.3s ease-in-out' // Smooth opacity changes
        }}
      >
        <Suspense fallback={null}>
          <GameScene />
        </Suspense>
      </Canvas>

      {/* Overlay dialog - use CSS for smooth transitions */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: showDialog ? 1 : 0,
          pointerEvents: showDialog ? 'auto' : 'none'
        }}
      >
        {showDialog && <StartDialog onStart={handleGameStart} />}
      </div>
    </main>
  );
}

export default App;