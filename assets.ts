import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  NIGHT_SCORE_THRESHOLD,
  DUSK_SCORE_THRESHOLD,
  SUNSET_SCORE_THRESHOLD,
  SKY_COLOR_DAY,
  SKY_COLOR_SUNSET,
  SKY_COLOR_DUSK,
  SKY_COLOR_NIGHT,
  GRASS_COLOR_DAY,
  GRASS_COLOR_SUNSET,
  GRASS_COLOR_DUSK,
  GRASS_COLOR_NIGHT,
  MOUNTAIN_COLOR_DAY,
  MOUNTAIN_COLOR_SUNSET,
  MOUNTAIN_COLOR_DUSK,
  CITY_SILHOUETTE_COLOR,
  CITY_WINDOW_COLOR,
} from './constants';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  dAlpha: number; // change in alpha for twinkling
}

let stars: Star[] = [];
let mountainPath: Path2D | null = null;
let cityPath: Path2D | null = null;
let cityWindows: {x: number, y: number, w: number, h: number}[] = [];

// The Y-coordinate where the ground meets the sky.
const horizon = CANVAS_HEIGHT * 0.45;

const createSkyGradient = (ctx: CanvasRenderingContext2D, colors: string[]) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, horizon);
  const step = 1 / (colors.length > 1 ? colors.length - 1 : 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * step, color);
  });
  return gradient;
};

const generateStars = (count: number) => {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * horizon,
      radius: Math.random() * 1.2,
      alpha: Math.random() * 0.8 + 0.2,
      dAlpha: (Math.random() - 0.5) * 0.05,
    });
  }
};

const generateMountains = () => {
  mountainPath = new Path2D();
  mountainPath.moveTo(-5, horizon);
  
  let y = horizon * 0.8;
  let x = -5;
  
  while (x < CANVAS_WIDTH + 5) {
      const segmentWidth = 20 + Math.random() * 30;
      const nextY = y + (Math.random() - 0.5) * 40;
      y = Math.max(horizon * 0.3, Math.min(horizon * 0.9, nextY));
      x += segmentWidth;
      mountainPath.lineTo(x, y);
  }
  
  mountainPath.lineTo(CANVAS_WIDTH + 5, horizon);
  mountainPath.closePath();
};

const generateCity = () => {
    cityPath = new Path2D();
    cityWindows = [];
    cityPath.moveTo(0, horizon);
    let currentX = 0;
    while(currentX < CANVAS_WIDTH) {
        const buildingWidth = 30 + Math.random() * 60;
        const buildingHeight = 40 + Math.random() * (horizon - 80);
        const startY = horizon;
        const endY = horizon - buildingHeight;

        cityPath.rect(currentX, endY, buildingWidth, buildingHeight);
        
        // Add windows
        for(let wx = currentX + 5; wx < currentX + buildingWidth - 5; wx += 10) {
            for (let wy = endY + 5; wy < startY - 5; wy += 10) {
                if(Math.random() > 0.4) {
                    cityWindows.push({x: wx, y: wy, w: 4, h: 6});
                }
            }
        }
        currentX += buildingWidth + 4;
    }
};

export const initBackground = () => {
  generateStars(150);
  generateMountains();
  generateCity();
};

export const drawBackground = (ctx: CanvasRenderingContext2D, score: number, gameSpeed: number) => {
  let skyColors: string[];
  let grassColor: string;
  let mountainColor: string | undefined;
  let showStars = false;
  let isNight = false;

  if (score >= NIGHT_SCORE_THRESHOLD) {
    skyColors = SKY_COLOR_NIGHT;
    grassColor = GRASS_COLOR_NIGHT;
    showStars = true;
    isNight = true;
  } else if (score >= DUSK_SCORE_THRESHOLD) {
    skyColors = SKY_COLOR_DUSK;
    grassColor = GRASS_COLOR_DUSK;
    mountainColor = MOUNTAIN_COLOR_DUSK;
    showStars = true;
  } else if (score >= SUNSET_SCORE_THRESHOLD) {
    skyColors = SKY_COLOR_SUNSET;
    grassColor = GRASS_COLOR_SUNSET;
    mountainColor = MOUNTAIN_COLOR_SUNSET;
  } else {
    skyColors = SKY_COLOR_DAY;
    grassColor = GRASS_COLOR_DAY;
    mountainColor = MOUNTAIN_COLOR_DAY;
  }

  // Draw Sky
  ctx.fillStyle = createSkyGradient(ctx, skyColors);
  ctx.fillRect(0, 0, CANVAS_WIDTH, horizon);

  const parallaxSpeed = gameSpeed * 0.01;

  // Draw Stars
  if (showStars) {
    stars.forEach(star => {
      star.y += parallaxSpeed;
      if (star.y > horizon) {
        star.y = 0;
        star.x = Math.random() * CANVAS_WIDTH;
      }
      star.alpha += star.dAlpha;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.dAlpha *= -1;
      }
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }
  
  // Draw Scenery (City at night, mountains during day/dusk)
  if (isNight) {
      if (cityPath) {
        ctx.fillStyle = CITY_SILHOUETTE_COLOR;
        ctx.fill(cityPath);

        ctx.fillStyle = CITY_WINDOW_COLOR;
        cityWindows.forEach(w => {
            // Randomly flicker windows
            if (Math.random() > 0.005) {
                ctx.fillRect(w.x, w.y, w.w, w.h);
            }
        });
      }
  } else {
      if (mountainPath && mountainColor) {
        ctx.fillStyle = mountainColor;
        ctx.fill(mountainPath);
      }
  }

  // Draw Grass area (below horizon)
  ctx.fillStyle = grassColor;
  ctx.fillRect(0, horizon, CANVAS_WIDTH, CANVAS_HEIGHT - horizon);
};