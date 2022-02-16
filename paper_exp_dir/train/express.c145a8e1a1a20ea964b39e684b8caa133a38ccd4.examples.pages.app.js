


var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');

app.set('views', __dirname + '/views');



function NotFound(msg){
this.name = 'NotFound';
Error.call(this, msg);
Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);









app.error(function(err, req, res, next){
if (err instanceof NotFound) {
res.render('404.jade');
} else {
