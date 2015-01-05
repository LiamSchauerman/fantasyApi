var express = require('express');
var http = require('http');
var routes = require('./server/routes.js');
var url = require('url');
app = express();
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/client');
routes(app, express);

app.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


var port = process.env.PORT || 8000;
app.listen(port, function(){
	console.log('Listening on port '+port);
});