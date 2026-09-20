// Sizing
export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;
export const ROAD_WIDTH_PERCENTAGE = 0.9;
export const LANE_COUNT = 3;

// Player Car
export const PLAYER_CAR_WIDTH = 60;
export const PLAYER_CAR_HEIGHT = 107;
export const PLAYER_CAR_START_Y = CANVAS_HEIGHT - PLAYER_CAR_HEIGHT - 80; // Neutral position
export const PLAYER_CAR_MAX_Y = PLAYER_CAR_START_Y + 30; // Farthest back (braking)
export const PLAYER_CAR_MIN_Y = PLAYER_CAR_START_Y - 220; // Farthest forward (accelerating)
export const PLAYER_VERTICAL_SPEED = 4; // Speed of vertical movement
export const PLAYER_CAR_SPEED = 7; // Lateral speed
export const PLAYER_SPIN_DURATION = 1000; // 1 second in ms

// Game Mechanics
export const INITIAL_LIVES = 4;
export const RESPAWN_INVINCIBILITY_DURATION = 3000; // 3 seconds

// Game Speed
export const PLAYER_ACCELERATION = 0.07; // Lowered from 0.1
export const PLAYER_BRAKING = 0.2;
export const PLAYER_NATURAL_DECELERATION = 0.05;
export const MIN_SPEED = 3;
export const DEFAULT_SPEED = 4;
export const MAX_SPEED = 7.5; // Capped at 1.5x default speed, lowered from 12

// Opponent Car
export const OPPONENT_CAR_WIDTH = 85;
export const OPPONENT_CAR_HEIGHT = 113;
export const OPPONENT_SPAWN_INTERVAL = 100; // in game ticks

// Amit Car
export const AMIT_CAR_WIDTH = 85;
export const AMIT_CAR_HEIGHT = 55;
export const AMIT_SPAWN_CHANCE = 0.2; // 20%

// Obstacles
export const OIL_SLICK_WIDTH = 90;
export const OIL_SLICK_HEIGHT = 40;
export const BARRIER_WIDTH = 100;
export const BARRIER_HEIGHT = 40;
export const SPEED_BUMP_WIDTH = 90;
export const SPEED_BUMP_HEIGHT = 20;
export const MINE_WIDTH = 50;
export const MINE_HEIGHT = 50;
export const MINE_SPIN_DURATION = 500; // 0.5 seconds in ms
export const SPEED_BUMP_SLOW_DURATION = 1500; // 1.5 seconds in ms
export const OBSTACLE_SPAWN_INTERVAL = 150; // Ticks between potential obstacle spawns
export const INITIAL_OBSTACLE_SPAWN_CHANCE = 0.3; // Initial chance to spawn an obstacle

// Power-Ups
export const LIFE_POWERUP_WIDTH = 40;
export const LIFE_POWERUP_HEIGHT = 40;
export const LIFE_POWERUP_SPAWN_INTERVAL = 1200; // Ticks between potential spawns
export const LIFE_POWERUP_SPAWN_CHANCE = 0.3;
export const LIFE_POWERUP_COLOR = '#f43f5e'; // rose-500

// Checkpoints
export const CHECKPOINT_INTERVAL = 5000; // Score interval to spawn a checkpoint
export const CHECKPOINT_HEIGHT = 20;
export const CHECKPOINT_COLOR = 'rgba(0, 255, 255, 0.3)'; // Translucent cyan

// Road
export const ROAD_LINE_WIDTH = 10;
export const ROAD_LINE_HEIGHT = 40;
export const ROAD_LINE_GAP = 30;

// Colors
export const ROAD_COLOR = '#374151'; // gray-700
export const GRASS_COLOR = '#166534'; // green-800
export const ROAD_LINE_COLOR = '#F3F4F6'; // gray-100
export const POWER_UP_COLOR = '#facc15'; // yellow-400
export const BARRIER_COLOR_1 = '#f97316'; // orange-500
export const BARRIER_COLOR_2 = '#f3f4f6'; // gray-100
export const SPEED_BUMP_COLOR = '#f59e0b'; // amber-500
export const MINE_BODY_COLOR = '#4b5563'; // gray-600
export const MINE_LIGHT_COLOR = '#ef4444'; // red-500


// Local Storage
export const HIGH_SCORE_KEY = 'geminiGrandPrixHighScore';

// Dynamic Background
export const DAY_SCORE_THRESHOLD = 0;
export const SUNSET_SCORE_THRESHOLD = 5000;
export const DUSK_SCORE_THRESHOLD = 15000;
export const NIGHT_SCORE_THRESHOLD = 30000;

// Colors for Background Stages
export const SKY_COLOR_DAY = ['#87CEEB', '#4682B4']; // Light Sky Blue to Steel Blue
export const SKY_COLOR_SUNSET = ['#FF7F50', '#FF4500', '#4A0404']; // Coral to OrangeRed to dark red
export const SKY_COLOR_DUSK = ['#483D8B', '#191970']; // Dark Slate Blue to Midnight Blue
export const SKY_COLOR_NIGHT = ['#000000', '#191970']; // Black to Midnight Blue

export const MOUNTAIN_COLOR_DAY = '#696969'; // DimGray
export const MOUNTAIN_COLOR_SUNSET = '#553E4E'; // Dark purple/gray
export const MOUNTAIN_COLOR_DUSK = '#2F4F4F'; // DarkSlateGray

export const GRASS_COLOR_DAY = '#166534'; // green-800
export const GRASS_COLOR_SUNSET = '#14532D'; // darker green-900
export const GRASS_COLOR_DUSK = '#164E3A'; // even darker green
export const GRASS_COLOR_NIGHT = '#062A18'; // darkest green

export const CITY_SILHOUETTE_COLOR = '#18181B'; // zinc-900
export const CITY_WINDOW_COLOR = '#FBBF24'; // amber-400