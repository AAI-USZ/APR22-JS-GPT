



var express = require('../..');
var session = require('express-session');

var app = express();


app.use(session({
resave: false,
saveUninitialized: false,
secret: 'keyboard cat'
}));

app.get('/', function(req, res){
var body = '';
if (req.session.views) {
++req.session.views;
