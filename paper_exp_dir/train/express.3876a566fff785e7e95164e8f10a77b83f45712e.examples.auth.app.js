


var express = require('../../lib/express'),
crypto = require('crypto');

var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
