

var express = require('../..');
var logger = require('morgan');
var vhost = require('vhost');





var main = express();

main.use(logger('dev'));

main.get('/', function(req, res){
res.send('Hello from main app!')
});

