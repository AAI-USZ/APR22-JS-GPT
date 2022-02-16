

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');



var RedisStore = require('connect-redis')(session);

var app = express();

app.use(logger('dev'));


app.use(session({ store: new RedisStore, secret: 'keyboard cat' }));

app.get('/', function(req, res){
