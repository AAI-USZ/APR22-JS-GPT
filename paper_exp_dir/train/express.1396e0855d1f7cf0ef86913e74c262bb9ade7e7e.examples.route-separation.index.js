


var express = require('../..')
, app = express()
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, site = require('./site')
, post = require('./post')
, user = require('./user');



app.set('view engine', 'jade');
