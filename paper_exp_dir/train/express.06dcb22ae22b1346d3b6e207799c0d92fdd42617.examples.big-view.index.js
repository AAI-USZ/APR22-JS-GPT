

var express = require('../..');
var logger = require('morgan');
var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

var pets = [];

