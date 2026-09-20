export enum GameState {
  StartScreen,
  Playing,
  GameOver,
  Paused,
}

export enum OpponentType {
  Standard,
  Amit,
}

export enum ObstacleType {
  OilSlick,
  Barrier,
  SpeedBump,
  Mine,
}

export interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OpponentCar extends Car {
  type: OpponentType;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
}

export interface RoadLine {
  y: number;
}

export interface Checkpoint {
  y: number;
  passed: boolean;
  score: number;
}

export interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'life';
}
