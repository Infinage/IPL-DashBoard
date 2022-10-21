package com.kael.ipldashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.kael.ipldashboard.model.Match;
import com.kael.ipldashboard.model.Team;
import com.kael.ipldashboard.repository.MatchRepository;
import com.kael.ipldashboard.repository.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeamAndMatchService {

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    MatchRepository matchRepository;

    // We implement pagination ourselves to fetch just the required number of records
    public Team getTeamDetails(String teamName, int pageNo, int pageSize) {

        Team team = teamRepository.findById(teamName).orElse(null);

        List<Match> result = new ArrayList<Match>();
        
        result.addAll(team.getWonMatches());
        result.addAll(team.getLostMatches());

        // Reverse sort to get the latest matches
        result.sort((m1, m2) -> {
            
            LocalDate d1 = m1.getDate();
            LocalDate d2 = m2.getDate();

            if (d1.isBefore(d2))
                return 1;
            else if (d1.isAfter(d2))
                return -1;
            else
                return 0;

        });

        int start = pageNo * pageSize;
        int end = start + pageSize + 1;
        result = result.subList(start, end);

        team.setLatestMatches(result);

        return team;
    }

    // By default, fetch the first four values
    public Team getTeamDetails(String teamName) {
        return getTeamDetails(teamName, 0, 4);
    }

    public List<Match> getMatches(String team, int year) {
        return matchRepository.findByTeamAndYear(team, year);
    }

    public List<Team> getTeams() {
        List<Team> result = new ArrayList<>();
        teamRepository.findAll().forEach(result::add);
        return result;
    }
    
}
