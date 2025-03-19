// src/components/ui/StartDialog.tsx
import { useState } from "react";

interface StartDialogProps {
  onStart: (playerName: string, roomCode: string) => void;
}

function StartDialog({ onStart }: StartDialogProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsSubmitting(true);
      // Call onStart immediately
      onStart(playerName.trim(), roomCode.trim());
    }
  };

  return (
    <div className="pointer-events-auto">
      <div 
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
      >
        <div 
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-blue-500 w-96 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-white mb-6 text-center">Space Chess</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-400 mb-2">Player Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-gray-800/90 text-white px-4 py-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-blue-400 mb-2">Room Code (Optional)</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full bg-gray-800/90 text-white px-4 py-2 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room code"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className={`w-full ${isSubmitting ? 'bg-blue-800' : 'bg-blue-600/90 hover:bg-blue-700'} text-white font-bold py-3 px-4 rounded transition-colors mt-6`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Starting..." : "Start Game"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StartDialog;