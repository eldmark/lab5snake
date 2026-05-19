function LeaderboardTable({ scores }) {
  if (scores.length === 0) {
    return <p className="empty-state">No scores yet. Play a round to fill the table.</p>;
  }

  return (
    <table className="leaderboard-table">
      <caption>High Scores</caption>
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((savedScore, index) => (
          <tr key={`${savedScore}-${index}`}>
            <td>{index + 1}</td>
            <td>{savedScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeaderboardTable;
