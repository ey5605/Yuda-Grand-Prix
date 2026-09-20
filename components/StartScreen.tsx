import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  onShowHelp: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowHelp }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-white">Ready to Race?</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        Dodge the oncoming traffic for as long as you can. The longer you survive, the higher your score. Good luck!
      </p>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 mb-4"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
      >
        Start Game
      </button>
      <button
        onClick={onShowHelp}
        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
      >
        How to Play
      </button>
    </div>
  );
};

export default StartScreen;