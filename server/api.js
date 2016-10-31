// methods that will interact with the yahoo API
var FAMILY_LEAGUE_ID = 54295;
var FAMILY_LEAGUE_KEY = '364.l.54295';
var FantasySports = require('fantasysports');
var stat_id_map = {
    5: 'FG%',
    9004003: 'FG',
    8: 'FT%',
    9007006: 'FT',
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
    	// console.log(j);
    	// console.log(matchups[j]);
    	const teams = matchups[j]['0'].teams;
    	// console.log(teams);
    	// console.log(teams[0]);
    	for (var ind = 0; ind < 2; ind++) {
    		var team = teams[ind].team;
    		// console.log('INSIDE FOR LOOP');
    		var weekNumber = 'week' + team[1].team_stats.week;
    		// console.log(team[1]);
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
    console.log('INSIDE PROMISE');
    console.log(apiString);
    FantasySports.request(req, res).api(apiString)
        .done(function (data) {
            console.log('INSIDE PROMISE DONE');
            return cb(null, data);
  });
};
http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.%2054295/scoreboard
var fetchMatchups = function (req, res, week, cb) {
    var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.' + FAMILY_LEAGUE_ID + '/scoreboard;week=' + (week || 1) + '?format=json';
    console.log(apiString);
    FantasySports.request(req, res).api(apiString)
        .done(function (data) {
            console.log('INSIDE PROMISE DONE');
            var transformed = transformMatchupResponse(data);
            return cb(null, transformed);
  });
};
module.exports = {
  fetchTeam: fetchTeam,
  fetchMatchups: fetchMatchups,
};
