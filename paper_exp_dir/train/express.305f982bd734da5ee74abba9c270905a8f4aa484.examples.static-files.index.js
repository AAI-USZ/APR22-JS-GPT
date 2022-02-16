

var express = require('../..');
var logger = require('morgan');
var path = require('path');
var app = express();


app.use(logger('dev'));








app.use(express.static(path.join(__dirname, 'public')));







app.use('/static', express.static(path.join(__dirname, 'public')));





app.use(express.static(path.join(__dirname, 'public', 'css')));
