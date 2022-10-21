const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");

const scrapeToCSV = require("./cricinfo-scraper");

const filepath = "../data";
const filename = "match-data.csv";

const writeFromCSVToDB = async () => {

    // const db = new sqlite3.Database("./data/ipl-data.db");
    const db = new sqlite3.Database(":memory:");
    
    const csvFilePath = path.join(__dirname, filepath, filename);

    const teamFieldNames = ["teamName", "totalMatches", "totalWins"];
    const matchFieldNames = ["id", "city", "date", "playerOfMatch", "venue", "firstInningsTeam", "secondInningsTeam", "tossWinner", "tossDecision", "matchResult", "resultMargin", "umpire1", "umpire2", "winningTeamName", "losingTeamName"];

    let teams = {}, matches = [];

    if (!fs.existsSync(csvFilePath)){
        console.log("No match-data.csv found in path. The data would need to be scraped.");
        await scrapeToCSV();
    }

    fs.createReadStream(csvFilePath)
    .on("error", (err) => {throw new Error("Unspecified Error occured: " + err)})
    .pipe(csv())
    .on("data", (row) => {

        // Filter out just the required fields
        let {
            id, city, date, player_of_match: playerOfMatch, venue, toss_decision: tossDecision, 
            toss_winner: tossWinner, team1, team2, winner: winningTeamName, result: matchResult, 
            result_margin: resultMargin, umpire1, umpire2 
        } = row;

        // Calculate firstInnings, SecondInnings, losingTeam details
        let firstInningsTeam, secondInningsTeam, losingTeamName;

        if (tossDecision === "bat") {
            firstInningsTeam = tossWinner;
            secondInningsTeam = tossWinner === team1 ? team2: team1;
        } else {
            secondInningsTeam = tossWinner;
            firstInningsTeam = tossWinner === team1 ? team2: team1;
        }

        losingTeamName = winningTeamName === team1 ? team2: team1;

        {
            // Add winning team to the teams JSON object - Block created for easy undestanding

            let totalMatches = 1, totalWins = 1;

            if (winningTeamName in teams){

                totalMatches = teams[winningTeamName].totalMatches + 1;
                totalWins = teams[winningTeamName].totalWins + 1;
            }

            teams[winningTeamName] = {"teamName": winningTeamName, "totalMatches": totalMatches, "totalWins": totalWins}
        }

        {
            // Add losing team to the teams JSON object - Block created for easy undestanding

            let totalMatches = 1, totalWins = 0;

            if (losingTeamName in teams){
                totalMatches = teams[losingTeamName].totalMatches + 1;
                totalWins = teams[losingTeamName].totalWins;
            }

            teams[losingTeamName] = {"teamName": losingTeamName, "totalMatches": totalMatches, "totalWins": totalWins}

        }

        // Insert match details to the array for later DB write
        matches.push([id, city, date, playerOfMatch, venue, firstInningsTeam, secondInningsTeam, tossWinner, tossDecision, matchResult, resultMargin, umpire1, umpire2, winningTeamName, losingTeamName]);
    })

    .on("end", () => {

        // sqlite3 functions of the module used are run async, 
        // using seralize ensures that all db queries contained are run in sync
        db.serialize(() => {

            // Create tables
            db.exec(`
                CREATE TABLE IF NOT EXISTS teams (
                    teamName TEXT UNIQUE NOT NULL PRIMARY KEY,
                    totalMatches INTEGER,
                    totalWins INTEGER);

                CREATE TABLE IF NOT EXISTS matches (
                    id INTEGER UNIQUE NOT NULL PRIMARY KEY,
                    city TEXT,
                    date TEXT,
                    playerOfMatch TEXT ,
                    venue TEXT,
                    firstInningsTeam TEXT,
                    secondInningsTeam TEXT,
                    tossWinner TEXT,
                    tossDecision TEXT,
                    matchResult TEXT,
                    resultMargin INTEGER,
                    umpire1 TEXT,
                    umpire2 TEXT,
                    winningTeamName TEXT,
                    losingTeamName TEXT,
                    FOREIGN KEY(winningTeamName) REFERENCES teams(teamName) ON UPDATE CASCADE,
                    FOREIGN KEY(losingTeamName) REFERENCES teams(teamName) ON UPDATE CASCADE);
            `);

            // Reset the table data
            db.exec(`DELETE FROM matches; DELETE FROM teams;`)

            // Insert all teams we have gathered so far. Multiple entries require some coding gymnastics
            db.run(
                `INSERT INTO teams values ${("(" + teamFieldNames.map(ele => "?").join(", ") + ")").repeat(Object.keys(teams).length).replaceAll(")(", "),(")}`, 
                Object.values(teams).map(ele => Object.values(ele)).flat(), 
                (err) => {if (!err) {console.log(`Inserted ${Object.keys(teams).length} teams into the DB.`)} else throw new Error(err)} 
            );

            // Insert all matches we have gathered so far. Takes 3 args - query, data, callback
            db.run(
                `INSERT INTO matches (${matchFieldNames.join(", ")}) VALUES ${("(" + matchFieldNames.map(ele => "?").join(", ") + ")").repeat(matches.length).replaceAll(")(", "),(")}`,
                matches.flat(),
                (err) => {if (!err) {console.log(`Inserted ${matches.length} matches into the DB.`)} else throw new Error(err)}
            );

            // Finally we close the DB connection, if required we can create it again
            db.close((err) => {if (err) throw new Error(err)});
        });
    });

    // We are returning this DB so that we can listen to db.on("close") event to start the app if successful
    return db;

}

module.exports = writeFromCSVToDB;