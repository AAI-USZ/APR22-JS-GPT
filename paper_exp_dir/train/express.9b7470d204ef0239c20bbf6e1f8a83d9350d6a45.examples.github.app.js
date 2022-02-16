

require.paths.unshift(__dirname + '/../../support');



var express = require('./../../lib/express'),
http = require('http');

var app = express.createServer();



app.set('views', __dirname + '/views');


