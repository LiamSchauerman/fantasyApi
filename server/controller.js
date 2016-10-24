var fs = require('fs');

var FantasySports = require('fantasysports');
FantasySports.options({
  "accessTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_request_token",
  "requestTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_token",
  "oauthKey": "dj0yJmk9QmFJRnAxeG03VEhGJmQ9WVdrOVUzSnZlbVl6TjJVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD04OQ--",
  "oauthSecret": "f1831c0f5ee0cb5662c92ae50aa2a0766dfd1a2d",
  "version": "1.0",
  "callback": "http://whispering-headland-74504.herokuapp.com/auth/oauth/callback",
  "encryption": "HMAC-SHA1"
});

// app.get("/auth/oauth")
exports.oauth = function (req, res) {
  console.log('start auth');
  FantasySports.startAuth(req, res);
};

// app.get("/auth/oauth/callback")
exports.authorize = function (req, res) {
  console.log('end auth');
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
exports.allTeams = function (req, res) {
  var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871/teams?format=json';
  FantasySports.request(req, res).api(apiString).done(function (data) {
    res.json(data);
  })
};
exports.getMatchup = function (req, res) {
  var teamID = req.params.id || 1;
  var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871.t.' + teamID + '/matchups?format=json';
  FantasySports.request(req, res).api(apiString).done(function (data) {
    res.json(data);
  })
};
var matchupCache = {};
// $teamname
exports.getMatchupByWeek = function (req, res) {
  var teamID = req.params.id || 1;
  var week = req.params.week;
  var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871.t.' + teamID + '/matchups?format=json';
  console.log(apiString);
  FantasySports.request(req, res).api(apiString).done(function (data) {
    //var teamname = r[0].team[0][2].name;

    if (teamID == 1) {
      var r = data.fantasy_content.team[teamID].matchups[week - 1].matchup[0].teams;
      var teamname = r[0].team[0][2].name;
      var stats = r[0].team[1].team_stats.stats;

    } else {
      var teamname = data.fantasy_content.team[0][2].name;
      var stats = data.fantasy_content.team[1].matchups[week - 1].matchup[0].teams[0].team[1].team_stats.stats
    }
    res.json({teamname: teamname, stats: stats});
  })
};
var cache = {};

// teamID : {
// "0" : stats
//}
exports.getAllMatchupsForTeam = function (req, res) {
  var teamID = req.params.id || 1;
  weeks = 18;
  cache[teamID] = {};
  var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871.t.' + teamID + '/matchups?format=json';
  console.log(apiString);
  FantasySports.request(req, res).api(apiString).done(function (data) {

    for( var week = 1; week < weeks; week++){

      if (teamID == 1) {
        if(data.fantasy_content && data.fantasy_content.team && data.fantasy_content.team[teamID]){
          var r = data.fantasy_content.team[teamID].matchups[week - 1].matchup[0].teams;
          var teamname = r[0].team[0][2].name;
          var stats = r[0].team[1].team_stats.stats;

        }

      } else {
        var teamname = data.fantasy_content.team[0][2].name;
        var stats = data.fantasy_content.team[1].matchups[week - 1].matchup[0].teams[0].team[1].team_stats.stats
      }

      cache[teamID][week] = stats;
    }
    cache[teamID].teamname = teamname;

    res.json(cache);

  });
};
exports.myTeam = function (req, res) {
  FantasySports
    .request(req, res)
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.51871.t.1?format=json')
    .done(function (data) {
      res.json(data);
    });
};
function asyncLoop(start, lim, cb, doneCb) {
  var i = start;
  next();

  function next(e) {
    var curr = i;
    if (e)
      doneCb(e, i);
    else {
      i++;
      if (curr < lim) {
        cb(curr, next);
      } else {
        doneCb()
      }
    }
  }
};