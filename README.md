# Snake Game

React + Vite implementation of the classic Snake game.

## Run locally

```bash
npm install
npm run dev
```

The high scores are saved by the Vite dev server in:

```text
data/highscore.txt
```

Scores are stored one per line, with the old single-score format still supported.

## Structure

```text
data/
  highscore.txt
src/
  App.jsx
  main.jsx
  components/
    Board.jsx
    Food.jsx
    HighScore.jsx
    LeaderboardTable.jsx
    Score.jsx
    Snake.jsx
  styles/
    game.css
```
