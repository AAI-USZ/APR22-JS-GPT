

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var app = express.createServer(
express.cookieDecoder(),
express.session()
);
