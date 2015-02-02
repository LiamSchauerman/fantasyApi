var express = require('express');
var http = require('http');
var routes = require('./server/routes.js');
var url = require('url');
var mysql = require('mysql');
app = express();
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/client');

routes(app, express);
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'James90',
    database : 'fantasy'
  }
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
	console.log('Listening on port '+port);
});


console.log(knex.column("PTS","OREB").select().from("master"))