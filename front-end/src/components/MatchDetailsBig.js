import { React } from 'react';
import { Link } from 'react-router-dom';

import "./MatchDetailsBig.css";

function MatchDetailsBig({firstTeam, match}) {

    if (!match) 
        return null;

    else{

        const secondTeam = (firstTeam === match.firstInningsTeam) ? 
        match.secondInningsTeam : match.firstInningsTeam;

        return (

            <div className={match.winningTeamName === firstTeam ? `MatchDetailsBig game-won`: `MatchDetailsBig game-lost`}>

                <div className='main-details'>
                
                <div>
                <span>vs </span>
                <h2><Link to={`/team/${secondTeam}`}>{secondTeam}</Link></h2>
                </div>

                <div>on {match.date} at {match.venue}, {match.city}.</div>

                <p>{firstTeam} {firstTeam === match.winningTeamName ? "won": "lost"} the match 
                by {match.resultMargin} {match.matchResult}</p>

                </div>

                <div className='additional-details'>

                <h3>Toss Winner &amp; decision</h3>
                <p>{match.tossWinner} chose to {match.tossDecision}</p>
                <h3>Umpires</h3>
                <p>{match.umpire1} &amp; {match.umpire2}</p>
                <h3>Player of the Match</h3>
                <p>{match.playerOfMatch}</p>

                </div>


            </div>
        );
    }
}

export default MatchDetailsBig;