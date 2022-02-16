


var express = require('../../lib/express')
, http = require('http');

var app = express.createServer();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



