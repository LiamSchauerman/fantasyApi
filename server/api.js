// methods that will interact with the yahoo API
var FAMILY_LEAGUE_ID = 54295;
var FAMILY_LEAGUE_KEY = '364.l.54295';
var FantasySports = require('fantasysports');
var stat_id_map = {
    5: 'FG%',
    9004003: 'FGMA',
    8: 'FT%',
    9007006: 'FTMA',
    10: '3PTM',
    12: 'PTS',
    13: 'OREB',
    15: 'REB',
    16: 'AST',
    17: 'STL',
    18: 'BLK',
}

function transformMatchupResponse(response) {
    function getMatchupsFromResponse(resp) {
        var res = {};
        var matchups = resp.fantasy_content.leagues[0].league[1].scoreboard[0].matchups;
        Object.keys(matchups).forEach(function(i, index){
        	if (matchups[i].matchup) {
        		res[index] = matchups[i].matchup;
        	}
        })
        return res;
    }

    var matchups = getMatchupsFromResponse(response);
    var target = {};
    Object.keys(matchups).forEach(function(j) {
    	const teams = matchups[j]['0'].teams;
    	for (var ind = 0; ind < 2; ind++) {
    		var team = teams[ind].team;
    		var weekNumber = 'week' + team[1].team_stats.week;
    		var teamData = team[0];
    		var weekResults = team[1].team_stats.stats;
    		var teamName = teamData.filter(function(item){
    			return (item || {}).hasOwnProperty('name');
    		})[0].name.split(' ').join('');
            target[teamName] = {};
            target[teamName][weekNumber] = {};
    		weekResults.forEach(function(result){
    			var statId = result.stat.stat_id;
    			var value = result.stat.value;
    			target[teamName][weekNumber][stat_id_map[statId]] = value;
    		})
    	}
    });

    return target;
}

var fetchTeam = function (req, res, teamId, cb) {
    var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nba.l.' + FAMILY_LEAGUE_ID + '.t.' + (teamId || 1) + '?format=json';
    FantasySports.request(req, res).api(apiString)
        .done(function (data) {
            return cb(null, data);
  });
};
var fetchMatchups = function (req, res, week, cb) {
    // make first call
    // use weekCount to iterate
    // for each week
        // make an API call
        // format response
        // attach to matchupCache
    var data;
    var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.' + FAMILY_LEAGUE_ID + '/scoreboard;week=' + (week || 1) + '?format=json';
    FantasySports.request(req, res).api(apiString)
        .done(function (response) {
            console.log(JSON.stringify(response));
            data = transformMatchupResponse(response);
            var apiString2 = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.' + FAMILY_LEAGUE_ID + '/scoreboard;week=2?format=json';

            FantasySports.request(req, res).api(apiString2)
                .done(function (data2) {
                    var transformed2 = transformMatchupResponse(data2);
                    Object.keys(data).forEach(function(teamName) {
                        data[teamName].week2 = transformed2[teamName].week2
                    });
                    var apiString3 = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.' + FAMILY_LEAGUE_ID + '/scoreboard;week=3?format=json';

                    FantasySports.request(req, res).api(apiString3)
                        .done(function (data3) {
                            var transformed3 = transformMatchupResponse(data3);
                            Object.keys(data).forEach(function(teamName) {
                                data[teamName].week3 = transformed3[teamName].week3
                            });
                            var apiString4 = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.' + FAMILY_LEAGUE_ID + '/scoreboard;week=4?format=json';

                            FantasySports.request(req, res).api(apiString4)
                                .done(function (data4) {
                                    var transformed4 = transformMatchupResponse(data4);
                                    Object.keys(data).forEach(function(teamName) {
                                        data[teamName].week4 = transformed4[teamName].week4
                                    });
                                    return cb(null, data);
                            });
                  });
          });
  });
};
module.exports = {
  fetchTeam: fetchTeam,
  fetchMatchups: fetchMatchups,
};
