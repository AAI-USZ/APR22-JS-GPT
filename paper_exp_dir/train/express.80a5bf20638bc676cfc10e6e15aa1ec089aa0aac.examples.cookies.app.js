

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer(


express.favicon(),


express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time' }),


express.cookieParser(),


express.bodyParser()
