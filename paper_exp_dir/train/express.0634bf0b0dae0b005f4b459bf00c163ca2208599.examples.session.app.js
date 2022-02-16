


var express = require('../../lib/express');

var app = express.createServer(
express.logger(),


express.cookieParser(),





express.session({ secret: 'keyboard cat' })
);

app.get('/', function(req, res){
