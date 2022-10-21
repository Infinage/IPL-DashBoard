package com.kael.ipldashboard.repository;

import com.kael.ipldashboard.model.Team;

import org.springframework.data.repository.CrudRepository;

public interface TeamRepository extends CrudRepository<Team, String> {
}
