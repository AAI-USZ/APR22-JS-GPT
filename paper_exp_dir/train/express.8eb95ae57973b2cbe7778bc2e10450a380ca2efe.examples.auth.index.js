

var express = require('../..');
var bodyParser = require('body-parser');
var hash = require('pbkdf2-password')()
var path = require('path');
var session = require('express-session');

var app = module.exports = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
