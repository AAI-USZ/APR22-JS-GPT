

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');



var RedisStore = require('connect-redis')(session);

var app = express();

app.use(logger('dev'));


app.use(session({
resave: false,
saveUninitialized: false,
secret: 'keyboard cat',
store: new RedisStore
}));

app.get('/', function(req, res){
var body = '';
if (req.session.views) {
