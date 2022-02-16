

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


if ('test' != process.env.NODE_ENV)
app.use(logger(':method :url'));





app.use(cookieParser('my secret here'));
