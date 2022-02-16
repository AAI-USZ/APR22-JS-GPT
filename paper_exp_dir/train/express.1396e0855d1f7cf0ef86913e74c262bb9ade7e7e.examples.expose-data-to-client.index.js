
var express = require('../..')
, logger = require('morgan')
, app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

function User(name) {
this.private = 'heyyyy';
this.secret = 'something';
this.name = name;
