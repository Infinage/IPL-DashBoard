package com.kael.ipldashboard.controller;

import java.util.List;

import com.kael.ipldashboard.model.Match;
import com.kael.ipldashboard.model.Team;
import com.kael.ipldashboard.service.TeamAndMatchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// tells the controller that is okay if the request is made from another domain
@CrossOrigin 
@RestController
public class TeamController {

    @Autowired
    TeamAndMatchService teamAndMatchService;
    
    @RequestMapping(value="/team/{teamName}", method=RequestMethod.GET)
    public Team getTeam(@PathVariable String teamName){
        return teamAndMatchService.getTeamDetails(teamName);
    }

    @RequestMapping(value="/team/{teamName}/matches", method=RequestMethod.GET)
    public List<Match> getMatches(@PathVariable String teamName, @RequestParam int year){
        return teamAndMatchService.getMatches(teamName, year);        
    }

    @RequestMapping(value="/team", method=RequestMethod.GET)
    public List<Team> getTeams(){
        return teamAndMatchService.getTeams();
    }

}
