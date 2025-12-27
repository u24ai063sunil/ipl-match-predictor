import { useState } from "react";

export default function XIInputList({ team, xi, setXi, allPlayers }) {
  const [queryIndex, setQueryIndex] = useState(null);
  const [search, setSearch] = useState("");

  // Add / replace player at index
  const selectPlayer = (player, index) => {
    const newXi = [...xi];

    // prevent duplicates
    if (newXi.includes(player)) {
      alert("Player already selected");
      return;
    }

    newXi[index] = player;
    setXi(newXi);

    setQueryIndex(null);
    setSearch("");
  };

  // Remove player
  const removePlayer = (index) => {
    const newXi = [...xi];
    newXi[index] = "";
    setXi(newXi);
  };

  // Filter players by search text
  const filteredPlayers = allPlayers
    .filter(
      p =>
        p.toLowerCase().includes(search.toLowerCase()) &&
        !xi.includes(p)
    )
    .slice(0, 8); // limit suggestions

  return (
    <div className="border p-3 rounded">
      <h2 className="font-bold mb-2">{team} Playing XI</h2>

      {[...Array(11)].map((_, i) => (
        <div key={i} className="relative mb-2">
          <input
            type="text"
            placeholder={`Player ${i + 1}`}
            value={xi[i] || ""}
            onFocus={() => {
              setQueryIndex(i);
              setSearch("");
            }}
            onChange={e => {
              setQueryIndex(i);
              setSearch(e.target.value);
            }}
            className="w-full border px-2 py-1 rounded"
          />

          {/* ❌ Remove button */}
          {xi[i] && (
            <button
              onClick={() => removePlayer(i)}
              className="absolute right-2 top-1 text-red-500"
            >
              ✕
            </button>
          )}

          {/* 🔽 Autocomplete dropdown */}
          {queryIndex === i && filteredPlayers.length > 0 && (
            <div className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
              {filteredPlayers.map(p => (
                <div
                  key={p}
                  onClick={() => selectPlayer(p, i)}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                >
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <p className="text-sm mt-2">
        Selected: {xi.filter(Boolean).length} / 11
      </p>
    </div>
  );
}
