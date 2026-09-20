import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Car, RoadLine, OpponentCar, OpponentType, Obstacle, ObstacleType, GameState, Checkpoint, PowerUp } from '../types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ROAD_WIDTH_PERCENTAGE,
  LANE_COUNT,
  PLAYER_CAR_WIDTH,
  PLAYER_CAR_HEIGHT,
  PLAYER_CAR_SPEED,
  PLAYER_CAR_START_Y,
  OPPONENT_CAR_WIDTH,
  OPPONENT_CAR_HEIGHT,
  OPPONENT_SPAWN_INTERVAL,
  ROAD_LINE_WIDTH,
  ROAD_LINE_HEIGHT,
  ROAD_LINE_GAP,
  ROAD_COLOR,
  ROAD_LINE_COLOR,
  AMIT_CAR_WIDTH,
  AMIT_CAR_HEIGHT,
  AMIT_SPAWN_CHANCE,
  POWER_UP_COLOR,
  OIL_SLICK_WIDTH,
  OIL_SLICK_HEIGHT,
  BARRIER_WIDTH,
  BARRIER_HEIGHT,
  OBSTACLE_SPAWN_INTERVAL,
  INITIAL_OBSTACLE_SPAWN_CHANCE,
  PLAYER_SPIN_DURATION,
  BARRIER_COLOR_1,
  BARRIER_COLOR_2,
  PLAYER_ACCELERATION,
  PLAYER_BRAKING,
  PLAYER_NATURAL_DECELERATION,
  MIN_SPEED,
  DEFAULT_SPEED,
  MAX_SPEED,
  PLAYER_CAR_MIN_Y,
  PLAYER_CAR_MAX_Y,
  PLAYER_VERTICAL_SPEED,
  SPEED_BUMP_WIDTH,
  SPEED_BUMP_HEIGHT,
  SPEED_BUMP_SLOW_DURATION,
  MINE_WIDTH,
  MINE_HEIGHT,
  MINE_SPIN_DURATION,
  SPEED_BUMP_COLOR,
  MINE_BODY_COLOR,
  MINE_LIGHT_COLOR,
  CHECKPOINT_INTERVAL,
  CHECKPOINT_HEIGHT,
  CHECKPOINT_COLOR,
  INITIAL_LIVES,
  RESPAWN_INVINCIBILITY_DURATION,
  LIFE_POWERUP_WIDTH,
  LIFE_POWERUP_HEIGHT,
  LIFE_POWERUP_SPAWN_INTERVAL,
  LIFE_POWERUP_SPAWN_CHANCE,
  LIFE_POWERUP_COLOR,
} from '../constants';
import { useAudio } from '../hooks/useAudio';
import { drawBackground, initBackground } from '../assets';

interface GameCanvasProps {
  onGameOver: (score: number) => void;
  audio: ReturnType<typeof useAudio>;
  gameState: GameState;
}

const drawPlayerCar = (ctx: CanvasRenderingContext2D, car: Car) => {
    // Main body (red)
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // Windshield (light blue)
    ctx.fillStyle = '#38bdf8'; // sky-400
    ctx.fillRect(car.x + car.width * 0.1, car.y + car.height * 0.1, car.width * 0.8, car.height * 0.25);
    
    // Roof (darker red)
    ctx.fillStyle = '#b91c1c'; // red-700
    ctx.fillRect(car.x + car.width * 0.1, car.y + car.height * 0.4, car.width * 0.8, car.height * 0.4);

    // Headlights (yellow)
    ctx.fillStyle = '#facc15'; // yellow-400
    ctx.fillRect(car.x, car.y, car.width * 0.2, car.height * 0.1);
    ctx.fillRect(car.x + car.width * 0.8, car.y, car.width * 0.2, car.height * 0.1);
};

const drawOpponentCar = (ctx: CanvasRenderingContext2D, car: Car) => {
    // Main body (blue)
    ctx.fillStyle = '#3b82f6'; // blue-500
    ctx.fillRect(car.x, car.y, car.width, car.height);

    // Windshield (light gray)
    ctx.fillStyle = '#d1d5db'; // gray-300
    ctx.fillRect(car.x + car.width * 0.1, car.y + car.height * 0.1, car.width * 0.8, car.height * 0.3);

    // Roof (darker blue)
    ctx.fillStyle = '#1d4ed8'; // blue-700
    ctx.fillRect(car.x + car.width * 0.1, car.y + car.height * 0.45, car.width * 0.8, car.height * 0.5);
    
    // Taillights (red)
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.fillRect(car.x, car.y + car.height * 0.9, car.width * 0.2, car.height * 0.1);
    ctx.fillRect(car.x + car.width * 0.8, car.y + car.height * 0.9, car.width * 0.2, car.height * 0.1);
};

