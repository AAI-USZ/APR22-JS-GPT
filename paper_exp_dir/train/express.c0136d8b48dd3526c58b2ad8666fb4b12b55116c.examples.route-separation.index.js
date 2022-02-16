

var express = require('../..');
var path = require('path');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var site = require('./site');
var post = require('./post');
var user = require('./user');

module.exports = app;



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

