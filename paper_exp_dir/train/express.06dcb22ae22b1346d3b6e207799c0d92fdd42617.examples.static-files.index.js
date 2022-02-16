

var express = require('../..');
var logger = require('morgan');
var app = express();


app.use(logger('dev'));








app.use(express.static(__dirname + '/public'));







app.use('/static', express.static(__dirname + '/public'));
