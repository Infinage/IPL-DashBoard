## IPL - Dashboard

![ipl-dashboard](https://ipl-dashboard.herokuapp.com/static/img/icons/android-chrome-384x384.png)

This App is Live on: https://ipl-dashboard.cyclic.app/

To run the application locally:

```
>> git clone https://github.com/Infinage/ipl-dashboard.git
>> cd ipl-dashboard
>> npm run build
>> npm run start
```

***

* Two APIs (GET Method):

    - Team API: /team
      - Output: List of Teams

    - Team API: /team/{teamName}?pageNo&pageSize
      - Input: teamName (URL)
      - Output: Team (populate latest 5 matches)

    - Match API: /team/{teamName}/matches?matchYear
      - Input: teamName (URL), matchYear (QUERY PARAM)
      - Output: List of Matches
      
* Team Entity Fields:
    - teamName (ID)
    - totalMatches
    - totalWins
    - wonMatches
    - lostMatches
    - latestMatches (dynamically created based on pageNo, pageSize sorted by Date)

* Match Entity Fields
    - id (ID)
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
    - matchWinner
    - matchLoser

***

Cricinfo - different conditions:

* Check out how tie works - 392190: https://stats.espncricinfo.com/ci/engine/match/392190.html
* Neutral Venue, Eliminator (Y) - 729315: https://stats.espncricinfo.com/ci/engine/match/729315.html
* Eliminator (NA), Winner (NA) - 829763: https://stats.espncricinfo.com/ci/engine/match/829763.html
* Method (DL) - 336022: https://stats.espncricinfo.com/ci/engine/match/336022.html
* Result (Tie) - 419121: https://stats.espncricinfo.com/ci/engine/match/419121.html 
* Result (NA) - 501265: https://stats.espncricinfo.com/ci/engine/match/501265.html
* Normal - 336000: https://stats.espncricinfo.com/ci/engine/match/336000.html

https://stats.espncricinfo.com/ci/engine/match/1254116.html


***

Medium guide on getting started with Sqlite3 db: https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4

DB Script:

```

CREATE TABLE teams (
    team_name TEXT UNIQUE NOT NULL PRIMARY KEY,
    total_matches INTEGER,
    total_wins INTEGER
);

CREATE TABLE matches (
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
    FOREIGN KEY(winningTeamName) REFERENCES teams(team_name) ON UPDATE CASCADE,
    FOREIGN KEY(losingTeamName) REFERENCES teams(team_name) ON UPDATE CASCADE
);

insert into MATCH (id, city, date, playerOfMatch, venue, firstInningsTeam, secondInningsTeam, tossWinner, tossDecision, matchResult, resultMargin, umpire1, umpire2, winningTeamName, losingTeamName) VALUES
('335989', '2008-04-23', 'Chennai Super Kings', 'Mumbai Indians', 'Chennai Super Kings', 'Mumbai Indians');

```

Sample Object: 

```
  id: '335982',
  city: 'Bangalore',
  date: '2008-04-18',
  player_of_match: 'BB McCullum',
  venue: 'M Chinnaswamy Stadium',
  neutral_venue: '0',
  team1: 'Royal Challengers Bangalore',
  team2: 'Kolkata Knight Riders',
  toss_winner: 'Royal Challengers Bangalore',
  toss_decision: 'field',
  winner: 'Kolkata Knight Riders',
  result: 'runs',
  result_margin: '140',
  eliminator: 'N',
  method: 'NA',
  umpire1: 'Asad Rauf',
  umpire2: 'RE Koertzen'
```

***

To allow interaction between front end and backend, just add cors() middleware. 
For REACT_ROOT_API use http://localhost:5000 instead of localhost:5000
