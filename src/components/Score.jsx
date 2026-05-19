function Score({ score }) {
  return (
    <div className="score-board" aria-label={`Score ${score}`}>
      <span>Score</span>
      <strong>{score}</strong>
    </div>
  );
}

export default Score;
