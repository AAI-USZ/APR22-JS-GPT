


var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
res.render('index.jade');
});

function NotFound(msg){
