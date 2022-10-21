import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchDetailsBig from '../components/MatchDetailsBig';
import MatchYears from '../components/MatchYears';

import './MatchPage.css'

function MatchPage(){

    const {teamName, year} = useParams();

    const [matches, setMatches] = useState([]);

    useEffect(

        () => {
            async function fetchData(url, year){
                const response = await fetch(`${url}?year=${year}`);
                const data = await response.json();
                setMatches(data);
            }

            fetchData(`${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}/matches`, year)
        },

        [teamName, year]
    )

    if (matches.length === 0){
        return (
            <div className='MatchPage'>
                <h2 className='errorMessage'>No match data found for the year</h2>
                <MatchYears teamName={teamName} currentYear={year}/>
            </div>    
        );
    }

    else{
        return (
            <div className='MatchPage'>
                <h2 className='tname'>{teamName} records for the year {year}</h2>
                <MatchYears teamName={teamName} currentYear={year}/>
                {matches.map(m => <MatchDetailsBig key={m.id} firstTeam={teamName} match={m} />)}
            </div>
        );
    }
}

export default MatchPage;