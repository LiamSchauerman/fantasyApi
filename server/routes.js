var path = require('path');
var fs = require('fs')
var cookieSession = require('cookie-session');

var FantasySports = require('fantasysports');
FantasySports.options({
  "accessTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_request_token",
  "requestTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_token",
  "oauthKey": "dj0yJmk9TFYzeWVhZHE5OXpBJmQ9WVdrOVIwOHpaVEE1TkhNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yNQ--",
  "oauthSecret": "c9f06a9871d777c5af8e539dd44808688b24e63a",
  "version": "1.0",
  "callback": "http://ec2-54-153-50-58.us-west-1.compute.amazonaws.com/auth/oauth/callback",
  "encryption": "HMAC-SHA1"
});

// app.get("/auth/oauth")
exports.oauth = function (req, res) {
  FantasySports.startAuth(req, res);
};

// app.get("/auth/oauth/callback")
exports.authorize = function (req, res) {
  FantasySports.endAuth(req, res);
};


exports.myTeams = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/leagues?format=json')
    .then(function (data) {
      console.log(data);
      var leagues = data.fantasy_content.users[0].user[1].games[0].game[1].leagues;
      var teams = {};
      for (var league in leagues) {
        if (league !== 'count') {
          leagueInfo = leagues[league].league[0];
          teams[leagueInfo.name] = {'league_key': leagueInfo.league_key};
          FantasySports
            .request(req, res)
            .api('http://fantasysports.yahooapis.com/fantasy/v2/league/' + leagueInfo.league_key + '/standings?format=json')
            .then(function (data) {
              for (key in data) {
                var team = data[key].team[0];
                if (team[3].is_owned_by_current_login) {
                  teams[leagueInfo.name].team_key = team[0].team_key;
                  teams[leagueInfo.name].name = team[2].name;
                  teams[leagueInfo.name].team_logo_url = team[5].team_logos[0].team_logo.url;
                  teams[leagueInfo.name].rank = key + 1
                }
              }
              var allSettled = true;
              for (team in teams) {
                allSettled = (teams[team].name) && allSettled;
              }
              if (allSettled) {
                res.json(teams)
              }
            })
        }
      }
    })

};

exports.getID = function (req, res) {
  FantasySports
    .request(req, res)
    .api("http://fantasysports.yahooapis.com/fantasy/v2/game/nba?format=json")
    .done(function (data) {
      console.log(data);
      res.json(data)
    });
};

// exports.myTeam = function(req, res) {
//     FantasySports
//         .request(req, res)
//         .api("http://fantasysports.yahooapis.com/fantasy/v2/team/TEAMKEY")
// }


exports.myMatchups = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/342.l.66969.t.1/matchups?format=json')
    .done(function (data) {

      var weeklyStats;
      var categoryCodes = {
        9004003: "FG%",
        9007006: "FT%",
        10: "3PTM",
        12: "PTS",
        13: "OREB",
        15: "REB",
        16: "AST",
        17: "STL",
        18: "BLK"
      }

      fc = data.fantasy_content;

      var teamResults = function () {
        // return an array of objects;
        var results = [];
        for (var week = 0; week < 10; week++) {
          weeklyStats = {};
          var matchupTotals = fc.team[1].matchups[week].matchup[0].teams[0].team[1].team_stats.stats;
          for (var i = 0; i < matchupTotals.length; i++) {
            weeklyStats[categoryCodes[matchupTotals[i].stat.stat_id]] = matchupTotals[i].stat.value;
          }
          results.push(weeklyStats)
        }
        return results;
      }

      var val = teamResults();

      res.json(val)
    });
};

