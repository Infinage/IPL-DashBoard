import { React, useEffect, useState } from 'react';
import TeamDetails from '../components/TeamDetails';

import "./HomePage.css"

function HomePage(){

    const [teams, setTeams] = useState([]);

    useEffect(

        () => {

            async function fetchData(url){
                const response = await fetch(url);
                const data = await response.json();
                setTeams(data);
            }

            fetchData(`${process.env.REACT_APP_API_ROOT_URL}/team`);

        }, []
    )

    if (!teams.length){
        return (<h2 className='errorMessage'>Loading data from the Database. This may take a while, request your patience till then.</h2>);
    }
    
    return (
        <div className="HomePage">
            {teams.map(team => <TeamDetails key={team.teamName} team={team}/>)}
        </div>
    );
}

export default HomePage;