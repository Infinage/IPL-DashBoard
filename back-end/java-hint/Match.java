package com.kael.ipldashboard.model;

import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Setter
@Getter
@Table(name="match")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Match implements Serializable{
    
    @Id 
    private Long id;
    
    private String city;
    private LocalDate date;
    private String playerOfMatch;
    private String venue;
    private String firstInningsTeam;
    private String secondInningsTeam;
    private String tossWinner;
    private String tossDecision;
    private String matchResult;
    private String resultMargin;
    private String umpire1;
    private String umpire2;
    private String winningTeamName;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="matchWinner", referencedColumnName="teamName")
    @JsonBackReference
    private Team matchWinner;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="matchLoser", referencedColumnName="teamName")
    @JsonBackReference
    private Team matchLoser;


}
