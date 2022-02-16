

var express = require('../../');
var path = require('path');
var app = module.exports = express();
var logger = require('morgan');
var silent = 'test' == process.env.NODE_ENV;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.enable('verbose errors');



