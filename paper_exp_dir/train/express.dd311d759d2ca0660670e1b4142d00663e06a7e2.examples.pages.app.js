


var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');





app.use(app.router);








app.use(function(req, res, next){
next(new NotFound(req.url));
});
