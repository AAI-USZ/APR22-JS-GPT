

var express = require('../../');
var favicon = require('static-favicon');
var cookie-parser = require('cookie-parser');

var app = module.exports = express();


app.use(favicon());


app.use(cookieParser('manny is cool'));

