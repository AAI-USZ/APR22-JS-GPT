

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');
