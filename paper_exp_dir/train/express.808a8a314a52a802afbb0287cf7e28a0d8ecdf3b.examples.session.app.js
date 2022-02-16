


var express = require('../../lib/express');

var app = express();

app.use(express.logger('dev'));




app.use(express.cookieParser('keyboard cat'));


app.use(express.session());

app.get('/', function(req, res){
var body = '';
if (req.session.views) {
