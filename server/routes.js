var path = require('path');
var cookieSession = require('cookie-session');
var controller = require('./controller');
var api = require('./api');

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
  app.use('/', function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      next();
  });
  app.get('/', function (req, res) {
    res.render('index.html')
  });

  app.get('/team/:id', controller.queryTeam);
  app.get('/matchups/:id', controller.getAllMatchupsForTeam )
  app.get('/matchup/:id/week/:week', controller.getMatchupByWeek);
  app.get('/allTeams', controller.allTeams);
  app.get("/auth/oauth", controller.oauth);

  app.get("/getID", controller.getID);
  app.get("/auth/oauth/callback", controller.authorize);

  app.get('/getTeam', function(req, res) {
    api.fetchTeam(req, res, 1, function(err, data){
        res.json(data);
    });
  });

  app.get('/getMatchups', function(req, res) {
      var week = 1;
      if (req.query && req.query.week) {
          week = req.query.week;
      }
      api.fetchMatchups(req, res, week, function(err, data){
        res.json(data);
    });
  });




  //
  //app.get("/myteams", controller.myTeams);
  //
  //app.get("/mymatchups", controller.myMatchups);
  //
  //app.get("/allmatchups", controller.allMatchups);
  //
  //app.get("/mystandings", controller.myStandings);
  //
  //app.get("/myteam", controller.myTeam);
  //
  //app.get("/myuser", controller.myUser);
  //
  //app.get("/myleagueteams", controller.myLeagueTeams);



};
