


var express = require('../../lib/express')
, crypto = require('crypto');

var app = express.createServer(
express.bodyParser()
, express.cookieParser()
, express.session({ secret: 'keyboard cat' })
);

app.set('views', __dirname + '/views');
