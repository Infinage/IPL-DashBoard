const { StatusCodes } = require("http-status-codes");
const sqlite3 = require("sqlite3");

const teams = require("../data/slash-team.json");

const db = new sqlite3.Database("./data/ipl-data.db");

const getAllTeams = async (req, res) => {

    db.all("SELECT * FROM teams", (error, rows) => {
        if (error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error})
        } else {
            res.status(StatusCodes.OK).json(rows);
        }
    })
};

const getTeam = async (req, res) => {
    const {teamName} = req.params;
    let {pageNo, pageSize} = req.query;

    // By default we will display the latest 5 matches played by the team in the `latestMatches` field
    if (!pageNo) pageNo = 1;
    if (!pageSize) pageSize = 5;
    
    // Fetch the team details from DB
    let teamJson = await new Promise(function (resolve, reject){
        db.get("SELECT * FROM teams where teamName=?", teamName, (error, row) => {
            if (error){
                reject("An Error occured while fetching team details: " + error);
            } else {
                resolve(row)
            }
        })
    });

    // Let's us now fetch all the matches played by our team. We will be sorting all the matches retreived by date
    let matches = await new Promise(function (resolve, reject){
        db.all("SELECT * FROM matches WHERE winningTeamName=:teamName OR losingTeamName=:teamName ORDER BY date DESC", teamName, (error, rows) => {
            if (error){
                reject("An Error occured while fetching the match details: " + error);
            } else {
                resolve(rows);
            }
        });
    });

    if (teamJson){
        teamJson["latestMatches"] = matches.slice((pageNo - 1) * pageSize, pageNo * pageSize);
        teamJson["wonMatches"] = matches.filter(m => m.winningTeamName === teamName);
        teamJson["lostMatches"] = matches.filter(m => m.losingTeamName === teamName);
        res.status(StatusCodes.OK).json(teamJson);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({message: `Couldn't find ${teamName} in the database.`});
    }

};

const getMatchesByTeamAndYear = (req, res) => {
    const {teamName} = req.params;
    const {year: matchYear} = req.query;
    
    db.all("SELECT * FROM matches where (winningTeamName=?1 OR losingTeamName=?1) AND DATE(date) LIKE ?2", [teamName, matchYear + "%"], (error, rows) => {
        if (error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "An error occured fetching team matches by year: " + error})
        } else {
            res.status(StatusCodes.OK).json(rows);
        }
    })
};

module.exports = {getAllTeams, getTeam, getMatchesByTeamAndYear};