import React from 'react';

interface PauseScreenProps {
  onResume: () => void;
  onQuit: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onQuit }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-8 z-20">
      <h2 className="text-5xl font-bold mb-8 text-cyan-400" style={{ textShadow: '0 0 8px #0891b2' }}>Paused</h2>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={onResume}
          className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
        >
          Resume
        </button>
        <button
          onClick={onQuit}
          className="px-8 py-3 bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-500 transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-400"
        >
          Quit Game
        </button>
      </div>
    </div>
  );
};

export default PauseScreen;