exports.allMatchups = function (req, res) {
  var weeklyStats;
  var categoryCodes = {
    9004003: "FG%",
    9007006: "FT%",
    10: "3PTM",
    12: "PTS",
    13: "OREB",
    15: "REB",
    16: "AST",
    17: "STL",
    18: "BLK"
  }
  var fc;

  var allMatchups = {};
  var teamResults = function (fc) {
    // return an array of objects;
    var results = [];
    for (var week = 0; week < 10; week++) {
      weeklyStats = {};
      var matchupTotals = fc.team[1].matchups[week].matchup[0].teams[0].team[1].team_stats.stats;
      for (var i = 0; i < matchupTotals.length; i++) {
        weeklyStats[categoryCodes[matchupTotals[i].stat.stat_id]] = matchupTotals[i].stat.value;
      }
      results.push(weeklyStats)
    }
    return results;
  }

  var getTeamData = function (teamIndex, callback) {
    teamIndex = teamIndex || 1;
    FantasySports
      .request(req, res)
      .api('http://fantasysports.yahooapis.com/fantasy/v2/team/342.l.51871.t.' + teamIndex + '/matchups?format=json')
      .done(function (data) {
        fc = data.fantasy_content;
        console.log(fc);
        var val = teamResults(fc);
        allMatchups[teamIndex] = val;
        teamIndex++;
        if (teamIndex < 13) {
          getTeamData(teamIndex, callback);
        } else {
          callback();
        }
      });
  }

  getTeamData(1, function () {
    res.json(allMatchups);
  })
};

exports.myUser = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1?format=json')
    .done(function (data) {
      //var leagueData = data.fantasy_content.users[0].user[1].games[0].game[1].leagues

      //_.each(leagueData, function(value) {
      //    if (value.league) leagues.push(value.league[0]);
      //});
      //console.log('leagues', leagues);
      res.json(data);
    });
};

exports.myLeagueTeams = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/342.l.91924/teams?format=json')
    .done(function (data) {
      //var leagueData = data.fantasy_content.users[0].user[1].games[0].game[1].leagues

      //_.each(leagueData, function(value) {
      //    if (value.league) leagues.push(value.league[0]);
      //});
      //console.log('leagues', leagues);
      res.json(data);
    });
};

exports.myStandings = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/league/342.l.91924/standings?format=json')
    .done(function (data) {
      //var leagueData = data.fantasy_content.users[0].user[1].games[0].game[1].leagues
      var standings = data.fantasy_content.league[1].standings[0].teams;
      //    if (value.league) leagues.push(value.league[0]);
      //});
      //console.log('leagues', leagues);
      res.json(standings);
    });
};

exports.myTeam = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/342.l.91924.t.5?format=json')
    .done(function (data) {
      //var leagueData = data.fantasy_content.users[0].user[1].games[0].game[1].leagues
      var league;
      console.log('standings6', data.fantasy_content.league);
      console.log('standings7', data.fantasy_content.league);
      console.log('standings8', data.fantasy_content.league);
      //_.each(leagueData, function(value) {
      //    if (value.league) leagues.push(value.league[0]);
      //});
      //console.log('leagues', leagues);
      res.json(data);
    });
};

module.exports = function (app, express) {
  app.use(cookieSession({
    key: 'secretkey',
    secret: 'secretsecret',
    proxy: true
  }));
  // Use the client folder as the root public folder.
  // This allows client/index.html to be used on the / route.
  app.use(express.static(__dirname + '/../client'));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
    next();
  });

  // chrome extension hits this link to get info on all players
  // app.get("/api/init", function (req, res) {

  //     fs.readFile(__dirname + "/../data/playerjson.txt", function(err,data){
  //         var data = data + ''
  //         var data = JSON.parse(data);
  //         res.send(data);
  //     })

  // });

  // app.use('/', function (req, res, next) {
  //     res.header("Access-Control-Allow-Origin", "*");
  //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  //     next();
  // });
  app.get('/', function (req, res) {
    // console.log(__dirname + '/client/index.html')
    res.render('index.html')
  });

  app.get("/auth/oauth", exports.oauth);

  app.get("/getID", exports.getID);

  app.get("/auth/oauth/callback", exports.authorize);

  app.get("/myteams", exports.myTeams);

  app.get("/mymatchups", exports.myMatchups);

  app.get("/allmatchups", exports.allMatchups);

  app.get("/mystandings", exports.myStandings);

  app.get("/myteam", exports.myTeam);

  app.get("/myuser", exports.myUser);

  app.get("/myleagueteams", exports.myLeagueTeams);

};
