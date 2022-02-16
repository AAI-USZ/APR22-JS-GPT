


var express = require('../../')
, app = module.exports = express()
, favicon = require('static-favicon')
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')







app.use(favicon());


if ('test' != process.env.NODE_ENV)
app.use(logger(':method :url'));
