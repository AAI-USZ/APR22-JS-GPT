


var express = require('./../../lib/express'),
sys = require('sys');

var app = express.createServer();




app.use(express.bodyDecoder());




app.use(express.methodOverride());


app.use(express.cookieDecoder());

