import { useState } from "react";
import { TEAMS,VENUES } from "../data/teams";
import {PLAYER_NAMES} from "../data/playerNames";

// Enhanced XI Input Component
function XIInputList({ team, xi, setXi, allPlayers }) {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [searchTerms, setSearchTerms] = useState(Array(11).fill(""));
  const [playerRoles, setPlayerRoles] = useState(Array(11).fill(""));

  const selectPlayer = (player, index) => {
    const newXi = [...xi];
    
    if (newXi.includes(player)) {
      alert("Player already selected");
      return;
    }

    newXi[index] = player;
    setXi(newXi);
    
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = "";
    setSearchTerms(newSearchTerms);
    setFocusedIndex(null);
  };

  const removePlayer = (index) => {
    const newXi = [...xi];
    newXi[index] = "";
    setXi(newXi);
    
    const newRoles = [...playerRoles];
    newRoles[index] = "";
    setPlayerRoles(newRoles);
  };

  const updateRole = (index, role) => {
    const newRoles = [...playerRoles];
    newRoles[index] = role;
    setPlayerRoles(newRoles);
  };

  const updateSearchTerm = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);
  };

  const getFilteredPlayers = (index) => {
    const searchTerm = searchTerms[index].toLowerCase();
    
    return allPlayers
      .filter(p => {
        const isNotSelected = !xi.includes(p);
        const matchesSearch = searchTerm === "" || 
          p.toLowerCase().includes(searchTerm);
        return isNotSelected && matchesSearch;
      })
      .slice(0, 20);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Batter': { bg: '#dcfce7', text: '#166534' },
      'Bowler': { bg: '#dbeafe', text: '#1e40af' },
      'All-Rounder': { bg: '#fef3c7', text: '#92400e' },
      'Wicket-Keeper': { bg: '#fce7f3', text: '#9f1239' },
      'Captain': { bg: '#f3e8ff', text: '#6b21a8' }
    };
    return colors[role] || { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#1f2937' }}>{team} Playing XI</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[...Array(11)].map((_, i) => {
          const filteredPlayers = getFilteredPlayers(i);
          const showDropdown = focusedIndex === i && 
            (searchTerms[i] !== "" || !xi[i]) && 
            filteredPlayers.length > 0;

          return (
            <div key={i} style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280', width: '1.5rem', marginTop: '0.5rem' }}>{i + 1}.</span>
                
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder={xi[i] || `Select Player ${i + 1}`}
                      value={xi[i] ? "" : searchTerms[i]}
                      onFocus={() => {
                        setFocusedIndex(i);
                        if (xi[i]) {
                          updateSearchTerm(i, "");
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setFocusedIndex(null), 200);
                      }}
                      onChange={e => {
                        if (!xi[i]) {
                          updateSearchTerm(i, e.target.value);
                        }
                      }}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        background: xi[i] ? '#eff6ff' : 'white',
                        color: xi[i] ? '#1e40af' : '#111827',
                        fontWeight: xi[i] ? '500' : 'normal'
                      }}
                    />
                    
                    {xi[i] && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', padding: '0 0.75rem', pointerEvents: 'none' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>
                          {xi[i]}
                        </span>
                      </div>
                    )}
                    
                    {xi[i] && (
                      <button
                        onClick={() => removePlayer(i)}
                        style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontWeight: 'bold', zIndex: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    )}

                    {showDropdown && (
                      <div style={{ position: 'absolute', zIndex: 20, width: '100%', marginTop: '0.25rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxHeight: '15rem', overflowY: 'auto' }}>
                        {filteredPlayers.map(player => (
                          <div
                            key={player}
                            onMouseDown={() => selectPlayer(player, i)}
                            style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.875rem', borderBottom: '1px solid #f3f4f6', color: '#111827' }}
                            onMouseEnter={e => e.target.style.background = '#eff6ff'}
                            onMouseLeave={e => e.target.style.background = 'white'}
                          >
                            {player}
                          </div>
                        ))}
                        
                        {filteredPlayers.length === 0 && searchTerms[i] && (
                          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                            No players found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Role Selection Tags */}
                  {xi[i] && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
                      {['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Captain'].map(role => {
                        const isSelected = playerRoles[i] === role;
                        const colors = getRoleBadgeColor(role);
                        
                        return (
                          <button
                            key={role}
                            onClick={() => updateRole(i, isSelected ? "" : role)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              borderRadius: '0.25rem',
                              border: isSelected ? '2px solid ' + colors.text : '1px solid #d1d5db',
                              background: isSelected ? colors.bg : 'white',
                              color: isSelected ? colors.text : '#6b7280',
                              cursor: 'pointer',
                              fontWeight: isSelected ? '600' : '400',
                              transition: 'all 0.2s'
                            }}
                          >
                            {role === 'All-Rounder' ? 'All-R' : role === 'Wicket-Keeper' ? 'WK' : role}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
        <span style={{ fontWeight: '500', color: xi.filter(Boolean).length === 11 ? '#16a34a' : '#4b5563' }}>
          Selected: {xi.filter(Boolean).length} / 11
        </span>
      </div>
    </div>
  );
}

// Result Card Component
function ResultCard({ result }) {
  if (!result || result.team1_win_prob === undefined || result.team2_win_prob === undefined) {
    return null;
  }

  const winner = result.team1_win_prob > result.team2_win_prob ? result.team1 : result.team2;
  const winnerProb = Math.max(result.team1_win_prob, result.team2_win_prob);

  return (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '2px solid #3b82f6', borderRadius: '0.5rem', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Match Prediction</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>{result.team1}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12rem', background: '#e5e7eb', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
              <div 
                style={{ 
                  background: '#2563eb', 
                  height: '100%', 
                  transition: 'width 0.5s',
                  width: `${result.team1_win_prob * 100}%`
                }}
              />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1e40af', width: '4rem', textAlign: 'right' }}>
              {(result.team1_win_prob * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>{result.team2}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12rem', background: '#e5e7eb', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
              <div 
                style={{ 
                  background: '#4f46e5', 
                  height: '100%', 
                  transition: 'width 0.5s',
                  width: `${result.team2_win_prob * 100}%`
                }}
              />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#4338ca', width: '4rem', textAlign: 'right' }}>
              {(result.team2_win_prob * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '0.5rem', border: '2px solid #22c55e' }}>
        <p style={{ textAlign: 'center', color: '#374151' }}>
          <span style={{ color: '#6b7280' }}>Predicted Winner: </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>{winner}</span>
          <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>({(winnerProb * 100).toFixed(1)}%)</span>
        </p>
      </div>
    </div>
  );
}

// Main Form Component
export default function MatchForm() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [venue, setVenue] = useState("");
  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("bat");

  const [xi1, setXi1] = useState([]);
  const [xi2, setXi2] = useState([]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!team1 || !team2) return alert("Please select both teams");
    if (team1 === team2) return alert("Teams must be different");
    if (!venue) return alert("Please select a venue");
    if (!tossWinner) return alert("Please select toss winner");

    if (xi1.length !== 11 || xi2.length !== 11) {
      return alert("Please select exactly 11 players for both teams");
    }

    const payload = {
      team1,
      team2,
      xi1,
      xi2,
      venue,
      toss: {
        winner: tossWinner,
        decision: tossDecision
      }
    };

    setLoading(true);
    console.log("📤 Payload:", payload);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setResult(data);
      console.log("📥 API response:", data);

    } catch (err) {
      console.error(err);
      alert("Prediction failed. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', 
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1280px'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '1rem', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
          padding: '2rem' 
        }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#2563eb' }}>
            🏏 IPL Match Predictor
          </h1>

          {/* Teams Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Team 1</label>
              <select 
                value={team1}
                onChange={e => {
                  setTeam1(e.target.value);
                  setXi1([]);
                  if (tossWinner === team1) setTossWinner("");
                }}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#111827', background: 'white' }}
              >
                <option value="">Select Team 1</option>
                {TEAMS.map(t => (
                  <option key={t} value={t} disabled={t === team2}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Team 2</label>
              <select 
                value={team2}
                onChange={e => {
                  setTeam2(e.target.value);
                  setXi2([]);
                  if (tossWinner === team2) setTossWinner("");
                }}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#111827', background: 'white' }}
              >
                <option value="">Select Team 2</option>
                {TEAMS.map(t => (
                  <option key={t} value={t} disabled={t === team1}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Venue</label>
            <select 
              value={venue}
              onChange={e => setVenue(e.target.value)}
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#111827', background: 'white' }}
            >
              <option value="">Select Venue</option>
              {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Toss Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Toss Winner</label>
              <select 
                value={tossWinner}
                onChange={e => setTossWinner(e.target.value)}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#111827', background: 'white' }}
              >
                <option value="">Select Toss Winner</option>
                {team1 && <option value={team1}>{team1}</option>}
                {team2 && <option value={team2}>{team2}</option>}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Toss Decision</label>
              <select 
                value={tossDecision}
                onChange={e => setTossDecision(e.target.value)}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#111827', background: 'white' }}
              >
                <option value="bat">Bat First</option>
                <option value="field">Field First</option>
              </select>
            </div>
          </div>

          {/* XI Selection */}
          {(team1 || team2) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {team1 && (
                <XIInputList
                  team={team1}
                  xi={xi1}
                  setXi={setXi1}
                  allPlayers={PLAYER_NAMES}
                />
              )}

              {team2 && (
                <XIInputList
                  team={team2}
                  xi={xi2}
                  setXi={setXi2}
                  allPlayers={PLAYER_NAMES}
                />
              )}
            </div>
          )}

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #4f46e5)',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {loading ? "Predicting..." : "🏆 Predict Match Winner"}
          </button>

          {result && <ResultCard result={result} />}
        </div>
      </div>
    </div>
  );
}