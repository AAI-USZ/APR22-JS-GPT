


var express = require('./../../lib/express'),
connect = require('connect'),
sys = require('sys');

var app = express.createServer(



connect.bodyDecoder(),




connect.methodOverride(),


connect.cookieDecoder(),



connect.session()
);

app.get('/', function(req, res){

var name = req.param('name') || '';


