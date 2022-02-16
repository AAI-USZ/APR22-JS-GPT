

var express = require('../..');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var site = require('./site');
var post = require('./post');
var user = require('./user');

