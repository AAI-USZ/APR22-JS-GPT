

require.paths.unshift(__dirname + '/../../support');



var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');





app.use(app.router);







