var express = require('express');
var http = require('http');
var routes = require('./server/routes.js');
var url = require('url');
// var bodyParser  = require('body-parser'),
// var routes = require('server/routes.js');
app = express();
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('views', __dirname + '/client');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
routes(app, express);




var port = process.env.PORT || 8000;
app.listen(port, function(){
	console.log('Listening on port '+port);
});