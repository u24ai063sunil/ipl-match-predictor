import { useState, useEffect, useRef } from "react";
import { TEAMS, VENUES } from "../data/teams";
import { PLAYER_NAMES } from "../data/playerNames";

// Enhanced XI Input Component with Better Mobile Support
function XIInputList({ team, xi, setXi, allPlayers, otherTeamXi = [] }) {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [searchTerms, setSearchTerms] = useState(Array(11).fill(""));
  const [playerRoles, setPlayerRoles] = useState(Array(11).fill(""));
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRefs = useRef([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (focusedIndex !== null) {
        const dropdown = dropdownRefs.current[focusedIndex];
        const input = inputRefs.current[focusedIndex];
        
        if (
          dropdown && 
          !dropdown.contains(event.target) && 
          input && 
          !input.contains(event.target)
        ) {
          setFocusedIndex(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [focusedIndex]);

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
    
    // Check for Captain constraint
    if (role === "Captain") {
      const currentCaptainIndex = playerRoles.findIndex(r => r === "Captain");
      if (currentCaptainIndex !== -1 && currentCaptainIndex !== index) {
        alert(`${xi[currentCaptainIndex]} is already the captain. Please remove their captaincy first.`);
        return;
      }
    }
    
    // Check for Wicket-Keeper constraint
    if (role === "Wicket-Keeper") {
      const currentWKIndex = playerRoles.findIndex(r => r === "Wicket-Keeper");
      if (currentWKIndex !== -1 && currentWKIndex !== index) {
        alert(`${xi[currentWKIndex]} is already the wicket-keeper. Please remove their role first.`);
        return;
      }
    }
    
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
        const isNotInOtherTeam = !otherTeamXi.includes(p);
        const matchesSearch = searchTerm === "" || 
          p.toLowerCase().includes(searchTerm);
        return isNotSelected && isNotInOtherTeam && matchesSearch;
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
    <div style={{ border: '1px solid #3a3a3a', padding: '1rem', borderRadius: '0.5rem', background: '#1a1a1a', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#e5e7eb' }}>{team} Playing XI</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[...Array(11)].map((_, i) => {
          const filteredPlayers = getFilteredPlayers(i);
          const showDropdown = focusedIndex === i && 
            (searchTerms[i] !== "" || !xi[i]) && 
            filteredPlayers.length > 0;

          return (
            <div key={i} style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af', width: '1.5rem', marginTop: '0.5rem' }}>{i + 1}.</span>
                
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={el => inputRefs.current[i] = el}
                      type="text"
                      placeholder={xi[i] || `Select Player ${i + 1}`}
                      value={xi[i] ? "" : searchTerms[i]}
                      onFocus={() => {
                        setFocusedIndex(i);
                        if (xi[i]) {
                          updateSearchTerm(i, "");
                        }
                      }}
                      onChange={e => {
                        if (!xi[i]) {
                          updateSearchTerm(i, e.target.value);
                        }
                      }}
                      style={{
                        width: '100%',
                        border: '1px solid #3a3a3a',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 2rem 0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        background: xi[i] ? '#2a2a2a' : '#1a1a1a',
                        color: xi[i] ? '#00d4ff' : '#e5e7eb',
                        fontWeight: xi[i] ? '500' : 'normal'
                      }}
                    />
                    
                    {xi[i] && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: '2rem', bottom: 0, display: 'flex', alignItems: 'center', padding: '0 0.75rem', pointerEvents: 'none', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#00d4ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                      <div 
                        ref={el => dropdownRefs.current[i] = el}
                        style={{ 
                          position: isMobile ? 'fixed' : 'absolute',
                          ...(isMobile ? {
                            left: '5%',
                            right: '5%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            maxWidth: '90%',
                            margin: '0 auto'
                          } : {
                            width: '100%',
                            marginTop: '0.25rem'
                          }),
                          zIndex: 9999, 
                          background: '#2a2a2a', 
                          border: '1px solid #3a3a3a', 
                          borderRadius: '0.5rem', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', 
                          maxHeight: isMobile ? '70vh' : '15rem', 
                          overflowY: 'auto'
                        }}>
                        {filteredPlayers.map(player => (
                          <div
                            key={player}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectPlayer(player, i);
                            }}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              selectPlayer(player, i);
                            }}
                            style={{ 
                              padding: '0.75rem 1rem', 
                              cursor: 'pointer', 
                              fontSize: '0.875rem', 
                              borderBottom: '1px solid #1a1a1a', 
                              color: '#e5e7eb',
                              background: '#2a2a2a'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#3a3a3a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#2a2a2a'}
                          >
                            {player}
                          </div>
                        ))}
                        
                        {filteredPlayers.length === 0 && searchTerms[i] && (
                          <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic' }}>
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
                              border: isSelected ? '2px solid ' + colors.text : '1px solid #3a3a3a',
                              background: isSelected ? colors.bg : '#2a2a2a',
                              color: isSelected ? colors.text : '#9ca3af',
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
        <span style={{ fontWeight: '500', color: xi.filter(Boolean).length === 11 ? '#10b981' : '#9ca3af' }}>
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
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '2px solid #00d4ff', borderRadius: '0.5rem', background: '#1a1a1a' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#e5e7eb' }}>Match Prediction</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#2a2a2a', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontWeight: '600', color: '#e5e7eb', minWidth: '120px' }}>{result.team1}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
            <div style={{ width: '100%', maxWidth: '12rem', background: '#3a3a3a', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
              <div 
                style={{ 
                  background: '#00d4ff', 
                  height: '100%', 
                  transition: 'width 0.5s',
                  width: `${result.team1_win_prob * 100}%`
                }}
              />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#00d4ff', minWidth: '4rem', textAlign: 'right' }}>
              {(result.team1_win_prob * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#2a2a2a', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontWeight: '600', color: '#e5e7eb', minWidth: '120px' }}>{result.team2}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
            <div style={{ width: '100%', maxWidth: '12rem', background: '#3a3a3a', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
              <div 
                style={{ 
                  background: '#0099ff', 
                  height: '100%', 
                  transition: 'width 0.5s',
                  width: `${result.team2_win_prob * 100}%`
                }}
              />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#0099ff', minWidth: '4rem', textAlign: 'right' }}>
              {(result.team2_win_prob * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#2a2a2a', borderRadius: '0.5rem', border: '2px solid #00d4ff' }}>
        <p style={{ textAlign: 'center', color: '#e5e7eb' }}>
          <span style={{ color: '#9ca3af' }}>Predicted Winner: </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00d4ff' }}>{winner}</span>
          <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>({(winnerProb * 100).toFixed(1)}%)</span>
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
      background: '#0a0a0a',
      padding: '2rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '900px'
      }}>
        <div style={{ 
          background: '#1a1a1a', 
          borderRadius: '1rem', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)', 
          padding: '2rem',
          border: '1px solid #2a2a2a'
        }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span>🏏</span>
            <span style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              IPL Match Predictor
            </span>
          </h1>

          {/* Teams Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>Team 1</label>
              <select 
                value={team1}
                onChange={e => {
                  setTeam1(e.target.value);
                  setXi1([]);
                  if (tossWinner === team1) setTossWinner("");
                }}
                style={{ width: '100%', border: '1px solid #3a3a3a', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#e5e7eb', background: '#2a2a2a' }}
              >
                <option value="" style={{ background: '#2a2a2a', color: '#e5e7eb' }}>Select Team 1</option>
                {TEAMS.map(t => (
                  <option key={t} value={t} disabled={t === team2} style={{ background: '#2a2a2a', color: '#e5e7eb' }}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>Team 2</label>
              <select 
                value={team2}
                onChange={e => {
                  setTeam2(e.target.value);
                  setXi2([]);
                  if (tossWinner === team2) setTossWinner("");
                }}
                style={{ width: '100%', border: '1px solid #3a3a3a', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#e5e7eb', background: '#2a2a2a' }}
              >
                <option value="" style={{ background: '#2a2a2a', color: '#e5e7eb' }}>Select Team 2</option>
                {TEAMS.map(t => (
                  <option key={t} value={t} disabled={t === team1} style={{ background: '#2a2a2a', color: '#e5e7eb' }}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>Venue</label>
            <select 
              value={venue}
              onChange={e => setVenue(e.target.value)}
              style={{ width: '100%', border: '1px solid #3a3a3a', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#e5e7eb', background: '#2a2a2a' }}
            >
              <option value="" style={{ background: '#2a2a2a', color: '#e5e7eb' }}>Select Venue</option>
              {VENUES.map(v => <option key={v} value={v} style={{ background: '#2a2a2a', color: '#e5e7eb' }}>{v}</option>)}
            </select>
          </div>

          {/* Toss Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>Toss Winner</label>
              <select 
                value={tossWinner}
                onChange={e => setTossWinner(e.target.value)}
                style={{ width: '100%', border: '1px solid #3a3a3a', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#e5e7eb', background: '#2a2a2a' }}
              >
                <option value="" style={{ background: '#2a2a2a', color: '#e5e7eb' }}>Select Toss Winner</option>
                {team1 && <option value={team1} style={{ background: '#2a2a2a', color: '#e5e7eb' }}>{team1}</option>}
                {team2 && <option value={team2} style={{ background: '#2a2a2a', color: '#e5e7eb' }}>{team2}</option>}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>Toss Decision</label>
              <select 
                value={tossDecision}
                onChange={e => setTossDecision(e.target.value)}
                style={{ width: '100%', border: '1px solid #3a3a3a', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem', color: '#e5e7eb', background: '#2a2a2a' }}
              >
                <option value="bat" style={{ background: '#2a2a2a', color: '#e5e7eb' }}>Bat First</option>
                <option value="field" style={{ background: '#2a2a2a', color: '#e5e7eb' }}>Field First</option>
              </select>
            </div>
          </div>

          {/* XI Selection */}
          {(team1 || team2) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {team1 && (
                <XIInputList
                  team={team1}
                  xi={xi1}
                  setXi={setXi1}
                  allPlayers={PLAYER_NAMES}
                  otherTeamXi={xi2}
                />
              )}

              {team2 && (
                <XIInputList
                  team={team2}
                  xi={xi2}
                  setXi={setXi2}
                  allPlayers={PLAYER_NAMES}
                  otherTeamXi={xi1}
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
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
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