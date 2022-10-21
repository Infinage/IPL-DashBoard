import { Link } from 'react-router-dom';
import "./MatchYears.css";

function MatchYears({ teamName, currentYear }) {

    const getYears = (startYear, endYear) => {
        const result = [];
        for (let i = endYear; i>=startYear; i--)
            result.push(i);
        return result;
    }
    
    const years = getYears(parseInt(currentYear) - 7, parseInt(currentYear) + 7);

    return (
        <div className="MatchYears">
            <ul>{years.map(yr => (

            <li key={yr}>
                <Link to={`/team/${teamName}/matches/${yr}`}>{yr}</Link>
            </li>
            
            ))}</ul>
        </div>
    );

}

export default MatchYears;