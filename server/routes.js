var path = require('path');
var cookieSession = require('cookie-session');
var controller = require('./controller');

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

  app.get('/team/:id', controller.queryTeam)
  app.get("/auth/oauth", controller.oauth);

  app.get("/getID", controller.getID);

  app.get("/auth/oauth/callback", controller.authorize);

  app.get("/myteams", controller.myTeams);

  app.get("/mymatchups", controller.myMatchups);

  app.get("/allmatchups", controller.allMatchups);

  app.get("/mystandings", controller.myStandings);

  app.get("/myteam", controller.myTeam);

  app.get("/myuser", controller.myUser);

  app.get("/myleagueteams", controller.myLeagueTeams);

};
