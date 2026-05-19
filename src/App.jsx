import { useCallback, useEffect, useRef, useState } from 'react';
import Board from './components/Board.jsx';
import HighScore from './components/HighScore.jsx';
import Score from './components/Score.jsx';

const BOARD_SIZE = 20;
const GAME_SPEED = 130;
const HIGH_SCORE_ENDPOINT = '/api/highscore';
const INITIAL_SNAKE = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const STARTING_FOOD = { x: 14, y: 10 };

const directionsByKey = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function isSameCell(first, second) {
  return first.x === second.x && first.y === second.y;
}

function isOppositeDirection(nextDirection, currentDirection) {
  return (
    nextDirection.x + currentDirection.x === 0 &&
    nextDirection.y + currentDirection.y === 0
  );
}

function isOutsideBoard(position) {
  return (
    position.x < 0 ||
    position.x >= BOARD_SIZE ||
    position.y < 0 ||
    position.y >= BOARD_SIZE
  );
}

function createFood(snake) {
  const availableCells = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const candidate = { x, y };

      if (!snake.some((segment) => isSameCell(segment, candidate))) {
        availableCells.push(candidate);
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  return availableCells[randomIndex];
}

async function loadHighScore() {
  const response = await fetch(HIGH_SCORE_ENDPOINT);

  if (!response.ok) {
    throw new Error('Unable to load high score');
  }

  const data = await response.json();
  return Number.isFinite(data.highScore) ? data.highScore : 0;
}

async function saveHighScore(score) {
  const response = await fetch(HIGH_SCORE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    throw new Error('Unable to save high score');
  }

  const data = await response.json();
  return Number.isFinite(data.highScore) ? data.highScore : score;
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(STARTING_FOOD);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const lastMoveDirection = useRef(INITIAL_DIRECTION);

  const resetGame = useCallback(() => {
    lastMoveDirection.current = INITIAL_DIRECTION;
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(STARTING_FOOD);
    setScore(0);
    setIsPaused(false);
    setIsGameOver(false);
  }, []);

  const togglePause = useCallback(() => {
    if (!isGameOver) {
      setIsPaused((currentIsPaused) => !currentIsPaused);
    }
  }, [isGameOver]);

  const moveSnake = useCallback(() => {
    setSnake((currentSnake) => {
      const head = currentSnake[0];
      const nextHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };
      const ateFood = food !== null && isSameCell(nextHead, food);
      const nextSnake = ateFood
        ? [nextHead, ...currentSnake]
        : [nextHead, ...currentSnake.slice(0, -1)];

      if (
        isOutsideBoard(nextHead) ||
        nextSnake.slice(1).some((segment) => isSameCell(segment, nextHead))
      ) {
        setIsGameOver(true);
        setIsPaused(false);
        return currentSnake;
      }

      if (ateFood) {
        setScore((currentScore) => currentScore + 10);
        setFood(createFood(nextSnake));
      }

      lastMoveDirection.current = direction;
      return nextSnake;
    });
  }, [direction, food]);

  useEffect(() => {
    let isSubscribed = true;

    loadHighScore()
      .then((savedHighScore) => {
        if (isSubscribed) {
          setHighScore(savedHighScore);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (score <= highScore) {
      return;
    }

    setHighScore(score);
    saveHighScore(score)
      .then((savedHighScore) => {
        setHighScore((currentHighScore) => Math.max(currentHighScore, savedHighScore));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [highScore, score]);

  useEffect(() => {
    function handleKeyDown(event) {
      const nextDirection = directionsByKey[event.key];

      if (!nextDirection) {
        return;
      }

      event.preventDefault();

      if (isGameOver || isPaused) {
        return;
      }

      setDirection((currentDirection) => {
        if (isOppositeDirection(nextDirection, lastMoveDirection.current)) {
          return currentDirection;
        }

        return nextDirection;
      });
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused || food === null) {
      return undefined;
    }

    const intervalId = window.setInterval(moveSnake, GAME_SPEED);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [food, isGameOver, isPaused, moveSnake]);

  return (
    <main className="game-shell">
      <section className="game-panel" aria-label="Snake game">
        <div className="game-header">
          <div>
            <h1>Snake</h1>
          </div>
          <div className="score-row">
            <Score score={score} />
            <HighScore highScore={highScore} />
          </div>
        </div>

        <Board snake={snake} food={food} boardSize={BOARD_SIZE} />

        <div className="game-footer">
          <button type="button" onClick={togglePause} disabled={isGameOver}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={resetGame}>
            Restart
          </button>
        </div>

        {isPaused && !isGameOver && (
          <div className="status-overlay" role="status" aria-live="polite">
            <h2>Paused</h2>
            <button type="button" onClick={togglePause}>
              Resume
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="status-overlay" role="status" aria-live="polite">
            <h2>Game Over</h2>
            <p>Final score: {score}</p>
            <p>High score: {highScore}</p>
            <button type="button" onClick={resetGame}>
              Play again
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
