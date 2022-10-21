import './App.css';
import TeamPage from './pages/TeamPage';
import MatchPage from './pages/MatchPage';
import HomePage from './pages/HomePage';
import { HashRouter, Route, Routes } from 'react-router-dom';

/* Info Related to Backend

  * Two APIs (GET Method):

    - Team API: /team/{teamName}
      - Input: teamName (URL)
      - Output: Team

    - Match API: /team/{teamName}/matches
      - Input: teamName (URL), matchYear
      - Output: List of Matches
      
  * Team Entity Fields:
    - teamName
    - totalMatches
    - totalWins
    - latestMatches
    - wonMatches
    - lostMatches

  * Match Entity Fields
    - id
    - city
    - date
    - playerOfMatch
    - venue
    - firstInningsTeam
    - secondInningsTeam
    - tossWinner
    - tossDecision
    - matchResult
    - resultMargin
    - umpire1
    - umpire2
    - winningTeamName

*/

function App() {
  return (
    <div className="App">
      <h1 className='website-title'>IPL DashBoard</h1>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team/:teamName" element={<TeamPage/>} />
          <Route path="/team/:teamName/matches/:year" element={<MatchPage />} />
        </Routes> 
      </HashRouter>
    </div>
  );
}

export default App;
