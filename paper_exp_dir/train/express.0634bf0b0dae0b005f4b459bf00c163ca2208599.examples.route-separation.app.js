


var express = require('../../lib/express')
, app = express.createServer()
, site = require('./site')
, post = require('./post')
, user = require('./user');



app.set('view engine', 'ejs');
