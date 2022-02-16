var express = require('../..');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = module.exports = express();




app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');
