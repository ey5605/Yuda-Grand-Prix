import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import HelpModal from './components/HelpModal';
import PauseScreen from './components/PauseScreen';
import { GameState } from './types';
import { HIGH_SCORE_KEY } from './constants';
import { useAudio } from './hooks/useAudio';
import SoundOnIcon from './components/SoundOnIcon';
import SoundOffIcon from './components/SoundOffIcon';
import MusicOnIcon from './components/MusicOnIcon';
import MusicOffIcon from './components/MusicOffIcon';
import PauseIcon from './components/PauseIcon';
import PlayIcon from './components/PlayIcon';

const MUSIC_MUTE_KEY = 'yudaGrandPrixMusicMuted';
const SFX_MUTE_KEY = 'yudaGrandPrixSfxMuted';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.StartScreen);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    const storedMute = localStorage.getItem(MUSIC_MUTE_KEY);
    return storedMute === 'true';
  });
  
  const [isSfxMuted, setIsSfxMuted] = useState(() => {
    const storedMute = localStorage.getItem(SFX_MUTE_KEY);
    return storedMute === 'true';
  });

  const audio = useAudio({ isMusicMuted, isSfxMuted });

  useEffect(() => {
    const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem(MUSIC_MUTE_KEY, isMusicMuted.toString());
  }, [isMusicMuted]);
  
  useEffect(() => {
    localStorage.setItem(SFX_MUTE_KEY, isSfxMuted.toString());
  }, [isSfxMuted]);

  const toggleMusicMute = () => {
    setIsMusicMuted(prev => {
        const isCurrentlyMuted = !prev;
        if(isCurrentlyMuted) {
            audio.stopMusic();
        } else {
            if(gameState === GameState.Playing) {
                 audio.startMusic();
            }
        }
        return isCurrentlyMuted;
    });
  };
  
  const toggleSfxMute = () => {
    setIsSfxMuted(prev => !prev);
  };

  const startGame = useCallback(() => {
    audio.init();
    if (!isMusicMuted) {
        audio.startMusic();
    }
    setScore(0);
    setGameState(GameState.Playing);
  }, [audio, isMusicMuted]);

  const gameOver = useCallback((finalScore: number) => {
    audio.stopMusic();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
    }
    setGameState(GameState.GameOver);
  }, [highScore, audio]);
  
  const togglePause = () => {
    if (gameState === GameState.Playing) {
      setGameState(GameState.Paused);
      audio.stopMusic();
    } else if (gameState === GameState.Paused) {
      setGameState(GameState.Playing);
      if (!isMusicMuted) {
          audio.startMusic();
      }
    }
  };
  
  const quitGame = () => {
      audio.stopMusic();
      setGameState(GameState.StartScreen);
  };
  
  const showHelp = () => setIsHelpVisible(true);
  const hideHelp = () => setIsHelpVisible(false);

  const renderGameState = () => {
    switch (gameState) {
      case GameState.StartScreen:
        return <StartScreen onStart={startGame} onShowHelp={showHelp} />;
      case GameState.Playing:
      case GameState.Paused:
        return (
          <>
            <GameCanvas onGameOver={gameOver} audio={audio} gameState={gameState} />
            {gameState === GameState.Paused && <PauseScreen onResume={togglePause} onQuit={quitGame} />}
          </>
        );
      case GameState.GameOver:
        return <GameOverScreen score={score} highScore={highScore} onRestart={startGame} onShowHelp={showHelp} />;
      default:
        return <StartScreen onStart={startGame} onShowHelp={showHelp} />;
    }
  };

  const isGameActive = gameState === GameState.Playing || gameState === GameState.Paused;

  return (
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-mono p-4 ${isShaking ? 'shake' : ''}`}>
      {isHelpVisible && <HelpModal onClose={hideHelp} />}
      <header className="absolute top-0 left-0 right-0 p-2 z-10">
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 text-center whitespace-nowrap" style={{ textShadow: '0 0 8px #0891b2, 0 0 16px #0891b2' }}>
              Yuda Grand Prix
            </h1>
            
            <div className={`w-full flex items-center -mt-2 ${isGameActive ? 'justify-between' : 'justify-center'}`}>
                {isGameActive && (
                 <button 
                    onClick={togglePause} 
                    className="p-2 rounded-full hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                    aria-label={gameState === GameState.Paused ? "Resume game" : "Pause game"}
                    >
                    {gameState === GameState.Paused ? <PlayIcon /> : <PauseIcon />}
                 </button>
                )}
                <div className="flex items-center gap-2">
                    <button 
                      onClick={toggleSfxMute} 
                      className="p-1 rounded-full hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                      aria-label={isSfxMuted ? "Unmute sound effects" : "Mute sound effects"}
                      >
                      {isSfxMuted ? <SoundOffIcon /> : <SoundOnIcon />}
                    </button>
                    <button 
                      onClick={toggleMusicMute} 
                      className="p-1 rounded-full hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                      aria-label={isMusicMuted ? "Unmute music" : "Mute music"}
                      >
                      {isMusicMuted ? <MusicOffIcon /> : <MusicOnIcon />}
                    </button>
                </div>
            </div>
        </div>
      </header>
      <main className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl aspect-[9/16] md:aspect-auto md:h-[80vh] bg-black rounded-lg shadow-2xl shadow-cyan-500/20 flex items-center justify-center overflow-hidden crt-effect">
        {renderGameState()}
        <div className="absolute inset-0 pointer-events-none overlay"></div>
      </main>
    </div>
  );
};

export default App;