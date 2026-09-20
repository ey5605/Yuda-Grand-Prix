import React from 'react';
import ScoreDisplay from './ScoreDisplay';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onShowHelp: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart, onShowHelp }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg">
      <h2 className="text-5xl font-bold mb-6 text-red-500">Game Over</h2>
      
      <div className="flex flex-col items-center md:flex-row gap-4 md:gap-8 mb-8 w-full justify-center">
        <ScoreDisplay label="Your Score" score={score} />
        <ScoreDisplay label="High Score" score={highScore} isHighScore={true} />
      </div>

      <button
        onClick={onRestart}
        className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-cyan-400 transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 mb-4"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
      >
        Play Again
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

export default GameOverScreen;
