

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var silent = 'test' == process.env.NODE_ENV;


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');




app.enable('verbose errors');



