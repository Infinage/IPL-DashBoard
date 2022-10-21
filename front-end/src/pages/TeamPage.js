import { React, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MatchDetailsBig from '../components/MatchDetailsBig';
import MatchDetailsSmall from '../components/MatchDetailsSmall';
import { PieChart } from 'react-minimal-pie-chart';

import './TeamPage.css';

function fetchLatestYear(team){

    let latestMatchYear = team.latestMatches[0].date.slice(0, 4);
    return latestMatchYear;

}

function TeamPage(){

    // useState() is a Hook that allows you to have state 
    // variables in functional components; It creates a method setTeam
    // When page loads, the team would be undefined and throw an error
    // So we define an empty object as its default value
    const [team, setTeam] = useState({
        'latestMatches': [],
        'wonMatches': [],
        'lostMatches': []
    });

    const {teamName} = useParams();

    // When `this` is loaded, run the function specified asynchronously
    useEffect(
        
        // the function to run
        () => {
            
            async function fetchData(url){
                const response = await fetch(url);
                const data = await response.json();
                setTeam(data);
            }
            
            // Can we pass the teamName without using backticks?
            fetchData(`${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}`);
        },

        // Second arg defiens -> When to run the function
        // if empty run when 'TeamPage' is loaded
        // If not specified, all changes will trigger the call -> it will run in an infinite loop
        [teamName]
    )

    // If default object is used or if the team is not found
    if (!team || !team.teamName){
        return (<h2 className='errorMessage'>Team Not Found!</h2>);
    }

    else{
        return (
            
            <div className="TeamPage">
                
                <div className='tname-section'>

                    <h2 className='tname'>{team.teamName}</h2>
                    
                    <div className='win-ratio-section'>
                    <p>{team.totalWins} Wins / {team.totalMatches} Matches</p>
                    <PieChart 
                    
                    data={[
                        {title:'Wins', value:team.totalWins, color:"#11d811"},
                        {title:'Loses', value:(team.totalMatches - team.totalWins), color:"#be0707"}
                    ]}
                    
                    // radius, viewBoxSize, center, linewidth are all relative sizes
                    radius={17}
                    viewBoxSize={[100, 35]}
                    center={[50, 15]}
                    lineWidth={50}

                    />
                    </div>
                    
                </div>

                <div className='big-details-section'>
                    <MatchDetailsBig firstTeam={teamName} match={team.latestMatches[0]}/>
                </div>

                {team.latestMatches.slice(1).map(match => 
                        <MatchDetailsSmall key={match.id} className='small-details-section' firstTeam={teamName} match={match} />
                )}

                <div className='more-section'>
                    <Link to={`/team/${teamName}/matches/${fetchLatestYear(team)}`}>More&gt;</Link>
                </div>

            </div>

        );
    }
}

export default TeamPage;