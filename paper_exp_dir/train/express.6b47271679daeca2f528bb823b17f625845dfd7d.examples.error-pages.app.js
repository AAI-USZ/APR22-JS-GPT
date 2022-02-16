

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.use(express.favicon());



app.use(express.logger('":method :url" :status'));





app.use(app.router);





app.use(function(req, res, next){

