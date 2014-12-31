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
app.use( express.static(__dirname) );



var port = process.env.PORT || 8000;
app.listen(port);
console.log('Listening on port '+port);
// console.log(__dirname);


app.get('/', function(req, res){
	// console.log(__dirname + '/client/index.html')
	res.render(__dirname + '/client/index.html')
})

// yf["66969"] (function cb(data) {
//     console.log(data)
//   }
// );