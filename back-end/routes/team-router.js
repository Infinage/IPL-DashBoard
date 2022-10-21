const express = require("express");

const {getAllTeams, getTeam, getMatchesByTeamAndYear} = require("../controllers/team-controller");

const teamRouter = express.Router();

teamRouter.get("/team", getAllTeams);
teamRouter.get("/team/:teamName", getTeam);
teamRouter.get("/team/:teamName/matches", getMatchesByTeamAndYear);

module.exports = teamRouter;