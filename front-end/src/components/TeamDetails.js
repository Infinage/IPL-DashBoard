import { React } from 'react';
import { Link } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';

import "./TeamDetails.css"

function TeamDetails({team}){

    return (
        <div className="TeamDetails">
            
            <div className='fields'>
                <div className='field'>
                <h2 className="field-name">Team Name</h2>
                <h2 className='field-value'><Link to={`/team/${team.teamName}`}>{team.teamName}</Link></h2>
                </div>

                <div className='field'>
                <h2 className="field-name">Total Wins</h2>
                <h2 className='field-value'>{team.totalWins}</h2>
                </div>

                <div className='field'>
                <h2 className="field-name">Total Matches</h2>
                <h2 className='field-value'>{team.totalMatches}</h2>
                </div>
            </div>

            <div className='chart'>
            <PieChart 
                    
                    data={[
                        {title:'Wins', value:team.totalWins, color:"#11d811"},
                        {title:'Loses', value:(team.totalMatches - team.totalWins), color:"#be0707"}
                    ]}
                    
                    radius={30}
                    viewBoxSize={[65, 65]}
                    center={[30, 30]}
                    lineWidth={50}

            />
            </div>

        </div>
    );

}

export default TeamDetails;