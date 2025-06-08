import React, { useEffect, useState, useRef } from 'react';

interface GameProps {
  onBack: () => void;
  player1Color: string;
  player2Color: string;
  timeSeconds: number;
}

type Timeout = ReturnType<typeof setTimeout>;

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  scaleX: number;
  scaleY: number;
}

interface Trail { x: number; y: number; radius: number; opacity: number; }

const Game: React.FC<GameProps> = ({ onBack, player1Color, player2Color, timeSeconds }) => {
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState(timeSeconds);
  const [isPaused] = useState(false);
  const [wasdPressed, setWasdPressed] = useState(false);
  const [arrowPressed, setArrowPressed] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [trailActive, setTrailActive] = useState(false);
  const TRAIL_FADE_RATE = 0.3;
  const MAX_TRAILS = 20;
  const TRAIL_SPAWN_INTERVAL = 0.05;
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const countdownTimerRef = useRef<Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const trailTimerRef = useRef(0);
  

  const GRAVITY = 500;
  const BOUNCE_FACTOR = 0.75;
  const FRICTION = 0.99;
  const CONTROL_ACCEL = 800;
  const YELLOW_BOOST = 2.5;
  const COMPRESS_AMOUNT = 0.3;
  const SCALE_DECAY = 0.15;
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [wasdKeyPressed, setWasdKeyPressed] = useState(false);
  const [arrowKeyPressed, setArrowKeyPressed] = useState(false);
  
  const buildInitialBalls = (): Ball[] => {
    if (!gameAreaRef.current) return [];
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    return [
      { id: 0, x: width/2, y: height*0.35, vx: 0, vy: 0, radius: 20, color: 'yellow-400', scaleX:1, scaleY:1 },
      { id: 1, x: width*0.15, y: height*0.35, vx: 0, vy: 0, radius: 25, color: player1Color, scaleX:1, scaleY:1 },
      { id: 2, x: width*0.85, y: height*0.35, vx: 0, vy: 0, radius: 25, color: player2Color, scaleX:1, scaleY:1 }
    ];
  };

  const resetGame = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    lastTimeRef.current = 0;
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    setGameStarted(false);
    setCountdownActive(false);
    setTimeLeft(timeSeconds);
    setCountdownNum(3);
    setWasdKeyPressed(false);
    setArrowKeyPressed(false);
    setWasdPressed(false);
    setArrowPressed(false);
    setTrails([]);
    setTrailActive(false);
    trailTimerRef.current = 0;
    pressedKeysRef.current.clear();
    setBalls(buildInitialBalls());
  };

  useEffect(() => {
    setBalls(buildInitialBalls());
  }, [gameAreaRef.current, player1Color, player2Color]);
  
  const updateBallPositions = (deltaTime: number) => {
    if (!gameAreaRef.current || !gameStarted) return;
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    const gapSize = height * 0.35;
    const gapStart = (height - gapSize) / 2;
    const gapEnd = gapStart + gapSize;
    trailTimerRef.current += deltaTime;
    let hitByPlayer = false;
    let wallCollisionOfYellow = false;
    let updatedBalls: Ball[] = [];
    setBalls(prevBalls => {
      const newBalls = prevBalls.map(ball => {
        const newBall = { ...ball };
        if (ball.id === 1) {
          if (pressedKeysRef.current.has('w')) newBall.vy -= CONTROL_ACCEL * deltaTime;
          if (pressedKeysRef.current.has('s')) newBall.vy += CONTROL_ACCEL * deltaTime;
          if (pressedKeysRef.current.has('a')) newBall.vx -= CONTROL_ACCEL * deltaTime;
          if (pressedKeysRef.current.has('d')) newBall.vx += CONTROL_ACCEL * deltaTime;
        } else if (ball.id === 2) {
          if (pressedKeysRef.current.has('ArrowUp')) newBall.vy -= CONTROL_ACCEL * deltaTime;
          if (pressedKeysRef.current.has('ArrowDown')) newBall.vy += CONTROL_ACCEL * deltaTime;
          if (pressedKeysRef.current.has('ArrowLeft')) newBall.vx -= CONTROL_ACCEL * deltaTime;
          if (pressedKeysRef.current.has('ArrowRight')) newBall.vx += CONTROL_ACCEL * deltaTime;
        }
        newBall.vy += GRAVITY * deltaTime;
        newBall.vx *= FRICTION;
        newBall.x += newBall.vx * deltaTime;
        newBall.y += newBall.vy * deltaTime;
        if (newBall.x - newBall.radius <= 0) {
          const inGap = newBall.y >= gapStart && newBall.y <= gapEnd;
          if (newBall.id !== 0 || !inGap) {
            newBall.x = newBall.radius;
            newBall.vx = -newBall.vx * BOUNCE_FACTOR;
            newBall.scaleX = 1 - COMPRESS_AMOUNT;
            newBall.scaleY = 1 + COMPRESS_AMOUNT;
            if (newBall.id === 0) wallCollisionOfYellow = true;
          }
        } else if (newBall.x + newBall.radius >= width) {
          const inGap = newBall.y >= gapStart && newBall.y <= gapEnd;
          if (newBall.id !== 0 || !inGap) {
            newBall.x = width - newBall.radius;
            newBall.vx = -newBall.vx * BOUNCE_FACTOR;
            newBall.scaleX = 1 - COMPRESS_AMOUNT;
            newBall.scaleY = 1 + COMPRESS_AMOUNT;
            if (newBall.id === 0) wallCollisionOfYellow = true;
          }
        }
        const bounceV = Math.sqrt(2 * GRAVITY * (height / 5));
        if (newBall.y + newBall.radius >= height) {
          newBall.y = height - newBall.radius;
          newBall.vy = -bounceV;
          newBall.scaleX = 1 + COMPRESS_AMOUNT;
          newBall.scaleY = 1 - COMPRESS_AMOUNT;
          if (newBall.id === 0) wallCollisionOfYellow = true;
        }
        if (newBall.y - newBall.radius <= 0) {
          newBall.y = newBall.radius;
          newBall.vy = -newBall.vy * BOUNCE_FACTOR;
          newBall.scaleX = 1 + COMPRESS_AMOUNT;
          newBall.scaleY = 1 - COMPRESS_AMOUNT;
          if (newBall.id === 0) wallCollisionOfYellow = true;
        }
        return newBall;
      });
      for (let i = 0; i < newBalls.length; i++) {
        for (let j = i + 1; j < newBalls.length; j++) {
          const b1 = newBalls[i];
          const b2 = newBalls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b1.radius + b2.radius;
          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) / 2;
            b1.x -= nx * overlap; b1.y -= ny * overlap;
            b2.x += nx * overlap; b2.y += ny * overlap;
            const tx = -ny;
            const ty = nx;
            const v1n = b1.vx * nx + b1.vy * ny;
            const v1t = b1.vx * tx + b1.vy * ty;
            const v2n = b2.vx * nx + b2.vy * ny;
            const v2t = b2.vx * tx + b2.vy * ty;
            const newV1n = v2n;
            const newV2n = v1n;
            b1.vx = newV1n * nx + v1t * tx;
            b1.vy = newV1n * ny + v1t * ty;
            b2.vx = newV2n * nx + v2t * tx;
            b2.vy = newV2n * ny + v2t * ty;
            if (b1.id === 0) { b1.vx *= YELLOW_BOOST; b1.vy *= YELLOW_BOOST; }
            if (b2.id === 0) { b2.vx *= YELLOW_BOOST; b2.vy *= YELLOW_BOOST; }
            const comp = COMPRESS_AMOUNT;
            const sX = nx*nx*(1 - comp) + tx*tx*(1 + comp);
            const sY = ny*ny*(1 - comp) + ty*ty*(1 + comp);
            b1.scaleX = sX; b1.scaleY = sY;
            b2.scaleX = sX; b2.scaleY = sY;
            if (b1.id === 0 || b2.id === 0) hitByPlayer = true;
          }
        }
      }
      newBalls.forEach(b => {
        b.scaleX += (1 - b.scaleX) * SCALE_DECAY;
        b.scaleY += (1 - b.scaleY) * SCALE_DECAY;
      });
      updatedBalls = newBalls;
      return newBalls;
    });
    const yPost = updatedBalls.find(b => b.id === 0);
    if (yPost) {
      const inGap = yPost.y >= gapStart && yPost.y <= gapEnd;
      const leftExit = yPost.x - yPost.radius <= 0;
      const rightExit = yPost.x + yPost.radius >= width;
      if (inGap && (leftExit || rightExit)) {
        if (leftExit) setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
        if (rightExit) setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
        resetGame();
        return;
      }
    }
    if (hitByPlayer) {
      setTrailActive(true);
      trailTimerRef.current = 0;
    }
    if (wallCollisionOfYellow) setTrailActive(false);
    setTrails(prev => {
      let next = prev
        .map(t => ({ ...t, opacity: t.opacity - TRAIL_FADE_RATE * deltaTime }))
        .filter(t => t.opacity > 0);
      if (trailActive) {
        while (trailTimerRef.current >= TRAIL_SPAWN_INTERVAL) {
          if (yPost) next.push({ x: yPost.x, y: yPost.y, radius: yPost.radius, opacity: 1 });
          if (next.length > MAX_TRAILS) next.shift();
          trailTimerRef.current -= TRAIL_SPAWN_INTERVAL;
        }
      }
      return next;
    });
  };

  const startAnimation = () => {
    if (!gameAreaRef.current || animationFrameRef.current) return;
    const animate = (time: number) => {
      const deltaTime = lastTimeRef.current
        ? (time - lastTimeRef.current) / 1000
        : 0;
      lastTimeRef.current = time;
      updateBallPositions(deltaTime);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !countdownActive && !gameStarted) {
        setCountdownActive(true);
        startCountdown();
        return;
      }
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setWasdPressed(true);
        setWasdKeyPressed(true);
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setArrowPressed(true);
        setArrowKeyPressed(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const downAll = (e: KeyboardEvent) => pressedKeysRef.current.add(e.key);
    const upAll = (e: KeyboardEvent) => pressedKeysRef.current.delete(e.key);
    window.addEventListener('keydown', downAll);
    window.addEventListener('keyup', upAll);
    return () => {
      window.removeEventListener('keydown', downAll);
      window.removeEventListener('keyup', upAll);
    };
  }, []);

  useEffect(() => {
    if (wasdKeyPressed && arrowKeyPressed && !countdownActive && !gameStarted) {
      setCountdownActive(true);
      startCountdown();
    }
  }, [wasdKeyPressed, arrowKeyPressed, countdownActive, gameStarted]);
  
  const startCountdown = () => {
    setCountdownNum(3);
    countdownTimerRef.current = setTimeout(() => {
      setCountdownNum(2);
      countdownTimerRef.current = setTimeout(() => {
        setCountdownNum(1);
        countdownTimerRef.current = setTimeout(() => {
          setCountdownNum(0);
          countdownTimerRef.current = setTimeout(() => {
            setCountdownActive(false);
            setGameStarted(true);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    if (isPaused || timeLeft <= 0 || !gameStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, gameStarted]);

  useEffect(() => {
    if (gameStarted) startAnimation();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted && !countdownActive) {
      setWasdPressed(false);
      setArrowPressed(false);
    }
  }, [gameStarted, countdownActive]);

  useEffect(() => {
    setWasdPressed(false);
    setArrowPressed(false);
    setWasdKeyPressed(false);
    setArrowKeyPressed(false);
  }, [score]);

  const colorClassesMap: Record<string,{ bg: string; shadow: string }> = {
    'yellow-400': { bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
    'pink-500': { bg: 'bg-pink-500', shadow: 'shadow-pink-500/50' },
    'pink-300': { bg: 'bg-pink-300', shadow: 'shadow-pink-300/50' },
    'cyan-400': { bg: 'bg-cyan-400', shadow: 'shadow-cyan-400/50' },
    'purple-500': { bg: 'bg-purple-500', shadow: 'shadow-purple-500/50' },
    'orange-500': { bg: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
    'green-400': { bg: 'bg-green-400', shadow: 'shadow-green-400/50' },
  };

  const handleBack = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    onBack();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }}>
      </div>

      {}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
      {}
      <div className="absolute left-0 w-1 bg-white opacity-30" style={{ top: '0', bottom: '67.5%', backgroundImage: 'linear-gradient(transparent 50%, white 50%)', backgroundSize: '2px 20px' }} />
      <div className="absolute left-0 w-1 bg-white opacity-30" style={{ top: '67.5%', bottom: '0', backgroundImage: 'linear-gradient(transparent 50%, white 50%)', backgroundSize: '2px 20px' }} />
      {}
      <div className="absolute right-0 w-1 bg-white opacity-30" style={{ top: '0', bottom: '67.5%', backgroundImage: 'linear-gradient(transparent 50%, white 50%)', backgroundSize: '2px 20px' }} />
      <div className="absolute right-0 w-1 bg-white opacity-30" style={{ top: '67.5%', bottom: '0', backgroundImage: 'linear-gradient(transparent 50%, white 50%)', backgroundSize: '2px 20px' }} />

      {}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-pink-500 animate-pulse">
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-pink-500 rounded-full blur-sm opacity-60"></div>
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-cyan-400 animate-pulse">
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full blur-sm opacity-60"></div>
      </div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-pink-500 animate-pulse">
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-500 rounded-full blur-sm opacity-60"></div>
      </div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-cyan-400 animate-pulse">
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full blur-sm opacity-60"></div>
      </div>

      {}
      <button 
        onClick={handleBack}
        className="absolute top-8 left-8 text-pink-500 hover:text-pink-400 transition-colors duration-200 text-5xl font-mono"
        aria-label="Back to game setup"
        title="Back to Game Setup"
      >
        {'←'}
      </button>

      {}
      <div className="absolute top-8 right-8 text-cyan-400 text-xl cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>

      {}
      <div 
        ref={gameAreaRef}
        className="relative w-full h-screen flex items-center justify-center z-10"
      >
        {}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-3xl font-mono font-bold">
          {formatTime(timeLeft)}
        </div>

        {}
        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-white opacity-30">
          <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(transparent 50%, white 50%)', backgroundSize: '2px 20px' }}></div>
        </div>

        {}
        <>
          {}
          <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-300 text-[250px] font-bold opacity-80">
            {countdownNum > 0 ? countdownNum : score.player1}
          </div>
          {}
          <div className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-pink-300 text-[250px] font-bold opacity-80">
            {countdownNum > 0 ? countdownNum : score.player2}
          </div>
        </>

        {}
        {balls.map(ball => {
          const { bg, shadow } = colorClassesMap[ball.color] || colorClassesMap['pink-500'];
          return (
            <div 
              key={ball.id}
              className={`absolute ${bg} rounded-full shadow-lg ${shadow}`}
              style={{
                left: `${ball.x - ball.radius}px`,
                top: `${ball.y - ball.radius}px`,
                width: `${ball.radius * 2}px`,
                height: `${ball.radius * 2}px`,
                transform: `scale(${ball.scaleX}, ${ball.scaleY})`
              }}
            />
          );
        })}

        {}
        {trails.map((tr, idx) => (
          <div key={idx} className="absolute bg-yellow-400 rounded-full pointer-events-none"
               style={{
                 left: `${tr.x - tr.radius}px`,
                 top: `${tr.y - tr.radius}px`,
                 width: `${tr.radius * 2}px`,
                 height: `${tr.radius * 2}px`,
                 opacity: tr.opacity
               }} />
        ))}

        {}
        {!wasdPressed && (
          <div className="absolute left-[15%] bottom-[10%] text-pink-500 font-bold">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">W</div>
              <div></div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">A</div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">S</div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">D</div>
            </div>
          </div>
        )}

        {}
        {!arrowPressed && (
          <div className="absolute right-[15%] bottom-[10%] text-pink-500 font-bold">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">▲</div>
              <div></div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">◄</div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">▼</div>
              <div className="w-10 h-10 border-2 border-pink-500 rounded-md flex items-center justify-center shadow-md shadow-pink-500/30">►</div>
            </div>
          </div>
        )}

        {!wasdPressed && (
          <div className="absolute left-1/4 bottom-[5%] transform -translate-x-1/2 text-pink-500 text-sm font-bold tracking-wider">
            PRESS ANY WASD KEY TO BEGIN
          </div>
        )}

        {!arrowPressed && (
          <div className="absolute right-1/4 bottom-[5%] transform translate-x-1/2 text-pink-500 text-sm font-bold tracking-wider">
            PRESS ANY ARROW KEY TO BEGIN
          </div>
        )}
      </div>

      {}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full bg-repeat-y" 
             style={{
               backgroundImage: 'linear-gradient(transparent 98%, rgba(255, 255, 255, 0.03) 100%)',
               backgroundSize: '100% 4px'
             }}>
        </div>
      </div>
    </div>
  );
};

export default Game;
