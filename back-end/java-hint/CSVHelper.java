package com.kael.ipldashboard.data;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.HashMap;

import javax.annotation.PostConstruct;

import com.kael.ipldashboard.model.Match;
import com.kael.ipldashboard.model.Team;
import com.kael.ipldashboard.repository.MatchRepository;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CSVHelper {

    static private HashMap<String, Team> teamsCreated =  new HashMap<>();

    Logger logger = LogManager.getLogger(CSVHelper.class);

    @Autowired
    MatchRepository matchRepo;

    @PostConstruct
    public void init() throws IOException{
        
        BufferedReader fileReader =  new BufferedReader(new InputStreamReader(
            new FileInputStream("/media/Naresh/Self improvement/Study/Java Brains IPL Dashboard/SpringBoot-Backend/ipl-dashboard/src/main/resources/match-data.csv")));

        CSVParser csvParser = new CSVParser(
            fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim()
            );

        Iterable<CSVRecord> csvRecords = csvParser.getRecords();

        for (CSVRecord csvRecord: csvRecords){
            
            Match match = new Match();

            match.setId(Long.valueOf(csvRecord.get("id")));
            match.setCity(csvRecord.get("city"));
            match.setDate(LocalDate.parse(csvRecord.get("date")));
            match.setPlayerOfMatch(csvRecord.get("player_of_match"));
            match.setVenue(csvRecord.get("venue"));

            // **** CREATING AND firstInnings & secondInnings team based on tossDecision
            
            String firstInningsTeam, secondInningsTeam;
            
            if (csvRecord.get("toss_decision").equals("bat")){
            firstInningsTeam = csvRecord.get("toss_winner");
            secondInningsTeam = csvRecord.get("toss_winner").equals(csvRecord.get("team1")) ? 
            csvRecord.get("team2") : csvRecord.get("team1");
            }
            else{
            secondInningsTeam = csvRecord.get("toss_winner");
            firstInningsTeam = csvRecord.get("toss_winner").equals(csvRecord.get("team1")) ? 
            csvRecord.get("team2") : csvRecord.get("team1");
            }

            match.setFirstInningsTeam(firstInningsTeam);
            match.setSecondInningsTeam(secondInningsTeam);
            match.setWinningTeamName(csvRecord.get("winner"));

            // ********* ********* ********* ********* ********* *********
            // **** CREATING AND UPDATING THE WINNING / LOSING TEAMS

            String winningTeamName = csvRecord.get("winner");
            String losingTeamName = csvRecord.get("winner").equals(csvRecord.get("team1")) ? 
            csvRecord.get("team2") : csvRecord.get("team1");

            Team winningTeam = teamsCreated.getOrDefault(
                winningTeamName, 
                Team.builder().teamName(winningTeamName).totalWins(0L).totalMatches(0L).build()
                );

            Team losingTeam = teamsCreated.getOrDefault(
                losingTeamName, 
                Team.builder().teamName(losingTeamName).totalWins(0L).totalMatches(0L).build()
            );

            winningTeam.setTotalMatches(winningTeam.getTotalMatches() + 1);
            winningTeam.setTotalWins(winningTeam.getTotalWins() + 1);

            losingTeam.setTotalMatches(losingTeam.getTotalMatches() + 1);

            teamsCreated.put(winningTeamName, winningTeam);
            teamsCreated.put(losingTeamName, losingTeam);

            winningTeam.addWonMatch(match);
            losingTeam.addLostMatch(match);

            // ********* ********* ********* ********* ********* *********

            match.setTossWinner(csvRecord.get("toss_winner"));
            match.setTossDecision(csvRecord.get("toss_decision"));

            match.setMatchResult(csvRecord.get("result"));
            match.setResultMargin(csvRecord.get("result_margin"));
            match.setUmpire1(csvRecord.get("umpire1"));
            match.setUmpire2(csvRecord.get("umpire2"));

            matchRepo.save(match);

        }

        logger.info("Done extracting CSV contents to the Database");
        csvParser.close();
    }


}
