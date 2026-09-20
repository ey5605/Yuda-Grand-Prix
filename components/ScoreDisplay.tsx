
import React from 'react';

interface ScoreDisplayProps {
  label: string;
  score: number;
  isHighScore?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ label, score, isHighScore = false }) => {
  const textColor = isHighScore ? 'text-yellow-400' : 'text-white';

  return (
    <div className="bg-gray-900/70 p-4 rounded-lg w-48 text-center shadow-inner">
      <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-4xl font-bold ${textColor}`}>{score}</p>
    </div>
  );
};

export default ScoreDisplay;