const drawAmitCar = (ctx: CanvasRenderingContext2D, car: Car) => {
    ctx.save();
    // Translate to the center of the car to rotate around it
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    // Rotate to give a 'drifting' effect
    ctx.rotate(5 * Math.PI / 180);

    const carX = -car.width / 2;
    const carY = -car.height / 2;

    // Spoiler (dark gray)
    ctx.fillStyle = '#374151'; // gray-700
    const spoilerHeight = 8;
    ctx.fillRect(carX - 2, carY + car.height - spoilerHeight / 2, car.width + 4, spoilerHeight);

    // Car Body (green)
    ctx.fillStyle = '#84cc16'; // lime-500
    ctx.fillRect(carX, carY, car.width, car.height);
    
    // Racing stripe (black)
    ctx.fillStyle = '#1f2937'; // gray-800
    const stripeWidth = car.width * 0.2;
    ctx.fillRect(-stripeWidth / 2, carY, stripeWidth, car.height);

    // Windshield (dark gray)
    ctx.fillStyle = '#4b5563'; // gray-600
    ctx.fillRect(carX + car.width * 0.1, carY + car.height * 0.1, car.width * 0.8, car.height * 0.3);

    // Roof (darker green)
    ctx.fillStyle = '#4d7c0f'; // lime-800
    ctx.fillRect(carX + car.width * 0.1, carY + car.height * 0.45, car.width * 0.8, car.height * 0.5);

    // Taillights (red)
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.fillRect(carX, carY + car.height * 0.9, car.width * 0.2, car.height * 0.1);
    ctx.fillRect(carX + car.width * 0.8, carY + car.height * 0.9, car.width * 0.2, car.height * 0.1);

    ctx.restore();

    // Tire smoke puffs
    ctx.fillStyle = 'rgba(209, 213, 219, 0.5)'; // gray-300 with transparency
    // Left tire smoke
    ctx.beginPath();
    ctx.arc(car.x, car.y + car.height, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(car.x - 10, car.y + car.height - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    // Right tire smoke
    ctx.beginPath();
    ctx.arc(car.x + car.width, car.y + car.height, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(car.x + car.width + 10, car.y + car.height - 5, 10, 0, Math.PI * 2);
    ctx.fill();
};

const drawOilSlick = (ctx: CanvasRenderingContext2D, slick: Obstacle) => {
    ctx.fillStyle = 'rgba(40, 40, 40, 0.7)';
    ctx.beginPath();
    // Use ellipse to create a puddle shape
    ctx.ellipse(slick.x + slick.width / 2, slick.y + slick.height / 2, slick.width / 2, slick.height / 2, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();

    // Add a smaller, darker patch for texture
    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
    ctx.beginPath();
    ctx.ellipse(slick.x + slick.width * 0.6, slick.y + slick.height * 0.6, slick.width / 3, slick.height / 3, Math.PI / 6, 0, 2 * Math.PI);
    ctx.fill();
};

const drawBarrier = (ctx: CanvasRenderingContext2D, barrier: Obstacle) => {
    const stripeWidth = barrier.width / 6;
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 === 0 ? BARRIER_COLOR_1 : BARRIER_COLOR_2;
        ctx.fillRect(barrier.x + i * stripeWidth, barrier.y, stripeWidth, barrier.height);
    }
    // Add a simple border
    ctx.strokeStyle = '#1f2937'; // gray-800
    ctx.lineWidth = 2;
    ctx.strokeRect(barrier.x, barrier.y, barrier.width, barrier.height);
};

const drawSpeedBump = (ctx: CanvasRenderingContext2D, bump: Obstacle) => {
    ctx.fillStyle = SPEED_BUMP_COLOR;
    ctx.fillRect(bump.x, bump.y, bump.width, bump.height);
    // Add some darker stripes for texture
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    const stripeHeight = 4;
    for (let i = 0; i < bump.height; i += stripeHeight * 2) {
        ctx.fillRect(bump.x, bump.y + i, bump.width, stripeHeight);
    }
};

const drawMine = (ctx: CanvasRenderingContext2D, mine: Obstacle, gameTick: number) => {
    const centerX = mine.x + mine.width / 2;
    const centerY = mine.y + mine.height / 2;
    const radius = mine.width / 2;

    // Main body
    ctx.fillStyle = MINE_BODY_COLOR;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Blinking light
    if (gameTick % 40 < 20) { // Blink every 40 ticks
        ctx.fillStyle = MINE_LIGHT_COLOR;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
};

const drawCheckpoint = (ctx: CanvasRenderingContext2D, checkpoint: Checkpoint) => {
    const roadWidth = CANVAS_WIDTH * ROAD_WIDTH_PERCENTAGE;
    const roadLeft = (CANVAS_WIDTH - roadWidth) / 2;
    
    // The banner
    ctx.fillStyle = CHECKPOINT_COLOR;
    ctx.fillRect(roadLeft, checkpoint.y, roadWidth, CHECKPOINT_HEIGHT);

    // Glowing line effect
    ctx.fillStyle = 'rgba(100, 255, 255, 0.8)';
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 15;
    ctx.fillRect(roadLeft, checkpoint.y, roadWidth, 2);
    ctx.fillRect(roadLeft, checkpoint.y + CHECKPOINT_HEIGHT - 2, roadWidth, 2);
    ctx.shadowBlur = 0;

    // Text
    ctx.font = 'bold 16px "Courier New", Courier, monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.fillText('CHECKPOINT', CANVAS_WIDTH / 2, checkpoint.y + CHECKPOINT_HEIGHT / 2 + 6);
    ctx.shadowBlur = 0;
};

const heartPath = new Path2D("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");

const drawLifePowerUp = (ctx: CanvasRenderingContext2D, powerUp: PowerUp) => {
    ctx.save();
    ctx.translate(powerUp.x, powerUp.y);
    const scale = Math.min(powerUp.width / 24, powerUp.height / 24);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = LIFE_POWERUP_COLOR;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    
    ctx.fill(heartPath);
    ctx.restore();
};

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver, audio, gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Game State Refs
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(INITIAL_LIVES);
  const lastCheckpointScoreRef = useRef<number>(0);
  const gameTickRef = useRef<number>(0);
  const currentSpeedRef = useRef<number>(DEFAULT_SPEED);
  const nextCheckpointScoreRef = useRef<number>(CHECKPOINT_INTERVAL);
  
  // Effect Timer Refs
  const powerUpEndTimeRef = useRef<number>(0);
  const bonusMessageEndTimeRef = useRef<number>(0);
  const checkpointMessageEndTimeRef = useRef<number>(0);
  const spinEndTimeRef = useRef<number>(0);
  const speedBumpEffectEndTimeRef = useRef<number>(0);
  const respawnInvincibilityEndTimeRef = useRef<number>(0);
  const respawnEndTimeRef = useRef<number>(0); // For countdown
  const pauseStartTimeRef = useRef<number | null>(null);

  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
  const [touchState, setTouchState] = useState<{ left: boolean, right: boolean, up: boolean, down: boolean }>({ left: false, right: false, up: false, down: false });

  const roadWidth = CANVAS_WIDTH * ROAD_WIDTH_PERCENTAGE;
  const roadLeft = (CANVAS_WIDTH - roadWidth) / 2;
  const roadRight = roadLeft + roadWidth;
  const laneWidth = roadWidth / LANE_COUNT;

  // --- Road Line continuous scroll logic ---
  const lineAndGapHeight = ROAD_LINE_HEIGHT + ROAD_LINE_GAP;
  const numLines = Math.ceil(CANVAS_HEIGHT / lineAndGapHeight) + 1; // +1 to have an extra line ready to scroll in
  const totalRoadPatternHeight = numLines * lineAndGapHeight;

  // Entity Refs
  const playerCarRef = useRef<Car>({
    x: CANVAS_WIDTH / 2 - PLAYER_CAR_WIDTH / 2,
    y: PLAYER_CAR_START_Y,
    width: PLAYER_CAR_WIDTH,
    height: PLAYER_CAR_HEIGHT,
  });
  const opponentCarsRef = useRef<OpponentCar[]>([]);
  const roadLinesRef = useRef<RoadLine[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const checkpointsRef = useRef<Checkpoint[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);

  const initializeGameState = useCallback(() => {
      scoreRef.current = 0;
      livesRef.current = INITIAL_LIVES;
      lastCheckpointScoreRef.current = 0;
      gameTickRef.current = 0;
      currentSpeedRef.current = DEFAULT_SPEED;
      nextCheckpointScoreRef.current = CHECKPOINT_INTERVAL;
      
      powerUpEndTimeRef.current = 0;
      bonusMessageEndTimeRef.current = 0;
      checkpointMessageEndTimeRef.current = 0;
      spinEndTimeRef.current = 0;
      speedBumpEffectEndTimeRef.current = 0;
      respawnInvincibilityEndTimeRef.current = 0;
      respawnEndTimeRef.current = 0;

      playerCarRef.current = {
        x: CANVAS_WIDTH / 2 - PLAYER_CAR_WIDTH / 2,
        y: PLAYER_CAR_START_Y,
        width: PLAYER_CAR_WIDTH,
        height: PLAYER_CAR_HEIGHT,
      };

      opponentCarsRef.current = [];
      obstaclesRef.current = [];
      checkpointsRef.current = [];
      powerUpsRef.current = [];
      
      roadLinesRef.current = [];
      for (let i = 0; i < numLines; i++) {
        roadLinesRef.current.push({ y: i * lineAndGapHeight - lineAndGapHeight });
      }
  }, [numLines, lineAndGapHeight]);

  const performRespawn = useCallback((currentTime: number) => {
    scoreRef.current = lastCheckpointScoreRef.current;
    nextCheckpointScoreRef.current = lastCheckpointScoreRef.current + CHECKPOINT_INTERVAL;
    
    currentSpeedRef.current = DEFAULT_SPEED;
    
    // Clear the road for a fresh start
    opponentCarsRef.current = [];
    obstaclesRef.current = [];
    powerUpsRef.current = [];
    // Keep future checkpoints, remove passed ones
    checkpointsRef.current = checkpointsRef.current.filter(cp => !cp.passed);

    respawnInvincibilityEndTimeRef.current = currentTime + RESPAWN_INVINCIBILITY_DURATION;
  }, []);

  const handleCrash = useCallback(() => {
    livesRef.current--;
    
    if (livesRef.current <= 0) {
        audio.playCollisionSound();
        onGameOver(scoreRef.current);
        return;
    }

    // Reset player position immediately for the countdown view
    playerCarRef.current.x = CANVAS_WIDTH / 2 - PLAYER_CAR_WIDTH / 2;
    playerCarRef.current.y = PLAYER_CAR_START_Y;
    
    audio.playLoseLifeSound();
    respawnEndTimeRef.current = performance.now() + 3900; // Start a slower countdown (3 steps of 1.3s)
  }, [onGameOver, audio]);
  
  // This effect handles starting and stopping the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeysPressed(prev => ({ ...prev, [e.key]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeysPressed(prev => ({ ...prev, [e.key]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const canvas = canvasRef.current;
    const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const touchX = (touch.clientX - rect.left) * scaleX;
            const touchY = (touch.clientY - rect.top) * scaleY;
            const newTouchState = { left: false, right: false, up: false, down: false };
            if (touchY < CANVAS_HEIGHT * 0.6) newTouchState.up = true;
            else if (touchX < CANVAS_WIDTH / 2) newTouchState.left = true;
            else newTouchState.right = true;
            setTouchState(newTouchState);
        }
    };
    const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        setTouchState({ left: false, right: false, up: false, down: false });
    };
    
    if (canvas) {
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);
    }

    initializeGameState();
    initBackground();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
       if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
      }
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [initializeGameState]);
  
  const drawHud = useCallback((ctx: CanvasRenderingContext2D, speed: number) => {
     ctx.fillStyle = 'rgba(20, 20, 20, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 50);
    ctx.fillStyle = 'rgba(8, 145, 178, 0.5)';
    ctx.fillRect(0, 50, CANVAS_WIDTH, 2);

    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 22px "Courier New", Courier, monospace';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${scoreRef.current}`, 15, 32);
    
    // Draw Lives
    ctx.save();
    ctx.fillStyle = LIFE_POWERUP_COLOR;
    for (let i = 0; i < livesRef.current - 1; i++) {
      ctx.save();
      ctx.translate(180 + i * 25, 15);
      ctx.scale(0.8, 0.8);
      ctx.fill(heartPath);
      ctx.restore();
    }
    ctx.restore();
    
    const displaySpeed = Math.floor(speed * 20);
    ctx.textAlign = 'right';
    ctx.fillText(`${displaySpeed} KM/H`, CANVAS_WIDTH - 15, 32);
    ctx.shadowBlur = 0;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const currentTime = performance.now();

    // --- RESPAWN COUNTDOWN LOGIC ---
    if (respawnEndTimeRef.current > 0) {
        if (currentTime < respawnEndTimeRef.current) {
            // Countdown is ongoing. Draw static scene and countdown text.
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawBackground(ctx, scoreRef.current, currentSpeedRef.current);
            ctx.fillStyle = ROAD_COLOR;
            ctx.fillRect(roadLeft, 0, roadWidth, CANVAS_HEIGHT);

            drawPlayerCar(ctx, playerCarRef.current);
            drawHud(ctx, currentSpeedRef.current);
            
            const timeLeft = Math.ceil((respawnEndTimeRef.current - currentTime) / 1300); // Each number lasts 1.3s
            ctx.font = 'bold 128px "Courier New", Courier, monospace';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 10;
            ctx.fillText(String(timeLeft), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

            ctx.font = 'bold 18px "Courier New", Courier, monospace';
            ctx.fillStyle = '#E5E7EB'; // A slightly off-white
            ctx.shadowBlur = 5;
            ctx.fillText("Starting over from", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
            ctx.fillText("last checkpoint reached.", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 85);
            ctx.fillText("The score updates accordingly.", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);


            ctx.shadowBlur = 0;

            animationFrameId.current = requestAnimationFrame(gameLoop);
            return; // Skip all game logic updates
        } else {
            // Countdown finished, perform the respawn.
            performRespawn(currentTime);
            respawnEndTimeRef.current = 0; // Reset the timer.
        }
    }

    gameTickRef.current++;

    // --- STATE CHECKS ---
    const isPoweredUp = powerUpEndTimeRef.current > currentTime;
    const isSpinning = spinEndTimeRef.current > currentTime;
    const isSlowed = speedBumpEffectEndTimeRef.current > currentTime;
    const isInvincible = respawnInvincibilityEndTimeRef.current > currentTime;

    // --- UPDATE LOGIC ---
    if (scoreRef.current >= nextCheckpointScoreRef.current) {
        checkpointsRef.current.push({ y: -CHECKPOINT_HEIGHT, passed: false, score: nextCheckpointScoreRef.current });
        nextCheckpointScoreRef.current += CHECKPOINT_INTERVAL;
    }

    const difficultyLevel = Math.floor(scoreRef.current / 10000);
    const currentDefaultSpeed = DEFAULT_SPEED + difficultyLevel * 0.5;
    const currentMaxSpeed = MAX_SPEED + difficultyLevel * 0.5;
    const isAccelerating = keysPressed['ArrowUp'] || touchState.up;
    const isBraking = keysPressed['ArrowDown'] || touchState.down;

    if (isAccelerating && !isSlowed) currentSpeedRef.current = Math.min(currentMaxSpeed, currentSpeedRef.current + PLAYER_ACCELERATION);
    else if (isBraking) currentSpeedRef.current = Math.max(MIN_SPEED, currentSpeedRef.current - PLAYER_BRAKING);
    else {
      if (currentSpeedRef.current > currentDefaultSpeed) currentSpeedRef.current = Math.max(currentDefaultSpeed, currentSpeedRef.current - PLAYER_NATURAL_DECELERATION);
      else if (currentSpeedRef.current < currentDefaultSpeed && !isSlowed) currentSpeedRef.current = Math.min(currentDefaultSpeed, currentSpeedRef.current + PLAYER_NATURAL_DECELERATION);
    }
    
    const currentGameSpeed = currentSpeedRef.current;
    scoreRef.current += Math.ceil(currentGameSpeed / 2);

    const speedMultiplier = isPoweredUp ? 1.5 : 1;
    const effectiveGameSpeed = currentGameSpeed * speedMultiplier;

    // --- Player Movement ---
    const pCar = playerCarRef.current;
    if (keysPressed['ArrowUp'] || touchState.up) pCar.y = Math.max(PLAYER_CAR_MIN_Y, pCar.y - PLAYER_VERTICAL_SPEED);
    else if (keysPressed['ArrowDown'] || touchState.down) pCar.y = Math.min(PLAYER_CAR_MAX_Y, pCar.y + PLAYER_VERTICAL_SPEED);
    else {
        if (pCar.y < PLAYER_CAR_START_Y) pCar.y = Math.min(PLAYER_CAR_START_Y, pCar.y + PLAYER_VERTICAL_SPEED / 2);
        else if (pCar.y > PLAYER_CAR_START_Y) pCar.y = Math.max(PLAYER_CAR_START_Y, pCar.y - PLAYER_VERTICAL_SPEED / 2);
    }
    if (!isSpinning) {
        if (keysPressed['ArrowLeft'] || touchState.left) playerCarRef.current.x = Math.max(roadLeft, playerCarRef.current.x - PLAYER_CAR_SPEED);
        if (keysPressed['ArrowRight'] || touchState.right) playerCarRef.current.x = Math.min(roadRight - playerCarRef.current.width, playerCarRef.current.x + PLAYER_CAR_SPEED);
    }

    // --- Entity Position Updates ---
    roadLinesRef.current.forEach(line => { line.y += effectiveGameSpeed; if (line.y > CANVAS_HEIGHT) line.y -= totalRoadPatternHeight; });
    opponentCarsRef.current.forEach(car => car.y += effectiveGameSpeed);
    obstaclesRef.current.forEach(obs => obs.y += effectiveGameSpeed);
    checkpointsRef.current.forEach(cp => cp.y += effectiveGameSpeed);
    powerUpsRef.current.forEach(p => p.y += effectiveGameSpeed);
    
    // --- Spawning Logic ---
    const currentSpawnInterval = Math.max(40, OPPONENT_SPAWN_INTERVAL - difficultyLevel * 10);
    if (gameTickRef.current % Math.floor(currentSpawnInterval) === 0) {
      const type = Math.random() < AMIT_SPAWN_CHANCE ? OpponentType.Amit : OpponentType.Standard;
      const carWidth = type === OpponentType.Amit ? AMIT_CAR_WIDTH : OPPONENT_CAR_WIDTH;
      const carHeight = type === OpponentType.Amit ? AMIT_CAR_HEIGHT : OPPONENT_CAR_HEIGHT;
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const x = roadLeft + lane * laneWidth + (laneWidth - carWidth) / 2;
      opponentCarsRef.current.push({ x, y: -carHeight, width: carWidth, height: carHeight, type });
    }

    const obstacleSpawnChance = Math.min(0.8, INITIAL_OBSTACLE_SPAWN_CHANCE + difficultyLevel * 0.05);
    if (gameTickRef.current % OBSTACLE_SPAWN_INTERVAL === 0 && Math.random() < obstacleSpawnChance) {
        const rand = Math.random();
        let type = rand < 0.3 ? ObstacleType.Barrier : rand < 0.6 ? ObstacleType.OilSlick : rand < 0.85 ? ObstacleType.SpeedBump : ObstacleType.Mine;
        let obsWidth, obsHeight;
        switch(type) {
            case ObstacleType.Barrier: obsWidth = BARRIER_WIDTH; obsHeight = BARRIER_HEIGHT; break;
            case ObstacleType.OilSlick: obsWidth = OIL_SLICK_WIDTH; obsHeight = OIL_SLICK_HEIGHT; break;
            case ObstacleType.SpeedBump: obsWidth = SPEED_BUMP_WIDTH; obsHeight = SPEED_BUMP_HEIGHT; break;
            case ObstacleType.Mine: obsWidth = MINE_WIDTH; obsHeight = MINE_HEIGHT; break;
        }
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const x = roadLeft + lane * laneWidth + (laneWidth - obsWidth) / 2;
        if (![...opponentCarsRef.current, ...obstaclesRef.current].some(item => item.y < obsHeight * 3 && Math.abs(item.x - x) < laneWidth)) {
            obstaclesRef.current.push({ x, y: -obsHeight, width: obsWidth, height: obsHeight, type });
        }
    }
    
    if (gameTickRef.current % LIFE_POWERUP_SPAWN_INTERVAL === 0 && Math.random() < LIFE_POWERUP_SPAWN_CHANCE) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const x = roadLeft + lane * laneWidth + (laneWidth - LIFE_POWERUP_WIDTH) / 2;
        powerUpsRef.current.push({ x, y: -LIFE_POWERUP_HEIGHT, width: LIFE_POWERUP_WIDTH, height: LIFE_POWERUP_HEIGHT, type: 'life' });
    }

    // --- Collision & Interaction Logic ---
    const playerHitbox = playerCarRef.current;
    
    for (const cp of checkpointsRef.current) {
        if (!cp.passed && playerHitbox.y < cp.y + CHECKPOINT_HEIGHT && playerHitbox.y + playerHitbox.height > cp.y) {
            cp.passed = true;
            lastCheckpointScoreRef.current = cp.score;
            audio.playCheckpointSound();
            checkpointMessageEndTimeRef.current = currentTime + 2000;
        }
    }

    const powerUpsToCollect: PowerUp[] = [];
    for (const p of powerUpsRef.current) {
        if (playerHitbox.x < p.x + p.width && playerHitbox.x + playerHitbox.width > p.x && playerHitbox.y < p.y + p.height && playerHitbox.y + playerHitbox.height > p.y) {
            if (p.type === 'life') {
                livesRef.current++;
                audio.playLifeUpSound();
                powerUpsToCollect.push(p);
            }
        }
    }

    if (!isInvincible) {
        let shouldCrash = false;
        const obstaclesToRemove: Obstacle[] = [];
        for (const o of obstaclesRef.current) {
          if (playerHitbox.x < o.x + o.width && playerHitbox.x + playerHitbox.width > o.x && playerHitbox.y < o.y + o.height && playerHitbox.y + playerHitbox.height > o.y) {
            switch (o.type) {
              case ObstacleType.Barrier: shouldCrash = true; break;
              case ObstacleType.OilSlick: if (!isSpinning) { spinEndTimeRef.current = currentTime + PLAYER_SPIN_DURATION; audio.playOilSlickSound(); } obstaclesToRemove.push(o); break;
              case ObstacleType.SpeedBump: currentSpeedRef.current = MIN_SPEED; speedBumpEffectEndTimeRef.current = currentTime + SPEED_BUMP_SLOW_DURATION; audio.playSpeedBumpSound(); obstaclesToRemove.push(o); break;
              case ObstacleType.Mine: if (!isSpinning) { spinEndTimeRef.current = currentTime + MINE_SPIN_DURATION; audio.playMineSound(); } obstaclesToRemove.push(o); break;
            }
            if (shouldCrash) break;
          }
        }
        
        if (shouldCrash) handleCrash();
        else {
            const carsToCollect: OpponentCar[] = [];
            for (const o of opponentCarsRef.current) {
              if (playerHitbox.x < o.x + o.width && playerHitbox.x + playerHitbox.width > o.x && playerHitbox.y < o.y + o.height && playerHitbox.y + playerHitbox.height > o.y) {
                if (o.type === OpponentType.Amit) {
                  audio.playPowerUpSound();
                  powerUpEndTimeRef.current = currentTime + 5000;
                  scoreRef.current += 500;
                  bonusMessageEndTimeRef.current = currentTime + 2000;
                  carsToCollect.push(o);
                } else {
                  shouldCrash = true; break;
                }
              }
            }
            if (shouldCrash) handleCrash();
            else opponentCarsRef.current = opponentCarsRef.current.filter(car => !carsToCollect.includes(car));
        }
        if (obstaclesToRemove.length > 0) obstaclesRef.current = obstaclesRef.current.filter(obs => !obstaclesToRemove.includes(obs));
    }
    
    // --- Entity Cleanup ---
    opponentCarsRef.current = opponentCarsRef.current.filter(car => car.y < CANVAS_HEIGHT);
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.y < CANVAS_HEIGHT);
    checkpointsRef.current = checkpointsRef.current.filter(cp => cp.y < CANVAS_HEIGHT);
    powerUpsRef.current = powerUpsRef.current.filter(p => p.y < CANVAS_HEIGHT && !powerUpsToCollect.includes(p));

    // --- DRAWING LOGIC ---
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBackground(ctx, scoreRef.current, effectiveGameSpeed);
    ctx.fillStyle = ROAD_COLOR;
    ctx.fillRect(roadLeft, 0, roadWidth, CANVAS_HEIGHT);
    ctx.fillStyle = ROAD_LINE_COLOR;
    const shoulderLineWidth = ROAD_LINE_WIDTH / 2;
    ctx.fillRect(roadLeft, 0, shoulderLineWidth, CANVAS_HEIGHT);
    ctx.fillRect(roadRight - shoulderLineWidth, 0, shoulderLineWidth, CANVAS_HEIGHT);
    roadLinesRef.current.forEach(line => { for (let i = 1; i < LANE_COUNT; i++) ctx.fillRect(roadLeft + i * laneWidth - ROAD_LINE_WIDTH / 2, line.y, ROAD_LINE_WIDTH, ROAD_LINE_HEIGHT); });

    checkpointsRef.current.forEach(cp => { if (!cp.passed) drawCheckpoint(ctx, cp); });
    powerUpsRef.current.forEach(p => drawLifePowerUp(ctx, p));
    obstaclesRef.current.forEach(obs => {
        switch(obs.type) {
            case ObstacleType.Barrier: drawBarrier(ctx, obs); break;
            case ObstacleType.OilSlick: drawOilSlick(ctx, obs); break;
            case ObstacleType.SpeedBump: drawSpeedBump(ctx, obs); break;
            case ObstacleType.Mine: drawMine(ctx, obs, gameTickRef.current); break;
        }
    });
    opponentCarsRef.current.forEach(car => { car.type === OpponentType.Amit ? drawAmitCar(ctx, car) : drawOpponentCar(ctx, car); });

    ctx.save();
    if (isInvincible && gameTickRef.current % 10 < 5) ctx.globalAlpha = 0.5;
    const p = playerCarRef.current;
    if (isSpinning) {
        const spinAngle = (Math.sin(currentTime / 80)) * 0.3;
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        ctx.rotate(spinAngle);
        drawPlayerCar(ctx, { x: -p.width / 2, y: -p.height / 2, width: p.width, height: p.height });
    } else {
      if (isPoweredUp) { ctx.shadowColor = POWER_UP_COLOR; ctx.shadowBlur = 25; }
      drawPlayerCar(ctx, p);
    }
    ctx.restore();
    
    // --- HUD & MESSAGES ---
    drawHud(ctx, effectiveGameSpeed);

    if (isSlowed) { /* ... Slowed message ... */ }
    if (isPoweredUp && !isSlowed) {
      const remainingTime = (powerUpEndTimeRef.current - currentTime) / 1000;
      
      ctx.font = 'bold 24px "Courier New", Courier, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = POWER_UP_COLOR;
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 7;
      
      ctx.fillText(`SPEED BOOST: ${remainingTime.toFixed(1)}s`, CANVAS_WIDTH / 2, 85);
      
      // Draw a timer bar
      const barWidth = 200;
      const barHeight = 10;
      const barX = (CANVAS_WIDTH - barWidth) / 2;
      const barY = 95;
      const remainingRatio = Math.max(0, remainingTime / 5.0); // 5.0 seconds is the duration
      
      // Bar background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Bar foreground (the countdown part)
      ctx.fillStyle = POWER_UP_COLOR;
      ctx.fillRect(barX, barY, barWidth * remainingRatio, barHeight);
      
      // Bar border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      ctx.shadowBlur = 0;
    }

    if (checkpointMessageEndTimeRef.current > currentTime) {
      ctx.font = 'bold 28px "Courier New", Courier, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00FFFF';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 7;
      ctx.fillText(`CHECKPOINT!`, CANVAS_WIDTH / 2, 150);
      ctx.shadowBlur = 0;
    }
    if (bonusMessageEndTimeRef.current > currentTime && gameTickRef.current % 25 < 15) {
        ctx.font = 'bold 28px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 7;
        ctx.fillText(`+500 POINTS!`, CANVAS_WIDTH / 2, 180);
        ctx.shadowBlur = 0;
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [keysPressed, touchState, roadLeft, roadRight, laneWidth, totalRoadPatternHeight, handleCrash, performRespawn, drawHud]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      if (pauseStartTimeRef.current) {
        const pausedDuration = performance.now() - pauseStartTimeRef.current;
        if (powerUpEndTimeRef.current > 0) powerUpEndTimeRef.current += pausedDuration;
        if (bonusMessageEndTimeRef.current > 0) bonusMessageEndTimeRef.current += pausedDuration;
        if (spinEndTimeRef.current > 0) spinEndTimeRef.current += pausedDuration;
        if (speedBumpEffectEndTimeRef.current > 0) speedBumpEffectEndTimeRef.current += pausedDuration;
        if (checkpointMessageEndTimeRef.current > 0) checkpointMessageEndTimeRef.current += pausedDuration;
        if (respawnInvincibilityEndTimeRef.current > 0) respawnInvincibilityEndTimeRef.current += pausedDuration;
        if (respawnEndTimeRef.current > 0) respawnEndTimeRef.current += pausedDuration;
        pauseStartTimeRef.current = null;
      }
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else if (gameState === GameState.Paused) {
      if (!pauseStartTimeRef.current) pauseStartTimeRef.current = performance.now();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [gameState, gameLoop]);


  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-lg w-full h-full object-contain"
    />
  );
};

export default GameCanvas;