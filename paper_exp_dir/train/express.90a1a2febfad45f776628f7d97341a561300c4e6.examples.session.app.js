


var express = require('./../../lib/express');

var app = express.createServer(
express.logger(),


express.cookieDecoder(),





express.session()
);

