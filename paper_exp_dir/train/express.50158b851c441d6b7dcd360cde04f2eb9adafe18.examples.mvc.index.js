

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = module.exports = express();




app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');


app.set('views', __dirname + '/views');



