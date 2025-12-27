export default function ResultCard({ result }) {
  if (
    !result ||
    result.team1_win_prob === undefined ||
    result.team2_win_prob === undefined
  ) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-bold mb-2">Prediction</h2>

      <p>
        {result.team1}:{" "}
        <strong>{(result.team1_win_prob * 100).toFixed(1)}%</strong>
      </p>

      <p>
        {result.team2}:{" "}
        <strong>{(result.team2_win_prob * 100).toFixed(1)}%</strong>
      </p>

      <p className="mt-2 font-semibold">
        Winner:{" "}
        {result.team1_win_prob > result.team2_win_prob
          ? result.team1
          : result.team2}
      </p>
    </div>
  );
}
