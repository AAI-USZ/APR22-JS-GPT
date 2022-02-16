

var express = require('../..')
, hash = require('./pass').hash
, bodyParser = require('body-parser')
, cookieParser = require('cookie-parser')
, session = require('express-session')

var app = module.exports = express();



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

