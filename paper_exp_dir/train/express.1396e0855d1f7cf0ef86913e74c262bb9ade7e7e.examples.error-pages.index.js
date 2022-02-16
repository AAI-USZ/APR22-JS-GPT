

var express = require('../../')
, app = module.exports = express()
, logger = require('morgan')
, favicon = require('static-favicon')
, silent = 'test' == process.env.NODE_ENV;


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');




app.enable('verbose errors');


