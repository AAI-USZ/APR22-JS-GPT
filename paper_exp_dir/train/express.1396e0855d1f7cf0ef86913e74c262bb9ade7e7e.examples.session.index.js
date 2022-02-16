




var express = require('../..');

var app = express();




app.use(express.cookieParser('keyboard cat'));


app.use(express.session());

app.get('/', function(req, res){
var body = '';
if (req.session.views) {
++req.session.views;
} else {
req.session.views = 1;
