




var express = require('../..');

var app = express();

app.use(express.logger('dev'));


app.use(express.session({ secret: 'keyboard cat' }));

app.get('/', function(req, res){
var body = '';
if (req.session.views) {
++req.session.views;
