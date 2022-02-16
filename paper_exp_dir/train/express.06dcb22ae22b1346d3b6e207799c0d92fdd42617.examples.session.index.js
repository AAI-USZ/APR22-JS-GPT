



var express = require('../..');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();




app.use(cookieParser('keyboard cat'));


app.use(session());

