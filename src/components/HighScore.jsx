function HighScore({ highScore }) {
  return (
    <div className="score-board high-score" aria-label={`High score ${highScore}`}>
      <span>High Score</span>
      <strong>{highScore}</strong>
    </div>
  );
}

export default HighScore;
