import { React } from 'react';
import { Link } from 'react-router-dom';

import './MatchDetailsSmall.css';

function MatchDetailsSmall({firstTeam, match}) {

    if (!match) return null;

    else{

        const secondTeam = (firstTeam === match.firstInningsTeam) ? 
        match.secondInningsTeam : match.firstInningsTeam;
    
        return (
            <div className={match.winningTeamName === firstTeam ? `MatchDetailsSmall game-won`: `MatchDetailsSmall game-lost`}>
                
                <div className='opposing-team'>
                <span>vs </span>
                <span><Link to={`/team/${secondTeam}`}>{secondTeam}</Link></span>
                </div>

                <p>{firstTeam === match.winningTeamName ? "Won": "Lost"} the match 
                by {match.resultMargin} {match.matchResult}</p>
            </div>
        );
    }
}

export default MatchDetailsSmall;