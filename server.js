var express = require('express');
var http = require('http');
var routes = require('./server/routes.js');
var url = require('url');
app = express();
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/client');

routes(app, express);

var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log('Listening on port '+port);
});