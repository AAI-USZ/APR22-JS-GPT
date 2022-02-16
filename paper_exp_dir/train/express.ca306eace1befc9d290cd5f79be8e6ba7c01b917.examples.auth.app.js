

var express = require('../..');
var hash = require('./pass').hash;
var bodyParser = require('body-parser');
var session = require('express-session');

var app = module.exports = express();



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
resave: false,
saveUninitialized: false,
secret: 'shhhh, very secret'
}));



app.use(function(req, res, next){
var err = req.session.error;
