


var express = require('./../../lib/express'),
connect = require('connect');

var app = express.createServer(
connect.logger(),


connect.cookieDecoder(),





connect.session()
);

