

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = module.exports = express();





app.set('view engine', 'jade');


app.set('views', __dirname + '/views');



app.response.message = function(msg){
