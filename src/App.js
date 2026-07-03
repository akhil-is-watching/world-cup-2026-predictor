import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';
import predictionsData from './predictions.json';

function App() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sortBy, setSortBy] = useState('probability');
  const [confederation, setConfederation] = useState('all');

  const topTeams = useMemo(() => {
    return predictionsData.top_10_predictions.slice(0, 10);
  }, []);

  const allTeams = useMemo(() => {
    let teams = predictionsData.all_teams;
    
    const filterByConfederation = (team_name) => {
      const confederationMap = {
        'France': 'UEFA', 'Argentina': 'UEFA', 'Spain': 'UEFA', 'England': 'UEFA',
        'Brazil': 'CONMEBOL', 'Germany': 'UEFA', 'Netherlands': 'UEFA', 'Belgium': 'UEFA',
        'Portugal': 'UEFA', 'Italy': 'UEFA', 'Uruguay': 'CONMEBOL', 'Mexico': 'CONCACAF',
      };
      
      if (confederation === 'all') return true;
      return confederationMap[team_name] === confederation;
    };

    let filteredTeams = Object.keys(teams)
      .filter(filterByConfederation)
      .map(name => ({
        name,
        ...teams[name]
      }));

    if (sortBy === 'probability') {
      filteredTeams.sort((a, b) => b.win_probability - a.win_probability);
    } else if (sortBy === 'ranking') {
      filteredTeams.sort((a, b) => a.fifa_ranking - b.fifa_ranking);
    }

    return filteredTeams;
  }, [sortBy, confederation]);

  const chartData = topTeams.map(team => ({
    name: team.team.substring(0, 10),
    fullName: team.team,
    probability: team.win_probability_percent
  }));

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>⚽ FIFA World Cup 2026 Predictor</h1>
          <p className="subtitle">AI-Powered Championship Winner Predictions</p>
        </div>
      </header>

      <main className="container">
        <section className="tournament-info">
          <div className="info-card">
            <h3>📍 Tournament Details</h3>
            <p><strong>Location:</strong> Canada, Mexico, United States</p>
            <p><strong>Format:</strong> 48 teams, 12 groups of 4</p>
            <p><strong>Total Matches:</strong> 104</p>
          </div>
          <div className="info-card">
            <h3>📈 Model Information</h3>
            <p><strong>Methodology:</strong> Weighted Composite Analysis</p>
            <ul className="factors-list">
              <li>FIFA Ranking (35%)</li>
              <li>Recent Form (25%)</li>
              <li>Squad Strength (20%)</li>
            </ul>
          </div>
        </section>

        <section className="chart-section">
          <h2>🏆 Top 10 Championship Contenders</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="probability" fill="#3498db" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-section">
          <h2>📈 Top 10 Market Share</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="probability">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#16a085', '#c0392b', '#8e44ad'][index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rankings-section">
          <h2>📋 Full Team Rankings</h2>
          
          <div className="controls">
            <div className="filter-group">
              <label htmlFor="confederation">Filter by Confederation:</label>
              <select value={confederation} onChange={(e) => setConfederation(e.target.value)}>
                <option value="all">All</option>
                <option value="UEFA">UEFA (Europe)</option>
                <option value="CONMEBOL">CONMEBOL (South America)</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sort">Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="probability">Win Probability</option>
                <option value="ranking">FIFA Ranking</option>
              </select>
            </div>
          </div>

          <table className="rankings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Win %</th>
                <th>FIFA Rank</th>
                <th>Squad</th>
              </tr>
            </thead>
            <tbody>
              {allTeams.map((team, index) => (
                <tr key={team.name} onClick={() => setSelectedTeam(team)}>
                  <td className="rank">{index + 1}</td>
                  <td className="team-name">{team.name}</td>
                  <td className="probability"><strong>{team.win_probability}%</strong></td>
                  <td>{team.fifa_ranking}</td>
                  <td>{team.squad_strength}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="footer">
        <p>🌟 FIFA World Cup 2026 Prediction Model</p>
      </footer>

      {selectedTeam && (
        <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTeam(null)}>✗</button>
            <h3>{selectedTeam.name}</h3>
            <p><strong>Win Probability:</strong> {selectedTeam.win_probability}%</p>
            <p><strong>FIFA Ranking:</strong> #{selectedTeam.fifa_ranking}</p>
            <p><strong>Squad Strength:</strong> {selectedTeam.squad_strength}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
