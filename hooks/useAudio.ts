import { useRef, useCallback, useEffect } from 'react';

// A simple state management for music to avoid creating multiple loops
let musicInterval: number | null = null;
let audioCtx: AudioContext | null = null;

// --- Song Library ---
// Note Frequencies (for C minor and G minor scales to add variety)
const C4 = 261.63, D4 = 293.66, Eb4 = 311.13, F4 = 349.23, G4 = 392.00, Ab4 = 415.30, Bb4 = 466.16;
const C5 = 523.25;
const G3 = 196.00;

const songs = [
  // #1: Simple C minor arpeggio
  { notes: [C4, Eb4, G4, C5], tempo: 250, volume: 0.06 },
  // #2: Driving Bass Line
  { notes: [G3, G3, C4, G3], tempo: 200, volume: 0.08 },
  // #3: Upbeat Melody
  { notes: [G4, G4, Ab4, G4, F4, F4, Eb4], tempo: 180, volume: 0.07 },
  // #4: Mysterious Vibe
  { notes: [C4, D4, Eb4, D4], tempo: 400, volume: 0.05 },
  // #5: Fast-paced Action
  { notes: [C4, C4, G4, G4, Ab4, Ab4, G4], tempo: 150, volume: 0.08 },
  // #6: Hopeful Tune
  { notes: [Eb4, G4, Bb4, C5], tempo: 300, volume: 0.06 },
  // #7: A Short March
  { notes: [C4, C4, C4, Eb4, G4, G4], tempo: 220, volume: 0.07 },
  // #8: Bouncy Rhythm
  { notes: [C4, G3, C4, G3, Eb4, G3, Eb4], tempo: 190, volume: 0.08 },
  // #9: Cruising Song
  { notes: [F4, Eb4, D4, C4], tempo: 350, volume: 0.06 },
  // #10: Intense Arpeggio
  { notes: [C4, G4, C5, G4], tempo: 120, volume: 0.07 },
  // #11: Minimalist Pulse
  { notes: [C4, C4, C4, C4, G4, G4], tempo: 280, volume: 0.05 },
  // #12: Wavy Melody
  { notes: [C4, Eb4, F4, G4, F4, Eb4], tempo: 260, volume: 0.07 },
  // #13: Steady Beat
  { notes: [G3, Eb4, G3, F4], tempo: 210, volume: 0.08 },
  // #14: Simple Ascend
  { notes: [G3, C4, Eb4, G4], tempo: 320, volume: 0.06 },
  // #15: Slow Jam
  { notes: [C4, F4, Eb4, D4], tempo: 450, volume: 0.05 },
];


// Pre-generate a white noise buffer to be reused for the crash sound
const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
};
let noiseBuffer: AudioBuffer | null = null;

const createMusic = (song: typeof songs[0]) => {
  if (!audioCtx) return { stop: () => {} };
  
  let noteIndex = 0;
  
  const playNote = () => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine'; // Softer sine wave
    oscillator.frequency.value = song.notes[noteIndex];
    gainNode.gain.setValueAtTime(song.volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (song.tempo / 1000));
    
    oscillator.start(now);
    oscillator.stop(now + (song.tempo / 1000) + 0.05);

    noteIndex = (noteIndex + 1) % song.notes.length;
  };
  
  if (musicInterval) {
    clearInterval(musicInterval);
  }
  
  musicInterval = window.setInterval(playNote, song.tempo);

  const stop = () => {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  };

  return { stop };
};


export const useAudio = ({ isMusicMuted, isSfxMuted }: { isMusicMuted: boolean, isSfxMuted: boolean }) => {
  const musicNodeRef = useRef<{ stop: () => void } | null>(null);

  const init = useCallback(() => {
    if (!audioCtx && typeof window !== 'undefined') {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtx) {
            noiseBuffer = createNoiseBuffer(audioCtx);
        }
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
      }
    }
  }, []);
  
  // Ensure AudioContext is resumed if it was suspended
  useEffect(() => {
    if(audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, []);

  const playCollisionSound = useCallback(() => {
    if (isSfxMuted || !audioCtx || !noiseBuffer) return;
    const now = audioCtx.currentTime;

    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(now);
    source.stop(now + 0.25);
  }, [isSfxMuted]);

  const playPowerUpSound = useCallback(() => {
    if (isSfxMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((note, i) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(note, now + i * 0.1);
      gainNode.gain.setValueAtTime(0.3, now + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);
      
      oscillator.start(now + i * 0.1);
      oscillator.stop(now + i * 0.1 + 0.15);
    });
  }, [isSfxMuted]);

  const playOilSlickSound = useCallback(() => {
    if (isSfxMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }, [isSfxMuted]);

  const playSpeedBumpSound = useCallback(() => {
    if (isSfxMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(100, now);
    oscillator.frequency.exponentialRampToValueAtTime(60, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }, [isSfxMuted]);

  const playMineSound = useCallback(() => {
    if (isSfxMuted || !audioCtx || !noiseBuffer) return;
    const now = audioCtx.currentTime;

    // A short burst of noise for the explosion
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    noiseSource.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.1);

    // A quick, low-frequency tone for the "boom"
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }, [isSfxMuted]);

  const playCheckpointSound = useCallback(() => {
    if (isSfxMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [440.00, 587.33, 880.00]; // A4, D5, A5
    
    notes.forEach((note, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now + i * 0.08);
      gain.gain.setValueAtTime(0.3, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.1);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.12);
    });
  }, [isSfxMuted]);
  
  const playLifeUpSound = useCallback(() => {
    if (isSfxMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [C5, Eb4, G4, C5];
    
    notes.forEach((note, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now + i * 0.1);
      gain.gain.setValueAtTime(0.4, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  }, [isSfxMuted]);

  const playLoseLifeSound = useCallback(() => {
    if (isSfxMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }, [isSfxMuted]);

  const startMusic = useCallback(() => {
    if (isMusicMuted || !audioCtx) return;
    if (musicNodeRef.current) {
        musicNodeRef.current.stop();
    }
    // Pick a random song from the library
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    musicNodeRef.current = createMusic(randomSong);
  }, [isMusicMuted]);

  const stopMusic = useCallback(() => {
    if (musicNodeRef.current) {
      musicNodeRef.current.stop();
      musicNodeRef.current = null;
    }
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
  }, []);

  // Effect to stop music if muted dynamically
  useEffect(() => {
      if(isMusicMuted) {
          stopMusic();
      }
  }, [isMusicMuted, stopMusic]);

  return {
    init,
    playCollisionSound,
    playPowerUpSound,
    playOilSlickSound,
    playSpeedBumpSound,
    playMineSound,
    playCheckpointSound,
    playLifeUpSound,
    playLoseLifeSound,
    startMusic,
    stopMusic,
  };
};
