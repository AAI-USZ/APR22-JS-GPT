

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();




app.use(express.bodyParser());




app.use(express.methodOverride());

