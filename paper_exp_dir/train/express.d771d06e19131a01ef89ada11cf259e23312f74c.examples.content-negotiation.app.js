


var express = require('../../')
, app = express();

var users = [
{ name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
];

function provides(type) {
return function(req, res, next){
if (req.accepts(type)) return next();



next('route');
}
}



app.get('/users', provides('json'), function(req, res){
