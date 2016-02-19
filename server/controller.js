var fs = require('fs')

var FantasySports = require('fantasysports');
FantasySports.options({
  "accessTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_request_token",
  "requestTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_token",
  "oauthKey": "dj0yJmk9a1NDQnBPREd1Q3E2JmQ9WVdrOU1ERklZMWhXTjJzbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hNg--",
  "oauthSecret": "000ac184dd8006b6071ea14bee64957aa03c20b5",
  "version": "1.0",
  "callback": "http://ec2-52-53-216-130.us-west-1.compute.amazonaws.com/auth/oauth/callback",
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

exports.queryTeam = function (req, res) {
  console.log(req.params);
  console.log(req.query);
  var teamID = req.params.id || 1;
  var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871.t.' + teamID + '?format=json'
  FantasySports.request(req, res).api(apiString).done(function (data) {
    res.json(data);
  })
};
exports.myTeam = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871.t.1?format=json')
    .done(function (data) {
      res.json(data);
    });
};