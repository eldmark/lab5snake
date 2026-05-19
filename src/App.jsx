import { useCallback, useEffect, useRef, useState } from 'react';
import Board from './components/Board.jsx';
import HighScore from './components/HighScore.jsx';
import LeaderboardTable from './components/LeaderboardTable.jsx';
import Score from './components/Score.jsx';

const BOARD_SIZE = 20;
const GAME_SPEED = 130;
const HIGH_SCORE_ENDPOINT = '/api/highscore';
const MAX_HIGH_SCORES = 10;
const INITIAL_SNAKE = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const STARTING_FOOD = { x: 14, y: 10 };
const SCREENS = {
  splash: 'splash',
  game: 'game',
  leaderboard: 'leaderboard',
  howToPlay: 'howToPlay',
};

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

function sortHighScores(scores) {
  return scores
    .map((score) => Number.parseInt(score, 10))
    .filter((score) => Number.isFinite(score) && score > 0)
    .sort((firstScore, secondScore) => secondScore - firstScore)
    .slice(0, MAX_HIGH_SCORES);
}

function normalizeHighScores(data) {
  if (Array.isArray(data.highScores)) {
    return sortHighScores(data.highScores);
  }

  return sortHighScores([data.highScore]);
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

async function loadHighScores() {
  const response = await fetch(HIGH_SCORE_ENDPOINT);

  if (!response.ok) {
    throw new Error('Unable to load high scores');
  }

  const data = await response.json();
  return normalizeHighScores(data);
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
  return normalizeHighScores(data);
}

function App() {
  const [screen, setScreen] = useState(SCREENS.splash);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(STARTING_FOOD);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const audioContext = useRef(null);
  const lastMoveDirection = useRef(INITIAL_DIRECTION);
  const recordedGameScore = useRef(null);

  const getAudioContext = useCallback(() => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    if (audioContext.current === null) {
      audioContext.current = new AudioContextConstructor();
    }

    return audioContext.current;
  }, []);

  const enableSound = useCallback(() => {
    const context = getAudioContext();

    if (context?.state === 'suspended') {
      context.resume().catch((error) => {
        console.error(error);
      });
    }
  }, [getAudioContext]);

  const playEatSound = useCallback(() => {
    const context = getAudioContext();

    if (context === null || context.state === 'suspended') {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = context.currentTime;
    const endTime = startTime + 0.12;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(520, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, endTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, endTime);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  }, [getAudioContext]);

  const resetGame = useCallback(() => {
    enableSound();
    recordedGameScore.current = null;
    lastMoveDirection.current = INITIAL_DIRECTION;
    setScreen(SCREENS.game);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(STARTING_FOOD);
    setScore(0);
    setIsPaused(false);
    setIsGameOver(false);
  }, [enableSound]);

  const openMenu = useCallback(() => {
    enableSound();
    setScreen(SCREENS.splash);
    setIsPaused(true);
  }, [enableSound]);

  const openLeaderboard = useCallback(() => {
    enableSound();
    setScreen(SCREENS.leaderboard);
    setIsPaused(true);
  }, [enableSound]);

  const openHowToPlay = useCallback(() => {
    enableSound();
    setScreen(SCREENS.howToPlay);
    setIsPaused(true);
  }, [enableSound]);

  const togglePause = useCallback(() => {
    enableSound();

    if (!isGameOver && screen === SCREENS.game) {
      setIsPaused((currentIsPaused) => !currentIsPaused);
    }
  }, [enableSound, isGameOver, screen]);

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

    loadHighScores()
      .then((savedHighScores) => {
        if (isSubscribed) {
          setLeaderboard(savedHighScores);
          setHighScore(savedHighScores[0] ?? 0);
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
    if (score > highScore) {
      setHighScore(score);
    }
  }, [highScore, score]);

  useEffect(() => {
    if (!isGameOver || score <= 0 || recordedGameScore.current === score) {
      return;
    }

    recordedGameScore.current = score;
    setLeaderboard((currentScores) => sortHighScores([...currentScores, score]));

    saveHighScore(score)
      .then((savedHighScores) => {
        setLeaderboard(savedHighScores);
        setHighScore(savedHighScores[0] ?? 0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isGameOver, score]);

  useEffect(() => {
    if (score > 0) {
      playEatSound();
    }
  }, [playEatSound, score]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Enter' && screen === SCREENS.splash) {
        event.preventDefault();
        resetGame();
        return;
      }

      if (event.key === ' ' && screen === SCREENS.game) {
        event.preventDefault();
        togglePause();
        return;
      }

      const nextDirection = directionsByKey[event.key];

      if (!nextDirection || screen !== SCREENS.game) {
        return;
      }

      event.preventDefault();
      enableSound();

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
  }, [enableSound, isGameOver, isPaused, resetGame, screen, togglePause]);

  useEffect(() => {
    if (screen !== SCREENS.game || isGameOver || isPaused || food === null) {
      return undefined;
    }

    const intervalId = window.setInterval(moveSnake, GAME_SPEED);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [food, isGameOver, isPaused, moveSnake, screen]);

  const visibleHighScore = Math.max(highScore, score);

  return (
    <main className="game-shell">
      <section className="game-panel" aria-label="Snake game">
        {screen !== SCREENS.splash && (
          <div className="game-header">
            <div>
              <p className="eyebrow">Classic Snake</p>
              <h1>Snake</h1>
            </div>
            <nav className="menu-row" aria-label="Game menu">
              <button type="button" className="secondary-button" onClick={openMenu}>
                Menu
              </button>
              <button type="button" className="secondary-button" onClick={openLeaderboard}>
                Leaderboard
              </button>
              <button type="button" className="secondary-button" onClick={openHowToPlay}>
                How to Play
              </button>
            </nav>
          </div>
        )}

        {screen === SCREENS.splash && (
          <section className="splash-screen" aria-labelledby="splash-title">
            <p className="eyebrow">Classic Snake</p>
            <h1 id="splash-title">Snake</h1>
            <p className="splash-copy">
              Eat red food, grow the snake, and keep the new striped tail alive.
            </p>
            <div className="splash-actions">
              <button type="button" onClick={resetGame}>
                Play
              </button>
              <button type="button" className="secondary-button" onClick={openLeaderboard}>
                Leaderboard
              </button>
              <button type="button" className="secondary-button" onClick={openHowToPlay}>
                How to Play
              </button>
            </div>
          </section>
        )}

        {screen === SCREENS.game && (
          <>
            <div className="score-row in-game-score">
              <Score score={score} />
              <HighScore highScore={visibleHighScore} />
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
                <p>High score: {visibleHighScore}</p>
                <div className="overlay-actions">
                  <button type="button" onClick={resetGame}>
                    Play again
                  </button>
                  <button type="button" className="secondary-button" onClick={openLeaderboard}>
                    Scores
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {screen === SCREENS.leaderboard && (
          <section className="content-screen" aria-labelledby="leaderboard-title">
            <p className="eyebrow">Score Table</p>
            <h2 id="leaderboard-title">Leaderboard</h2>
            <LeaderboardTable scores={leaderboard} />
            <div className="content-actions">
              <button type="button" onClick={resetGame}>
                Play
              </button>
              <button type="button" className="secondary-button" onClick={openHowToPlay}>
                How to Play
              </button>
            </div>
          </section>
        )}

        {screen === SCREENS.howToPlay && (
          <section className="content-screen" aria-labelledby="how-to-play-title">
            <p className="eyebrow">Rules</p>
            <h2 id="how-to-play-title">How to Play</h2>
            <ul className="rules-list">
              <li>Use the arrow keys to move the snake around the board.</li>
              <li>Eat each red food ball to earn 10 points and grow longer.</li>
              <li>Every third body segment is white, making the tail pattern two green and one white.</li>
              <li>Avoid the walls and the snake tail. Press Space to pause or resume.</li>
            </ul>
            <div className="content-actions">
              <button type="button" onClick={resetGame}>
                Play
              </button>
              <button type="button" className="secondary-button" onClick={openLeaderboard}>
                Leaderboard
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
