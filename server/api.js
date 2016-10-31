// methods that will interact with the yahoo API
var FAMILY_LEAGUE_ID = 54295;
var FantasySports = require('fantasysports');

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
    var apiString = 'http://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=nba.l.' + FAMILY_LEAGUE_ID + '/scoreboard:week=' + (week || 1) + '?format=json';
    console.log(apiString);
    FantasySports.request(req, res).api(apiString)
        .done(function (data) {
            console.log('INSIDE PROMISE DONE');
            return cb(null, data);
  });
};
module.exports = {
  fetchTeam: fetchTeam,
  fetchMatchups: fetchMatchups,
};
