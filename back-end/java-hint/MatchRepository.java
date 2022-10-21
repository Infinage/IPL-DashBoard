package com.kael.ipldashboard.repository;

import java.util.List;

import com.kael.ipldashboard.model.Match;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface MatchRepository extends CrudRepository<Match, Long>{
    
    @Query("SELECT m FROM Match m WHERE (m.firstInningsTeam = ?1 OR m.secondInningsTeam = ?1) AND YEAR(m.date) = ?2 ORDER BY m.date DESC")
    List<Match> findByTeamAndYear(@Param("team") String team, @Param("year") int year);
    
}
