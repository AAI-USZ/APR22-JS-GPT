

var express = require('../..');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var site = require('./site');
var post = require('./post');
var user = require('./user');



app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
