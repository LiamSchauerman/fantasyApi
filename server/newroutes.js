var controller = require('./controller');

app.get("/myteam", controller.myTeam);

app.get("/mystandings", exports.myStandings);

app.get("/myteam", exports.myTeam);

app.get("/myuser", exports.myUser);

app.get("/myleagueteams", exports.myLeagueTeams);
