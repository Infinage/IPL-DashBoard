package com.kael.ipldashboard.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="team")
@Setter
@Getter
@Builder
@ToString(exclude={"wonMatches", "lostMatches"})
@NoArgsConstructor
@AllArgsConstructor
public class Team implements Serializable {

    @Id
    private String teamName;
    private Long totalMatches;
    private Long totalWins;

    @Transient
    private List<Match> latestMatches;

    @OneToMany(cascade=CascadeType.ALL, mappedBy="matchWinner")
    @JsonManagedReference
    private List<Match> wonMatches;

    @OneToMany(cascade=CascadeType.ALL, mappedBy="matchLoser")
    @JsonManagedReference
    private List<Match> lostMatches;

    public void addWonMatch(Match match){
        
        if (wonMatches == null)
            wonMatches = new ArrayList<Match>();

        wonMatches.add(match);
        match.setMatchWinner(this);
    }

    public void addLostMatch(Match match){

        if (lostMatches == null)
            lostMatches = new ArrayList<Match>();

        lostMatches.add(match);
        match.setMatchLoser(this);
    }
    
}
