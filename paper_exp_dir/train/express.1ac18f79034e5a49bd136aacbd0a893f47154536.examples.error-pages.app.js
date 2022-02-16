

require.paths.unshift(__dirname + '/../../support');



var express = require('./../../lib/express');

var app = express.createServer();


app.use(express.favicon());



app.use(express.logger({ format: '":method :url" :status' }));





app.use(app.router);








app.use(function(req, res, next){
next(new NotFound(req.url));
